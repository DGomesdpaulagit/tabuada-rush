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

## ⚠️ Conflitos no texto original do Davi — flagados, não resolvidos sozinho

Antes de qualquer fase, três coisas no brief dele se contradizem ou faltam
informação. Não assumi resposta nenhuma — cada uma vira uma pergunta na
fase correspondente:

1. **XP Dobrado:** ele mandou excluir o power-up inteiro ("EXCLUIR O
   POWER-UP XP DOBRADO DO JOGO... POIS CRIAMOS AS POÇÕES"), mas depois, na
   lista de categorias da Mochila e na tabela de probabilidade de drop de
   baús/power-ups, o XP Dobrado ainda aparece listado. Tratando como
   **resíduo do rascunho** — meu entendimento é remover de verdade,
   inclusive da lista de drops. **Confirmar antes da Fase 2.**
2. **Calendário da ofensiva na página de resumo (Fase 7, página 4):** ele
   descreveu uma janela de **5 dias** (ontem + hoje + 3 dias seguintes) —
   diferente do calendário que já existe no Header (semana inteira Dom-Sáb,
   sessão 061/D039). É uma exibição nova, não reaproveita a atual direto.
   Ele mesmo ofereceu mandar uma imagem de referência — **pedir antes de
   implementar essa página.**
3. **"Partida" nas probabilidades por tempo (Fase 6):** a tabela de % por
   duração (1-5min / 6-20min / 25-50min / 1h) presume partidas que podem
   durar até 1 hora. O modo Rush dura só alguns minutos (30s + bônus); Zen
   não tem timer e pode durar mais. **Precisa decidir o que conta como
   "partida" pra essa contagem** antes de codar a Fase 6.

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

### 1.1 — Power-ups (substituir + apagar o antigo)
- [ ] **Vidas** — `novo_icone_vidas.png` → substitui `vidas.png`.
      Usado em: Header (contador), painel de vidas, Loja (Vida Extra)
- [ ] **Vida Extra** (power-up) — usa o MESMO ícone de vidas acima
- [ ] **Congelar Missão** — `novo_icone_congelar_missao.png` → substitui
      `pu-congelar.png`
- [ ] **Largada Turbo** — `novo_icone_largada_turbo.png` → substitui
      `pu-largada.png`
- [ ] **Escudo** — (verificar se tem arquivo novo — não vi um explícito
      no download; se não tiver, mantém o atual `pu-escudo.png` e
      sinalizar ao Davi)
- [ ] **+60s no relógio** — `novo_icone_+60_segundos.png` → substitui
      `pu-tempo.png`
- [ ] **Ofensiva** — `novo_icone_ofensiva.png` chegou também; conferir se
      é substituto do `ofensiva.png`/`ofensiva-congelada.png` atuais
      (sessão 061) ou se é pra outro uso — **perguntar se ficou ambíguo**

### 1.2 — Ícones de categoria de missão
- [ ] **Missões mensais** — `novo_icone_missao_mensal.png` (calendário)
- [ ] **Missões diárias** — `novo_icone_missão_diaria.png` (sol)
- [ ] **Ícone "Controle"** — missões de partidas/jogos (ex.: "Jogue 5
      partidas hoje") — localizar arquivo entre os baixados
- [ ] **Ícone "Alvo"** — missões de acerto/precisão/desempenho (ex.: "90%+
      de acertos") — localizar arquivo entre os baixados
- [ ] Demais ícones de missão — mapear cada um pelo objetivo da missão em
      `MissionsPage.jsx`/`utils/missions.js` (ver quais tipos de missão
      existem hoje antes de decidir o mapeamento completo)

### 1.3 — Ícones de telas novas (preparar pra Fases 3/4/6/7, sem construir a tela ainda)
- [ ] Registrar no `GameIcon.jsx`: `icone_da_mochila.png` (Mochila)
- [ ] Registrar: `icone_das_pocoes.png` (Poções — conferir se é folha com
      as 3 variações x1.5/x2/x3 ou um ícone genérico)
- [ ] Registrar: `novo_icone_baus_classificações.png` (conferir contra o
      `podio.png`/`bau-moedas.png` atuais — pode ser substituto)
- [ ] Registrar: `icone_de_acertos-missões-tela_resumo_da_tarefa.png`
      (usar na Fase 7, página 1 do resumo)

**Antes de fechar a Fase 1:** varrer o projeto por qualquer emoji ou ícone
antigo que ainda represente essas mesmas funções (mesmo padrão da sessão
060 — "varredura completa") pra garantir que não sobrou nada duplicado.

---

## FASE 2 — Remoções e correção de regra

- [ ] **Remover XP Dobrado por completo**: `SHOP_ITEMS` (`constants/shop.js`),
      qualquer referência em `powerups.xp2`, `GamePage.jsx`, toasts,
      `RARITIES`/lógica de compra — varrer o projeto inteiro por
      `xp2`/`XP Dobrado`, não só a Loja (ver conflito #1 acima —
      confirmar com o Davi antes)
- [ ] **Regra nova do botão Congelar Missão**: hoje (conferir em
      `MissionsPage.jsx`) o botão mostra preço e parece comprável direto
      ali. Nova regra: o botão **só aparece se `powerups.missionFreeze > 0`**
      (já tem o item na mochila) — sem preço nenhum mostrado nele. Se não
      tiver o item, não aparece nada ali (o jogador consegue o item na Loja
      ou achando em partida, ver Fases 5/6)
- [ ] Confirmar que "congelar" continua valendo pra desafios **mensais já
      aceitos** (ele confirmou que essa regra não muda)

---

## FASE 3 — Mochila (tela nova)

- [ ] Nova tela/painel "Mochila" — acesso a definir (Sidebar? dentro do
      Perfil? Vale perguntar ao Davi se não estiver óbvio quando chegar a
      vez)
- [ ] Mostra os recursos que o jogador tem AGORA (comprados + achados),
      divididos em:
  - **Power-ups**, agrupados por categoria:
    - Arena: +60s no relógio, Escudo, Largada Turbo *(XP Dobrado removido
      na Fase 2 — não entra aqui)*
    - Vida: Vida Extra
    - Ofensiva: Seguro de Ofensiva
    - Missões: Congelar Missão
  - **Poções** (categoria separada, ver Fase 4)
- [ ] Cada item mostra a quantidade em estoque (mesmo padrão de contador
      que já existe na Loja)

---

## FASE 4 — Poções de XP (recurso novo)

- [ ] Novo tipo de recurso `potions` no storage (separado de `powerups`)
- [ ] 3 variações, com multiplicador + duração MÁXIMA + preço mínimo na loja:

| Variação | Multiplicador | Duração máxima | Preço mínimo na loja |
|---|---|---|---|
| x1,5 | ×1.5 XP | 40 min | 100 moedas |
| x2 | ×2 XP | 25 min | 250 moedas |
| x3 | ×3 XP | 15 min | 450 moedas |

- [ ] Efeito: multiplica o XP ganho enquanto o timer da poção estiver
      ativo (diferente do antigo XP Dobrado, que valia só pra 1 partida —
      poção é por TEMPO, pode cobrir várias partidas ou nenhuma, dependendo
      de quanto o jogador joga naquela janela)
- [ ] Precisa de um timer/expiração persistente (guardar `potionActiveUntil`
      + qual variação, sobrevive a fechar o app)
- [ ] Tela de ativação nas cores roxas que ele mostrou de referência
      (cards "x2 / x3 / x1,5" com botão "Continuar")

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
