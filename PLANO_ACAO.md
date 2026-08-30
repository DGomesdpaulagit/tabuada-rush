# 📋 PLANO_ACAO.md — Backlog vivo do Tabuada Rush

> **Este arquivo é a fonte de verdade do que fazer.** Criado na sessão 064 a
> pedido do Davi, depois de um backlog grande chegar de uma vez. Regra:
> **nenhuma fase começa sem ele confirmar o escopo dela primeiro** — ele
> quer ir "selecionando e fazendo" por partes, não tudo de uma vez.
>
> Como usar: marcar `[x]` quando um item termina de verdade (testado, não
> só codado). Ideia nova que surgir no meio de uma fase e não pertence a
> ela → `PENDENCIAS.md`, não aqui no meio. Ao fechar uma fase, seguir a
> rotina de `CLAUDE.md` (registro completo) antes de abrir a próxima.

---

## ✅ Conflitos resolvidos (respondidos pelo Davi na sessão 065)

1. **XP Dobrado — CONFIRMADO remover de verdade.** Inclusive da tabela de
   drop de power-ups (Fase 6) e da categorização da Mochila (Fase 3). Não
   é resíduo de rascunho — é pra sumir do jogo inteiro.
2. **Calendário de 5 dias na página 4 do resumo (Fase 7) — CONFIRMADO
   que é diferente** do calendário semanal do Header. Davi vai mandar a
   imagem de referência **quando chegar a vez dessa fase** — não bloqueia
   nada antes disso.
3. **"Partida" nas probabilidades por tempo (Fase 6) — RESOLVIDO.** Davi
   lembrou um detalhe que muda a implementação: o Rush tem bônus de tempo
   por combo (`bonusTime`, +3s por acerto) — um jogador craque emendando
   combos pode esticar uma única partida bem além dos "30s base". Ou seja,
   **não dá pra assumir a duração pelo modo** (ex.: "Rush = sempre curto").
   A regra tem que usar a **duração REAL da partida que acabou de
   terminar** (do início ao fim, incluindo todo o tempo ganho por combo),
   não uma suposição por modo de jogo. Implementação: medir o tempo
   decorrido de verdade em `GamePage`/`handleGameEnd` (o cronômetro já
   existe pro HUD) e usar esse valor pra escolher a faixa da tabela
   (1-5min / 6-20min / 25-50min / ~1h) na hora de rolar os drops.

---

## FASE 0 — Higiene de registro ✅ CONCLUÍDA (sessão 064)

- [x] Diagnosticado: sessão 063 (cards da Loja + guia Duolingo) tinha
      commit e CHANGELOG, mas faltava `sessions/sessao-063.md` e
      `MEMORY_CORE.md`/`MEMORY.md` desatualizados
- [x] `sessions/sessao-063.md` escrito retroativamente
- [x] D041 (guia de estilo Duolingo, paleta completa) e D042 (correção de
      processo) registrados em `DECISIONS.md`
- [x] `MEMORY_CORE.md`/`MEMORY.md` atualizados pra 6.0.13
- [x] `CLAUDE.md` ganhou checagem de auto-verificação (versão bate com
      CHANGELOG) + instrução de ler este arquivo antes de codar
- [x] Este arquivo (`PLANO_ACAO.md`) e `PENDENCIAS.md` criados

---

## FASE 1 — Troca de ícones simples (baixo risco, sem mudança de mecânica)

Regra geral pra toda a fase (pedido explícito): sempre que o novo ícone
existir, troca e **apaga o arquivo antigo** — não deixa duplicado. Não
mexe em mais nada da tela além do ícone.

### 1.1 — Power-ups (substituir + apagar o antigo) ✅ CONCLUÍDA (sessão 065)
- [x] **Vidas** — trocado (`vidas.png`)
- [x] **Vida Extra** (power-up) — **não usa o mesmo ícone de vidas**: o
      Davi baixou um arquivo dedicado (`pu-vida-extra`, coração+cruz),
      mais específico que a instrução escrita. **Confirmado por ele** na
      sessão 066 (ver D043/sessao-065)
