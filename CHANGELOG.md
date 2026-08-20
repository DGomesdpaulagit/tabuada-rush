# 📝 CHANGELOG

Todas as mudanças notáveis do projeto são documentadas aqui.

---

## [6.0.9] — 2026-08-17 — Ícones do Davi no lugar dos emoji

**Detalhes em `sessions/sessao-059.md` e `DECISIONS.md` (D037).**

### Adicionado
- 22 ícones de arte própria em `src/assets/icons/` (ofensiva, moedas, vidas,
  XP, arena, ligas, missões, loja, pódio, baú, divisão bloqueada, missão
  travada e os 10 escudos de divisão)
- Componente `GameIcon` / `LeagueIcon`

### Alterado
- Header, Sidebar, Ligas, Perfil, Loja, Missões, Jogo, Recompensas e
  Temporadas passam a usar a arte no lugar de emoji/ícones da lucide
- Faixa de tabuada segue com emoji (pedido do Davi)

---

## [6.0.8] — 2026-08-17 — Correções visuais das Ligas + emoji quebrado no Windows

**Detalhes em `sessions/sessao-058.md` e `DECISIONS.md` (D036).**

### Corrigido
- Caixa "Zona de promoção" com o texto rachando no meio de "(693 XP)"
- Escudo da divisão cortado pela metade (`justify-center` corta pela
  esquerda quando o conteúdo transborda)
- Emoji que não existe na fonte do Windows 10 e aparecia como `□` — 33
  ocorrências, incluindo a moeda 🪙 que eu mesmo tinha introduzido na
  v6.0.4 (agora 💰)
- `leading-none` cortando o glifo de emoji no Header/Perfil/Estatísticas
- Altura do header duplicada em dois lugares e fora de sincronia — virou a
  variável única `--header-h`

---

## [6.0.7] — 2026-08-17 — Ligas em 2 colunas; a lista rola, a página não

**Detalhes em `sessions/sessao-057.md` e `DECISIONS.md` (D035).**

### Alterado
- Tela de Ligas em 2 colunas no desktop: escudos + bloco da divisão ficam
  **fixos**, e a classificação rola dentro da própria caixa (a página não
  desce mais). No celular segue empilhado com rolagem normal de página
- Container do App vai a `max-w-5xl` só na tela de Ligas

### Adicionado
- Painel lateral na tela de Ligas: "Sua corrida" (quem está logo acima, XP
  que falta pra passar, e a vantagem sobre quem vem atrás) + status da zona
  de promoção
- Ficha do personagem: clicar numa linha da classificação abre a ficha dele
  no topo do painel, com a descrição que cada um dos 114 personagens já
  tinha e nunca aparecia

### Corrigido
- Scroll horizontal de 4px na tela de Ligas (era a barra de rolagem
  vertical encolhendo a largura útil)

---

## [6.0.6] — 2026-08-17 — Ligas copiada da referência; ferramentas de verificação

**Detalhes em `sessions/sessao-056.md` e `DECISIONS.md` (D034).**

### Alterado
- Tela de Ligas refeita seguindo a referência à risca: escudos das divisões
  no topo **sem rótulo de texto** (a colisão "letra em cima do ícone" vinha
  daí), nome da divisão grande e centralizado, "Os N primeiros avançam pra
  próxima divisão.", prazo do ciclo em dias, e a classificação

### Removido
- Card "Liga X de 10 / sua posição Nº de M" da tela de Ligas

### Adicionado
- `getCycleDaysRemaining()` em `utils/leagues.js` — dias até o ciclo virar
- Atalho `?screen=<tela>` **só em DEV** (`App.jsx`) pra abrir qualquer tela
  direto; removido do build de produção pelo Vite

---

## [6.0.5] — 2026-08-17 — Ligas em carrossel horizontal; Header no canto superior direito

**Detalhes em `sessions/sessao-055.md` e `DECISIONS.md` (D033).**

### Alterado
- Tela de Ligas: escada vertical virou carrossel horizontal rolável
  (fileira de divisões no topo, roster embaixo, sem modal)
- Header: grupo de indicadores saiu do centro e foi pro canto superior
  direito da tela

### Pendente
- Troca dos ícones de ofensiva/moedas/vidas pelas imagens que o Davi
  forneceu — bloqueada até ele colocar os arquivos no projeto (ver D033)

---

## [6.0.4] — 2026-08-17 — Header maior com painéis no hover (estilo Duolingo)

**Detalhes em `sessions/sessao-054.md` e `DECISIONS.md` (D032).**

### Alterado
- Barra superior (`Header.jsx`) ficou mais alta (70px, era ~48px)
- Faixa de tabuada saiu da ponta esquerda isolada e virou a 1ª pill do
  mesmo grupo de ofensiva/moedas/vidas — grupo centralizado
- Ícone de moedas trocou de `Coins` (lucide) pra 🪙, consistente com o resto
  do app

### Adicionado
- Painel ao passar o mouse (ou tocar) em qualquer uma das 4 pills, cada um
  com botão de ação real: Faixa → progresso até a próxima + "Ver perfil";
  Ofensiva → semana atual + próxima conquista de ofensiva real + "Ver
  perfil"; Moedas → saldo + "Ir pra loja"; Vidas → corações + tempo até
  reabastecer + botão funcional "Recuperar vidas" (150 moedas)

---

## [6.0.3] — 2026-08-17 — Escada de Ligas (ver outras ligas, bloqueada por progresso)

**Detalhes em `sessions/sessao-053.md` e `DECISIONS.md` (D031).**

### Adicionado
- Tela de Ligas reescrita como escada vertical (Bronze embaixo → Diamante no
  topo). Toca num degrau desbloqueado pra abrir uma folha com o roster
  completo + zona de promoção/rebaixamento daquela liga
- `leagueHighestId` — liga mais alta já alcançada (só sobe, nunca desce com
  rebaixamento); controla o que fica desbloqueado na escada. Saves antigos
  se auto-curam no load

### Alterado
- Ligas acima da mais alta já alcançada ficam bloqueadas (cadeado, sem nome
  nem roster visível)

---

## [6.0.2] — 2026-08-17 — Recalibração completa das Ligas

**Detalhes em `sessions/sessao-052.md` e `DECISIONS.md` (D030).**

### Alterado
- Curva de XP das faixas de tabuada recalculada (âncoras do Davi: 1ª faixa 9
  meses, última faixa ~28,5 meses no total)
- Personagens por liga: 114 no total, decrescendo de 20 (Bronze) a 4 (Diamante)
  — era fixo em 10/liga. Einstein migrou de Pérola pra Diamante.
- Zonas de promoção decrescentes (8 no Bronze até 0 na Diamante)
- `leagueMultiplier` esticado (0.7×-2.2×) — ligas altas ficam de fato muito
  mais difíceis com pote menor de personagens
- Promoção/rebaixamento de liga agora avaliado por CICLO GLOBAL de 6 dias
  (era a cada partida) — XP dos personagens atualiza a cada 12h

### Adicionado
- 9 conquistas novas por liga alcançada (Prata até Diamante)
- Bônus de +25% XP enquanto no pódio (top 3) da liga Diamante

### Removido
- `checkInactivityRelegation`/grace-period manual (D027, sessão 051) — o
  modelo de ciclo de 6 dias já resolve o mesmo problema de forma mais robusta

---

## [6.0.1] — 2026-08-17 — Limpeza dos débitos conhecidos do reset 6.0

**Detalhes em `sessions/sessao-051.md` e `DECISIONS.md` (D027-D029).**

### Adicionado
- Rebaixamento de liga por inatividade reintroduzido, com grace period de 3 dias
  (`leagueEnteredAt`, `checkInactivityRelegation`) — corrige a causa raiz do bug
  de "ping-pong" do Bloco 4 em vez de deixar a feature removida
- Pódios nas ligas (`data.leaguePodiums`) — card novo no Perfil, toast ao conquistar

### Corrigido
- `HitsPage`/`ErrorsPage`/`AccuracyCatalogPage` ainda citavam modos removidos desde
  a 5.0 (Sobrevivência/Velocidade/Diário) nos filtros — trocado por Rush/Zen/Revisão

### Nota
- Calibração de XP/Ligas (D022/D023) permanece como estimativa — não é algo que se
  "termina" em código, só com dados reais de uso ao longo do tempo (ver DECISIONS.md)

---

## [6.0.0] — 2026-08-17 — Tabuada Rush 6.0: Bloco 7/7 (Estatísticas) — RESET COMPLETO

**Último bloco do reset 6.0. Detalhes em `sessions/sessao-050.md` e `DECISIONS.md` (D026).**

### Adicionado
- Guia lateral tipo Notion na tela de Estatísticas (`TableOfContents` em
  `StatsPage.jsx`) — navegação direta por seção, só em telas largas.
  Implementado sem a referência visual que o Davi ia mandar (nunca chegou) —
  ver D026.

### Removido
- "Partidas por modo", "Power-ups" (estoque) e "Modo Favorito" — removidos de
  vez da tela principal de Estatísticas (pedido explícito do Davi)

### Alterado
- Acertos/Erros deixam de ser destinos soltos e viram sub-seções do Catálogo
  de Precisão (`AccuracyCatalogPage.jsx`)

### Corrigido
- Gráfico "Evolução" filtrava por um modo morto desde a 5.0 (`'daily'`) e
  nunca mostrava dado nenhum — corrigido pra `'rush'` (modo principal atual)
