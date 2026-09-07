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

**Data:** 2026-09-06
**Versão:** 6.0.55 (Tabuada Rush 6.0 completo + Fase 7.1 bloco 1 + catálogo de ícones (Fase 7.2) + arte nova/fundos + screenshots + FASE 7.1 concluída + zona de rebaixamento + aviso de ofensiva raro + ARQUITETURA_XP.md + FASE 0 do domínio + fix crítico do fim de partida + backlog de inovações organizado em `planos/` + moeda virou Multis (6.2) + VERSAO 6.1 CONCLUIDA (missoes na zona, tempo de partida, nomes da ofensiva) + botao de baixar a coleta da Fase 1 — sessao-101.md)

> 🗂️ **`planos/` (sessão 100)** — o documento de ~25 inovações do Davi virou
> 9 planos por versão (6.1 a 6.9), com índice em `planos/00-INDICE.md`.
> **Só a 6.1 (acabamento) e a 6.2 (identidade visual) podem rodar agora** —
> todo o resto encosta na Fase 0/1 do Domínio, seja no código (Zona 1) seja
> na *amostra* que a Fase 1 mede (Zona 2). Nada começa sem o Davi confirmar
> o escopo daquela versão.
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
**[v6.0.47]** "Trazer ofensiva de volta" agora **leva pro Rush** e
terminar a partida devolve os dias (o Davi esclareceu: a lição É o
desafio). O Seguro de Ofensiva voltou a ter só o papel de evitar a perda
automática. Ver `sessao-098.md`.
**[v6.0.46]** **Zona de rebaixamento agora PUNE** (`utils/relegation.js`,
regras num arquivo só): XP pela metade, loot a 25% da chance, missões com
alvo +50% e recompensa ×2 (o baú da missão sobe de tier junto). Painel de
aviso 1×/dia com "Ver mais" e "Não mostrar novamente" (desliga o aviso,
NÃO a penalidade). Zona vermelha na página de Ligas; a Bronze também sofre
(últimas 5 posições). Entrou também o **aviso de ofensiva perdida** e as
**30 frases da caixa de divisão** com cor por situação. Ver `sessao-097.md`
— tem uma lista do que ficou pra próxima conversa.
**[v6.0.45]** 🏁 **FASE 8 CONCLUÍDA** — último bloco foi o painel de
ofensiva (8.2): agora com TRÊS estados (acesa/congelada/APAGADA — antes
"sem ofensiva" era desenhada como congelada, o que era mentira), ícone
grande, dias maiores, o bloco vestindo a cor da situação, próxima
conquista e "Ver mais" abrindo o painel completo (calendário do mês, meta,
conquista, recorde geral). As 15 frases do Davi em
`constants/streakPhrases.js`, com a de tempo usando o tempo real até a
meia-noite e sorteio preso ao dia. O script de telas ganhou `--acao` pra
clicar antes de fotografar. Ver `sessao-096.md`.
**[v6.0.44]** **Bloco 8.1 feito**: a faixa de tabuada virou TROFÉU (20
artes, `faixa-01`…`faixa-20`) em todas as telas. A folha tinha fundo
colorido borrado e mesmo assim deu certo — recorte por NITIDEZ (gradiente
local + flood fill + só o componente do centro), não por cor de fundo.
`ofensiva-apagada` (opção A, cinza puro) instalada. Caixa de Análise
Inteligente voltou pra Arena. **Falta só o BLOCO 8.2** (painel de
ofensiva) pra fechar a FASE 8. Ver `sessao-095.md`.
**[v6.0.43]** Arena consertada no DESKTOP — ela usava a coluna estreita
(`max-w-lg`) e as duas colunas viravam tiras de uma palavra por linha;
agora usa `max-w-5xl` como as Ligas. ⚠️ **As prévias passam a ser em
desktop (1440×900)** — o formato de celular era escolha minha, nunca
pedida pelo Davi (`--mobile` pra conferir o outro). E em `?still=1` agora
ligo `MotionGlobalConfig.skipAnimations`: antes, qualquer `motion` sem
`stillInitial` saía INVISÍVEL da captura (o rodapé da Arena sumiu assim).
Ver `sessao-094.md`.
**[v6.0.42]** **Painel da Arena reescrito** (blocos 8.3/8.4/8.5): 3 modos
como assunto principal (o mais jogado numa caixa grande com "Jogar agora",
contagem vinda de `data.sessions`), caixa de divisão com legenda real da
situação e caixa de missões do dia reaproveitando o `MissionProgress`. Hub
`RewardsPage` apagado. ⚠️ **`bg-white` não serve neste projeto** — no tema
escuro vira `#25252d`; usar `bg-coin`/tokens. Faltam só 8.1 (troféus) e
8.2 (ofensiva apagada), ambos esperando arte. Ver `sessao-093.md`.
**[v6.0.41]** FASE 8 começou. **Temporada removida do jogo inteiro**
(tela, constants, XP, campos de save) a pedido do Davi. **Bloco 8.6
feito:** estrela/livro/pódio no Perfil sem bolha, escudo da liga no card
do usuário e nas conquistas de liga, cadeado novo na conquista bloqueada,
frase nova no menu. ⚠️ O hub "Recompensas" segue vivo de propósito — no
CELULAR ele é o único caminho até Missões (a sidebar é só desktop); morre
no bloco 8.4. Travados esperando arte: 8.1 (troféus com fundo branco) e
8.2 (ofensiva apagada). Ver `sessao-092.md`.
**[v6.0.40]** FASE 8 (Arena) **planejada, não implementada** — o Davi
ditou o escopo inteiro e o plano ficou em 6 blocos no `PLANO_ACAO.md`,
esperando ele confirmar. Arte nova processada (estrela, relógio, livro,
conquista bloqueada) e as 15 frases de ofensiva extraídas do PDF dele (na
mão: ASCII85+Flate + CMap ToUnicode, sem biblioteca de PDF aqui).
**2 bloqueios:** folha dos troféus veio com fundo colorido (preciso com
fundo branco) e falta o ícone de ofensiva APAGADA. Achado: são **20
faixas** de tabuada e a folha tem **20 troféus** — encaixa 1 pra 1 (o
`CLAUDE.md` dizia 28, corrigido). Ver `sessao-091.md`.
**[v6.0.39]** Vida agora é comprada UMA a UMA por 300 moedas (D068) —
`LIFE_REFILL_PRICE` (150, enchia o pote) virou `LIFE_PRICE` (300, uma
vida). Encher o pote do zero custa 1.500. Classificação das ligas ficou
compacta (gap 8→2px, avatar 40→36px, linha 58→54px), no estilo da
referência do Davi. **Próxima: FASE 8 (Arena)**, que ele vai detalhar.
**[v6.0.38]** Baús nerfados (D067) — o Davi escolheu a opção B + um
empurrãozinho de A: Ouro/Místico mais raros no sorteio (intervalo 1-80 e
1-120) e `chestPct` um degrau abaixo (22/40/65/90). Baú médio 321 → 236
moedas, renda de baú −45%. Faixas de moeda de cada baú e loot de
power-up/poção ficaram intocados de propósito. `RECURSOS.md` atualizado no
mesmo commit. **Fila limpa: a próxima é a FASE 8 (Arena)**, que ele vai
detalhar antes de eu codar.
**[v6.0.37]** Barra de missão no estilo da referência (número dentro, baú
encavalado na ponta) + 1ª rodada de balanceamento (D066). **Achado
importante:** a renda de moedas vem ~93% dos BAÚS de loot (baú médio = 321
moedas), não do ganho por partida (2 a 7) — mexi no que o Davi autorizou
(taxa 0.15→0.12, teto 8→6, alvos das diárias maiores) e deixei a decisão
dos baús pra ele em `PENDENCIAS.md`, com 3 opções. Bug corrigido: o texto
da Loja prometia 15 moedas/partida enquanto o código dava 8 desde a v5.0.
**[v6.0.36]** **FASE 7.1 CONCLUÍDA** — o último item era o baú por missão
(D065): tier pela recompensa da missão (`chestForCoins`, derivado de
`CHESTS`), fechado enquanto incompleta / ABERTO quando completa, na aba
Missões e na página 3 do resumo. Regra pros valores que caem entre faixas
(o mensal de 450): o primeiro baú cujo teto alcança. Ferramenta: o script
de telas ganhou `--preparar` pra montar estado, e `Progress` passou a
respeitar `?still=1` (a barra saía zerada nas capturas). **Próxima fase
grande: 8 — Arena**, que o Davi quer planejar antes de codar.
**[v6.0.35]** Moldura do app (barra superior + lateral) some na partida
E no resumo — o resumo faz parte da partida (D064/sessao-086). Resumo
recomposto pra ocupar a tela toda, conteúdo centralizado. Rebarba branca
dos recortes resolvida na raiz com descontaminação de cor
(`scripts/recortar-icone.py`); 3 baús abertos reprocessados. `bau-moedas`
excluído; regra confirmada: **na recompensa o baú é sempre o ABERTO**.
Dívidas de layout do menu/loja anotadas em `PENDENCIAS.md`.
**[v6.0.34]** Fundo de recompensa em TELA CHEIA (D063) — camada `fixed`
por baixo do cabeçalho, sem faixa escura sobrando; "+1000" de volta ao
amarelo da moeda; emoji 🔥 substituído pelo ícone de ofensiva no HUD de
combo, no toast de combo e no modal de meta. Com o `fundo-seguro-ofensiva`,
**os 13 recursos têm fundo próprio** — a fila de arte zerou (só resta o
opcional de regerar o combo do Seguro em resolução maior). Baú místico
aberto e ícone de XP também trocados por arte nova. Ver `sessao-085.md`.
**[v6.0.33]** **Verificação visual resolvida (D062)** — dá pra tirar
screenshot das telas do jogo agora: `node scripts/tirar-telas.mjs` (com
`npm run dev` rodando) captura via protocolo de DevTools do Chrome, no
viewport de iPhone 14 Pro. A causa do D034 era o `requestAnimationFrame`
não rodar sem janela visível, congelando o framer-motion no primeiro
quadro — resolvido pela flag `?still=1` (DEV). Também corrigidos dois
erros meus no catálogo visual (Seguro faltando na Loja, pendências
desatualizadas publicadas sem conferência). Ver `sessao-084.md`.
**[v6.0.32]** Leva de arte do Davi processada (D061) — os 4 baús agora
são FECHADOS de verdade, entraram os ícones de erro, troféu e baú vazio
(com moscas, pra página "Nada desta vez"), o combo Poção ×3 perdeu o
brilho, e cada página de recompensa ganhou **fundo próprio na cor do
recurso** (12 fundos JPEG, mapa em `rewardBackgrounds.js`, véu escuro por
cima pra legibilidade). Falta só `fundo-seguro-de-ofensiva`. Com o baú
fechado existindo, o **bloco 2 da 7.1 (baú por missão) não tem mais
impedimento**. Ver `sessao-083.md`.
**[v6.0.31]** Correção de arte (D060) — o "baú genérico" (`bau-recurso`)
era, na verdade, o combo do Seguro de Ofensiva no tier errado; a versão
certa (cristal de gelo + baú de OURO) já existia dentro da folha
`combo-grade-completa-v2.png` desde a sessão 076 e nunca tinha sido
usada. Recortada, ligada (`combo-seguro-ofensiva`), `bau-recurso`
apagado, `FALLBACK_CHEST`/`chestArt` removidos — os 9 recursos têm combo
próprio agora. Confirmado também que os 4 baús "fechados" estão todos
ABERTOS com moeda (o Davi vai gerar os fechados). Fila de arte e o
pedido de ícones de pontuação POR FAIXA (100/200/500/1000) estão em
`PENDENCIAS.md`. Ver `sessao-082.md`.
**[v6.0.30]** FASE 7.2 fechada (D059) — o catálogo de ícones que estava
só planejado desde a sessão 079 foi implementado: `ICONES.md` (61 ícones
COM IMAGEM, organizados por aba/página) + página visual publicada
(grade/busca/copiar) + `referencias/icones/` com 53 arquivos movidos do
Downloads em 9 categorias + 2 scripts que regeneram tudo e conferem que
nenhum ícone ficou de fora. Downloads foi de 149 pra 96 arquivos; nada
fora do jogo foi tocado. Próximo: bloco 2 da 7.1 (baú por missão).
Ver `sessao-081.md`.
**[v6.0.29]** Fase 7.1, bloco 1 (D058) — revisão visual do resumo
pós-partida, tudo que não dependia de arte nova do Davi: confete
removido de TODAS as páginas (ele confirmou que é geral), ícones reais
de XP e de ofensiva no lugar dos da lucide, calendário de 5 dias com os
marcadores redondos do Header (`dia-feito`/`dia-vazio`, só a letra, sem
número), caixa "Como funciona?" e caixa "Classificação" removidas, baú
de moeda agora ABERTO com o total de moedas em cima sem badge. Achado o
motivo do "bug da linha": faixa branca de 3px no próprio arquivo
`resumo-acertos.png` (resíduo de recorte) — PNG reprocessado, nenhum
outro ícone tinha o defeito. **Falta:** baú por missão (bloco 2, escolha
dele), ícone de erro e troféu (arte dele). Ver `sessao-080.md`.
**[v6.0.28]** Novo item de plano, sem código (D057) — Davi pediu um
catálogo único de ÍCONES organizado por PÁGINA/ABA do app (diferente do
`RECURSOS.md`, que organiza por tipo de recurso) — objetivo é parar de
rebaixar o mesmo tipo de ícone toda vez. Registrado como FASE 7.2 no
`PLANO_ACAO.md`, sem implementação ainda (arquivo vs. pasta física, ou
os dois, fica pra decidir na hora). Ordem: antes da Fase 8. Ver
`sessao-079.md` e D057.
**[v6.0.27]** Sessão só de documentação (D056) — Davi mandou uma revisão
visual extensa de toda a Fase 7 e avisou que o contexto da conversa
estava acabando; pediu pra documentar tudo antes de qualquer código
novo. Criados `RECURSOS.md` (catálogo dos 3 tipos de recurso) e
`sessions/sessao-078.md` (lista completa de pendências, página por
página — não implementada ainda). **Achei e corrigi o próprio erro**: o
prompt que escrevi nas sessões 075-076 pra gerar o ícone do Seguro de
Ofensiva pedia um escudo, mas o item já usa `ofensiva-congelada`
(chama azul) no código — por isso as 2 gerações falharam. Nova regra
permanente em `CLAUDE.md`: referência visual ambígua → pedir imagem
"base", Claude nomeia o arquivo. Ver `sessao-078.md` e D056.
**[v6.0.26]** Ícones combo em resolução maior (D055) — Davi gerou de
novo (2ª geração independente, arquivo bem maior). Os 8 recursos que já
tinham saído certos continuam certos, agora mais nítidos. **Seguro de
Ofensiva errou de novo, exatamente igual** — 2 gerações independentes
com o mesmo erro no mesmo item, sinal de que não é acaso (falta
referência clara dele no material anexado). Continua no fallback. Ver
`sessao-077.md` e D055.
**[v6.0.25]** Conjunto completo de ícones combo (D054) — Davi gerou a
versão com o baú variando por classificação própria (não mais Comum/
Raro/Épico da Loja): Madeira (Congelar Missão, Vida Extra), Ferro
(Largada Turbo, Poção ×1,5), Ouro (Seguro de Ofensiva, +60s, Escudo,
Poção ×2), Místico (Poção ×3, sozinha). 8 de 9 saíram certos — **Seguro
de Ofensiva não gerou** (repetiu arte antiga), continua no fallback
(`FALLBACK_CHEST`, novo, substitui o `RARITY_CHEST`/`POTION_CHEST` do
D052 que foi removido). Ver `sessao-076.md` e D054.
**[v6.0.24]** Ícones COMBO recurso+baú (D053) — TESTE, pendente de
aprovação visual do Davi. Ele baixou arte de verdade com o recurso e o
baú já fundidos numa imagem só (Vida Extra, +60s, Escudo, Largada Turbo,
Poção ×1,5/×2/×3, todos em baú DOURADO) e pediu pra testar o layout antes
de gerar o conjunto completo. Onde existe ícone combo, a página de
recompensa usa ele como imagem principal, substituindo o
recurso+baú-por-raridade separados do D052 (que vira fallback só pros 2
power-ups sem combo ainda: Seguro de Ofensiva, Congelar Missão). Ver
`sessao-075.md` e D053.
**[v6.0.23]** Baú-embalagem de recurso implementado (D052) — o baú que
"embala" um power-up/poção achado na página de recompensas agora bate
com a raridade do item (Comum→Madeira, Raro→Ferro, Épico→Místico; Ouro
fica de fora de propósito, exclusivo do baú-com-moeda), substituindo o
`bau-recurso` genérico da sessão anterior. Legenda "Encontrado em um
baú" removida. Ajuste visual: linha divisória da caixa "Resumo do dia"
(página de Missões) removida, ícones maiores. Ver `sessao-074.md` e D052.
**[v6.0.22]** Ajustes na Fase 7 a partir do feedback do Davi (D050→D051):
páginas 1/2/3/5/6 do resumo pós-partida agora aparecem em TODA partida
(antes a de XP pulava com 0, a de recompensa só existia com loot —
página nova "Nada desta vez" cobre esse caso); "resumo do dia" na página
de Missões (campos novos `localDate`/`xp` em cada `session`, aditivos);
ícones da arte do Davi (`resumo-acertos`, `bau-recurso`) usados no lugar
dos equivalentes emprestados. **Virou padrão do projeto:** item de loot
novo sempre precisa de entrada em `LOOT_GENDER` — aviso nos 3 arquivos
onde um item é criado. **Registrado como pendência (não implementado,
pedido dele):** o baú-embalagem de um recurso precisa bater com a
raridade dele (Poção ×3 → Baú Místico) — ver Fase 6 do `PLANO_ACAO.md`.
Ver `sessao-073.md` e D051.
**[v6.0.21]** Fase 7 do backlog: `ResultsPage.jsx` removida, substituída
por `PostGameSummary.jsx` — sequência de páginas (Pontuação → XP →
Missões → [Ofensiva, 1ª partida do dia] → [Meta batida] → [Faixa mudou]
→ Conquistas → 1 página por recompensa) no estilo das referências do
Davi, usando os tokens de cor já existentes do app. **Bug real corrigido
no caminho:** o XP exibido podia divergir do XP creditado (a tela antiga
recalculava com um multiplicador próprio desatualizado) — corrigido
expondo o valor único já calculado em `App.jsx`. Progresso de conquistas
extraído do próprio código de cada `check()` via regex, sem reescrever
`ACHIEVEMENTS` (cobre 25/26). Além disso: preço das 3 Poções de XP
triplicado, sistema de mascotes (Tuca/Vupt) removido por completo
(componente + ~2MB de assets), ícone de vida dentro da partida trocado
(emoji → ícone oficial). Ver `sessao-072.md` e D050.
**[v6.0.20]** Fase 6 do backlog: sistema de recompensas ao fim de cada
partida — 4 baús + 7 power-ups + 3 poções podem cair, chance ponderada
por raridade × duração REAL da partida (`utils/loot.js`,
`rollMatchLoot`). **Bug de verdade corrigido no caminho:** `timePlayed`
sempre mostrava a duração BASE do modo (cronômetro sempre termina em 0),
ignorando o bônus de tempo por combo do Rush e o +10s da Largada Turbo —
trocado por medição de relógio de parede (`Date.now()`), conserta de
graça o stat "Tempo" do resumo pós-partida também. Zen excluído do
sorteio (sem timer, virava farm parado). Card "Recompensas encontradas"
provisório no `ResultsPage.jsx` até a Fase 7 ter página própria.
**Confirmado pelo Davi:** ícone da Mochila definitivo; ícone de controle
do Menu fica pro redesenho da Arena. Ver `sessao-071.md` e D049.
**[v6.0.19]** Fase 5 do backlog: Loja deixou de mostrar sempre os mesmos 7
power-ups + 3 poções fixos — agora sorteia 1-3 itens por dia
(`utils/shop.js`, `getDailyShopStock`), determinístico pela data local
(mesmo LCG das missões), **sem precisar guardar nada no storage** — o
sorteio já muda sozinho na virada de dia. "Recuperar vidas" já era sempre
disponível fora da Loja (Header) desde sempre — nada a mudar ali. Ver
`sessao-070.md` e D048.
**[v6.0.18]** Higgsfield CLI configurado (npm global + login + skills), mas
a conta do Davi estava com **0 créditos** (plano free) — upscale via IA
bloqueado, ação financeira que só ele resolve. Ele baixou versões mais
nítidas dos 3 ícones de power-up direto, mais um controle de videogame
novo e uma mochila alternativa ("teste"), e pediu pra reaproveitar o alvo
verde (já existente) nas missões de sequência/acertos — halter removido
por ficar órfão. **Pendente:** confirmar se o ícone de mochila é
definitivo; se "ícones de controle" (plural) também deveria trocar o
`Gamepad2` do botão "Escolher Modo" no `MenuPage.jsx` (não mexido, ver
raciocínio em D047). Ver `sessao-069.md` e D047.
**[v6.0.17]** Fase 4 do backlog: recurso **Poções de XP** (`data.potions`,
separado de `powerups`) — 3 variações (x1,5/40min/100moedas,
x2/25min/250moedas, x3/15min/450moedas) que multiplicam o XP ganho
enquanto o timer estiver ativo (por TEMPO, não por 1 partida como o
antigo XP Dobrado). Timer persistente (`potionActiveUntil`, sobrevive
fechar o app), compra na Loja, ativação pela Mochila com overlay roxo de
confirmação. **Decisão sinalizada:** só 1 poção ativa por vez (bloqueia
ativar outra, não substitui/acumula) — não especificado no plano, pedir
confirmação do Davi. Ver `sessao-068.md` e D046.
**[v6.0.16]** Fase 3 do backlog: tela **Mochila** nova (menu lateral, entre Loja e
Perfil) — mostra os power-ups que o jogador TEM agora (`SHOP_ITEMS` ganhou campo
`group`: Arena/Vida/Ofensiva/Missões), sem preço nem botão de comprar (é
inventário, Loja continua sendo a vitrine). Item com estoque 0 não aparece.
Seção de Poções pronta pra Fase 4, invisível até `data.potions` existir de
verdade. Ver `sessao-067.md` e D045.
**[v6.0.15]** Ícones por TIPO de missão (não por missão individual): gamepad
(`play`), mira (`accuracy`), selo "100" (`score`) — os 3 batem exatamente com o
que o Davi já tinha nomeado ("Controle"/"Alvo") ou com o emoji já usado. Halter
foi decisão minha por eliminação pra `correct_*` (acertos acumulados) — pedir
confirmação. `streak`/`streak_month` seguem com 🔥, sem ícone novo. Confirmadas
as 2 escolhas em aberto da sessão 065 (Vida Extra dedicado; poções por formato).
Ver `sessao-066.md` e D044.
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

