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

**Resposta do Davi (mesma sessão): quer "Sua corrida" E "Ficha do
personagem" juntos.** Implementado assim: clicar numa linha da
classificação abre a ficha no TOPO do painel (emoji grande, nome, posição,
XP e a `desc` que cada um dos 114 personagens já tem em
`constants/leagues.js` — conteúdo que existia e nunca era mostrado), com
"Sua corrida" seguindo logo abaixo. Detalhes: a linha do próprio jogador
não é clicável (não tem ficha); trocar de divisão fecha a ficha sozinha (o
personagem aberto é de outra liga); e quando nenhuma está aberta, uma
dica explica que dá pra tocar.

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

## D036 — Correções visuais das Ligas + emoji que não existe na fonte do Windows

**Data:** 2026-08-17 · sessao-058
**Contexto:** Davi mandou screenshots do estado atual ao lado da referência
do Duolingo, pedindo pra arrumar a caixa de promoção ("está cortada").
Primeira vez que consegui de fato COMPARAR o resultado com o alvo — as
imagens no chat resolveram o que o Browser pane fechado impedia (D034).

**1. Caixa "Zona de promoção" — texto rachando.** Era uma frase corrida
com números embutidos, e quebrava no meio de "(693 XP)" — número numa
linha, unidade na outra. Refeita como blocos separados (posição / XP que
falta em destaque / posições que faltam), com `whitespace-nowrap` em todo
par número+unidade pra nunca mais rachar no meio.

**2. Escudo Bronze cortado pela metade — a causa era `justify-center`.**
A fileira de 10 divisões transbordava a coluna em 22px. Com
`justify-center` num container que transborda, o navegador corta pela
ESQUERDA (medido: primeiro escudo em x=250 com a coluna começando em 272).
Duas correções: escudos menores (44px / 64px o selecionado) pra caberem no
desktop, e o padrão `overflow-x-auto` no pai + `w-max mx-auto` no filho —
centraliza quando cabe, rola a partir da esquerda quando não cabe, nunca
corta. **Pegadinha no meio do caminho:** ao simplesmente remover o
`overflow-x-auto` os escudos passaram a empurrar a página no celular (79px
de scroll horizontal) — foi o `w-max mx-auto` que resolveu os dois casos.

**3. Emoji que não renderiza no Windows 10 (defeito que EU introduzi).**
Nas imagens do Davi vários ícones apareciam como caixa vazia `□`. Causa:
emoji do Unicode 13.0+ (2020+) não existem na fonte do Windows 10 dele.
O pior é que a moeda 🪙 (U+1FA99) fui eu quem introduziu na v6.0.4
"corrigindo" o ícone — troquei um ícone que funcionava por um emoji que
não renderiza na máquina dele, em 30 lugares. Varri o projeto por
codepoint e troquei 33 ocorrências por equivalentes universais (Unicode
6.0): moeda 🪙→💰, Mr. Bean 🫖→☕, Pinóquio 🪵→👃 (combina melhor com a
piada dele, "o nariz denuncia"), Burro do Shrek 🫏→🐴. Mantidos 🦥/🦦
(Unicode 12.0, renderizam).

**4. `leading-none` cortando glifo de emoji.** `line-height: 1` é menor
que o glifo de emoji (~1.2), então o desenho estourava a caixa. Removido
dos spans de emoji no Header, PerfilPage e StatsPage. **Ressalva honesta:**
sobra ~2px em alguns glifos mesmo assim, mas verifiquei que nenhum
ancestral tem `overflow: hidden` — o glifo pinta normal, não é defeito
visível. Meu detector era rigoroso demais pra emoji.

**5. Número mágico da altura do header eliminado.** A RankingPage travava
a altura com `calc(100dvh-70px-3rem)`; ao corrigir o `leading-none` o
header cresceu pra 74px e a conta saiu de sincronia sozinha (a página
voltou a rolar). Agora é `--header-h` em `globals.css`, usada pelo
`Header.jsx` e pela `RankingPage` — fonte única, não tem como divergir de
novo.

**Verificado (medido, desktop 1280×720 e mobile 375×812):** escudos
centralizados com folga idêntica dos dois lados (58px/58px), 0 cortados,
0 sobra horizontal em ambos, página não rola no desktop, lista rola
sozinha, 0 textos cortados, 22 personagens alcançáveis no celular,
variável `--header-h` batendo com a altura real do header (74=74).

---

## D037 — Ícones do Davi entram no jogo (pipeline de remoção de fundo + fatiamento)

**Data:** 2026-08-17 · sessao-059
**Contexto:** Davi salvou 14 PNGs em `~/Downloads` — o que destrava o
bloqueio registrado em D033 (imagem colada no chat eu vejo mas não consigo
extrair; arquivo em disco eu processo).

**O problema que os arquivos traziam:** **nenhum tinha transparência.** Eram
recortes de tela com o fundo chapado — e em tons DIFERENTES entre si
(`#131F24`, `#202F36`, `#050D0E`, e dois em branco puro). Colar direto ia
gerar retângulos visíveis em volta de cada ícone, e os dois brancos ficariam
como caixas brancas no tema escuro.

**Pipeline aplicado (Pillow + numpy, script na sessão):**
1. **Remoção de fundo por flood fill a partir das bordas**, não por "toda
   cor parecida com o fundo". Essa distinção importa: vários ícones têm
   miolo escuro parecido com o fundo (o escudo da Obsidiana é quase preto) —
   apagar por cor faria buraco no meio do desenho. Preenchendo só o que está
   conectado à moldura, o interior fica intacto.
2. **Recorte automático** na bounding box do conteúdo.
3. **Fatiamento da folha das 9 divisões** (1536×1024): grade fixa 3×3 saiu
   torta (larguras 282/441/221 — cortava escudo no meio), então troquei por
   detecção de ilhas conectadas → 9 escudos consistentes (~282×315) num grid
   limpo. Ordem da folha bate 1:1 com `LEAGUES` depois da Bronze.
4. **Redimensionamento** pra no máximo 192px (nenhum ícone aparece acima de
   ~80px na UI; 192 cobre tela 2×): **1269KB → 435KB**.

**Componente `GameIcon`:** os ícones têm proporções diferentes entre si (o
foguinho é alto e fino, a arena é larga). Caixa quadrada com
`object-contain` faz todos ocuparem o mesmo espaço visual sem distorcer —
é o que mantém as fileiras alinhadas.

**Onde entrou:** Header (ofensiva/moedas/vidas), Sidebar (arena/ligas/
missões/loja), RankingPage (10 escudos + divisão bloqueada + pódio),
Perfil, Loja, Missões, Jogo, Recompensas, Temporadas.

**Faixa de tabuada continua emoji** — pedido explícito do Davi.

**Limite honesto — 11 lugares ficaram com emoji 💰:** são strings JS puras
(`icon: '💰'` de toast, `desc:` de notificação). String não renderiza
componente; trocar exigiria mudar o modelo de dados dos toasts. Não estão
quebrados (💰 é Unicode 6.0, renderiza), só não usam a arte. Em
`constants/seasons.js` dava pra resolver limpo, então resolvi: as
recompensas ganharam um campo `art` e a SeasonsPage prefere a arte quando
existe.

**Verificado:** build limpo; 0 imagens quebradas em Arena/Ligas/Perfil/Loja/
Missões; mapeamento escudo→divisão conferido 1:1 nas 10; 0 sobra horizontal
em todas as telas. **Ressalva:** o console do preview acumula erros de
estados transitórios do HMR (de quando eu trocava imports); confirmei que o
app monta e renderiza depois deles — não são erros do estado final.

---

## D038 — Varredura completa dos ícones (o que a sessão 059 deixou passar)

**Data:** 2026-08-17 · sessao-060
**Contexto:** Davi aprovou os ícones da 059 mas apontou, um por um, os
lugares onde eu não tinha trocado. A regra que ele deu é mais forte do que
eu tinha aplicado: **"toda vez que mencionar a moedinha tem que ter o
ícone"** e **"todos, todos, quando estiver aparecendo ofensiva precisa
estar o ícone da ofensiva"**. Na 059 eu troquei onde era óbvio; ele quer a
regra valendo em todo lugar.

**Corrigido:**
| Onde | Estava | Agora |
|---|---|---|
| Loja — preço dos power-ups | só o número | ícone de moeda + número |
| Loja — "Como ganhar moedas" | texto puro | ícone por linha (moeda/ofensiva/missões) |
| Perfil — "XP total" | `Sparkles` (lucide) | `xp.png` |
| Catálogo — liga na descrição | emoji 🥉 | escudo da divisão |
| Catálogo — "XP Total" no resumo | sem ícone | `xp.png` |
| Catálogo — "Ofensiva" no resumo | emoji 🔥 | `ofensiva.png` |
| Catálogo — "Experiência (XP)" | `Sparkles` | `xp.png` |
| Catálogo — "Marcos de Progresso" | `Award` | `podio.png` |
| Catálogo — "Ofensiva recorde" | `Flame` | `ofensiva.png` |
| Catálogo — "Maior pontuação" | `Trophy` | `podio.png` |
| Menu, Estatísticas, Precisão, Heatmap | `Flame`/`Trophy` | arte correspondente |

**Item bloqueado na Loja:** Davi ofereceu fazer uma versão preta do ícone
pra quando não dá pra comprar. Não precisa — resolvi com
`grayscale opacity-50` no CSS. Mesma arte, sem arquivo novo pra manter.

**Decisão de escopo que vale registrar:** "Melhor Sequência" (acertos
consecutivos DENTRO de uma partida) recebeu o ícone de ofensiva, mesmo não
sendo a ofensiva diária. São conceitos diferentes; usei a mesma arte porque
a chama é o símbolo natural de "sequência" nos dois sentidos e misturar
lucide com arte na mesma grade fica pior. **Se o Davi discordar, é trocar
em 2 lugares** (`StatsPage`, `AccuracyCatalogPage`).

**Não trocados de propósito:** `Sparkles` em "Análise Inteligente"
(Menu/Stats), "Boa sessão!" (Flashcard) e "Reduzir animações"
(Configurações) — nada disso é XP, é só brilho decorativo. "Nível
alcançado" e "Total de acertos" seguem com lucide: não há arte pra eles.

**Bug que eu introduzi e peguei na verificação:** ao limpar imports órfãos
da lucide, meu script removeu `User` do `Sidebar.jsx` — mas lá o uso é
`icon: User` (propriedade de objeto), formato que o regex não reconhecia.
**O `npm run build` passou mesmo assim** (identificador indefinido só
quebra em tempo de execução), então build limpo não teria pego. Só apareceu
porque fui conferir arquivo por arquivo depois. Lição: script de limpeza de
import precisa cobrir uso como valor, não só `<Componente>`.

**Verificado:** Loja — 7 botões de preço com ícone, todos os bloqueados com
a moeda dessaturada; Perfil — "XP total" usando `xp.png`; Catálogo —
`liga-safira.png`/`xp.png`/`podio.png`/`ofensiva.png` presentes e **zero**
SVG de `flame`/`trophy`/`sparkles`/`award` sobrando; Estatísticas — "Maior
Pontuação"→pódio, "Melhor Sequência"→ofensiva. 0 imagens quebradas, 0 sobra
horizontal em todas as telas.

---

## D039 — Ofensiva acesa/congelada, calendário da semana e medalhas do pódio

**Data:** 2026-08-17 · sessao-061
**Contexto:** Davi mandou 3 artes novas: a tira do calendário (dia feito /
dia congelado / dia vazio), a chama congelada, e as medalhas de 1º/2º/3º.

**1. Processamento.** A tira do calendário veio como um painel inteiro
(360×106, com moldura laranja + fundo escuro + as 7 letras). Recortei a
área interna primeiro — flood fill direto da borda pararia na moldura — e
depois separei os 7 marcadores por ilha, classificando por cor média: 3
laranjas (feito), 2 azuis (congelado), 2 cinzas (vazio). Guardei um de
cada. As medalhas vieram numa tira vertical e saíram por ilha também.

**2. Estado congelado — reaproveitei mecânica que JÁ existia.** O jogo tem
"Seguro de Ofensiva" (`streakInsurance`): quando o jogador perde um dia, o
seguro preserva a ofensiva e marca `streakInsuredAt`, esperando ele jogar
em 24h. Isso é literalmente uma ofensiva congelada — não precisei inventar
estado novo. Regra final na barra superior:
- **congelada (azul):** `streak === 0` **ou** `streakInsuredAt` ativo
- **acesa (laranja):** ofensiva > 0 sem seguro pendente

Ícone e cor do número trocam juntos. Token `--frozen` novo
(`#38BEF0`, amostrado da própria arte). **Só na barra** — as outras menções
de ofensiva no app seguem com a chama acesa, como o Davi pediu.

**3. Calendário da semana.** Cada dia usa um dos 3 marcadores. O estado
"congelado" só aparece no dia em que o seguro foi de fato consumido
(`streakInsuredAt`) — é o único congelamento que dá pra afirmar com dado
real; não invento congelamento em dia que o jogador simplesmente não jogou.