- `MODES_META` do Catálogo de Precisão referenciava modos removidos
  (survival/speed/daily) — trocado pra rush/zen/review

---

**Reset 6.0 completo — todos os 7 blocos entregues (sessões 044-050):** base
visual, vidas diárias, progressão de tabuada, ligas, missões, perfil completo,
estatísticas. Ver `DECISIONS.md` D020-D026 pro histórico completo de decisões.

---

## [6.0.0-bloco6] — 2026-08-17 — Tabuada Rush 6.0: Bloco 6/7 (Perfil completo)

**Detalhes em `sessions/sessao-049.md` e `DECISIONS.md` (D025).**

### Adicionado
- `PerfilPage` completa: faixa de tabuada + liga/posição, stats resumidas,
  "no jogo desde" (`data.createdAt`, novo), acesso a Conquistas/Recordes/Catálogo
  (migraram de dentro da StatsPage pra dentro do Perfil)

### Removido
- **Sistema antigo de "QI" removido por completo** (`computeQI`/`getQiInfo` de
  `utils/index.js`, `src/constants/characters.js` inteiro) — não só trocado de
  tela, deletado do repositório. Substituído por Faixa de tabuada + Liga em
  toda parte que antes mostrava QI (Menu, Perfil, Settings, Results, Catalog).
  Opção "+5 de QI" removida do modal de recompensa de ofensiva.

---

## [6.0.0-bloco5] — 2026-08-17 — Tabuada Rush 6.0: Bloco 5/7 (Missões)

**Detalhes em `sessions/sessao-048.md` e `DECISIONS.md` (D024).**

### Removido
- Missões semanais (pool, lógica, aba na UI) — deletadas por completo

### Adicionado
- Desafios mensais com aceite + penalidade: `acceptChallenge`/`freezeChallenge`/
  `resolveChallenges` (`utils/missions.js`) — aceitar é opcional, mas depois de
  aceito, não cumprir até o prazo desconta `penalty` do saldo (**pode ficar
  negativo**, quitado automaticamente do próximo ganho — testado e confirmado)
- Power-up "Congelar Missão" repropositado: agora estende +10 dias o prazo de um
  desafio mensal aceito (antes pausava uma diária por 24h — diárias não têm mais
  risco, não fazia mais sentido nelas)

### Alterado
- Metas dos desafios mensais revisadas pra baixo (eram pensadas pra um sistema sem
  risco — ex. 250 partidas/mês —, com penalidade vinculada isso garantiria falha
  pra quase todo jogador). Ver D024.
- `MissionsPage.jsx` — 2 abas (Diárias/Mensais), mensal mostra "Aceitos" e
  "Disponíveis pra aceitar"

### Corrigido
- Removido o tipo de missão `'daily'` ("Complete o Desafio Diário"), morto desde
  que esse modo foi fundido no Rush na 5.0 — era matematicamente impossível de
  completar (mesma classe de bug já registrada pras conquistas
  `survival_30`/`speed_20`)
- **B010 (hotfix pós-deploy)** — app travava ao abrir pra quem tinha dado salvo de
  antes deste bloco (`missionsData.monthly` no formato antigo não migrava se o mês
  batesse, e quebrava o `AppProvider` inteiro). Ver `BUGS.md` B010.

---

## [6.0.0-bloco4] — 2026-08-17 — Tabuada Rush 6.0: Bloco 4/7 (Ligas)

**Detalhes em `sessions/sessao-047.md` e `DECISIONS.md` (D023).**

### Adicionado
- `constants/leagues.js` — 10 ligas (Bronze→Diamante) × 10 personagens (100 no total)
- `utils/leagues.js` — motor da competição: XP simulado por personagem (janela
  rolante de 14 dias, oscila dia a dia), classificação, promoção/rebaixamento

### Alterado
- `RankingPage.jsx` ("Ligas" na sidebar) — deixa de mostrar posição estática numa
  lista de personagens e passa a mostrar a liga atual, competidores e zonas de
  promoção/rebaixamento
- Toast de "subiu de classificação no Ranking de QI" virou toast de promoção/
  rebaixamento de liga

### Corrigido (durante a implementação, antes de qualquer commit)
- Bug de "ping-pong" de liga — promover e checar de novo no load do app
  rebaixava de volta um jogador que tinha acabado de ser promovido, sem ele
  ter jogado nada. Promoção/rebaixamento agora só é avaliado em fim de
  partida (ver D023).

**Nota de escopo:** o sistema antigo de Ranking de QI (`getQiInfo`) não foi
removido — continua alimentando 5 telas que ainda não passaram pelo reset 6.0
(Menu, Perfil, Settings, Results, Catalog). Ver D023.

---

## [6.0.0-bloco3] — 2026-08-17 — Tabuada Rush 6.0: Bloco 3/7 (Progressão de tabuada)

**Detalhes em `sessions/sessao-046.md` e `DECISIONS.md` (D022).**

### Alterado
- `LEVELS` (`constants/index.js`) — os 28 níveis abstratos viram 20 faixas de
  tabuada literais (2×10, 10×20 ... 190×200), com `rangeMin`/`rangeMax` novos.
  Calibração de XP é estimativa documentada (sem telemetria real ainda).
- `utils/getRandomQuestion`/`generateQuestion` — novo parâmetro `tierRange`: o
  fator `a` das perguntas passa a vir da faixa atual do jogador, não de um pool
  fixo 2-10/12. **Confirmado com o Davi que o fator vai até 200 de verdade**,
  ciente da tensão com o princípio "só tabuada tradicional" (ver D022).
- `Header` — selo de nível mostra a faixa real (ex. "2×10") em vez de número
  abstrato.

---

## [6.0.0-bloco2] — 2026-08-17 — Tabuada Rush 6.0: Bloco 2/7 (Vidas diárias)

**Detalhes em `sessions/sessao-045.md` e `DECISIONS.md` (D021).**

### Adicionado
- Pote de vidas diárias (5, estilo Duolingo) — `data.livesData`, `utils/getLivesInfo`
- `NoLivesModal` (`App.jsx`) — bloqueia início de partida em qualquer modo quando o
  pote zera; oferece reposição por 150 moedas (enche o pote inteiro, não vida a vida)
- `GamePage` — prop `onWrongAnswer`, desconta o pote diário em todo erro real
  (qualquer modo, inclusive Zen), em paralelo ao sistema de vidas por partida
  existente (que não foi alterado — ver D021)

### Alterado
- `Header` — contador de vidas deixa de ser placeholder, mostra o pote real

---

## [6.0.0-bloco1] — 2026-08-16 — Tabuada Rush 6.0: reset completo (planejamento + Bloco 1/7)

**Reset total pedido pelo Davi após insatisfação com a 5.0. Escopo inteiro documentado em
`sessions/planejamento-6.0.md`. Detalhes desta sessão em `sessions/sessao-044.md` e
`DECISIONS.md` (D020).**

### Adicionado
- `sessions/planejamento-6.0.md` — spec completa do reset (Design, Ligas, Vidas,
  Progressão de tabuada, Missões/desafios mensais, Perfil, Estatísticas), organizada
  por bloco de implementação
- Sistema de tokens de cor semânticos dark-first via CSS var (`background/surface/
  surface-2/border/fg/fg-muted/accent/accent-dark/streak/coin/danger/success`)
- `components/Header.jsx` — barra superior persistente (faixa/ofensiva/moedas/vidas)
- `pages/PerfilPage.jsx` — novo destino de navegação (resumo mínimo por ora)

### Alterado
- **Tema escuro é o padrão do app** (era claro) — `lib/prefs.js`
- Sidebar: 5 destinos primários (Arena/Ligas/Missões/Loja/Perfil), substituindo os
  antigos (Início/Modos/Recompensas/Estatísticas/Ranking QI)
- `Button`/`Card`/`Badge` (`components/ui`) migrados pros tokens semânticos novos
- Bege removido do fundo do tema claro

### Corrigido
- **B009** — caixa "Partidas/Melhor Seq./Acertos" na Arena, ilegível no tema escuro
  (fundo e texto quase da mesma cor — tokens custom sem override de tema escuro)

---

## [5.0.0] — 2026-08-09 — Tabuada Rush 5.0: redesign, consolidação de modos, mascotes

**A maior sessão até hoje. Detalhes completos em `sessions/sessao-043.md` e `DECISIONS.md` (D015-D019).**

### Adicionado
- Paleta própria "Caderno Quadriculado" (papel/índigo/vermelho-caneta/verde-caneta) — tokens `paper`/`ink`/`pen`/`check`/`graphite` no Tailwind
- Sidebar de navegação (`components/Sidebar.jsx`) — desktop-only (`lg+`), some no mobile
- Card de perfil QI-first no Menu, muda de cor conforme o tier do personagem do Ranking de QI
- `RewardsPage.jsx` — hub único com abas Missões/Loja/Temporada
- Mascotes **Tuca** (tartaruga) e **Vupt** (lebre), inspirados na fábula de Esopo — animações reais (WebP com transparência), pose por humor do jogo (`components/Mascot.jsx`), renderizados via portal fixo na borda direita da tela
- Pipeline Python de processamento de vídeo (remoção de fundo, limpeza de ruído, export WebP animado) — reutilizável para futuras poses
- 2 power-ups novos: 🛡️ Escudo (protege de 1 erro) e 🚀 Largada Turbo (+10s no início do Rush)
- Gatilho de "cutucada" no Rush/Zen/Revisão: mascote aparece (com frequência limitada e sorteada) quando o jogador demora, acerta combo, ou erra por pressa