## 🎯 PRÓXIMA SESSÃO — FASE 7.1 DO `PLANO_ACAO.md` (Revisão visual da Fase 7)

**Ler antes de tocar em qualquer código, NESTA ORDEM:**
1. `sessions/sessao-078.md` (lista COMPLETA de pendências da Fase 7.1,
   página por página, não implementada ainda)
2. `RECURSOS.md` (catálogo de recursos por TIPO, criado na sessão 078)
3. `PLANO_ACAO.md` → seções "FASE 7.1" e "FASE 7.2" (a 7.2 é nova,
   sessão 079 — catálogo de ícones por PÁGINA, ainda não implementado)
4. `DECISIONS.md` D056-D057 (as mais recentes)

**A sessão 078 foi só documentação** (Davi mandou uma revisão visual
extensa de toda a Fase 7 e o contexto da conversa acabou no meio — ele
pediu explicitamente pra documentar tudo antes de qualquer código novo,
pra não perder nada na transição). **Nada da lista foi implementado
ainda** — comece por ela.

**Correção importante (D056):** o Seguro de Ofensiva NÃO é um escudo — é
`ofensiva-congelada` (chama azul). Erro estava no MEU prompt de geração
(sessões 075-076), não na IA. Se for gerar essa peça de novo, o prompt
certo já está em `RECURSOS.md`.

