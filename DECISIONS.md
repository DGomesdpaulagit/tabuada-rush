# 🏛️ DECISIONS.md — Decisões Arquiteturais

---

## D001 — localStorage em vez de backend

**Data:** 2026-05-22  
**Contexto:** O projeto original usava Base44 SDK como backend.  
**Decisão:** Usar localStorage com abstração via `src/lib/storage.js`  
**Motivo:** Sem dependência de servidor, funciona offline, mais simples para v2.0  
**Trade-off:** Dados não sincronizados entre dispositivos, sem auth  
**Revisitar quando:** Quisermos leaderboards, sync multi-dispositivo ou auth social

---

## D002 — useReducer para GamePage

**Data:** 2026-05-22  
**Contexto:** GamePage tem estado complexo (score, streak, lives, phase, question, timer)  
**Decisão:** useReducer com actions (TICK, CORRECT, WRONG, NEXT, END)  
**Motivo:** Estado previsível, transições claras, sem bugs de stale closure nos updates  
**Trade-off:** Mais verboso do que useState múltiplos  

---

## D003 — Sem React Query

**Data:** 2026-05-22  
**Contexto:** App original usava @tanstack/react-query para dados do Base44  
**Decisão:** Não incluir React Query — apenas Context + localStorage  
**Motivo:** Sem chamadas de rede assíncronas, seria overhead desnecessário  
**Revisitar quando:** Adicionar backend real

---

## D004 — Gradientes inline via className Tailwind

**Data:** 2026-05-22  
**Contexto:** Cada modo tem seu gradiente  
**Decisão:** Armazenar classes Tailwind como strings nos MODES constants  
**Motivo:** Simples, sem CSS customizado, funciona com purge do Tailwind  
**Cuidado:** Classes precisam existir COMPLETAS no código (não concatenar parcialmente)

---

## D005 — Seed LCG para Desafio Diário

**Data:** 2026-05-22  
**Contexto:** 20 perguntas do dia precisam ser as mesmas para todos os usuários  
**Decisão:** Linear Congruential Generator com seed = YYYYMMDD  
**Motivo:** Determinístico, sem backend, sem sync necessário  
**Implementação:** `src/utils/index.js` → `getDailyQuestions()`

---

## D006 — AnimatePresence mode="wait"

**Data:** 2026-05-22  
**Contexto:** Transições entre páginas no App.jsx  
**Decisão:** `mode="wait"` para aguardar exit antes de enter  
**Motivo:** Evita sobreposição de páginas, transição limpa  
**Trade-off:** Levemente mais lento, mas mais elegante

---

## D008 — Supabase para Auth e Cloud Sync

**Data:** 2026-05-22  
**Contexto:** Usuário quer persistência real em nuvem e autenticação  
**Decisão:** Supabase (PostgreSQL + Auth) com tabela `profiles` (JSONB)  
**Motivo:** Free tier generoso (50k MAU), auth email/senha pronto, fácil com Vite, padrão React SaaS  
**Trade-off:** Requer configuração manual (criar projeto, SQL, .env)  
**Estrutura:** Um único campo `data JSONB` espelha o shape do localStorage — sem migrations extras

---

## D009 — Web Audio API para Sons

**Data:** 2026-05-22  
**Contexto:** Usuário quer sons polidos sem poluição sonora  
**Decisão:** Web Audio API sintetizada (oscillators) — zero arquivos de áudio  
**Motivo:** Sem downloads, sem CORS, funciona offline, altamente configurável, som "premium" moderno  
**Trade-off:** Sons sintéticos (não samples reais), mas adequados para o estilo do produto  
**Implementação:** `AudioManager` singleton em `src/lib/audioManager.js`

---

## D010 — Login Opcional (Guest Mode)

**Data:** 2026-05-22  
**Contexto:** Usuário não deve ser forçado a criar conta para jogar  
**Decisão:** App 100% funcional sem login; login adiciona cloud sync mas não é obrigatório  
**Motivo:** Reduz fricção de onboarding, preserva uso offline, respeita o usuário  
**Como incentiva:** Badge "Jogar sem conta" muted + explicação de benefícios

---

## D011 — Export via Browser Blob API

**Data:** 2026-05-22  
**Contexto:** Usuário quer exportar dados (JSON/CSV)  
**Decisão:** Download direto via `URL.createObjectURL(new Blob(...))` — sem servidor  
**Motivo:** Zero dependências, funciona offline, instantâneo  
**Implementação:** `downloadFile()` helper em StatsPage.jsx

---

## D012 — Remover React.StrictMode

**Data:** 2026-05-22  
**Contexto:** StrictMode monta/desmonta componentes em dev — interfere com Framer Motion AnimatePresence  
**Decisão:** Remover StrictMode de main.jsx  
**Motivo:** React 18 StrictMode simula unmount/remount, o AnimatePresence trata como exit → stuck at opacity 0  
**Trade-off:** Perde detecção de side effects acidentais em dev; risco mínimo para este projeto  
**Revisitar quando:** Framer Motion lançar fix oficial para React 18 StrictMode

---

## D013 — Vercel para Deploy

**Data:** 2026-05-22  
**Contexto:** App React/Vite precisa de hosting estático com suporte a env vars e CI/CD  
**Decisão:** Vercel via CLI (`vercel --prod`)  
**Motivo:** Zero config para Vite, env vars por interface, HTTPS automático, CDN global, free tier generoso  
**Variáveis configuradas:** `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`  
**URL produção:** https://tabuada-rush-rho.vercel.app

---

## D007 — Dados da Batalha 2P não persistidos

**Data:** 2026-05-22  
**Contexto:** Modo 2 jogadores local  
**Decisão:** Estado apenas em memória React, sem salvar no localStorage  
**Motivo:** Sessão informal, não faz sentido registrar como "partida" normal  
**Revisitar quando:** Quisermos histórico de batalhas ou ELO rating

---

## D008 — Desbloqueio progressivo de modos (UNLOCK_RULES)

**Data:** 2026-06-08 · sessao-032
**Contexto:** Até a v3.8.0 todos os modos eram acessíveis desde a primeira partida.
Davi pediu uma jornada de descoberta: começar só com Zen e ir destravando os demais conforme progresso real.
**Decisão:** Mapa central `UNLOCK_RULES` em `utils/index.js` com regras por modo.
Tipos suportados: `level`, `totalGames`, `totalCorrect`, `totalWrong`, `bestDayStreak`, `certificates`.
Função `getModeUnlock(modeId, data) → { unlocked, reason, current, target }`.
Aplicada na `ModesPage.jsx` (UI) e em `App.jsx::handleStart` (bloqueio defensivo).
**Motivo:**
- Cria sensação de progresso e descoberta (cada modo virando "recompensa")
- Evita sobrecarregar usuário novo com muitas opções de uma vez
- Vai ao encontro da filosofia da 3.0 ("domínio real" > "tempo jogado")
**Trade-off:** Usuários novos veem só Zen no início — risco de pensar que o app é raso. Mitigado pelo texto claro de unlock ("Nível 2: Aprendiz") que mostra o caminho.
**Compatibilidade:** Regras consultam apenas campos já existentes em `data` — usuários antigos automaticamente têm tudo desbloqueado.
**Revisitar quando:** Métricas mostrarem alta taxa de abandono no início (Zen-only).
Aí relaxar regras ou aumentar o XP do Zen.

---

## D009 — Zen quietamente dá XP

**Data:** 2026-06-08 · sessao-032
**Contexto:** Com o desbloqueio progressivo, Rush exige Nível 2. Para chegar lá, o usuário precisa de uma fonte de XP — só Zen está disponível no início.
Antes: `MODES.zen.xpMultiplier = 0` (Zen não dava XP). Conflito.
**Decisão:**
- Zen passa a dar XP discretamente: `xpMultiplier: 0` → `0.10` (mais baixo que qualquer outro modo)
- A UI continua **sem mencionar XP** no Zen: badge mudou de "Sem XP" para "Pratique 🌿"; descrição "Treino livre, sem pressão"; in-game "Sem pressão 🌿"
- O usuário descobre o XP **somente** ao terminar e ver a stat "XP Ganho" na ResultsPage
**Motivo:** Davi pediu explicitamente para o usuário não saber upfront que Zen dá XP ("não fala 'pratique 10 partidas Zen pra ganhar XP', só fala 'pratique'"). Cria momento de surpresa positiva.
**Trade-off:** Quebra a promessa anterior do "Sem XP" (mas isso era uma decisão antiga que não fazia mais sentido com o desbloqueio progressivo).
**Revisitar quando:** Sentirmos que o ritmo de XP em Zen está rápido ou lento demais para a primeira hora de jogo.

---

## D010 — Modo Difícil adaptativo (pool derivado de tableStats)