- [x] **Congelar Missão** — trocado (`pu-congelar.png`)
- [x] **Largada Turbo** — trocado (`pu-largada.png`)
- [x] **Escudo** — sem arquivo novo nesta leva, mantido `pu-escudo.png`
- [x] **+60s no relógio** — trocado (`pu-tempo.png`)
- [x] **Ofensiva** — trocado o estado "acesa" (`ofensiva.png`); a
      "congelada" não teve arquivo novo desta vez, mantida (sessão 061)

### 1.2 — Ícones de categoria de missão ✅ CONCLUÍDA (sessão 066)
- [x] **Missões mensais** — calendário, trocado (`missao-mensal`)
- [x] **Missões diárias** — sol, trocado (`missao-diaria`)
- [x] **Ícone "Controle"** (gamepad) — `type: 'play'` (jogue N partidas) —
      trocado (sessão 066)
- [x] **Ícone "Alvo"** (mira) — `type: 'accuracy'` (precisão %) — trocado
      (sessão 066)
- [x] **Ícone do halter** — mapeado pra `type: 'correct_single/day/month'`
      (acertos acumulados) — não foi nomeado explicitamente pelo Davi,
      escolha minha por eliminação (era o tipo que sobrava sem ícone
      correspondente óbvio) — **confirmar se combina**
- [x] **Ícone "100"** — `type: 'score'` (pontuação) — trocado, match direto
      com o emoji 💯 que já era usado (sessão 066)
- [ ] **`type: 'streak'`/`'streak_month'`** (sequência de acertos / dias de
      ofensiva no mês) — sem ícone novo ainda, continua com 🔥. Fica pra
      quando/se o Davi mandar um

### 1.3 — Ícones de telas novas ✅ REGISTRADOS (sessão 065, telas ainda não existem)
- [x] `mochila` registrado em `GameIcon.jsx`
- [x] `pocao-xp-1/2/3` registrados — fatiados de uma folha vertical sem
      diferenciação de cor entre tiers; mapeados por FORMATO (tubo=x1,5,
      erlenmeyer=x2, redonda=x3) — **confirmado por ele** na sessão 066
- [x] `bau-madeira/ferro/ouro/mistico` registrados — ordem da folha bateu
      com os 4 tiers da Fase 6 (madeira→místico)
- [ ] `icone_de_acertos-missões-tela_resumo_da_tarefa.png` — ainda não
      processado, fica pra quando a Fase 7 começar

**Varredura de duplicado:** feita durante a Fase 2 (ícone "Congelar" nos
botões de missão também trocado de `Snowflake`/lucide pra mesma arte da
Loja — consistência entre os dois lugares).

---

## FASE 2 — Remoções e correção de regra ✅ CONCLUÍDA (sessão 065)

- [x] **XP Dobrado removido por completo** — `SHOP_ITEMS`, cálculo de XP
      em `App.jsx`, badge do HUD (`GamePage.jsx`), banner/label do
      `ResultsPage.jsx`. Confirmado 0 ocorrências de `xp2`/`XP Dobrado`
      sobrando fora de comentários explicativos
- [x] **Regra nova do botão Congelar Missão**: antes o botão mostrava preço
      e tinha fallback de comprar na hora por moeda. Agora **só aparece se
      `powerups.missionFreeze > 0`** — sem preço nenhum mostrado nele. Sem
      o item, não aparece nada (o jogador consegue o item na Loja ou
      achando em partida, ver Fases 5/6). Testado nos dois sentidos.
- [x] Confirmado: "congelar" continua valendo pra desafios **mensais já
      aceitos** (mesma regra, dois lugares — diária e mensal aceito)

---

## FASE 3 — Mochila (tela nova) ✅ CONCLUÍDA (sessão 067)

- [x] Nova tela "Mochila" — acesso pelo **menu lateral** (confirmado pelo
      Davi), entre Loja e Perfil
- [x] Mostra os recursos que o jogador tem AGORA (`data.powerups`),
      agrupados por categoria via campo `group` novo em `SHOP_ITEMS`:
    - Arena: +60s no relógio, Escudo, Largada Turbo
    - Vida: Vida Extra
    - Ofensiva: Seguro de Ofensiva
    - Missões: Congelar Missão
  - **Poções**: seção só aparece quando existir alguma no estoque —
    `data.potions` ainda não existe de verdade (Fase 4), fica pronta pra
    quando existir
