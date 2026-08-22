# ⚡ MEMORY_CORE.md — Estado Atual do Projeto

> Atualizar a cada sessão. Manter pequeno e rápido de ler.

---

## 🗂️ INSTRUÇÃO PERMANENTE — DOCUMENTO

**Quando o usuário (Davi) disser "documento" neste projeto:**
→ Atualizar o arquivo `C:\Users\HP\Documents\TabuadaRush - jogo\Tabuada (2).docx` (dentro da pasta do projeto — pode ser commitado no Git).
→ Ler o documento completo primeiro (via skill `anthropic-skills:docx` ou agente), identificar onde parou, e acrescentar as mudanças da sessão atual mantendo a formatação/estilo existente.
→ Após atualizar, fazer commit do `.docx` junto com os demais arquivos da sessão.
→ O documento registra o histórico completo do projeto: versões, funcionalidades, sessões de desenvolvimento.

---

---

## 📍 ESTADO ATUAL

**Data:** 2026-08-17
**Versão:** 6.0.14 (Tabuada Rush 6.0 completo + Fases 1-2 do backlog (ícones + XP Dobrado removido) — sessao-065.md)
**Status:** ✅ A 5.0 foi considerada insatisfatória pelo Davi e foi **substituída por um
reset completo (6.0)** — não uma continuação. Reset implementado em 7 blocos ao longo
das sessões 044-050 (2026-08-16 a 2026-08-17), sem pausa de confirmação a cada bloco
("vamos terminar esses blocos"/"bora pra próxima"), com decisões não-óbvias sinalizadas
nos registros mesmo assim (ver D020-D026). Sessão 051: fechados os débitos conhecidos
(D027-D029). Sessão 052: o Davi respondeu com especificações concretas pras perguntas
em aberto do Bloco 4 (XP/faixa, personagens/liga, zonas de promoção) — recalibração
completa implementada, incluindo um modelo de tempo novo (ciclo global de 6 dias) que
também resolveu o bug de ping-pong de forma mais robusta que o fix da sessão 051.
Sessão 053: fechou o último ponto em aberto de D030 ("ver outras divisões") — mostrei
3 mockups de UI num artifact interativo antes de codar, o Davi escolheu a escada
vertical com uma regra de acesso dele mesmo (bloqueio por progresso já alcançado).
Sessão 054: Davi mandou screenshots do stat bar do Duolingo (bandeira/ofensiva/
gemas/vidas + os 4 painéis de hover) como referência de PADRÃO de interação — Header
reescrito nesse padrão, mas com os sistemas reais do jogo (sem inventar "amigos"/
assinatura que o Duolingo tem e o Tabuada Rush não).
Sessão 055: Davi corrigiu duas coisas em cima do que foi entregue (escada de Ligas
devia ser carrossel HORIZONTAL, não vertical; Header devia estar no canto superior
direito, não centralizado) e mandou 3 imagens (foguinho/moedinha/coração) pra
substituir os ícones — **isso ficou bloqueado**, minhas ferramentas não conseguem
extrair o binário de imagem colada no chat, precisa que ele salve os arquivos no
projeto. Ver D033.
Sessão 056: Davi reprovou o carrossel ("letras quase em cima do ícone, cortado") e
cobrou por que eu entrego tela sem ver rodando. **Causa raiz achada:** o Browser pane
estava COLAPSADO na tela dele — navegador não renderiza aba invisível, o que congela
o `requestAnimationFrame` e trava a transição `AnimatePresence mode="wait"`. Não era
limitação de IA, era janela fechada. Ver D034.
**[v6.0.14]** Fases 1-2 do `PLANO_ACAO.md`: 16 ícones novos (vidas, vida extra —
ícone DEDICADO coração+cruz, diferente do genérico, apesar da instrução escrita
dizer "mesmo ícone" — arquivo mais específico venceu; congelar/largada/+60s/
ofensiva trocados; missões diárias/mensais; mochila/poções/baús registrados pras
Fases 3/4/6 futuras). **XP Dobrado removido do jogo inteiro** (Loja, cálculo de
XP, HUD, resumo — substituído pelas Poções de XP ainda não implementadas). Regra
nova: botão "Congelar Missão" só aparece com o item já em estoque, sem fallback
de comprar na hora. Ver `sessao-065.md` e D043.
**[v6.0.13]** Cards da Loja unificados (o Épico aparecia branco no tema escuro —
`bg-purple-50` era a única raridade sem override; agora todo card usa
`bg-surface`/`border-border`, raridade só na etiqueta). + Guia de estilo Duolingo
extraído de verdade das 8 imagens que o Davi mandou (formas só arredondadas, ritmo,
~15 formas, paleta oficial de 34 cores) — vira referência pra ícones futuros, ver
D041. **Esta sessão (063) ficou sem registro completo** — commit e CHANGELOG
aconteceram, mas sessao-063.md e este arquivo não foram atualizados na hora. Corrigido
retroativamente na sessão 064, com checagem de processo nova — ver D042.
**[v6.0.12]** Ícones dos 7 power-ups na Loja (folha de fundo BRANCO com desenho
branco — exigiu flood fill de tolerância 8 + alpha chapado; rampa suave dava
chuvisco). **Bug de fuso CORRIGIDO** a pedido do Davi: `localDateStr` novo em
utils, `todayStr()` delega, ~25 chaves de dia migradas (incluindo uma 2ª cópia de
`todayStr` escondida em missions.js). Guard de migração impede que save antigo com
data UTC no futuro zere a ofensiva. Ver `sessao-062.md` e D040.
**[v6.0.11]** Barra superior: ofensiva alterna acesa (laranja) / congelada (azul) —
reaproveita o "Seguro de Ofensiva" (`streakInsuredAt`) que JÁ existia, não inventei
estado novo. Calendário da semana com marcadores feito/congelado/vazio; medalhas de
1º/2º/3º nas Ligas. **Bug de fuso achado no caminho:** `toISOString()` é UTC, então
depois das 21h no Brasil o app já acha que é amanhã — corrigi no calendário, mas
`todayStr()` (vidas/ofensiva/desafio diário) segue com o problema e **precisa de
decisão do Davi**. Ver `sessao-061.md` e D039.
**[v6.0.10]** Varredura completa dos ícones — Davi listou um por um os lugares que a
059 deixou passar (Loja sem ícone no preço, Perfil com XP errado, Catálogo com liga/
ofensiva/XP/marcos errados). Regra dele: **todo** lugar que menciona moeda/ofensiva/XP
usa a arte. Item travado na Loja resolvido com `grayscale` no CSS (não precisou de
ícone preto novo). Ver `sessao-060.md` e D038.
**[v6.0.9]** Os 22 ícones de arte própria do Davi entraram no jogo (Header, Sidebar,
Ligas, Perfil, Loja, Missões, Jogo, Temporadas). Os arquivos vieram SEM transparência
(recorte de tela, fundos em tons diferentes) — pipeline de flood fill a partir das
bordas + recorte + fatiamento da folha de 9 divisões + redimensionamento (1269KB →
435KB). Componente `GameIcon`/`LeagueIcon`. Faixa de tabuada segue emoji (pedido dele).
11 lugares seguem com 💰 por serem string pura de toast. Ver `sessao-059.md` e D037.
**[v6.0.8]** Correções visuais das Ligas a partir de screenshots do Davi (foi assim
que consegui COMPARAR com a referência — foto no chat resolve o que o Browser pane
fechado impede): caixa de promoção não racha mais no meio de "(693 XP)", escudo não
fica cortado (`justify-center` corta pela ESQUERDA quando transborda), e **33 emoji
Unicode 13.0+ trocados por universais** — apareciam como `□` no Windows 10 do Davi,
incluindo a moeda 🪙→💰 que eu mesmo tinha introduzido na v6.0.4. Altura do header
virou a variável única `--header-h`. Ver `sessao-058.md` e D036.
**[v6.0.7]** Ligas em 2 colunas: escudos + bloco da divisão FIXOS, classificação rola
dentro da própria caixa. Painel lateral com "Sua corrida" + ficha do personagem
(clicar numa linha abre a descrição que os 114 personagens já tinham e nunca
aparecia). Ver `sessao-057.md` e D035.
**[v6.0.6]** Ligas refeita seguindo a referência à risca: escudos SEM rótulo de texto
(origem da colisão), nome da divisão grande, "Os N primeiros avançam...", prazo do
ciclo, classificação. Card "Liga X de 10 / posição" REMOVIDO. Ferramentas novas pra
eu verificar sozinho: atalho `?screen=` só em DEV + asserções de geometria via JS.
Ver `sessao-056.md` e D034.
**[v6.0.5]** Ligas: escada vertical virou carrossel horizontal rolável (fileira de
divisões no topo, roster embaixo, sem modal). Header: grupo de indicadores saiu do
centro e foi pro canto superior direito. Ver `sessao-055.md` e D033.
**[v6.0.4]** Header maior (70px, era ~48px), faixa de tabuada juntada ao grupo de
ofensiva/moedas/vidas (antes isolada na ponta esquerda), ícone de moedas trocou de
`Coins` (lucide) pra 🪙, e cada uma das 4 pills abre um painel no hover/clique com
ação real (Ver perfil / Ir pra loja / Recuperar vidas). Ver `sessao-054.md` e D032.
**[v6.0.3]** Tela de Ligas virou escada vertical (Bronze embaixo → Diamante no topo).
Só é possível ver roster + classificação de uma liga que o jogador JÁ alcançou algum
dia (`leagueHighestId`, nunca desce com rebaixamento) — ligas acima disso ficam
bloqueadas (cadeado, sem nome/roster visível). **Não confirmado visualmente ainda**
(limitação do Browser pane deste ambiente, ver BUGS.md) — pedir ao Davi pra testar.
Ver `sessao-053.md` e D031.
**[v6.0.2]** Recalibração completa das Ligas: XP das faixas de tabuada recalculado
(âncoras do Davi), personagens por liga decrescendo 20→4 (114 no total, Einstein foi
pra Diamante), zonas de promoção decrescendo 8→0, promoção/rebaixamento agora por
CICLO de 6 dias (não mais por partida — resolve D023 de vez), 9 conquistas novas por
liga, bônus de XP no pódio Diamante. Ver `sessao-052.md` e D030.
**[v6.0.1]** Rebaixamento por inatividade reintroduzido com grace period de 3 dias
(corrige a causa raiz do bug do Bloco 4, não só remove a feature — SUPERADO pelo
modelo de ciclo da v6.0.2, ver D030); Pódios nas ligas implementado; filtros de modo
mortos removidos de HitsPage/ErrorsPage/AccuracyCatalogPage. Ver `sessao-051.md` e D027-D029.
**[v6.0.0]** Bloco 7/7 (Estatísticas) — guia lateral tipo Notion (implementado sem a
referência visual que o Davi ia mandar, nunca chegou — D026), remove "Partidas por
modo"/"Power-ups"/"Modo Favorito", Acertos/Erros migram pro Catálogo de Precisão,
corrige gráfico "Evolução" que filtrava por modo morto. **RESET 6.0 COMPLETO** — ver
`sessao-050.md` e a seção "🎨 TABUADA RUSH 6.0" abaixo pro resumo de todos os blocos.
**[v6.0.0-bloco5]** Missões: semanais removidas por completo; desafios mensais
viraram "aposta com prazo" — precisa aceitar, não cumprir até o prazo desconta
`penalty` do saldo (**pode ficar negativo**, testado e confirmado). Congelar
Missão repropositado pra estender prazo de desafio mensal (+10 dias). Ver
`sessao-048.md` e D024.
**[v6.0.0-bloco4]** Ligas (10 ligas × 100 personagens) substitui o Ranking de QI —
competição de verdade por XP, com promoção/rebaixamento (`constants/leagues.js`,
`utils/leagues.js`). Sistema antigo (`getQiInfo`) NÃO foi removido, continua
alimentando 5 telas que ainda não passaram pelo reset (decisão de escopo, ver D023).
Um bug de "ping-pong" de liga foi encontrado e corrigido durante a implementação
(promoção/rebaixamento só é checado em fim de partida agora). Ver `sessao-047.md`.
**[v6.0.0-bloco3]** `LEVELS` deixou de ser 28 níveis abstratos e virou 20 faixas de
tabuada literais (2×10 → 190×200) — o fator `a` das perguntas passa a vir da faixa
atual do jogador (`utils/getTierRange`), fator vai até 200 de verdade (confirmado
com o Davi, D022). Calibração de XP por faixa é estimativa documentada. Ver
`sessao-046.md`.
**[v6.0.0-bloco2]** Vidas diárias (pote global de 5, estilo Duolingo) — desconta em
QUALQUER modo (inclusive Zen), bloqueia início de partida nova quando zera, repõe por
150 moedas (pote inteiro). Coexiste com o sistema de vidas por partida que já existia
(Rush, `cfg.lives`) sem substituí-lo — ver `sessao-045.md` e D021.
**[v6.0.0-bloco1]** Reset visual: paleta semântica dark-first via CSS var (tema escuro
é o padrão agora), sidebar com 5 destinos novos (Arena/Ligas/Missões/Loja/Perfil),
header persistente (faixa/ofensiva/moedas/vidas — faixa ainda é placeholder até o
Bloco 3), Perfil novo (resumo mínimo). Ver `sessao-044.md` e `DECISIONS.md` D020.
**[v5.0.0]** Redesign completo por pedido do Davi: paleta própria "Caderno Quadriculado" (só aplicada no Menu + tokens base, resto do app pendente), sidebar de navegação (desktop), Menu simplificado (3 destinos primários: Modos/Recompensas/Estatísticas), **modos reduzidos de 10 pra 3** (Rush agora é a fusão de Rush+Sobrevivência+Velocidade+Diário — timer cresce com acerto, 3 vidas —, Zen e Revisão mantidos), **desbloqueio progressivo removido** (tudo liberado desde o início — reverte D008), Ranking de QI 104→52 personagens, Loja só com power-ups (cosméticos removidos, 2 power-ups novos: Escudo e Largada Turbo), economia mais dura (menos moeda por partida, Zen sem XP/moeda), e **mascotes Tuca (tartaruga) e Vupt (lebre)** — fábula de Esopo, arte gerada por IA (ChatGPT+Pika) processada por um pipeline Python próprio (remoção de fundo + WebP animado), integrados no GamePage com frequência controlada (sorteio + teto por partida). Balão de fala e voz do mascote foram DESLIGADOS temporariamente (Davi vai mandar frases/áudio finais). Ver `sessao-043.md` e `DECISIONS.md` D015-D019.
**[v3.17.0]** Tabuada Rush voltou a ser exclusivamente sobre MULTIPLICAÇÃO — esse é o propósito original do projeto (decorar a tabuada) e a 4.0 tinha diluído isso pra "ser bom em matemática" (4 operações). Removido: `OPERATIONS.add/.sub/.div`, seletor de operação, abas de operação, radar cross-operação, certificado "Matemática Fundamental Completa", bônus de amplitude no QI. Mantido: curva de esquecimento, motor preditivo no Modo Revisão, banner "Fatos a Vencer", viés adaptativo por fatos fracos (toggle "Foco em Fraquezas"). Ver `sessao-042.md`.
**[v3.16.1]** Leaderboard Global removido por completo (página, botão, upload de score) — pedido direto do Davi. Desafio Diário/Semanal continuam existindo, só sem comparação global. Tabelas `leaderboard_daily`/`leaderboard_weekly` no Supabase ficaram órfãs (não apagadas — ver `SUPABASE_SETUP.md`).
**Servidor dev:** `http://localhost:3000` (npm run dev) · **Produção:** https://tabuada-rush-rho.vercel.app

