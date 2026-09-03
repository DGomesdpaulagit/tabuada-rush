# 🗂️ planos/ — Índice mestre das inovações (documento do Davi, sessão 100)

> **O que é isto.** O Davi mandou um documento único com ~25 inovações de
> uma vez (arte, interface, mecânicas novas, animações, apostas). Este
> diretório quebra aquele documento em **planos por versão**, um arquivo
> por versão, pra dar pra conversar e aplicar **uma de cada vez**.
>
> **`PLANO_ACAO.md` continua sendo a fonte de verdade do que está EM
> EXECUÇÃO.** Aqui é o que ainda não começou: escopo, dependência, risco e
> as perguntas que precisam de resposta antes de codar. Quando uma versão
> daqui for aprovada pelo Davi, ela vira fase no `PLANO_ACAO.md`.
>
> **Nada aqui foi implementado. Nenhum arquivo de `src/` foi tocado.**

---

## 🔒 REGRA ZERO — a Fase 0/1 do Domínio tem prioridade absoluta

O trabalho em andamento é **Tabuada Rush 6.0 — Fases 0 e 1 do sistema de
Domínio** (`ARQUITETURA_XP.md`, seções 4.2 e 4.3):

- **Fase 0 (✅ implementada, sessão 099):** o jogo passou a gravar
  `firstKeyMs`, `ult[]`/`dias[]` por fato e o log global `calibra[]`.
- **Fase 1 (⏳ EM CURSO):** `utils/dominio.js` + `scripts/analisar-dominio.mjs`
  rodando em cima do save real. **Precisa de ~2 semanas de partidas jogadas
  de verdade** pra ter amostra.

Isso cria **duas zonas de exclusão**, e a segunda é a que quase ninguém vê:

### 🚧 Zona 1 — arquivos que a Fase 0/1 ocupa (colisão de código)

| Arquivo | O que a Fase 0/1 tem lá |
|---|---|
| `src/pages/GamePage.jsx` | captura de `firstKeyAt`, marcadores `dec`/`flu`/`q1` |
| `src/App.jsx` | `handleGameEnd` grava `ult`/`dias`/`calibra` |
| `src/utils/index.js` | `diaNum()`, `ULT_MAX`/`DIAS_MAX`/`CALIBRA_MAX`, `getRandomQuestion` |
| `src/lib/storage.js` | schema do save (`calibra`, `factStats`) |
| `src/constants/index.js` | `TABUADA_TIER_RANGES`, `LEVELS`, `DAILY_LIVES_ENABLED` |

### 🚧 Zona 2 — a amostra (colisão de DADOS, invisível no diff)

A Fase 1 mede **comportamento real de jogo**: quanto tempo o jogador leva
pra responder cada fato, quantos dias distintos praticou, se a regra prevê
acerto futuro. Qualquer mudança que altere **o que ele joga ou por que ele
joga** contamina essa amostra — mesmo sem encostar em um arquivo da Zona 1.

Contaminam a amostra:

- **Modo Geral** (6.8) — muda o conjunto de fatos sorteados. Fatos de fora
  da faixa entram no `factStats` e deslocam a base p25 da fluência.
- **Semana de Chama** (6.7) — muda XP e drop; muda quanto e quando se joga.
- **Desafio de Partida / apostas** (6.9) — muda a *motivação* da partida.
  Uma partida jogada sob aposta não mede aprendizado, mede pressão.
- **Missões de tempo** (6.4) — incentiva sessão longa, que é exatamente
  uma das variáveis que a Fase 1 está medindo.

➕ **Um agravante que resolve sozinho a discussão de economia:**
`DAILY_LIVES_ENABLED = false` desde a sessão 099 (justamente pra Fase 1).
Com as vidas diárias desligadas, o **maior sorvedouro de moeda do jogo**
(refil a 300) não existe. Balancear apostas, recompensas ocultas ou
multiplicadores agora é calibrar em cima de uma economia quebrada de
propósito.

### ✅ O que PODE andar em paralelo, sem risco nenhum

| Trilha | Por quê |
|---|---|
| **6.1 — Acabamento** | correções pontuais fora da Zona 1; não muda regra de jogo |
| **6.2 — Identidade visual** | é trabalho de ARTE e de DECISÃO, não de código: nome da moeda, logo, mascote, prompts, folhas de ícone |

