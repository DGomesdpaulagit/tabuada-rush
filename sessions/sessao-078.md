# Sessão 078 — Revisão visual completa da Fase 7 (handoff pra próxima conversa)

**Data:** 2026-08-25
**Versão:** 6.0.26 → 6.0.27 (só documentação — nenhum código mudou nesta sessão)
**Tipo:** Captura de feedback extenso — Davi avisou que o contexto desta
conversa está acabando e vai abrir uma nova. Esta sessão existe pra
garantir que NADA do que ele pediu se perca na transição.

---

## Por que esta sessão é só documentação

Davi mandou uma mensagem única e muito longa (ditada por voz, com várias
autocorreções) revisando visualmente cada página do resumo pós-partida
(Fase 7) depois de ver os ícones combo rodando. Ele mesmo pediu
explicitamente: **documentar tudo organizado antes de continuar**, porque
"esse negócio de páginas... deixou a gente muito enrolado". Não implementei
nada agora — o risco de começar a mexer em código com o contexto acabando
e deixar pela metade é pior do que chegar na próxima conversa com um plano
limpo. Cada item abaixo é uma pendência real, não uma sugestão minha.

---

## 🔴 Correção — Seguro de Ofensiva NÃO é um escudo

Erro meu nas sessões 075-077: escrevi o prompt de geração de imagem
descrevendo esse power-up como "ícone de escudo azul". **Está errado.**
O próprio código (`constants/shop.js`) já registra
`art: 'ofensiva-congelada'` pra esse item — é a chama/ofensiva
CONGELADA (ícone azul de chama parada), não um escudo. Isso explica por
que a IA errou 2 vezes seguidas: o prompt pedia a coisa errada. Da
próxima vez que for gerar essa peça (`combo-streak-insurance`), o prompt
tem que pedir "ícone de ofensiva congelada (chama azul) + Baú de Ouro",
nunca escudo. Documentado em `RECURSOS.md`.

---

## 📋 Lista completa de pendências, por página

### Geral (várias páginas)
- [ ] Remover as partículas/confetes coloridos (`<Confetti />` em
      `PostGameSummary.jsx`) ao redor do ícone principal — pelo menos
      nas páginas de Recompensa, Ofensiva, Meta de Ofensiva batida, e
      XP (ele reclamou desse efeito repetidamente em páginas diferentes;
      próxima conversa: perguntar se é TODAS as páginas ou só essas 4)

### Página 1 — Pontuação + Acertos/Erros
- [ ] Bug: existe uma "linha"/barra dentro da caixa do ícone de Acertos
      — investigar a causa (suspeita: a seta do ícone `resumo-acertos`
      vazando visualmente pra fora do alvo em tamanho pequeno, ou algum
      artefato de CSS) e corrigir
- [ ] Remover o fundo circular verde (`bg-accent/15 rounded-full`) atrás
      do ícone de Acertos — só o ícone puro, sem círculo colorido
- [ ] Ícone de "Erro" (hoje é o `X` da lucide, vermelho) — Davi vai gerar
      um ícone novo pra substituir. Aguardar arquivo.
- [ ] O mesmo bug da linha + fundo colorido acontece também no box
      "Resumo do dia" da página de Missões (`MissionsProgressPage`) —
      mesma correção lá (ícone de Acertos sem fundo, sem linha)

### Página 2 — Total de XP + % de acerto
- [ ] Trocar o ícone atual (raio amarelo + partículas coloridas ao
      redor) pelo ícone de XP de verdade que já existe no jogo
      (procurar `icone_de_xp` já processado em sessões anteriores —
      conferir nome exato registrado em `GameIcon.jsx`) — sem partículas

### Página 3 — Progresso de Missões (NOVA IMPLEMENTAÇÃO)
Cada missão (diária ou mensal) tem uma recompensa em moedas. Nova regra:
- [ ] No final da barra de progresso de CADA missão, mostrar um ícone de
      BAÚ cujo TIER bate com a faixa de moedas daquela recompensa
      ESPECÍFICA (mesmas faixas da Fase 6: Madeira 10-100, Ferro
      200-400, Ouro 500-800, Místico ~1000) — calculado por missão
      individual, não uma regra fixa pro dia inteiro (ex.: pode ter um
      dia com todas as missões em Madeira, ou um dia variado)
- [ ] O baú fica FECHADO enquanto a missão não está completa, e ABERTO
      quando completa (feedback visual dinâmico de progresso)
- [ ] Vale pra missões diárias E mensais (desafios aceitos)
- [ ] Vale tanto na página 3 do resumo pós-partida quanto na aba
      "Missões" normal do jogo (`MissionsPage.jsx`) — mesma
      implementação nos dois lugares
- [ ] Aguardar do Davi: ícones de baú fechado/aberto (múltiplos
      estágios?), imagem de referência de posicionamento, e possíveis
      ícones novos por tipo de missão (algumas reaproveitam ícone de
      outro lugar do jogo, ex. missão de "ganhar X XP" usa o mesmo
      ícone de XP da página 2)

### Página 4 — Ofensiva ativada
- [ ] Trocar o ícone atual (chama customizada + partículas/flocos ao
      redor, "muito feio, mal feito" nas palavras dele) pelo ícone de
      ofensiva DE VERDADE já usado no resto do jogo (`ofensiva`,
      registrado em `GameIcon.jsx`)