- [x] Cada item mostra a quantidade em estoque (mesmo padrão de badge
      arredondado da Loja); item com estoque 0 **não aparece** (mochila é
      inventário do que você tem, não catálogo do que existe)
- [x] Estado vazio ("Sua mochila está vazia") quando não tem nada de
      nenhum grupo

---

## FASE 4 — Poções de XP (recurso novo) ✅ CONCLUÍDA (sessão 068)

- [x] Novo tipo de recurso `potions` no storage (separado de `powerups`)
- [x] 3 variações, com multiplicador + duração MÁXIMA + preço mínimo na loja:

| Variação | Multiplicador | Duração máxima | Preço mínimo na loja |
|---|---|---|---|
| x1,5 | ×1.5 XP | 40 min | 100 moedas |
| x2 | ×2 XP | 25 min | 250 moedas |
| x3 | ×3 XP | 15 min | 450 moedas |

- [x] Efeito: multiplica o XP ganho enquanto o timer da poção estiver
      ativo (diferente do antigo XP Dobrado, que valia só pra 1 partida —
      poção é por TEMPO, pode cobrir várias partidas ou nenhuma, dependendo
      de quanto o jogador joga naquela janela)
- [x] Precisa de um timer/expiração persistente (guardar `potionActiveUntil`
      + qual variação, sobrevive a fechar o app)
- [x] Tela de ativação nas cores roxas que ele mostrou de referência
      (cards "x2 / x3 / x1,5" com botão "Continuar")

**Acesso/compra:** como as Fases 5 (loja rotativa) e 6 (baús) ainda não
existem, as 3 poções entraram na `ShopPage.jsx` atual pelo preço mínimo
fixo — não antecipa o design da Fase 5, só dá um caminho de aquisição
real e testável agora. Ativação é sempre pela Mochila, nunca pela Loja.

**Decisão sinalizada pro Davi confirmar:** só 1 poção ativa por vez —
ativar uma nova enquanto já tem outra rodando é **bloqueado** (botão
"Ativar" desabilitado), não some/substitui. Não foi especificado no
plano; das 3 opções (bloquear/acumular/substituir), bloquear foi a única
que não inventa regra de balanceamento nenhuma. Ver D046.

---

## FASE 5 — Loja com estoque rotativo diário ✅ CONCLUÍDA (sessão 070)

- [x] Loja deixa de mostrar sempre os mesmos itens fixos — vira um sorteio
      diário: 1, 2 ou 3 itens (power-ups/poções), sem ordem fixa
- [x] Atualiza à **meia-noite local** — reaproveitou `todayStr()`
      (`utils/index.js`, D040, já resolve fuso horário corretamente, não
      usa `toISOString()`)
- [x] **Regra fixa, nunca sorteada:** "Recuperar vidas" (o refil do pote
      diário que já existe, `LIFE_REFILL_PRICE`) sempre disponível — já
      era assim (mecanismo do Header, fora da Loja), regra já satisfeita
      sem precisar duplicar nada
- [x] Recursos que não saíram no sorteio do dia só ficam acessíveis achando
      em partida (Fase 6) — Loja deixou de ser a única fonte de todo item

**Implementação:** sorteio 100% determinístico por data (mesmo padrão LCG
das missões), sem precisar guardar nada novo no storage — `todayStr()`
muda, o resultado muda sozinho. Ver `sessions/sessao-070.md` e D048.

---

## FASE 6 — Baús e recompensas por partida (loot ao terminar de jogar) ✅ CONCLUÍDA (sessão 071)

⚠️ Ver conflito #3 acima — RESOLVIDO: duração real medida por relógio de
parede (`matchStartRef`/`Date.now()` no `GamePage.jsx`), não mais
`cfg.timer - state.time` (que ignorava bônus de tempo por combo/Largada
Turbo — bug real corrigido nesta sessão, de quebra também acertou o stat
"Tempo" do ResultsPage que tinha o mesmo problema).

### Baús (moedas de graça)
| Baú | Intervalo médio | Recompensa |
|---|---|---|
| Madeira | a cada 3-10 partidas | 10-100 moedas |
| Ferro | a cada 1-25 partidas | 200-400 moedas |
| Ouro | a cada 1-40 partidas | 500-800 moedas |
| Místico | a cada 1-50 partidas | 1000 moedas fixo |

