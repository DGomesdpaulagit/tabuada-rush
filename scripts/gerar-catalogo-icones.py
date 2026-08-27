# -*- coding: utf-8 -*-
"""Gera a pagina visual do catalogo de icones, com os PNGs embutidos em base64."""
import base64, io, os

REPO = r'C:\Users\HP\Documents\TabuadaRush - jogo'
ICONS_DIR = os.path.join(REPO, 'src', 'assets', 'icons')
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'catalogo-icones.html')

GRUPOS = [
    ('Barra lateral', 'Sidebar.jsx', [
        ('arena', 'Arena', 'tela principal de jogo'),
        ('liga', 'Ligas', 'aba de divisões'),
        ('missoes', 'Missões', 'aba de missões'),
        ('loja', 'Loja', 'aba da loja'),
        ('mochila', 'Mochila', 'inventário'),
    ]),
    ('Header', 'barra de status no topo', [
        ('ofensiva', 'Ofensiva acesa', 'Header, Menu, Perfil, resumo'),
        ('ofensiva-congelada', 'Ofensiva congelada', 'Header, Loja — NÃO é escudo'),
        ('moedas', 'Moedas', 'Header, Loja, Missões'),
        ('vidas', 'Vidas', 'Header, durante a partida'),
        ('xp', 'XP', 'Header, Perfil, resumo'),
        ('dia-feito', 'Dia jogado', 'calendário do Header e da pág. 4'),
        ('dia-congelado', 'Dia congelado', 'calendário do Header'),
        ('dia-vazio', 'Dia não jogado', 'calendário do Header e da pág. 4'),
    ]),
    ('Ligas e pódio', 'RankingPage.jsx', [
        ('liga-bronze', 'Bronze', 'divisão 1'),
        ('liga-prata', 'Prata', 'divisão 2'),
        ('liga-ouro', 'Ouro', 'divisão 3'),
        ('liga-safira', 'Safira', 'divisão 4'),
        ('liga-rubi', 'Rubi', 'divisão 5'),
        ('liga-esmeralda', 'Esmeralda', 'divisão 6'),
        ('liga-ametista', 'Ametista', 'divisão 7'),
        ('liga-perola', 'Pérola', 'divisão 8'),
        ('liga-obsidiana', 'Obsidiana', 'divisão 9'),
        ('liga-diamante', 'Diamante', 'divisão 10'),
        ('divisao-bloqueada', 'Divisão bloqueada', 'escada de divisões'),
        ('posicao-1', '1º lugar', 'classificação da liga'),
        ('posicao-2', '2º lugar', 'classificação da liga'),
        ('posicao-3', '3º lugar', 'classificação da liga'),
        ('podio', 'Pódio', 'Menu, Perfil, Estatísticas'),
    ]),
    ('Missões', 'MissionsPage.jsx', [
        ('missao-diaria', 'Missões diárias', 'cabeçalho da aba'),
        ('missao-mensal', 'Desafios mensais', 'cabeçalho da aba'),
        ('missao-tipo-partidas', 'Tipo: partidas', 'missão play'),
        ('missao-tipo-precisao', 'Tipo: precisão', 'accuracy, streak, correct_*'),
        ('missao-tipo-pontuacao', 'Tipo: pontuação', 'missão score'),
        ('missao-travada', 'Missão travada', 'aba Missões'),
        ('resumo-acertos', 'Acertos', 'resumo pós-partida, págs. 1, 2 e 3'),
        ('resumo-erros', 'Erros', 'resumo pós-partida, pág. 1'),
    ]),
    ('Loja', 'power-ups e poções', [
        ('pu-vida-extra', 'Vida Extra', '80 moedas'),
        ('pu-congelar', 'Congelar Missão', '50 moedas'),
        ('pu-largada', 'Largada Turbo', '90 moedas'),
        ('pu-tempo', '+60s no relógio', '120 moedas'),
        ('pu-escudo', 'Escudo', '100 moedas'),
        ('ofensiva-congelada', 'Seguro de Ofensiva', '100 moedas — mesma arte do Header'),
        ('pocao-xp-1', 'Poção ×1,5', 'tubo de ensaio'),
        ('pocao-xp-2', 'Poção ×2', 'erlenmeyer'),
        ('pocao-xp-3', 'Poção ×3', 'frasco redondo'),
    ]),
    ('Baús', 'Mochila e recompensas', [
        ('bau-madeira', 'Madeira — fechado', '10 a 100 moedas'),
        ('bau-ferro', 'Ferro — fechado', '200 a 400 moedas'),
        ('bau-ouro', 'Ouro — fechado', '500 a 800 moedas'),
        ('bau-mistico', 'Místico — fechado', '1.000 moedas'),
        ('bau-madeira-aberto', 'Madeira — aberto', 'página de recompensa'),
        ('bau-ferro-aberto', 'Ferro — aberto', 'página de recompensa'),
        ('bau-ouro-aberto', 'Ouro — aberto', 'página de recompensa'),
        ('bau-mistico-aberto', 'Místico — aberto', 'página de recompensa'),
        ('bau-moedas', 'Baú com moedas', 'reserva, sem uso hoje'),
    ]),
    ('Combo recurso + baú', 'resumo pós-partida, página 6', [
        ('combo-congelar', 'Congelar + Madeira', 'recompensa'),
        ('combo-vida-extra', 'Vida Extra + Madeira', 'recompensa'),
        ('combo-largada', 'Largada + Ferro', 'recompensa'),
        ('combo-pocao-1', 'Poção ×1,5 + Ferro', 'recompensa'),
        ('combo-tempo', '+60s + Ouro', 'recompensa'),
        ('combo-escudo', 'Escudo + Ouro', 'recompensa'),
        ('combo-pocao-2', 'Poção ×2 + Ouro', 'recompensa'),
        ('combo-pocao-3', 'Poção ×3 + Místico', 'recompensa'),
        ('combo-seguro-ofensiva', 'Seguro de Ofensiva + Ouro', 'recompensa'),
        ('trofeu', 'Troféu', 'págs. 1 e 5 do resumo'),
        ('bau-vazio', 'Baú vazio (com moscas)', 'página "Nada desta vez"'),
    ]),
]

