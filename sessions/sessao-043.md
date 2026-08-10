# Sessão 043 — Tabuada Rush 5.0: redesign completo, consolidação de modos e mascotes

**Data:** 2026-08-09
**Versão:** 3.17.0 → **5.0.0**
**Tipo:** Redesign de produto (visual + IA de navegação + economia + modos) — a maior sessão até hoje

---

## O que aconteceu

Davi abriu a sessão pedindo pra "começar o Tabuada Rush 5.0", copiando o
estilo visual do Duolingo — achava o app com poluição visual (muito emoji,
muita informação, leque de módulos aberto demais desde a 4.0/reversão) e
queria simplificar de verdade, não só re-pintar. A sessão virou um arco
longo com várias voltas — registro cronológico do que mudou e, importante,
do que foi **tentado e depois trocado**, pra próxima sessão não repetir
caminho já andado.

### 1. Design system — duas rodadas

**Rodada 1 (abandonada):** copiar a paleta oficial do Duolingo
(design.duolingo.com) — verde `#58CC02` (feather), azul `#1CB0F6` (macaw),
botões "chunky" com sombra sólida embaixo (efeito de profundidade,
`active:translate-y`). Aplicado em `tailwind.config.js`, `ui/index.jsx`,
Menu, Modos.

**Rodada 2 (atual):** Davi decidiu que só copiar cor do Duolingo não bastava
— pediu paleta PRÓPRIA, com tema "matemática" em vez de cópia de outro app.
Foi criada a paleta **"Caderno Quadriculado"**: fundo papel/creme
`#FBF7EC`, azul-índigo `#3B4FCC` (ink, cor primária), vermelho-caneta
`#D64545` (pen, erro), verde-caneta `#2F9E44` (check, acerto), grafite
`#3A3A3A` no lugar de preto puro. Aplicada nos tokens base
(`tailwind.config.js`, `globals.css`, `ui/index.jsx`) e no Menu.
**Pendente:** Modos/Recompensas/Estatísticas/Loja ainda estão com os tokens
verdes/azuis da rodada 1 (Duolingo) — migração pra "Caderno Quadriculado"
ficou pro próximo bloco (ver Status para retomar).

Os tokens da paleta Duolingo continuam definidos no Tailwind (não foram
removidos) porque telas não migradas ainda dependem deles — remover geraria
classes quebradas.

### 2. Navegação — sidebar + Menu simplificado

- **Sidebar** (`components/Sidebar.jsx`): nav lateral estilo Duolingo, só em
  telas largas (`hidden lg:flex`, breakpoint `lg`). No celular o app
  continua em coluna única, sem sidebar — confirmado via DOM em 1280px
  (visível) e 390px (oculta).
- **Menu (`MenuPage.jsx`) reescrito**: card de perfil passou a ser
  **QI-first** — em vez de Nível/badge/barra de XP, lidera com QI + avatar
  do personagem do Ranking de QI (`getQiInfo`). XP continua existindo
  internamente (multiplicador de modos), só não é mais a informação "de
  capa". O card também **muda de cor conforme o tier do personagem atual**
  (baixo=cinza, médio=azul, alto=violeta, gênio=âmbar) — usa
  `qiInfo.tier.gradient`, que já existia em `TIERS`.
- **Grid de navegação reduzido**: de ~8 botões pro menu principal pra 3
  destinos primários (Modos de Jogo, Recompensas, Estatísticas). Loja +
  Missões + Temporada viraram abas de um hub único (`RewardsPage.jsx`, novo
  arquivo). Recordes + Conquistas + Ranking + Catálogo + Catálogo de
  Precisão + Acertos + Erros viraram seções/abas dentro de `StatsPage.jsx`
  (view-switcher interno, mesmo padrão que já existia pra Acertos/Erros).
- Emoji cru trocado por ícones `lucide-react` na maior parte da UI (Flame,
  Trophy, Coins, Gift, Gamepad2, BarChart2...) — emoji ficou reservado pra
  poucos pontos de personalidade.