### Alterado
- **Modos de jogo: 10 → 3.** Rush agora é a fusão de Rush+Sobrevivência+Velocidade+Diário (timer que cresce com acerto, 3 vidas). Zen e Revisão mantidos como eram.
- **Todos os modos liberados desde o início** — reverte o desbloqueio progressivo (D008/sessao-032)
- Ranking de QI: 104 → 52 personagens
- Loja: só power-ups agora — cosméticos (moldura/card/tema) removidos
- Economia mais dura: moedas por partida caem (cap 15→8), Zen não dá XP nem moeda
- `StatsPage` absorveu Catálogo, Catálogo de Precisão, Acertos, Erros, Recordes e Conquistas como seções internas

### Removido
- Modos Sobrevivência, Velocidade, Desafio Diário, Difícil, Recorde Pessoal, Desafio Semanal, Combinado, Inverso (deletados do código, não só escondidos)
- Cosméticos da Loja (molduras, temas de card, temas de tela de jogo) e a "Oferta da Semana"
- Balão de fala e voz do mascote (temporário — voltam quando as frases finais/áudio real forem definidos)

---

## [3.17.0] — 2026-07-06 — Reversão da 4.0: de volta ao foco (só multiplicação)

**Decisão estratégica do Davi. Detalhes em `sessions/sessao-042.md` e `DECISIONS.md` (D014).**

### Removido
- **Soma, Subtração e Divisão** — o Tabuada Rush voltou a ser exclusivamente
  sobre multiplicação (o propósito original do projeto). Removidos: registro
  `OPERATIONS.add/.sub/.div`, seletor de operação, abas de operação no Mapa
  de Domínio/Certificados, radar "Domínio por Operação", certificado
  "Matemática Fundamental Completa", bônus de amplitude no QI.

### Mantido (intacto — não foi uma reversão total da 4.0)
- Curva de esquecimento (`predictRecallProbability`/`getFactsAtRisk`)
- Motor preditivo no Modo Revisão (componente de "staleness")
- Banner "Fatos a Vencer" + lembrete local
- Viés adaptativo por fatos fracos em Rush/Sobrevivência/Velocidade/Zen +
  toggle "Foco em Fraquezas"

### Por quê
O objetivo original — decorar a tabuada — é específico e mensurável.
"Ser bom em matemática" (4 operações) não era. A amplitude de operações
foi descartada; a inteligência adaptativa (que serve a multiplicação)
ficou.

---

## [3.16.1] — 2026-07-06 — Remoção do Leaderboard Global

**Pequena iteração, fora de roadmap. Detalhes em `sessions/sessao-041.md`.**

### Removido
- **Leaderboard Global** — página, botão no menu, e upload de score
  (Supabase) para Desafio Diário/Semanal, removidos por completo (pedido
  direto do Davi). Desafio Diário e Semanal continuam existindo como
  modos, só sem comparação global entre jogadores.

---

## [3.16.0] — 2026-07-06 — TABUADA RUSH 4.0 · FASE 6 · 🎉 ROADMAP 4.0 COMPLETO

**Perfil de Domínio Unificado — última fase da 4.0. Detalhes em `sessions/sessao-040.md`.**

### Adicionado
- **`computeOperationMastery`**: resume o domínio do jogador nas 4 operações
  (dominado/total/% cada) — base dos itens abaixo.
- **Certificado "Matemática Fundamental Completa"** — só desbloqueia com
  TODOS os certificados de domínio completos nas 4 operações. Card
  dedicado no topo da tela de Conquistas.
- **`computeQI` pesa amplitude**: novo componente (0-10 pontos) pela média
  de domínio nas 4 operações — só ADITIVO, não reduz nenhum peso existente.
- **Radar "Domínio por Operação"** no Catálogo de Precisão — visão
  consolidada das 4 operações antes do detalhe por aba.

### 🎉 Roadmap 4.0 completo
Com as 6 fases entregues (v3.11.0 → v3.16.0), o roadmap 4.0 (sessao-034) —
"Matemática Completa" (mult/add/sub/div) + "Inteligência Adaptativa"
(curva de esquecimento, viés adaptativo, perfil unificado) — está 100%
entregue.

---

## [3.15.0] — 2026-07-06 — TABUADA RUSH 4.0 · FASE 5 (Adaptação Universal)

**Detalhes em `sessions/sessao-039.md`.**

### Adicionado
- **Viés adaptativo** (não exclusivo, diferente do Modo Difícil) em Rush,
  Sobrevivência, Velocidade e Zen: ~60% de chance de puxar fatos dos pontos
  mais fracos do jogador (erro + velocidade), em multiplicação/soma/subtração.
  Divisão fica de fora (`tableStats.div` é por dividendo, mesma limitação
  identificada na Fase 3 pro Modo Revisão).
- **Toggle "Foco em Fraquezas"** em Configurações (`data.adaptiveDifficulty`,
  ligado por padrão) — desligar volta ao sorteio 100% aleatório.

### Corrigido
- `GamePage` fatiava `tableStats` sempre em `.mult`, mesmo jogando em soma/
  subtração — resquício da Fase 1 nunca corrigido (só o Modo Difícil, sempre
  mult, usava esse campo até agora). Corrigido: fatia pela operação efetiva
  da partida.

---

## [3.14.0] — 2026-07-06 — TABUADA RUSH 4.0 · FASE 4 (Inteligência Preditiva)

**Primeiro passo do pilar "Inteligência Adaptativa". Detalhes em `sessions/sessao-038.md`.**

### Adicionado
- **Modelo de decaimento de memória** (curva de esquecimento, inspirado em
  Ebbinghaus): `predictRecallProbability`/`getFactsAtRisk` estimam quando um
  fato será esquecido a partir de precisão, velocidade e tempo desde a
  última prática (`lastPracticed`, novo campo em `tableStats`/`factStats`).
  Roda passivamente em QUALQUER partida, nas 4 operações.
- **Motor preditivo aplicado ao Modo Revisão**: fórmula de dificuldade ganhou
  um 4º componente de "staleness" (40% erro / 25% velocidade / 15% volume
  de erros / 20% tempo desde a última prática) — Revisão passa a puxar fatos
  esquecendo, não só fatos com erro recente.
- **Painel "Fatos a Vencer"** no Menu — contagem agregada das 4 operações,
  toque inicia Revisão (ou mostra como desbloqueá-la).
- **Lembrete local** (`maybeForgettingReminder`, mesmo padrão dos lembretes
  de ofensiva/missões) quando há fatos prestes a serem esquecidos.

---

## [3.13.0] — 2026-07-06 — TABUADA RUSH 4.0 · FASE 3 (Divisão) · 🎉 MATEMÁTICA COMPLETA

**Última operação nova da 4.0. Detalhes em `sessions/sessao-037.md`.**

### Adicionado
- **Divisão** como operação real e selecionável — `OPERATIONS.div`, sempre
  exata (nunca sorteia com resto).
- Novo mecanismo **`cellFact`**: divisão é derivada da multiplicação, então
  a grade do Mapa de Domínio/Certificados organiza por (divisor, quociente)
  e resolve o fato real (dividendo÷divisor=quociente) via `cellFact` —
  generalizado em `getFactSpace`/`computeCertificates`/`MasteryMap`.
- Rush, Sobrevivência, Velocidade e Zen respeitam Divisão no seletor de
  operação. Revisão em Divisão cai para multiplicação por ora (aviso
  explícito no `ModesPage`) — `tableStats.div` é por dividendo, não por
  divisor, então a lógica de "tabuada mais fraca" não se aplica ainda.

### 🎉 Marco
Com Soma, Subtração e Divisão entregues (Fases 2-3), a Tabuada Rush cobre
as **4 operações fundamentais** — pilar "Matemática Completa" da filosofia
da 4.0 (sessao-034) fechado. Próximas fases: Inteligência Adaptativa.

---

## [3.12.0] — 2026-07-06 — TABUADA RUSH 4.0 · FASE 2 (Soma e Subtração)

**Primeiro conteúdo novo da 4.0. Detalhes em `sessions/sessao-036.md`.**

### Adicionado
- **Soma e Subtração** como operações reais, selecionáveis pelo jogador —
  `OPERATIONS.add`/`OPERATIONS.sub` no registro (utils).
- **Seletor de Operação** no `ModesPage` (× Multiplicação / + Adição /
  − Subtração) — afeta Rush, Sobrevivência, Velocidade, Zen e Revisão.
  Desafio Diário/Semanal e Modos Avançados continuam sempre multiplicação.
- **Mapa de Domínio e Certificados por operação** — abas em
  `AccuracyCatalogPage`/`AchievementsPage`. Subtração desenha uma grade
  **triangular** (resultado nunca negativo — mecanismo `isValid` novo,
  propagado em `getFactSpace`/`computeCertificates`/`MasteryMap`).
- Novo componente `OperationTabs` reaproveitado nos 3 lugares acima.

### Corrigido / Renomeado
- Campo que marca a operação de uma questão registrada: `op` → `operation`
  (evita colisão com o operador +/− interno do Modo Combinado).

---

## [3.11.0] — 2026-07-06 — TABUADA RUSH 4.0 · FASE 1 (Fundação Multi-Operação)

**Arquitetura, sem feature visível. Detalhes em `sessions/sessao-035.md`.**

