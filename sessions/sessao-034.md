# Sessão 034 — Planejamento Estratégico da Tabuada Rush 4.0

**Data:** 2026-07-02
**Tipo:** Sessão de planejamento (sem implementação de código)
**Próxima sessão:** Iniciar implementação da Fase 1 da Tabuada Rush 4.0

---

## O que foi feito

Sessão dedicada a definir a filosofia e o roadmap da próxima grande versão,
após o fechamento 100% do roadmap 3.0 (sessões 026-031) e os refinamentos
pós-3.0 (sessões 032-033).

Foram discutidas 3 filosofias candidatas:
1. **"Matemática Completa"** — expandir para soma, subtração, divisão
2. **"Rush Social"** — multiplayer, turmas, feed de amigos
3. **"Inteligência Adaptativa"** — previsão de esquecimento, dificuldade
   adaptativa universal

Davi escolheu combinar **1 + 3**. Contexto importante levantado na discussão:
**não há meta de negócio** — o objetivo é uso pessoal, aprimoramento
matemático próprio. Isso descartou a filosofia 2 (social/multiplayer) e
qualquer direção B2B/monetização do roadmap.

### Conclusão central

O Tabuada Rush 3.0 tornou a multiplicação memorizável de verdade (SRS, Mapa
de Domínio, certificados). O 4.0 combina dois eixos:
- **Amplitude:** dominar as 4 operações fundamentais, não só multiplicação.
- **Profundidade:** em vez de reagir a erros, prever o esquecimento e adaptar
  a dificuldade automaticamente — o Modo Difícil adaptativo (v3.10) já provou
  o conceito num modo isolado; o 4.0 generaliza isso pro jogo inteiro.

---

## ROADMAP COMPLETO — TABUADA RUSH 4.0

### FASE 1 — Fundação Multi-Operação (arquitetura)
**Prioridade: MÁXIMA — pré-requisito técnico, começar aqui**

Sem feature visível ao jogador — mas sem isso, soma/subtração/divisão viram
gambiarras coladas em cima do que hoje é 100% hardcoded para multiplicação.

#### 1.1 — Schema multi-operação
- `factStats` / `tableStats` / `srsData` passam a ter a operação como parte
  da chave (ex.: `"mult:6x7"`, `"add:8+5"` — hoje é implicitamente só `mult`)
- Migração automática e retrocompatível: dados existentes assumem `mult`

#### 1.2 — Gerador de perguntas unificado
- `generateQuestion(operation, diffLevel, ...)` substitui a lógica hardcoded
  de multiplicação em `utils/index.js`
- Soma: operandos 1-20. Subtração: sempre resultado ≥ 0. Divisão: sempre
  exata (sem resto)

#### 1.3 — Mapa de Domínio genérico
- Componente aceita `operation` como prop e desenha a grade certa
  (multiplicação é 8×10; soma/subtração/divisão têm geometrias próprias)

#### 1.4 — SRS genérico
- `srsData` funciona para qualquer operação pela chave composta

---

### FASE 2 — Soma e Subtração
**Prioridade: ALTA**

#### 2.1 — Conteúdo novo
- Pool de perguntas de soma e subtração usando o gerador unificado da Fase 1
- Reaproveitar os modos existentes (Rush/Survival/Speed/Zen/Review) com um
  seletor de operação, em vez de duplicar cada modo por operação

#### 2.2 — Mapa de Domínio + Catálogo de Precisão
- Abas por operação dentro do Catálogo de Precisão

