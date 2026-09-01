# Sessão 100 — Organização do documento de inovações em `planos/`

**Data:** 2026-09-01
**Versão:** 6.0.49 → 6.0.50
**Tipo:** Planejamento e organização — **zero código de jogo**

---

## O pedido

O Davi mandou um documento único com ~25 inovações de uma vez: arte e
identidade visual (logo, mascote, nome da moeda, ícones), interface,
mecânicas novas (painel de domínio, missões de tempo, Semana de Chama,
Modo Geral, sistema de apostas) e uma "dinâmica completa de animações"
estilo Duolingo.

Duas exigências explícitas:

1. **Organizar antes de aplicar** — separar em planos e versões, pra
   conversar e implementar uma de cada vez, aqui dentro.
2. **Não pode afetar a Fase 0/1 do Domínio.** Se afetar, fica pra depois.

## O que foi feito

Criado o diretório **`planos/`** com 10 arquivos: um índice mestre e nove
versões (6.1 a 6.9). Cada plano tem escopo, dependências, conflito com o
Domínio, checklist e perguntas abertas.

`PLANO_ACAO.md` ganhou a seção "FASE 9+" apontando pra lá (continua sendo a
fonte de verdade do que está em execução), e `PENDENCIAS.md` registrou as
duas pendências antigas que o documento dele absorveu.

## A análise que estruturou tudo: duas zonas de exclusão, não uma

A pergunta "isso afeta a Fase 0/1?" tem uma resposta óbvia e uma que quase
passou batido.

**Zona 1 — colisão de código.** Os arquivos que a coleta ocupa:
`GamePage.jsx` (`firstKeyAt`, marcadores de descarte), `App.jsx`
(`handleGameEnd` gravando `ult`/`dias`/`calibra`), `utils/index.js`,
`lib/storage.js`, `constants/index.js`. Essa é a fácil.

**Zona 2 — colisão de AMOSTRA, invisível no diff.** A Fase 1 mede
comportamento real de jogo. Qualquer coisa que mude **o que o jogador joga
ou por que ele joga** contamina a medida sem encostar em um arquivo da Zona
1:

- **Modo Geral** injeta fatos de faixas antigas (mais fáceis, mais rápidos)
  → **puxa a base p25 da fluência pra baixo** e aperta o critério de todos
  os fatos ao mesmo tempo. É o caso mais grave e o mais silencioso.
- **Semana de Chama** e **apostas** mudam quanto e por que ele joga.
- **Missões de tempo** consomem a mesma medida que a Fase 1 calibra.
- **Sons e animações dentro da partida** mudam o tempo de resposta.

➕ **Agravante de economia:** `DAILY_LIVES_ENABLED = false` desligou o
maior sorvedouro de moeda do jogo (refil a 300). Calibrar apostas ou
recompensas ocultas agora é calibrar numa economia quebrada de propósito.

**Conclusão que ordenou o backlog:** só duas trilhas são seguras hoje —
**6.1 (acabamento)** e **6.2 (identidade visual)**. E elas são justamente
as melhores pra rodar agora, porque a Fase 1 é uma fase de *espera por
dado* (~2 semanas de partidas) e a arte é o que trava metade das outras
versões.

## Achados enquanto eu levantava o material

Coisas que só apareceram lendo o código, e que mudam o tamanho do trabalho:

1. **Três itens do documento já estão prontos.** O ícone de baú vazio
   (`bau-vazio.png`, sessão 083, com moscas, na página "Nada desta vez"), a
   troca dos emojis da faixa de tabuada por ícone (os 20 troféus
   `faixa-01…faixa-20`, Fase 8.1) e os ícones dos 7 tipos de missão
   (`TYPE_ICON`) — o que falta na arena é *usar* o que existe, não gerar.

2. **O "embaçado" da zona de rebaixamento tem causa provável.**
   `zona-buraco.png` é 300×300 e é desenhado a `size={190}`; em tela 2× isso
   pede 380 px reais → **ampliação de 27%**. Os ícones que ninguém reclamou
   são desenhados com folga de 2,4× (54 px a partir de arte de 260). Vira
   regra candidata do design system: nenhum ícone desenhado acima de metade
   da largura nativa. *(A confirmar em captura antes de pedir arte nova.)*

3. **O PWA não tem manifest ligado.** `index.html` não tem
   `<link rel="manifest">`, e o arquivo da raiz se chama **`manifet.json`**
   (sem o `s`) e está fora de `public/` — nunca é servido. Na prática o jogo
   **não é instalável como app hoje**. Foi pro 6.2 porque é lá que a logo
   preenche o ícone do app.

4. **A maior parte das animações não precisa de arte nova.** Os baús
   fechados e abertos, os 12 fundos por recurso, a ofensiva acesa e a
   congelada já são artes separadas — falta interpolar. A fila de arte do
   6.6 inteiro tem **2 itens** (ofensiva apagada e, opcionalmente, frames do
   gelo). Isso responde direto o receio dele de "perder muito tempo".

