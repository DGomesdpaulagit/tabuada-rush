// ── RARIDADES ────────────────────────────────────────────────────────────────
// [2026-08-17] Antes cada raridade pintava o CARD INTEIRO (`bg-gray-100`/
// `bg-blue-50`/`bg-purple-50`). Dois problemas: os cards ficavam de cores
// diferentes entre si (o Davi pediu todos iguais), e `bg-purple-50` não tinha
// override no tema escuro em globals.css — o card Épico aparecia BRANCO no
// escuro. Agora o card usa sempre `bg-surface`/`border-border` (tokens que
// seguem o tema) e a raridade vive só na etiqueta, via `badge`.
export const RARITIES = {
  common: {
    label: 'Comum',
    textColor: 'text-fg-muted',
    badge: 'bg-fg-muted/15 text-fg-muted',
    gem: '⚪',
  },
  rare: {
    label: 'Raro',
    textColor: 'text-blue-400',
    badge: 'bg-blue-400/15 text-blue-400',
    gem: '🔵',
  },
  epic: {
    label: 'Épico',
    textColor: 'text-violet-400',
    badge: 'bg-violet-400/15 text-violet-400',
    gem: '💜',
  },
};

// ── ITENS DA LOJA ─────────────────────────────────────────────────────────────
// v5.0 · Bloco 1: a loja deixou de vender cosméticos (moldura/card/tema de jogo)
// — só power-ups (consumíveis que afetam o gameplay) continuam existindo.
// powerupKey: chave em data.powerups. Comprar incrementa o contador, usar decrementa.
//
// `group`: [Fase 3, sessão 067] categoria de exibição na Mochila (não
// confundir com `category`, que é a aba dentro da própria Loja — hoje só
// existe 'powerup' ali). Grupos exatos que o Davi definiu no PLANO_ACAO.md:
// Arena / Vida / Ofensiva / Missões.
//
// ⚠️ CHECKLIST AO ADICIONAR ITEM NOVO AQUI (pedido explícito do Davi,
// sessão 073, D051): também adicionar o `id` na tabela `LOOT_GENDER` de
// `pages/PostGameSummary.jsx` (gênero gramatical pra frase "Você ganhou
// um(a) [nome]" da página de recompensas) — sem isso o item cai no
// masculino por padrão, pode sair errado.

export const SHOP_ITEMS = [

  // ── PROGRESSÃO (fora da partida) ────────────────────────────────────────
  {
    id: 'powerup_streak_insurance',
    category: 'powerup',
    powerupKey: 'streakInsurance',
    group: 'ofensiva',
    art: 'ofensiva-congelada',
    name: 'Seguro de Ofensiva',
    emoji: '🛡️',
    desc: 'Salva sua ofensiva se você quebrá-la — restaura automaticamente em até 24h.',
    price: 100,
    rarity: 'rare',
  },
  {
    id: 'powerup_mission_freeze',
    category: 'powerup',
    powerupKey: 'missionFreeze',
    group: 'missoes',
    art: 'pu-congelar',
    name: 'Congelar Missão',
    emoji: '❄️',
    // v6.0 · Bloco 5: agora estende o prazo de um DESAFIO MENSAL aceito
    // (+10 dias) — antes pausava uma missão diária, mas as diárias não têm
    // mais risco nenhum (não precisam de seguro), o risco agora é só nos
    // desafios mensais (ver planejamento-6.0.md seção 7).
    desc: 'Estende em 10 dias o prazo de um desafio mensal aceito — útil quando você vê que não vai conseguir a tempo.',
    price: 50,
    rarity: 'common',
  },

  // ── DENTRO DA PARTIDA (Rush) ─────────────────────────────────────────────
  {
    id: 'powerup_life',
    category: 'powerup',
    powerupKey: 'life',
    group: 'vida',
    // Ícone dedicado (coração + cruz) — o Davi baixou um arquivo separado
    // do ícone genérico de vidas especificamente pra este power-up, apesar
    // de ter escrito "usar o mesmo ícone de vidas" — o arquivo à parte
    // (mais específico pro "revive 1 vida") tem prioridade sobre a
    // instrução escrita. Sinalizado a ele pra confirmar.
    art: 'pu-vida-extra',
    name: 'Vida Extra',
    emoji: '❤️‍🔥',
    desc: 'Restaura 1 vida quando você perder a última. Não deixa o jogo acabar!',
    price: 80,
    rarity: 'common',
  },
  {
    id: 'powerup_time',
    category: 'powerup',
    powerupKey: 'time',
    group: 'arena',
    art: 'pu-tempo',
    name: '+60s no relógio',
    emoji: '⏱️',
    desc: 'Adiciona 60 segundos ao cronômetro durante a partida. Use quando o tempo apertar!',
    price: 120,
    rarity: 'rare',
  },
  {
    id: 'powerup_shield',
    category: 'powerup',
    powerupKey: 'shield',
    group: 'arena',
    art: 'pu-escudo',
    name: 'Escudo',
    emoji: '🛡️',
    desc: 'Protege você do próximo erro — a vida não é descontada dessa vez. Se ativa sozinho.',
    price: 100,
    rarity: 'rare',
  },
  {
    id: 'powerup_headstart',
    category: 'powerup',
    powerupKey: 'headstart',
    group: 'arena',
    art: 'pu-largada',
    name: 'Largada Turbo',
    emoji: '🚀',
    desc: 'Começa a próxima partida de Rush já com +10s no relógio.',
    price: 90,
    rarity: 'common',
  },
];

