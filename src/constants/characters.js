// ── RANKING DE QI MATEMÁTICO — PERSONAGENS ──────────────────────────────────
// Sistema LÚDICO de classificação (NÃO mede QI real — é gamificação/diversão).
//
// Usa PERSONAGENS FAMOSOS E RECONHECÍVEIS (desenhos, filmes, séries, memes,
// cientistas e figuras históricas) para que o usuário se identifique na hora:
// "agora sou o Batman da tabuada", "cheguei no Einstein". Os nomes são apenas
// rótulos/referências e o avatar é um EMOJI (estética já usada no projeto —
// sem imagens externas/protegidas).
//
// CHARACTERS está ordenado do MENOS para o MAIS "inteligente". O QI do usuário
// (calculado em utils/computeQI) é mapeado para uma posição nesta lista, então
// os limiares de QI são DERIVADOS do índice (ver utils) — adicionar/remover
// personagens é trivial e escalável.
//
// Tiers (categorias intelectuais), em ordem:
//   baixo  → engraçados, atrapalhados, caóticos
//   medio  → aventureiros, heróis, inteligentes moderados
//   alto   → estratégicos, inteligentes, calculistas
//   genio  → cientistas, gênios, intelectuais extremos

export const TIERS = {
  baixo: {
    id: 'baixo',
    label: 'Nível Baixo',
    classification: 'Mente em Aquecimento',
    emoji: '🤪',
    text: 'text-slate-600',
    badge: 'bg-slate-100 text-slate-600',
    gradient: 'from-slate-400 to-gray-500',
    gradientLight: 'from-slate-50 to-gray-50',
    border: 'border-slate-200',
  },
  medio: {
    id: 'medio',
    label: 'Nível Médio',
    classification: 'Herói Aventureiro',
    emoji: '🧭',
    text: 'text-blue-600',
    badge: 'bg-blue-100 text-blue-700',
    gradient: 'from-blue-500 to-sky-600',
    gradientLight: 'from-blue-50 to-sky-50',
    border: 'border-blue-200',
  },
  alto: {
    id: 'alto',
    label: 'Nível Alto',
    classification: 'Mente Estrategista',
    emoji: '🧠',
    text: 'text-violet-600',
    badge: 'bg-violet-100 text-violet-700',
    gradient: 'from-violet-600 to-purple-600',
    gradientLight: 'from-violet-50 to-purple-50',
    border: 'border-violet-200',
  },
  genio: {
    id: 'genio',
    label: 'Nível Gênio',
    classification: 'Gênio Matemático',
    emoji: '🎓',
    text: 'text-amber-600',
    badge: 'bg-amber-100 text-amber-700',
    gradient: 'from-amber-400 to-orange-500',
    gradientLight: 'from-amber-50 to-orange-50',
    border: 'border-amber-200',
  },
};

export const TIER_ORDER = ['baixo', 'medio', 'alto', 'genio'];