**Recomendação:** rodar **6.1 + 6.2 durante a coleta da Fase 1**. A Fase 1
é uma fase de *espera por dado* — é o melhor momento possível pra resolver
a fila de arte, que é justamente o que trava metade das outras versões.

---

## 🗺️ Mapa de versões

| Versão | Nome | Trava | Pode começar |
|---|---|---|---|
| **6.0.x** | 🔴 **Domínio — Fases 0/1/2/3** *(em andamento)* | — | ✅ em curso |
| **6.1** | [Acabamento e correções](6.1-acabamento.md) | — | ✅ **agora** |
| **6.2** | [Identidade visual](6.2-identidade-visual.md) | — | ✅ **agora** (arte/decisão) |
| **6.3** | [Painel de Domínio](6.3-painel-dominio.md) | Domínio Fase 2 | ⛔ |
| **6.4** | [Missões v2](6.4-missoes-v2.md) | 6.2 (ícones) | ⚠️ depois da coleta |
| **6.5** | [Reset de layout](6.5-reset-layout.md) | 6.2 (logo/mascote/paleta) | ⛔ |
| **6.6** | [Animações e frames](6.6-animacoes.md) | 6.5 + 6.2 | ⛔ |
| **6.7** | [Semana de Chama](6.7-semana-de-chama.md) | Domínio Fase 3 (`utils/xp.js`) | ⛔ |
| **6.8** | [Modo Geral](6.8-modo-geral.md) | Domínio Fase 3 (sorteio + gate) | ⛔ |
| **6.9** | [Desafio de Partida](6.9-desafio-de-partida.md) | 6.2 + vidas religadas + decisão de produto | ⛔ |

### Por que esta ordem (as 4 decisões de ordenação que importam)

1. **Layout antes de animação.** O 6.6 anima telas que o 6.5 vai
   redesenhar. Animar primeiro é jogar o trabalho fora duas vezes.
2. **Identidade antes de layout.** Logo e mascote definem paleta e traço;
   reset de layout sem eles vira chute que depois se refaz.
3. **Nome da moeda antes de todo texto de economia.** Loja, baús, missões,
   header, apostas. Trocar depois = varredura em 5 telas.
4. **Economia só depois das vidas voltarem.** Ver Zona 2 acima.

---

## 📇 Onde cada item do documento foi parar

### 3.1 Arte e identidade visual

| Item do documento | Destino |
|---|---|
| Reset visual de design / novo layout | **6.5** |
| Interação do mouse nas caixas da arena | **6.6** (comportamento) + **6.5** (estados) |
| Simplicidade equilibrada do Duolingo | **6.5** |
| Reinstalar ícones mal desenhados / baixa qualidade | **6.2** ❓ *quais?* |
| 10 ícones de pontuação (100…1000) | **6.2** — ✅ *resolve a pendência da sessão 082* |
| Ícone de baú vazio | ✅ **JÁ EXISTE** — `bau-vazio.png` (sessão 083, baú aberto com moscas, página "Nada desta vez"). ❓ *é outro que você quer?* |
| Nome das moedas | **6.2** — 🔑 decisão nº 1 |
| Logo do jogo | **6.2** — 🔑 decisão nº 2 |
| Mascote | **6.2** — 🔑 decisão nº 3 |
| Emojis → ícones: **faixa de tabuadas** | ✅ **JÁ FEITO** — Fase 8.1 (sessão 095): 20 troféus `faixa-01…faixa-20` |
| Emojis → ícones: **conquistas** | **6.2** (depende do mascote) |
| Ícones nas missões da arena | arte em **6.2**, aplicação em **6.4** |
| Refazer download dos ícones de troféus | **6.2** ❓ *quais — os 20 de faixa ou o `trofeu.png` de conquistas?* |

### 3.2 Interface e experiência

| Item | Destino |
|---|---|
| Zona de rebaixamento: ícones trocados + embaçados | **6.1** *(causa provável já identificada)* |
| Tempo de partida nas páginas de resumo | **6.1** |
| Renomear conquistas de ofensiva | **6.1** |

### 3.3 Novas mecânicas