**Nova regra permanente (`CLAUDE.md`):** referência visual ambígua →
pedir ao Davi pra baixar uma imagem "base", e Claude nomeia o arquivo
(não ele) — evita a confusão de nomes que causou retrabalho nesta fase.

**Perguntar ao Davi antes de começar:** se a remoção de partículas
(`<Confetti />`) é só nas 4 páginas que ele mencionou ou em todas as
páginas do resumo pós-partida (ver `sessao-078.md`).

**Fases 0-7 concluídas** (sessões 064-079; sessão 069 foi um ajuste de
arte fora da sequência das Fases, ícones + alvo verde nas missões, pedido
direto do Davi; sessões 073-079 foram ajustes/revisão sobre a Fase 7, não
fase nova). `PLANO_ACAO.md` é a lista de verdade; não duplicar o backlog
aqui.

**Depois da Fase 7.1: Fase 7.2** (catálogo único de ícones por página/
aba do app, complementar ao `RECURSOS.md` — arquivo e/ou pasta física
organizada, decisão de implementação em aberto) — Davi quer isso pronto
antes de ir pra Fase 8, porque tem "algumas inovações" ligadas a ícones
pra Arena que dependem dessa organização vir primeiro.

**Depois da Fase 7.2 resolvida: Fase 8 (painel central da Arena)** —
Davi pediu explicitamente pra **começar perguntando o que ele quer**, não
propor design pronto (mesma lição das sessões 055-058 com a tela de
Ligas).