FUNDOS = [
    ('fundo-bau-madeira', 'Baú de Madeira'), ('fundo-bau-ferro', 'Baú de Ferro'),
    ('fundo-bau-ouro', 'Baú de Ouro'), ('fundo-bau-mistico', 'Baú Místico'),
    ('fundo-vida-extra', 'Vida Extra'), ('fundo-congelar', 'Congelar Missão'),
    ('fundo-largada', 'Largada Turbo'), ('fundo-tempo', '+60s no relógio'),
    ('fundo-escudo', 'Escudo'), ('fundo-pocao-1', 'Poção ×1,5'),
    ('fundo-pocao-2', 'Poção ×2'), ('fundo-pocao-3', 'Poção ×3'),
    ('fundo-seguro-ofensiva', 'Seguro de Ofensiva'),
]

FALTANDO = [
    ('Ícones das 26 conquistas', 'Aba Conquistas', 'emoji — sem plano de troca ainda'),
    ('Badges das 28 faixas de tabuada', 'Faixa / progressão', 'emoji — sem plano de troca ainda'),
]


def b64(nome, pasta=None, ext='.png'):
    with open(os.path.join(pasta or ICONS_DIR, nome + ext), 'rb') as f:
        return base64.b64encode(f.read()).decode('ascii')


cards_total = len(set(n for g in GRUPOS for n, _, _ in g[2]))  # unicos: o Seguro aparece em 2 grupos
secoes = []
for titulo, sub, itens in GRUPOS:
    cards = []
    for nome, rotulo, onde in itens:
        cards.append(
            '        <button class="card" data-busca="%s %s %s" data-nome="%s">\n'
            '          <span class="tile"><img src="data:image/png;base64,%s" alt="%s" loading="lazy"></span>\n'
            '          <span class="rotulo">%s</span>\n'
            '          <code>%s</code>\n'
            '          <span class="onde">%s</span>\n'
            '        </button>' % (
                nome.lower(), rotulo.lower(), onde.lower(), nome, b64(nome), rotulo, rotulo, nome, onde)
        )
    secoes.append(
        '      <section class="grupo">\n'
        '        <h2>%s <span class="sub">%s</span> <span class="contagem">%d</span></h2>\n'
        '        <div class="grade">\n%s\n        </div>\n'
        '      </section>' % (titulo, sub, len(itens), '\n'.join(cards))
    )

