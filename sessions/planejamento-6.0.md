# 📋 Planejamento — Tabuada Rush 6.0 (RESET COMPLETO)

> Documento vivo. Davi está mandando isso por blocos de áudio (transcritos por
> ele e colados aqui por mim, organizados por assunto). Ainda **NÃO é uma
> sessão de implementação** — é o rascunho do que vai virar o roadmap da 6.0.
> Vou acrescentando conforme novos áudios chegarem, até fecharmos o escopo e
> começarmos a implementar por partes.

**Contexto:** a 5.0 (sessao-043.md) terminou com várias frentes abertas
(migração de paleta pendente em Modos/Recompensas/Estatísticas/Loja, posição
do mascote não confirmada, StatsPage "bagunçada", economia de moedas/aposta
sem decisão). Davi decidiu **não continuar consertando a 5.0** e partir para
um reset 6.0 — este documento assume que o reset substitui aquelas
pendências (a confirmar com ele, ver "Perguntas em aberto" no fim).

---

## 1. Motivação (por que resetar)

- Davi não gostou do resultado visual/de animação da 5.0 — queria mais perto
  do Duolingo, mas "não conseguimos" (animações do mascote, etc, abaixo do
  esperado).
- Referência dupla: (a) prints do Duolingo (paleta, sidebar, ícones), (b) um
  protótipo que ele fez no **Lovable** com um prompt anterior — achou a
  paleta desse protótipo muito parecida com a do Duolingo e quer usar as
  duas como base.

---

## 2. Design

- **Paleta:** usar a paleta do protótipo Lovable / Duolingo. Ele achou o
  **fundo** do protótipo Lovable "muito azul" — não quer esse fundo. Prefere
  manter o fundo escuro que já existe no jogo atual (mais parecido com o do
  Duolingo).
- **Tema principal = escuro.** Suporte a claro e escuro, mas o jogador
  começa e navega por padrão no escuro. **Não quer mais o bege** que existe
  hoje no modo claro — "não combina com o jogo".