**4. Medalhas:** 1º/2º/3º da classificação passam a usar a arte; da 4ª
posição em diante segue o número.

### BUG DE FUSO HORÁRIO ENCONTRADO (fora do pedido)

Ao testar o calendário, os dias marcados apareciam **deslocados em um dia**.
Causa: `toISOString()` converte pra UTC, e no Brasil (UTC-3) tudo que
acontece depois das 21h local cai no dia seguinte. Medido em tempo real:
às **22:05 local de 20/ago**, `new Date().toISOString()` já retornava
**21/ago**.

Corrigi **dentro do calendário** (passou a usar data local) — confirmado:
os dias injetados agora caem no dia certo, e "hoje" marca quinta-feira,
que é o dia real.

**O problema maior NÃO foi corrigido, de propósito:** `todayStr()` em
`utils/index.js` usa a mesma conversão UTC e é usada por **vidas diárias,
ofensiva, desafio diário e `lastPlayDate`**. Ou seja: todo dia entre 21h e
meia-noite o jogo inteiro "vira o dia" 3 horas antes pro Davi. Mexer nisso
altera semântica de mecânica (pode zerar ofensiva de alguém na transição),
então é decisão dele, em sessão própria — não algo pra eu trocar de lado
enquanto coloco ícone.

**Verificado:** os 3 cenários da barra testados forçando o save —
`streak 0` → `ofensiva-congelada.png` + `rgb(56,190,240)`; `streak 7` →
`ofensiva.png` + `rgb(255,150,0)`; `streak 7 + seguro` → congelada + texto
"Congelada pelo Seguro — jogue pra reacender". Calendário com os 3 estados
simultâneos e "hoje" no dia certo. Medalhas: `posicao-1/2/3.png` nos três
primeiros, número do 4º em diante. 0 imagens quebradas, 0 sobra horizontal,
0 textos cortados.

---

## D040 — Ícones dos power-ups + correção do fuso horário (o dia virava às 21h)

**Data:** 2026-08-17 · sessao-062

### Parte 1 — ícones dos power-ups

Folha 2×2 com foguete, escudo, floco de neve e cronômetro. **Fundo branco
(249,249,249) e o desenho contém branco (253-255)** — 6 unidades de
diferença. Isso quebrou as duas abordagens anteriores:
- **Flood fill com tolerância folgada (40):** vazou pra dentro e comeu o
  corpo branco do foguete. O desenho tem traços de contorno em
  cinza-quase-branco que *furam* a silhueta e deixam a mancha entrar.
- **Limiar simples com rampa de alpha:** deixou o branco *semitransparente*
  (alpha ~43%), e o fundo escuro do app vazava por baixo — aspecto de
  chuvisco.

**O que funcionou:** flood fill só de fora, tolerância apertada (8, contra
os 12 de diferença do branco do desenho), **alpha chapado 0/255**.

**Armadilha de diagnóstico que vale registrar:** por duas rodadas eu achei
que o corpo do foguete tinha sumido — mas era **branco sobre o fundo branco
do visualizador**. Só apareceu quando compus os PNGs sobre o `#171B24` real
do app. Verificar arte com transparência exige compor sobre o fundo de
destino, não olhar o arquivo solto.

**Mapeamento dos 7 power-ups:** Congelar Missão→floco, +60s→cronômetro,
Escudo→escudo, Largada Turbo→foguete; Vida Extra→`vidas` e XP
Dobrado→`xp` (o Davi indicou). **Decisão minha:** "Seguro de Ofensiva"
ficou com `ofensiva-congelada` — ele não disse, e havia conflito (Seguro e
Escudo usavam o mesmo 🛡️). A chama de gelo é semanticamente exata: o
Seguro literalmente congela a ofensiva (é o mesmo `streakInsuredAt` do
D039). `SHOP_ITEMS` ganhou o campo `art`; `emoji` fica de reserva pra item
novo sem ícone.

### Parte 2 — correção do fuso horário (a pedido do Davi)

Bug reportado em D039, agora corrigido. Era `toISOString()` (UTC) gerando
chave de dia: no Brasil (UTC-3) o jogo virava o dia **às 21h**.

**Alcance real, maior do que parecia:** 14 usos de `todayStr()`, uma
**segunda cópia** de `todayStr()` dentro de `utils/missions.js` (não
importava de utils), e ~10 conversões cruas espalhadas em App, Header,
StreakHeatmap, seasons, notify, ErrorsPage, HitsPage, StatsPage e analysis.

**Correção:** `localDateStr(date)` novo em `utils/index.js`, `todayStr()`
passa a delegar pra ele, e todas as chaves de dia migradas. Ficaram em UTC
só os **nomes de arquivo de exportação** (`tabuada-rush-2026-08-20.json`) —
não comparam com nada.

**`constants/seasons.js` tem uma cópia proposital do helper:** `constants/`
não pode importar de `utils/` porque `utils/index.js` já importa
`constants/` — daria ciclo.

**Risco de migração — tratado.** Saves gravados antes da correção têm
`lastPlayDate` em UTC. Quem jogou depois das 21h tem a data **no futuro**
em relação ao dia local, e `applyStreakDecay` leria isso como "não jogou
nem ontem nem hoje" e **zeraria a ofensiva**. Guard adicionado: `if (last >
today) return data` — ninguém joga no futuro, então data futura é o
artefato de UTC e vale como "jogou hoje".

**Verificado:** save legado com `lastPlayDate` no futuro → ofensiva de 12
dias **preservada** (antes zeraria). Quebra real (último jogo 5 dias atrás)
→ **zera corretamente**, mecânica intacta, e a barra vira congelada/azul
sozinha. Os 7 power-ups com o ícone certo, 0 imagens quebradas, 0 sobra
horizontal em Loja/Missões/Estatísticas/Perfil. Build limpo.

---

## D041 — Cards da Loja unificados + guia de estilo Duolingo (referência de arte)

**Data:** 2026-08-17 (madrugada 21/08) · sessao-063

**Cards da Loja:** o card "XP Dobrado" (Épico) aparecia branco no tema
escuro — `bg-purple-50` era a única cor de raridade sem override em
`globals.css`. Resolvido tirando a cor do card inteiro: todos usam
`bg-surface`/`border-border` agora, a raridade vive só na etiqueta
(`RARITIES[x].badge`, novo). Ver `sessao-063.md` pro detalhe.

**Guia de estilo Duolingo — referência pra ícones futuros.** O Davi mandou
8 imagens do guia oficial (`design.duolingo.com`) pra eu gerar um prompt
melhor pro ícone de foguete. Extraído de verdade (não de memória) e
guardado aqui pra não se perder:

- **Formas:** só retângulo de canto arredondado, círculo, triângulo de
  canto arredondado. Nunca canto vivo, nunca elipse inclinada (sugere
  perspectiva — o Duolingo é sempre plano), nunca ponta viva.
- **Ritmo:** alternar peso visual (forma grande + pequena) — peso uniforme
  é monótono.
- **Simplicidade:** ~15 formas é o alvo (6 = abstrato demais, 30 = formas
  demais).
- **Sombra:** só pílula, nunca oval; sempre mais escura que a base; só
  existe apoiada num chão, não se aplica a ícone solto transparente.
- **Regra de cor:** nunca cinza puro; pastel claro no lugar de branco puro
  como base; poucas cores por ilustração (a régua do sapo: 3 tons de verde
  = ok, 5 cores variadas = errado).

**Paleta oficial completa (nome do animal → hex), pra reusar sempre que
precisar de uma cor "no estilo Duolingo":**

| Cinza/vermelho | | Amarelo/laranja/marrom | | Verde/azul/roxo | |
|---|---|---|---|---|---|
| Polar | `#F7F7F7` | Canário | `#FFF5D3` | Esponja marinha | `#D7FFB8` |
| Cisne | `#E5E5E5` | Pato | `#FBE56D` | Tartaruga | `#A5ED6E` |
| Lebre | `#AFAFAF` | Abelha | `#FFC800` | Coruja | `#58CC02` |
| Lobo | `#777777` | Leão | `#FFB100` | Rã-arborícola | `#58A700` |
| Enguia | `#4B4B4B` | Raposa | `#FF9600` | Iguana | `#DDF4FF` |
| Lula | `#EBE3E3` | Guepardo | `#FFCE8E` | Anchova | `#D2E4E8` |
| Peixe Andante | `#FFDFE0` | Macaco | `#E5A259` | Beluga | `#BBF2FF` |
| Flamingo | `#FFB2B2` | Camelo | `#E7A601` | Água-viva da Lua | `#7AF0F2` |
| Porco | `#F5A4A4` | Cobaia | `#CD7900` | Gaio-azul | `#84D8FF` |
| Caranguejo | `#FF7878` | Urso-pardo | `#A56644` | Arara | `#1CB0F6` |
| Cardeal | `#FF4B4B` | | | Baleia | `#1899D6` |
| Formiga de fogo | `#EA2B2B` | | | Jubarte | `#2B70C9` |
| | | | | Narval | `#1453A3` |
| | | | | Estrela-do-mar | `#FFAADE` |
| | | | | Besouro | `#CE82FF` |
| | | | | Betta | `#9069CD` |
| | | | | Borboleta | `#6F4EA1` |

**Conflito identificado com o app (registrado, não resolvido):** o guia
Duolingo assume ilustração sobre fundo BRANCO; o Tabuada Rush é escuro.
Pastel claro sobre escuro funciona bem (bom contraste); a regra de sombra
não se aplica (ícone é PNG transparente solto, sem chão). **Os ícones que
já existem no jogo (moeda, baú) têm gradiente/volume 3D — isso NÃO é o
estilo Duolingo real (que é chapado).** Pergunta em aberto pro Davi: migrar
tudo pro chapado aos poucos, ou manter os ícones novos no estilo que já
está no app (3D/gradiente)? Nenhuma decisão tomada ainda.

---

## D042 — Falha de processo: sessão sem registro completo, e correção

**Data:** 2026-08-17 (sessão seguinte à 063) · sessao-064

**O que o Davi encontrou:** pediu pra eu conferir os arquivos de registro
antes de qualquer coisa nova, porque "recentemente você não fez muito essa
certificação". Conferido: ele tinha razão, mas de forma específica — não é
que o histórico geral esteja ruim (sessões 044-062 estão todas registradas,
com D020-D040 documentando cada decisão não-óbvia). **A sessão 063**
especificamente (correção de cor dos cards + guia Duolingo) teve commit e
`CHANGELOG.md` feitos, mas `sessions/sessao-063.md` nunca foi criado e
`MEMORY_CORE.md`/`MEMORY.md` ficaram parados na versão anterior — passos 1
e 4 da "ROTINA OBRIGATÓRIA DE FIM DE BLOCO/SESSÃO" (`CLAUDE.md`) foram
pulados naquela sessão.

**Corrigido retroativamente:** `sessions/sessao-063.md` escrito agora (ver
acima e o próprio arquivo), `MEMORY_CORE.md`/`MEMORY.md` atualizados pra
6.0.13.

**Correção de processo, pra não repetir:** `CLAUDE.md` ganhou uma checagem
de auto-verificação barata — antes de considerar qualquer sessão encerrada,
conferir que a `Versão` no topo do `MEMORY_CORE.md` bate com a última
entrada do `CHANGELOG.md`. Se não bater, a rotina não foi cumprida e falta
concluir os passos 1 e 4 antes de seguir em frente.

**Também criados nesta sessão** (pedido explícito do Davi — quer um plano
de ação vivo, revisado a cada nova sessão, ANTES de começar a implementar
qualquer coisa nova):
- `PLANO_ACAO.md` — backlog atual (ícones, remoção do XP Dobrado, Mochila,
  Poções, loja rotativa, baús/recompensas por tempo de jogo, páginas de
  resumo pós-partida), organizado em fases, cada item com checkbox.
- `PENDENCIAS.md` — ideias soltas que aparecerem no caminho sem desviar do
  que está em andamento (o Davi pediu isso especificamente pra ideias de
  animação nas telas finais de partida).

---

## D043 — Fases 1 e 2 do PLANO_ACAO.md: ícones novos + remoção do XP Dobrado

**Data:** 2026-08-17 · sessao-065

Davi confirmou as 3 perguntas em aberto do `PLANO_ACAO.md` (remover XP
Dobrado de vez; calendário de 5 dias é mesmo diferente, ele manda
referência quando chegar a vez; "partida" na Fase 6 é a duração REAL, não
por modo — ele lembrou que o bônus de combo do Rush pode esticar uma
partida bem além do esperado) e mandou seguir com a Fase 1.

### Fase 1 — 16 ícones novos processados

Mesmo pipeline de flood-fill das sessões anteriores (D037/D040), com dois
achados que mudaram o resultado:

1. **"Vidas" e "Vida Extra" são ícones DIFERENTES**, apesar do Davi ter
   escrito "usar o mesmo ícone de vidas" no texto original. Ele baixou dois
   arquivos distintos: `novo_icone_vidas.png` (coração liso, uso geral) e
   `novo_icone_vida_extra.png` (coração com cruz — ícone médico, uso
   específico do power-up de reviver). O arquivo mais específico venceu a
   instrução escrita — usei o coração-com-cruz só no power-up Vida Extra
   (`pu-vida-extra`, novo). **Sinalizado no código pra ele confirmar.**
