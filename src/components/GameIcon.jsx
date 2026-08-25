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
// [Fase 7.1, sessão 080] Versão ABERTA (com moedas à vista) dos 4 baús —
// recortada de `novo_icone_baus_classificações.png` (arte do Davi). Usada
// na página de recompensa de baú de moeda do resumo pós-partida; a versão
// fechada continua valendo pra decoração/estoque.
import bauMadeiraAberto from '../assets/icons/bau-madeira-aberto.png';
import bauFerroAberto from '../assets/icons/bau-ferro-aberto.png';
import bauOuroAberto from '../assets/icons/bau-ouro-aberto.png';
import bauMisticoAberto from '../assets/icons/bau-mistico-aberto.png';
// [Fase 7, sessão 073] `bau-recurso`: baú GENÉRICO — desde a sessão 074
// (D052) só usado na página "Nada desta vez" (partida sem loot nenhum);
// a decoração de recompensa achada agora usa bau-madeira/ferro/mistico de
// verdade, escolhido pela raridade do recurso (RARITY_CHEST/POTION_CHEST
// em PostGameSummary.jsx).
import bauRecurso from '../assets/icons/bau-recurso.png';
import resumoAcertos from '../assets/icons/resumo-acertos.png';
// [Fase 7, sessão 076, D054] Ícones COMBO recurso+baú — imagem única já
// pronta, com o TIPO de baú batendo com a classificação que o Davi deu
// (Madeira/Ferro/Ouro/Místico, não é mais Comum/Raro/Épico do sistema de
// raridade da Loja — ver PostGameSummary.jsx REWARD_COMBO). Falta só
// Seguro de Ofensiva (a geração dele saiu errada — repetiu uma arte
// antiga em vez de gerar escudo+baú de ouro) — esse continua com ícone
// do recurso separado + `bau-ouro` até ele mandar a arte certa.
import comboCongelar from '../assets/icons/combo-congelar.png';
import comboVidaExtra from '../assets/icons/combo-vida-extra.png';
import comboTempo from '../assets/icons/combo-tempo.png';
import comboEscudo from '../assets/icons/combo-escudo.png';
import comboLargada from '../assets/icons/combo-largada.png';
import comboPocao1 from '../assets/icons/combo-pocao-1.png';
import comboPocao2 from '../assets/icons/combo-pocao-2.png';
import comboPocao3 from '../assets/icons/combo-pocao-3.png';
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
  'bau-madeira-aberto': bauMadeiraAberto,
  'bau-ferro-aberto': bauFerroAberto,
  'bau-ouro-aberto': bauOuroAberto,
  'bau-mistico-aberto': bauMisticoAberto,
  'bau-recurso': bauRecurso,
  'combo-congelar': comboCongelar,
  'combo-vida-extra': comboVidaExtra,
  'combo-tempo': comboTempo,
  'combo-escudo': comboEscudo,
  'combo-largada': comboLargada,
  'combo-pocao-1': comboPocao1,
  'combo-pocao-2': comboPocao2,
  'combo-pocao-3': comboPocao3,
  'resumo-acertos': resumoAcertos,
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