### 3. Consolidação de modos — de 10 para 3

A mudança mais estrutural da sessão. Por pedido explícito do Davi
("encurtar o leque"), os modos foram cortados de 10 pra **3**:

- **Rush** — agora é a FUSÃO do que eram Rush + Sobrevivência + Velocidade +
  Desafio Diário: timer que começa em 30s e CRESCE +3s a cada acerto
  (`bonusTime`), 3 vidas, termina com 3 erros OU tempo zerado (o que vier
  primeiro). É o modo que sustenta a ofensiva diária (qualquer partida conta
  pro streak, não só um modo "diário" dedicado). Aposta continua só nele.
- **Zen** — treino livre, sem pressão (mantido).
- **Revisão** — foca nas tabuadas que o jogador mais erra (mantido).

**Removidos por completo** (não só escondidos — deletados de
`constants/index.js`, `GamePage.jsx`, `ModesPage.jsx`, `App.jsx`,
`utils/index.js`): Sobrevivência, Velocidade, Desafio Diário, Difícil,
Recorde Pessoal, Desafio Semanal, Combinado, Inverso.

**Flashcard (SRS) NÃO foi removido** — não é um "modo" de partida, é uma
ferramenta de memorização à parte; continua acessível dentro da seção
Treino do `ModesPage`.

Mecanicamente, a fusão do Rush foi barata de implementar: o reducer do
`GamePage` já suportava `timer` e `lives` simultâneos (não eram mutuamente
exclusivos) — só precisou zerar a checagem `mode === 'survival'` pro
prompt de Vida Extra (`diedFromLives`, agora baseado em `cfg.lives`
genericamente, não no nome do modo).

### 4. Desbloqueio progressivo removido (reversão de D008)

Davi decidiu que travar modo por nível deixava o jogo chato nos primeiros
minutos. `UNLOCK_RULES` (`utils/index.js`) foi simplificado pra
`{ zen: null, rush: null, review: null }` — **tudo liberado desde o
início**. Isso reverte a decisão D008 (sessao-032) — ver DECISIONS.md D016.

### 5. Economia — Loja só com power-ups, mais difícil de ganhar moeda

- **Cosméticos removidos da Loja** (moldura/card/tema de jogo) —
  `constants/shop.js` reescrito só com categoria `powerup`. Molduras/temas
  de card não fazem mais sentido: o painel de perfil agora já muda de cor
  sozinho pelo tier do QI (ver seção 2).
- **2 power-ups novos, com efeito real no jogo** (não é só cosmético):
  - 🛡️ **Escudo** — se ativa sozinho no próximo erro, não perde vida
    (reducer: `WRONG_SHIELDED`, distinto de `WRONG`).
  - 🚀 **Largada Turbo** — começa o Rush já com +10s no relógio (consumido
    via `useEffect` on-mount, dispatch `ADD_TIME` com `amount` parametrizado
    — antes só aceitava 60s fixo).
- **"Oferta da Semana" removida** — só existia pra descontar cosméticos, que
  não existem mais.
- **Moedas mais difíceis de ganhar**: cap por partida caiu de 15→8, taxa de
  0.3→0.15 por acerto. **Zen não gera XP nem moeda nenhuma** (era 0.10antes)
  — treino puro, sem recompensa, por pedido explícito do Davi.

### 6. Ranking de QI — 104 → 52 personagens

`constants/characters.js`: cortado quase pela metade (13 por tier, mantidos
os mais reconhecíveis de cada grupo) — Davi achou 104 níveis "muita coisa".
`computeQI`/`getQiInfo` não precisaram de mudança (mapeiam por
`CHARACTERS.length` dinamicamente).

### 7. Mascotes — Tuca e Vupt

Provavelmente o capítulo mais longo da sessão. Percurso completo, na ordem:

1. **Primeira ideia (descartada):** vilão "O Resto" — personagem humanoide
   de pedra rachada, tema "resto de divisão". Davi achou visual "adulto
   demais" (estilo Dark Souls) pra um app infantil, e depois decidiu que
   queria mascote de VERDADE (like a coruja do Duolingo), não personagem
   criado do zero.
2. **Direção final:** fábula da Lebre e a Tartaruga (domínio público, zero
   risco de direito autoral, e a moral da história — pressa sem cuidado
   perde pra constância — encaixa direto na psicologia do Rush).
   - **Tuca** 🐢 — tartaruga sábia e idosa, acompanha Zen/Revisão
     (paciência, sem pressa).
   - **Vupt** 🐇 — lebre apressada e convencida, acompanha o Rush (te
     desafia a ser rápido, mas erra por excesso de confiança — ironia da
     fábula).
3. **Recusa explícita**: Davi pediu pra usar fotos REAIS de personagens
   famosos no Ranking de QI — recusado (violação de direito autoral/imagem;
   o sistema já usa só nome+emoji por design, documentado no próprio
   `characters.js`).
4. **Arte**: gerada por Davi via ChatGPT (imagens estáticas) e Pika
   (animação image-to-video, login com Google pra evitar verificação de
   e-mail que travou no Rive/DragonBender). Testamos e descartamos: Rive
   (travou no login), DragonBones (idem), Canva (tenho conector, mas só
   anima a imagem inteira — mesmo problema de "imagem tremendo" que o Davi
   já tinha reclamado), SVG desenhado à mão por mim (qualidade muito abaixo
   da arte gerada, descartado após 2 tentativas).
5. **Pipeline de processamento** (novo, reutilizável): os vídeos do Pika
   vêm com fundo branco + marca d'água "Pippit AI". Escrevi um pipeline em
   Python (`opencv-python-headless`, `Pillow`, `imageio`/`imageio-ffmpeg`
   instalados via pip nesta sessão — não havia `ffmpeg` no sistema) que:
   pinta a marca d'água, faz flood-fill a partir dos 4 cantos com
   `FLOODFILL_FIXED_RANGE` (importante: sem essa flag o preenchimento
   "vaza" por bordas anti-aliased e come partes claras do personagem, ex.
   a barba branca do Tuca), limpeza morfológica (`MORPH_OPEN` + manter só o
   maior componente conectado) pra tirar ruído residual, recorte pelo
   bounding-box UNIÃO de todos os frames (não por frame — senão o WebP
   anima com dimensões inconsistentes e quebra), e exporta como WebP
   animado com alpha (`Image.save(..., save_all=True, format="WEBP")`).
   Arquivos ficam em `src/assets/mascots/`.
6. **Poses obtidas** (todas processadas e no jogo): `vupt-cocky` (batendo o
   pé, braço cruzado), `vupt-peek-villain` (espiando com cara de má, versão
   corrigida — a primeira tinha expressão fofa demais pro papel de vilã),
   `vupt-thumbsup` (joinha verde genérica), `tuca-idle`, `tuca-glasses`
   (ajustando óculos), `tuca-reading` (lendo livro). **`vupt-run` (a lebre
   correndo) foi REMOVIDA do código por pedido do Davi** — não é mais usada
   em lugar nenhum.
7. **Integração** (`components/Mascot.jsx`): cada modo mapeia humor →
   pose específica (`rush.byMood.slow → cocky`, `.insane → peek-villain`,
   `.correct → thumbsup`; `zen/review.byMood.slow → glasses`,
   `.correct → reading`). Sem pose específica pro humor = não aparece nada
   (em vez de cair num "genérico" — foi assim que a `vupt-run` foi
   efetivamente desligada sem precisar remover a lógica de humor toda).
   Renderizado via **portal do React** (`createPortal` em `document.body`)
   — necessário porque `position: fixed` dentro de uma árvore com
   `motion.div` (Framer Motion aplica `transform`) vira relativo ao
   ancestral transformado, não à viewport; o portal escapa disso.
   Posição: fixo na borda direita da tela, 224px, "vazando" pra fora em
   telas estreitas — de propósito, replicando a referência que o Davi
   mandou via screenshot.