#### 2.3 — Certificados de Domínio adaptados
- Formato equivalente aos de multiplicação, adaptado à operação (ex.: "faixa
  de soma até 20" em vez de "tabuada do 7")

---

### FASE 3 — Divisão
**Prioridade: ALTA**

#### 3.1 — Geração derivada da multiplicação
- Toda divisão exata vem de um fato de multiplicação já existente
  (`a×b=c` → `c÷a=b`). Bootstrapar o domínio inicial de divisão a partir dos
  dados de `tableStats` de multiplicação que o jogador já tem

#### 3.2 — Relação com o Modo Inverso existente
- O Modo Inverso (3.0) já pede fatores a partir do produto — avaliar na
  implementação se vira a base do modo de Divisão ou se ficam separados

#### 3.3 — Mapa de Domínio + Certificados de Divisão

---

### FASE 4 — Inteligência Preditiva (Curva de Esquecimento)
**Prioridade: ALTA — coração da filosofia adaptativa**

#### 4.1 — Modelo de decaimento de memória
- Hoje o SRS (Flashcard) usa avaliação subjetiva do jogador ("Fácil /
  Difícil / Errei") com intervalos fixos
- Nova função: estimar força de memória por fato combinando taxa de acerto
  histórica + tempo de resposta + tempo desde a última revisão → prever
  QUANDO o fato será esquecido, não só reagir depois que o jogador já errou

#### 4.2 — Painel "Fatos a Vencer"
- Substituir/complementar o banner do Desafio Diário no menu: "X fatos
  prestes a serem esquecidos hoje"

#### 4.3 — Notificações
- Reaproveitar `lib/push.js` (infra já existente desde v2.10) para avisar
  quando fatos críticos estão perto de expirar

#### 4.4 — Aplicar às 4 operações
- O motor preditivo não é exclusivo de multiplicação

---

### FASE 5 — Adaptação Universal
**Prioridade: MÉDIA-ALTA**

#### 5.1 — Generalizar o Modo Difícil adaptativo (v3.10)
- Hoje só o Modo Difícil usa `tableStats` para enviesar o pool. Levar esse
  princípio para Rush/Survival/Speed: perguntas com viés (não exclusividade)
  para os fatos mais fracos do jogador, em qualquer operação praticada

#### 5.2 — Balanceamento
- Ex.: 60% fatos fracos / 40% aleatório — mantém fluxo e confiança, evita
  virar punitivo

#### 5.3 — Configuração
- Toggle em Settings para ligar/desligar o viés adaptativo (alguns podem
  preferir aleatoriedade pura)

---

### FASE 6 — Perfil de Domínio Unificado
**Prioridade: MÉDIA**

#### 6.1 — Mapa de Domínio, certificados e QI Ranking cobrindo as 4 operações
#### 6.2 — Certificado "Matemática Fundamental Completa" (domínio nas 4 operações)
#### 6.3 — `computeQI` passa a pesar múltiplas operações (hoje só multiplicação)
#### 6.4 — Visualização tipo radar/gráfico por operação no Catálogo de Progresso

---

## Filosofia do Tabuada Rush 4.0

> "O Tabuada Rush 3.0 ensinou a dominar a tabuada de multiplicação. O
> Tabuada Rush 4.0 expande esse domínio para a matemática básica completa —
> soma, subtração, divisão — e usa os dados reais de cada sessão para
> prever o que o jogador está prestes a esquecer, adaptando a dificuldade
> antes que ele erre, não depois."

**Dois pilares:**
1. **Amplitude — Matemática Completa:** as 4 operações fundamentais com a
   mesma profundidade pedagógica (SRS, Mapa de Domínio, certificados) que a
   multiplicação já tem
2. **Profundidade — Inteligência Adaptativa:** previsão de esquecimento (não
   reação) + dificuldade adaptativa embutida em todos os modos, não isolada
   num único modo

**Fora de escopo da 4.0** (decisão explícita — uso pessoal, sem meta de
negócio): multiplayer/social, dashboards de professor/escola, monetização
nova. Essas ideias continuam registradas em `sessao-031.md` (seção Pós-3.0)
caso o contexto mude no futuro.

---

## Instruções para a próxima sessão

**COMEÇAR PELA FASE 1 (fundação — sem isso o resto vira gambiarra):**

1. Ler esta sessão (`sessao-034.md`) + `MEMORY_CORE.md`
2. Implementar nesta ordem:
   a. Schema multi-operação (`factStats`/`tableStats`/`srsData` com chave de
      operação, migração retrocompatível)
   b. Gerador de perguntas unificado (`generateQuestion(operation, ...)`)
   c. Mapa de Domínio genérico (aceita `operation`)
   d. SRS genérico (chave composta)
3. Build + commit + push + deploy
4. Registrar em `sessao-035.md`

**NÃO pular para Fase 2 sem ter Fase 1 completa** — é a lição aprendida da
3.0: fundação primeiro, conteúdo depois.
