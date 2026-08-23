// ── ÍCONES DO JOGO [arte fornecida pelo Davi] ────────────────────────────────
// Substitui emoji/ícones da lucide pelos PNGs que o Davi produziu. Os
// arquivos vieram com fundo sólido (recorte de tela); foram processados por
// um script de remoção de fundo + recorte + redimensionamento antes de
// entrar aqui — ver sessions/sessao-059.md.
//
// Por que um componente e não `<img>` solto em cada tela: os ícones têm
// proporções diferentes entre si (o foguinho é alto e fino, a arena é larga).
// Uma caixa quadrada com `object-contain` faz todos ocuparem o mesmo espaço
// visual sem distorcer, que é o que mantém as fileiras alinhadas.
import ofensiva from '../assets/icons/ofensiva.png';
import ofensivaCongelada from '../assets/icons/ofensiva-congelada.png';
import diaFeito from '../assets/icons/dia-feito.png';
import diaCongelado from '../assets/icons/dia-congelado.png';
import diaVazio from '../assets/icons/dia-vazio.png';
import posicao1 from '../assets/icons/posicao-1.png';
import posicao2 from '../assets/icons/posicao-2.png';
import posicao3 from '../assets/icons/posicao-3.png';
import puLargada from '../assets/icons/pu-largada.png';
import puEscudo from '../assets/icons/pu-escudo.png';
import puCongelar from '../assets/icons/pu-congelar.png';
import puTempo from '../assets/icons/pu-tempo.png';
import puVidaExtra from '../assets/icons/pu-vida-extra.png';
import moedas from '../assets/icons/moedas.png';
import vidas from '../assets/icons/vidas.png';
import xp from '../assets/icons/xp.png';
import arena from '../assets/icons/arena.png';
import liga from '../assets/icons/liga.png';
import missoes from '../assets/icons/missoes.png';
import missaoMensal from '../assets/icons/missao-mensal.png';
import missaoDiaria from '../assets/icons/missao-diaria.png';
import missaoTipoPartidas from '../assets/icons/missao-tipo-partidas.png';
import missaoTipoPrecisao from '../assets/icons/missao-tipo-precisao.png';
import missaoTipoPontuacao from '../assets/icons/missao-tipo-pontuacao.png';
import loja from '../assets/icons/loja.png';
import podio from '../assets/icons/podio.png';
import mochila from '../assets/icons/mochila.png';
import pocaoXp1 from '../assets/icons/pocao-xp-1.png';
import pocaoXp2 from '../assets/icons/pocao-xp-2.png';
import pocaoXp3 from '../assets/icons/pocao-xp-3.png';
import bauMadeira from '../assets/icons/bau-madeira.png';
import bauFerro from '../assets/icons/bau-ferro.png';
import bauOuro from '../assets/icons/bau-ouro.png';
import bauMistico from '../assets/icons/bau-mistico.png';
import bauMoedas from '../assets/icons/bau-moedas.png';
import divisaoBloqueada from '../assets/icons/divisao-bloqueada.png';
import missaoTravada from '../assets/icons/missao-travada.png';
import ligaBronze from '../assets/icons/liga-bronze.png';
import ligaPrata from '../assets/icons/liga-prata.png';
import ligaOuro from '../assets/icons/liga-ouro.png';
import ligaSafira from '../assets/icons/liga-safira.png';
import ligaRubi from '../assets/icons/liga-rubi.png';
import ligaEsmeralda from '../assets/icons/liga-esmeralda.png';
import ligaAmetista from '../assets/icons/liga-ametista.png';
import ligaPerola from '../assets/icons/liga-perola.png';
import ligaObsidiana from '../assets/icons/liga-obsidiana.png';
import ligaDiamante from '../assets/icons/liga-diamante.png';

export const ICONS = {
  ofensiva,
  'ofensiva-congelada': ofensivaCongelada,
  'dia-feito': diaFeito,
  'dia-congelado': diaCongelado,
  'dia-vazio': diaVazio,
  moedas,
  vidas,
  xp,
  arena,
  liga,
  missoes,
  'missao-mensal': missaoMensal,
  'missao-diaria': missaoDiaria,
  // Ícone por TIPO de missão (ver constants/missions.js campo `type` e o
  // mapa TYPE_ICON em MissionsPage.jsx) — "Controle" (partidas), "100"
  // (pontuação). O alvo verde (`precisao`) cobre `accuracy` E, desde a
  // sessão 068, também `streak`/`streak_month`/`correct_*` (substituiu o
  // halter, que foi removido — não sobra arte órfã).
  'missao-tipo-partidas': missaoTipoPartidas,
  'missao-tipo-precisao': missaoTipoPrecisao,
  'missao-tipo-pontuacao': missaoTipoPontuacao,
  loja,
  podio,
  mochila,
  'bau-moedas': bauMoedas,
  'bau-madeira': bauMadeira,
  'bau-ferro': bauFerro,
  'bau-ouro': bauOuro,
  'bau-mistico': bauMistico,
  'pocao-xp-1': pocaoXp1, // x1,5 — tubo de ensaio (menor multiplicador, maior duração)
  'pocao-xp-2': pocaoXp2, // x2 — erlenmeyer
  'pocao-xp-3': pocaoXp3, // x3 — frasco redondo (maior multiplicador, menor duração)
  'divisao-bloqueada': divisaoBloqueada,
  'missao-travada': missaoTravada,
  // Power-ups da loja (ver constants/shop.js, campo `art`)
  'pu-largada': puLargada,
  'pu-escudo': puEscudo,
  'pu-congelar': puCongelar,
  'pu-tempo': puTempo,
  'pu-vida-extra': puVidaExtra,
};

// Medalhas de 1º/2º/3º da classificação (RankingPage). Índice 0-based:
// PODIUM_ICONS[0] = 1º lugar.
export const PODIUM_ICONS = [posicao1, posicao2, posicao3];

// Escudo de cada divisão, pela `id` em constants/leagues.js.
export const LEAGUE_ICONS = {
  bronze: ligaBronze,
  prata: ligaPrata,
  ouro: ligaOuro,
  safira: ligaSafira,
  rubi: ligaRubi,
  esmeralda: ligaEsmeralda,
  ametista: ligaAmetista,
  perola: ligaPerola,
  obsidiana: ligaObsidiana,
  diamante: ligaDiamante,
};

export default function GameIcon({ name, size = 20, className = '', alt = '' }) {
  const src = ICONS[name] || LEAGUE_ICONS[name];
  if (!src) return null;
  return (
    <img
      src={src}
      alt={alt}
      aria-hidden={alt ? undefined : true}
      width={size}
      height={size}
      draggable={false}
      style={{ width: size, height: size }}
      className={`object-contain shrink-0 select-none ${className}`}
    />
  );
}

// Escudo da divisão — some quando a liga está bloqueada (aí o chamador usa
// o ícone `divisao-bloqueada`).
export function LeagueIcon({ leagueId, size = 40, className = '', alt = '' }) {
  const src = LEAGUE_ICONS[leagueId];
  if (!src) return null;
  return (
    <img
      src={src}
      alt={alt}
      aria-hidden={alt ? undefined : true}
      draggable={false}
      style={{ width: size, height: size }}
      className={`object-contain shrink-0 select-none ${className}`}
    />
  );
}
