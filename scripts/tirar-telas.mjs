// ── SCREENSHOT DAS TELAS DO JOGO [sessão 084, D062] ──────────────────────────
// Resolve o que travava a verificação visual desde o D034: sem uma janela
// sendo pintada, o navegador não roda `requestAnimationFrame`, o framer-motion
// congela a tela no estado inicial da animação e nenhuma captura presta.
//
// Duas peças resolvem isso:
//   1. `&still=1` (só em DEV) desliga a animação de entrada — ver
//      `STILL_MODE` em `src/components/ui/index.jsx`.
//   2. Este script fala o protocolo de DevTools direto com o Chrome, em vez
//      de usar `--screenshot` na linha de comando. O `--screenshot` captura a
//      JANELA (que vem com uns pixels de moldura, cortando a direita da
//      página); pelo protocolo dá pra fixar o viewport exato do aparelho.
//
// USO (com `npm run dev` rodando):
//   node scripts/tirar-telas.mjs                          # telas do resumo
//   node scripts/tirar-telas.mjs "screen=menu" menu       # uma tela só
//
// Saída: pasta `telas/` na raiz (ignorada pelo Git).
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const DEST = join(RAIZ, 'telas');
const BASE = 'http://localhost:3000';
const PORTA = 9222;
// iPhone 14 Pro: é o formato em que o jogo é jogado de verdade.
const LARGURA = 393;
const ALTURA = 852;
const ESCALA = 2;

const CAMINHOS = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
];

const TELAS = [
  ['screen=results&full=1&page=0', 'resumo-1-pontuacao'],
  ['screen=results&full=1&page=1', 'resumo-2-xp'],
  ['screen=results&full=1&page=2', 'resumo-3-missoes'],
  ['screen=results&full=1&page=3', 'resumo-4-ofensiva'],
  ['screen=results&full=1&page=4', 'resumo-ocasional-meta'],
  ['screen=results&full=1&page=5', 'resumo-ocasional-faixa'],
  ['screen=results&full=1&page=6', 'resumo-5-conquistas'],
  ['screen=results&full=1&page=7', 'resumo-6-bau-mistico'],
  ['screen=results&full=1&page=8', 'resumo-6-vida-extra'],
  ['screen=results&full=1&page=9', 'resumo-6-congelar'],
  ['screen=results&full=1&page=10', 'resumo-6-seguro-ofensiva'],
  ['screen=results&full=1&page=11', 'resumo-6-pocao-1'],
  ['screen=results&page=4', 'resumo-6-nada-desta-vez'],
];

const espera = (ms) => new Promise((r) => setTimeout(r, ms));

class CDP {
  constructor(ws) {
    this.ws = ws;
    this.id = 0;
    this.pendentes = new Map();
    ws.addEventListener('message', (ev) => {
      const msg = JSON.parse(ev.data);
      const p = this.pendentes.get(msg.id);
      if (p) {
        this.pendentes.delete(msg.id);
        msg.error ? p.rej(new Error(msg.error.message)) : p.res(msg.result);
      }
    });
  }

  enviar(metodo, params = {}, sessionId) {
    const id = ++this.id;
    return new Promise((res, rej) => {
      this.pendentes.set(id, { res, rej });
      this.ws.send(JSON.stringify({ id, method: metodo, params, sessionId }));
    });
  }
}

async function main() {
  const args = process.argv.slice(2);
  const lista = args.length ? [[args[0], args[1] || 'tela']] : TELAS;

  const chrome = CAMINHOS.find((c) => existsSync(c));
  if (!chrome) throw new Error('Chrome/Edge não encontrado');

  const resp = await fetch(BASE).catch(() => null);
  if (!resp) throw new Error(`Servidor não responde em ${BASE} — rode "npm run dev" antes`);

  mkdirSync(DEST, { recursive: true });
  const perfil = join(tmpdir(), 'tabuada-rush-telas-' + Date.now());

  const proc = spawn(chrome, [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    `--remote-debugging-port=${PORTA}`,
    `--user-data-dir=${perfil}`,
    'about:blank',
  ], { stdio: 'ignore' });

  try {
    let versao = null;
    for (let i = 0; i < 50 && !versao; i++) {
      versao = await fetch(`http://127.0.0.1:${PORTA}/json/version`).then((r) => r.json()).catch(() => null);
      if (!versao) await espera(200);
    }
    if (!versao) throw new Error('Chrome não abriu a porta de depuração');

    const ws = new WebSocket(versao.webSocketDebuggerUrl);
    await new Promise((r, j) => { ws.addEventListener('open', r); ws.addEventListener('error', j); });
    const cdp = new CDP(ws);

    const { targetId } = await cdp.enviar('Target.createTarget', { url: 'about:blank' });
    const { sessionId } = await cdp.enviar('Target.attachToTarget', { targetId, flatten: true });

    await cdp.enviar('Page.enable', {}, sessionId);
    await cdp.enviar('Emulation.setDeviceMetricsOverride', {
      width: LARGURA, height: ALTURA, deviceScaleFactor: ESCALA, mobile: true,
    }, sessionId);

    // Espera CONTEÚDO, não tempo fixo: em DEV o Vite serve centenas de
    // módulos soltos e a primeira navegação demora bem mais que as outras —
    // com espera fixa a primeira tela saía em branco.
    const esperarConteudo = async () => {
      for (let i = 0; i < 60; i++) {
        const { result } = await cdp.enviar('Runtime.evaluate', {
          expression: `document.readyState === 'complete'
            && !!document.querySelector('h1')
            && [...document.images].every((i) => i.complete)`,
          returnByValue: true,
        }, sessionId);
        if (result.value) return true;
        await espera(200);
      }
      return false;
    };

    for (const [query, nome] of lista) {
      await cdp.enviar('Page.navigate', { url: `${BASE}/?${query}&still=1` }, sessionId);
      const ok = await esperarConteudo();
      if (!ok) console.log(`  (aviso) ${nome}: conteúdo não apareceu a tempo`);
      await espera(250); // respiro pro layout assentar depois das imagens
      const { data } = await cdp.enviar('Page.captureScreenshot', { format: 'png' }, sessionId);
      writeFileSync(join(DEST, `${nome}.png`), Buffer.from(data, 'base64'));
      console.log('  ' + nome + '.png');
    }

    ws.close();
    console.log('Pronto: ' + DEST);
  } finally {
    proc.kill();
  }
}

main().catch((e) => { console.error('ERRO:', e.message); process.exit(1); });