### Adicionado / Alterado
- **Schema multi-operação**: `tableStats`/`factStats`/`srsData` namespaced
  por operação (`{ mult: {...} }`). Migração automática e retrocompatível de
  dados salvos em versões anteriores.
- **`OPERATIONS`** (utils): registro central de operações matemáticas — só
  `mult` tem conteúdo hoje; `add`/`sub`/`div` reservados para Fases 2/3.
- **`getFactKey`/`getFactSpace`/`generateQuestion`**: novas funções genéricas
  que substituem lógica hardcoded de multiplicação. `getAllFactKeys`/
  `parseFactKey`/`computeCertificates` generalizados, 100% retrocompatíveis.
- **`MasteryMap` (Mapa de Domínio)** ganhou prop `operation`, lê geometria da
  grade do registro `OPERATIONS` em vez de arrays hardcoded.
- **Comportamento observável: idêntico ao pré-4.0** — validado por build
  limpo, teste de migração com dado legado real, e execução ao vivo das
  novas funções no bundle via console do navegador.

### Corrigido
- **B007** — contagem de certificados hardcoded (`{certsUnlocked}/8`) na
  AchievementsPage não acompanhou a generalização do `MasteryMap`. Trocado
  para `{certificates.length}` (já derivado de `OPERATIONS`). Ver `BUGS.md`.

---

## [ROADMAP] — 2026-07-02 — TABUADA RUSH 4.0 PLANEJADO

**Amplitude (4 operações) + Inteligência Adaptativa (previsão de esquecimento).
Detalhes em `sessions/sessao-034.md`.**

### Fase 1 (próxima sessão) — Fundação Multi-Operação
- Schema com chave de operação (`factStats`/`tableStats`/`srsData`)
- Gerador de perguntas unificado, Mapa de Domínio genérico, SRS genérico

### Fase 2 — Soma e Subtração
### Fase 3 — Divisão (bootstrap a partir dos dados de multiplicação)
### Fase 4 — Inteligência Preditiva (curva de esquecimento, painel "Fatos a Vencer")
### Fase 5 — Adaptação Universal (viés de fatos fracos em todos os modos)
### Fase 6 — Perfil de Domínio Unificado (certificado completo, QI multi-operação)

Fora de escopo (uso pessoal, sem meta de negócio): social/multiplayer, B2B.

---

## [3.10.0] — 2026-07-02 — Modo Difícil Adaptativo + Leaderboards Ativos

Detalhes em `sessions/sessao-033.md`.

### Adicionado / Alterado
- **Modo Difícil agora é ADAPTATIVO**: em vez do pool fixo 7/8/9, seleciona
  as 3 tabuadas com maior dificuldade PESSOAL do jogador (`tableStats`).
  - Score de dificuldade: 60% taxa de erro + 40% tempo médio
  - Requer ≥3 amostras por tabuada; fallback: 7/8/9 clássico
  - Nova função `getHardTabuadaPool(tableStats)` em utils
  - `getHardQuestion(tableStats)` — assinatura mudou (breaking em teoria, mas só
    o GamePage chama, e foi atualizado)
  - `MODES.hard.description`: "Só tabuadas 7, 8 e 9" → "Suas 3 tabuadas mais difíceis"

### Infraestrutura
- **Leaderboards ATIVOS no Supabase** — migração `create_leaderboard_tables`
  aplicada via MCP no projeto `oevpmbdcvzplbbedrvyt`.
  - Tabelas `leaderboard_daily` e `leaderboard_weekly` criadas com RLS,
    políticas SELECT (todos autenticados) + ALL (dono), índices por
    `(date/week, score desc)`.
  - Página de Leaderboard agora funcional em produção para usuários logados.

---

## [3.9.0] — 2026-06-08 — Correções + Sistema de Desbloqueio Progressivo

**Pós-3.0: bugs corrigidos e refinamento.** Detalhes em `sessions/sessao-032.md`.

### Corrigido
- **Bug crítico — Flashcard:** input não aceitava digitação. Causa: useEffect
  dependia de `fact` (objeto novo a cada render), zerando o input em cada
  keystroke. Trocado para `currentFk` (string estável).
- **UX — Leaderboard:** quando tabelas não existem no Supabase, mostrava
  "Tente novamente em alguns segundos" em vez da mensagem correta.
  `parseError` agora detecta PGRST205, PGRST202 e mais padrões.

### Adicionado
- **Sistema de Desbloqueio Progressivo (`UNLOCK_RULES`)**: todos os modos
  exceto Zen têm condição de desbloqueio.
  - Rush → Nível 2, Sobrevivência → Nível 3, Velocidade → 10 partidas,
    Diário → 100 acertos, Revisão → 20 erros, Flashcard → Nível 4,
    Inverso → Nível 5, Difícil → Nível 8, Recorde Pessoal → Nível 9,
    Semanal → 10 dias de ofensiva, Combinado → 3 certificados
  - Nova função `getModeUnlock(modeId, data)` em utils
  - Bloqueio defensivo em `App.jsx::handleStart` (não confia só na UI)
  - Backward-compat: usuários existentes já satisfazem as condições, ficam
    com tudo desbloqueado automaticamente
- **Modo Zen agora dá XP** (discretamente): `xpMultiplier` 0 → 0.10
  - Badge "Sem XP" → "Pratique 🌿" (não revela XP)
  - Descrição e UI in-game não mencionam XP
  - O jogador descobre ao ver a ResultsPage
  - Permite que usuário novo comece só com Zen e suba de nível para
    destravar Rush e os demais modos

---

## [3.8.0] — 2026-06-08 — TABUADA RUSH 3.0 · FASE 6 · 🎉 ROADMAP COMPLETO

**Expansão de Conteúdo + Fechamento do Roadmap 3.0.** Detalhes em `sessions/sessao-031.md`.

### Adicionado
- **Tabuada do 11 e 12** (opcional) — toggle persistido em `data.includeExtraTables`
  - Seção "Conteúdo Avançado" no SettingsPage com explicação
  - `getRandomQuestion(diff, includeExtra)` aceita o flag — só inclui 11/12 no nível 3+
  - Aplica em modos com geração randômica (Rush, Survival, Speed, Review, Personal)
  - **NÃO afeta** Daily/Weekly (justiça do leaderboard) nem modos com pool próprio
- **Modo Combinado** — `MODES.combined`
  - "3 × 7 + 4 = ?" ou "5 × 8 − 6 = ?" — cálculo mental com 2 operações
  - 15 questões, xpMultiplier 0.25
  - Op `+` ou `-` 50/50; quando `-`, garante `ans > 0`
  - **Desbloqueado por ≥3 certificados de domínio** (não por nível)
  - Card no ModesPage com badge "🔒 3 certificados" quando bloqueado
  - Renderização adaptada no GamePage (`3 × 7 + 4` em fonte 60px)
- **`getCombinedQuestion()`** novo em `utils/index.js`

### 🎉 Roadmap 3.0 — 100% entregue

| Fase | v | Sessão |
|------|---|--------|
| 1 — Base Pedagógica + Correções | 3.3.0 | 026 |
| 2 — Repetição Espaçada | 3.4.0 | 027 |
| 3 — Economia e Loja | 3.5.0 | 028 |
| 4 — Novos Modos | 3.6.0 | 029 |
| 5 — Social e Retenção | 3.7.0 | 030 |
| 6 — Expansão de Conteúdo | 3.8.0 | 031 |

> O Tabuada Rush 2.x praticava tabuada.
> O Tabuada Rush 3.0 memoriza tabuada.

---

## [3.7.0] — 2026-06-08 — TABUADA RUSH 3.0 · FASE 5

**Social e Retenção.** Detalhes em `sessions/sessao-030.md`.

### Adicionado
- **Leaderboards globais** (Diário + Semanal) via Supabase
  - Service `src/services/leaderboard.js` — upsert/fetch com graceful degradation
    (detecta `no_table`, `unconfigured`, `error`)
  - Página `LeaderboardPage.jsx` — tabs Diário/Semanal, top 20, medalhas 🥇🥈🥉,
    linha do próprio usuário destacada, "Seu Score" em destaque com QI char
  - Botão "Leaderboard Global" 👑 no MenuPage
  - `handleGameEnd` faz upsert ao terminar daily/weekly se usuário logado
  - **SQL no SUPABASE_SETUP.md:** `leaderboard_daily` + `leaderboard_weekly`
    com RLS (todos leem, dono escreve), índices por (date/week, score desc)
- **Heatmap de Ofensiva 365 dias** — `src/components/StreakHeatmap.jsx`
  - Grade 53 semanas × 7 dias, estilo GitHub
  - 5 níveis de intensidade (cinza → emerald-800)
  - Tooltip por célula com data e nº de partidas
  - Cabeçalho de meses + labels de dia da semana
  - Inserido no topo da StatsPage
- **Compartilhar Resultado** — `src/lib/shareCard.js`
  - Geração de PNG 1080×1080 via Canvas API (sem dependência nova)
  - Paleta dos 10 modos espelhada
  - Card central com SCORE gigante, badge "🏆 NOVO RECORDE!" condicional,
    3 stats (Precisão · Acertos · Sequência), rodapé com personagem QI
  - `shareCard()` tenta Web Share API, faz fallback para download
  - Botão "Compartilhar resultado" na ResultsPage

### Filosofia
> Fase 5 abre o jogo para o mundo. Comparação justa (todos jogam as mesmas
> questões). Visualização do compromisso (heatmap). Identidade compartilhável
> (share card). Retenção via prova social.