**Data:** 2026-07-02 · sessao-033
**Contexto:** Até a v3.9 o Modo Difícil tinha pool fixo 7/8/9 (as "mais difíceis" na média histórica). Davi pediu para trocar por adaptativo — que treine as tabuadas que ELE erra mais.
**Decisão:** `getHardTabuadaPool(tableStats)` calcula score de dificuldade individual:
- 60% peso na taxa de erro do jogador naquela tabuada
- 40% peso no tempo médio de resposta
- Requer >=3 amostras por tabuada; fallback para 7/8/9 quando dados insuficientes
Retorna as 3 tabuadas com maior score. `getHardQuestion(tableStats)` amostra desse pool.
**Motivo:**
- Cada jogador treina o que precisa (personalização real)
- Coerente com filosofia da 3.0 (domínio real, dados-first)
- Fallback preserva experiência de usuário novo
**Trade-off:**
- Recorde do Difícil perde valor comparativo entre jogadores (pools diferentes)
- Aceito: Difícil não tem leaderboard; valor é individual
**Revisitar quando:** Quisermos comparação de Difícil entre jogadores — aí volta a ser fixo ou tem 2 sub-modos (fixo/adaptativo).

---

## D014 — Reversão da 4.0: remoção de Soma/Subtração/Divisão

**Data:** 2026-07-06 · sessao-042
**Contexto:** A 4.0 (Fases 1-6, sessões 035-040) expandiu o jogo de "só multiplicação" pra 4 operações fundamentais, com seletor de operação, Mapa de Domínio/Certificados/QI cobrindo as 4. Davi trouxe uma reflexão: o propósito ORIGINAL do Tabuada Rush é decorar a TABUADA — ele criou o jogo porque escrever a tabuada toda à mão pra treinar era cansativo, e ele mesmo ainda não decorou. A 4.0 trocou esse objetivo específico e mensurável por algo vago ("ser bom em matemática"), e o próprio código já estava forçando abstrações (`cellFact`, `isValid`) pra encaixar divisão/subtração numa estrutura pensada pra multiplicação — sinal de que a direção não era essa.
**Decisão:** Remover por completo `add`/`sub`/`div` do registro `OPERATIONS`, o seletor de operação, as abas de operação (Mapa de Domínio/Certificados), o radar cross-operação e o certificado "Matemática Fundamental Completa" (só faziam sentido com 4 operações). O Tabuada Rush volta a ser exclusivamente sobre multiplicação.
**O que foi MANTIDO** (não é reversão total da 4.0 — só da amplitude de operações):
- Curva de esquecimento (`predictRecallProbability`/`getFactsAtRisk`, Fase 4) — roda em cima de `factStats.mult`
- Motor preditivo no Modo Revisão (componente de "staleness" na fórmula de dificuldade, Fase 4)
- Banner "Fatos a Vencer" + lembrete local (Fase 4)
- Viés adaptativo por fatos fracos em Rush/Sobrevivência/Velocidade/Zen + toggle "Foco em Fraquezas" (Fase 5)
**Motivo:** Alinhar o produto de volta ao propósito original e pessoal do criador — decorar a tabuada — em vez de virar um "jogo de matemática genérico". A amplitude de conteúdo (4 operações) e a profundidade de inteligência adaptativa eram os dois pilares da 4.0; só o segundo sobreviveu.
**Trade-off:** Todo o trabalho de Fases 1, 2, 3 e partes da 6 (código de `add`/`sub`/`div`, `cellFact`, seletor de operação, radar, certificado supremo) foi descartado — ainda existe no histórico do Git caso um dia vire um projeto separado ("jogo de matemática completo"), mas não faz mais parte do Tabuada Rush.
**Revisitar quando:** Davi quiser construir esse "jogo de matemática completo" — deve nascer como projeto NOVO, não como expansão do Tabuada Rush (decisão explícita de Davi, pra não repetir a diluição de foco).

---

## D015 — Paleta própria ("Caderno Quadriculado") em vez de copiar o Duolingo

**Data:** 2026-08-09 · sessao-043
**Contexto:** A sessão começou com Davi pedindo pra copiar o estilo visual do Duolingo (paleta, botões "chunky", tipografia) pra resolver a poluição visual do app. Isso foi implementado (tokens `feather`/`macaw`/`bee` no Tailwind, botões com sombra sólida e `active:translate-y`). No meio da sessão, ao revisar o resultado, Davi decidiu que só copiar cor de outro app não era a direção certa — queria algo com identidade própria, com tema "matemática" em vez de tema "Duolingo".
**Decisão:** Criar paleta original "Caderno Quadriculado": papel/creme (`#FBF7EC`) como fundo, azul-índigo (`#3B4FCC`, token `ink`) como cor primária, vermelho-caneta (`#D64545`, `pen`) pra erro, verde-caneta (`#2F9E44`, `check`) pra acerto, grafite (`#3A3A3A`) no lugar de preto puro. Aplicada nos tokens base e no Menu; resto do app fica pra migrar na próxima sessão.
**Motivo:** Identidade visual própria gera mais valor de marca que copiar um app de referência, mesmo que a técnica de construção (formas simples, sombra em pílula, ritmo de tamanhos — do "shape language" do Duolingo) continue sendo uma boa prática a seguir pros mascotes.
**Trade-off:** Os tokens da paleta Duolingo continuam definidos no Tailwind (não remover ainda) — várias telas (Modos/Recompensas/Estatísticas/Loja) ainda dependem deles até a migração completa. Duas paletas coexistindo é uma inconsistência visual temporária, não permanente.
**Revisitar quando:** A migração completa pra "Caderno Quadriculado" terminar — aí sim remover os tokens Duolingo do `tailwind.config.js`.

---

## D016 — Consolidação de modos: 10 → 3, Rush absorve Sobrevivência/Velocidade/Diário

**Data:** 2026-08-09 · sessao-043
**Contexto:** O app acumulou 10 modos de jogo ao longo das versões anteriores (Rush, Sobrevivência, Velocidade, Desafio Diário, Zen, Revisão, Difícil, Recorde Pessoal, Desafio Semanal, Combinado, Inverso). Davi achou o leque grande demais e pediu pra encurtar de verdade — não só reorganizar a UI, cortar os modos mesmo.
**Decisão:** Ficam só 3 modos. Rush vira uma fusão mecânica do que eram Rush + Sobrevivência + Velocidade + Diário: timer que começa em 30s e cresce +3s por acerto, 3 vidas, termina com 3 erros OU tempo zerado. Zen e Revisão continuam como eram. Os outros 7 modos (Sobrevivência, Velocidade, Diário, Difícil, Recorde Pessoal, Semanal, Combinado, Inverso) foram DELETADOS do código (constants, GamePage, ModesPage, App.jsx) — não só escondidos da UI.
**Motivo:** Muita opção de modo dilui o produto e sobrecarrega quem tá começando. Um modo principal bem feito (com progressão real dentro dele — o banco de tempo cresce com performance) vale mais que dez modos rasos. A fusão foi tecnicamente barata porque o reducer do GamePage já suportava timer+lives simultâneos.
**Trade-off:** Perde-se a variedade de "sabores" de partida (não tem mais opção sem tempo com vidas ilimitadas, por exemplo — isso agora é só o Zen, que não pontua). Recordes antigos desses modos (`data.records.survival` etc.) ficam órfãos no localStorage — inofensivos, não foram limpos.
**Revisitar quando:** Se o jogo precisar de mais variedade de partida no futuro, considerar adicionar de volta como VARIANTES do Rush (ex. um toggle de dificuldade), não como modos novos separados — pra não repetir a fragmentação.

---

## D017 — Reversão de D008: todos os modos liberados desde o início

**Data:** 2026-08-09 · sessao-043
**Contexto:** D008 (sessao-032) introduziu desbloqueio progressivo de modos por nível/desempenho, pra criar sensação de descoberta. Com o app reduzido a só 3 modos (D016), travar Rush/Revisão atrás de requisito de nível deixava as primeiras sessões de jogo chatas — usuário via só Zen disponível.
**Decisão:** `UNLOCK_RULES` simplificado pra liberar Zen, Rush e Revisão desde o primeiro acesso (`{ zen: null, rush: null, review: null }`).
**Motivo:** Com só 3 modos, o "leque pra descobrir" que justificava D008 não existe mais — trancar 2 dos 3 modos únicos do jogo é fricção pura, sem ganho de progressão percebida.
**Trade-off:** Nenhum "momento de desbloqueio" como recompensa de progresso — mitigado porque a progressão relevante agora está DENTRO do Rush (o banco de tempo cresce com performance), não em desbloquear modo novo.
**Revisitar quando:** Se novos modos forem adicionados no futuro (ver D016), reavaliar se desbloqueio progressivo faz sentido pra eles especificamente.

---

## D018 — Mascotes: fábula da Lebre e a Tartaruga em vez de vilão criado / Modo História pausado