// Lookup rápido por id
export const SHOP_ITEM_MAP = Object.fromEntries(SHOP_ITEMS.map((i) => [i.id, i]));

// Categorias para os tabs da loja (só uma agora, mantida pra facilitar
// adicionar categorias novas de power-up no futuro sem mexer na UI)
export const SHOP_CATEGORIES = [
  { id: 'powerup', label: 'Poder', emoji: '⚡' },
];

// Grupos da Mochila (Fase 3, sessão 067) — ordem e ícone de cada seção.
// `art` usa ícones já existentes (não tem um dedicado por categoria ainda).
export const MOCHILA_GROUPS = [
  { id: 'arena', label: 'Arena', art: 'arena' },
  { id: 'vida', label: 'Vida', art: 'vidas' },
  { id: 'ofensiva', label: 'Ofensiva', art: 'ofensiva' },
  { id: 'missoes', label: 'Missões', art: 'missoes' },
];

// ── POÇÕES DE XP [Fase 4, sessão 068, D046] ──────────────────────────────────
// Diferente do antigo XP Dobrado (valia por 1 PARTIDA, removido na Fase 2):
// a poção multiplica o XP por um período de TEMPO (`potionActiveUntil` em
// storage.js) — pode cobrir várias partidas ou nenhuma, dependendo de quanto
// o jogador joga naquela janela. Números exatos que o Davi deu no
// PLANO_ACAO.md (duração é o MÁXIMO — a poção não "acumula" tempo não usado).
// `art` reaproveita os 3 ícones fatiados na sessão 065 (tubo=x1,5,
// erlenmeyer=x2, redonda=x3 — mapeamento por formato, confirmado por ele).
// Preços TRIPLICADOS a pedido do Davi (sessão 072) — eram 100/250/450.
// ⚠️ Poção nova aqui → adicionar também em `LOOT_GENDER`
// (`pages/PostGameSummary.jsx`), mesmo checklist do topo do arquivo (D051).
export const POTIONS = [
  {
    id: 'pocao-xp-1',
    art: 'pocao-xp-1',
    name: 'Poção de XP ×1,5',
    multiplier: 1.5,
    durationMin: 40,
    price: 300,
  },
  {
    id: 'pocao-xp-2',
    art: 'pocao-xp-2',
    name: 'Poção de XP ×2',
    multiplier: 2,
    durationMin: 25,
    price: 750,
  },
  {
    id: 'pocao-xp-3',
    art: 'pocao-xp-3',
    name: 'Poção de XP ×3',
    multiplier: 3,
    durationMin: 15,
    price: 1350,
  },
];

export const POTION_MAP = Object.fromEntries(POTIONS.map((p) => [p.id, p]));