// Ordenado do menor para o maior nível intelectual.
// v5.0 · Bloco 1: reduzido de 104 → ~52 personagens (13 por tier) — mantém
// os mais reconhecíveis de cada grupo, corta o resto pra encurtar a jornada.
export const CHARACTERS = [
  // ── NÍVEL BAIXO (engraçados / atrapalhados / caóticos) ────────────────────
  { name: 'Patrick Estrela',     emoji: '⭐', tier: 'baixo', desc: 'Mora embaixo de uma pedra. Conta nos dedos.' },
  { name: 'Homer Simpson',       emoji: '🍩', tier: 'baixo', desc: 'Troca qualquer conta por uma rosquinha.' },
  { name: 'Bob Esponja',         emoji: '🧽', tier: 'baixo', desc: 'Otimismo nota 10, matemática nota 2.' },
  { name: 'Sid',                 emoji: '🦥', tier: 'baixo', desc: 'A preguiça da Era do Gelo na tabuada.' },
  { name: 'Scooby-Doo',          emoji: '🐕', tier: 'baixo', desc: 'Resolve mistérios, menos os de matemática.' },
  { name: 'Minions',             emoji: '🍌', tier: 'baixo', desc: 'Banana! Caos adorável e bagunceiro.' },
  { name: 'Garfield',            emoji: '🐱', tier: 'baixo', desc: 'Odeia segundas e tabuadas grandes.' },
  { name: 'Mr. Bean',            emoji: '🫖', tier: 'baixo', desc: 'Resolve tudo do jeito mais complicado.' },
  { name: 'Po',                  emoji: '🐼', tier: 'baixo', desc: 'Panda do kung fu — mais fome que foco.' },
  { name: 'Dory',                emoji: '🐠', tier: 'baixo', desc: 'Esqueceu a resposta no meio do caminho.' },
  { name: 'Bart Simpson',        emoji: '🛹', tier: 'baixo', desc: 'Prefere o skate à lição de casa.' },
  { name: 'Cartman',             emoji: '🍔', tier: 'baixo', desc: 'Respeitem minha autoridade... e meu chute.' },
  { name: 'Plankton',            emoji: '🦠', tier: 'baixo', desc: 'Planos geniais que sempre falham.' },

  // ── NÍVEL MÉDIO (aventureiros / heróis / inteligentes moderados) ──────────
  { name: 'Shrek',               emoji: '🟢', tier: 'medio', desc: 'Ogro tem camadas — e aprende rápido.' },
  { name: 'Mario',               emoji: '🍄', tier: 'medio', desc: 'Itsa me! Pula de fase em fase.' },
  { name: 'Sonic',               emoji: '💨', tier: 'medio', desc: 'Rápido demais pra errar... quase.' },
  { name: 'Pikachu',             emoji: '🟡', tier: 'medio', desc: 'Pika! Energia pra acertar em sequência.' },
  { name: 'Harry Potter',        emoji: '⚡', tier: 'medio', desc: 'O bruxo que sobreviveu às tabuadas.' },
  { name: 'Goku',                emoji: '🥋', tier: 'medio', desc: 'Treina até dominar cada multiplicação.' },
  { name: 'Luffy',               emoji: '🏴‍☠️', tier: 'medio', desc: 'Vai ser o Rei dos Números!' },
  { name: 'Naruto',              emoji: '🍥', tier: 'medio', desc: 'Dattebayo! Nunca desiste de uma conta.' },
  { name: 'Buzz Lightyear',      emoji: '🚀', tier: 'medio', desc: 'Ao infinito e além das tabuadas!' },
  { name: 'Simba',               emoji: '🦁', tier: 'medio', desc: 'O rei dos acertos em formação.' },
  { name: 'Thor',                emoji: '🔨', tier: 'medio', desc: 'Martela cada questão com força.' },
  { name: 'Link',                emoji: '🗡️', tier: 'medio', desc: 'Resolve enigmas de Hyrule e da tabuada.' },
  { name: 'Capitão América',     emoji: '🛡️', tier: 'medio', desc: 'Defende cada resposta com honra.' },

  // ── NÍVEL ALTO (estratégicos / inteligentes / calculistas) ────────────────
  { name: 'Batman',              emoji: '🦇', tier: 'alto', desc: 'O maior detetive — e calculista — do mundo.' },
  { name: 'Sherlock Holmes',     emoji: '🕵️', tier: 'alto', desc: 'Elementar: deduz a resposta antes de você.' },
  { name: 'Hermione Granger',    emoji: '📚', tier: 'alto', desc: 'É Leviôsa, não Leviosá — e a resposta é essa.' },
  { name: 'Homem-Aranha',        emoji: '🕷️', tier: 'alto', desc: 'Reflexos rápidos, mente ágil de cientista.' },
  { name: 'Tony Stark',          emoji: '🦾', tier: 'alto', desc: 'Gênio, bilionário... e ótimo de cabeça.' },
  { name: 'Doutor Estranho',     emoji: '🔮', tier: 'alto', desc: 'Viu 14 milhões de respostas possíveis.' },
  { name: 'Yoda',                emoji: '🌿', tier: 'alto', desc: 'Calcular, você deve. Errar, não há.' },
  { name: 'Gandalf',             emoji: '🧙', tier: 'alto', desc: 'Você não vai passar... sem acertar.' },
  { name: 'Dumbledore',          emoji: '🧙‍♂️', tier: 'alto', desc: 'Sabedoria serena nas equações.' },
  { name: 'Walter White',        emoji: '🧪', tier: 'alto', desc: 'É a química — e a matemática — exata.' },
  { name: 'Loki',                emoji: '🐍', tier: 'alto', desc: 'Trapaceiro genial dos cálculos.' },
  { name: 'Velma',               emoji: '🔍', tier: 'alto', desc: 'Jinkies! Resolve o enigma na hora.' },
  { name: 'Lisa Simpson',        emoji: '🎷', tier: 'alto', desc: 'A inteligência da família Simpson.' },

  // ── NÍVEL GÊNIO (cientistas / gênios / intelectuais extremos) ─────────────
  { name: 'Rick Sanchez',        emoji: '🥒', tier: 'genio', desc: 'O cientista mais inteligente do multiverso.' },
  { name: 'Leonardo da Vinci',   emoji: '🎨', tier: 'genio', desc: 'Arte, ciência e engenharia numa mente só.' },
  { name: 'Galileu Galilei',     emoji: '🔭', tier: 'genio', desc: 'E, ainda assim, ela se move.' },
  { name: 'Arquimedes',          emoji: '🛁', tier: 'genio', desc: 'Eureka! Achou a resposta na banheira.' },
  { name: 'Pitágoras',           emoji: '📐', tier: 'genio', desc: 'O dono do teorema mais famoso.' },
  { name: 'Charles Darwin',      emoji: '🐢', tier: 'genio', desc: 'Adaptou-se até dominar a tabuada.' },
  { name: 'Ada Lovelace',        emoji: '💾', tier: 'genio', desc: 'A primeira programadora da história.' },
  { name: 'Marie Curie',         emoji: '☢️', tier: 'genio', desc: 'Dois Nobel — brilha de conhecimento.' },
  { name: 'Alan Turing',         emoji: '💻', tier: 'genio', desc: 'Decifrou códigos impossíveis.' },
  { name: 'Isaac Newton',        emoji: '🍎', tier: 'genio', desc: 'A maçã caiu e a resposta também.' },
  { name: 'Nikola Tesla',        emoji: '⚡', tier: 'genio', desc: 'Ideias em alta voltagem.' },
  { name: 'Stephen Hawking',     emoji: '🌌', tier: 'genio', desc: 'Pensou o universo inteiro de uma vez.' },
  { name: 'Albert Einstein',     emoji: '🧠', tier: 'genio', desc: 'O ápice: tudo é relativo, menos o acerto.' },
];

// Faixa de QI (lúdica) usada para mapear desempenho → posição no ranking.
export const QI_MIN = 70;
export const QI_MAX = 200;