**Data:** 2026-08-09 · sessao-043
**Contexto:** A sessão passou por duas direções de mascote antes de chegar na final. Primeiro, um vilão original ("O Resto", tema de resto de divisão, visual humanoide de pedra rachada) foi desenhado em detalhe (nome, origem, visual, prompt de imagem) — Davi achou o resultado gerado "adulto demais" (estilo dark fantasy) pra um app infantil, e decidiu que queria mascote de verdade (tipo a coruja do Duolingo — um animal/símbolo que já carrega significado), não personagem inventado do zero. Em paralelo, Davi também queria um "Modo História" com narrativa infinita gerada por IA, dificuldade expandindo com o domínio do jogador.
**Decisão:** Mascotes viraram Tuca (tartaruga sábia, Zen/Revisão) e Vupt (lebre apressada, Rush), baseados na fábula de Esopo — domínio público, sem risco de direito autoral, e a moral da história (pressa sem cuidado perde pra constância) já embute a psicologia do jogo sem precisar inventar backstory. O Modo História foi **pausado** — não tem código implementado, fica só como ideia registrada caso volte à mesa.
**Motivo:** Fábula conhecida = zero explicação necessária (toda criança já ouve essa história), zero risco de direito autoral (ao contrário de usar fotos de personagens famosos, que foi pedido e recusado nesta mesma sessão), e a mecânica do Rush (banco de tempo que cresce com acerto, não só velocidade) já é literalmente "devagar e sempre vence a pressa" — o mascote reforça uma mecânica que já existia, não o contrário.
**Trade-off:** Menos ambicioso que um Modo História completo — abre mão do "mundo maior" por enquanto em troca de algo que dava pra entregar de verdade nesta sessão (arte real, animação real, integração real).
**Revisitar quando:** Se o Modo História voltar à mesa, ele pode nascer DENTRO do universo Tuca/Vupt já estabelecido (não precisa reinventar personagens) — só precisa da decisão de conteúdo pré-escrito vs. geração ao vivo (ver notas da sessão 043 sobre custo de IA em tempo real).

---

## D019 — Arte de mascote via geração de IA + pipeline próprio de remoção de fundo

