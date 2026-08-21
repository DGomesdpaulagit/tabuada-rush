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
import moedas from '../assets/icons/moedas.png';
import vidas from '../assets/icons/vidas.png';
import xp from '../assets/icons/xp.png';
import arena from '../assets/icons/arena.png';
import liga from '../assets/icons/liga.png';
import missoes from '../assets/icons/missoes.png';
import loja from '../assets/icons/loja.png';
import podio from '../assets/icons/podio.png';
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
  loja,
  podio,
  'bau-moedas': bauMoedas,
  'divisao-bloqueada': divisaoBloqueada,
  'missao-travada': missaoTravada,
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