- **Layout geral:** copiar a estrutura do Duolingo — sidebar lateral com
  ícones (casinha = Início/**Arena**, Ligas, Missões, Loja, Perfil).
  Reaproveitar ícones no estilo Duolingo onde fizer sentido, mas **não é
  pra parecer "um site"** — precisa continuar lendo como jogo.
- **Header superior:** nível/tabuada (esquerda) → 🔥 ofensiva com número de
  dias → 🪙 moedas → ❤️ vidas, todos na mesma barra (réplica do padrão
  Duolingo).
- **Ofensiva diária:** tira o card "Ofensiva diária" que existe hoje no
  final da Arena — vira só o ícone de foguinho no header (ver acima).
- **Nome da tela inicial:** decidido → **"Arena"** (ele cogitou manter
  "Início" mas fechou em Arena, "pra não deixar tão genérico").

**Bug já identificado nos prints atuais (corrigir independente do reset):**
caixa "Partidas / Melhor Seq. / Acertos" no rodapé da Arena está com
fundo e fonte brancos sobre fundo claro — ilegível. Conferir tema escuro
como um todo em busca de mais casos assim (ele mencionou "alguns estão
brancos", não só esse).

---

## 3. Navegação / Infraestrutura

Sidebar nova, 5 destinos (estilo Duolingo):

1. **Arena** (era "Início")
2. **Ligas** (era "Ranking de QI" — ver seção 4)
3. **Missões** (absorve o que hoje é parte de "Recompensas")
4. **Loja** (idem)
5. **Perfil** (novo — absorve Conquistas + Recordes + Catálogo, ver seção 6)

**Removido:** aba "Recompensas" como hub único — ela se fragmenta em Missões
/ Loja / Perfil, cada uma virando destino de primeiro nível na sidebar (não
mais abas dentro de um hub).

**Removido:** aba/conceito "Temporada" por completo. Não vai ter mais XP de
temporada separado — **só existe um XP, unificado**. (Davi cogitou reusar
temporada como trilha de recompensa por XP total, mas decidiu que já tem
loja + missões cobrindo isso — ver "Pontos fechados" abaixo.)

**Missões:** viram abas internas — **Diárias** e **Mensais** (semanais
removidas). Ícone de missão = baú.

---

## 4. Ligas (substitui o Ranking de QI) — ✅ IMPLEMENTADO (Bloco 4, sessao-047)

> Números de promoção/rebaixamento e calibração de XP dos personagens são
> estimativa (ver DECISIONS.md D023 pros números exatos e o porquê). Sistema
> antigo (Ranking de QI/`getQiInfo`) NÃO foi deletado — continua alimentando 5
> telas que ainda não foram pro reset 6.0 (Menu, Perfil, Settings, Results,
> Catalog); só a página "Ligas" em si e o toast de promoção usam o sistema
> novo. Ver D023 pro raciocínio completo, incluindo um bug de ping-pong
> encontrado e corrigido durante a implementação (promoção/rebaixamento só
> é checado em fim de partida agora, não mais ao abrir o app).

Mudança de conceito: hoje o Ranking de QI é uma **comparação estática**
(seu QI vs. personagens fixos). Na 6.0 vira **competição ativa**, estilo
liga do Duolingo.

- **10 ligas**, nomes definidos: Bronze, Prata, Ouro, Safira, Rubi,
  Esmeralda, Ametista, Pérola, Obsidiana, Diamante.
- **~10 personagens por liga** (Davi oscilou entre 30 → 15 → 10 ao longo do
  áudio; fechou em **10 por liga → 100 personagens no total**, reduzido dos
  104/52 atuais). Diamante = personagens "mais inteligentes", Bronze =
  "menos inteligentes" (mantém o eixo de QI que já existe em
  `characters.js` para ordenar quem vai em cada liga).
- **Mecânica:** o jogador compete por **XP** contra os personagens da sua
  liga atual. Cada personagem tem desempenho simulado (ex.: "Patrick
  Estrela" erra muito e quase não ganha XP; outro personagem, tipo "Bob
  Esponja", tem desempenho melhor) — os personagens **oscilam de posição
  entre si** com o tempo, não são um ranking fixo.
- **XP é universal** — não existe "XP de liga" separado do XP normal do
  jogo.
- **Promoção/rebaixamento por zona**, com nº de vagas variável por liga
  (ele deu exemplo ilustrativo: Bronze ~7 promovem, Safira ~5, Esmeralda ~4
  — **não são números fechados**, precisam ser calculados/balanceados, não
  foram decididos de verdade).
- **Regra importante:** se o jogador não praticar, ele **perde posição**
  porque os personagens continuam "ganhando XP" sozinhos (não é literal —
  é a simulação de atividade deles). Quanto menos o jogador pratica, mais
  XP relativo ele perde para os personagens da liga.
- Ideia para depois (não é desta fase): avatar/animação do personagem
  concorrente aparecendo na tela de Ligas.

---

## 5. Vidas (substitui o sistema atual) — ✅ IMPLEMENTADO (Bloco 2, sessao-045)

> Decisões tomadas durante a implementação (não estavam 100% explícitas no áudio,
> registro pra não ficar ambíguo depois): (1) o pote é **realmente global** — erro em
> QUALQUER modo desconta, incluindo Zen (leitura literal de "qualquer modo bloqueado"
> na seção original); (2) a reposição enche o pote INTEIRO de volta a 5 por um preço
> fixo (150 moedas), não vida-por-vida (mesmo padrão do print de referência do
> Duolingo: "Recuperar vidas · 350"); (3) o Escudo (power-up já existente) protege a
> vida diária também, não só a vida de partida. Ver DECISIONS.md D021.

- Copiar o modelo Duolingo: **5 vidas/erros por dia**, não por partida.
  Quando as vidas acabam, o jogador não consegue mais jogar (qualquer modo)
  até repor.
- Repor: **comprar vidas com moeda** (vidas caras, de propósito — não é
  compra trivial). Substitui a mecânica de "apostar tudo" que existia antes
  para esse caso específico (perder todas as vidas).
- O sistema de aposta em si (apostar moeda numa partida) **continua
  existindo** — só não é mais a única saída quando as vidas acabam.

---

## 6. Progressão / Níveis de tabuada (sistema novo, substitui os 28 níveis) — ✅ IMPLEMENTADO (Bloco 3, sessao-046)

> Confirmado com o Davi (2026-08-17, ver DECISIONS.md D022): nome da faixa = só o
> intervalo ("Tabuada 2×10", sem nome fantasia); ritmo da 1ª faixa = 6-10 meses de
> prática diária, como descrito originalmente no áudio (não encurtado); e o fator
> da pergunta VAI até 200 de verdade (não é só rótulo) — confirmado ciente da
> tensão com o princípio "só tabuada tradicional". 20 faixas: 2×10, depois de 10 em
> 10 até 190×200. Calibração de XP por faixa é estimativa (sem telemetria real
> ainda) — ver comentário em `constants/index.js` pros números exatos.

Conceito central: em vez de nível genérico (Iniciante, etc.), o nível
**é literalmente o intervalo de tabuada que o jogador está treinando**,
andando de trás pra frente:

- Progressão por faixas: **2–10 → 10–20 → 20–30 → ... → até 200.**
- **2–10 é a faixa mais importante e a mais difícil de passar** (de
  propósito — é o núcleo da tabuada que todo mundo precisa saber de cor).
  Faixas seguintes ficam **progressivamente mais fáceis de passar** à
  medida que o jogador acumula repertório (quanto mais tabuada already
  sabida, mais fácil avançar — efeito bola de neve intencional).
- **XP necessário por faixa é muito alto** — ordem de grandeza de **6 a 10+
  meses** de prática diária consistente para passar de faixa nos níveis
  iniciais. Não é uma progressão rápida.
- Nome de exibição das faixas: Davi não decidiu. Alternativas discutidas:
  nome descritivo tipo "Tabuada do 2 ao 10" direto na tela (opção que ele
  parece preferir), ou pesquisar se existe nome específico para quem só
  sabe tabuada até certo ponto (ele não sabe se existe).
- **Cálculo pendente, não feito:** quanto XP por partida é realisticamente
  ganhável por dia (ex.: fazendo ~5 lições/dia), pra bater esse alvo de
  6-10 meses na primeira faixa. Isso é conta a fazer antes de implementar
  os thresholds, não decisão de produto — é matemática de balanceamento.
- No header, o símbolo que hoje mostra "nível" passaria a mostrar a faixa
  de tabuada atual (ex.: "2×10") — Davi deixou em aberto o formato exato.

---

## 7. Missões e desafios mensais (mecânica de "aposta" nova) — ✅ IMPLEMENTADO (Bloco 5, sessao-048)

> Semanais removidas de vez (código deletado, não só escondido). Metas dos
> desafios mensais foram revisadas pra baixo em relação ao pool antigo (que
> não tinha risco) — 250 partidas/mês, por exemplo, garantiria penalidade
> pra quase todo jogador; ver DECISIONS.md D024 pros números novos e o
> porquê. Testado o ciclo completo (aceitar → congelar → prazo vencer →
> penalidade aplicada, inclusive saldo ficando negativo) via manipulação de
> `localStorage` — funcionou exatamente como especificado.

- **Missões diárias:** fixas, sem risco. Se não completar, não perde nada;
  se completar, só ganha (moedas).
- **Desafios mensais:** o jogador precisa **aceitar** o desafio pra entrar
  nele (não é automático). Ex. dado por ele: "ganhe 500 moedas se acertar
  50 vezes no mês".
  - Se completar → ganha a recompensa prometida.
  - **Se não completar → é descontado um valor de moeda do saldo do
    jogador** (ex.: -100 moedas). Se o saldo não for suficiente, o jogador
    fica com **saldo negativo**, que é quitado automaticamente da próxima
    moeda que ele ganhar.
  - Pode **congelar** um desafio mensal gastando moeda (power-up "Congelar
    Missão") — estende o prazo do desafio (ex.: desafio de 20 dias, congela
    e ganha +10 dias). Se o mês virar com o desafio ainda ativo (inclusive
    congelado), ele continua valendo em "Mensais" mesmo depois da virada de
    mês.

⚠️ **Ver seção 10 (alerta de escopo) — esse desconto de saldo é
funcionalmente uma mecânica de aposta com "dívida", que é exatamente o tipo
de coisa que ele mesmo pediu pra eu questionar antes de implementar.**

---

## 8. Power-ups (mantidos, focados na Loja)

Os já existentes continuam (Vida Extra, +60 Segundos, XP em Dobro, Escudo,
Largada Turbo) + os novos mencionados: **Seguro de Ofensiva** (restaura a
ofensiva automaticamente se quebrar) e **Congelar Missão** (seção 7). Davi
quer conversar sobre adicionar mais poderes depois — não é lista fechada.

---

## 9. Perfil (aba nova) — ✅ IMPLEMENTADO (Bloco 6, sessao-049)

> Absorveu Conquistas/Recordes/Catálogo (saíram de Estatísticas, que ficou só
> com Acertos/Erros/Análise/Catálogo de Precisão — reorganização de verdade é
> Bloco 7). Sistema antigo de "QI" (`getQiInfo`/`computeQI`/`CHARACTERS`/
> `TIERS`) foi REMOVIDO por completo (não só trocado de tela) — era a última
> pendência sinalizada em D023. Substituído por Faixa de tabuada (Bloco 3) +
> Liga (Bloco 4) em toda parte que antes mostrava QI. Ver DECISIONS.md D025.
> "Pódios conquistados nas ligas" (mencionado no áudio original) NÃO foi
> implementado — não existe histórico de pódio ainda, só a posição atual;
> registrado como lacuna conhecida, não esquecimento.

Absorve o que hoje está espalhado:

- Tempo de conta ("desde julho de 2026"), nome completo, nome de usuário.
- Nível/faixa de tabuada atual (seção 6).
- Painel de estatísticas resumido: recorde de ofensiva, XP total, divisão
  (= liga atual, seção 4), pódios conquistados nas ligas.
- **Conquistas** (saem de Estatísticas/Recompensas e vêm pra cá) — exibidas
  também ao jogador ao final de cada partida quando desbloqueadas.
- **Recordes** e **Catálogo** também migram pra cá como seções/botões
  (ver seção 10 — Estatísticas).

---

## 10. Estatísticas (reorganização, não reset) — ✅ IMPLEMENTADO (Bloco 7, sessao-050) — RESET 6.0 COMPLETO

Diferente do resto — Davi foi claro que **não quer refazer do zero**, só
reorganizar/catalogar melhor:

- **Sai de Estatísticas** (muda de lugar, não é removido do app):
  - Conquistas → Perfil (seção 9)
  - Recordes → Perfil (seção 9)
  - Catálogo (de níveis) → Perfil (seção 9)
- **Remover de vez:**
  - "Partidas por modo"
  - "Power-ups" (a seção dentro de Estatísticas — os power-ups em si
    continuam existindo, só saem dessa tela e ficam mais associados à Loja)
  - "Modo favorito"
- **Mantém em Estatísticas:** Acertos, Erros, Análise Inteligente — mas
  **Acertos e Erros passam a viver dentro do "Catálogo de Precisão"** como
  sub-seções/botões dele, em vez de seções soltas.
- **Navegação nova dentro de Estatísticas:** um guia lateral tipo sumário
  (ele citou o Notion como referência — painel lateral que lista os
  tópicos, você passa o mouse/toca e navega direto pra seção). Objetivo:
  como "estatísticas é muita coisa", precisa ficar navegável sem scroll
  cego. Davi disse que vai mandar um print de referência desse componente.

> **Implementado sem o print de referência** (nunca chegou nesta sessão) — guia
> lateral tipo TOC do Notion, com pontinhos+rótulo no hover, fixo na margem
> direita, só em telas largas (`lg+`, mesmo breakpoint da Sidebar). É uma
> primeira interpretação; ajustar quando/se o Davi mandar o print de verdade.
> "Partidas por modo"/"Power-ups"/"Modo favorito" removidos da tela principal
> de Estatísticas. Acertos/Erros viraram sub-seções do Catálogo de Precisão.
> De brinde, corrigi o gráfico "Evolução" — filtrava por um modo ("Desafio
> Diário") que não existe mais desde a 5.0, então nunca tinha dado nada;
> agora mostra evolução do Rush. **Este era o último bloco do reset 6.0** —
> ver sessao-050.md pro fechamento completo.

---

## 11. Pontos fechados nesta rodada (não precisam de mais conversa)

- Tema principal escuro, remover bege do claro.
- Nome "Arena" para a tela inicial.
- Sidebar com Arena/Ligas/Missões/Loja/Perfil.
- Remoção total da aba/conceito "Temporada".
- Missões: só Diárias + Mensais (sem semanais).
- Ligas substituem Ranking de QI, com 10 ligas nomeadas.
- Vidas: modelo Duolingo (5/dia, compra pra repor).
- Progressão por faixa de tabuada (2-10 → 200), crescente em dificuldade
  na faixa inicial, decrescente depois.
- Estatísticas mantém Acertos/Erros/Análise Inteligente; Conquistas/
  Recordes/Catálogo migram pra Perfil.

## 12. Pontos em aberto (Davi disse explicitamente "não sei" / "a gente
conversa depois" — não inventar sozinho, alinhar antes de implementar)

- Número exato de personagens por liga e tamanho das zonas de
  promoção/rebaixamento (ele deu exemplos ilustrativos, não finais).
- Nome de exibição das faixas de tabuada (seção 6).
- Cálculo de XP/dia realista para bater a meta de 6-10 meses na primeira
  faixa — trabalho de balanceamento, não decisão de produto, mas precisa
  ser feito antes de cravar os thresholds.
- Lista final de power-ups (pode crescer).
- Formato exato do símbolo de nível/faixa no header.
- Quanto desconta de saldo por desafio mensal não cumprido, e o valor de
  recompensa — só deu exemplo ilustrativo (500 moedas / -100 moedas).

## 13. Respostas do Davi (2026-08-16 — confirmado)

1. **A 6.0 substitui de vez as pendências da 5.0.** Não retomamos migração
   de paleta/posição do mascote/painel temático por personagem como itens
   separados — tudo isso está englobado pelo reset. `MEMORY_CORE.md` será
   atualizado quando a 6.0 começar a ser implementada de fato, marcando a
   seção "PRÓXIMA SESSÃO" da 5.0 como superada por este documento.
2. **Sem mais áudio pendente.** Os 3 áudios já cobrem o escopo — pode
   quebrar em blocos de implementação.
3. **Desconto de saldo nos desafios mensais confirmado como está descrito**
   na seção 7 (opt-in, com teto, saldo negativo quitado no próximo ganho).
   Não é bloqueador — segue como especificado.

---

## Próximo passo

Escopo fechado o suficiente pra quebrar em blocos de implementação. Ordem
sugerida (a confirmar com o Davi qual bloco começar primeiro):

1. **Base visual** — paleta, tema escuro como padrão, remoção do bege,
   sidebar (Arena/Ligas/Missões/Loja/Perfil), rename Início→Arena, header
   novo (faixa/ofensiva/moedas/vidas). Fundação de tudo o resto — deveria
   vir primeiro.
2. **Vidas** — modelo 5/dia + compra para repor.
3. **Progressão de tabuada** — faixas 2-10→200 (cálculo de XP/dia fica pra
   quando este bloco começar).
4. **Ligas** — substitui Ranking de QI, 10 ligas, promoção/rebaixamento.
5. **Missões** — diárias + mensais com aceite/desconto/congelamento.
6. **Perfil** — nova aba, absorve Conquistas/Recordes/Catálogo.
7. **Estatísticas** — reorganização (Acertos/Erros dentro de Catálogo de
   Precisão, navegação lateral tipo sumário, remoção de partidas-por-modo/
   power-ups/modo-favorito).

Bug do rodapé (caixa branco-sobre-branco em Estatísticas) pode ser
corrigido a qualquer momento, independente da ordem acima — é isolado.