2. **Sem ícone novo pro Escudo** — não veio nenhum arquivo com esse nome;
   mantido `pu-escudo.png` da sessão 062 sem alteração.

Trocados (mesmo arquivo de destino, então nem precisou mexer em import):
`vidas.png`, `ofensiva.png` (estado "acesa"), `pu-largada.png`,
`pu-congelar.png`, `pu-tempo.png`. Novos (registro novo em `GameIcon.jsx`):
`pu-vida-extra`, `missao-mensal`, `missao-diaria`, `mochila`, `pocao-xp-1/2/3`
(fatiados de uma folha vertical única — sem cor diferenciando os 3 tiers,
mapeei por formato: tubo=x1,5, erlenmeyer=x2, redonda=x3, é uma suposição
minha, não confirmada), `bau-madeira/ferro/ouro/mistico` (fatiados de uma
fileira horizontal de 4, ordem bateu exatamente com os 4 tiers do
`PLANO_ACAO.md` Fase 6). Os 3 últimos grupos (mochila/poções/baús) só
foram REGISTRADOS — as telas que os usam (Fases 3/4/6) ainda não existem.

Categorias de missão (Diárias/Mensais) também trocadas de emoji (☀️/🗓️)
pra arte, e o ícone "Congelar" nos botões/badges de missão (antes
`Snowflake` da lucide) virou a mesma arte usada na Loja — consistência
entre os dois lugares que mencionam a mesma coisa (mesmo princípio da
"varredura" da sessão 060, D038).

### Fase 2 — XP Dobrado removido; regra nova do Congelar Missão

**XP Dobrado:** removido de `SHOP_ITEMS`, do cálculo de XP em
`App.jsx handleGameEnd` (multiplicador ×2 por partida saiu do lugar; deixei
um comentário marcando onde o multiplicador das Poções de XP vai entrar na
Fase 4 — são conceitos diferentes: XP Dobrado valia por 1 PARTIDA, Poção
vale por TEMPO), do badge no HUD do `GamePage`, e do banner/label especial
no `ResultsPage` (a lógica de `highlight` nos cards de stat também saiu —
ficou morta, nada mais usa).

**Regra nova do Congelar Missão** (`MissionsPage.jsx`): antes o botão
aparecia sempre, com fallback de comprar na hora por 50 moedas quando não
tinha estoque. Agora **o botão só existe se `powerups.missionFreeze > 0`**
— sem estoque, não aparece nada (nem preço, nem botão desabilitado). Vale
tanto pra missão diária quanto pra desafio mensal já aceito (mesma regra,
dois lugares).

**Verificado:** Loja com 6 itens (XP Dobrado sumiu), 0 imagens quebradas,
Vida Extra usando `pu-vida-extra.png`. Regra do Congelar testada nos dois
sentidos — sem estoque: botão ausente, sem qualquer menção de preço; com
estoque forçado (2): botão aparece com "estoque ×2", clique consome
1 (`estoque ×2` → `1`) e a missão passa a mostrar "Congelada — sobrevive
até amanhã". Header mostra a chama nova tanto acesa (streak>0) quanto
congelada (streak=0). 0 erros no console. Build limpo.