- [ ] Calendário de 5 dias: hoje as caixas são retangulares e mostram o
      NÚMERO do dia dentro. Ele quer caixas REDONDAS, SEM número dentro
      — só a letra do dia da semana (D/S/T/Q/Q), no mesmo estilo do
      painel de hover do Header (calendário semanal que já existe lá) —
      Davi vai baixar uma imagem de referência pra isso
- [ ] Círculos sem cor por padrão; quando o dia é concluído, fica laranja
      com um check/seta
- [ ] Remover a caixa "Como funciona?" inteira — deixar só a legenda
      curta ("Pratique todos os dias... Se pular um dia, ela zera")

### Página ocasional 1 — Meta de ofensiva batida
- [ ] Mesmo problema do ícone de chama+partículas — trocar pelo ícone
      real de ofensiva, sem partículas
- [ ] Na caixa que mostra a meta batida, trocar o emoji 🔥 pelo ícone
      real de ofensiva também
- [ ] Resto da página pode ficar como está

### Página ocasional 2 — Mudança de faixa de tabuada
- [ ] **Sem mudanças** — ele confirmou que está bom do jeito que está

### Página 5 — Conquistas
- [ ] Trocar o ícone hero atual (Trophy da lucide, "horroroso" nas
      palavras dele) por um ícone de troféu que ele vai baixar e nomear
      `icone-de-trofeu` (ou similar) — usado tanto aqui quanto em outras
      telas de conquista/missão que ele mencionar depois
- [ ] Resto da página pode ficar como está

### Página 6 — Recompensas achadas
- [ ] **Remover a caixa "Classificação" por completo** — não mostrar
      mais rótulo de raridade nenhum nessa página (nem pra baú, nem pra
      power-up/poção)
- [ ] **Reordenar:** se a partida deu um baú de MOEDA, a página dele
      aparece PRIMEIRO, antes das páginas de power-up/poção
- [ ] **Baú de moeda: mostrar ABERTO com as moedas visíveis dentro** (não
      mais o baú fechado atual) — já existe referência boa no Downloads:
      `novo_icone_baus_classificações.png` (4 baús abertos com moedas,
      fundo branco fácil de remover, um por tier) e
      `imagem_de_como_deve_ficar_a_página_de_recompensa_de_baús_soque_com_o_total_de_moedas_emcima.png`
      (mockup de referência de layout, tem marca d'água, só usar como
      inspiração de posicionamento, não pra recortar direto)
- [ ] O ícone de moeda + a quantidade ganha (ex. "+1000") aparece ACIMA
      do baú, sem caixa/borda decorativa ao redor (a versão atual tem um
      badge circular cujo recorte de fundo saiu ruim — ele prefere que
      eu recorte de novo com fundo preto sólido, ou ele reenvia mais
      limpo)
- [ ] Sem partículas/confete ao redor do ícone do baú também
- [ ] Power-up/poção: já usa o ícone combo (recurso+baú por
      classificação, D054) — manter, só remover a caixa Classificação
      (item já listado acima, reforçando que vale aqui também)

---

## 🆕 Novo processo de trabalho (regra permanente a partir de agora)

Davi pediu uma convenção nova pra evitar a confusão desta sessão:

> Sempre que uma implementação depender de uma referência visual
> ambígua (posicionamento, estilo, layout que ainda não está claro só
> por texto), EU (Claude) devo pedir a ele pra baixar uma imagem
> "base" de referência — e EU MESMO dou o nome do arquivo (não ele),
> pra facilitar localização depois. Ele confirma o nome, salva assim no
> Downloads, e eu processo a partir daí.

Isso vira prática padrão pra qualquer feature visual nova a partir de
agora — anotado aqui e deve ser adicionado como instrução permanente em
`CLAUDE.md`.

---

## 🧹 Tarefa de organização pendente

Davi pediu pra criar uma pasta e organizar todas as imagens de
referência que já foram baixadas ao longo das sessões (o Downloads dele
está com dezenas de arquivos acumulados de várias fases diferentes,
sem organização). Isso é uma tarefa de limpeza a fazer quando a poeira
da revisão visual assentar — não bloqueia nada, mas está registrada
como pendência real no `PLANO_ACAO.md`.

---

## Arquivos criados nesta sessão

| Arquivo | Conteúdo |
|---------|----------|
| `RECURSOS.md` | Catálogo completo dos 3 tipos de recurso (baús/power-ups/poções) — preço, probabilidade, ícone, tudo compilado do código real |
| `sessions/sessao-078.md` | Este arquivo — lista completa de pendências da revisão visual |

## Status para retomar

**Próxima conversa:** ler este arquivo inteiro antes de tocar em
qualquer código da Fase 7. Nada foi implementado ainda — é tudo lista de
tarefas. Recomendo abordar na ordem das páginas (1→6) já que os itens
dentro de cada página são independentes entre si na maioria dos casos,
exceto a Página 3 (nova implementação de baú por missão) que é bem mais
trabalhosa que o resto e pode valer virar um bloco próprio.

**Perguntar ao Davi antes de começar:** se a remoção de partículas
(`<Confetti />`) é só nas 4 páginas que ele mencionou ou em todas as
páginas do resumo pós-partida.