---

## [3.6.0] — 2026-06-08 — TABUADA RUSH 3.0 · FASE 4

**Novos Modos.** Detalhes em `sessions/sessao-029.md`.

### Adicionado
- **Modo Difícil** — `MODES.hard`
  - Pool exclusivo de fatores 7, 8 e 9 · timer 90s · xpMultiplier 0.22
  - Desbloqueado no Nível 8+ (`minLevel: 8`)
  - Geração on-the-fly via `getHardQuestion()`
- **Modo Recorde Pessoal** — `MODES.personal`
  - 15 questões com benchmark por fato (`personalBenchmarkMs` via factStats)
  - "Bateu seu tempo!" → pontos completos · "Correto, mas devagar..." → +1 pt
  - Badge `🎯 Seu tempo: 2.1s` visível no card de pergunta
  - `state.beats` rastreia total batido na partida
  - xpMultiplier 0.18
- **Desafio Semanal Competitivo** — `MODES.weekly`
  - 10 questões idênticas para todos por semana ISO (seed determinístico)
  - Persiste melhor score em `data.weeklyChallenge = { week, score, completedAt }`
  - Badge dinâmico na ModesPage (`NOVO 🏆` ou `✓ {score} pts`)
  - xpMultiplier 0.30 (mais alto — sai 1× por semana)
  - Leaderboard global previsto para Fase 5 (Supabase já configurado)
- **Utilitários novos em `utils/index.js`:**
  - `getHardQuestion()`
  - `getPersonalRecordQuestions(factStats, count)`
  - `getWeeklyChallengeQuestions(date, count)`
  - `getCurrentWeekKey(date)` — "YYYY-Www"
- **ModesPage atualizada** — placeholders bloqueados substituídos por modos reais

### Filosofia
> Fase 4 traz competição honesta. Modo Difícil testa o pior caso. Recorde
> Pessoal compete contra si mesmo. Semanal compete contra todos.

---

## [3.5.0] — 2026-06-08 — TABUADA RUSH 3.0 · FASE 3

**Economia e Loja Reformulada.** Detalhes em `sessions/sessao-028.md`.

### Adicionado
- **Power-ups Spot** no GamePage:
  - Vida Extra spot-buy no Survival (🪙 80) ao perder última vida
  - +60s Rush spot-buy (🪙 30) quando tempo ≤ 20s e sem estoque
- **Seguro de Ofensiva (🪙 100)** — `powerups.streakInsurance`
  - `applyStreakDecay` consome 1 seguro em vez de zerar a streak
  - Grava `streakInsuredAt` (ISO) — comportamento "uso único por quebra"
- **Congelar Missão Diária (🪙 50)** — `powerups.missionFreeze`
  - Botão em cada missão diária incompleta
  - Consome do estoque OU paga 50 🪙
  - `freezeMission()` em `utils/missions.js`; `initDaily` carrega missões
    com flag `frozen` do dia anterior preservando progresso
- **Apostas de Partida** — modal antes de iniciar modos principais
  - Valores: 10/25/50 🪙 → 30/75/150 🪙 se bater recorde
  - Apenas para rush/survival/speed/daily; modos de treino excluídos
  - `data.activeBet = { mode, amount }` persistido; resolvido no `handleGameEnd`
  - Toast de win/lose mostra resultado
- **Oferta da Semana** — `getWeeklyOffer(date)` em shop.js
  - 3 cosméticos com 40% off rotativos por semana ISO (seed determinístico)
  - Seção própria no topo do ShopPage, badge `-40%`, preço riscado
- **Temas de GamePage** — nova categoria `gameTheme` (3 itens)
  - 💠 Tema Neon (1.000 🪙), 🌌 Tema Aurora (2.500 🪙), 🔥 Tema Lava (5.000 🪙)
  - Aplicados ao gradiente do card de pergunta no GamePage
  - Tab "Jogo" adicionado às categorias da loja

### Filosofia
> Fase 2 deu ao jogador o método de memorização. Fase 3 dá a ele agência
> econômica: decisões de risco (apostar) e proteção do progresso (seguro,
> congelar). A loja agora tem ofertas que mudam — razão para visitar regularmente.

---

## [3.4.0] — 2026-06-08 — TABUADA RUSH 3.0 · FASE 2

**Repetição espaçada + Modo Inverso + Certificados de Domínio.** Detalhes em `sessions/sessao-027.md`.

### Adicionado
- **Modo Flashcard com SRS (SM-2 simplificado)** — `src/pages/FlashcardPage.jsx`
  - Avaliação 3-níveis: Errei (10 min) · Difícil (1d, cresce devagar) · Fácil (3d, 6d, cresce no ease factor)
  - Persistência por fato em `srsData[fk] = { interval, easeFactor, reps, nextReview, lastReview }`
  - Fila de até 20 fatos por sessão (vencidos primeiro, depois novos)
  - Tela final com resumo `easy/hard/wrong` + pendentes restantes
  - Badge no menu: "🃏 X flashcards para revisar"
- **Modo Inverso** — `MODES.inverse` (15 questões, xpMultiplier 0.20)
  - Mostra "= 56" → dois inputs lado-a-lado para os fatores
  - Aceita qualquer par válido (7×8 e 8×7 ambos passam)
  - Card próprio na ModesPage, seção "Recuperação Reversa · Fase 2"
- **Certificados de Domínio por Tabuada** — 8 certificados (tabuadas 2..9)
  - Desbloqueados quando todos os 10 fatos da tabuada estão `dominated`
  - Critério idêntico ao Mapa de Domínio (<1.5s, ≥90% acerto, ≥3 amostras)
  - Seção dedicada no topo da AchievementsPage (grid 4×2)
  - **Não compráveis** — único caminho é o domínio real
- **Utilitários SRS em `utils/index.js`:**
  - `getAllFactKeys()`, `parseFactKey()`, `updateSrsFact()`
  - `countDueFlashcards()`, `getReviewQueue()`
  - `computeCertificates()`

### Removido
- Banner Desafio Diário do MenuPage (a pedido do usuário) — o desafio continua
  acessível como card principal dentro da ModesPage

### Filosofia
> Fase 1 mostrou ao jogador o que ele DOMINA. Fase 2 ensina a MEMORIZAR.
> SRS é o método científico mais comprovado para memorização de fatos.

---

## [3.3.0] — 2026-06-08 — TABUADA RUSH 3.0 · FASE 1

**Base pedagógica + correções críticas.** Detalhes em `sessions/sessao-026.md`.

### Adicionado
- **Página de Modos (`ModesPage.jsx`)** — todos os modos organizados em 3 seções:
  - Modos Principais (Rush, Sobrevivência, Velocidade, Desafio Diário)
  - Modos de Treino (Zen, Revisão)
  - Modos Avançados (Flashcard, Inverso, Difícil, Recorde Pessoal — placeholders Fase 2+ bloqueados)
  - Cards grandes com gradiente próprio, dificuldade textual, recorde pessoal e badges contextuais
- **Banner Desafio Diário no MenuPage** — card de destaque logo abaixo do perfil.
  - Estado pendente: gradiente âmbar/rosé chamativo, sugere "20 perguntas únicas · +30 XP"
  - Estado feito hoje: gradiente esmeralda discreto + pontuação do dia
  - Toque leva direto ao modo `daily`
- **Botão "Escolher Modo"** no MenuPage — substitui os dois grids de modos antigos.
  Leva para a nova `ModesPage`. Visual roxo destacado.
- **Mapa de Domínio Visual** no Catálogo de Precisão (`AccuracyCatalogPage`):
  - Grade 8×10 mostrando todos os 80 fatos fundamentais (2×1 até 9×10)
  - 4 cores: 🟢 Dominado (<1.5s + ≥90% acerto + ≥3 amostras) · 🟡 Praticado · 🔴 Problemático (>20% erro) · ⬜ Sem dados
  - Cabeçalho de progresso "X/80 fatos dominados (Y%)"
  - Legenda com contagem por estado
- **Persistência de `factStats`** no storage — agregação por par (a,b) normalizado.
  Cada fato registra `{correct, wrong, totalMs, count}`.
  Backward-compatible: bases antigas começam vazias e enchem conforme o jogador joga.

### Corrigido
- **Missão impossível eliminada:** `mm_score_1200` (target inatingível) → `mm_score_350` (atingível no Rush com boa performance)
- **Missão semanal de score ajustada:** `wm_score_800` (limite ~600 no Speed) → `wm_score_500`

### Filosofia
> Tabuada Rush 2.x praticava tabuada. A partir da Fase 1 do 3.0,
> o jogador vê pela primeira vez evidência VISUAL e REAL do que de fato domina.

---

## [ROADMAP] — 2026-06-08 — TABUADA RUSH 3.0 PLANEJADO

**Transformação pedagógica completa. Detalhes em `sessions/sessao-025.md`.**

### Fase 1 (próxima sessão)
- Fix missão impossível (mm_score_1200 → 350 pts)
- Página de Modos (ModesPage) + Banner Desafio Diário no menu
- Mapa de Domínio Visual (grade 8×10 colorida por domínio real)

### Fase 2 — Repetição Espaçada
- Modo Flashcard com SRS (spaced repetition system)
- Certificados de Domínio por tabuada
- Modo Inverso ("= 56, quais os fatores?")

### Fase 3 — Economia reformulada
- Power-ups spot (comprar no momento de perder)
- Seguro de Ofensiva, Congelar Missão, Apostas de Partida
- Oferta da Semana na loja

