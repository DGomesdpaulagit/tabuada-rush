# Sessão 101 — Retomando a Fase 1: como saber se já dá

**Data:** 2026-09-06
**Versão:** 6.0.54 → 6.0.55
**Tipo:** Ferramenta de Fase 1 (DEV, sem mudança de regra)

---

## A pergunta

O Davi voltou depois de 5 dias jogando: *"já se passaram alguns dias da
Fase 1, já dá pra retomarmos?"*

**A resposta honesta é que o calendário não decide isso.** As "~2 semanas"
que eu estimei na sessão 100 eram chute — o que decide é o **dado
coletado**, e isso dá pra medir.

## O problema: eu não enxergo o save dele

A coleta mora no `localStorage` do navegador **dele**. A janela do Browser
que eu controlo tem perfil próprio — abri o painel de domínio e ela mostra
*"Nenhuma tentativa coletada ainda"*, com 0 partidas. Confirmado, não
suposto.

**E o "Exportar Dados" que já existe não serve.** O `exportJSON` da
`StatsPage` monta um payload com resumo (`xp`, `totalGames`, `bestStreak`…)
e a lista de partidas. **Não inclui `factStats`** (onde moram o `ult` e o
`dias` por conta) **nem o `calibra`** — ou seja, exporta tudo menos
exatamente o que a Fase 1 mede.

## O que entrou: botão "Baixar coleta" no painel de domínio

Um botão no `?screen=dominio` que baixa o save inteiro como
`coleta-dominio-AAAA-MM-DD.json`.

**Por que o painel sozinho não basta:** ele responde *"a coleta está
prestando?"*, que é uma pergunta de saúde. As perguntas que **fecham** a
Fase 1 (§4.3 do `ARQUITETURA_XP.md`) são outras — falso positivo/negativo
por hold-out no tempo, estabilidade da base p25 semana a semana,
distribuição de domínio entre as contas — e todas precisam do histórico
bruto na minha mão, não de um resumo na tela dele.

**Risco:** nenhum. A página inteira já é `import.meta.env.DEV`; o botão só
lê o `data` e escreve um arquivo. Não encosta na coleta, não muda regra,
não toca em nada da Zona 1.

Conferido rodando: o botão existe, aparece (133px) e vem **desabilitado**
quando não há tentativa nenhuma — que é o caso do perfil da janela de
preview.

## Os números que decidem (extraídos do `utils/dominio.js`)

Não é opinião: os cortes estão no código.

| Constante | Valor | O que significa |
|---|---|---|
| `MIN_FATOS_BASE` | 15 | menos de 15 contas medidas → a base da fluência fica "estabilizando" e o **peso da fluência cai pra 0** |
| `MIN_RESPOSTAS_BASE` | 5 | uma conta só entra na base com 5 respostas cronometradas |
| `MIN_DIAS_VERDE` | 3 | uma conta não fica 🟢 com menos de 3 **dias distintos** — não adianta martelar tudo num dia |
| `DIAS_ALVO` | 4 | 4 dias distintos = consistência cheia |
| `CORTE_FAIXA` | 0,95 | a faixa abre com 95% em 🟢 e **nenhum** 🔴 |

A faixa 1 tem **54 contas**. Juntando: pra leitura valer, o mínimo é
**≥4 dias distintos** de jogo e volume suficiente pra a maioria das 54
contas ter ≥5 respostas — na prática algumas centenas de tentativas, porque
o sorteio de hoje é desigual (enviesa por tabuada, não por conta, então dá
pra ter conta com 20 tentativas ao lado de conta com 1).

**5 dias de jogo pode ser suficiente em dias e insuficiente em volume.**
Só o arquivo diz.

## Próximos passos

1. **Davi abre `localhost:3000/?screen=dominio`** e clica em **Baixar
   coleta** → o arquivo cai no Downloads.
2. **Eu rodo a análise da Fase 1 de verdade** em cima dele: distribuição
   🔴/🟡/🟢 das 54 contas, quais contas ficam vermelhas (bate com 7×8, 6×7,
   8×9?), se o corte de 95% é alcançável ou utópico, se a base p25 está
   estável, e o falso positivo/negativo por hold-out no tempo.
3. **Aí sim decidimos**: fecha a Fase 1 e vai pra Fase 2 (calibrar), ou
   ele joga mais uns dias antes.
4. **Se a Fase 1 fechar**, destrava em cascata: Fase 2 → Fase 3 → e com
   ela a 6.3 (painel de domínio), a 6.7 (Semana de Chama), a 6.8 (Modo
   Geral) e os ícones de pontuação que saíram da 6.2.
5. **Em paralelo, a 6.2 continua esperando ele:** logo, mascote e os sons
   de fora da partida.
6. 🔴 **Não esquecer:** `DAILY_LIVES_ENABLED = true` quando a Fase 1
   acabar (`PENDENCIAS.md`).