**Nota útil pra Fase 6 (achada nesta sessão, não implementada ainda):**
`result.timePlayed` já existe e é exibido no `ResultsPage` — é a fonte
natural pra medir a duração real de uma partida (resolvendo o "o que conta
como partida" que o Davi esclareceu), sem precisar instrumentar nada novo.

---

## D044 — Ícones por tipo de missão + confirmações da sessão 065

**Data:** 2026-08-22 · sessao-066

Davi confirmou as duas escolhas em aberto da D043 (ícone dedicado do Vida
Extra; mapeamento das poções por formato do frasco) e mandou uma folha
nova: `icocones_para_missoes.png` (4 ícones — controle/gamepad, alvo/mira,
halter, selo "100"), fundo quase-preto (1,1,1), mesmo pipeline de
flood-fill das sessões anteriores.

**Mapeamento por `type` de missão** (`constants/missions.js`), não por
missão individual — mais robusto, se aplica automaticamente pra qualquer
missão nova que reusar um `type` já existente:
- `play` (jogue N partidas) → gamepad — match direto com o pedido original
  do Davi ("Controle" = missões de partidas)
- `accuracy` (precisão %) → mira — match direto ("Alvo" = missões de
  precisão), e coincide com o emoji 🎯 que já era usado
- `score` (pontuação) → selo "100" — coincide com o emoji 💯 já usado
- `correct_single`/`correct_day`/`correct_month` (acertos acumulados) →
  halter — **este eu decidi por eliminação**, o Davi não nomeou esse ícone
  explicitamente; sobrava um tipo sem correspondência óbvia e um ícone sem
  destino óbvio. Pedir confirmação.
- `streak`/`streak_month` (sequência de acertos / dias de ofensiva no mês)
  — **sem ícone novo, continua com 🔥** — nenhum dos 4 ícones da folha
  combinava, e não é o mesmo conceito da chama da barra superior (D039,
  que só muda ali por decisão explícita do Davi).

Implementado como `TYPE_ICON` (mapa `type` → nome do ícone) +
`MissionIcon` (componente que usa a arte quando existe, cai pro emoji do
pool quando não existe) — os 3 lugares que mostravam `mission.emoji`/
`c.emoji` cru (diária, desafio mensal aceito, desafio mensal disponível
pra aceitar) passam pelo mesmo componente, então não tem como esquecer um
dos três.

**Verificado:** diária "20 Acertos" → halter; "Precisão de 90%" → mira;
"Cem Pontos" → selo 100; mensal "80 Partidas" → gamepad, "1.500 Acertos" →
halter. 0 imagens quebradas, 0 erros no console, build limpo.

---

## D045 — Fase 3: tela da Mochila

**Data:** 2026-08-22 · sessao-067

Davi confirmou o acesso pelo **menu lateral** e mandou começar a Fase 3.

**Implementação:**
1. **`SHOP_ITEMS` ganhou o campo `group`** (`constants/shop.js`) —
   categoria de exibição na Mochila (Arena/Vida/Ofensiva/Missões),
   deliberadamente separado do `category` existente (que é a aba dentro
   da própria Loja, hoje só `'powerup'`). Misturar os dois campos criaria
   acoplamento entre duas telas que evoluem por razões diferentes.
2. **`MochilaPage.jsx` nova** — só mostra o que o jogador TEM
   (`data.powerups[key] > 0`), agrupado, com contador `×N` no mesmo
   padrão visual da Loja. **Sem preço, sem botão de comprar** — é
   inventário, não vitrine (a Loja continua sendo o lugar de comprar).
   Item com estoque 0 não aparece — decisão de design: "mochila" é o que
   você tem, não um catálogo do que existe.
3. **Poções (Fase 4) preparadas mas não forçadas** — a seção só renderiza
   se `data.potions` tiver alguma entrada com contagem > 0. Como esse
   campo não existe no storage ainda, a seção fica invisível até a Fase 4
   implementar de verdade — não é placeholder fake, é ausência honesta.
4. **Estado vazio** — mochila sem nada de nenhum grupo mostra uma mensagem
   ("Sua mochila está vazia... compre na Loja ou ache jogando") em vez de
   uma tela em branco.
5. **Sidebar** — item novo entre Loja e Perfil (ordem: Arena → Ligas →
   Missões → Loja → Mochila → Perfil — "ganhar → competir → objetivo →
   comprar → guardar → perfil").

**Verificado:** com estoque variado forçado (`streakInsurance:2,
missionFreeze:1, life:3, time:0, shield:1, headstart:2`) — os 4 grupos
aparecem na ordem certa, os 5 itens com estoque>0 aparecem com contador
batendo exatamente, e `time:0` ("+60s no relógio") **não aparece** (prova
que o filtro de estoque funciona). Com `powerups: {}`, mostra o estado
vazio. Item "Mochila" na Sidebar com ícone, destaque ativo quando na tela,
0 imagens quebradas, 0 sobra horizontal, build limpo.

**Navegação real (clique) não testada de ponta a ponta** — mesma
limitação de compositing do Browser pane já documentada (D034):
`document.hidden === true` trava a transição `AnimatePresence
mode="wait"`. Confirmei por outro caminho que o roteamento funciona (o
clique real na Sidebar mudou a classe ativa do botão pra "Mochila"
corretamente, só a animação de entrada da tela nova que não completa
neste ambiente) e usei o atalho `?screen=mochila` (só em DEV, D034) pra
testar o conteúdo da tela de verdade.

---

## D046 — Fase 4: Poções de XP

**Data:** 2026-08-22 · sessao-068

Davi disse "bora pra mais" após a Mochila, autorizando começar a Fase 4
direto sem esperar revisão visual dela primeiro.

**Implementação:**
1. **`data.potions`** — campo novo no storage, separado de `data.powerups`
   (pedido explícito do Davi no `PLANO_ACAO.md`). Formato
   `{ 'pocao-xp-1': N, 'pocao-xp-2': N, 'pocao-xp-3': N }` — estoque, igual
   ao padrão de `powerups`.
2. **`data.potionActiveId` + `data.potionActiveUntil`** — timestamp (ms) de
   expiração persistente no storage, sobrevive fechar o app. Sem
   `setInterval`/polling: `getActivePotion(data)` (novo `utils/potions.js`)
   sempre checa `Date.now() >= potionActiveUntil` na hora da leitura —
   trata como inativo mesmo se os campos ficarem com valor velho no
   storage. Leitura preguiçosa em vez de expiração proativa.
3. **`POTIONS`/`POTION_MAP`** em `constants/shop.js` — as 3 variações com
   multiplicador, `durationMin` e `price` exatamente como a tabela do
   plano (x1,5/40min/100, x2/25min/250, x3/15min/450).
4. **Efeito por TEMPO, não por partida** — diferente do antigo XP Dobrado
   (D043, valia só pra 1 partida): `getActiveXpMultiplier(data)` é
   aplicado no `handleGameEnd` de `App.jsx` sempre que uma partida termina
   dentro da janela ativa. Pode cobrir várias partidas ou nenhuma,
   dependendo de quanto o jogador joga no tempo da poção.
5. **Compra na `ShopPage.jsx`** — preço fixo (o "mínimo" da tabela), já que
   a Fase 5 (loja rotativa) ainda não existe. Não antecipa o design dela;
   só dá um caminho de aquisição real pra poder testar/usar agora.
6. **Ativação na `MochilaPage.jsx`** — botão "Ativar" por poção em estoque,
   overlay de tela cheia nas cores roxas (gradiente violeta→roxo) que o
   Davi mostrou de referência, com "Poção ativada!", multiplicador,
   duração e horário de expiração, botão "Continuar" pra fechar.
7. **Banner + label no `ResultsPage.jsx`** — mesmo espírito do banner do
   antigo XP Dobrado: mostra XP base → XP final com o multiplicador, só
   quando `potionMultiplier > 1`.

**Decisão de design não especificada — sinalizada pro Davi confirmar:**
só **1 poção ativa por vez**. O plano não dizia o que acontece se o
jogador tentar ativar uma 2ª enquanto a 1ª ainda está rodando — as 3
saídas possíveis (bloquear / acumular multiplicadores / substituir a
ativa) são todas invenções de regra de balanceamento. Escolhi **bloquear**
(botão "Ativar" fica desabilitado enquanto há uma ativa) por ser a única
opção que não inventa comportamento não pedido — não descarta o estoque
do jogador (a poção continua guardada, só não pode ativar agora) e não
cria uma regra de stacking que ninguém pediu.

**Verificado** (via `?screen=` DEV + injeção direta de `localStorage`,
mesma limitação de Browser pane de sempre, D034):
- Loja mostra as 3 poções com nome/preço/ícone corretos, 0 imagem quebrada
- Comprar "Poção de XP ×3" descontou exatamente 450 moedas e setou
  `potions['pocao-xp-3']: 1` — **achei e corrigi um bug no meu próprio
  script de teste** nesse passo: o seletor de DOM subia níveis demais e
  pegava o botão do card errado (comprou x1,5 em vez de x3 na 1ª
  tentativa); corrigido subindo só até o wrapper real do card, reexecutado
  com sucesso
- Mochila mostra a seção "Poções" com os itens em estoque e botão "Ativar"
  — 2º bug de teste (não do app): checagem de `innerText.includes('Poções')`
  falhava por causa da classe CSS `uppercase` (`innerText` retorna o texto
  visual "POÇÕES", não o texto como foi escrito no JSX); corrigido com
  regex case-insensitive
- Ativar a poção x3: setou `potionActiveId`/`potionActiveUntil` (15 min à
  frente), decrementou o estoque de 1→0, mostrou o overlay de ativação
- Com a x3 ativa, o botão "Ativar" da x1,5 restante em estoque ficou
  **desabilitado** — confirma a regra de bloqueio
- Simulação isolada da fórmula de XP (mesma lógica de
  `getActiveXpMultiplier`) contra o storage real: poção x3 ativa → 20 XP
  base vira 60 XP (×3), confirmando a wiring em `App.jsx`
  (`handleGameEnd`) e `ResultsPage.jsx` sem precisar completar uma
  partida inteira neste ambiente

---

## D047 — Ícones novos (power-ups, controle, alvo verde, mochila) + remoção do halter

**Data:** 2026-08-23 · sessao-069

Davi tentou primeiro melhorar a nitidez dos 3 ícones antigos (Congelar/Vida
Extra/+60s) via upscale pelo Higgsfield recém-configurado, mas a conta
estava com **0 créditos** (plano free) — sem solução por aqui, é ação
financeira que só ele pode fazer. Em vez de esperar, ele baixou versões
novas e mais nítidas dos mesmos 3 ícones (arte pronta, já em alta
resolução), mais um ícone de controle de videogame novo e um ícone de
mochila alternativo "pra testar", e pediu pra reaproveitar o alvo verde
(que já existia, usado em `accuracy`) nas missões de sequência e acertos.

**Implementação:**
1. **3 power-ups mais nítidos** — `novo_icone para power ups.png` veio
   como uma folha única (fundo preto, 1422×1106) com os 3 ícones lado a
   lado. Removi o fundo por flood fill (BFS a partir da borda, tolerância
   25) e separei os 3 por detecção de componente conexo (mesma técnica de
   "ilhas" de sessões anteriores), redimensionando cada um pro mesmo teto
   de ~200px do resto do set de ícones. Substituíram `pu-congelar.png`,
   `pu-vida-extra.png`, `pu-tempo.png` (mesmo nome de arquivo — sem
   duplicata, sem precisar editar imports).
2. **Ícone de controle novo** — substituiu `missao-tipo-partidas.png`
   (usado no `type: 'play'` das missões). Mantive o fundo quadrado roxo
   que veio na arte (removi só o branco ao redor, não o roxo) porque esse
   ícone específico é renderizado sem nenhum container/chip ao redor no
   `MissionsPage.jsx` — segue o mesmo padrão que o ícone antigo já tinha
   (era um badge preto arredondado, também autocontido).
3. **Alvo verde reaproveitado** — `TYPE_ICON` em `MissionsPage.jsx` ganhou
   entradas novas: `streak`, `streak_month`, `correct_single`,
   `correct_day`, `correct_month` agora apontam pra
   `'missao-tipo-precisao'` (o mesmo alvo verde de `accuracy`), em vez de
   inventar/baixar ícone dedicado pra sequência. Isso **substitui** o
   halter que só cobria `correct_*` — não é uma decisão de arte, é
   reaproveitamento de asset por pedido direto dele.
4. **Halter removido por completo** — como `missao-tipo-acertos.png`
   ficou sem nenhum uso depois do passo 3 (grep confirmou: só aparecia no
   import do `GameIcon.jsx` e nas 3 entradas do `TYPE_ICON` que acabaram
   de ser remapeadas), apaguei o arquivo e o import/registro — mesma regra
   de sempre, não deixar arte órfã no repo.
5. **Ícone de mochila trocado** — `mochila.png` substituído pela arte nova
   (`novo_icone_da_mochila.png`), mesmo tratamento de flood fill +
   recorte. Único do lote que o próprio Davi chamou de "teste" — ver nota
   de confirmação abaixo.

**Decisão sinalizada — não confirmada por ele:** "colocar onde está alguns
ícones de controle de videogame" (plural) tem outra ocorrência no código
além da missão — o botão "Escolher Modo" do `MenuPage.jsx` usa o ícone
`Gamepad2` (lucide, vetorial) dentro de um chip com fundo próprio
(`bg-white/20`). **Não troquei esse aqui** — a nova arte já vem com um
fundo roxo embutido, e colocá-la dentro do chip existente criaria um
efeito "caixa dentro de caixa" que não foi pedido. Entendi a frase como
"em toda parte que hoje mostra o ícone de controle" no sentido de
_instâncias_ repetidas do mesmo ícone de missão (aparece em cada missão
tipo `play`, diária e mensal) — não como "todo ícone de jogo/controle do
app". Se for esse o pedido, avisar que também mexe no `MenuPage.jsx`.

**Pendente de confirmação:** o ícone de mochila é explicitamente "pra
testar" segundo o Davi — troquei já que ele pediu pra fazer as alterações
e "continuar o plano", mas não é tratado como decisão final igual aos
outros 4 ícones desta leva.

**Verificado** (via `?screen=` DEV + inspeção de DOM, mesma limitação de
Browser pane de sempre — D034):
- `npm run build` limpo, sem erro de import quebrado após remover o halter
- Loja: os 3 power-ups carregam com a resolução nova (191×200, 200×192,
  173×200), 0 imagem quebrada
- Missões (diárias): mission `type: 'play'` ("Três Partidas") mostra o
  controle novo (64×53); mission com `correct_single` ("20 Acertos") já
  mostra o alvo verde em vez do halter
- Missões (mensais): 0 imagem quebrada nos desafios do mês
- Mochila: ícone novo carrega (182×200) no grupo Arena com estoque
  forçado, 0 imagem quebrada

---

## D048 — Fase 5: Loja com estoque rotativo diário

**Data:** 2026-08-23 · sessao-070

Depois do ajuste de ícones (D047), Davi pediu explicitamente pra continuar
o `PLANO_ACAO.md` — próximo item era a Fase 5.

**Implementação:**
1. **`utils/shop.js` novo** — `getDailyShopStock(date = todayStr())`
   sorteia 1-3 itens do dia a partir de um pool combinado dos 7 power-ups
   (`SHOP_ITEMS`) + 3 poções (`POTIONS`), 10 entradas no total. Mesmo
   padrão de `utils/missions.js` (LCG semeado por uma soma dos caracteres
   da data) — mas **sem precisar persistir nada no storage**: como o
   sorteio é puramente uma função da data, ele já dá sempre o mesmo
   resultado pro mesmo dia e muda sozinho quando `todayStr()` muda (vira à
   meia-noite local, D040 — sem `toISOString()`). É mais simples que o
   padrão das missões porque missões precisam de progresso persistido;
   aqui não existe "progresso" nenhum pra guardar, só o resultado do
   sorteio em si, que é recalculável a qualquer momento.
2. **A quantidade também é sorteada** (1, 2 ou 3), não fixa — usei o
   próprio LCG pra decidir o count antes de escolher os itens, mesma fonte
   de aleatoriedade determinística.
3. **`ShopPage.jsx`** — trocou `SHOP_ITEMS.map(...)`/`POTIONS.map(...)`
   fixos por `shopItemsToday`/`potionsToday` (filtrados pelo sorteio do
   dia via `SHOP_ITEM_MAP`/`POTION_MAP`). Seção "Poções de XP" só
   renderiza se `potionsToday.length > 0` (dias sem poção no sorteio não
   mostram a seção vazia). Cabeçalho novo "Estoque de hoje" com contagem
   regressiva até a meia-noite (`resetLabel()`, cópia local do mesmo
   helper do `MissionsPage.jsx` — 2 usos não justificam compartilhar).

**"Recuperar vidas" — decisão sinalizada, não é mudança de código:** o
plano pede que fique "sempre disponível, nunca sorteado". Fui verificar:
esse mecanismo (`LIFE_REFILL_PRICE`, refil do pote diário) **nunca foi um
item da `ShopPage`** — sempre viveu só no painel do Header, acessível de
qualquer tela, sem depender da Loja em nenhum momento. Ou seja, a regra já
estava satisfeita ANTES da Fase 5 existir; não precisei adicionar nada
pra ele continuar "sempre disponível". Documentando aqui pra não parecer
um item esquecido do checklist.

**Verificado:**
- Simulação em Node do algoritmo (10 dias seguidos): quantidade variando
  entre 1-3, dias com 0 poção no sorteio (confirma que a seção
  condicional tem casos reais pra cobrir), itens variando dia a dia
- Data de hoje (2026-08-23) sorteou exatamente `[pocao-xp-1, shield,
  headstart]` tanto na simulação quanto na página real renderizada —
  bate 100%
- `npm run build` limpo
- Compra funcionando com a lista sorteada: Escudo (100 moedas, estoque
  1→2) e Poção ×1,5 (100 moedas, estoque 1→2) — ambas descontaram o valor
  certo e incrementaram o storage certo
- Os 4 power-ups que NÃO saíram no sorteio de hoje (seguro de ofensiva,
  congelar missão, vida extra, +60s) **não aparecem** na tela — confirma
  que o filtro funciona de verdade, não é só decoração

---

## D049 — Fase 6: Baús e recompensas por partida

**Data:** 2026-08-23 · sessao-071

Davi confirmou os dois pontos pendentes da sessão 069 (ícone da mochila
definitivo; ícone de controle do Menu fica pro dia da Arena) e pediu pra
seguir direto pra Fase 6, oferecendo mandar imagens de referência pras
páginas de resumo (isso é Fase 7, ainda não chegou a vez).

**Bug encontrado e corrigido ANTES de implementar o loot:** `timePlayed`
(`GamePage.jsx`) era calculado como `cfg.timer - state.time`. Como o
cronômetro SEMPRE termina em 0 (é a condição de fim de partida), essa
conta sempre devolvia a duração BASE do modo — o bônus de tempo por combo
do Rush (`bonusTime`, +3s por acerto) e o +10s da Largada Turbo, que
somam direto em `state.time`, nunca apareciam no resultado. Um jogador
craque emendando combos por 20 minutos teria `timePlayed` mostrando os
mesmos ~30s de sempre. Troquei por medição de relógio de parede de
verdade: `matchStartRef = useRef(Date.now())` setado uma vez no mount,
`timePlayed = Math.round((Date.now() - matchStartRef.current) / 1000)`
no fim da partida. Conserta de graça o stat "Tempo" do `ResultsPage.jsx`
(que tinha o mesmo problema, não só a Fase 6) e resolve o conflito #3 do
`PLANO_ACAO.md` (duração real, não suposição por modo).

**Implementação do loot:**
1. **`constants/loot.js`** — `CHESTS` (4 baús), `LOOT_POWERUPS` (6,
   reaproveitando os ids de `SHOP_ITEMS`), `LOOT_POTIONS` (3, reaproveitando
   os ids de `POTIONS`), cada um com `intervalMin`/`intervalMax` ("intervalo
   médio de partidas" do plano). `TIME_TIERS` — a tabela de % por
   categoria/duração real, direto dos números do Davi.
2. **`utils/loot.js`** — `rollMatchLoot(realSeconds)`:
   - **RNG por peso, não contador:** cada item tem peso `1/intervalo
     médio` dentro da própria categoria — quem cai com mais frequência
     (intervalo menor) pesa mais no sorteio (`weightedPick`). Descartei de
     propósito um sistema de "contador até garantir o Nº-ésimo": o Davi
     foi explícito que o drop tem que poder vir na 1ª partida por sorte,
     o que só faz sentido com rolagem independente a cada partida.
   - **`rollCount(pct)`** — decide QUANTAS unidades de uma categoria caem:
     `floor(pct/100)` garantidas + 1 rolagem extra com o resto
     `(pct % 100)`%. É a leitura mais literal que dá pra fazer da célula
     "+100% (garantido, pode ser múltiplo)" que o próprio `PLANO_ACAO.md`
     já registrava com uma interrogação — nunca foi resolvida nem pelo
     Davi antes desta sessão. Generaliza pra qualquer % (30% → 30% chance
     de 1; 100% → sempre exatamente 1; 200% → sempre exatamente 2).
   - Faixas de tempo 21-24min e 51+min não tinham número exato na tabela
     original — tratadas como parte da faixa vizinha mais próxima (o
     próprio Davi chamou essas porcentagens de "uma média").
3. **`App.jsx` `handleGameEnd`** — `loot` sorteado UMA VEZ fora do
   `update()` (mesmo cuidado do `potionMultiplier`: nunca rolar 2x, senão
   o que é aplicado no storage e o que aparece na tela podem divergir).
   Aplica moedas dos baús + incrementa `powerups`/`potions` com o que foi
   achado. **Zen excluído do sorteio** — não tem timer (`cfg.timer ===
   null`), então dava pra deixar rodando parado por 1h só pra cair na
   faixa "garantido, múltiplo" sem jogar de verdade; mesmo espírito de
   "Zen não gera moeda nenhuma" que já existia pro `coinsEarned`. Decisão
   não escrita no plano original, sinalizada aqui.
4. **`ResultsPage.jsx`** — card "Recompensas encontradas" mostrando os
   baús/power-ups/poções achados, só aparece se algo caiu. É um resumo
   simples — a página dedicada (página 6 do fluxo pós-partida) é da Fase
   7, que ainda não existe.

**Verificado:**
- `npm run build` limpo
- Simulação em Node de `rollMatchLoot` (20.000 partidas por faixa de
  duração): médias de baú/power-up/poção por partida batem com as % da
  tabela em cada faixa (30/60/50 → 50/90/70 → 80/100/95 → 100/200/195),
  incluindo o caso "0 drops possível" (13,9% das partidas curtas saem sem
  nada) baixando pra 0% nas partidas longas — confirma o comportamento
  que o Davi pediu explicitamente
- Distribuição por item dentro do power-up (50.000 sorteios): os 3
  "Comuns" (Congelar/Largada/Vida Extra) saíram mais que os 3 "Raros"
  (Seguro de Ofensiva/+60s/Escudo) — os intervalos que o Davi deu batem
  com a raridade que já existia na Loja, sem eu precisar inventar nada
- **Não verificado neste ambiente:** playthrough real de ponta a ponta
  (iniciar partida → jogar → terminar → ver o card de recompensas) — o
  clique em "Rush" na tela de Modos não completa a transição de tela
  (mesma limitação de compositing do Browser pane, D034: AnimatePresence
  trava com `document.hidden === true`). Testado via simulação da lógica
  pura + revisão de código da integração; pedir ao Davi pra confirmar
  numa partida de verdade no dispositivo dele.

**Confirmações da sessão anterior (069), registradas aqui por completude:**
- Ícone da Mochila (`novo_icone_da_mochila.png`) — **definitivo**, Davi
  confirmou.
- Ícone de controle do `MenuPage.jsx` (botão "Escolher Modo",
  `Gamepad2` da lucide) — **não mexer agora**, fica pro dia do redesenho
  do painel da Arena (Fase 8).

---

## D050 — Fase 7 (resumo pós-partida) + limpeza (mascotes, preço das poções, ícone de vida)

**Data:** 2026-08-24 · sessao-072

Davi confirmou os 2 pendentes da sessão 069 (mochila definitiva; controle do
Menu fica pra Arena) e pediu, numa mensagem só: triplicar o preço das
poções, construir a Fase 7 inteira (com 4 imagens de referência + texto
detalhado por página), reorganizar ícones baixados pra página de
recompensas, remover o sistema de mascotes por completo, e trocar o emoji
de vida dentro da partida pelo ícone oficial.

**1. Preço das poções triplicado** — `constants/shop.js`: 100→300,
250→750, 450→1350. Só o número — não mexe em duração/multiplicador.

**2. Mascotes (Tuca/Vupt) removidos por completo** — `components/Mascot.jsx`
apagado, `assets/mascots/` (8 arquivos) apagado, e em `GamePage.jsx`
removidos: import, estado (`mascotShow`, `mascotShowCountRef`, `mascotCap`,
`wrongStreakRef`), funções (`randomPose`, `maybeMascot`), o efeito de
"cutuca" (3s sem responder), todo `mascotFired`/chamada de `maybeMascot`
dentro do `handleSubmit` (acerto/combo/erro/escudo), e a renderização
`<Mascot />`. Zero referência restante (`grep` confirmou). Bundle de
produção perdeu ~2MB de webp que não eram mais usados em lugar nenhum.

**3. Ícone de vida dentro da partida** — `GamePage.jsx` tinha 3 emojis de
coração: o HUD de vidas (❤️ × contador) virou `GameIcon name="vidas"`
(mesmo ícone do pote diário do Header); o modal "perdeu a última vida" e o
botão "Usar Vida do Estoque" viraram `GameIcon name="pu-vida-extra"`
(ícone dedicado desse power-up específico, não o genérico — mesmo critério
já usado em outros lugares do app).

**4. Fase 7 — fluxo de resumo pós-partida** — `ResultsPage.jsx` (tela
única) **removido por completo**, substituído por `PostGameSummary.jsx`
novo: uma sequência de páginas, uma de cada vez, avançando no botão
"Continuar", seguindo o estilo visual das 4 imagens de referência do Davi
(fundo escuro, título amarelo, caixas com borda, botão amarelo chapado) —
mas usando os TOKENS DE COR JÁ EXISTENTES do app (`bg-coin`≈amarelo,
`bg-accent`≈verde, `text-graphite` pra texto escuro em fundo claro,
`bg-background`/`border-border` pro resto) em vez de cores novas
hardcoded, pra não abrir uma paleta paralela.

Ordem implementada: Pontuação+Acertos/Erros → XP+% acerto (pula se XP=0,
ex. Zen) → Progresso de Missões (abas Diária/Mensal, mensal só mostra
desafios ACEITOS) → [Ofensiva, só na 1ª partida do dia] → [Meta de
ofensiva batida, ocasional] → [Faixa de tabuada mudou, ocasional] →
Conquistas → 1 página POR item de recompensa achada (Fase 6: baú, cada
power-up, cada poção, cada um numa página própria — pedido explícito dele
de não agrupar tudo numa página só).

**Dados novos expostos por `App.jsx handleGameEnd`** pro resumo conseguir
montar as páginas ocasionais sem duplicar lógica: `firstMatchToday`
(comparação `data.lastPlayDate` ANTES do update — só é true na 1ª
partida do dia), `metaHit` (inferido comparando `streakGoal` antes/depois:
só fica `null` quando a meta acabou de ser batida, não precisei reexpor a
variável local), `hitGoal` (o valor da meta antes, pra mostrar qual foi
batida), `tierChanged`/`prevLevelIdx`/`newLevelIdx` (mesma comparação que
já disparava o toast de level-up, só também exposta pro resumo).

**Bug real encontrado e corrigido no caminho:** o `ResultsPage.jsx` antigo
recalculava o XP exibido com um `MODE_XP_MULT` PRÓPRIO e desatualizado
(`rush: 0.12`, mais vários modos mortos de antes da redução pra 3 modos:
survival/speed/daily/hard/personal/weekly/inverse/combined) — **divergia**
do multiplicador de verdade usado em `App.jsx` (`rush: 0.20`). O XP
mostrado na tela podia não bater com o XP realmente creditado no storage.
Corrigido eliminando a segunda fonte de verdade: `gameXp` (já calculado
dentro do `update()` de `handleGameEnd`) agora é exposto direto no
resultado, sem recálculo nenhum no componente de exibição.

**Progresso de conquistas sem reescrever `ACHIEVEMENTS`:** `getAchievementProgress`
(`utils/index.js`) extrai campo+meta numérica direto do CÓDIGO de cada
`check(s) => ...` via regex (`.toString()` + padrão `s.campo >= N` /
`(s.campo || 0) >= N` / `(s.campo || []).length >= N`) — cobre 25 das 26
entradas atuais sem tocar em nenhuma definição existente. As 9 conquistas
de "chegar numa liga X" (comparação de índice, não numérica) não batem no
padrão e retornam `null` — tratadas como "sem barra de progresso, só
bloqueada/desbloqueada". Se no futuro quiser progresso pra ESSAS também,
aí sim precisa de um campo `progress`/`target` explícito por conquista —
solução leve escolhida aqui não cobre 100% por design, é uma troca
deliberada (rapidez agora vs. cobertura total).

**Decisões sinalizadas, não confirmadas pelo Davi:**
1. **"Baú embaixo de cada recompensa"** — texto dele tinha uma
   contradição aparente com a imagem de referência (que mostra poção/
   vida-extra/baú lado a lado, SEM baú extra sob os 2 primeiros). Interpretei
   como: recompensas que JÁ SÃO um baú não ganham decoração extra (seria
   baú-dentro-de-baú); recompensas que NÃO são baú (power-up/poção) ganham
   um ícone pequeno de baú + "Encontrado em um baú" embaixo, reforçando de
   onde vieram. Implementado assim — se não for o que ele quis dizer, é
   fácil de trocar.
2. **Gênero gramatical** ("Você ganhou um(a) [nome]") — tabela fixa
   `LOOT_GENDER` com os 14 itens de loot existentes (power-ups + poções +
   baús), decidido item por item na mão (ex.: "uma Vida Extra", "um Baú
   Místico"). Generaliza mal pra item novo sem entrada na tabela (cai no
   masculino por padrão) — avisar se adicionar item de loot novo.
3. **Não usei os ícones específicos que o Davi baixou** pra Acertos (alvo
   verde) e pro "baú com item raro" da página de recompensas —
   `ScorePage`/`XpPage` usam o ícone `Target` da lucide com a cor
   `accent` (verde), visualmente equivalente ao PNG baixado, e a
   decoração de baú usa a arte `bau-madeira` que já existe no projeto. Não
   processei os arquivos novos do Downloads porque o resultado visual já
   ficou equivalente sem precisar — se ele preferir literalmente os PNGs
   dele, é só pedir que eu processo.
4. **Resumo do dia na página de Missões** (caixa extra "32 acertos / 30 XP
   ganho hoje" que aparece na imagem de referência) — **não implementado**,
   precisaria agregar sessões do dia que hoje não têm um agregado pronto.
   Sinalizando como pendência, não como "feito simplificado".

**Ferramentas de verificação adicionadas (só DEV, zero rodapé em
produção, mesmo espírito do `?screen=` já existente — D034):**
- `?screen=results` sozinho já não bastava (precisa de `lastResult`
  preenchido, que só existe depois de uma partida de verdade, impossível
  de simular neste ambiente) — agora também sintetiza um resultado de
  teste quando pedido em DEV.
- `?full=1` liga as páginas ocasionais + loot de teste (caso raro);
  sem o parâmetro simula o caso comum (sem ocasionais, sem loot).
- `?page=N` pula direto pra página N da sequência — "Continuar" depende
  da transição do `AnimatePresence` completar, que trava neste ambiente
  (mesma causa raiz do D034, agora também dentro do componente novo).

**Verificado** (via as 3 ferramentas acima, mesma limitação de sempre —
D034, nunca foi possível clicar "Rush" de verdade neste ambiente):
- `npm run build` limpo em cada etapa
- Todas as 10 páginas do cenário completo (`?full=1`) renderizam com o
  texto/números certos: pontuação, XP com o `gameXp` real, % de acerto,
  missões diárias com progresso real do storage, calendário de 5 dias
  com letra de dia da semana e rótulos ONTEM/HOJE/AMANHÃ corretos, meta de
  ofensiva batida com sugestões de meta nova, mudança de faixa (Tabuada
  30×40 → 40×50), conquistas com progresso real (0/1, 0/100 etc.), e as 3
  páginas de recompensa (baú/power-up/poção) com gênero gramatical
  correto e 0 imagem quebrada
- Cenário comum (sem `?full=1`, 4 páginas): última página (Conquistas)
  mostra corretamente as 3 ações finais (Compartilhar/Menu/Jogar
  novamente) — confirma o bug que eu mesmo peguei ANTES de commitar (só a
  página de recompensa tinha essas ações; se ela fosse "Conquistas" por
  não ter loot, o jogador ficava sem replay/compartilhar)
- **Não verificado:** uma partida jogada de ponta a ponta de verdade
  (D034) — pedir ao Davi pra jogar uma partida e conferir o fluxo real
  no dispositivo dele, especialmente a ordem/transição entre páginas.

---

## D051 — Ajustes na Fase 7 a partir do feedback do Davi sobre o D050

**Data:** 2026-08-24 · sessao-073

Davi respondeu às 4 decisões sinalizadas no D050, um por um.

**1. Baú como embalagem de recurso.** Ele esclareceu uma regra de design
que eu não tinha entendido: o baú tem DOIS usos — baú COM MOEDA (a
tabela de frequência da Fase 6, `CHESTS`, já certa) e baú como
EMBALAGEM de um power-up/poção (decoração da página 6, sem frequência
própria — quem é sorteado é o recurso, o baú só "veste" ele). Nesse 2º
caso, o TIER do baú-embalagem precisa bater com a raridade do recurso
(ex.: Poção ×3 → Baú Místico, nunca Madeira) — isso ainda **não está
implementado** (o ícone `bau-recurso` usado agora é genérico, sem ligação
com raridade nenhuma) e o próprio Davi pediu pra **não implementar ainda**
("temos que estruturar melhor... resolver e conversar depois") — só
registrar no `PLANO_ACAO.md` como pendência formal (feito, ver seção nova
dentro da Fase 6 no plano).

**2. Gênero gramatical — virou padrão de projeto.** Davi pediu
explicitamente pra não deixar ele esquecer de atualizar `LOOT_GENDER`
quando um recurso novo for adicionado. Adicionei o aviso ⚠️ em 3 lugares:
o topo de `SHOP_ITEMS` e de `POTIONS` (`constants/shop.js`), o topo de
`CHESTS` (`constants/loot.js`), e reforcei o comentário da própria
`LOOT_GENDER` (`PostGameSummary.jsx`) — qualquer um desses 4 pontos que
eu (ou uma sessão futura) olhar ao adicionar item novo já avisa.

**3. Usar os PNGs baixados de verdade.** Davi confirmou que o restante
dos ícones (além dos 4 novos já usados na sessão 069) estava mesmo só no
Downloads — reescaneei a pasta, achei de novo os únicos 2 arquivos
relevantes que sobravam sem uso: `icone_de_acertos-missões-tela_resumo_da_tarefa.png`
(alvo verde) e `icones_para_a_pagina_de_recompensas_parte3.png` (baú de
madeira com item emergindo). Processados (flood fill + recorte, mesmo
pipeline de sempre) e registrados como `resumo-acertos` (usado nas
páginas 1/2 no lugar do `Target` da lucide) e `bau-recurso` (usado como
decoração genérica na página 6 no lugar do `bau-madeira` emprestado).
**Não havia arquivo novo pro ícone de "Erros"** — continua lucide `X`
vermelho, não tem PNG baixado equivalente.

**Clarificação da ordem das páginas:** Davi confirmou que as páginas
1/2/3/5/6 aparecem em TODA partida, mesmo sem conteúdo — não é "só
mostra se tiver algo". Troquei a condição da página de XP (antes só
aparecia se `gameXp > 0`, agora sempre aparece, mostrando 0 no Zen) e
criei uma página nova "Nada desta vez" (`RewardEmptyPage`) que substitui
a ausência de páginas de recompensa quando a partida não deu loot nenhum
— antes essa página simplesmente não existia nesse cenário.

Ele também mencionou "vou mencionar todas as conquistas" pretendendo
listar algo (provavelmente ícones específicos por conquista), mas a lista
não veio na mensagem — fica pendente até ele mandar.

**4. Resumo do dia — implementado.** Precisava de um agregado diário que
não existia. Adicionei 2 campos NOVOS e aditivos ao objeto `session`
(`App.jsx`, dentro do array `data.sessions`): `localDate` (data local,
`todayStr()` — evita o mesmo bug de fuso do `date` em ISO/UTC, D040) e
`xp` (o `gameXp` real da partida). Não mexi no campo `date` existente
(ISO/UTC) pra não quebrar quem já lê ele em outras telas (Catálogo de
Precisão, Estatísticas, etc.) — é puramente aditivo. A página de Missões
agora filtra `data.sessions` por `localDate === todayStr()` e soma
`correct`/`xp`. **Limitação assumida:** sessões salvas ANTES desta sessão
não têm esses 2 campos (`undefined` vira 0 na soma) — o resumo do dia só
fica completo pra partidas jogadas a partir de agora, não dá pra
reconstruir XP histórico de sessões antigas.

**Verificado:**
- `npm run build` limpo
- `resumo-acertos`/`bau-recurso` carregam sem erro nas páginas 1/2/6
  (`?screen=results&full=1&page=1` e `page=8`)
- Cenário sem `?full=1` (mínimo): 5 páginas agora (score, xp, missões,
  conquistas, "Nada desta vez") — a última mostra as 3 ações finais
  corretamente
- "Resumo do dia" aparece na página de Missões com 0/0 (esperado — este
  browser de teste não tem sessões com os campos novos ainda)
- **Não verificado:** o mapeamento raridade→baú (pendência formal, não
  implementado por pedido dele) e uma partida real registrando
  `localDate`/`xp` de verdade numa sessão nova (D034, mesma limitação).

---

## D052 — Baú como embalagem de recurso (implementado) + ajustes visuais

**Data:** 2026-08-24 · sessao-074

Depois de registrar a pendência no D051, Davi olhou o resultado da sessão
073 rodando e pediu 2 ajustes visuais pontuais, e liberou a implementação
do baú-embalagem que tinha ficado só no plano.

**1. Ajuste visual — "Resumo do dia".** A linha divisória vertical entre
Acertos e XP Ganho saiu (era `<div className="w-px h-8 bg-border" />`),
e os dois ícones (`resumo-acertos`, `Zap`) foram de 22px pra 32px. **Não
mexi** no box "Desempenho" da página 1 (Acertos/Erros), que tem o mesmo
padrão de linha — só a caixa que ele mostrou no print foi ajustada;
sinalizando aqui caso ele queira a mesma coisa lá.

**2. Baú-embalagem de recurso — implementado.** O tier do baú que aparece
na página de recompensa agora bate com a raridade do item, em vez do
`bau-recurso` genérico de antes:
- `RARITY_CHEST = { common: 'bau-madeira', rare: 'bau-ferro', epic:
  'bau-mistico' }` — usa a `rarity` que `SHOP_ITEMS` já tem
- `POTION_CHEST = { 1.5: 'bau-madeira', 2: 'bau-ferro', 3: 'bau-mistico'
  }` — poções não têm campo de raridade próprio, mapeado direto pelo
  multiplicador
- **Baú de OURO ficou de fora do mapeamento, de propósito.** Só existem 3
  níveis de raridade pros recursos hoje (Comum/Raro/Épico), contra 4
  tiers de baú — e o único exemplo concreto que o Davi deu foi "Poção ×3
  (a mais rara) → Baú Místico", ou seja, o TOPO da raridade bate com o
  TOPO do baú. Isso deixa Ouro sem par — decidi mantê-lo exclusivo do
  baú-COM-MOEDA da Fase 6, em vez de inventar uma 4ª faixa de raridade
  que ninguém pediu. **Sinalizado, não formalmente confirmado** — só o
  ponto do topo (×3→Místico) veio dele de verdade.
- A legenda "Encontrado em um baú" foi removida a pedido dele — o ícone
  do baú certo já comunica sozinho.
- `bau-recurso` (o ícone genérico da sessão 073) não ficou órfão: agora é
  usado só na página "Nada desta vez" (partida sem loot).

**Verificado:**
- `npm run build` limpo
- "Resumo do dia" sem linha divisória, ícones maiores (confirmado via
  `?screen=results&page=2`)
- Vida Extra (Comum) → `bau-madeira`; Poção ×1,5 (Comum) → `bau-madeira`
  — confirmado via `?screen=results&full=1&page=8/9`, 0 imagem quebrada,
  sem legenda de texto
- Mapeamento completo (Comum/Raro/Épico × 3 tiers de baú) confirmado por
  simulação isolada da tabela — bate exatamente com o pedido (topo→topo)
- **Não verificado ao vivo:** power-up Raro/Épico e poção ×2/×3 rendendo
  Ferro/Místico numa tela real (o cenário de teste só tem itens Comuns) —
  a tabela em si já foi conferida por fora, risco baixo

---

## D053 — Ícones COMBO recurso+baú (teste, pendente de aprovação visual)

**Data:** 2026-08-24 · sessao-075

Davi mandou 3 imagens de referência (grade de 6 + Vida Extra sozinha +
o ícone de "parte3" já usado antes) e explicou que baixou arquivos de
verdade com o recurso e o baú **já fundidos numa imagem só** (não é mais
ícone do recurso + baú escolhido por raridade, separados como o D052
tinha feito). Ele mesmo notou que a "parte 3" (o `bau-recurso` genérico
que eu já tinha usado) está com um estilo de baú DIFERENTE (madeira) do
resto (dourado) — inconsistência que ele já sabia e quer resolver depois
de validar o layout.

**Pedido dele, seguido à risca:** botar esses ícones prontos pra TESTAR o
layout; se aprovar, ele mesmo gera a versão completa e definitiva (com o
baú variando por classificação — o que o D052 tentou fazer via código,
mas ele quer fazer via ARTE de verdade, gerada por IA, não por regra de
código escolhendo entre 4 baús genéricos).

**Implementação:**
1. Reescaneei o Downloads, achei `icones_para_a_pagina_de_recompensas_parte1.png`
   (Vida Extra sozinha) e `parte2.png` (grade 3×2: +60s, Escudo, Largada
   Turbo, Poção ×1,5/×2/×3). Processados com o mesmo pipeline de sempre
   (flood fill + recorte) — a grade foi fatiada em 6 células por posição
   fixa (2 colunas × 3 linhas), conferido visualmente que nenhuma
   ficou cortada errado.
2. Registrados 7 ícones novos: `combo-vida-extra`, `combo-tempo`,
   `combo-escudo`, `combo-largada`, `combo-pocao-1/2/3`.
3. `REWARD_COMBO` (`PostGameSummary.jsx`) — mapa id→ícone combo. Onde
   existe entrada, `RewardPage` usa ESSA imagem como ícone principal
   (maior, 168px, sem o círculo colorido de fundo — a imagem já é o
   "cartão" inteiro) e não mostra mais o baú separado do D052 nem
   legenda nenhuma.
4. **Faltam 2:** Seguro de Ofensiva e Congelar Missão não têm ícone combo
   ainda (não vieram no material que ele mandou) — continuam no fallback
   do D052 (ícone do recurso sozinho + baú escolhido por
   `RARITY_CHEST`/`POTION_CHEST`) até ele gerar a arte deles também.

**Isto é um TESTE, não uma decisão fechada** — o próprio Davi enquadrou
assim ("quero que vc coloque esse ícone pra testar, se der certo faço a
geração"). Se ele aprovar o layout, o próximo passo é ele gerar o
conjunto completo com o baú variando por raridade nativamente na arte —
nesse caso o mapeamento por código do D052 (`RARITY_CHEST`/`POTION_CHEST`)
deixa de ser necessário pra sempre (só sobra como fallback teórico pra
item sem arte).

**Verificado:**
- `npm run build` limpo
- Os 7 recortes da folha conferidos visualmente antes de registrar — sem
  corte errado, fundo transparente, nenhum vazamento de sparkle entre
  células
- `combo-vida-extra` e `combo-pocao-1` carregam sem erro na página de
  recompensa (`?screen=results&full=1&page=8/9`), 0 imagem quebrada, sem
  legenda de texto sobrando
- Ícone renderiza em 168×168 via `object-contain` (mesmo componente
  `GameIcon` de sempre) — preserva proporção, sem esticar, só sobra
  espaço nas laterais por a imagem não ser quadrada (comportamento já
  existente do componente, não é bug novo)
- **Não verificado:** aprovação visual do próprio Davi (o objetivo desta
  sessão é justamente ele ver e decidir se aprova antes de investir em
  gerar o conjunto completo) — e os 2 power-ups sem combo (fallback do
  D052, não re-testado nesta sessão).

---

## D054 — Conjunto completo de ícones combo (Madeira/Ferro/Ouro/Místico)

**Data:** 2026-08-24 · sessao-076

Depois do D053 (teste com baú sempre dourado), Davi pediu pra eu montar
um PROMPT pra ele gerar a versão de verdade, com o baú variando por
classificação. Ele ditou a classificação por voz (transcrição bem
confusa, com autocorreções no meio) — pedi confirmação num formato de
tabela antes de escrever o prompt, ele não corrigiu, então segui:

- **Madeira:** Congelar Missão, Vida Extra
- **Ferro:** Largada Turbo, Poção ×1,5
- **Ouro:** Seguro de Ofensiva, +60s no Relógio, Escudo, Poção ×2
- **Místico:** Poção ×3 (sozinha — o recurso mais raro, precisa se
  destacar dos outros 8)

Essa classificação é uma tabela PRÓPRIA só pra este efeito visual — não é
mais o Comum/Raro/Épico que a Loja usa pros badges (ex.: Seguro de
Ofensiva mostra "Raro" na Loja mas vai pro Baú de OURO aqui, que é o
tier mais alto dos "normais"). São sistemas paralelos, o do baú não
substitui nem altera o rótulo da Loja.

Escrevi o prompt especificando: 1 imagem só com os 9 recursos numa
grade, cada um já fundido com o baú certo (não peças separadas), usando
os ícones combo antigos (baú dourado uniforme) como referência de ESTILO
apenas, mais os ícones soltos de Vida Extra e Seguro de Ofensiva como
referência de forma (esses dois eu já tinha visto que precisavam de
referência extra — Vida Extra já tinha combo mas num baú diferente do
que ele ia pedir agora, e Seguro de Ofensiva nunca teve combo nenhum).

**Resultado da geração (`Design sem nome.png`, Downloads):** 8 de 9
saíram exatamente como pedido, com diferenciação visual real e
consistente entre os 4 tiers (conferido inclusive por amostragem de cor
de pixel, não só visualmente):
- Madeira: corpo de madeira, ferragem em bronze fosco
- Ferro: corpo inteiro cinza metálico
- Ouro: corpo de madeira, ferragem dourada BEM mais viva/grossa que o
  bronze da Madeira (diferença sutil mas real — não é o mesmo baú)
- Místico: baú roxo inteiro, com gemas brilhantes — claramente o mais
  especial dos 9, como pedido

**1 de 9 saiu errado:** o quadrado do Seguro de Ofensiva não gerou nada
novo — a IA reaproveitou uma imagem antiga (o cristal azul da sessão 073,
"parte3", que o próprio Davi já tinha notado como inconsistente) em vez
de desenhar escudo+baú de ouro. Fica pendente até ele gerar essa peça
específica.

**Implementação:**
1. Processados os 8 recortes válidos (flood fill + recorte, mesmo
   pipeline de sempre) — 7 SUBSTITUÍRAM os ícones combo antigos do D053
   (mesmo nome de arquivo: `combo-vida-extra/tempo/escudo/largada/
   pocao-1/2/3`, agora com o baú certo em vez de sempre dourado) e 1 é
   NOVO (`combo-congelar`, Congelar Missão nunca tinha tido combo).
2. `REWARD_COMBO` (`PostGameSummary.jsx`) ganhou a entrada de
   `powerup_mission_freeze`.
3. `RARITY_CHEST`/`POTION_CHEST` (o sistema de fallback por raridade do
   D052) foram REMOVIDOS — não fazem mais sentido, já que a classificação
   agora é por item específico, não por Comum/Raro/Épico calculado.
   Substituídos por `FALLBACK_CHEST`, um mapa direto com UMA entrada só
   (`powerup_streak_insurance: 'bau-ouro'`, a classificação real dele)
   — o único item que ainda depende de fallback.
4. Cenário de teste (`App.jsx`, `?full=1`) ampliado pra cobrir mais casos:
   antes só testava `powerup_life`/`pocao-xp-1`; agora também
   `powerup_mission_freeze`, `powerup_streak_insurance` (o fallback) e
   `pocao-xp-3` (o Místico).

**Verificado** (6 páginas de recompensa conferidas uma por uma via
`?screen=results&full=1&page=N`, D034 sempre a mesma limitação de
playthrough real):
- Baú Místico (baú-com-moeda, não mexido): renderiza normal
- Vida Extra → `combo-vida-extra` (Madeira) — 0 imagem quebrada
- Congelar Missão → `combo-congelar` (Madeira, NOVO) — 0 imagem quebrada
- Seguro de Ofensiva → cai certo no fallback (ícone do recurso +
  `bau-ouro` direto) — 0 imagem quebrada, confirma que o item sem combo
  não quebra nada
- Poção ×1,5 → `combo-pocao-1` (Ferro) — 0 imagem quebrada
- Poção ×3 → `combo-pocao-3` (Místico) — 0 imagem quebrada, última página
  mostra as 3 ações finais corretamente
- `npm run build` limpo

**Pendente:** Davi gerar a peça que faltou (Seguro de Ofensiva + Baú de
Ouro, mesmo estilo dos outros 8) pra fechar o conjunto dos 9.

---

## D055 — Ícones combo, 2ª geração (resolução maior, mesma peça faltando)

**Data:** 2026-08-24 · sessao-077

Davi gerou de novo (arquivo `ChatGPT Image 24 de ago. de 2026,
16_58_05.png`, 1254×1254 — bem maior que o `Design sem nome.png` de
524×524 da geração anterior, D054). Comparei os dois arquivos
(tamanhos diferentes — confirma que são 2 gerações INDEPENDENTES, não o
mesmo arquivo salvo de novo): os 8 recursos que já tinham saído certos
continuam certos, com a MESMA classificação de baú (Madeira/Ferro/Ouro/
Místico) e o mesmo estilo visual — só a resolução mudou, pra melhor.

**Seguro de Ofensiva errou de novo, exatamente do mesmo jeito** — a
célula da grade voltou a mostrar o cristal azul reciclado (a "parte3"
antiga) em vez de escudo+baú de ouro. Duas gerações independentes
caindo no mesmo erro pro mesmo item é sinal de que o problema não é
acaso — provavelmente falta uma referência clara do ícone do Seguro de
Ofensiva no material que ele está anexando (ou o cristal azul está
"contaminando" o prompt/referências de alguma forma). Sinalizado pra ele
tentar de novo com atenção especial nessa peça, se quiser.

**Implementação:** reprocessados os mesmos 8 arquivos (`combo-congelar/
vida-extra/largada/pocao-1/tempo/escudo/pocao-2/pocao-3`), agora a partir
da imagem de maior resolução — recorte em 260px de lado maior (era 220),
nitidez visivelmente melhor. Nenhuma mudança de código necessária (mesmo
nome de arquivo, `REWARD_COMBO`/`FALLBACK_CHEST` do D054 continuam
válidos como estão).

**Verificado:**
- `npm run build` limpo
- `combo-vida-extra` carrega sem erro na página de recompensa
  (`?screen=results&full=1&page=8`), 0 imagem quebrada
- Comparação visual dos 8 icons novos com os da D054 — mesma
  classificação, mesmo estilo, só mais nítidos

**Pendente:** ainda falta o Seguro de Ofensiva — 2 tentativas seguidas
não geraram essa peça.

---

## D056 — Correção do erro Seguro de Ofensiva + revisão visual completa da Fase 7 (handoff)

**Data:** 2026-08-25 · sessao-078

**A causa raiz do bug do Seguro de Ofensiva (D053-D055) era MINHA, não da
geração de imagem.** O prompt que escrevi (sessões 075-076) descrevia
esse power-up como "ícone de escudo azul" — errado. O próprio código
(`SHOP_ITEMS`) já registra `art: 'ofensiva-congelada'` pra esse item —
é a chama de ofensiva CONGELADA, não um escudo (o "Escudo" é um power-up
TOTALMENTE diferente, `powerup_shield`, que aí sim usa um ícone de
escudo). Duas gerações independentes "erraram" porque pedi a coisa
errada duas vezes — não é falha da IA. Corrigido em `RECURSOS.md` pra
não repetir esse erro na próxima tentativa de gerar essa peça.

**Davi mandou uma revisão visual extensa** de cada página da Fase 7
depois de ver os ícones combo rodando, e avisou que o contexto desta
conversa está acabando — pediu explicitamente pra eu **documentar tudo
organizado antes de qualquer implementação nova**, pra não perder nada
na transição pra uma conversa nova. Decisão: não implementar nada agora,
só capturar. Lista completa (partículas a remover, bug de linha no
ícone de Acertos, nova implementação de baú-por-missão na página 3,
troca de ícones em várias páginas, remoção da caixa "Classificação" na
página 6, baú de moeda mostrado aberto com moedas em cima) está em
`sessions/sessao-078.md` — não duplicada aqui de propósito, pra não ter
2 fontes de verdade divergindo.

**2 documentos novos criados:**
1. `RECURSOS.md` — catálogo único dos 3 tipos de recurso (baús/
   power-ups/poções): o que fazem, preço, raridade, probabilidade de
   drop, tudo compilado do código real (`constants/shop.js`,
   `constants/loot.js`) — fonte de verdade pra consulta rápida, evita
   ter que reler 6 decisions diferentes (D046/D049/D052/D054) toda vez.
2. `sessions/sessao-078.md` — a lista de pendências completa, página por
   página, organizada exatamente na ordem que ele revisou.

**Novo processo de trabalho, pedido por ele — vira regra permanente:**
sempre que uma feature visual nova depender de referência ambígua
(posicionamento/layout que só texto não resolve), EU devo pedir a ele
pra baixar uma imagem "base", e EU MESMO dou o nome do arquivo (não ele)
— facilita localizar depois no Downloads, que já está com dezenas de
arquivos acumulados sem organização nenhuma (limpeza dessa pasta também
virou pendência registrada no `PLANO_ACAO.md`).

**Nenhum código foi alterado nesta sessão** — é puramente documentação,
por decisão explícita (evitar começar uma implementação grande com o
contexto acabando).

---

## D057 — Catálogo único de ícones por página (novo item de plano)

**Data:** 2026-08-25 · sessao-079

Davi pediu mais um documento/organização, **diferente do `RECURSOS.md`**
(que cataloga por TIPO de recurso — baú/power-up/poção): este é por
**ABA/PÁGINA do app**, pra saber de bater o olho quais ícones cada tela
usa. Objetivo prático: parar de precisar baixar/redigitar o mesmo tipo
de ícone do zero toda vez — ter um lugar único (arquivo e/ou pasta) onde
os ícones vão sendo catalogados conforme entram no jogo.

Ele deixou em aberto se isso vira um arquivo (tipo o `RECURSOS.md`, só
que organizado por página), uma pasta física de assets organizada por
página, ou os dois — decisão pra quando for implementar de verdade, não
agora. Registrado só como item de plano (`PLANO_ACAO.md`, FASE 7.2),
**sem implementação nesta sessão** — mesmo espírito do D056 (documentar
antes de codar).

**Observação dele sobre o Explorer do Windows** ("Este Computador" vs
"Acesso Rápido" mostrando arquivos diferentes do Downloads): não é algo
que eu preciso resolver — meus scans já vão direto no caminho real da
pasta, então pegam todo arquivo que existe de verdade independente de
qual visão do Explorer ele está olhando. Anotado só pra manter o
contexto de por que ele mencionou.

**Ordem:** ele quer essa organização pronta **antes** de mexer na Fase 8
(Arena) — mencionou "algumas inovações" ligadas a ícones que dependem
disso vir primeiro, sem detalhar ainda quais.

**Nenhum código alterado** — só `PLANO_ACAO.md` (FASE 7.2 nova).

---

## D058 — Fase 7.1 bloco 1: o que decidi sem perguntar (e por quê)

**Data:** 2026-08-25 · sessao-080

Três coisas do bloco 1 da revisão visual não estavam escritas na lista do
Davi e eu resolvi na hora — ficam sinalizadas aqui pra ele reprovar se
quiser:

1. **Tirei o círculo vermelho atrás do ícone de Erros também.** Ele pediu
   só a remoção do círculo VERDE (Acertos). Deixar um lado com bolha
   colorida e o outro sem ficaria visivelmente torto — os dois estão lado
   a lado na mesma caixa. O ícone de erro em si continua o `X` da lucide,
   esperando a arte que ele vai gerar.

2. **Calendário da página de Ofensiva: usei os marcadores que já existem.**
   Ele ia baixar uma imagem de referência do "estilo do painel do Header".
   Não precisou: esse painel já está implementado e usa a arte
   `dia-feito` (círculo laranja com check) / `dia-vazio` (círculo cinza) —
   exatamente o que ele descreveu ("círculos sem cor por padrão; quando
   concluído, laranja com check"). Reaproveitei em vez de pedir arte nova.

3. **Corrigi o dado do calendário, não só o visual.** O "concluído" de
   cada dia era assumido pelo índice (`i <= 0`), ou seja: ONTEM sempre
   aparecia feito, mesmo pra quem jogou pela primeira vez hoje. Como eu ia
   reescrever esse trecho de qualquer jeito, passei a ler das sessões
   reais pela data local (`localDate`, mesma conta do Header — evita o bug
   de fuso do D040). Mostrar dia feito que não foi jogado é mentira na
   tela de um jogo cuja mecânica principal é justamente a ofensiva.

**Sobre o baú de moeda aberto:** não é decisão minha — ele apontou o
arquivo `novo_icone_baus_classificações.png` como boa referência na
sessão 078. Recortei os 4 baús de lá (fundo branco removido) e criei
`bau-*-aberto`. A versão fechada continua existindo e em uso.

**Confirmado por ele antes de codar:** confete sai de TODAS as páginas
(não só das 4 citadas), e o baú por missão fica pro bloco seguinte.

---

## D059 — Catálogo de ícones: como ficou (FASE 7.2 implementada)

**Data:** 2026-08-25 · sessao-081

O Davi tinha deixado em aberto (D057) se o catálogo seria um ARQUIVO, uma
PASTA física, ou os dois. Perguntei antes de fazer e ele respondeu: **os
dois**, com os arquivos do Downloads **movidos** pra dentro do projeto.

**Como ficou:**
- `ICONES.md` (raiz/vault) — organizado por ABA/PÁGINA, com a imagem de
  cada ícone renderizando no Obsidian e no GitHub
- Página visual publicada — mesma informação em grade grande, com busca e
  clique-pra-copiar; ícones embutidos em base64, funciona offline
- `referencias/icones/<categoria>/` — os ORIGINAIS baixados por ele,
  agora versionados no Git em 9 categorias

**Decisão minha, sinalizada:** escrevi **geradores** (`scripts/gerar-*.py`)
em vez de manter o catálogo à mão. Um catálogo de 61 linhas mantido
manualmente desatualiza na terceira sessão; o gerador confere que todo
ícone citado existe de verdade na pasta e que nenhum arquivo ficou fora
(hoje: 61 = 61, zero divergência nos dois sentidos).

**Critério de classificação do Downloads:** movi só o que era
identificável como material do jogo. Arquivo de nome ambíguo eu não
adivinhei — montei uma folha de contato com todos lado a lado e olhei.
Documentos, fotos, planilhas e instaladores não foram tocados (149 → 96
arquivos no Downloads).

**Sobre a observação dele do Explorer** (Este Computador vs Acesso Rápido
mostrando coisas diferentes): confirmado que não era problema meu — meu
scan foi direto no caminho real da pasta e pegou os 149 arquivos que
existem de verdade.

---

## D060 — O "baú genérico" era o combo do Seguro no tier errado

**Data:** 2026-08-25 · sessao-082

O Davi apontou três coisas sobre os baús e as três se confirmaram nos
arquivos:

1. **Os 4 baús "fechados" estão abertos e cheios de moeda.** O nome
   `bau-madeira` etc. sempre prometeu "fechado" e a arte nunca foi isso.
   Ele vai gerar (`baus-fechados-4-tiers.png`).
2. **O `bau-recurso` não era um baú genérico.** Era o exemplo que ele
   gerou pro combo do **Seguro de Ofensiva** (cristal de gelo + baú), no
   tier errado. Eu peguei a versão errada, usei como decoração genérica,
   e deixei a versão certa (em ouro) de fora — que era justamente a peça
   que eu vinha registrando como "faltando" desde a sessão 076 (D056).
   **Não faltava arte nenhuma: faltou eu olhar a folha inteira.**
3. **O combo Poção ×3 + Místico tem brilho em volta** que suja o ícone
   na página. Ele vai regerar.

**O que mudou por isso:** `combo-seguro-ofensiva` recortado da folha e
ligado; `bau-recurso` apagado; `FALLBACK_CHEST` e `chestArt` removidos
(não existe mais recurso sem combo).

**Decisão minha, sinalizada:** a página "Nada desta vez" ficou sem ícone
quando o `bau-recurso` saiu. Coloquei o baú de madeira em cinza e apagado
(`grayscale opacity-40`) em vez de um baú normal — mostrar baú cheio de
moedas numa página que diz "você não achou nada" é contraditório. É
temporário: quando a arte FECHADA substituir o `bau-madeira`, a página
fica certa sozinha.

**Lição de processo:** quando o Davi manda uma FOLHA com vários ícones,
conferir tile por tile antes de recortar — inclusive os que parecem
repetidos. A peça que faltou por 3 sessões estava dentro de uma folha que
eu já tinha em mãos, com o fundo levemente diferente dos vizinhos.

---

## D061 — Fundo por recurso nas páginas de recompensa

**Data:** 2026-08-27 · sessao-083

O Davi mandou 12 fundos de página (gradiente na cor do recurso + o símbolo
dele repetido e desfocado) com a instrução: "ao invés de ficar preto o
fundo, ficar combinando com o recurso". Três decisões minhas na
implementação, todas sinalizadas:

1. **Véu escuro por cima da arte.** Os fundos cobrem um intervalo grande
   de luminosidade — o do baú de ouro é dourado claro, o do místico é roxo
   escuro. Texto branco fixo sumia no dourado; texto amarelo sumia nos
   dois. Coloquei um gradiente preto de 25% a 55% por cima do fundo e
   deixei o título branco. A cor do recurso continua dominando a tela, e a
   leitura funciona nos 12.
2. **JPEG, não PNG.** São gradientes grandes sem transparência: em PNG
   passavam de 100 KB cada (1,2 MB no bundle), em JPEG de qualidade 84
   ficaram entre 11 e 26 KB (menos de 200 KB no total).
3. **Recorte do retângulo branco.** Cada tile da folha tinha um retângulo
   branco arredondado embaixo — o lugar do botão na referência dele, não
   parte do fundo. Cortei fora; se ficasse, apareceria como um borrão
   branco atrás do "Continuar" de verdade.

**Fallback:** recurso sem entrada no mapa cai no fundo escuro padrão. É o
caso do Seguro de Ofensiva hoje (a leva veio com 12 fundos e o jogo tem 13
recursos com página de recompensa) — a página funciona, só não tem a cor.

**O que o Davi decidiu sozinho e eu acatei:** a página "Nada desta vez"
ganhou arte própria — baú aberto e VAZIO, com moscas. É melhor que a
solução temporária que eu tinha feito na sessão 082 (baú de madeira em
cinza e apagado) e diz a mesma coisa de forma bem mais clara.

---

## D062 — Verificação visual resolvida: o problema era rAF, não "IA não vê tela"

**Data:** 2026-08-27 · sessao-084

O Davi perguntou por que eu não conseguia ver as telas e mandou resolver.
Resolvido — e a causa raiz do D034 finalmente ficou clara.

**O que acontecia:** o `framer-motion` anima via `requestAnimationFrame`,
e o navegador NÃO roda rAF numa janela que não está sendo pintada (painel
fechado, aba oculta, headless com tempo virtual). A tela ficava congelada
no ESTADO INICIAL da animação — `opacity: 0, x: 24`. Por isso toda captura
saía deslocada 24 px, cortada na direita, ou totalmente em branco. Não era
limitação de enxergar imagem: era animação parada no primeiro quadro.

**Solução em três peças:**

1. **`?still=1`, só em DEV** (`STILL_MODE`). Com a flag, `initial` vira
   `false` — o framer pinta o estado final direto, sem animação e sem
   depender de rAF. Escolhi isso em vez de `duration: 0` porque duração
   zero ainda precisa de um quadro pra aplicar; `initial={false}` não
   precisa de nenhum.
2. **Protocolo de DevTools em vez de `--screenshot`.** A flag de linha de
   comando captura a JANELA, que traz alguns pixels de moldura e corta a
   direita da página (perdi um tempo achando que era bug de layout: medi
   no navegador e a página estava certa, 430 px sem transbordo). Pelo
   protocolo dá pra fixar o viewport exato do aparelho.
3. **Esperar conteúdo, não tempo.** Com `setTimeout` fixo a primeira tela
   saía em branco — em DEV o Vite serve centenas de módulos soltos e a 1ª
   navegação demora bem mais. O script pergunta à própria página se
   carregou (`readyState`, existe `h1`, todas as imagens completas).

**Consequência prática:** dá pra verificar mudança visual sem depender do
Davi abrir painel nenhum, e mandar as imagens pra ele. O D034 deixa de ser
um impedimento permanente e vira nota histórica.

**Erro de processo junto (registrado pra não repetir):** na sessão 083 eu
atualizei o gerador do catálogo, a substituição de texto NÃO pegou, e eu
publiquei sem conferir o resultado. Publicação de artefato agora tem que
terminar com uma conferência no arquivo gerado — foi o Davi quem viu.

---

## D063 — Fundo de recompensa em tela cheia (camada fixa, não fundo do cartão)

**Data:** 2026-08-27 · sessao-085

O Davi olhou a screenshot e pediu que a arte de fundo "complete a imagem
inteira", não só o cartão: "se você quiser expandir, expande, mas quero
que fique completo".

**Como implementei:** a arte saiu do `background` do cartão e virou uma
camada `fixed inset-0 z-0` (mais o véu escuro, também fixo). Escolhi
`fixed` em vez de esticar o cartão por dois motivos:

1. Cobre a tela toda de ponta a ponta sem depender de calcular a altura do
   cabeçalho — esticar o cartão com `min-h-dvh` deixaria ele mais alto que
   a área visível e criaria rolagem.
2. O cabeçalho é `sticky top-0 z-40`, ou seja, um contexto de empilhamento
   ACIMA de `z-0`. Então a arte passa por baixo dele e o cabeçalho continua
   legível por cima, em vez de sumir atrás da imagem.

O conteúdo (ícone, título, botão) subiu pra `z-10`. Quando não há arte, o
cartão continua exatamente como era: fundo próprio e cantos arredondados.

**Junto disso:** o total de moedas voltou pro amarelo (`text-coin`) mesmo
sobre a arte — eu tinha deixado branco na sessão 083 por causa do
contraste, mas o véu escuro já resolve isso e ele quis a cor da moeda.

**Emoji de fogo:** trocado pelo ícone de ofensiva no HUD de combo, no
toast de combo e no modal de meta. Raciocínio dele, que eu registro
porque vale pra decisões futuras: a chama do jogo serve pros dois papéis
(ofensiva e combo) e mantém a identidade própria em vez do emoji do
sistema. Emojis que são DADO (conquistas, missões, personagens em
`constants/`) não foram tocados — são dezenas e é outra decisão.

---

## D064 — Rebarba de recorte: causa, solução e o que o Davi pode fazer

**Data:** 2026-08-27 · sessao-086

Ele perguntou, direto: "o que você está com dificuldade de fazer? Como eu
posso te ajudar? Está muito ruim esse negócio de recorte."

**A causa não era o formato do arquivo.** A arte chega em PNG, mas com
FUNDO SÓLIDO pintado (branco ou preto). Na borda do desenho o gerador
mistura a cor do objeto com a do fundo (anti-aliasing). Remover só os
pixels "parecidos com o fundo" deixa essa faixa misturada — o contorno
branco que ele viu.

**Solução do meu lado** (`scripts/recortar-icone.py`): alfa proporcional à
distância até a cor do fundo + **descontaminação de cor**, recuperando a
cor real do objeto com `F = (C − (1−α)·B)/α`. Medido no baú de ouro
aberto: borda quase-branca de 50,3% → 18,0%.

**O que ajuda do lado dele, em ordem de eficácia:**

1. Pedir ao gerador **PNG com fundo transparente** de verdade. Resolve na
   fonte.
2. Se o gerador não fizer transparência, pedir fundo **de uma cor que não
   existe na arte** — magenta ou verde puro. Fundo branco atrás de arte com
   brilho branco (o baú místico antigo) é o pior caso.
3. **Sem brilho, fumaça, estrelinhas ou sombra** em volta do objeto: esse
   efeito é meio-transparente por natureza, então vira rebarba
   inevitavelmente. Foi exatamente o problema do baú místico, que ele
   mesmo identificou e regerou.
4. Deixar uma margem entre o objeto e a borda da imagem.

**Varredura:** medi rebarba nos 63 ícones. Os outros valores altos são cor
legítima (o escudo É branco, o alvo TEM contorno escuro) — reprocessar
esses estragaria a arte, então só os 3 baús abertos foram refeitos.

---

## D065 — Tier do baú por missão: a regra do "primeiro teto que alcança"

**Data:** 2026-08-27 · sessao-087

O pedido era "o tier do baú bate com a faixa de moedas da recompensa
específica da missão". Ao implementar apareceu um caso que a especificação
não cobria: **as faixas dos baús têm buracos**. Madeira vai até 100, Ferro
começa em 200; Ferro termina em 400, Ouro começa em 500. E existe missão
caindo no buraco — o desafio mensal de **450 moedas**.

**Regra que adotei:** o baú é o primeiro cujo TETO alcança o valor. Então
450 → Ouro (teto 800), 150 → Ferro (teto 400). Alternativa seria arredondar
pra baixo (450 → Ferro), mas premiar o jogador com o baú de cima numa
recompensa maior que o teto do tier anterior é mais coerente com a ideia de
"recompensa maior, baú melhor".

**Deriva de `CHESTS`, não é tabela nova.** Se os valores dos baús mudarem
(Fase 6), as missões acompanham sozinhas — uma fonte de verdade só.

**Estado visual:** fechado com 60% de opacidade enquanto incompleta, aberto
e opaco quando completa. O baú abrindo É o feedback de conclusão, junto com
a barra ficando verde.

**Nota de ferramenta:** pra fotografar o estado "aberto" precisei ensinar o
script de telas a montar estado (`--preparar`). O detalhe que custou
tentativas: tem que rodar ANTES do app iniciar, porque o app salva o estado
em memória ao sair da página e desfazia o patch feito na página carregada.

---

## D066 — Balanceamento de moedas: a fonte não era onde parecia

**Data:** 2026-08-27 · sessao-088

O Davi relatou 0 → 896 moedas em 2 partidas e pediu pra dificultar, dando
carta branca ("cria o seu sistema"). Antes de mexer, medi de onde vem a
renda — e o resultado mudou o alvo do ajuste:

| Fonte | Moedas por partida |
|---|---:|
| Partida em si | 2 a 7 |
| **Baús de loot** | **96 a 257** |

O baú médio vale **321 moedas**, porque 27% dos baús sorteados são de Ouro
(650) ou Místico (1000). Ou seja: **o ganho por partida é ~3% da renda** —
mexer só nele seria cosmético.

**O que fiz** (dentro do que ele autorizou): taxa por partida 0.15 → 0.12
e teto 8 → 6; alvos das missões diárias maiores, com as recompensas
intactas. Mantive o piso de 1 moeda por partida jogada, pra quem foi mal
não sair sem nada — o pedido dele foi "um pouquinho mais difícil, sem
desanimar".

**O que NÃO fiz, de propósito:** mexer nos baús. As probabilidades e as
faixas de moedas foram especificadas por ele na Fase 6 ("números exatos que
o Davi deu", `constants/loot.js`). Mudar sem confirmar seria contrariar
especificação explícita. Levei o diagnóstico e três opções pra ele decidir
(`PENDENCIAS.md`).

**Bug achado no caminho:** o texto "Como ganhar moedas?" da Loja prometia
15 moedas/partida (0.3 × acertos) enquanto o código dava 8 (0.15 ×) desde a
v5.0. Era essa a "regra de 15 moedas" que ele queria tirar — não existia no
código, só no texto. Corrigido, com aviso no código pra manter os dois
juntos.

**Descartado por ele na mesma conversa:** dar poções (além de moedas) como
recompensa de missão. Ele levantou e desistiu — "vai dar mal rolo, deixa só
com as moedinhas mesmo".

---

## 🏁 RESET 6.0 — COMPLETO (sessões 044-050, 2026-08-16 a 2026-08-17)

Os 7 blocos planejados em `sessions/planejamento-6.0.md` foram todos entregues:
(1) Base visual, (2) Vidas diárias, (3) Progressão de tabuada, (4) Ligas, (5)
Missões, (6) Perfil completo, (7) Estatísticas. Decisões arquiteturais D020-D026
documentam o raciocínio de cada um. Próximos passos ficam a critério do Davi —
não há mais bloco planejado em aberto deste reset.