### Fase 4 — Novos Modos
- Modo Contra o Relógio Pessoal
- Desafio Semanal Competitivo com leaderboard
- Modo Difícil (tabuadas 7, 8, 9)

### Fases 5–6 — Social, Heatmap, Tabuada 11/12, Modo Combinado

---

## [3.2.1] — 2026-05-29 — XP×2 VISUAL, RESULTADOS E STATS DE POWER-UPS

### Adicionado — Badge ⚡ XP ×2 no GamePage
- Badge "⚡ XP ×2" aparece na linha de info durante a partida quando XP Dobrado está ativo

### Adicionado — Destaque de XP Dobrado no ResultsPage
- Banner roxo "XP Dobrado foi usado!" com valor base → dobrado
- Card de XP com fundo e texto violeta quando xp2Used=true

### Adicionado — Painel de Power-ups nas Estatísticas
- Seção "⚡ Power-ups" exibe estoque de cada consumível com cor ativa/vazia
- Link para Loja quando estoque está zerado

---

## [3.2.0] — 2026-05-29 — POWER-UPS, LOJA, MOEDAS E RUSH SCORING

### Adicionado — Power-ups consumíveis na Loja
- **Vida Extra (80🪙):** modal ao perder última vida no Survival — usa 1 vida do estoque
- **+60s Rush (120🪙):** botão visível durante o Rush quando há estoque; adiciona 60s
- **XP Dobrado (200🪙):** dobra o XP da próxima partida concluída; consome 1 unidade

### Modificado — Loja completamente reformulada
- 3 categorias: ⚡ Poder (power-ups consumíveis), 🖼️ Molduras, 🎨 Temas
- Adjetivos de título removidos; contador de estoque visível no badge
- Molduras: 800 / 1500 / 3000 / 8000 🪙 | Temas: 600 / 600 / 600 / 1500 / 4000 🪙
- Tab padrão: "Poder" (power-ups)

### Modificado — Rush scoring (score médio ~300–400 pts)
- `scoreScale: 0.25` no modo Rush; `calcPoints()` recebe parâmetro scale
- Score bruto escalado para nível comparável a Survival/Speed (era ~1400 pts médios)

### Modificado — Economia de moedas (cap 15/partida)
- **Antes:** 0.1 × score (Rush inflava para 140+ moedas); **Agora:** 0.3 × acertos, cap 15
- +2 moedas no Desafio Diário, +1 ao manter ofensiva

### Melhorado — Integração de power-ups no GamePage
- Prop `powerups` e `onUsePowerup` passados ao GamePage pelo App.jsx
- XP×2 consome 1 unidade e dobra o XP ao salvar resultado

---

## [3.1.1] — 2026-05-27 — RANKING, MISSÕES, XP, REVISÃO, TOASTS

### Modificado — Ranking de QI
- Homem-Aranha movido para tier `alto`, posicionado acima de Hermione Granger

### Modificado — Menu Principal
- Botão "Catálogo de Progresso" removido do menu — acesso exclusivo via Estatísticas/Evolução

### Modificado — Missões Semanais (dificuldade real de 1 semana)
- 35 e 60 partidas (~5–9/dia), semana perfeita (7 desafios diários), 1000 e 2000 acertos,
  streak de 20, score de 800, precisão de 95% — targets 3–4× maiores que antes

### Modificado — Missões Mensais (dificuldade real de 1 mês)
- 120 e 250 partidas, 4000 e 8000 acertos, 25 dias de ofensiva, 22 desafios diários,
  score de 1200 em uma única partida

### Modificado — Sistema de XP (~35% mais difícil)
- Rush: 0.18 → 0.12 | Survival: 0.30 → 0.20 | Speed: 0.25 → 0.16
- Daily: 0.40 → 0.28 | Review: 0.25 → 0.16
- Atualizado em `constants/index.js`, `App.jsx` e `ResultsPage.jsx`

### Melhorado — Modo Revisão
- Score de dificuldade composto: 50% taxa de erro + 30% tempo médio de resposta
  (avgMs cap 6000ms) + 20% volume absoluto de erros (cap 80 erros)

### Corrigido — Pop-ups no Mobile
- Toast de conquista e loja: `left-1/2 -translate-x-1/2` → `left-4 right-4 max-w-sm mx-auto` — não corta mais em telas pequenas

---

## [3.1.0] — 2026-05-27 — MODOS ZEN & REVISÃO, MASCOTE, INSANE COMBO, PARTÍCULAS, PWA

### Adicionado — Modos de Treino
- **Modo Zen**: treino livre sem timer/vidas/pontuação/XP — botão "Encerrar Treino" manual
- **Modo Revisão**: 15 questões focadas nas tabuadas com maior taxa de erro (`getRevisionQuestions`)
- `TRAINING_MODE_LIST`: seção "Treino" separada no menu (não mistura com os 4 modos principais)
- `MODES.zen` e `MODES.review` em `constants/index.js`; `getRevisionQuestions` em `utils/index.js`

### Adicionado — Mascote Matemático
- Personagem emoji no GamePage que reage em tempo real: 🤓 idle · 🤩 acerto · 😬 erro · 🔥 combo · 🤯 INSANE
- Animação spring suave com Framer Motion (AnimatePresence mode="wait")

### Adicionado — INSANE COMBO!
- Streak ≥ 10 (múltiplo de 5): texto "🤯 INSANE COMBO! ×N" com gradient roxo-rosa
- Screen shake: container oscila em X via Framer Motion ao INSANE COMBO
- Combo padrão (streak múltiplo de 5, < 10): mantido com amber/orange

### Adicionado — Explosão de Partículas (Level Up)
- Ao subir de nível: 28 partículas coloridas explodem do centro da tela (1,4s)
- Texto "LEVEL UP!" animado com badge do novo nível

### Adicionado — PWA Install Prompt
- Captura `beforeinstallprompt` do browser
- Banner "Instalar o App" aparece após 3s no menu
- Dispara `deferredPrompt.prompt()` no click; banner dismissível

### Modificado — ResultsPage
- Nova stat "Tempo Médio/Resp." (avgMs em segundos) — só exibe se dado disponível
- Nova stat "XP Ganho" — calculado com multiplicador por modo, oculto em Zen

### Adicionado — StatsPage
- Seção "Erros — Últimos 7 Dias": gráfico de barras verticais com erros/dia da semana

### Adicionado — Notificação de Missão Expirando
- `maybeMissionExpireReminder(missionsData)` em `src/lib/notify.js`
- ≤ 2h antes da meia-noite: notifica imediatamente (missões pendentes ou resgates disponíveis)
- 2–6h: agenda `setTimeout` para 1h antes da meia-noite
- Deduplicação por dia via localStorage; mensagens diferenciadas por estado

### Modificado — Reset de Progresso (Cloud)
- `handleReset` em SettingsPage agora apaga também o campo `data` no Supabase antes de limpar localStorage
- Evita restauração automática dos dados ao fazer login novamente
- UI: alerta "☁️ Seus dados na nuvem também serão apagados" quando o usuário está logado
- Estado `loading` com feedback visual durante o processo

---

## [3.0.0] — 2026-05-27 — CALIBRAÇÃO v3.0: XP POR MODO, QI MAIS DIFÍCIL, RESET

### Modificado — Sistema de XP
- XP é agora **100% baseado em performance** (score × multiplicador por modo)
- Rush `0.18` · Survival `0.30` · Speed `0.25` · Daily `0.40`  — Rush penalizado pois 5min gera scores altos facilmente
- **Removidos** bônus de streak diário e bônus de Desafio Diário — XP é mérito do jogador
- Progresso LEVELS recalibrado para curva ×2: nível 5 em ~1 mês, nível 10 em ~5 meses, nível 28 = lendário

### Modificado — QI Matemático (mais difícil)
- `computeQI`: caps elevados para exigir muito mais jogo antes de chegar ao QI máximo
  - `speedBest`: 30 → 80 respostas  |  `bestDayStreak`: 30 → 120 dias  |  `totalGames`: 50 → 300 partidas
- Só jogadores muito dedicados chegam perto de QI 200

### Adicionado — Reset de Progresso
- **`SettingsPage`**: seção "Zona de Perigo" com botão "Resetar Progresso"
- Confirmação em 2 etapas (anti-clique acidental) — apaga localStorage e recarrega o app

---

## [2.14.0] — 2026-05-27 — FASE 7: MOEDAS, LOJA, MISSÕES E TEMPORADAS

### Adicionado — Sistema de Moedas e Loja
- **`constants/shop.js`**: 4 raridades (comum/raro/épico/lendário), 12 itens (4 molduras, 3 títulos, 5 temas de card), `SHOP_ITEM_MAP`, `SHOP_CATEGORIES`
- **`ShopPage.jsx`**: tabs de categoria, grid de itens com badge de raridade, compra (deduz moedas), equipar/desequipar por slot (`frame`/`card`/`title`)
- Cosméticos aplicados no `MenuPage`: card usa gradiente do tema equipado, avatar usa ring da moldura, título do perfil vem do item de título