5. **O documento define o Modo Geral de duas formas contraditórias** — no
   começo "mistura todas as faixas conquistadas", no fim "o usuário escolhe
   a faixa". São mecânicas opostas. Proposta: são **duas features**
   (Modo Geral + Seletor de faixa) e o seletor vira o painel de pré-partida.
   Procurei a conversa que ele lembrou sobre "o Rush incluir todas as
   faixas" em `CHANGELOG`, `DECISIONS`, `MEMORY` e todas as `sessions/`:
   **não existe registro.** Tratado como em aberto, não como combinado.

6. **O Modo Geral pode já existir com outro nome.** A seção 2.6 da
   `ARQUITETURA_XP.md` (interleaving adaptativo) faz a mesma função de
   retenção dentro do próprio Rush. Não mata o modo — muda o que ele é: a
   versão *escolhida* daquilo que o jogo passará a fazer sozinho.

## As duas análises de mecânica que valem por si

### Semana de Chama: o evento pode apagar 180 dias de ofensiva

Como está escrito ("a ofensiva só acende se cumprir o objetivo"), um
jogador com ofensiva longa pode jogar normalmente e **perder o histórico
inteiro** por não ter percebido o requisito da semana. Um evento de
empolgação que faz o jogador *torcer pra semana acabar* é o oposto do que
ele quer.

**Proposta (opção B):** a ofensiva normal continua funcionando; a **Chama**
vira um segundo marcador que só acende com o objetivo. Mantém 100% do que
ele descreveu — requisito, visual, mais XP, mais drop, comunicação no
header — e só inverte a consequência de falhar: em vez de perder o que
tinha, deixa de ganhar o extra.

### Apostas: o multiplicador crescente cria estratégia dominante

`Lucro esperado = aposta × (P × mult − 1)` → vale a pena quando `P > 1/mult`.
Com a tabela dele, apostar 10 exige **83%** de chance de bater o recorde pra
compensar; apostar 1000 exige **45%**. Mas `P` é o mesmo nos dois casos — é
a mesma tarefa. Logo **apostar tudo é sempre matematicamente melhor**, e a
tabela pune quem dosa o risco.

**Correção proposta:** o multiplicador vem do **risco escolhido** (margem
sobre o recorde: +1% → ×1,2 · +5% → ×1,5 · +10% → ×1,9 · +20% → ×2,6), não
do valor arriscado. Isso (a) elimina a estratégia dominante, (b) **resolve
sozinho o abuso do recorde baixo** que ele identificou — o recorde se
atualiza na partida seguinte —, e (c) transforma a mecânica exatamente na
fantasia que ele descreveu: *"consigo superar meu melhor desempenho por uma
margem?"*.

Mais: base = **melhor das últimas 10 partidas** (rebaixar de propósito custa
10 partidas jogadas fora — o custo já é a defesa), **chão de carteira** no
preço do refil de vidas, **nenhum cenário 100% sorte**, e **Seguro de
Desafio** como item próprio em vez de sobrecarregar o Escudo.

**Nomenclatura:** concordo com a preocupação dele. Os questionários de
classificação da Google Play e da App Store perguntam sobre "jogo de azar
simulado", e responder sim costuma levar de Livre pra 12+/Teen — o que um
jogo de tabuada não pode pagar. Recomendado adotar a alternativa dele por
inteiro: **Desafio de Partida** / **Desafio Surpresa**, sem roleta girando.

## Arquivos criados

```
planos/00-INDICE.md              índice, zonas de exclusão, mapa de versões
planos/6.1-acabamento.md         bug de missões, zona de rebaixamento, tempo, nomes
planos/6.2-identidade-visual.md  moeda, logo, mascote, ícones, sons
planos/6.3-painel-dominio.md     UI de domínio (já especificada na ARQUITETURA_XP)
planos/6.4-missoes-v2.md         missões de tempo + recompensa oculta
planos/6.5-reset-layout.md       reset visual / simplicidade Duolingo
planos/6.6-animacoes.md          catálogo de animações em 3 níveis
planos/6.7-semana-de-chama.md    evento semanal
planos/6.8-modo-geral.md         modo novo (com a contradição em aberto)
planos/6.9-desafio-de-partida.md o sistema de apostas
```

Alterados: `PLANO_ACAO.md` (seção FASE 9+), `PENDENCIAS.md` (pendências
absorvidas).

## Próximos passos

1. **Continuar a coleta da Fase 1 do Domínio** — jogar partidas de verdade.
   É o item que não pode parar, e é o que libera 6.3, 6.7 e 6.8.
2. **Escolher a primeira versão pra conversar.** Recomendo **6.1**
   (acabamento) — tem o único bug real do documento e não depende de
   decisão nenhuma. E, em paralelo, começar a responder as 3 decisões
   travantes do **6.2** (nome da moeda → logo → mascote).
3. **Responder as 12 perguntas abertas** do `planos/00-INDICE.md`, na ordem
   em que cada versão for entrando.
4. **Religar `DAILY_LIVES_ENABLED = true`** quando a Fase 1 acabar — dívida
   com data pra vencer, e ela destrava a calibração de economia do 6.4 e do
   6.9.

**Nada de `planos/` começa sem o Davi confirmar o escopo daquela versão.**
