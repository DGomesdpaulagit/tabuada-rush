// ── LIGAS [v6.0 · Bloco 4, recalibrado 2026-08-17] ───────────────────────────
// Substitui o "Ranking de QI" (posição estática numa lista fixa de 52
// personagens) por uma competição de verdade — ver utils/leagues.js pro
// motor. Recalibrado depois do reset 6.0 a pedido do Davi (ver DECISIONS.md
// D030): pote de personagens por liga e zonas de promoção AGORA DIMINUEM
// conforme a liga sobe — Bronze é a mais fácil de sair (pote grande, zona de
// promoção larga), Diamante é o topo, poucos personagens, quase impossível
// destronar (todos "vivem" no jogo, joga toda hora — ver characterActivity
// em utils/leagues.js).
//
// promotionCount/relegationCount: de quantas posições (do pote + o jogador)
// sobem/descem de liga a cada CICLO (6 dias, ver CYCLE_DAYS em
// utils/leagues.js — não é mais por partida). Âncoras dadas pelo Davi:
// Bronze top 8, Safira top 4 — o resto interpolado na mesma curva
// decrescente.
export const LEAGUES = [
  { id: 'bronze',    name: 'Bronze',    emoji: '🥉', gradient: 'from-orange-700 to-amber-800',   gradientLight: 'from-orange-50 to-amber-50',   text: 'text-orange-700', border: 'border-orange-200', promotionCount: 8, relegationCount: 0 },
  { id: 'prata',     name: 'Prata',     emoji: '🥈', gradient: 'from-slate-400 to-slate-500',     gradientLight: 'from-slate-50 to-gray-50',     text: 'text-slate-600',  border: 'border-slate-200',  promotionCount: 7, relegationCount: 2 },
  { id: 'ouro',      name: 'Ouro',      emoji: '🥇', gradient: 'from-amber-400 to-yellow-500',    gradientLight: 'from-amber-50 to-yellow-50',   text: 'text-amber-600',  border: 'border-amber-200',  promotionCount: 6, relegationCount: 2 },
  { id: 'safira',    name: 'Safira',    emoji: '🔷', gradient: 'from-blue-500 to-blue-700',       gradientLight: 'from-blue-50 to-sky-50',       text: 'text-blue-600',   border: 'border-blue-200',   promotionCount: 4, relegationCount: 2 },
  { id: 'rubi',      name: 'Rubi',      emoji: '♦️', gradient: 'from-rose-500 to-red-600',        gradientLight: 'from-rose-50 to-red-50',       text: 'text-rose-600',   border: 'border-rose-200',   promotionCount: 3, relegationCount: 2 },
  { id: 'esmeralda', name: 'Esmeralda', emoji: '💚', gradient: 'from-emerald-500 to-green-600',   gradientLight: 'from-emerald-50 to-green-50',  text: 'text-emerald-600',border: 'border-emerald-200',promotionCount: 3, relegationCount: 2 },
  { id: 'ametista',  name: 'Ametista',  emoji: '💜', gradient: 'from-violet-500 to-purple-600',   gradientLight: 'from-violet-50 to-purple-50',  text: 'text-violet-600', border: 'border-violet-200', promotionCount: 2, relegationCount: 2 },
  { id: 'perola',    name: 'Pérola',    emoji: '🤍', gradient: 'from-pink-300 to-rose-300',       gradientLight: 'from-pink-50 to-rose-50',      text: 'text-pink-500',   border: 'border-pink-200',   promotionCount: 2, relegationCount: 1 },
  { id: 'obsidiana', name: 'Obsidiana', emoji: '⚫',  gradient: 'from-gray-800 to-gray-950',       gradientLight: 'from-gray-100 to-gray-200',    text: 'text-gray-700',   border: 'border-gray-300',   promotionCount: 1, relegationCount: 1 },
  { id: 'diamante',  name: 'Diamante',  emoji: '💎', gradient: 'from-cyan-400 to-sky-500',        gradientLight: 'from-cyan-50 to-sky-50',       text: 'text-cyan-600',   border: 'border-cyan-200',   promotionCount: 0, relegationCount: 1 },
];

export const LEAGUE_MAP = Object.fromEntries(LEAGUES.map((l) => [l.id, l]));

