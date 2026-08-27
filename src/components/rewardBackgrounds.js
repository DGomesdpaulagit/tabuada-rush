// ── FUNDOS DAS PÁGINAS DE RECOMPENSA [sessão 083] ────────────────────────────
// Arte do Davi: cada recurso/baú tem um fundo próprio (gradiente na cor dele
// + o símbolo do item repetido, desfocado), em vez do fundo escuro padrão do
// app. Fatiados das 2 folhas em `referencias/icones/fundos-recompensa/`.
//
// São JPEG de propósito: não têm transparência e são gradientes grandes —
// em PNG cada um passava de 100 KB, em JPEG ficam entre 11 e 26 KB.
//
// ⚠️ Ao adicionar um recurso novo: se não houver entrada aqui, a página cai
// no fundo escuro padrão (nada quebra) — mas o certo é pedir a arte.
// FALTA HOJE: `powerup_streak_insurance` (Seguro de Ofensiva) — não veio na
// leva de fundos; nome do arquivo pedido: `fundo-seguro-de-ofensiva.png`.
import fundoBauMadeira from '../assets/fundos/fundo-bau-madeira.jpg';
import fundoBauFerro from '../assets/fundos/fundo-bau-ferro.jpg';
import fundoBauOuro from '../assets/fundos/fundo-bau-ouro.jpg';
import fundoBauMistico from '../assets/fundos/fundo-bau-mistico.jpg';
import fundoVidaExtra from '../assets/fundos/fundo-vida-extra.jpg';
import fundoCongelar from '../assets/fundos/fundo-congelar.jpg';
import fundoLargada from '../assets/fundos/fundo-largada.jpg';
import fundoTempo from '../assets/fundos/fundo-tempo.jpg';
import fundoEscudo from '../assets/fundos/fundo-escudo.jpg';
import fundoPocao1 from '../assets/fundos/fundo-pocao-1.jpg';
import fundoPocao2 from '../assets/fundos/fundo-pocao-2.jpg';
import fundoPocao3 from '../assets/fundos/fundo-pocao-3.jpg';

// Chave = `id` do item de loot (CHESTS/SHOP_ITEMS/POTIONS).
export const REWARD_BG = {
  'bau-madeira': fundoBauMadeira,
  'bau-ferro': fundoBauFerro,
  'bau-ouro': fundoBauOuro,
  'bau-mistico': fundoBauMistico,
  powerup_life: fundoVidaExtra,
  powerup_mission_freeze: fundoCongelar,
  powerup_headstart: fundoLargada,
  powerup_time: fundoTempo,
  powerup_shield: fundoEscudo,
  'pocao-xp-1': fundoPocao1,
  'pocao-xp-2': fundoPocao2,
  'pocao-xp-3': fundoPocao3,
};