FUNDOS_DIR = os.path.join(REPO, 'src', 'assets', 'fundos')
fundos_html = '\n'.join(
    '        <figure class="fundo">\n'
    '          <img src="data:image/jpeg;base64,%s" alt="%s" loading="lazy">\n'
    '          <figcaption>%s<code>%s.jpg</code></figcaption>\n'
    '        </figure>' % (b64(n, FUNDOS_DIR, '.jpg'), r, r, n)
    for n, r in FUNDOS
)

faltando_html = '\n'.join(
    '          <li><strong>%s</strong><span>%s</span><em>%s</em></li>' % f for f in FALTANDO
)

HTML = """<title>Ícones do Tabuada Rush</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Nunito:wght@400;600;700;900&family=JetBrains+Mono:wght@500&display=swap">
<style>
  :root {
    --ground: #F6F3FC;
    --surface: #FFFFFF;
    --tile: #EFEAF8;
    --linha: #E2DAF2;
    --tinta: #251C38;
    --tinta-fraca: #6B6285;
    --violeta: #6E3BEF;
    --moeda: #E9A400;
    --sombra: 0 1px 2px rgba(37, 28, 56, .06), 0 8px 24px -16px rgba(37, 28, 56, .3);
  }
  @media (prefers-color-scheme: dark) {
    :root:not([data-theme="light"]) {
      --ground: #16121F;
      --surface: #1F1930;
      --tile: #282040;
      --linha: #322949;
      --tinta: #F3EFFB;
      --tinta-fraca: #A79BC4;
      --violeta: #A98BFF;
      --moeda: #FFC53D;
      --sombra: 0 1px 2px rgba(0, 0, 0, .4), 0 8px 24px -16px rgba(0, 0, 0, .8);
    }
  }
  :root[data-theme="dark"] {
    --ground: #16121F;
    --surface: #1F1930;
    --tile: #282040;
    --linha: #322949;
    --tinta: #F3EFFB;
    --tinta-fraca: #A79BC4;
    --violeta: #A98BFF;
    --moeda: #FFC53D;
    --sombra: 0 1px 2px rgba(0, 0, 0, .4), 0 8px 24px -16px rgba(0, 0, 0, .8);
  }

  * { box-sizing: border-box; }
  body {
    margin: 0;
    background: var(--ground);
    color: var(--tinta);
    font-family: Nunito, "Segoe UI", system-ui, sans-serif;
    font-weight: 600;
    line-height: 1.5;
  }
  .capa {
    padding: 40px 24px 24px;
    max-width: 1120px;
    margin: 0 auto;
  }
  h1 {
    font-family: Fredoka, Nunito, sans-serif;
    font-weight: 700;
    font-size: clamp(2rem, 5vw, 2.9rem);
    line-height: 1.05;
    letter-spacing: -.02em;
    margin: 0 0 8px;
    text-wrap: balance;
  }
  h1 em { font-style: normal; color: var(--violeta); }
  .linha-fina {
    color: var(--tinta-fraca);
    max-width: 62ch;
    margin: 0 0 24px;
    font-weight: 600;
  }
  .numeros { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 24px; }
  .numeros span {
    background: var(--surface);
    border: 1px solid var(--linha);
    border-radius: 999px;
    padding: 6px 14px;
    font-size: .82rem;
    box-shadow: var(--sombra);
    font-variant-numeric: tabular-nums;
  }
  .numeros b { color: var(--violeta); }

  .barra {
    position: sticky;
    top: 0;
    z-index: 5;
    background: color-mix(in srgb, var(--ground) 88%, transparent);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid var(--linha);
    padding: 12px 24px;
  }
  .barra-interna { max-width: 1120px; margin: 0 auto; display: flex; gap: 12px; align-items: center; }
  input[type="search"] {
    flex: 1;
    min-width: 0;
    font: inherit;
    font-weight: 600;
    padding: 11px 16px;
    border-radius: 12px;
    border: 1px solid var(--linha);
    background: var(--surface);
    color: var(--tinta);
  }
  input[type="search"]:focus-visible { outline: 2px solid var(--violeta); outline-offset: 2px; }
  .aviso { font-size: .8rem; color: var(--tinta-fraca); white-space: nowrap; }

  main { max-width: 1120px; margin: 0 auto; padding: 24px 24px 72px; }
  .grupo { margin-bottom: 44px; }
  .grupo h2 {
    font-family: Fredoka, Nunito, sans-serif;
    font-weight: 600;
    font-size: 1.15rem;
    margin: 0 0 14px;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--linha);
    display: flex;
    align-items: baseline;
    gap: 10px;
  }
  .grupo .sub { font-family: Nunito, sans-serif; font-size: .82rem; font-weight: 600; color: var(--tinta-fraca); }
  .grupo .contagem {
    margin-left: auto;
    font-size: .74rem;
    color: var(--tinta-fraca);
    font-variant-numeric: tabular-nums;
  }
  .grade {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(148px, 1fr));
    gap: 12px;
  }
  .card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    padding: 14px 10px 12px;
    background: var(--surface);
    border: 1px solid var(--linha);
    border-radius: 16px;
    box-shadow: var(--sombra);
    cursor: pointer;
    font: inherit;
    color: inherit;
    text-align: center;
    transition: transform .12s ease, border-color .12s ease;
  }
  .card:hover { transform: translateY(-2px); border-color: var(--violeta); }
  .card:focus-visible { outline: 2px solid var(--violeta); outline-offset: 2px; }
  .card.copiado { border-color: var(--moeda); }
  .tile {
    width: 84px;
    height: 84px;
    display: grid;
    place-items: center;
    background: var(--tile);
    border-radius: 12px;
    margin-bottom: 2px;
  }
  .tile img { max-width: 68px; max-height: 68px; object-fit: contain; }
  .rotulo { font-weight: 900; font-size: .88rem; line-height: 1.2; }
  .card code {
    font-family: "JetBrains Mono", ui-monospace, monospace;
    font-size: .68rem;
    color: var(--violeta);
    word-break: break-all;
  }
  .card .onde { font-size: .7rem; color: var(--tinta-fraca); font-weight: 600; }

  .pendentes { background: var(--surface); border: 1px solid var(--linha); border-radius: 18px; padding: 20px 22px; box-shadow: var(--sombra); }
  .pendentes h2 { font-family: Fredoka, Nunito, sans-serif; font-size: 1.1rem; margin: 0 0 4px; }
  .pendentes p { color: var(--tinta-fraca); margin: 0 0 14px; font-size: .88rem; }
  .pendentes ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
  .pendentes li {
    display: grid;
    grid-template-columns: minmax(160px, 1fr) minmax(160px, 1.2fr) minmax(160px, 1.4fr);
    gap: 4px 16px;
    padding: 12px 14px;
    border-radius: 12px;
    background: var(--tile);
    font-size: .85rem;
  }
  .pendentes li span, .pendentes li em { color: var(--tinta-fraca); font-style: normal; }
  .pendentes li strong { color: var(--moeda); }
  @media (max-width: 640px) {
    .pendentes li { grid-template-columns: 1fr; }
    .barra-interna .aviso { display: none; }
  }
  .fundos { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 12px; }
  .fundo { margin: 0; display: flex; flex-direction: column; gap: 6px; }
  .fundo img {
    width: 100%;
    aspect-ratio: 1 / 1.7;
    object-fit: cover;
    border-radius: 12px;
    border: 1px solid var(--linha);
    display: block;
  }
  .fundo figcaption { font-size: .74rem; font-weight: 700; display: flex; flex-direction: column; gap: 1px; }
  .fundo code { font-family: "JetBrains Mono", ui-monospace, monospace; font-size: .62rem; color: var(--tinta-fraca); }
  .vazio { color: var(--tinta-fraca); padding: 40px 0; text-align: center; }
  @media (prefers-reduced-motion: reduce) { .card { transition: none; } }
</style>

<header class="capa">
  <h1>Todo ícone do <em>Tabuada Rush</em>, por tela</h1>
  <p class="linha-fina">
    Catálogo visual das artes já dentro do jogo, agrupadas pela aba ou página onde aparecem.
    Clique num ícone pra copiar a chamada dele pro código.
  </p>
  <div class="numeros">
    <span><b>__TOTAL__</b> ícones no jogo</span>
    <span><b>__GRUPOS__</b> telas cobertas</span>
    <span><b>__REFS__</b> arquivos de referência guardados</span>
    <span><b>13</b> fundos de recompensa</span>
    <span>arte dos recursos <b>completa</b></span>
  </div>
</header>

<div class="barra">
  <div class="barra-interna">
    <input type="search" id="busca" placeholder="Filtrar por nome, tela ou uso — ex.: baú, ofensiva, missão" aria-label="Filtrar ícones">
    <span class="aviso">clique no card = copia &lt;GameIcon name="…" /&gt;</span>
  </div>
</div>

<main>
__SECOES__

  <section class="grupo">
    <h2>Fundos das páginas de recompensa <span class="sub">src/assets/fundos/</span> <span class="contagem">13</span></h2>
    <div class="fundos">
__FUNDOS__
    </div>
  </section>

  <section class="pendentes">
    <h2>Ainda sem arte</h2>
    <p>Todo recurso, baú e fundo já tem arte própria. O que sobra é emoji, sem plano de troca definido.</p>
    <ul>
__FALTANDO__
    </ul>
  </section>
</main>

<script>
  var busca = document.getElementById('busca');
  var cards = Array.prototype.slice.call(document.querySelectorAll('.card'));
  var grupos = Array.prototype.slice.call(document.querySelectorAll('.grupo'));

  busca.addEventListener('input', function () {
    var termo = busca.value.trim().toLowerCase();
    cards.forEach(function (c) {
      c.style.display = !termo || c.dataset.busca.indexOf(termo) > -1 ? '' : 'none';
    });
    grupos.forEach(function (g) {
      var visiveis = g.querySelectorAll('.card:not([style*="none"])').length;
      g.style.display = visiveis ? '' : 'none';
    });
  });

  cards.forEach(function (c) {
    c.addEventListener('click', function () {
      var texto = '<GameIcon name="' + c.dataset.nome + '" size={24} />';
      var alvo = c.querySelector('.rotulo');
      var original = alvo.textContent;
      function marcar() {
        c.classList.add('copiado');
        alvo.textContent = 'copiado!';
        setTimeout(function () {
          c.classList.remove('copiado');
          alvo.textContent = original;
        }, 1100);
      }
      if (navigator.clipboard) {
        navigator.clipboard.writeText(texto).then(marcar, marcar);
      } else {
        marcar();
      }
    });
  });
</script>
"""

refs = 0
for raiz, _, arqs in os.walk(os.path.join(REPO, 'referencias', 'icones')):
    refs += len(arqs)

HTML = (HTML
        .replace('__SECOES__', '\n\n'.join(secoes))
        .replace('__FALTANDO__', faltando_html)
        .replace('__TOTAL__', str(cards_total))
        .replace('__GRUPOS__', str(len(GRUPOS)))
        .replace('__REFS__', str(refs))
        .replace('__FUNDOS__', fundos_html))

io.open(OUT, 'w', encoding='utf-8', newline='').write(HTML)
print('pagina escrita:', OUT)
print('cards:', cards_total, '| grupos:', len(GRUPOS), '| refs:', refs)
print('tamanho: %.2f MB' % (os.path.getsize(OUT) / 1048576.0))