| Item | Destino |
|---|---|
| Painel de domínio acessível ao usuário | **6.3** |
| Missões de tempo | **6.4** |
| Ocultação de recompensa nas missões | **6.4** |
| Animações do mouse no hall da arena | **6.6** |
| Novos efeitos sonoros | asset em **6.2**, integração em **6.6** |
| 🐞 Bug de missões (números errados) | **6.1** — prioridade máxima |
| Semana de Chama | **6.7** |
| Modo Geral | **6.8** |
| Sistema de Apostas | **6.9** |
| Dinâmica completa de animações/frames (Duolingo) | **6.6** |

---

## 🔑 As 3 decisões que travam tudo (nesta ordem)

Copiadas do fim do documento dele, porque estão certas e valem como regra:

1. **Nome da moeda** → trava textos de Loja, baús, missões, header e do 6.9.
2. **Logo** → define paleta e traço que todo ícone novo tem que seguir.
3. **Mascote** → pré-requisito dos ícones de conquista (e de metade do 6.6).

Detalhamento e propostas concretas: [6.2 — Identidade visual](6.2-identidade-visual.md).

---

## ❓ Perguntas abertas consolidadas

Cada uma está detalhada no plano da sua versão. Reunidas aqui pra não
precisar caçar:

| # | Pergunta | Versão | Estado |
|---|---|---|---|
| 1 | Qual o nome da moeda? | 6.2 | ✅ **Multis** |
| 2 | "Ícones mal desenhados" — quais? | 6.2 | ✅ nenhum — **estão pequenos** (36 arquivos) |
| 3 | "Refazer download dos troféus" — quais? | 6.2 | ✅ os 20 de faixa, e é resolução |
| 4 | O `bau-vazio` que já existe serve? | 6.2 | ✅ serve, só está pequeno |
| 5 | Estilo dos ícones: chapado ou 3D? | 6.2 | ✅ **a pergunta estava errada** — é Duolingo, com detalhe proporcional ao papel do ícone |
| 6 | O mascote **fala**? | 6.2 | ❓ aberta |
| 7 | O mascote aparece **dentro da partida**? | 6.2 | ❓ aberta *(recomendo que não até a coleta fechar)* |
| 8 | Missão de tempo conta **tela aberta** ou **tempo ativo**? | 6.4 | ❓ aberta |
| 9 | Recompensa oculta: até completar, ou até coletar? | 6.4 | ❓ aberta |
| 10 | "Apostas/roleta" ou "Desafio de partida/sorteio"? | 6.9 | ❓ aberta |
| 11 | O multiplicador cresce com o VALOR apostado? | 6.9 | ❓ aberta *(recomendo que não)* |
| 12 | Modo Geral **substitui** o Rush ou é separado? | 6.8 | ❓ aberta |
| 13 | Semana de Chama: quem define o objetivo? | 6.7 | ❓ aberta |
| 14 | Ícone de pontuação: alvo 350 usa o de 300 ou o de 400? | ~~6.2~~ | ⏸️ **em suspenso** — ver abaixo |

### ⏸️ Mudou de lugar: os 10 ícones de pontuação (sessão 100)

Saíram da 6.2 e **passaram a depender da Fase 3 do Domínio**. Decisão do
Davi, e o motivo é bom: *"não vai ter mais missão de pontuação. Vai ter de
XP — 'ganhe 20 XP', 'ganhe 30 XP'."*

Se o `type: 'score'` das missões vira `type: 'xp'`, os 10 ícones perdem o
lugar onde apareceriam. E a faixa numérica deles dependeria da **escala nova
de XP** — hoje uma partida rende ~250 XP, na proposta rende ~40. Uma escala
de "100 a 1000" calibrada pro mundo velho nasceria errada.

*(Isso **não** contradiz o `ARQUITETURA_XP.md`: os **pontos continuam
existindo** como medida de desempenho — resumo, recordes, apostas. O que
muda é que as **missões** param de cobrar pontos e passam a cobrar XP. É
decisão de produto, não de arquitetura.)*

---

## 🧭 Como usar este diretório

1. O Davi escolhe **uma versão** pra conversar.
2. A gente fecha as perguntas abertas daquele arquivo.
3. A versão vira **fase no `PLANO_ACAO.md`** com escopo confirmado.
4. Só então começa o código — com a rotina de fim de bloco do `CLAUDE.md`.
5. Ideia nova que aparecer no meio → `PENDENCIAS.md`, não no meio da fase.