**Pendência de organização (sem prazo):** criar pasta e organizar as
dezenas de imagens de referência acumuladas no Downloads.

**Pendente de verificação real (D034, sempre a mesma limitação):** Fase 7
inteira só foi testada via ferramentas de DEV (`?screen=results&full=1`),
nunca numa partida jogada de verdade — pedir ao Davi pra jogar e conferir.

**Pendente de confirmação em ambiente real (D049):** o loot da Fase 6 foi
verificado por simulação em Node + revisão de código, mas não por
playthrough de ponta a ponta neste ambiente (Browser pane não completa a
transição pro GamePage, D034) — pedir ao Davi pra jogar uma partida de
verdade e conferir se as recompensas aparecem certas no resumo.

**Próxima: Fase 5 (loja com estoque rotativo diário)** — sorteio de 1-3
itens por dia, atualiza à meia-noite local (reaproveitar `localDateStr()`,
NÃO usar `toISOString()`, D040), "Recuperar vidas" sempre garantido fora
do sorteio. Depois: Fase 6 (baús) → Fase 7 (resumo pós-partida) → painel
da Arena (NÃO mexer antes de fechar o resto).

**Ideias soltas no meio do caminho (ex.: animação nas telas finais) vão
pra `PENDENCIAS.md`, não pro meio da fase atual.**