### Adicionado — Sistema de Missões
- **`constants/missions.js`**: pool de 11 diárias, 7 semanais, 5 mensais
- **`utils/missions.js`**: `getActiveMissions` (reset automático), `updateMissions`, `countUnclaimedMissions`, `getNewlyCompleted`, `claimMission` — seleção determinística via LCG com seed de data
- **`MissionsPage.jsx`**: tabs Diárias/Semanais/Mensais, countdown de reset, cards de missão com barra de progresso, botão "Resgatar" (+moedas)
- Badge numérico vermelho no botão Missões do menu quando há recompensas pendentes
- Toast "Missão concluída" após fim de partida quando nova missão é completada

### Adicionado — Sistema de Temporadas
- **`constants/seasons.js`**: Temporada 1 "Despertar Matemático" (mai–jul 2026), 10 marcos de recompensa (100 → 10 000 XP), `getActiveSeason()`, `calcSeasonXp()`
- **`SeasonsPage.jsx`**: hero com gradiente, barra de XP de temporada, trilha de recompensas com estados (bloqueado/atingido/resgatável/resgatado), dica de ganho de XP

### Modificado
- **`storage.js`**: 6 novos campos em DEFAULTS (`ownedItems`, `equippedItems`, `missionsData`, `seasonXp`, `seasonRewards`, `seasonId`)
- **`App.jsx`**: `handleGameEnd` calcula e salva `coinsEarned`, `earnedSeasonXp`, `updatedMissionsData`; 3 novas rotas (`shop`, `missions`, `seasons`)
- **`MenuPage.jsx`**: 3 botões novos em grid-cols-3 (Loja/Missões/Temporada), cosméticos aplicados dinamicamente

---

## [2.13.0] — 2026-05-27 — DASHBOARDS DE ACERTOS E ERROS (BLOCO 10)

### Adicionado
- **Dashboard de Acertos** (`pages/HitsPage.jsx`) — sub-página interna da StatsPage: texto inteligente automático (topo), filtros (Período: Hoje/Mês/Ano/Todos + seletor de mês + Modo), KPI cards (Precisão, Total Acertos, Melhor Sessão, Partidas), barra visual de taxa de acerto, gráfico de evolução da precisão (LineChart), precisão por modo (barras animadas), destaque de maior sequência
- **Dashboard de Erros** (`pages/ErrorsPage.jsx`) — sub-página interna da StatsPage: texto inteligente automático (construtivo), mesmos filtros, KPI cards (Taxa de Erro, Total Erros, Partidas, Tabuada Difícil), barra visual de taxa de erro, gráfico de evolução dos erros (LineChart), erros por modo (barras coloridas por severidade), erros por tabuada (barras do histório global), destaque da tabuada mais difícil
- Dois botões de acesso (`CheckCircle` emerald / `XCircle` rose) na StatsPage, logo abaixo dos 4 cards principais

### Técnico
- Navegação via `view` state local em `StatsPage` (`'main' | 'hits' | 'errors'`) — sem rota nova no App.jsx, sem remover nada existente
- Filtros reativos via `useMemo`; meses disponíveis calculados a partir dos dados reais

### Mantido
- Toda a StatsPage original intacta (summary cards, análise inteligente, resumo mensal, gráfico diário, por modo, exportação)
- Identidade visual inalterada (paleta violeta/emerald/rose, Nunito, `rounded-3xl`)

---

## [2.12.0] — 2026-05-27 — CATÁLOGO DE PRECISÃO (FASE 5 / BLOCO 9)

### Adicionado
- Página **Catálogo de Precisão** (`pages/AccuracyCatalogPage.jsx`), acessada de dentro da Estatísticas: Desempenho Matemático, Taxa de Acerto (geral/semana/mês/por modo + evolução), Velocidade (geral/recente/melhor/por modo), Erros (total/taxa/por modo), Precisão por Tabuada e Histórico de Precisão (LineChart)
- Tracking por questão no `GamePage` → agregado em `tableStats` (desempenho por tabuada: fator `a`), no `handleGameEnd` e sincronizado com a nuvem
- `tableStats` no storage
- Botão "Catálogo de Precisão" dentro da `StatsPage` (rota `accuracy`)

### Mantido
- Identidade visual inalterada (paleta violeta, Nunito, cards `rounded-3xl`, Recharts no padrão existente). Sem redesign.

---

## [2.11.0] — 2026-05-26 — CATÁLOGO DE PROGRESSO (FASE 5 / BLOCO 8)

### Adicionado
- Página **Catálogo de Progresso** (`pages/CatalogPage.jsx`): Progresso Geral, Experiência (XP), Sua Evolução (semana/mês/total), Marcos de Progresso, Catálogo de Níveis (28) e Registro de Evolução (timeline)
- `detectProgressEvents()` em `utils` — detecta novos marcos (nível, XP, ofensiva, recorde) por partida
- `progressLog` no storage (últimos 50 marcos), preenchido no `handleGameEnd` e sincronizado com a nuvem
- Botão destacado "Catálogo de Progresso" no MenuPage (rota `catalog`)

### Mantido
- Identidade visual inalterada (paleta violeta, Nunito, cards `rounded-3xl`, Framer Motion). Sem redesign.

---

## [2.10.0] — 2026-05-26 — PUSH COM APP FECHADO (WEB PUSH + SUPABASE)

### Adicionado
- Web Push real (notificação com app fechado): `lib/push.js` (subscribe/unsubscribe) + handler `push` no SW
- Tabela `push_subscriptions` + Edge Function `send-streak-reminders` (envia lembrete de ofensiva a quem não jogou hoje)
- Toggle de Lembretes assina/cancela o push (quando logado); reassina ao logar
- `PUSH_SETUP.md` com os 2 passos manuais (segredos VAPID/CRON + agendar cron)

### Pendente (ação do usuário)
- Definir os segredos da Edge Function e agendar o cron no Supabase (SQL pronto). Push exige login; iOS exige PWA instalada.

---

## [2.9.1] — 2026-05-26 — NOTIFICAÇÕES: CORREÇÃO MOBILE (SERVICE WORKER)

### Corrigido
- Service Worker agora é registrado (`public/sw.js`) e as notificações usam `registration.showNotification` → funcionam no mobile/Android (antes `new Notification()` quebrava)
- Ícones movidos para `public/icons/` (resolvem em dev e produção); SW servido em `/sw.js`
- Handler `notificationclick` (foca/abre o app) e `push` prontos (push real depende de backend VAPID — bloco futuro)
- Mensagens de lembrete focadas em ofensiva, com variação

### Limite honesto
- Notificações com app FECHADO/minimizado/tela bloqueada ainda exigem Push API + backend (não entregue nesta versão). iOS exige PWA instalada + Web Push.

---

## [2.9.0] — 2026-05-26 — MÚSICA DE FUNDO REAL + NOTIFICAÇÕES REAIS

### Adicionado
- Música de fundo ambiente gerada via Web Audio API (sem arquivos), com loop suave + drone; toggle nas Configurações
- Notificações reais (Web Notifications API): permissão ao ativar + lembrete local de ofensiva ao abrir o app (1×/dia)
- Música inicia no 1º gesto do usuário (política de autoplay); independente dos efeitos, respeita o volume geral

### Nota
- Notificações com app fechado (Push) ficam para bloco futuro. Identidade visual inalterada.

---

## [2.8.2] — 2026-05-26 — MODO ESCURO: FUNDO GLOBAL DA TELA

### Corrigido
- No modo escuro, a tela inteira agora escurece (html, body e container raiz), não só os cards
- Container raiz passou de `bg-[hsl(...)]` fixo para classe `.app-shell` adaptativa (modo claro inalterado)

---

## [2.8.1] — 2026-05-26 — AJUSTES: HEADER (ÁUDIO) + LOGIN CONDICIONAL

### Removido
- Botão de áudio/volume separado do header do menu (som/música/volume já ficam nas Configurações)

### Alterado
- Botão de login no header só aparece quando o usuário NÃO está logado (logout/conta ficam nas Configurações)

### Nota
- Sem mudança visual; apenas remoção de redundâncias e lógica de exibição

---

## [2.8.0] — 2026-05-26 — FASE 4 / BLOCO 6: CONFIGURAÇÕES GERAIS

### Adicionado
- Página de Configurações (botão de engrenagem ao lado do som no menu)
- Som: efeitos (on/off), volume (slider), música (toggle preparado)
- Tema Claro/Escuro — adapta neutros e contraste, preserva as cores da marca (`darkMode: 'class'`)
- Acessibilidade: texto grande, reduzir animações, alto contraste
- Notificações: toggle de lembretes (estrutura preparada)
- Conta: progresso (nível/QI/XP/moedas), login/logout, status de sincronização
- Preferências persistidas (`lib/prefs.js`), aplicadas no load sem flash

### Nota
- Modo claro inalterado; modo escuro só adapta legibilidade/contraste. Sem redesign.

---

## [2.7.2] — 2026-05-26 — GRÁFICO DE EVOLUÇÃO FOCADO NO DESAFIO DIÁRIO

### Alterado
- O gráfico "Evolução de Pontos" passa a considerar apenas as partidas do Desafio Diário (título e estado vazio atualizados)

---

## [2.7.1] — 2026-05-26 — ANÁLISE: TEMPO MÉDIO DE RESPOSTA REAL

### Adicionado
- Captura de tempo de resposta por questão (GamePage) → `avgMs` por partida + recorde `fastestAvgMs`
- Insights de velocidade baseados em tempo real (recente vs anterior), com fallback para o proxy antigo
- Resumo mensal mostra tempo médio de resposta com variação (mais rápido/lento) vs mês anterior

### Nota
- Retrocompatível (sessões antigas sem tempo usam o proxy). Visual preservado.