**Data:** 2026-08-09 · sessao-043
**Contexto:** Precisávamos de arte animada pros mascotes (Tuca/Vupt) sem orçamento pra ferramenta paga. Testamos, nesta ordem: Higgsfield (precisa de plano pago), Rive (travou no login/verificação de e-mail), DragonBones (travou também), Canva (tenho conector, mas só anima a imagem inteira — mesmo problema visual que motivou a reclamação original do Davi), SVG desenhado à mão por mim via código (qualidade muito abaixo da arte gerada por IA, descartado após 2 tentativas).
**Decisão:** Davi gera as imagens estáticas no ChatGPT e as animações no Pika (login com Google, evita a verificação de e-mail que travava em outras ferramentas), me manda os vídeos prontos (fundo branco + marca d'água), e eu processo com um pipeline Python que criei nesta sessão (`opencv-python-headless` + `Pillow`): remove fundo via flood-fill com `FLOODFILL_FIXED_RANGE` (crítico — sem essa flag o preenchimento vaza por bordas anti-aliased e come partes claras do personagem), limpa ruído residual (`MORPH_OPEN` + maior componente conectado), recorta pelo bounding-box união de todos os frames, exporta como WebP animado com transparência.
**Motivo:** É o único caminho que não depende de conta paga nem de ferramenta que trava no login, dá controle técnico total (consigo ajustar o algoritmo quando o resultado sai errado, como aconteceu com a barba do Tuca na primeira tentativa), e o resultado final tem a qualidade da arte gerada por IA (que o Davi aprova) em vez da qualidade limitada do meu desenho manual em SVG.
**Trade-off:** Processo manual em 2 pontas (Davi gera e sobe os arquivos, eu processo) — mais lento que uma ferramenta integrada de ponta a ponta. Arquivos webp animados pesam mais que SVG (~150-700KB cada) — aceitável porque cada asset só carrega quando a tela de jogo monta, não no carregamento inicial do app.
**Revisitar quando:** Se o Davi conseguir acesso a alguma ferramenta de rigging de verdade (Rive/DragonBones funcionando), animações com movimento articulado de partes (não só a imagem inteira se deformando) ficam mais fáceis de produzir — mas o pipeline de remoção de fundo continua útil de qualquer forma.

---

## D020 — Reset 6.0: tokens semânticos via CSS var em vez de classes `dark:` espalhadas

**Data:** 2026-08-16 · sessao-044 (Bloco 1 do reset 6.0)
**Contexto:** Davi pediu reset visual completo (ver `sessions/planejamento-6.0.md`) insatisfeito com a 5.0 — inclusive um bug confirmado por print (caixa "Partidas/Melhor Seq./Acertos" ilegível no escuro: fundo `bg-paper` e botões com `bg-ink`/`bg-white` não tinham override pra tema escuro, só as classes `gray-*`/`white` do Tailwind puro tinham). Tema escuro também virou o **padrão** do app (era claro).
**Decisão:** Em vez de continuar empilhando regras `html.dark .classe-especifica { ... !important }` em `globals.css` (o padrão da 5.0, que deixa buraco toda vez que uma cor nova aparece), criei um segundo sistema: tokens semânticos (`background/surface/surface-2/border/fg/fg-muted/accent/accent-dark/streak/coin/danger/success`) que apontam pra CSS vars redefinidas dentro de `html.dark`. Componentes usando `bg-surface`/`text-fg`/etc funcionam nos dois temas automaticamente, sem precisar de `dark:` em cada página. Os tokens legados (`paper/ink/pen/check/graphite`, Duolingo `feather/macaw/...`) continuam existindo pras telas ainda não migradas (Modos/Estatísticas/Loja — blocos futuros).
**Pegadinha técnica registrada:** pra `bg-accent/15` (opacidade) funcionar, a CSS var precisa guardar "R G B" sem `rgb()` (ex. `--accent: 88 204 2;`) e o Tailwind referenciar como `rgb(var(--accent) / <alpha-value>)` — `var(--accent)` puro (só o hex) quebra silenciosamente qualquer classe com modificador de opacidade (`bg-accent/15` vira `rgba(0,0,0,0)`, transparente, sem erro no console). Também: **mudar `tailwind.config.js` exige reiniciar o servidor dev** (`preview_stop`+`preview_start`) — só editar o arquivo não bastou, o Vite/PostCSS deste projeto não pegou o novo mapeamento de cor via HMR sozinho.
**Motivo:** O bug do rodapé branco-sobre-branco é uma classe inteira de bug (qualquer token custom sem override explícito fica invisível no escuro) — tokens via CSS var elimina essa classe de bug de vez em vez de corrigir caso a caso.
**Trade-off:** App roda temporariamente com DOIS sistemas de cor em paralelo (novo nos componentes tocados no Bloco 1: Sidebar/Header/Button/Card/Badge/MenuPage; legado no resto) até os blocos 2-7 migrarem o restante. Enquanto isso durar, dev precisa saber qual página usa qual sistema antes de estilizar algo novo nela.
**Revisitar quando:** Ao migrar cada tela nos próximos blocos, aposentar os tokens legados que ela usava (se nenhuma outra tela mais depender deles).

---

## D021 — Vidas diárias como camada NOVA por cima do sistema de vidas por partida (não substituição)

**Data:** 2026-08-17 · sessao-045 (Bloco 2 do reset 6.0)
**Contexto:** O áudio do Davi pedia "5 vidas/erros por dia" estilo Duolingo — um pote
único, global, que reseta por dia e bloqueia QUALQUER modo quando zera. O jogo já
tinha, porém, um sistema de vidas **por partida** bem desenvolvido (`cfg.lives` no
Rush — 3 vidas, acaba a partida — com um prompt de continuar já existente: usar Vida
Extra do estoque, comprar 1 vida por 80 moedas, ou encerrar). Esses dois sistemas
descrevem coisas diferentes (uma partida específica vs. o dia inteiro).
**Decisão:** Implementei o pote diário (`data.livesData`, `getLivesInfo` em `utils`)
como uma camada **adicional**, independente do sistema por partida — não removi nem
alterei `cfg.lives`/o prompt de continuar do `GamePage`. Todo erro real (não protegido
por Escudo) em qualquer modo desconta 1 do pote diário via `onWrongAnswer` (prop nova
no `GamePage`, chamada em paralelo ao `dispatch({type:'WRONG'})`); o pote só GATEIA
o início de uma partida NOVA (`App.jsx handleStart`), nunca interrompe uma partida em
andamento — pode ficar negativo-efetivo (clampado em 0) no meio do jogo sem travar
nada, só bloqueia a próxima tentativa de começar.
**Motivo:** Rasgar o sistema por partida pra encaixar só o pote diário seria uma
regressão de UX sem necessidade — o prompt de continuar (usar estoque/comprar 80/
desistir) já funciona bem e resolve um problema diferente (terminar ESTA partida) do
que o pote diário resolve (limite de prática por DIA). Rodar os dois em paralelo é
mais simples de implementar e não contradiz nada do que o Davi pediu — ele descreveu
o pote diário, não pediu pra remover o outro.
**Trade-off:** Existem agora DOIS conceitos de "vida" no app ao mesmo tempo (partida
vs. dia) — risco de confundir se não ficar bem explicado na UI. Mitigado por
serem visualmente distintos: vidas de partida aparecem só dentro do `GamePage` (❤️❤️❤️
no topo da partida), vida diária só no `Header` global e no modal de bloqueio.
**Reposição:** enche o pote inteiro de volta a `DAILY_LIVES_MAX` (5) por
`LIFE_REFILL_PRICE` (150 moedas) fixo, não vida-por-vida — replica o padrão do print
de referência do Duolingo que o Davi mandou ("Recuperar vidas · 350" cristais por um
refill completo, não por vida individual).
**Revisitar quando:** Se o Davi achar os dois conceitos confusos na prática, dá pra
unificar depois — ex. o prompt de "perdeu a vida de partida" já checar/gastar do
mesmo pote diário em vez de ter preço próprio (80) separado do refill (150).

---

## D022 — Faixas de tabuada vão até fator 200 de verdade (não só rótulo), mesmo colidindo com "só multiplicação tradicional"

**Data:** 2026-08-17 · sessao-046 (Bloco 3 do reset 6.0)
**Contexto:** O projeto tem um princípio já registrado ([[project_scope_multiplication_only]]
na memória — a 4.0 foi revertida por diluir o propósito original: decorar A TABUADA,
não "ser bom em matemática" em geral). O motor de perguntas sempre limitou o fator
`a` a 2-12 (a tabuada escolar tradicional). O áudio do Davi pedia progressão em
faixas até "2×10, 10×20, 20×30... até 200" — alertei explicitamente que, se o fator
`a` da pergunta for até 200 de verdade, isso deixa de ser "tabuada" no sentido
tradicional (ninguém decora "a tabuada do 127") e vira prática de cálculo mental —
uma expansão de escopo parecida (embora não idêntica) com o que motivou a reversão
da 4.0.
**Decisão:** Davi confirmou, ciente da tensão, que quer o fator indo até 200 de
verdade — perguntas tipo "127 × 6" aparecem nas faixas mais altas. Implementado:
`LEVELS` (20 faixas, `constants/index.js`) ganhou `rangeMin`/`rangeMax` por faixa;
`getRandomQuestion`/`generateQuestion` (`utils/index.js`) aceitam `tierRange` e
sorteiam o fator `a` dentro da faixa atual do jogador em vez do pool fixo antigo;
`GamePage.jsx` computa a faixa via `getTierRange(data)` e passa pro motor. O fator
`b` continua 1-10 (mantém a estrutura de "tabuada" — cada faixa é tipo uma tabela de
multiplicação, só que o multiplicando sobe).
**Motivo:** Confirmação explícita e informada do Davi — ele entendeu o trade-off
(perguntei diretamente, com 3 opções incluindo "não expande, faixa vira só
maestria") e escolheu a expansão de propósito. Diferente da 4.0 (que eu não avisei
a tempo, só percebi depois — ver sessao-042), aqui o aviso veio ANTES da
implementação.
**Trade-off:** O jogo passa a ensinar cálculo mental com números grandes, não só
tabuada tradicional — LINHA que o próprio Davi tinha puxado antes ("o jogo é sobre
decorar a tabuada, ponto"). Big number × small number (ex. 190×7) é mais fácil que
number × number ambos grandes, mas ainda é bem mais difícil que tabuada clássica —
pode frustrar jogadores que não chegaram lá organicamente. Sem soma/subtração/
divisão ainda (isso continua fora, essa parte da D014/4.0 não mudou).
**Calibração pendente:** `FIRST_TIER_XP`/`TIER_XP_DECAY`/`TIER_XP_FLOOR`
(`constants/index.js`) são ESTIMATIVAS sem dados reais de jogadores — recalibrar
quando houver telemetria de uso de verdade.
**Revisitar quando:** Se jogadores reais acharem as faixas altas (100+) frustrantes
ou sem sentido pedagógico, considerar a opção que não foi escolhida agora (faixas
= maestria/velocidade dentro de 2-12, não fator novo).

---

## D023 — Ligas: sistema antigo de Ranking de QI mantido em paralelo (não deletado), promoção/rebaixamento só checada em fim de partida

**Data:** 2026-08-17 · sessao-047 (Bloco 4 do reset 6.0)
**Contexto:** O áudio pedia pra trocar o Ranking de QI (posição estática numa lista
fixa de 52 personagens, calculada a partir de um score "QI") por Ligas de verdade —
10 ligas × 10 personagens, competição por XP, promoção/rebaixamento. `getQiInfo`/
`computeQI`/`CHARACTERS`/`TIERS` (o sistema antigo) são usados em 7 arquivos
diferentes (App.jsx, MenuPage, PerfilPage, SettingsPage, ResultsPage, CatalogPage,
RankingPage).
**Decisão 1 (escopo):** Não deletei o sistema antigo — criei um sistema NOVO e
paralelo (`constants/leagues.js`, `utils/leagues.js`) e só troquei o CONTEÚDO da
página "Ligas" (`RankingPage.jsx`, já roteada assim desde o Bloco 1) e o toast de
promoção em `App.jsx` (que antes comparava QI, agora compara liga). As outras 5 telas
que ainda mostram um emoji+nome "QI" (MenuPage hero card, PerfilPage, Settings,
Results, Catalog) continuam com o sistema antigo por enquanto — são exatamente as
telas que os Blocos 6 (Perfil) e 7 (Estatísticas) vão reorganizar de qualquer jeito,
então trocar a fonte de dados duas vezes seria retrabalho. Ver planejamento-6.0.md
seção 9 (Perfil) pra saber onde isso é resolvido de vez.
**Trade-off:** Por um tempo o app mostra DOIS sistemas de "personagem" diferentes em
telas diferentes (Menu ainda diz "QI 143 · Harry Potter", Ligas diz "Liga Safira,
posição 3/11") — pode confundir se o Davi abrir as duas telas em sequência. Aceitável
como estado intermediário de um rollout em blocos (mesmo padrão do Bloco 1 com a
paleta), mas registrar aqui pra não parecer esquecimento.
**Decisão 2 (bug encontrado e corrigido durante a implementação):** a promoção/
rebaixamento foi inicialmente checada tanto no fim de partida quanto na abertura do
app (mesmo padrão do `applyStreakDecay`). Isso causava um "ping-pong": jogador é
promovido, entra na liga nova com 0 XP (correto — ninguém chega com XP emprestado),
fecha o app, abre de novo sem ter jogado nada — 0 XP ainda é o último lugar da liga
nova, e ele já cai rebaixado de volta, sem nunca ter tido a chance de jogar ali.
Removida a checagem no load — agora só roda em `App.jsx handleGameEnd`, depois de
uma partida de verdade. Consequência: "não praticar" não derruba de liga sozinho só
por passar o tempo (diferente do que o áudio sugeria) — só na próxima vez que o
jogador jogar, se a posição ainda estiver ruim. Troca aceitável: apostar numa
mecânica mais simples e sem bug em vez de replicar a descrição literal com um bug
de ping-pong.
**Calibração (estimativa, mesmo espírito da D022):** XP simulado dos personagens usa
janela rolante de 14 dias (não vitalício, senão personagem de liga alta vira
matematicamente imbatível só por "existir há mais tempo") com base 60 XP/dia
(mesma estimativa do Bloco 3) × multiplicador de liga (0.7 Bronze → 1.6 Diamante) ×
"atividade" do personagem (0.4–0.9, sorteada por nome) ± 30% de chacoalho diário
(pra ranking oscilar dia a dia, como descrito no áudio). Números de promoção/
rebaixamento por liga (5/0 no Bronze até 0/3 no Diamante) também são estimativa —
os exemplos do Davi no áudio (7/5/4) eram pensados pra um pool maior (~30/liga) e
foram recalculados pra caber nos 10+1 competidores reais.
**Revisitar quando:** Se o Davi achar a falta de rebaixamento-por-inatividade
estranha, dá pra reintroduzir com um grace period (ex.: só rebaixa depois de X dias
na liga OU depois de já ter jogado pelo menos 1 partida nela) em vez do check puro
no load que causava o bug.

---

## D024 — Metas dos desafios mensais revisadas pra baixo ao adicionar risco

**Data:** 2026-08-17 · sessao-048 (Bloco 5 do reset 6.0)
**Contexto:** O pool de missões mensais já existia (`MONTHLY_MISSION_POOL`) desde
antes do reset 6.0, mas sem risco nenhum — era só uma missão longa igual a
diária/semanal, sempre auto-ativa, sem "aceitar", sem penalidade. Metas eram
pensadas nesse contexto sem risco: "250 partidas este mês" (~8/dia, todo santo dia
do mês, sem falhar), "8000 acertos este mês" (~270/dia). O Bloco 5 adicionou a
mecânica de aceitar + penalidade por não cumprir (confirmada com o Davi desde a
pergunta inicial da sessão de planejamento, ver seção "Perguntas" do
planejamento-6.0.md).
**Decisão:** Manter essas metas antigas equivaleria a garantir que quase todo
jogador que aceitasse um desafio tomasse a penalidade — não é "desafio", é "imposto".
Reescrevi o pool inteiro (`MONTHLY_CHALLENGE_POOL`) com metas mais alcançáveis (ex.:
40-80 partidas/mês em vez de 120-250; 1.500-3.000 acertos em vez de 4.000-8.000) e
adicionei `penalty` por item, ~20% do `reward` — mesma proporção do exemplo que o
próprio Davi deu no áudio (ganha 500 / perde 100).
**Motivo:** Uma mecânica de risco só faz sentido como "desafio" (você pode ganhar OU
perder, dependendo do seu esforço) se as duas coisas forem plausíveis. Com metas
sobre-humanas, só existe um resultado — vira imposto disfarçado de desafio, o
oposto do espírito "motivador" que o Davi descreveu.
**Efeito colateral:** também removi o tipo de missão `'daily'` (`dm_daily`/
`mm_daily_22` — "Complete o Desafio Diário X vezes") porque checava
`result.mode === 'daily'`, e o modo "Desafio Diário" não existe mais desde a fusão
de modos da 5.0 (virou parte do Rush) — essas missões eram matematicamente
impossíveis de completar, mesma classe de bug já registrada em `BUGS.md`/
`MEMORY_CORE.md` pras conquistas `survival_30`/`speed_20`. Corrigido de graça por
estar mexendo no arquivo de qualquer forma.
**Revisitar quando:** Depois de alguns meses reais de uso, se as metas novas
provarem fáceis/difíceis demais na prática — são estimativa, não medição (mesmo
espírito da D022/D023).

---

## D025 — Sistema antigo de QI removido por completo (não só trocado de tela)

**Data:** 2026-08-17 · sessao-049 (Bloco 6 do reset 6.0)
**Contexto:** D023 (Bloco 4) tinha deixado `getQiInfo`/`computeQI`/`CHARACTERS`/
`TIERS` (o sistema antigo de "QI" — score numérico + lista fixa de 52
personagens) em paralelo ao sistema novo de Ligas, alimentando 5 telas que
ainda não tinham passado pelo reset: Menu, Perfil (stub do Bloco 1), Settings,
Results, Catalog. O Bloco 6 (Perfil completo) era o bloco marcado pra resolver
isso de vez.
**Decisão:** Migrei as 5 telas pra usar Faixa de tabuada (Bloco 3,
`LEVELS`/`getLevelIdx`) + Liga (Bloco 4, `getLeagueStandings`) em vez de QI, e
DELETEI o código antigo por completo — `computeQI`/`getQiInfo` saíram de
`utils/index.js`, `src/constants/characters.js` (104→52 personagens ao longo
das versões, agora zero) foi apagado do repositório. Também removi a opção
"+5 de QI" do modal de recompensa de ofensiva (`App.jsx` RewardModal) — não
fazia mais sentido dar bônus pra um sistema que não existe mais — e o campo
`data.qiBonus` que só essa opção alimentava.
**Motivo:** Manter código morto "só por precaução" contradiz o próprio padrão
que o projeto já segue (ver histórico: 4.0 revertida com remoção completa, não
comentada; Sobrevivência/Velocidade/Diário deletados na 5.0, não escondidos).
Como as 5 telas foram as únicas consumidoras (confirmado por grep antes de
apagar), não sobrou nada dependendo do sistema antigo.
**Trade-off:** Nenhum jogador vai mais ver "QI 143" em lugar nenhum do app —
é a intenção do reset (Davi: "não vai ser por quanto de QI você tem comparando
a um personagem, mas você competindo com esse personagem"), não uma perda.
**Verificado:** as 3 sub-telas que migraram pro Perfil (Conquistas/Recordes/
Catálogo) e as 5 telas que trocaram QI por Liga/Faixa foram testadas uma a uma
neste ambiente (sem erro de console, conteúdo renderizado correto) — ver
`sessao-049.md`.

---

## D026 — Guia lateral de Estatísticas implementado sem a referência visual do Davi

**Data:** 2026-08-17 · sessao-050 (Bloco 7 do reset 6.0 — ÚLTIMO BLOCO)
**Contexto:** No áudio original, Davi pediu um "guia lateral tipo sumário" pra
navegação da tela de Estatísticas, citando o Notion como referência, e disse
explicitamente que ia mandar um print de exemplo. Esse print nunca chegou ao
longo das 7 sessões do reset (044-050).
**Decisão:** Implementei mesmo assim, em vez de esperar — um TOC fixo na
margem direita (`fixed right-4 top-1/2`), só em telas largas (`lg+`), com
pontinhos que mostram o rótulo da seção no hover e fazem `scrollIntoView`
suave ao clicar. Interpretação própria do "painel de tópicos do Notion", sem
a referência exata do Davi.
**Motivo:** Bloquear o Bloco 7 (último do reset) esperando um print que já
não veio em 7 sessões pareceu pior do que entregar uma primeira versão
razoável e ajustar depois se o Davi mandar a referência e ela for diferente.
É reversível/ajustável — não é uma decisão estrutural de dado (como D021-D025),
é só a apresentação de uma navegação.
**Revisitar quando:** Se o Davi mandar o print que tinha em mente, comparar e
ajustar o componente (`TableOfContents` em `StatsPage.jsx`) pra bater com a
referência real.

---

## D027 — Rebaixamento por inatividade reintroduzido, com grace period (resolve o débito do Bloco 4)

**Data:** 2026-08-17 · sessao-051 (limpeza de pendências pós-reset)
**Contexto:** Davi pediu pra fechar, nesta mesma conversa, os débitos que eu tinha
sinalizado no fechamento do reset 6.0. Um deles era D023: rebaixamento de liga por
inatividade tinha sido REMOVIDO do load do app porque causava um bug de
"ping-pong" (jogador recém-promovido com 0 XP era rebaixado de volta na hora,
sem nunca ter jogado na liga nova).
**Decisão:** Reintroduzido com uma correção real, não um band-aid: `leagueEnteredAt`
(novo campo) registra a DATA em que o jogador entrou na liga atual. A nova
`checkInactivityRelegation` (`utils/leagues.js`), chamada no load do app
(`AppContext.jsx`), só rebaixa se já se passaram `INACTIVITY_GRACE_DAYS` (3) desde
essa data — um jogador recém-promovido tem uma janela real pra jogar antes de
qualquer avaliação de rebaixamento por inatividade. Nunca promove (só a checagem
pós-partida promove, ver D023).
**Motivo:** O bug original acontecia porque a checagem rodava incondicionalmente a
cada load, sem noção de "quanto tempo faz que ele chegou aqui". O grace period é a
correção estrutural — resolve a causa raiz em vez de só remover a feature.
**Verificado:** testado neste ambiente forçando `leagueEnteredAt` 5 dias atrás (com
o jogador na zona de rebaixamento) → rebaixou corretamente no load; testado de novo
com `leagueEnteredAt` = hoje → NÃO rebaixou (grace period segurou), confirmando que
o bug de ping-pong não voltou.

---

## D028 — Pódios nas ligas implementado (resolve o débito do Bloco 6)

**Data:** 2026-08-17 · sessao-051
**Contexto:** O áudio original do Perfil mencionava "pódios conquistados nas
ligas" como parte do resumo de estatísticas — não tinha sido implementado no
Bloco 6 (não existia histórico de pódio nenhum, só a posição atual).
**Decisão:** "Pódio" = ficar entre os 3 primeiros (de 11 competidores) da liga
atual. Contado 1x por PERMANÊNCIA na liga (não 1x por partida — `leaguePodiumClaimed`
reseta toda vez que a liga muda, promoção ou rebaixamento), incrementando
`data.leaguePodiums`. Novo card no Perfil ("Pódios nas ligas") e toast ao
conquistar um (dentro de `applyLeaguePromotion`, App.jsx `handleGameEnd`).
**Motivo:** Contar por partida inflacionaria o número artificialmente (jogador
parado no top 3 ganharia +1 pódio a cada partida só por continuar lá); contar por
permanência reflete o que "pódio" realmente significa — uma conquista de posição,
não um evento repetido.
**Revisitar quando:** Se o conceito de "pódio" evoluir (ex.: só contar no fim de
uma temporada/ciclo, se ligas ganharem reset periódico no futuro) — hoje não há
ciclo de liga, só entrada/saída por promoção/rebaixamento.

---

## D029 — Referências a modos mortos removidas de HitsPage/ErrorsPage/AccuracyCatalogPage (resolve o débito do Bloco 7)

**Data:** 2026-08-17 · sessao-051
**Contexto:** `HitsPage.jsx`/`ErrorsPage.jsx` (filtro "Modo") e o cabeçalho de
`AccuracyCatalogPage.jsx` ainda citavam Sobrevivência/Velocidade/Diário — modos
removidos por completo desde a fusão de modos da 5.0. Registrado como débito
conhecido no fechamento do Bloco 7 por serem arquivos grandes fora do escopo de
"reorganização" que o Davi pediu naquele bloco.
**Decisão:** `MODE_LABELS`/filtros trocados pra `rush`/`zen`/`review` nos dois
arquivos; a lógica especial "Todos exclui Sobrevivência" (não existe mais motivo
pra excluir nada) removida; o aviso "⚡ Sobrevivência aparece separadamente"
removido. Em `AccuracyCatalogPage.jsx`, a variável `nonSurvSessions` (um filtro
que virou identidade, já que não existem mais sessões de Sobrevivência) foi
substituída direto por `sessions` em todos os usos, e o subtítulo do cabeçalho
("Modos clássicos — Sobrevivência exibida separadamente") corrigido.
**Motivo:** Pedido explícito do Davi de fechar os débitos sinalizados nesta
mesma conversa — diferente do Bloco 7 (que tinha escopo definido como
"reorganização, não reescrita"), aqui a limpeza pontual desses textos/filtros
mortos é exatamente o que foi pedido, sem expandir pra reescrever os arquivos
inteiros.

---

## Nota sobre calibração de XP/Ligas (D022/D023) — NÃO é um débito fechável em código

**Data:** 2026-08-17
Diferente dos itens acima, a calibração de XP por faixa (D022: `FIRST_TIER_XP`,
`TIER_XP_DECAY`) e de personagens/zonas de promoção por liga (D023) não é algo
que se "termina" escrevendo código — são estimativas que só podem ser corrigidas
com dados reais de jogadores usando o app ao longo de semanas/meses (telemetria
que não existe ainda). Não fabriquei números "definitivos" fingindo ter dados que
não tenho — os valores atuais continuam sendo os mesmos, documentados como
estimativa desde que foram escritos. Fica registrado aqui pra não parecer
esquecimento: é um debito que só o TEMPO (+ uso real) resolve, não uma tarefa de
código pendente.

---

## D030 — Recalibração completa das Ligas (personagens/promoção decrescentes, ciclo de 6 dias, pódio Diamante, conquistas por liga)

**Data:** 2026-08-17 · sessao-052 (recalibração pós-limpeza de débitos)
**Contexto:** Depois da limpeza de débitos (sessao-051), o Davi respondeu com
especificações detalhadas e concretas pras 3 perguntas que eu tinha deixado em
aberto desde o Bloco 4 (D023): quanto XP por faixa de tabuada, quantos
personagens por liga, e o tamanho das zonas de promoção. Em vez de números
ilustrativos meus, agora são regras reais dadas pelo Davi.

**Decisões, uma por uma:**

1. **XP por faixa de tabuada (Bloco 3, D022):** Davi deu 2 âncoras — 1ª faixa
   (2×10) leva 8-10 meses (usei 9), e completar a ÚLTIMA faixa (chegar na
   20ª) leva "um pouco mais de 28 meses" jogando todo dia com boa
   quantidade de XP. Recalculei a curva geométrica (`FIRST_TIER_XP=27000`,
   `TIER_XP_DECAY=0.68`, `TIER_XP_FLOOR=300` em `constants/index.js`) pra
   bater as duas âncoras ao mesmo tempo (~28,55 meses no total, a
   100 XP/dia) — método exatamente como o Davi descreveu (XP/dia × meses,
   resolver a curva).

2. **Personagens por liga:** Davi confirmou — Bronze (a menor divisão) tem
   20, decrescendo até ~4 na Diamante ("quanto mais você subir, mais difícil
   fica ficar entre o pódio"). `constants/leagues.js` recalibrado: 20, 18,
   16, 14, 12, 10, 8, 7, 5, 4 (Bronze→Diamante), 114 personagens no total
   (14 novos adicionados nas ligas baixas, ligas altas enxugadas — não
   deletadas do histórico, só reduzidas). **Einstein migrou de Pérola pra
   Diamante** — foi o exemplo literal que o Davi deu de personagem "que vive
   dentro do jogo, joga toda hora, quase impossível de destronar".

3. **Zonas de promoção decrescentes:** âncoras dadas pelo Davi — Bronze top
   8, Safira top 4. Recalibrado com a mesma lógica decrescente: 8, 7, 6, 4,
   3, 3, 2, 2, 1, 0 (Bronze→Diamante). `leagueMultiplier` (o quanto os
   personagens de cada liga são mais fortes) também foi esticado de
   0.7-1.6× pra 0.7-2.2× — sem isso, o pote menor de personagens no topo não
   ficaria de fato "muito mais difícil".

4. **Todas as ligas competem o tempo todo, não só a do jogador:**
   `getLeagueStandings(data, leagueIdOverride)` já suportava consultar
   qualquer liga (não só a atual) — mantido e documentado explicitamente.
   Ver "outras divisões" como tela nova NÃO foi implementado — o próprio
   Davi disse "pode ser que a gente consiga ver isso, não sei, podemos
   conversar" — deixado como decisão em aberto, não uma pendência.

5. **Nunca cai mais de 1 liga por vez:** já era assim desde o Bloco 4
   (`idx - 1`, nunca pula liga) — confirmado, sem mudança de código.

6. **Conquistas por liga alcançada:** `ACHIEVEMENTS` (`constants/index.js`)
   ganhou 9 entradas novas (`league_prata` até `league_diamante` — Bronze
   fica de fora, ninguém é "promovido" pra ela). Concedida no momento exato
   da promoção (`App.jsx` passa `{...newData, ...leaguePromo.data}` pro
   `checkNewAchievements`, não o `newData` cru — senão a conquista só
   apareceria na partida seguinte). Fica permanente mesmo se o jogador cair
   depois (mesmo espírito de recordes).

7. **Bônus de XP no pódio da Diamante:** `data.diamondPodiumActive`
   (`true` quando o jogador está entre os 3 primeiros da Diamante,
   reavaliado a cada ciclo) dá **+25% de XP** em toda partida enquanto durar
   (`App.jsx handleGameEnd`, mesmo padrão do XP Dobrado já existente).

8. **Modelo de tempo — a mudança mais estrutural:** Davi pediu XP dos
   personagens atualizando a cada 12h e promoção/rebaixamento avaliados a
   cada 6 dias (não mais a cada partida). Implementado com um "ciclo global"
   (`getCurrentCycle()`, época fixa 2026-01-01, 6 dias por ciclo) — a mesma
   ideia de número de ciclo pra todo mundo, então todas as ligas "rodam" o
   mesmo relógio o tempo todo. `applyLeaguePromotion` só reavalia
   promoção/rebaixamento/pódio se o ciclo mudou desde a última checagem
   (`leagueLastCycleChecked`); fora isso é um no-op instantâneo — seguro
   chamar em toda partida E no load do app sem risco de re-avaliar de mais.
   XP dos personagens (`getCharacterXp`) trocou de "seed por dia" pra "seed
   por meio-dia" (`halfDaySlot`), dando a granularidade de 12h pedida sem
   precisar guardar nada a mais no storage.

**Efeito colateral bom:** o modelo de ciclo TAMBÉM resolve o bug de
ping-pong (D023) de um jeito mais robusto que o grace period manual que eu
tinha posto na sessão 051 (D027) — como só existe UMA avaliação por ciclo de
6 dias, fisicamente não tem como promover e reavaliar de novo na mesma
passada. `checkInactivityRelegation`/grace-period manual (D027) foi
REMOVIDO — virou redundante, `applyLeaguePromotion` sozinho já cobre load E
fim de partida com segurança.

**Verificado:** testado neste ambiente — liga Bronze mostra 21 competidores
(20 personagens + jogador) e "zona de promoção (top 8)"; liga Diamante
mostra 5 competidores (4 personagens + jogador, incluindo Einstein) e "zona
de rebaixamento (últimos 1)", sem zona de promoção (correto, é o topo); XP
dos personagens da Diamante (1894-2674) muito maior que os do Bronze
(746-1006), confirmando o multiplicador de liga esticado; tela de
Conquistas carrega as 9 novas entradas de liga sem erro.

**Revisitar quando:** mesma ressalva de sempre — calibração de XP/liga é
estimativa até existir uso real. "Ver outras divisões" fica pra uma conversa
futura se o Davi quiser.

---

## D031 — "Ver outras ligas" vira escada com bloqueio por progresso

**Data:** 2026-08-17 · sessao-053
**Contexto:** D030 deixou "ver outras divisões" como conversa em aberto, não
decisão fechada. Nesta sessão o Davi trouxe a resposta: mostrei 3 mockups de
UI (lista abaixo do ranking, trilha vertical/escada, seletor de chips no
topo) num artifact interativo com a paleta real do app — ele escolheu a
escada, com uma regra de acesso que eu não tinha proposto nos mockups:
**progresso bloqueia visualização**. Só dá pra ver o roster/classificação de
uma liga que o jogador JÁ alcançou algum dia (mesmo se caiu dela depois);
ligas acima da mais alta já alcançada ficam bloqueadas (sem nome, sem
roster, só um cadeado).

**Decisão:**
1. **Novo campo `leagueHighestId`** (`storage.js` DEFAULTS + `enterLeague`
   em `utils/leagues.js`) — a liga mais alta já alcançada. Só SOBE, nunca
   desce com rebaixamento (`Math.max` entre o índice guardado e o novo).
   Saves antigos (sem o campo, ou com ele desatualizado) se auto-curam no
   próximo load: `applyLeaguePromotion` agora recalcula
   `leagueHighestId = max(liga atual, valor guardado)` incondicionalmente,
   ANTES do gate de ciclo de 6 dias — senão um jogador com save antigo
   veria a própria liga atual aparecer bloqueada na escada.
2. **`App.jsx` handleGameEnd** precisou incluir `leagueHighestId` na lista
   explícita de campos persistidos do resultado de `applyLeaguePromotion`
   (o código já filtrava campo a campo, não fazia spread do objeto inteiro)
   — sem isso a promoção calculava certo mas nunca gravava.
3. **`RankingPage.jsx` reescrita** — escada vertical (Bronze embaixo,
   Diamante no topo), degraus desbloqueados (`idx <= highestIdx`) abrem uma
   folha (bottom sheet) com roster + zona de promoção/rebaixamento via
   `getLeagueStandings(data, league.id)` (motor já suportava override desde
   o Bloco 4 — D030 item 4). Liga atual mostra a linha "Você" + posição
   real (comportamento já embutido em `getLeagueStandings`: só inclui o
   jogador quando `leagueId === data.leagueId`); ligas já passadas mas não
   atuais mostram só o roster, sem "Você" — mesma regra que o Davi definiu
   pras respostas do Q2 na conversa anterior sobre os mockups. Degraus
   bloqueados não abrem nada (disabled, sem clique), sem revelar nome nem
   personagens.

**Verificado:** `npm run build` limpo. Navegação real (clique + animação de
página) não pôde ser confirmada neste ambiente — Browser pane roda com
`document.hidden === true` (aba sem compositing real), então a transição
`AnimatePresence mode="wait"` do `App.jsx` trava indefinidamente no
`requestAnimationFrame` e a página nova nunca monta (mesma limitação já
registrada em BUGS.md, não é bug do app). Confirmei a lógica lendo o código
(auto-cura testada mentalmente pros 3 casos: save novo, save antigo sem
campo, jogador rebaixado depois de promovido) e o roteamento em si (o
clique no menu lateral mudou a classe ativa pra "Ligas" corretamente).
**Pedir ao Davi pra confirmar visualmente** — abrir/fechar a folha, e testar
que uma liga acima da mais alta alcançada fica realmente bloqueada.

**Revisitar quando:** se o Davi quiser, dá pra reaproveitar a mesma escada
como base pro "próprio mapa de progresso" no Perfil (ainda não existe).

---

## D032 — Header vira barra maior com painéis no hover (estilo Duolingo)

**Data:** 2026-08-17 · sessao-054
**Contexto:** Davi mandou 5 screenshots de referência (o stat bar do
Duolingo com bandeira/ofensiva/gemas/vidas, e os 4 painéis que abrem ao
passar o mouse em cada um) e pediu pra recriar o padrão — mas com os
sistemas REAIS do Tabuada Rush, não inventar mecânica nova só pra imitar a
imagem.

**Decisão:**
1. **Barra maior:** `Header.jsx` foi de `py-2.5`/`text-sm` pra `py-3.5` com
   pills `text-base` — 70px de altura (era ~48px).
2. **Faixa de tabuada junta ao grupo:** antes ficava sozinha na ponta
   esquerda (`justify-between`); agora é a 1ª pill de um grupo único
   centralizado — o equivalente direto de onde fica a bandeira do idioma no
   Duolingo (identidade central de progresso, não "país").
3. **Moedas trocou de ícone:** o ícone `Coins` da lucide (dois círculos
   sobrepostos, lê fácil como "gema") virou o emoji 🪙 — que já era usado em
   outro lugar do app (`NoLivesModal`, "Você tem 🪙 X") pra representar
   moeda, então isso também resolve uma pequena inconsistência visual que já
   existia entre telas.
4. **4 painéis no hover** (mouse + toque via clique, já que Header aparece
   em qualquer largura de tela, não só desktop) — cada um com um botão de
   ação real, não decorativo:
   - **Faixa:** badge + progresso (`getXpProgress`, já existia) até a
     próxima faixa → "Ver perfil" (`screen: 'perfil'`, mostra faixa+liga
     juntas).
   - **Ofensiva:** contador + semana atual (derivada de `data.sessions`,
     mesmo princípio do `StreakHeatmap` mas só 7 dias) + recorde + PRÓXIMA
     CONQUISTA DE OFENSIVA real (`ACHIEVEMENTS.filter(categoria==='Ofensiva')`,
     acha a primeira não batida — nada hardcoded, lê do array existente) →
     "Ver perfil". Deliberadamente NÃO tem "ofensivas dos amigos" nem
     "sociedade da chama acesa" do Duolingo — o jogo não tem sistema social,
     inventar isso seria adicionar mecânica desconectada do aprendizado
     (guarda de escopo já registrada, ver memória do projeto). A conquista
     "Chama Acesa" (10 dias, já existe em `ACHIEVEMENTS`) cobre a mesma
     função de "meta social a caminho" sem precisar de feature nova.
   - **Moedas:** saldo + "Ir pra loja" (`screen: 'shop'`) — direto como o
     Davi pediu.
   - **Vidas:** corações preenchidos (`getLivesInfo`), tempo até o pote
     encher de novo (calculado até meia-noite local — a mecânica real É um
     pote diário, não regeneração por vida como no Duolingo, então o texto
     reflete isso) e um botão "Recuperar vidas" funcional (reaproveita a
     mesma lógica de `App.jsx handleBuyLifeRefill`, reimplementada local
     porque o handler original depende de `pendingNoLivesMode` pra retomar
     o modo bloqueado — aqui não tem modo pendente). Desliguei
     deliberadamente "vidas ilimitadas — testar grátis" do mockup: é
     assinatura premium, o jogo não tem sistema de assinatura, não é algo
     pra inventar de lado.
5. **Só um painel aberto por vez:** estado único `openId` no `Header`,
   compartilhado entre as 4 pills — abrir uma fecha a anterior.

**Verificado:** `npm run build` limpo. Testado neste ambiente via inspeção
de DOM/JS (a mesma limitação de compositing do D031 impede confirmar a
ANIMAÇÃO de hover, mas o CONTEÚDO e a INTERAÇÃO foram confirmados de
verdade, não só lidos no código): os 4 painéis abrem com o texto certo
(faixa mostra XP faltante real, ofensiva mostra "Faltam 5 dias pra 'Faísca'
🔥" corretamente derivado de `ACHIEVEMENTS`), só um fica aberto por vez, e o
fluxo de comprar reposição de vidas foi testado de ponta a ponta:
localStorage forçado pra `coins:200, vidas:2/5` → clique em "Recuperar
vidas" → confirmado no storage depois `coins:50, vidas:5/5` (descontou
exatamente `LIFE_REFILL_PRICE`=150 e encheu o pote) — e o botão fica
`disabled` sozinho tanto com pote cheio quanto sem moeda suficiente.

**Revisitar quando:** confirmação visual do Davi de como o hover/animação
fica na prática (mesma ressalva do D031) — layout/posicionamento dos
painéis pode precisar ajuste fino olhando de verdade.

---

## D033 — Ligas vira carrossel horizontal; Header vai pro canto superior direito; ícones ficam pendentes de arquivo

**Data:** 2026-08-17 · sessao-055
**Contexto:** Davi mandou (por áudio + 3 imagens de referência) uma
correção em cima do que foi entregue nas sessões 053/054: a escada
VERTICAL de Ligas devia ser um carrossel HORIZONTAL (mais perto do
Duolingo de verdade — fileira de divisões no topo, roster embaixo), e o
grupo de indicadores do Header (faixa/ofensiva/moedas/vidas) devia sair do
centro da barra e ir pro canto superior direito da tela — mesma posição da
bandeira/fogo/gema/coração na referência do Duolingo. Ele também reforçou
que esse grupo tem que aparecer em TODAS as telas (inclusive Perfil, que
ele hesitou mas confirmou), sumindo só durante uma partida — isso já era
assim, não mudou.

**Decisão:**
1. **`RankingPage.jsx` reescrita de novo** — fileira horizontal rolável
   (Bronze à esquerda → Diamante à direita, `overflow-x-auto` +
   `snap-x`), badge da liga selecionada com anel de destaque, bloqueadas
   mostram cadeado (mesma regra de acesso do D031, só mudou a
   apresentação). Tocar numa liga desbloqueada troca o card + roster
   exibidos EMBAIXO da fileira, sem modal (era bottom sheet na v anterior)
   — mais perto de como o Duolingo mostra o placar direto abaixo da
   fileira de divisões.
2. **`Header.jsx` reposicionado** — trocou `justify-center` (grupo
   centralizado dentro de uma coluna `max-w-lg`) por `justify-end` sem
   limite de largura, encostando o grupo de pills na borda direita da
   barra. Os painéis de hover também precisaram mudar de ancoragem
   (`left-1/2 -translate-x-1/2` → `right-0`) — senão o painel do item mais
   à direita (Vidas) vazaria pra fora da tela.
3. **Troca de ícone por imagem (foguinho/moedinha/coração) — BLOQUEADA,
   não é decisão, é limitação de ferramenta:** as 3 imagens que o Davi
   anexou na mensagem existem só dentro do chat — minhas ferramentas de
   arquivo não têm acesso ao binário de uma imagem colada/anexada na
   conversa, só consigo VER ela (não salvar). Pedido ao Davi pra colocar os
   3 arquivos PNG dentro do projeto (`src/assets/icons/`) — assim que
   estiverem lá, reaproveito em TODOS os lugares que hoje usam `Flame`/🔥,
   🪙, `Heart`/❤️ (Header, `NoLivesModal`, `PerfilPage`, `ResultsPage`,
   `ShopPage` etc.) numa passada só.

**Verificado:** `npm run build` limpo. Header: confirmado via DOM/JS que o
grupo de pills encosta mesmo na borda direita (`right: 1260px` de
`1276px` de largura útil, a diferença bate com o `padding` da barra).
**Ligas: só revisão de código, não testado interativamente** — a mesma
limitação de compositing do D031/D032 bloqueia a navegação
`AnimatePresence mode="wait"` neste ambiente, e desta vez nem a tentativa
de forçar via patch de `requestAnimationFrame` funcionou (framer-motion já
tinha capturado a referência original antes do patch rodar).

**Revisitar quando:** o Davi mandar os 3 arquivos de ícone — aí sim vira
uma sessão de "trocar ícone em todo canto do app", não uma decisão em
aberto.

---

## D034 — Ligas copiada literal do Duolingo; e a causa raiz de "não consigo ver rodando"

**Data:** 2026-08-17 · sessao-056
**Contexto:** O Davi viu o carrossel entregue na sessão 055 e reprovou:
"ficou horrível, as letras estavam quase em cima do ícone, cortado". E
cobrou (com razão) uma explicação real pro fato de eu entregar tela atrás
de tela sem nunca ter visto nenhuma rodando.

### Parte 1 — a causa raiz do "não consigo ver rodando"

**Não é limitação de ser IA, é uma janela fechada.** O Browser pane do
ambiente de desenvolvimento estava COLAPSADO na tela do Davi. Navegador
nenhum renderiza (compõe frames de) uma aba que não está visível — é
economia de bateria, comportamento padrão do Chrome. Consequências
encadeadas, todas explicadas por essa única causa:
- `document.hidden === true` / `visibilityState: 'hidden'` (medido)
- `screenshot` estoura timeout: literalmente "the Browser pane is not
  displayed, so the page is not compositing frames"
- `requestAnimationFrame` fica congelado → o `AnimatePresence mode="wait"`
  do `App.jsx` nunca completa a animação de saída → a tela nova NUNCA
  monta. É por isso que clicar em "Ligas" no menu não levava a lugar
  nenhum: não era clique perdido, era a transição travada.
- `tabs_select` (trazer a aba pra frente) NÃO resolve — testado; a aba já
  era a ativa, o problema é o pane em si estar oculto.

**Correção do lado do Davi:** abrir/expandir o Browser pane no Claude Code.
Com ele aberto, screenshot e animação funcionam normalmente.

**Correção do meu lado (pra não depender disso), 2 ferramentas novas:**
1. **Atalho `?screen=<tela>` só em DEV** (`App.jsx`) — pula a navegação e
   monta qualquer tela direto, contornando o `AnimatePresence` travado.
   Gated em `import.meta.env.DEV` e bloqueia `game` (que precisa de
   `activeMode`); confirmado que o Vite remove o ramo no build de produção
   (0 ocorrências de `screen=` no bundle).
2. **Asserções de geometria via JS** em vez de "revisei o código": medir
   `getBoundingClientRect` pra detectar exatamente as classes de bug que o
   Davi reportou — sobreposição entre elementos vizinhos, texto truncado
   (`scrollWidth > clientWidth`), colisão nome×valor nas linhas de lista,
   scroll horizontal indevido no corpo. Isso pega "letra em cima do ícone"
   sem precisar enxergar a tela.

### Parte 2 — layout novo (cópia literal da referência)

Davi foi explícito: "não precisa ficar inventando nada, é mais simples do
que você espera". A ordem da tela agora é exatamente a da screenshot:
1. Fileira de escudos das divisões — **só escudos, sem rótulo de texto
   embaixo de cada um.** Era essa a origem do "letra em cima do ícone": eu
   tinha posto nome + selo "você" em caixas de 64px de largura. O nome
   aparece uma vez só, grande, no item 2.
2. `Divisão <Nome>` centralizado e grande
3. `Os N primeiros avançam pra próxima divisão.` (= zona de promoção,
   `promotionCount`)
4. `N dias` — prazo do ciclo, via `getCycleDaysRemaining()` novo em
   `utils/leagues.js` (mesmo relógio global de 6 dias do
   `getCurrentCycle`, nunca mostra "0 dias")
5. Classificação (medalha 🥇🥈🥉 nos 3 primeiros)

**REMOVIDO a pedido dele:** o card de "Liga X de 10 / sua posição Nº de M".

**Verificado de verdade desta vez** (com as 2 ferramentas acima, não é
mais "revisei o código"): 10 escudos, 0 sobreposições, selecionado 80×80 vs
56×56 dos outros; 21 linhas de classificação com 0 colisões nome×XP e 0
nomes truncados; sem scroll horizontal no corpo; título não cortado. Com um
save de teste (`leagueId: 'prata'`, `leagueHighestId: 'ouro'`) confirmei a
regra de acesso: Bronze/Prata/Ouro clicáveis, as 7 acima `disabled`; abre
selecionado na liga atual (Prata); clicar em Ouro troca pra "Divisão Ouro"
com o `promotionCount` dela (6) e SEM a linha "Você"; clicar num escudo
bloqueado não faz nada.

**Ainda não visto com os próprios olhos:** cor, proporção e "beleza" do
resultado — geometria eu meço, gosto não. Enquanto o pane estiver fechado,
isso continua dependendo do Davi olhar.

---

## D035 — Ligas em 2 colunas, lista rolando sozinha; e folha de ícones é viável

**Data:** 2026-08-17 · sessao-057

### 1. Uma imagem só de ícones BASTA (respondendo pergunta do Davi)

Ele perguntou se precisa exportar um arquivo por ícone ou se uma folha
única serve. **Serve uma só** — testado, não chutado: Pillow 12.3.0 está
disponível (Python 3.14.3), e escrevi um auto-split que acha as "ilhas" de
pixels não-transparentes por flood fill e recorta cada uma. Prova feita com
uma folha sintética de 6 ícones: detectou os 6 e recortou todos com
bounding box correto.

**A condição que importa não é quantidade, é ser ARQUIVO:** eu não consigo
extrair o binário de imagem colada/anexada no chat — só enxergá-la. Uma
folha salva em disco dentro do projeto eu recorto sozinho; dez imagens
coladas na conversa continuam inúteis. Ideal: fundo transparente e um
respiro entre os ícones (encostados viram uma ilha só). Sem transparência
dá pra fazer por grade fixa, só preciso saber linhas×colunas.

### 2. Layout de 2 colunas + a lista é que rola

Davi: "não vai ser a página que vai descer, e sim os personagens... a
divisão bronze sempre vai aparecer". E que estava "muito centralizado,
com cara de IA".

- `App.jsx`: container passa a `max-w-5xl` **só** quando `screen === 'ranking'`
  (as outras telas seguem em `max-w-lg` — mudança contida).
- Coluna esquerda: escudos + bloco da divisão **fixos**, classificação em
  caixa própria com `overflow-y-auto`.
- Coluna direita (`lg:w-80`): painel de contexto, preenchendo o vazio.

**Detalhe não óbvio (altura travada só no desktop):** travar a altura em
`calc(100dvh-70px-3rem)` é o que faz a lista rolar em vez da página. Mas
com as colunas empilhadas no celular o conteúdo passa de 1500px — a altura
fixa + `overflow-hidden` cortava metade dos personagens **sem como
alcançá-los**. Peguei isso medindo (`clientHeight` 694 vs `scrollHeight`
1504) e resolvi prefixando tudo com `lg:`: desktop trava e a lista rola,
celular flui e a página rola.

**Efeito colateral bom:** o scroll horizontal de 4px que eu tinha detectado
sumiu junto. Causa era encadeada — página rolava → aparecia barra de 4px →
`clientWidth` caía 4px → layout de 1280 sobrava 4px. Sem scroll vertical,
sem barra, sem sobra.

### 3. Painel lateral — conteúdo é PROPOSTA, não decisão fechada

Davi ainda não sabe o que quer ali ("a gente pode ir pensando"), mas
mencionou "o personagem que está em cima de mim". Implementei nessa linha,
como ponto de partida pra ele reagir:
- **"Sua corrida"** — quem está logo acima com o XP que falta pra passar, e
  quem está logo abaixo com a vantagem atual. Transforma "estou em 8º" em
  "faltam 20 XP", que é acionável e liga direto a jogar mais.
- **"Zona de promoção"** — se está dentro, ou quantas posições/XP faltam.
- Vendo uma liga que não é a sua: mostra o líder dela.

Evitei de propósito qualquer coisa social (o Duolingo preenche esse espaço
com amigos/status) — o jogo não tem sistema social, e inventar um seria
mecânica desconectada do aprendizado.

**Verificado** (medido, não revisado): desktop 1280×720 — página não rola,
0 de sobra horizontal, lista rola sozinha (300px+), título fora da caixa
que rola, colunas lado a lado (lista 272-920, painel 944-1264). 23 linhas
reais com 0 colisões nome×XP, 0 quase-colando (<6px), 0 nomes truncados.
Mobile 375×812 — 0 sobra horizontal, escudos rolam contidos, 23
personagens todos alcançáveis. Contas do painel conferidas na mão: jogador
com 640 XP em 8º → "faltam 20 XP" (Minions 660) e "17 XP de vantagem"
(Homer 623). Build limpo.

**Nota de método:** meu primeiro detector de colisão deu 1 falso positivo
(pegou o card inteiro como se fosse linha, comparando o título com um XP
de outra linha). Refinei pra exigir que nome e XP sejam filhos DIRETOS da
mesma linha — aí deu 0. Vale lembrar disso: asserção de geometria mal
escrita mente igual "revisei o código".

---

## 🏁 RESET 6.0 — COMPLETO (sessões 044-050, 2026-08-16 a 2026-08-17)

Os 7 blocos planejados em `sessions/planejamento-6.0.md` foram todos entregues:
(1) Base visual, (2) Vidas diárias, (3) Progressão de tabuada, (4) Ligas, (5)
Missões, (6) Perfil completo, (7) Estatísticas. Decisões arquiteturais D020-D026
documentam o raciocínio de cada um. Próximos passos ficam a critério do Davi —
não há mais bloco planejado em aberto deste reset.