### Power-ups como drop (intervalo médio de partidas)
| Power-up | Raridade | Intervalo médio |
|---|---|---|
| Seguro de Ofensiva | Raro 🔵 | 1-15 |
| Congelar Missão | Comum ⚪ | 1-5 |
| Vida Extra | Comum ⚪ | 1-7 |
| +60s no relógio | Raro 🔵 | 1-10 |
| Escudo | Raro 🔵 | 1-10 |
| Largada Turbo | Comum ⚪ | 1-6 |

*(XP Dobrado fora da lista — removido na Fase 2, ver conflito #1)*

### Poções como drop
| Poção | Intervalo médio |
|---|---|
| x1,5 | 4-10 |
| x2 | 5-15 |
| x3 | 1-15 |

### Modificador por tempo de jogo (multiplica a chance de qualquer drop acima)
| Duração da "partida" | Chance de Baú | Chance de Power-up | Chance de Poção |
|---|---|---|---|
| 1-5 min | 30% | 60% | 50% |
| 6-20 min | 50% | 90% | 70% |
| 25-50 min | 80% | 100% | 95% |
| ~1 hora | 100% | +100% (garantido, pode ser múltiplo?) | +100% |

- [x] Definir o que conta como "partida" pra essa tabela (conflito #3)
- [x] Implementar RNG ponderado (intervalo médio → chance por partida,
      não um contador fixo — "essas probabilidades são uma média", ele foi
      explícito que pode vir na 1ª partida do dia por sorte, raro mas
      possível)
- [x] Guardar o que foi achado numa partida pra mostrar na Fase 7 (página 6)
      — implementado como página dedicada (uma por item achado) desde que
      a Fase 7 saiu, sessão 072

**Implementação e decisões sinalizadas:** ver `sessions/sessao-071.md` e
D049 — RNG por peso (1/intervalo médio), leitura do "garantido, pode ser
múltiplo" pro topo da tabela de tempo, e exclusão do modo Zen do sorteio
(sem timer, dava pra farmar loot só deixando rodando parado).

### ✅ Baú como EMBALAGEM de recurso — IMPLEMENTADO (sessão 074, D052)

Davi esclareceu (sessão 073) que a tabela de frequência de baús acima
**vale só pra baú COM MOEDA** — o baú tem dois usos diferentes:

1. **Baú com moeda** — 4 tiers, cada um com sua própria frequência e
   faixa de moedas (`CHESTS` em `constants/loot.js`).
2. **Baú como embalagem de um recurso** (power-up ou poção) — sem
   frequência própria (quem é sorteado é o RECURSO); o baú que aparece
   "por baixo" dele na página de recompensas (Fase 7, página 6) precisa
   **bater com a patente/raridade do recurso**. Exemplo do Davi: Poção ×3
   (a mais rara) → Baú Místico, nunca Madeira.

**Implementado (sessão 074):** `RARITY_CHEST`/`POTION_CHEST` em
`PostGameSummary.jsx` — Comum→Madeira, Raro→Ferro, Épico→Místico (Baú de
Ouro ficou de fora do mapeamento, de propósito — só 3 níveis de raridade
existem hoje contra 4 tiers de baú, e o único exemplo dado foi
topo-com-topo; Ouro continua exclusivo do baú-com-moeda). **Sinalizado,
não formalmente confirmado** — só o ponto do topo veio dele de verdade,
o resto (Comum→Madeira, Raro→Ferro) foi inferência minha. Ver D052.

---

## FASE 7 — Páginas de resumo pós-partida (fluxo novo no fim de cada tarefa) ✅ CONCLUÍDA (sessão 072, ajustada na 073)

Substituiu a `ResultsPage.jsx` (removida) por `PostGameSummary.jsx`, um
fluxo de várias telas em sequência.

**Regra confirmada (sessão 073):** páginas 1/2/3/5/6 aparecem em TODA
partida, mesmo sem conteúdo (XP=0 no Zen mostra "0 XP"; sem recompensa
mostra uma página "Nada desta vez") — só a página 4 (Ofensiva) e as 2
ocasionais são de verdade condicionais.

- [x] **Página 1** — Pontuação + Acertos e Erros (ícone `resumo-acertos`,
      arte do Davi, sessão 073)
- [x] **Página 2** — Total de XP ganho na partida + % de acerto da partida
- [x] **Página 3** — Progresso de missões diárias/mensais. Mensais: só as
      que o jogador já aceitou. **"Resumo do dia" adicionado na sessão
      073** — soma as sessões de hoje (`session.localDate`, campo novo
      que evita o bug de fuso do D040); só fica completo pra partidas
      jogadas a partir de agora, sessões salvas antes não tinham esse
      campo
- [x] **Página 4** — Ofensiva: ícone + calendário de 5 dias (ontem, hoje,
      +3 seguintes), só aparece na 1ª partida do dia
- [x] **Página ocasional 1** — meta de ofensiva batida + sugestão de nova
      meta (usa `STREAK_GOALS` de verdade, não os números da imagem)
- [x] **Página ocasional 2** — mudança de faixa de tabuada
- [x] **Página 5** — Conquistas: progresso numérico extraído do próprio
      `check()` de cada conquista via regex — cobre 25/26 (as 9 de "chegar
      numa liga X" não têm progresso numérico, só bloqueada/desbloqueada)
- [x] **Página 6** — 1 página POR item de recompensa achado (baú/
      power-up/poção), não agrupado — ícone+nome("Você ganhou um(a)...")+
      descrição+classificação. **Aparece mesmo sem loot** (sessão 073) —
      página "Nada desta vez" quando não achou nada na partida

**Ícones da arte do Davi usados desde a sessão 073:** `resumo-acertos`
(alvo verde, páginas 1/2/3) e `bau-recurso` (baú genérico de decoração,
página 6) — substituíram os equivalentes da lucide/ícone existente que a
sessão 072 tinha usado por não ter achado os arquivos certos no Downloads.

**Verificado só via ferramentas de DEV** (`?screen=results&full=1&page=N`)
— nunca visto rodando numa partida real neste ambiente (D034). Ver
`sessions/sessao-072.md`/`sessao-073.md` e D050/D051 pras decisões
sinalizadas (baú decorativo sob recompensa não-baú, ainda sem raridade —
ver pendência na Fase 6 acima; gênero gramatical, ver checklist em
`constants/shop.js`/`constants/loot.js`).

---

## FASE 7.1 — Revisão visual completa da Fase 7 ✅ CONCLUÍDA (sessões 080-087)

Davi revisou cada página do resumo pós-partida depois de ver os ícones
combo rodando e mandou uma lista extensa de ajustes. **Lista completa,
página por página, está em `sessions/sessao-078.md`** — não duplicada
aqui de propósito (uma fonte de verdade só). Resumo do que tem lá:

- [x] Remover partículas/confete (`<Confetti />`) — **de TODAS as
      páginas** (ele confirmou na sessão 080 que é geral)
- [x] Corrigir bug de linha + remover fundo colorido do ícone de Acertos
      (página 1 e no "Resumo do dia" da página de Missões) — a "linha"
      era uma faixa branca de 3px dentro do próprio PNG, reprocessado
- [x] Trocar ícone da página 2 (XP) pelo ícone de XP real, sem partículas
- [x] **Baú por missão (página 3 + aba Missões)** — feito na sessão 087.
      Tier pela recompensa de cada missão (`chestForCoins`, deriva de
      `CHESTS`), fechado enquanto incompleta / aberto quando completa.
      Vale pras diárias e pros desafios mensais aceitos. Ver D065 pra
      regra dos valores que caem entre duas faixas (o mensal de 450)
- [x] Trocar ícone de ofensiva (chama+partículas) pelo ícone real —
      página 4 e página ocasional "meta batida" (inclusive o emoji 🔥)
- [x] Calendário de 5 dias (página 4): agora usa os marcadores redondos
      do Header (`dia-feito`/`dia-vazio`), só a letra, sem número; caixa
      "Como funciona" removida — não precisou da imagem de referência,
      o padrão já existia implementado no Header
- [x] Trocar ícone de Conquistas pelo troféu — **feito na sessão 083**,
      com a arte dele; trocado também nas duas aparições da página 1
- [x] Ícone de **Erro** da página 1 — **feito na sessão 083**
      (`resumo-erros`, par do `resumo-acertos`)
- [x] **Extra da sessão 083, não estava na lista:** cada página de
      recompensa ganhou FUNDO próprio na cor do recurso (12 fundos), o
      baú da página "Nada desta vez" virou arte dedicada (baú vazio com
      moscas) e os 4 baús "fechados" viraram fechados de verdade
- [x] Página 6: caixa "Classificação" removida; ordem já estava certa
      (baú de moeda primeiro); baú de moeda ABERTO com moedas visíveis +
      ícone de moeda e total em cima, sem caixa decorativa ao redor

**Correção registrada (D056):** Seguro de Ofensiva NÃO é um escudo — é
`ofensiva-congelada` (chama azul). Erro estava no prompt que eu escrevi
(sessões 075-076), não na geração em si. Ver `RECURSOS.md`.

**Novo processo de trabalho (regra permanente a partir daqui):** quando
uma feature visual depender de referência ambígua, pedir ao Davi pra
baixar uma imagem "base" — e **Claude nomeia o arquivo**, não ele, pra
facilitar localizar depois.

---

## FASE 7.2 — Catálogo único de ícones + organização do Downloads ✅ CONCLUÍDA (sessão 081)

Pedido novo do Davi: um documento/organização própria só pra ÍCONES —
**diferente do `RECURSOS.md`** (que cataloga por TIPO de recurso — baú/
power-up/poção). Este aqui organiza por **ABA/PÁGINA do app** (Menu,
Loja, Missões, Ligas, Perfil, Mochila, resumo pós-partida, etc.) — pra
saber de bater o olho quais ícones cada tela usa, sem precisar caçar em
`GameIcon.jsx` toda vez.

**Objetivo prático dele:** parar de precisar baixar o mesmo tipo de
ícone do zero toda vez — ter um lugar único (arquivo e/ou pasta) onde os
ícones já vão sendo guardados/catalogados conforme entram no jogo, fácil
de visualizar e de continuar adicionando.

**RESOLVIDO na sessão 081 — ele escolheu OS DOIS (ver D059):**
- [x] `ICONES.md` (raiz/vault) — os 61 ícones com IMAGEM, organizados por
      aba/página, mais o fluxo de como adicionar um ícone novo
- [x] Página visual publicada (grade + busca + clique-pra-copiar):
      https://claude.ai/code/artifact/698e1a4e-0a05-4532-a4dc-6739303d01b5
- [x] `referencias/icones/<categoria>/` — 53 arquivos MOVIDOS do Downloads,
      renomeados, em 9 categorias (Downloads foi de 149 pra 96 arquivos;
      nada que não fosse do jogo foi tocado)
- [x] `scripts/gerar-icones-md.py` + `scripts/gerar-catalogo-icones.py` —
      regeneram os dois catálogos, conferindo que nenhum ícone ficou de
      fora nem sobrou citado sem existir

**Observação do Davi sobre o Explorer do Windows:** ele notou que
"Este Computador → Downloads" às vezes mostra arquivo que não aparece em
"Acesso Rápido → Downloads" (são visões diferentes da mesma pasta no
Explorer — Acesso Rápido é atalho/lista fixada, pode ficar dessincronizado).
**Não é um problema que eu preciso resolver no Windows** — meus scans já
vão direto no caminho real da pasta (`C:/Users/HP/Downloads`), então
pegam todo arquivo que existe de verdade, independente do que uma
visão específica do Explorer mostra. Só registrando aqui pra não
esquecer o contexto de por que ele mencionou isso.

**Ordem:** Davi quer isso feito **antes** das próximas inovações que ele
tem em mente pra Fase 8 (Arena) — ele mencionou que vai ter "algumas
inovações" ligadas a ícones que dependem dessa organização estar pronta
primeiro. Não implementar a Fase 8 sem essa organização passar por aqui
antes.

---

## FASE 8 — Arena: Header, painel de início e edições gerais ✅ CONCLUÍDA (sessões 092-096)

**Escopo ditado pelo Davi na sessão 091.** Ele descreveu tudo de uma vez;
o plano abaixo quebra em 5 blocos que podem ser feitos e conferidos um a
um. **Nada começa sem ele confirmar este plano.**

Referência visual: prints do Duolingo que ele anexou (painel de ofensiva,
calendário mensal, meta de ofensiva, caixa de divisão) + o artigo do
Duolingo sobre a reforma das abas — a ideia que importa de lá: *consistência
equilibrada com propósito, simplicidade equilibrada com clareza*. Cabeçalho
com tamanho escalonado por finalidade, tipografia com poucos estilos, e
espaço em branco em vez de caixa em volta de tudo.

---

### BLOCO 8.1 — Faixa de tabuada vira troféu ✅ CONCLUÍDO (sessão 095)

Hoje cada uma das **20 faixas** (`TABUADA_TIER_RANGES`) tem um emoji de
badge (🌱📚✏️…). Passa a ter **troféu de verdade** — a folha do Davi tem
exatamente **20 troféus**, um por faixa, na ordem simples → elaborado.

- [ ] Recortar os 20 troféus (`faixa-01` … `faixa-20`) e registrar
- [ ] Trocar `TIER_BADGES` (emoji) pelo nome do troféu; `LEVELS[i].badge`
      passa a ser um `GameIcon`
- [ ] Aplicar em todos os lugares que mostram o badge: Header, Perfil,
      Catálogo, Configurações, Loja e resumo pós-partida
- [ ] **Página ocasional 2** (mudança de faixa) mostra o troféu da faixa
      que ele acabou de concluir — é o momento de "ganhar" o troféu.
      Sem fundo atrás do troféu (pedido explícito)

**🔴 BLOQUEIO:** a folha que chegou (`trofeus-faixas-folha.png`) tem
**fundo colorido borrado**, não o branco da imagem que ele colou no chat.
Fundo colorido em volta de arte colorida é o pior caso possível pro recorte
(D064) — vai deixar rebarba em todos. **Preciso da mesma folha com fundo
branco ou transparente.** Nome do arquivo: `trofeus_faixas_fundo_branco.png`

---

### BLOCO 8.2 — Painel de ofensiva do Header ✅ CONCLUÍDO (sessão 096)

- [ ] **Ícone de ofensiva grande**, em 3 estados: **apagado** (cinza),
      **aceso** (laranja) e **congelado** (azul)
- [ ] **Caixas dos dias** maiores e mais juntas, com a cor acompanhando a
      situação: laranja quando acesa, neutra quando apagada, azul quando
      congelada
- [ ] **Recorde sai do painel** (passa a viver só no Perfil). No lugar,
      uma **legenda aleatória** conforme a situação — as 15 frases do PDF
      dele (5 por estado) já estão extraídas e vão pra
      `constants/streakPhrases.js`
- [ ] **Próxima conquista de ofensiva** logo abaixo (ele já avisou que os
      ícones de conquista vêm depois, junto com o "bloqueada" que já chegou)
- [ ] Botão **"Ver mais"** abre o painel completo de ofensiva com:
      quantidade atual · ícone do estado · legenda · **calendário mensal** ·
      **meta de ofensiva** · caixa de conquista · **recorde geral**

**🔴 BLOQUEIO:** falta o **ícone de ofensiva APAGADA** (cinza).
Nome do arquivo: `ofensiva_apagada.png`. *(Alternativa se ele preferir: eu
gero uma versão dessaturada da acesa — fica aceitável, mas perde o
capricho das outras três.)*

**As 15 frases (extraídas do PDF dele):**

| Estado | Frases |
|---|---|
| **Acesa** | Hoje você aumentou sua ofensiva! · Mais um dia na ofensiva! · Sua ofensiva continua firme! · Boa! Você manteve sua ofensiva acesa! · Ofensiva aumentando! Continue assim! |
| **Apagada** | Duas horas para sua ofensiva zerar! · Sua ofensiva está por um fio! · Corre! Sua ofensiva está quase acabando! · O tempo está passando... não deixe sua ofensiva zerar! · Sua ofensiva precisa de você! |
| **Congelada** | Você deixou sua ofensiva congelar! · Sua ofensiva entrou no modo congelado! · Ops! Sua ofensiva ficou congelada! · Sua ofensiva está congelada. Hora de descongelar! · O gelo tomou conta da sua ofensiva! |

**❓ Pergunta:** a frase *"Duas horas para sua ofensiva zerar!"* fala de
tempo. Deixo o texto fixo ou troco pelo tempo real que falta até a
meia-noite ("Faltam 4 horas para sua ofensiva zerar!")? Acho o dinâmico
melhor — mas é mudar a frase dele, então pergunto.

---

### BLOCO 8.3 — Caixa de divisão sai do centro e vai pro canto direito ✅ CONCLUÍDO (sessão 093)

- [ ] Caixa própria no canto direito com: **"Sua posição"** (posição
      atual) · **legenda da situação** ("5 posições acima da zona de
      rebaixamento!") · **ícone da divisão** · botão **"Ver divisão"** no
      canto superior direito da caixa

---

### BLOCO 8.4 — Caixa de missões do dia ✅ CONCLUÍDO (sessão 093)

- [ ] Só as **diárias**, com a barra de progresso e os baús
      fechado/aberto que já existem (sessões 087-088)
- [ ] Botão **"Ver todas"** no canto superior direito da caixa

---

### BLOCO 8.5 — Painel central: os 3 modos mais jogados ✅ CONCLUÍDO (sessão 093)

Sai o resumo de dados do usuário (divisão, ofensiva etc. — que agora
moram no Header e nas caixas laterais) e entram os modos:

- [ ] **Caixa grande** = modo mais jogado: nome, descrição e botão
      **"Jogar agora"**
- [ ] **Duas caixas menores** = 2º e 3º mais jogados: nome e descrição
- [ ] **Sem rótulo** dizendo que são os mais jogados (pedido dele)
- [ ] Quem nunca jogou vê os **modos principais** do jogo
- [ ] **Remover** a caixa "X fatos prestes a serem esquecidos / toque para
      revisar agora"
- [ ] **Manter** o botão "Modos de jogo"; **remover** o botão "Recompensas"
      — ⚠️ só dá pra remover DEPOIS do 8.4: hoje o hub é o único caminho
      até Missões no celular (a barra lateral é `hidden lg:flex`)
- [ ] Reorganizar a página com o que sobrou

**Dado que isso precisa:** hoje `modesPlayed` guarda só QUAIS modos foram
jogados, sem contagem. Mas `data.sessions` guarda o `mode` de cada
partida — dá pra contar de lá, sem precisar de campo novo nem migração.

**❓ Pergunta:** tirando o botão "Recompensas" do menu, a tela
`RewardsPage` fica sem porta de entrada. Apago a tela junto ou deixo ela
existindo, acessível por outro caminho (Perfil, por exemplo)?

---

### BLOCO 8.6 — Edições gerais ✅ CONCLUÍDO (sessão 092)

- [ ] **Estrela** (`conquista-estrela`) em Perfil → Conquistas
- [ ] **Ícones das ligas** também em Conquistas
- [ ] **Livro** (`catalogo-livro`) em Perfil → Catálogo
- [ ] Atualizar os ícones da **caixa de usuário** do Perfil
- [ ] Frase abaixo de TABUADA RUSH →
      **"Memorize a tabuada. Domine a multiplicação."**

*(`conquista-estrela`, `conquista-relogio`, `catalogo-livro` e
`conquista-bloqueada` já foram processados e registrados na sessão 091.)*

---

### Ordem sugerida

**8.6 → 8.1 → 8.2 → 8.3 → 8.4 → 8.5.** Começar pelas edições gerais
(rápidas, sem bloqueio) enquanto ele gera as duas artes que faltam; depois
o Header (faixa e ofensiva), e por último a Arena em si, que é o bloco mais
pesado e o que mais muda de lugar.

### O que trava e o que não trava

| Bloco | Depende de |
|---|---|
| 8.6 | nada — pode começar já |
| 8.1 | 🔴 folha dos troféus com fundo branco/transparente |
| 8.2 | 🔴 ícone de ofensiva apagada (ou aval pra eu dessaturar) |
| 8.3, 8.4, 8.5 | nada — pode começar já |

---

## Pendência menor, ainda sem resposta (não bloqueia nada)

- Ícone de ofensiva usado também em "Melhor Sequência" (acertos seguidos
  numa partida, não dias) — ver D038. Se incomodar, trocar em 2 lugares.
- Estilo dos ícones futuros: chapado tipo Duolingo (D041) ou 3D/gradiente
  como os que já existem? Sem resposta ainda.