---

## [2.7.0] — 2026-05-26 — ANÁLISE INTELIGENTE DO USUÁRIO

### Adicionado
- Motor de análise (`utils/analysis.js`): textos automáticos data-driven (evolução, precisão, velocidade, modos, ofensiva), frases variadas e determinísticas
- Dashboard (StatsPage): card "Análise Inteligente" (resumo + observações por tom) e "Resumo do Mês" (indicadores com deltas vs mês anterior)
- Menu: banner de insight clicável que leva às Estatísticas

### Nota
- Não é IA real — interpreta dados reais do usuário. Identidade visual preservada.

---

## [2.6.0] — 2026-05-26 — SISTEMA DE OFENSIVA AVANÇADO

### Adicionado
- Reset automático da ofensiva ao perder um dia OU virar o ano (recordes/conquistas não resetam)
- Modal de definição de meta no login/novos ciclos (opções 5/10/15/20/35/40 dias)
- Nova meta solicitada ao bater a anterior (progresso relativo à base)
- Conquistas de Ofensiva (5/10/15/20/35/40/100/250/365 dias) na página de Conquistas
- Recompensas por marco de ofensiva (40/100/250/365): escolher Nível / +QI / +XP / Moedas
- Base de moedas (`coins`, exibida no card) e bônus de QI (`qiBonus` somado ao QI)
- Modais GoalModal e RewardModal no estilo do projeto

### Alterado
- Card de perfil: meta agora abre modal (pills removidas); progresso relativo à base; chip de moedas

### Nota
- Identidade visual preservada; retrocompatível

---

## [2.5.1] — 2026-05-26 — POLISH: ANIMAÇÕES DE EVOLUÇÃO

### Adicionado
- Auto-scroll até o personagem atual ao abrir a página de Ranking de QI
- Toast animado "Nova Classificação!" ao subir de personagem no Ranking (além do toast de level-up já existente)

---

## [2.5.0] — 2026-05-26 — DEPLOY AUTOMÁTICO + REBALANCEAMENTO DE XP

### Adicionado
- Rotina de fim de bloco/sessão (`CLAUDE.md`): registros → push → deploy auto → resumo
- Deploy automático via integração Git Vercel↔GitHub (push em `main` publica produção)

### Alterado
- **XP mais "real" / difícil de subir de nível:**
  - Curva de níveis íngreme (deltas crescentes ~×1.235); topo 90.000 → **227.900 XP**
  - Ganho de XP por partida agora é modesto: `round(score×0.5) + bônus diário(20) + ofensiva(≤30)` (antes: score cheio + bônus maiores)

### Nota
- Retrocompatível (níveis por XP); identidade visual inalterada

---

## [2.4.0] — 2026-05-25 — FASE 2 / BLOCO 3: RANKING DE QI MATEMÁTICO

### Adicionado
- **Sistema "Ranking de QI Matemático"** (lúdico — não mede QI real)
- Página de Ranking (`RankingPage.jsx`): hero do usuário (QI, personagem, classificação, posição, progresso) + lista completa por categoria com destaque do personagem atual
- **104 personagens** (`constants/characters.js`) em 4 categorias (baixo/médio/alto/gênio), 26 cada — **personagens famosos e reconhecíveis** (Patrick → Einstein) com nome, emoji/avatar, descrição e posição
- Cálculo de QI (`computeQI`) baseado em precisão, velocidade, ofensiva, consistência e progresso; faixa lúdica 70–200
- `getQiInfo` mapeia QI → posição/personagem/tier + progresso até o próximo
- Botão "Ranking QI" no menu (substitui o placeholder "Ranking em breve")
- Linha de QI/classificação no card de perfil (pequena, integrada, clicável)

### Nota
- Identidade visual, cores e estética originais preservadas (avatares = emoji, tokens de cor do projeto)

---

## [2.3.0] — 2026-05-25 — FASE 2 / BLOCO 2: PERFIL E IDENTIDADE DO USUÁRIO

### Adicionado
- Sistema de níveis expandido: **7 → 28 níveis**, cada um com nome, **título** e emoji/avatar
- Sistema de títulos do usuário (muda conforme o nível) — visível no card de perfil e na ResultsPage
- Sistema de ofensiva diária com recorde (`bestDayStreak`)
- Meta de ofensiva pessoal (`streakGoal`: 7/15/30/100 dias) com barra de progresso e seleção por pills
- Card de perfil expandido: avatar, título, nível, XP, barra de progresso, ofensiva, recorde e meta — no mesmo gradiente violeta
- XP agora também vem de bônus: desafio diário (+30) e ofensiva diária mantida

### Melhorado
- `handleGameEnd`: cálculo de XP integra score + bônus de diário + bônus de ofensiva
- Persistência: novos campos `bestDayStreak` e `streakGoal` (retrocompatível via DEFAULTS)

### Corrigido / Alterado
- **Desafio Diário não fica mais bloqueado** — sempre acessível; badge "✓ hoje" apenas informativo

### Nota
- Identidade visual, cores, layout e estética originais 100% preservados

---

## [2.2.0] — 2026-05-25 — FASE 1 / BLOCO 1: REMOÇÃO DO 2 JOGADORES

### Removido
- Modo 2 Jogadores completamente removido (sem código morto)
  - Deletado `src/pages/BattlePage.jsx`
  - Removido import + rota `battle` em `App.jsx`
  - Removido botão "2 Jogadores" e ícone `Swords` do `MenuPage.jsx`

### Adicionado
- Placeholder "Ranking em breve" (botão desabilitado, ícone `Medal`) no lugar do antigo botão 2 Jogadores — reserva o espaço para a futura página "Ranking de QI Matemático"

### Melhorado
- Card de perfil (level card) marcado estruturalmente para futuras adições (ofensiva, ranking, QI, recompensas) — sem alteração visual

### Nota
- Identidade visual, cores, layout e estética originais 100% preservados

---

## [2.1.1] — 2026-05-22 — DEPLOY VERCEL

### Adicionado
- Deploy em produção: https://tabuada-rush-rho.vercel.app
- Variáveis de ambiente configuradas no Vercel (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)

### Corrigido
- Conflito de merge no `index.html` resolvido via force push (remote tinha versão v1 vanilla)

---

## [2.1.0] — 2026-05-22 — FASE 2: AUTH + AUDIO + CLOUD

### Adicionado
- Sistema de áudio via Web Audio API (zero arquivos — 100% sintetizado)
  - 10 sons: correct, wrong, combo, levelUp, achievement, gameOver, victory, click, timerWarning, newRecord
  - Mute/unmute com persistência em localStorage
  - Hook `useAudio` para toggle no UI
- Autenticação com Supabase (email/senha)
  - AuthPage com tabs login/cadastro, validação e feedback
  - Login opcional — app funciona 100% sem conta
  - Botão de logout no header do menu
- Sincronização em nuvem via Supabase
  - Migração automática: localStorage → Supabase no primeiro login
  - Sync automático após cada partida
  - Degradação graceful sem credenciais configuradas
- Exportação de dados na StatsPage
  - JSON completo (stats + conquistas + histórico)
  - CSV do histórico de sessões
- Streak diária visível no level card (🔥 N dias)
- Toast "Novo Recorde!" além de level up e conquistas
- `SUPABASE_SETUP.md` — guia passo a passo para configurar backend
- `.env.example` — template de variáveis de ambiente

### Melhorado
- MenuPage: controles de áudio e auth no header
- GamePage: sons em todos os eventos (acerto, erro, combo, timer, fim)
- AppContext: sync automático com cloud quando logado
- Lógica de streak mais precisa (não duplica em jogos múltiplos no mesmo dia)

### Corrigido
- Removido React.StrictMode (conflito com Framer Motion AnimatePresence)
- Bug de streak: mantém valor se já jogou hoje (não incrementa duas vezes)

---

## [2.0.0] — 2026-05-22 — RECONSTRUÇÃO COMPLETA

### Adicionado
- React 18 + Vite 5 substituindo HTML/JS/CSS vanilla
- TailwindCSS 3 com design system completo
- Framer Motion para todas as animações
- Recharts para gráfico de evolução nas estatísticas
- Lucide React para ícones consistentes
- Design system com tokens CSS (paleta por modo)
- Font Nunito (Black 900 para impacto visual)
- Gradientes únicos por modo (violet, rose, amber, emerald)
- GamePage com useReducer (arquitetura limpa de estado)
- AchievementsPage com 16 conquistas e estados visuais
- BattlePage modo 2 jogadores local (split screen)
- Toast animado para conquistas desbloqueadas
- Toast animado para level up
- Sistema de memória persistente (MEMORY.md, etc.)
- .claude/launch.json para preview integrado

### Melhorado
- Modo Sobrevivência agora conta tempo decorrido
- Seed determinística para Desafio Diário (LCG algorithm)
- Persistência mais robusta com defaults completos
- Animações de feedback (shake no erro, pop no acerto)
- Combo popup animado a cada 5 streak
- Progress bar por modo com cor temática
- Empty states elegantes em Recordes e Estatísticas

### Removido
- index.html vanilla (substituído pelo entry point Vite)
- Chart.js (substituído por Recharts)
- Toda lógica inline no HTML

---

## [1.0.0] — 2026-05 — VERSÃO INICIAL

- HTML/CSS/JS vanilla em arquivo único
- 4 modos de jogo básicos
- localStorage simples
- Chart.js para gráfico
- Service Worker básico
