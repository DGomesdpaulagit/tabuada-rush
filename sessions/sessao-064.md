# Sessão 064 — Correção de processo + plano de ação do backlog grande

**Data:** 2026-08-17
**Versão:** 6.0.13 (sem mudança de código nesta sessão — sessão de registro/planejamento)
**Tipo:** Processo + planejamento (nenhuma linha de código de feature mudou)

---

## O que aconteceu

Davi trouxe dois pedidos antes de qualquer implementação:

1. **Cobrança de processo:** disse que "recentemente você não fez muito
   essa certificação" — não sabia se os arquivos de registro (MEMORY.md,
   MEMORY_CORE.md, sessões) estavam em dia, e pediu pra eu conferir e
   corrigir ANTES de tocar em qualquer código novo.
2. **Plano de ação:** trouxe um backlog grande de uma vez (atualização de
   ícones, exclusão do power-up XP Dobrado, correção de regra do
   "Congelar Missão", e três sistemas novos — Mochila, Poções de XP, loja
   com estoque rotativo, baús/recompensas por partida, páginas de resumo
   pós-tarefa) e pediu um **plano estruturado, revisado a cada sessão**,
   pra ir "selecionando e fazendo" por partes — não tudo de uma vez.

---

## Parte 1 — Auditoria de processo (ele tinha razão, de forma específica)

Conferi de verdade em vez de responder de memória: `git status`, `git log`
com datas, comparei a `Versão` do topo do `MEMORY_CORE.md` contra a última
entrada do `CHANGELOG.md`, e chequei se `sessions/sessao-063.md` existia.

**Resultado:** o histórico GERAL está bem documentado — sessões 044 a 062
todas presentes, com D020-D040 registrando cada decisão não-óbvia. Mas a
**sessão 063** especificamente (correção de cor dos cards da Loja + o guia
de estilo Duolingo que passei pra ele) teve commit e `CHANGELOG.md`
feitos, mas **`sessions/sessao-063.md` nunca foi criado**, e
`MEMORY_CORE.md`/`MEMORY.md` ficaram parados na versão anterior (6.0.12).
Ou seja: passos 2 e 3 da rotina de fim de bloco (`CLAUDE.md`) aconteceram,
os passos 1 e 4 não.

**Corrigido nesta sessão:**
- `sessions/sessao-063.md` escrito retroativamente (cobre as duas partes
  daquela sessão: correção de cor + guia Duolingo)
- D041 (paleta e regras de estilo Duolingo, extraídas de verdade das 8
  imagens que ele mandou naquela sessão) e D042 (esta correção de
  processo) registrados em `DECISIONS.md`
- `MEMORY_CORE.md`/`MEMORY.md` atualizados pra 6.0.13

**Correção de processo pra não repetir:** `CLAUDE.md` ganhou uma checagem
barata — antes de encerrar qualquer sessão, conferir que a `Versão` no
topo do `MEMORY_CORE.md` bate com a última entrada do `CHANGELOG.md`. Se
não bater, a rotina não foi cumprida.

---

## Parte 2 — Plano de ação do backlog grande

Em vez de espalhar o backlog dele pelos arquivos de sessão (que são
retrospectivos, não prospectivos), criei dois arquivos novos na raiz do
projeto:

- **`PLANO_ACAO.md`** — o backlog inteiro, organizado em 8 fases na ordem
  que ele descreveu: (0) processo — feita nesta sessão, (1) troca de
  ícones simples, (2) remoção do XP Dobrado + regra nova do Congelar
  Missão, (3) Mochila, (4) Poções de XP, (5) loja com estoque rotativo
  diário, (6) baús/recompensas por partida, (7) páginas de resumo
  pós-partida, (8) painel central da Arena (só depois de tudo acima, como
  ele pediu explicitamente).
- **`PENDENCIAS.md`** — pra ideias soltas que aparecerem no meio de uma
  fase sem desviar dela (ele pediu isso especificamente pensando em ideias
  de animação nas telas finais de partida).

### Três contradições que achei no texto dele — flagadas, não resolvidas por mim

Não assumi resposta sozinho pra nenhuma das três; ficaram registradas no
topo do `PLANO_ACAO.md` como perguntas antes da fase correspondente:

1. **XP Dobrado:** ele mandou excluir o power-up inteiro ("pois criamos as
   poções"), mas ele mesmo ainda lista XP Dobrado na categorização da
   Mochila e na tabela de probabilidade de drop de power-ups mais adiante
   no mesmo texto. Tratando como resíduo do rascunho (vou remover de
   verdade), mas quero a confirmação dele antes da Fase 2.
2. **Calendário da ofensiva na página de resumo (Fase 7):** ele descreveu
   uma janela de 5 dias (ontem + hoje + 3 seguintes) — diferente do
   calendário que já existe no Header (semana inteira Dom-Sáb, sessão
   061). Ele mesmo ofereceu mandar uma imagem de referência — vou pedir
   antes de construir essa página específica.
3. **"Partida" nas probabilidades por tempo (Fase 6):** a tabela dele
   presume sessões de até 1 hora, mas o modo Rush dura só alguns minutos.
   Precisa decidir o que conta como "1 partida" pra essa contagem antes de
   implementar o sistema de drop.

### Inventário rápido dos arquivos já baixados

Conferido via `ls` — 15+ PNGs em `~/Downloads` datados de 20-21/08, cobrindo
ícones de vidas/congelar/largada-turbo/+60s/ofensiva, mochila, poções,
missão mensal/diária, acertos, baús/classificações, e 3 imagens de
referência de layout (resumo de baús, resumo de poções). Não processei
nenhum ainda — isso é trabalho da Fase 1, que só começa depois do Davi
confirmar o plano.

---

## Verificação

Não se aplica no sentido de "testar código" — nenhuma linha de
`src/` mudou nesta sessão. O que foi verificado:
- `git status`/`git log` confirmam a lacuna específica da sessão 063
- Nenhum trabalho não-commitado foi perdido (só o registro estava
  faltando, o código da 063 já estava no `main`)

---

## Arquivos alterados

| Arquivo | Mudança |
|---------|---------|
| `sessions/sessao-063.md` | criado retroativamente |
| `DECISIONS.md` | D041 (guia Duolingo) + D042 (correção de processo) |
| `MEMORY_CORE.md` | versão 6.0.13, seção "Próxima sessão" reescrita pra apontar pro `PLANO_ACAO.md` |
| `MEMORY.md` | versão 6.0.13 |
| `CLAUDE.md` | checagem de auto-verificação + instrução de ler o plano antes de codar |
| `PLANO_ACAO.md` | novo — backlog em 8 fases |
| `PENDENCIAS.md` | novo — ideias soltas |
| `sessions/sessao-064.md` | este arquivo |

---

## Status para retomar

**Nada foi implementado ainda — por pedido explícito do Davi.** Ele quer
ver o plano primeiro e confirmar antes de eu começar a Fase 1.

**Próximo passo:** apresentar o `PLANO_ACAO.md` pro Davi, com as 3
contradições em aberto, e esperar ele confirmar (ou ajustar) antes de
começar a trocar os ícones da Fase 1.