// Personagens por liga — pote DIMINUI conforme a liga sobe (20 no Bronze até
// 4 no Diamante, pedido explícito do Davi: "quanto mais você subir, mais
// difícil vai ser ficar entre o pódio"). 114 no total. Reaproveita os 100 do
// Bloco 4 + 14 novos nas ligas de baixo; ligas de cima foram ENXUGADAS (não
// deletadas do histórico do jogo — só reduzidas pra caber no pote novo),
// e o Einstein migrou de Pérola pra Diamante — foi o exemplo que o próprio
// Davi deu de personagem "que vive dentro do jogo, joga toda hora".
export const LEAGUE_CHARACTERS = [
  // ── BRONZE — 20 (desajeitados / engraçados) ─────────────────────────────
  { name: 'Patrick Estrela', emoji: '⭐', league: 'bronze', desc: 'Mora embaixo de uma pedra. Conta nos dedos.' },
  { name: 'Homer Simpson',   emoji: '🍩', league: 'bronze', desc: 'Troca qualquer conta por uma rosquinha.' },
  { name: 'Bob Esponja',     emoji: '🧽', league: 'bronze', desc: 'Otimismo nota 10, matemática nota 2.' },
  { name: 'Sid',             emoji: '🦥', league: 'bronze', desc: 'A preguiça da Era do Gelo na tabuada.' },
  { name: 'Scooby-Doo',      emoji: '🐕', league: 'bronze', desc: 'Resolve mistérios, menos os de matemática.' },
  { name: 'Minions',         emoji: '🍌', league: 'bronze', desc: 'Banana! Caos adorável e bagunceiro.' },
  { name: 'Garfield',        emoji: '🐱', league: 'bronze', desc: 'Odeia segundas e tabuadas grandes.' },
  { name: 'Mr. Bean',        emoji: '🫖', league: 'bronze', desc: 'Resolve tudo do jeito mais complicado.' },
  { name: 'Po',              emoji: '🐼', league: 'bronze', desc: 'Panda do kung fu — mais fome que foco.' },
  { name: 'Dory',            emoji: '🐠', league: 'bronze', desc: 'Esqueceu a resposta no meio do caminho.' },
  { name: 'Baby Yoda',       emoji: '🍵', league: 'bronze', desc: 'Só quer a sopinha, não quer saber de conta.' },
  { name: 'Stitch',          emoji: '👽', league: 'bronze', desc: 'Experimento 626 — feito pra destruir, não calcular.' },
  { name: 'Pinóquio',        emoji: '🪵', league: 'bronze', desc: 'Erra e o nariz denuncia na hora.' },
  { name: 'Wall-E',          emoji: '🤖', league: 'bronze', desc: 'Só sabe compactar lixo, não números.' },
  { name: 'Piglet',          emoji: '🐷', league: 'bronze', desc: 'Treme antes mesmo de tentar responder.' },
  { name: 'Tigrão',          emoji: '🐯', league: 'bronze', desc: 'Pula de alegria e esquece a pergunta.' },
  { name: 'Pica-Pau',        emoji: '🐦', league: 'bronze', desc: 'Ri antes, calcula nunca.' },
  { name: 'Tom',             emoji: '😾', league: 'bronze', desc: 'Mais ocupado perseguindo o Jerry que a resposta.' },
  { name: 'Jerry',           emoji: '🐭', league: 'bronze', desc: 'Rápido fugindo, devagar contando.' },
  { name: 'Burro (Shrek)',   emoji: '🫏', league: 'bronze', desc: 'Fala demais, calcula de menos.' },

  // ── PRATA — 18 (trapalhões / caóticos) ──────────────────────────────────
  { name: 'Bart Simpson',    emoji: '🛹', league: 'prata', desc: 'Prefere o skate à lição de casa.' },
  { name: 'Cartman',         emoji: '🍔', league: 'prata', desc: 'Respeitem minha autoridade... e meu chute.' },
  { name: 'Plankton',        emoji: '🦠', league: 'prata', desc: 'Planos geniais que sempre falham.' },
  { name: 'Pateta',          emoji: '😂', league: 'prata', desc: 'Ihooo! Erra rindo, mas erra.' },
  { name: 'Peter Griffin',   emoji: '🍺', league: 'prata', desc: 'Distrai fácil no meio da conta.' },
  { name: 'Shaggy',          emoji: '🥪', league: 'prata', desc: 'Zoinks! Foge de fantasma e de tabuada.' },
  { name: 'Papa-Léguas',     emoji: '🌵', league: 'prata', desc: 'Rápido nas pernas, devagar na conta.' },
  { name: 'Kronk',           emoji: '🍗', league: 'prata', desc: 'Força de touro, cabeça meio confusa.' },
  { name: 'Timmy Turner',    emoji: '🧚', league: 'prata', desc: 'Pede um desejo pra resolver a questão.' },
  { name: 'Groot Bebê',      emoji: '🌱', league: 'prata', desc: 'Eu sou Groot (e não sei a tabuada do 7).' },
  { name: 'Patolino',        emoji: '🦆', league: 'prata', desc: 'Grita a resposta errada com convicção.' },
  { name: 'Scrat',           emoji: '🌰', league: 'prata', desc: 'Só pensa na castanha, nunca na conta.' },
  { name: 'Olaf',            emoji: '⛄', league: 'prata', desc: 'Adora abraços quentes, odeia tabuada.' },
  { name: 'Timon',           emoji: '🦦', league: 'prata', desc: 'Hakuna Matata — sem preocupação, sem foco.' },
  { name: 'Pumba',           emoji: '🐗', league: 'prata', desc: 'Bom coração, memória curta.' },
  { name: 'Iago',            emoji: '🦜', league: 'prata', desc: 'Repete a resposta de qualquer um — nem sempre certa.' },
  { name: 'Baloo',           emoji: '🐻', league: 'prata', desc: 'O básico e essencial ele sabe. O resto, nem tanto.' },
  { name: 'Donkey Kong',     emoji: '🦍', league: 'prata', desc: 'Força de gorila, tabuada de principiante.' },

  // ── OURO — 16 (aventureiros iniciantes) ─────────────────────────────────
  { name: 'Shrek',           emoji: '🟢', league: 'ouro', desc: 'Ogro tem camadas — e aprende rápido.' },
  { name: 'Mario',           emoji: '🍄', league: 'ouro', desc: 'Itsa me! Pula de fase em fase.' },
  { name: 'Sonic',           emoji: '💨', league: 'ouro', desc: 'Rápido demais pra errar... quase.' },
  { name: 'Pikachu',         emoji: '🟡', league: 'ouro', desc: 'Pika! Energia pra acertar em sequência.' },
  { name: 'Harry Potter',    emoji: '⚡', league: 'ouro', desc: 'O bruxo que sobreviveu às tabuadas.' },
  { name: 'Aladdin',         emoji: '🧞', league: 'ouro', desc: 'Um mundo todo novo de multiplicação.' },
  { name: 'Woody',           emoji: '🤠', league: 'ouro', desc: 'Ao infinito... quase lá.' },
  { name: 'Ash Ketchum',     emoji: '🎒', league: 'ouro', desc: 'Quer ser o melhor calculista que já existiu.' },
  { name: 'Percy Jackson',   emoji: '🔱', league: 'ouro', desc: 'Semideus com dislexia pros números também.' },
  { name: 'Flecha',          emoji: '🏃', league: 'ouro', desc: 'Veloz nos números, mas ainda aprendendo.' },
  { name: 'Peter Pan',       emoji: '🧚‍♂️', league: 'ouro', desc: 'Nunca quer crescer — nem estudar tabuada.' },
  { name: 'Dorothy',         emoji: '👠', league: 'ouro', desc: 'Segue o caminho certo, às vezes a conta errada.' },
  { name: 'Judy Hopps',      emoji: '🐰', league: 'ouro', desc: 'Determinada — vai chegar lá, questão por questão.' },
  { name: 'Nick Wilde',      emoji: '🦊', league: 'ouro', desc: 'Esperto o suficiente pra quase sempre acertar.' },
  { name: 'Elsa',            emoji: '❄️', league: 'ouro', desc: 'Congela na hora de decorar a tabuada do 8.' },
  { name: 'Anna',            emoji: '👗', league: 'ouro', desc: 'Corre atrás da resposta com o coração.' },

  // ── SAFIRA — 14 (heróis em treino) ───────────────────────────────────────
  { name: 'Goku',            emoji: '🥋', league: 'safira', desc: 'Treina até dominar cada multiplicação.' },
  { name: 'Luffy',           emoji: '🏴‍☠️', league: 'safira', desc: 'Vai ser o Rei dos Números!' },
  { name: 'Naruto',          emoji: '🍥', league: 'safira', desc: 'Dattebayo! Nunca desiste de uma conta.' },
  { name: 'Buzz Lightyear',  emoji: '🚀', league: 'safira', desc: 'Ao infinito e além das tabuadas!' },
  { name: 'Simba',           emoji: '🦁', league: 'safira', desc: 'O rei dos acertos em formação.' },
  { name: 'Thor',            emoji: '🔨', league: 'safira', desc: 'Martela cada questão com força.' },
  { name: 'Link',            emoji: '🗡️', league: 'safira', desc: 'Resolve enigmas de Hyrule e da tabuada.' },
  { name: 'Capitão América', emoji: '🛡️', league: 'safira', desc: 'Defende cada resposta com honra.' },
  { name: 'Aang',            emoji: '🌪️', league: 'safira', desc: 'Domina 4 elementos, quase domina a tabuada.' },
  { name: 'Mulan',           emoji: '🐉', league: 'safira', desc: 'Honra a família com cada acerto.' },
  { name: 'Katara',          emoji: '💧', league: 'safira', desc: 'Flui pelas contas com calma e precisão.' },
  { name: 'Zuko',            emoji: '🔥', league: 'safira', desc: 'Treina com fúria até dominar cada fato.' },
  { name: 'Merida',          emoji: '🏹', league: 'safira', desc: 'Mira certeira, teimosia até acertar.' },
  { name: 'Soluço',          emoji: '🐲', league: 'safira', desc: 'Domesticou um dragão, ainda domesticando a tabuada.' },

  // ── RUBI — 12 (detetives e estrategistas) ────────────────────────────────
  { name: 'Batman',          emoji: '🦇', league: 'rubi', desc: 'O maior detetive — e calculista — do mundo.' },
  { name: 'Sherlock Holmes', emoji: '🕵️', league: 'rubi', desc: 'Elementar: deduz a resposta antes de você.' },
  { name: 'Hermione Granger',emoji: '📚', league: 'rubi', desc: 'É Leviôsa, não Leviosá — e a resposta é essa.' },
  { name: 'Homem-Aranha',    emoji: '🕷️', league: 'rubi', desc: 'Reflexos rápidos, mente ágil de cientista.' },
  { name: 'Tony Stark',      emoji: '🦾', league: 'rubi', desc: 'Gênio, bilionário... e ótimo de cabeça.' },
  { name: 'Viúva Negra',     emoji: '🕸️', league: 'rubi', desc: 'Estratégia fria, precisão total.' },
  { name: 'Nick Fury',       emoji: '🕶️', league: 'rubi', desc: 'Sempre um passo à frente do problema.' },
  { name: 'Katniss Everdeen',emoji: '🏹', league: 'rubi', desc: 'Mira certeira, cálculo certeiro.' },
  { name: 'Pantera Negra',   emoji: '🐾', league: 'rubi', desc: 'Wakanda Forever — e a resposta também.' },
  { name: 'Mulher-Maravilha',emoji: '⚡', league: 'rubi', desc: 'Laço da verdade não engana na tabuada.' },
  { name: 'Light Yagami',    emoji: '📓', league: 'rubi', desc: 'Planeja cada resposta com precisão calculada.' },
  { name: 'Artemis Fowl',    emoji: '🎩', league: 'rubi', desc: 'Gênio do crime — e da tabuada.' },

  // ── ESMERALDA — 10 (magos e mentes complexas) ────────────────────────────
  { name: 'Doutor Estranho', emoji: '🔮', league: 'esmeralda', desc: 'Viu 14 milhões de respostas possíveis.' },
  { name: 'Yoda',            emoji: '🌿', league: 'esmeralda', desc: 'Calcular, você deve. Errar, não há.' },
  { name: 'Gandalf',         emoji: '🧙', league: 'esmeralda', desc: 'Você não vai passar... sem acertar.' },
  { name: 'Dumbledore',      emoji: '🧙‍♂️', league: 'esmeralda', desc: 'Sabedoria serena nas equações.' },
  { name: 'Walter White',    emoji: '🧪', league: 'esmeralda', desc: 'É a química — e a matemática — exata.' },
  { name: 'Loki',            emoji: '🐍', league: 'esmeralda', desc: 'Trapaceiro genial dos cálculos.' },
  { name: 'Velma',           emoji: '🔍', league: 'esmeralda', desc: 'Jinkies! Resolve o enigma na hora.' },
  { name: 'Lisa Simpson',    emoji: '🎷', league: 'esmeralda', desc: 'A inteligência da família Simpson.' },
  { name: 'Professor Xavier',emoji: '🧠', league: 'esmeralda', desc: 'Lê a resposta antes de você terminar de pensar.' },
  { name: 'L Lawliet',       emoji: '🍰', league: 'esmeralda', desc: 'Raciocina sentado, resolve rápido.' },

  // ── AMETISTA — 8 (gênios clássicos) ──────────────────────────────────────
  { name: 'Rick Sanchez',      emoji: '🥒', league: 'ametista', desc: 'O cientista mais inteligente do multiverso.' },
  { name: 'Leonardo da Vinci', emoji: '🎨', league: 'ametista', desc: 'Arte, ciência e engenharia numa mente só.' },
  { name: 'Galileu Galilei',   emoji: '🔭', league: 'ametista', desc: 'E, ainda assim, ela se move.' },
  { name: 'Arquimedes',        emoji: '🛁', league: 'ametista', desc: 'Eureka! Achou a resposta na banheira.' },
  { name: 'Pitágoras',         emoji: '📐', league: 'ametista', desc: 'O dono do teorema mais famoso.' },
  { name: 'Aristóteles',       emoji: '🏛️', league: 'ametista', desc: 'Lógica pura aplicada em cada resposta.' },
  { name: 'Sócrates',          emoji: '🗨️', league: 'ametista', desc: 'Só sei que nada sei... menos a tabuada.' },
  { name: 'Euclides',          emoji: '📏', league: 'ametista', desc: 'Pai da geometria, mestre dos números.' },

  // ── PÉROLA — 7 (cientistas revolucionários) ──────────────────────────────
  { name: 'Charles Darwin',   emoji: '🐢', league: 'perola', desc: 'Adaptou-se até dominar a tabuada.' },
  { name: 'Ada Lovelace',     emoji: '💾', league: 'perola', desc: 'A primeira programadora da história.' },
  { name: 'Marie Curie',      emoji: '☢️', league: 'perola', desc: 'Dois Nobel — brilha de conhecimento.' },
  { name: 'Alan Turing',      emoji: '💻', league: 'perola', desc: 'Decifrou códigos impossíveis.' },
  { name: 'Isaac Newton',     emoji: '🍎', league: 'perola', desc: 'A maçã caiu e a resposta também.' },
  { name: 'Katherine Johnson',emoji: '🚀', league: 'perola', desc: 'Calculou a NASA até a Lua.' },
  { name: 'John von Neumann', emoji: '🖥️', league: 'perola', desc: 'Calculava mais rápido que os computadores da época.' },

  // ── OBSIDIANA — 5 (lendas da matemática) ─────────────────────────────────
  { name: 'Carl Friedrich Gauss', emoji: '👑', league: 'obsidiana', desc: 'O Príncipe da Matemática, de cabeça.' },
  { name: 'Leonhard Euler',       emoji: '🌀', league: 'obsidiana', desc: 'Resolveu de cabeça o que ninguém resolvia no papel.' },
  { name: 'Srinivasa Ramanujan',  emoji: '✨', league: 'obsidiana', desc: 'Via fórmulas em sonhos — e acertava.' },
  { name: 'Emmy Noether',         emoji: '🔗', league: 'obsidiana', desc: 'Redefiniu a álgebra moderna.' },
  { name: 'Grace Hopper',         emoji: '⚙️', league: 'obsidiana', desc: 'Depurou o primeiro bug — e toda conta errada.' },

  // ── DIAMANTE — 4 (o topo absoluto — vivem dentro do jogo) ────────────────
  { name: 'Terence Tao',      emoji: '🏆', league: 'diamante', desc: 'Prodígio que virou o maior matemático vivo.' },
  { name: 'Richard Feynman',  emoji: '🎻', league: 'diamante', desc: 'Explicava o universo — e a tabuada — brincando.' },
  { name: 'John Nash',        emoji: '🎯', league: 'diamante', desc: 'Uma mente brilhante — e implacável.' },
  { name: 'Albert Einstein',  emoji: '🧠', league: 'diamante', desc: 'Tudo é relativo, menos o acerto. Joga toda hora — quase impossível de destronar.' },
];