8. **Frequência controlada**: mascote NÃO aparece mais toda pergunta (era o
   bug mais incômodo pro Davi). `mascotShowCountRef` + `maybeMascot()` em
   `GamePage.jsx`: em modos com tempo (`cfg.timer !== null`, ou seja Rush)
   no máximo 2 aparições por partida; em modos sem tempo (Zen/Revisão) até
   6. Cada oportunidade de trigger só vira aparição real se passar por um
   sorteio (`chance = 0.4`) E ainda não bateu o teto — espalha as
   aparições pela partida em vez de sempre nas primeiras oportunidades.
9. **Balão de fala + voz DESLIGADOS por pedido do Davi** — estavam
   atrapalhando. O código de voz (`window.speechSynthesis`, placeholder
   gratuito) e o balão de texto (`LINES` por humor) foram REMOVIDOS do
   `Mascot.jsx` (não só comentados) — Davi vai mandar as frases finais e
   áudio de verdade depois; quando isso vier, reimplementar do zero.
10. **Modo História** — discutido em profundidade (parceria narrativa
    infinita, dificuldade que expande conforme domínio do jogador via
    `tableStats`, aproveitando sistemas que já existiam) mas
    **explicitamente pausado** por decisão do Davi ("apagar esse negócio de
    muita história e parar") — não foi implementado nada de código pra
    isso. Ver DECISIONS.md D018.
11. **Pendente pra próxima sessão**: tamanho/posição exatos do mascote
    (Davi vai mandar imagens de referência mostrando escala/posição
    precisas — a versão atual, 224px fixo na borda, é uma aproximação
    "boa o suficiente por ora", não confirmada); 2 poses que davi queria
    (thumbs-up e peek-villain corrigidos) já vieram — confirmar se batem;
    frases finais + áudio de verdade.

---

## Descoberta de ambiente (não é bug do app)

O painel de preview (Browser pane) desta sessão do Claude Code **não
compõe frames** (`screenshot` falha com "the Browser pane is not
displayed") e cliques via `computer`/dispatch de evento não produzem
navegação observável — testado exaustivamente (ref click, coordinate
click, dispatch de MouseEvent nativo, chamada direta do handler React) em
abas novas e servidor reiniciado, sempre com o mesmo resultado. Leitura
(`get_page_text`, `read_page`, `javascript_tool` pra inspecionar DOM/CSS)
funciona normalmente. Toda verificação visual desta sessão foi feita por
build limpo (`npm run build`) + inspeção de DOM via JS + screenshots que o
próprio Davi mandou do navegador dele. **Recomendação pra próxima sessão:**
não tentar `computer{screenshot}`/clique nesse ambiente — ir direto pra
build + pedir confirmação visual ao Davi.

---

## Arquivos alterados (principais)

| Arquivo | Mudança |
|---------|---------|
| `tailwind.config.js` | Tokens Duolingo + tokens "Caderno Quadriculado" (paper/ink/pen/check/graphite), sombras chunky |
| `src/styles/globals.css` | `--primary`/`--background`/etc. apontam pra paleta nova |
| `src/components/ui/index.jsx` | Button/Card/Badge recalibrados (chunky press, paleta nova) |
| `src/components/Sidebar.jsx` | **novo** — nav lateral desktop-only |
| `src/components/Mascot.jsx` | **novo** — sistema de mascote (portal, poses por humor, sem balão/voz) |
| `src/pages/MenuPage.jsx` | Card QI-first, paleta nova, nav reduzida a 3 destinos |
| `src/pages/ModesPage.jsx` | Reescrito — só Rush + Zen/Revisão (+ Flashcard) |
| `src/pages/RewardsPage.jsx` | **novo** — hub com abas Missões/Loja/Temporada |
| `src/pages/StatsPage.jsx` | Absorveu Catálogo/Precisão/Acertos/Erros/Recordes/Conquistas como abas internas |
| `src/pages/ShopPage.jsx` | Reescrito — só power-ups, sem cosmético |
| `src/pages/GamePage.jsx` | Reducer com `WRONG_SHIELDED`, `ADD_TIME` parametrizado, gatilho "slow" (3s), `maybeMascot`/frequência |
| `src/constants/index.js` | `MODES` reduzido a rush/zen/review; `ACHIEVEMENTS.all_modes` threshold 4→3 |
| `src/constants/characters.js` | 104 → 52 personagens |
| `src/constants/shop.js` | Reescrito — só `powerup`, +shield +headstart |
| `src/utils/index.js` | `UNLOCK_RULES` simplificado (tudo liberado) |
| `src/App.jsx` | Rotas atualizadas (RewardsPage, remoção de rotas órfãs), `bettable` só rush, `MODE_XP_MULT` reduzido |
| `src/assets/mascots/*.webp` | **novos** — 6 poses processadas (cocky, peek-villain, thumbsup, idle, glasses, reading) |
| `sessions/sessao-043.md` | este arquivo |

---

## Verificação

- `npm run build`: ✅ limpo em toda a sessão (rodado dezenas de vezes ao
  longo dos blocos, sempre 0 erros)
- Sem verificação de clique/screenshot possível neste ambiente (ver seção
  "Descoberta de ambiente" acima) — confirmação visual feita pelo próprio
  Davi via screenshots do navegador dele
- `grep` de sanidade: nenhuma referência solta a `MODES.survival`/`.speed`/
  `.daily`/`.hard`/`.personal`/`.weekly`/`.combined`/`.inverse` sobrou no
  código após a consolidação

---

## Status para retomar

**Pendências diretas (já sinalizadas ao Davi, sem ambiguidade):**
1. Migrar Modos/Recompensas/Estatísticas/Loja pra paleta "Caderno
   Quadriculado" (ainda estão com os tokens verdes/azuis do Duolingo).
2. Reorganizar `StatsPage` de verdade (virou um catch-all de várias telas
   antigas — Davi já sinalizou que "ainda tá bagunçada").
3. Tamanho/posição final do mascote — esperando imagens de referência do
   Davi.
4. Reativar balão de fala + voz quando o Davi mandar as frases finais e
   áudio gravado/gerado.
5. Painel de perfil temático por PERSONAGEM específico (não só por tier) —
   Davi quer, por exemplo, "painel do Goku" quando o QI cair nesse
   personagem. Estrutura ainda não criada — precisa de cor/tema por
   personagem (52 combinações) ou de outra lógica de derivação.

**Em aberto, sem decisão ainda:**
- Economia de moedas/aposta — Davi disse abertamente "não sei o que fazer,
  precisa ser uma ideia muito boa". Só os power-ups novos foram resolvidos;
  o resto (o que MAIS faz sentido cobrar/recompensar com moeda) segue em
  aberto.
- `ACHIEVEMENTS` com `survival_30`/`speed_20`/`daily_first`/`daily_7` —
  referenciam stats que pararam de incrementar (modos removidos). Ficam
  pra sempre inalcançáveis pra quem não desbloqueou antes. Não foram
  tocadas — decisão de conquistas, não de modos, fora do escopo desta
  sessão.
- `vupt.png`/`tuca.png` (as imagens estáticas originais, pré-animação)
  seguem em `src/assets/mascots/` sem uso no código — inofensivo, mas pode
  ser limpo numa faxina futura.

**Modo História:** pausado por decisão explícita do Davi — não é
prioridade, não tem código nenhum implementado. Ver DECISIONS.md D018 se
a ideia voltar à mesa um dia.

**Próxima sessão — ordem sugerida:** (1) receber imagens de referência de
posição/tamanho do mascote e ajustar, (2) migrar paleta nas telas
restantes, (3) reorganizar Estatísticas, (4) só depois voltar pra discussão
de economia (é a mais aberta/difícil das pendências).