---

## ✅ TABUADA RUSH 3.0 — ROADMAP 100% ENTREGUE (v3.3.0 → v3.8.0 · sessões 026-031)

> Filosofia: "praticar → memorizar" via Repetição Espaçada. 6 fases, 20+ features:
> Mapa de Domínio, SRS/Flashcard, Certificados, Modo Inverso, economia reformulada,
> Modo Difícil, Recorde Pessoal, Desafio Semanal, Leaderboards, Heatmap, Share Card,
> Tabuada 11/12, Modo Combinado. Detalhes completos em `sessions/sessao-025.md`
> (planejamento) e `sessions/sessao-031.md` (fechamento).

---

## ⚠️ TABUADA RUSH 4.0 — ENTREGUE E DEPOIS PARCIALMENTE REVERTIDO (v3.11.0 → v3.17.0)

> A 4.0 foi entregue completa (Fases 1-6, sessões 035-040, v3.11.0→v3.16.0)
> com dois pilares: "Matemática Completa" (soma/subtração/divisão) e
> "Inteligência Adaptativa" (curva de esquecimento, viés por fraqueza). Na
> sessão 042, Davi refletiu que o pilar "Matemática Completa" tinha diluído o
> propósito ORIGINAL do projeto (decorar a TABUADA, não "ser bom em
> matemática") — e reverteu essa parte. **Só "Inteligência Adaptativa"
> sobreviveu**, agora escopada só pra multiplicação. Ver `DECISIONS.md` D014
> e `sessions/sessao-042.md` pro registro completo da decisão e da reversão.
>
> **O que existe hoje (pós-reversão):** curva de esquecimento
> (`predictRecallProbability`/`getFactsAtRisk`), motor preditivo no Modo
> Revisão, banner "Fatos a Vencer", viés adaptativo por fatos fracos em
> Rush/Sobrevivência/Velocidade/Zen (toggle "Foco em Fraquezas"). **O que foi
> removido:** `OPERATIONS.add/.sub/.div`, seletor de operação, abas de
> operação, radar cross-operação, certificado "Matemática Fundamental
> Completa", bônus de amplitude no QI.
>
> **Bugs corrigidos ao longo do caminho (histórico):** B007 (contador de
> certificados hardcoded) e B008 (`tableStats` sempre `.mult` no GamePage)
> — ver `BUGS.md`.

**Sem roadmap formal em aberto.** Próxima sessão: ver seção abaixo.

---

## 🎨 TABUADA RUSH 6.0 — ✅ COMPLETO (v5.0.0 → v6.0.0 · sessões 044-050)

> Reset completo pedido pelo Davi — substitui a 5.0, não a continua (pendências da 5.0
> abaixo ficam obsoletas). Spec inteira em `sessions/planejamento-6.0.md`, 7 blocos,
> todos entregues entre 2026-08-16 e 2026-08-17. Sem próximo bloco planejado — fica
> a critério do Davi decidir os próximos passos do projeto a partir daqui.
>
> **Bloco 1/7 — Base visual — ENTREGUE (sessao-044):** tokens de cor semânticos
> dark-first via CSS var, tema escuro como padrão, sidebar nova (Arena/Ligas/Missões/
> Loja/Perfil), header persistente novo, Perfil novo (resumo mínimo). Ver D020.
>
> **Bloco 2/7 — Vidas diárias — ENTREGUE (sessao-045):** pote global de 5/dia estilo
> Duolingo, desconta em qualquer modo, bloqueia início de partida quando zera, repõe
> por 150 moedas. Coexiste com o sistema de vidas por partida (não substituiu). Ver
> D021.
>
> **Bloco 3/7 — Progressão de tabuada — ENTREGUE (sessao-046):** `LEVELS` virou 20
> faixas de tabuada (2×10 → 190×200), motor de perguntas usa a faixa atual do
> jogador pro fator `a`. Fator vai até 200 DE VERDADE — confirmado com o Davi
> mesmo com a tensão contra "só tabuada tradicional". Calibração de XP é
> estimativa. Ver D022.
>
> **Bloco 4/7 — Ligas — ENTREGUE (sessao-047):** 10 ligas × 100 personagens,
> competição por XP simulado, promoção/rebaixamento em fim de partida. Sistema
> antigo (Ranking de QI) mantido em paralelo pras 5 telas ainda não migradas.
> Ver D023.
>
> **Bloco 5/7 — Missões — ENTREGUE (sessao-048):** semanais removidas; mensais
> viraram desafios com aceite + penalidade (saldo pode ficar negativo, testado).
> Metas revisadas pra baixo em relação ao pool antigo. Ver D024.
>
> **Bloco 6/7 — Perfil completo — ENTREGUE (sessao-049):** absorve Conquistas/
> Recordes/Catálogo. Sistema antigo de QI removido por completo (não só trocado
> de tela) — ver D025.
>
> **Bloco 7/7 — Estatísticas — ENTREGUE (sessao-050):** guia lateral tipo Notion
> (implementado sem a referência visual do Davi, nunca chegou — D026), remove
> "Partidas por modo"/"Power-ups"/"Modo Favorito", Acertos/Erros migram pro
> Catálogo de Precisão, corrige gráfico "Evolução" que filtrava modo morto.
>
> **Pontos que o próprio Davi disse "não sei ainda"** (não inventar sozinho, alinhar
> antes de implementar): nº de personagens por liga e tamanho das zonas de promoção/
> rebaixamento, nome de exibição das faixas de tabuada, cálculo de XP/dia realista pra
> bater a meta de 6-10 meses na 1ª faixa. Ver planejamento-6.0.md seção 12.

---

## 🎨 TABUADA RUSH 5.0 — SUBSTITUÍDA PELA 6.0, NÃO RETOMAR (v4.x → v5.0.0 · sessão 043)

> Sessão 043 foi um redesign grande e não terminou 100% fechado — várias
> frentes ficaram pela metade de propósito (build limpo em todas, mas UI
> inconsistente entre telas até a próxima sessão terminar a migração). Ver
> `sessions/sessao-043.md` (registro completo, cronológico, inclui os
> caminhos tentados e descartados) e `DECISIONS.md` D015-D019.
>
> **Entregue nesta sessão:** paleta "Caderno Quadriculado" (só Menu +
> tokens base), sidebar desktop, Menu QI-first com 3 destinos primários,
> modos reduzidos de 10→3 (Rush fundido, Zen, Revisão), desbloqueio
> progressivo removido, Ranking de QI 104→52, Loja só power-ups (+Escudo
> +Largada Turbo), economia mais dura, mascotes Tuca/Vupt com pipeline de
> animação próprio.
>
> **NÃO entregue (pendência direta, sem ambiguidade — ver PRÓXIMA SESSÃO):**
> paleta nas telas restantes, reorganização de verdade da StatsPage,
> tamanho/posição final do mascote, balão de fala + voz (desligados,
> esperando conteúdo final do Davi), painel temático por personagem
> específico (não só por tier).
>
> **Pausado por decisão do Davi, não é bug nem esquecimento:** Modo
> História (narrativa infinita) — ver D018.

---

## ✅ O QUE ESTÁ PRONTO

- [x] Setup React + Vite + Tailwind + Framer Motion + Recharts
- [x] Design system com tokens CSS + paleta por modo
- [x] MenuPage com level card, streak, auth button, audio toggle
- [x] GamePage com useReducer + timer + animações + sons
- [x] Modo Rush / Sobrevivência / Velocidade / Desafio Diário
- [x] ResultsPage com stats animadas + gradiente por modo
- [x] RecordsPage / StatsPage / AchievementsPage / BattlePage
- [x] Persistência localStorage completa
- [x] Sistema de XP e níveis (7 níveis)
- [x] Sistema de conquistas (16 conquistas)
- [x] Toast de conquista + level up + novo recorde animados
- [x] **[NOVO v2.1] Sistema de áudio — Web Audio API (audioManager.js)**
  - Sons: correct, wrong, combo, levelUp, achievement, gameOver, victory, timerWarning, newRecord, click
  - Mute/unmute persistido em localStorage
  - Hook useAudio.js para toggle no menu
- [x] **[NOVO v2.1] Supabase Auth — email/senha**
  - AuthContext.jsx com signIn, signUp, signOut
  - AuthPage.jsx com UI premium (login/register)
  - Tela acessível via botão Login no MenuPage
  - Graceful degradation quando Supabase não configurado
- [x] **[NOVO v2.1] Cloud Sync (Supabase)**
  - sync.js: loadCloudData + saveCloudData
  - AppContext atualizado: auto-sync no update()
  - Migração automática: localStorage → Supabase no primeiro login
  - Dados preservados offline (localStorage sempre ativo)
- [x] **[NOVO v2.1] Exportação de dados (StatsPage)**
  - Exportar JSON completo
  - Exportar CSV do histórico de sessões
- [x] **[NOVO v2.1] Streak diária visível no level card**
  - 🔥 N dias exibido no card de nível
- [x] Sistema de memória persistente (MEMORY.md, MEMORY_CORE.md, etc.)
- [x] **[v2.2 — Fase 1/Bloco 1] Modo 2 Jogadores removido** (BattlePage deletado, rota e botão removidos, sem código morto)
- [x] **[v2.2] Espaço de Ranking preparado** — placeholder "Ranking em breve" (Medal, disabled) no MenuPage
- [x] **[v2.3 — Fase 2/Bloco 2] Sistema de níveis 28 níveis** com `name` + `title` + `badge` + `xp`
- [x] **[v2.3] Sistema de títulos** do usuário (muda por nível), visível no perfil e ResultsPage
- [x] **[v2.3] XP integrado** — score + bônus de diário (+30) + bônus de ofensiva
- [x] **[v2.3] Ofensiva diária + recorde** (`currentStreak` + `bestDayStreak`)
- [x] **[v2.3] Meta de ofensiva** (`streakGoal` 7/15/30/100) com progresso, no card de perfil
- [x] **[v2.3] Card de perfil completo** (avatar, título, nível, XP, ofensiva, recorde, meta)
- [x] **[v2.3] Desafio Diário desbloqueado** (sempre acessível; badge "✓ hoje" informativo)
- [x] **[v2.4 — Fase 2/Bloco 3] Ranking de QI Matemático** — página `RankingPage` + botão "Ranking QI"
- [x] **[v2.4] 104 personagens** (`constants/characters.js`) em 4 categorias (26 cada)
- [x] **[v2.4] computeQI / getQiInfo** (`utils`) — QI lúdico 70–200 → posição/personagem
- [x] **[v2.4] QI no card de perfil** (linha pequena, clicável → ranking)
- [x] **[v2.11 — Fase 5/Bloco 8] Catálogo de Progresso** (`CatalogPage`): Progresso Geral, XP, Evolução (semana/mês/total), Marcos, Catálogo de Níveis (28), Registro de Evolução
- [x] **[v2.11] `progressLog`** no storage + `detectProgressEvents()` (marcos de nível/XP/ofensiva/recorde) anexados no `handleGameEnd`
- [x] **[v2.12 — Fase 5/Bloco 9] Catálogo de Precisão** (`AccuracyCatalogPage`, acesso dentro da Estatísticas): precisão (geral/semana/mês/modo), velocidade, erros, precisão por tabuada, histórico (LineChart)
- [x] **[v2.12] `tableStats`** no storage — GamePage registra por questão (`{a,b,correct,ms}`) → `handleGameEnd` agrega por tabuada (fator `a`)
- [x] **[v2.13 — Bloco 10] Dashboards de Acertos e Erros** — sub-páginas internas da StatsPage
- [x] **[v3.0 — Calibração] XP puro por performance + QI mais difícil + Reset de progresso**
  - XP = score × multiplicador por modo (Rush 0.18, Survival 0.30, Speed 0.25, Daily 0.40)
  - Removidos bônus de streak/dia — XP é 100% mérito do jogador
  - LEVELS com thresholds ×2 (equilíbrio): nível 5 em ~1 mês, nível 10 em ~5 meses
  - computeQI mais difícil: caps speedBest→80, totalGames→300, bestDayStreak→120
  - SettingsPage: botão "Resetar Progresso" com confirmação de 2 etapas (Zona de Perigo)
- [x] **[v2.14 — FASE 7] Sistema de Moedas, Loja, Missões e Temporadas**
  - `constants/shop.js`: 4 raridades, 12 itens (molduras/títulos/temas de card)
  - `ShopPage.jsx`: compra e equipa itens; cosméticos refletem no card de perfil (MenuPage)
  - `constants/missions.js` + `utils/missions.js`: pools diário/semanal/mensal, LCG determinístico, reset automático
  - `MissionsPage.jsx`: progresso, resgates, badge de notificação no menu
  - `constants/seasons.js` + `SeasonsPage.jsx`: Temporada 1 "Despertar Matemático", trilha 10 marcos, XP separado
  - `handleGameEnd` integrado: coins earned, season XP, missions update a cada partida
- [x] **[v3.1] Modos Zen e Revisão, mascote, INSANE COMBO, partículas level-up, PWA**
  - `MODES.zen`: treino livre, XP zero, botão "Encerrar Treino"
  - `MODES.review`: 15 questões focadas nas piores tabuadas (`getRevisionQuestions`)
  - `TRAINING_MODE_LIST`: seção "Treino" separada no menu
  - GamePage: mascote reativo (🤓/🤩/😬/🔥/🤯), INSANE COMBO ao streak ≥ 10, screen shake
  - ResultsPage: stat "Tempo Médio/Resp." + "XP Ganho"
  - StatsPage: gráfico "Erros — Últimos 7 Dias" (barras por dia da semana)
  - App: `LevelUpBurst` (28 partículas coloridas ao subir nível), `InstallBanner` (PWA)

---

## 🎯 PRÓXIMA SESSÃO — FASE 3 DO `PLANO_ACAO.md` (Mochila)

**Ler antes de tocar em qualquer código:** `PLANO_ACAO.md` (raiz do projeto
— é a fonte viva do que fazer, atualizada a cada sessão) →
`sessions/sessao-065.md` (a mais recente) → `DECISIONS.md` D020-D043.

**Fases 0, 1 e 2 concluídas** (sessões 064-065): registro corrigido,
16 ícones novos trocados/registrados, XP Dobrado removido do jogo inteiro,
regra nova do botão Congelar Missão (só aparece com item em estoque).
**`PLANO_ACAO.md` é a lista de verdade; não duplicar o backlog aqui.**

**Próxima: Fase 3 (Mochila) → Fase 4 (Poções de XP) → Fase 5 (loja
rotativa diária) → Fase 6 (baús/recompensas por tempo de jogo) → Fase 7
(páginas de resumo pós-partida) → depois disso, o painel central da
Arena** (ele pediu pra NÃO mexer nele antes de fechar o resto).

**Ideias soltas que aparecerem no meio do caminho (ex.: animação nas telas
finais) vão pra `PENDENCIAS.md`, não pro meio da fase atual.**

**Duas escolhas minhas da sessão 065 que precisam de confirmação do Davi
(ver D043) antes de seguir muito mais fundo no backpack/poções:**
- Ícone do power-up Vida Extra: usei o coração-com-cruz dedicado
  (`pu-vida-extra`) em vez do coração genérico, porque o arquivo baixado
  era mais específico que a instrução escrita.
- Mapeamento dos 3 tiers de Poção de XP por FORMATO do frasco (tubo=x1,5,
  erlenmeyer=x2, redonda=x3) — a folha não diferencia por cor, é
  suposição minha.

**Em aberto, ainda sem resposta do Davi:**
- Ícone de ofensiva usado também em "Melhor Sequência" (D038) — confunde?
- Estilo dos ícones futuros: chapado tipo Duolingo (D041) ou 3D/gradiente
  como os que já existem (moeda, baú)?
- Fase 6 (baús como recompensa aleatória por tempo de jogo) tem cara de
  mecânica de loot/gacha — não é motivo pra recusar, mas vale mencionar a
  guarda de escopo do projeto (mecânica de "vício" desconectada do
  aprendizado) quando chegar a vez de implementar.

**Lições de método que valem pra arte (D037/D039-D041/D043):** conferir
PNG com transparência SEMPRE composto sobre o fundo escuro real do app —
arquivo solto no visualizador engana (branco sobre branco). E: arquivo
mais específico que a instrução escrita do Davi tende a vencer (ele edita
o pedido conforme baixa a arte) — sinalizar a escolha, não travar nela.

**Checagem de processo (D042):** antes de encerrar qualquer sessão,
conferir que a `Versão` no topo deste arquivo bate com a última entrada do
`CHANGELOG.md`. Se não bater, a rotina de fim de bloco (`CLAUDE.md`) não
foi cumprida — voltar e completar antes de seguir.

**Pausado por decisão explícita do Davi, não retomar sem ele pedir:** Modo
História (narrativa infinita) — ver D018.

---

## 🐛 BUGS CONHECIDOS

- Nenhum bug ativo conhecido no APP em si. **Pendente de confirmação visual
  (não é bug conhecido, é falta de teste):** carrossel de Ligas e
  reposicionamento do Header da sessão 055 (D033), Header maior/painéis da
  sessão 054 (D032) — build limpo, código revisado
  (e no caso do Header, conteúdo/lógica testados via DOM/JS), mas animação e
  posicionamento visual reais não testados neste ambiente. Ver seção
  "PRÓXIMA SESSÃO" acima.
- **Ambiente de preview — CAUSA RAIZ RESOLVIDA na sessão 056 (ver D034):** o
  Browser pane estava COLAPSADO na tela do Davi. Navegador não compõe frames
  de aba invisível → `document.hidden === true` → `requestAnimationFrame`
  congela → `AnimatePresence mode="wait"` do `App.jsx` nunca completa → tela
  nova nunca monta (por isso clique em nav "não funcionava"). **Solução:**
  Davi abrir o Browser pane. **Contorno do meu lado:** atalho `?screen=<tela>`
  só em DEV (`App.jsx`) monta qualquer tela direto, + asserções de geometria
  via `getBoundingClientRect` pra detectar sobreposição/corte/colisão sem
  precisar enxergar. `tabs_select` NÃO resolve (testado).
- **Histórico (o que se sabia antes da causa raiz):** o Browser pane
  não compôs frames (`screenshot` falha, cliques via
  `computer`/dispatch de evento não produzem navegação observável) —
  testado exaustivamente na sessão 043 (aba nova, servidor reiniciado, ref
  click, coordinate click, dispatch nativo, handler React direto — sempre
  o mesmo resultado). Leitura (`get_page_text`/`read_page`/JS de inspeção)
  funciona normal. Recomendação: não tentar screenshot/clique nesse
  ambiente — verificar por build limpo + inspeção de DOM via JS, e pedir
  confirmação visual ao Davi quando precisar de certeza.

---

## 🔑 ARQUIVOS CRÍTICOS

| Arquivo | Importância |
|---------|-------------|
| `src/App.jsx` | Orquestrador geral + handleGameEnd + toasts |
| `src/pages/GamePage.jsx` | Lógica do jogo + áudio integrado |
| `src/lib/storage.js` | localStorage KEY: `tabuada_rush_v2` |
| `src/lib/audioManager.js` | Web Audio API singleton |
| `src/lib/supabase.js` | Cliente Supabase + isSupabaseConfigured |
| `src/contexts/AuthContext.jsx` | Auth state + signIn/signUp/signOut |
| `src/contexts/AppContext.jsx` | Data state + cloud sync |
| `src/services/sync.js` | loadCloudData + saveCloudData |
| `src/pages/HitsPage.jsx` | Dashboard de Acertos (sub-página interna de StatsPage) |
| `src/pages/ErrorsPage.jsx` | Dashboard de Erros (sub-página interna de StatsPage) |
| `src/pages/ShopPage.jsx` | Loja — só power-ups desde a 5.0 (cosméticos removidos) |
| `src/pages/RewardsPage.jsx` | [v5.0] Hub com abas Missões/Loja/Temporada |
| `src/pages/MissionsPage.jsx` | Missões diárias/semanais/mensais |
| `src/pages/SeasonsPage.jsx` | Trilha de temporada com recompensas |
| `src/components/Sidebar.jsx` | [v6.0] Nav lateral, desktop-only (`lg+`) — 5 destinos: Arena/Ligas/Missões/Loja/Perfil |
| `src/components/Header.jsx` | [v6.0] Barra superior persistente (faixa/ofensiva/moedas/vidas) |
| `src/pages/PerfilPage.jsx` | [v6.0 · Bloco 6] Perfil completo — faixa+liga, stats, Conquistas/Recordes/Catálogo |
| `src/constants/leagues.js` | [v6.0 · Bloco 4] 10 ligas + 100 personagens |
| `src/utils/leagues.js` | [v6.0 · Bloco 4] Motor da competição (XP simulado, standings, promoção/rebaixamento) |
| `src/pages/RankingPage.jsx` | [v6.0 · Bloco 4] Página "Ligas" — reescrita, usa `utils/leagues.js` |
| `src/components/Mascot.jsx` | [v5.0] Sistema de mascote — Tuca/Vupt, poses por humor, frequência controlada em `GamePage` |
| `src/assets/mascots/*.webp` | [v5.0] Poses animadas (geradas por IA + pipeline Python de remoção de fundo — ver D019) |
| `src/constants/shop.js` | Itens da loja — só `powerup` desde a 5.0 |
| `src/constants/missions.js` | Pools de missões por período |
| `src/constants/seasons.js` | Temporadas, calcSeasonXp |
| `src/utils/missions.js` | Lógica completa de missões |
| `src/constants/index.js` | MODES, LEVELS, ACHIEVEMENTS |
| `src/utils/index.js` | getDailyQuestions, calcPoints, checkNewAchievements |
| `SUPABASE_SETUP.md` | Guia passo a passo para configurar backend |
| `.env.example` | Template de variáveis de ambiente |

---

## 🔁 ROTINA DE FIM DE BLOCO/SESSÃO (obrigatória — pedida pelo Davi)

Ao concluir cada bloco/sessão: (1) registros completos (.md = vault Obsidian),
(2) commit + `git push origin main`, (3) deploy Vercel AUTOMÁTICO via integração Git
(o push dispara — não usar CLI, token expirou), (4) resumo final ao usuário: o que foi
feito + próximos passos/sessões/etapas. Detalhes em `CLAUDE.md`. Dar o link do projeto

---

## 💡 CONTEXTO RÁPIDO PARA IA

Para continuar qualquer sessão, ler nesta ordem:
1. Este arquivo (MEMORY_CORE.md) — 2 min
2. `MEMORY.md` — 5 min (arquitetura completa)
3. `PLANO_ACAO.md` — backlog vivo em andamento (D042) — ler ANTES de codar
4. `sessions/planejamento-6.0.md` — spec completa do reset 6.0, COMPLETO (todas as 7 seções ✅)
5. `sessions/sessao-065.md` — última sessão → `sessions/sessao-064.md` → `sessions/sessao-063.md`
6. `DECISIONS.md` D020-D043 (reset 6.0 + limpeza + recalibração + Ligas/Header + processo + backlog) — D015-D019 (5.0) são história, não aplicam mais
7. `BUGS.md` — problemas ativos

**Supabase não configurado:** App funciona 100% com localStorage.
Para ativar cloud: criar `.env` com `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY`
e executar o SQL de `SUPABASE_SETUP.md`.
