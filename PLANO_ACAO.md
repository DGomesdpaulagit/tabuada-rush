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

## FASE 5 — Loja com estoque rotativo diário

- [ ] Loja deixa de mostrar sempre os mesmos itens fixos — vira um sorteio
      diário: 1, 2 ou 3 itens (power-ups/poções), sem ordem fixa
- [ ] Atualiza à **meia-noite local** — reaproveitar `localDateStr()` /
      `getCycleDaysRemaining()`-style (D040, já resolve fuso horário
      corretamente, não usar `toISOString()` de novo)
- [ ] **Regra fixa, nunca sorteada:** "Recuperar vidas" (o refil do pote
      diário que já existe, `LIFE_REFILL_PRICE`) sempre disponível — pra
      o jogador sempre poder continuar jogando pagando moeda, mesmo que os
      outros itens não tenham saído no sorteio do dia
- [ ] Recursos que não saíram no sorteio do dia só ficam acessíveis achando
      em partida (Fase 6) — **essa é a mudança de fundo**: a Loja deixa de
      ser a única fonte de todo item

---

## FASE 6 — Baús e recompensas por partida (loot ao terminar de jogar)

⚠️ Ver conflito #3 acima antes de começar — precisa decidir o que conta
como "1 partida" pra essa contagem de frequência.

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

- [ ] Definir o que conta como "partida" pra essa tabela (conflito #3)
- [ ] Implementar RNG ponderado (intervalo médio → chance por partida,
      não um contador fixo — "essas probabilidades são uma média", ele foi
      explícito que pode vir na 1ª partida do dia por sorte, raro mas
      possível)
- [ ] Guardar o que foi achado numa partida pra mostrar na Fase 7 (página 6)

---

## FASE 7 — Páginas de resumo pós-partida (fluxo novo no fim de cada tarefa)

Substitui/estende a `ResultsPage.jsx` atual por um fluxo de várias telas
em sequência:

- [ ] **Página 1** — Pontuação + Acertos e Erros (ícones já baixados)
- [ ] **Página 2** — Total de XP ganho na partida + % de acerto da partida
- [ ] **Página 3** — Progresso de missões diárias/mensais. Mostrar
      progresso mesmo sem ter concluído (ex.: "12/20 acertos"). Mensais:
      só as que o jogador **já aceitou**
- [ ] **Página 4** — Ofensiva: ícone + calendário de **5 dias** (ontem,
      hoje, +3 seguintes) — ⚠️ diferente do calendário semanal do Header
      (ver conflito #2, pedir imagem de referência antes de construir)
- [ ] **Página ocasional 1** — só aparece se bateu a meta de ofensiva:
      celebração + sugestão de nova meta
- [ ] **Página ocasional 2** — só aparece ao mudar de faixa de tabuada:
      celebração de transição
- [ ] **Página 5** — Conquistas: progresso mesmo sem ter concluído ainda
- [ ] **Página 6** — Recompensas achadas na partida (baús/power-ups/poções
      da Fase 6)

**Depende da Fase 6 estar pronta** pra página 6 ter o que mostrar.

---

## FASE 8 — Painel central da Arena (só depois de tudo acima)

O Davi pediu explicitamente pra **não mexer nisso antes** — ele quer
terminar o backlog de cima primeiro. Quando chegar a vez: **começar
perguntando o que ele quer**, não propondo um design pronto (mesma lição
das sessões 055-058 com a tela de Ligas — mockup ou pergunta primeiro,
código depois).

---

## Pendência menor, ainda sem resposta (não bloqueia nada)

- Ícone de ofensiva usado também em "Melhor Sequência" (acertos seguidos
  numa partida, não dias) — ver D038. Se incomodar, trocar em 2 lugares.
- Estilo dos ícones futuros: chapado tipo Duolingo (D041) ou 3D/gradiente
  como os que já existem? Sem resposta ainda.