**Pendente de confirmação do Davi (D046):** regra de só 1 poção de XP
ativa por vez (bloqueia ativar outra em vez de substituir/acumular) —
decisão minha não especificada no plano original.

**Pendente de olhada do Davi:** se o layout/agrupamento da Mochila (sessão
067) e a tela de ativação de poção (sessão 068) ficaram do jeito que ele
imaginou — nunca vistas rodando de verdade neste ambiente (mesma
limitação de sempre, D034).

**Pendente de confirmação (D044):** ícone do halter pra `correct_*`
(acertos acumulados nas missões) — única escolha da leva de ícones sem
nome explícito dele.

**Em aberto, ainda sem resposta do Davi:**
- Ícone de ofensiva usado também em "Melhor Sequência" (D038) — confunde?
- Estilo dos ícones futuros: chapado tipo Duolingo (D041) ou 3D/gradiente
  como os que já existem (moeda, baú)?
- Fase 6 (baús como recompensa aleatória por tempo de jogo) tem cara de
  mecânica de loot/gacha — vale mencionar a guarda de escopo do projeto
  (mecânica de "vício" desconectada do aprendizado) quando chegar a vez.

**Lições de método que valem pra arte (D037/D039-D041/D043-D045):**
conferir PNG com transparência SEMPRE composto sobre o fundo escuro real
do app. Mapear por CAMPO/TIPO em vez de por item individual sempre que o
dado já tiver essa estrutura — generaliza sozinho pra itens novos.

**Checagem de processo (D042):** antes de encerrar qualquer sessão,
conferir que a `Versão` no topo deste arquivo bate com a última entrada do
`CHANGELOG.md`. Se não bater, a rotina de fim de bloco (`CLAUDE.md`) não
foi cumprida.

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
| `src/pages/PostGameSummary.jsx` | [v6.0.21 · Fase 7] Sequência de páginas de resumo pós-partida — substitui `ResultsPage.jsx` (removida) |
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
5. `sessions/sessao-079.md` — última sessão → `sessions/sessao-078.md` (lista de pendências da Fase 7.1, não implementada) → `sessions/sessao-077.md`
6. `DECISIONS.md` D020-D057 (reset 6.0 + limpeza + recalibração + Ligas/Header + processo + backlog) — D015-D019 (5.0) são história, não aplicam mais
7. `RECURSOS.md` — catálogo de recursos (baús/power-ups/poções), criado sessão 078
8. `BUGS.md` — problemas ativos

**Supabase não configurado:** App funciona 100% com localStorage.
Para ativar cloud: criar `.env` com `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY`
e executar o SQL de `SUPABASE_SETUP.md`.
