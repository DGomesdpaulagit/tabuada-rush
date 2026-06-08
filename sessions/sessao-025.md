# Sessão 025 — Análise Estratégica e Planejamento da Tabuada Rush 3.0

**Data:** 2026-06-08
**Tipo:** Sessão de análise e planejamento (sem implementação de código)
**Próxima sessão:** Iniciar implementação da Fase 1 da Tabuada Rush 3.0

---

## O que foi feito

Esta sessão foi dedicada a uma **análise estratégica profunda** do Tabuada Rush, avaliando:
- Se o jogo realmente ajuda a memorizar a tabuada ou apenas a praticar
- Problemas de progressão, dificuldade, economia e missões
- Oportunidades de evolução pedagógica, de retenção e de gameplay
- Planejamento completo das próximas fases de desenvolvimento

### Conclusão central da análise

**O Tabuada Rush até a v3.2.1 é uma ferramenta de PRÁTICA. A partir da v3.0 (próxima grande fase), ele se tornará uma ferramenta de MEMORIZAÇÃO REAL.**

A diferença: praticar é responder questões. Memorizar é criar resposta automática (reflexo). O método científico mais comprovado para memorização de fatos é a **repetição espaçada (spaced repetition)** — revisitar cada fato no momento exato em que o cérebro estaria prestes a esquecê-lo, em intervalos crescentes.

---

## ROADMAP COMPLETO — TABUADA RUSH 3.0

### FASE 1 — Base Pedagógica + Correções Críticas
**Prioridade: MÁXIMA — começar aqui na próxima sessão**

#### 1.1 — Página de Modos + Banner do Desafio Diário no Menu
- Criar uma página dedicada de modos (`ModesPage.jsx`) com TODOS os modos organizados
- No menu principal: substituir o grid atual de modos por um botão "Ver Modos"
- No menu principal: adicionar um **banner/card de destaque** para o Desafio Diário logo abaixo das informações do perfil — como se fosse um "card chamativo" que chama o jogador para o modo mais importante do dia
- O Desafio Diário aparece TANTO no banner do menu QUANTO dentro da página de modos
- O banner mostra: "Desafio de Hoje 🌟" + se já foi feito (badge ✓) ou não

#### 1.2 — Corrigir Missão Impossível
- Missão `mm_score_1200` está tecnicamente impossível com o scoring atual
  - Rush médio: 300–400 pts. Speed máximo: ~600 pts. Daily máximo: ~250 pts.
  - Ajustar target para 350 pts (atingível no Rush com boa performance)
- Revisar todas as missões de score para ficarem dentro dos limites reais do sistema

#### 1.3 — Mapa de Domínio Visual (a feature mais impactante educacionalmente)
- Nova visualização dentro do Catálogo de Precisão
- Grade 8×10 mostrando TODAS as 80 combinações fundamentais (2×1 até 9×10)
- Cada célula colorida por nível de domínio com base nos dados de tableStats:
  - 🟢 Verde: acerto consistente em <1.5s — **DOMINADO**
  - 🟡 Âmbar: acerta mas leva >1.5s — **PRATICADO, não dominado**
  - 🔴 Vermelho: taxa de erro >20% — **PROBLEMÁTICO**
  - ⬜ Cinza: sem dados suficientes — **NÃO VISTO**
- Implementar limiares: acerto em <1.5s = automático; >2.5s = ainda pensando
- Adicionar legenda e contadores ("X de 80 fatos dominados")
- Esse mapa é a primeira vez que o jogador vê EVIDÊNCIA VISUAL e REAL do seu conhecimento

#### 1.4 — Indicador de Domínio nas Estatísticas
- No Catálogo de Precisão, adicionar seção "Fatos Dominados: X/80"
- Distinguir claramente "acertou" de "acertou automaticamente (<1.5s)"
- Mostrar evolução: "há 30 dias você tinha 12 fatos dominados. Hoje tem 34."

---

### FASE 2 — Repetição Espaçada (O Coração do 3.0)
**Prioridade: ALTA — implementar logo após Fase 1**

#### 2.1 — Modo Flashcard com Repetição Espaçada
- Novo modo de treino: `flashcard`
- Funcionamento:
  - Mostra um fato (ex: "6 × 7 = ?")
  - Após responder, jogador avalia: "Fácil" / "Difícil" / "Errei"
  - Algoritmo SRS (Spaced Repetition System) calcula quando mostrar de novo:
    - Fácil: próxima revisão em 3 dias
    - Difícil: próxima revisão em 1 dia
    - Errei: próxima revisão em 10 minutos
  - O sistema lembra dos intervalos para CADA combinação específica
  - Ao abrir o app, mostra quantos fatos precisam de revisão hoje
- Novos campos no storage: `srsData: { "6x7": { interval, nextReview, easeFactor } }`
- É o único modo que realmente cria memória de longo prazo

#### 2.2 — Certificados de Domínio por Tabuada
- "Certificado da Tabuada do 7" desbloqueado quando:
  - Precisão ≥ 95% nas questões do 7
  - Tempo médio de resposta < 1.5s no 7
  - Critérios mantidos por pelo menos 5 sessões diferentes
- 8 certificados possíveis (tabuadas 2 a 9)
- Aparecem no perfil e na página de conquistas
- São os únicos itens que NÃO podem ser comprados — só conquistados por domínio real

#### 2.3 — Modo Inverso
- Novo modo de treino: `inverse`
- Exibe o resultado: "= 56"
- Jogador digita os dois fatores que formam esse resultado (ex: 7 e 8)
- Muito mais difícil que o modo direto — exige compreensão real
- 15 questões com tempo médio por resposta registrado
- XP multiplier: 0.20 (valor moderado — é um modo de treino mas exigente)

---

### FASE 3 — Economia, Loja e Power-ups Reformulados
**Prioridade: MÉDIA-ALTA**

#### 3.1 — Power-ups Spot (comprar no momento de perder)
- Manter o sistema atual de pré-compra
- Adicionar opção de compra no momento de perder:
  - Survival: modal ao perder última vida → "Usar estoque (X)" OU "Comprar agora por 50🪙"
  - Rush: modal ao acabar o tempo → "Usar estoque (X)" OU "Comprar 30s por 30🪙"
- Se o jogador não tem moedas suficientes, opção fica desabilitada (não escondida)

#### 3.2 — Novos Consumíveis na Loja
- **Seguro de Ofensiva (100🪙):** restaura ofensiva perdida em até 24h após a quebra
  - Alto valor emocional — o jogador paga de boa vontade
  - Só funciona uma vez por quebra (não acumula)
- **Congelar Missão Diária (50🪙):** pausa uma missão diária por 24h
  - Útil quando o jogador sabe que não vai conseguir completar hoje
- **Bônus de Moedas (75🪙):** +50% moedas por 1 hora de jogo
  - Cria urgência e incentiva jogar agora

#### 3.3 — Apostas de Partida
- Antes de iniciar qualquer partida, jogador pode apostar moedas (10, 25 ou 50)
- Se superar o recorde pessoal naquele modo: recebe 3× o apostado
- Se não superar: perde as moedas apostadas
- Adiciona tensão e torna recordes mais emocionantes

#### 3.4 — Oferta da Semana na Loja
- Seção nova na loja: "Oferta da Semana 🏷️"
- 2–3 itens com desconto de 40% que mudam toda segunda-feira
- Cria razão para verificar a loja regularmente
- Implementado com seed determinística por semana (mesma lógica do Desafio Diário)

#### 3.5 — Temas de GamePage (cosméticos com valor real)
- Ao invés de apenas temas do card de perfil, criar temas visuais do GamePage
- O jogador passa muito mais tempo no GamePage do que no menu
- Temas mudariam: gradiente do card de questão, cor da barra de progresso, visual do combo
- Preços: 1.000 / 2.500 / 5.000 🪙

---

### FASE 4 — Novos Modos de Jogo
**Prioridade: MÉDIA**

#### 4.1 — Modo Contra o Relógio Pessoal
- Nome: "Recorde Pessoal" ou "Duelo Pessoal"
- Cada questão mostra o seu melhor tempo para aquele fato específico (baseado em tableStats)
- Objetivo: bater seu próprio recorde em cada questão
- Pontuação baseada em % de questões onde o jogador bateu o recorde pessoal
- XP multiplier: 0.18

#### 4.2 — Desafio Semanal Competitivo
- 10 questões idênticas para todos os jogadores na semana
- Score = acertos × velocidade combinados
- Leaderboard semanal publicado toda segunda-feira
- Top 3 ganham itens especiais da loja (sem poder comprar)
- Exige Supabase configurado

#### 4.3 — Modo Difícil
- Pool exclusivo de tabuadas 7, 8 e 9 (as mais difíceis)
- Timer de 90 segundos
- XP multiplier: 0.22 (maior que os modos padrão)
- Desbloqueado ao atingir Nível 8+

---

### FASE 5 — Leaderboard e Social
**Prioridade: MÉDIA-BAIXA**

#### 5.1 — Leaderboard do Desafio Diário
- Top 20 global por pontuação no Desafio Diário de hoje
- Baseado no campo `currentDailyScore` + `currentDailyDate`
- Atualizado em tempo real via Supabase
- O fato de todos responderem as MESMAS questões torna a comparação 100% justa

#### 5.2 — Calendário Heatmap de Ofensiva
- Visualização estilo GitHub na página de Estatísticas
- 365 dias num grid, verde escuro = muito jogo, verde claro = pouco, cinza = não jogou
- Já previsto no MEMORY_CORE como próxima prioridade

#### 5.3 — Compartilhar Resultado
- Gerar imagem do resultado da partida para compartilhar em redes sociais
- Exibir: modo, pontuação, precisão, recorde pessoal, personagem do QI atual

---

### FASE 6 — Expansão de Conteúdo
**Prioridade: BAIXA — só após Fases 1-4 estarem sólidas**

#### 6.1 — Tabuada do 11 e 12
- Opcionais, claramente marcadas como "além do currículo básico"
- Desbloqueáveis por nível ou QI alto
- Não contaminar os modos padrão (pool separado, ativável nas configurações)

#### 6.2 — Modo Combinado
- Cálculo mental com duas operações: "3 × 7 + 4 = ?"
- Para jogadores avançados com certificados de domínio conquistados
- Novo território educacional — cálculo mental, não só tabuada

---

## Mudanças de UI/UX a implementar na Fase 1

### Menu Principal — nova estrutura
```
[Card de Perfil — igual ao atual]

[Banner Desafio Diário — NOVO]
  🌟 Desafio de Hoje
  [▶ Começar] ou [✓ Feito hoje — Ver resultado]

[Botão grande: "Escolher Modo →"] — leva para ModesPage

[Linha: Missões | Loja | Estatísticas | Ranking]
[Linha: Conquistas | Temporada | Config]
```

### ModesPage — nova página
- Seção "Modos Principais": Rush, Sobrevivência, Velocidade, Desafio Diário
- Seção "Modos de Treino": Zen, Revisão
- Seção "Modos Avançados" (Fase 2+): Flashcard, Inverso, Difícil, Contra o Relógio
- Modos bloqueados aparecem com cadeado e requisito para desbloquear
- Design com cards grandes, gradiente de cada modo, descrição e dificuldade estimada

---

## Filosofia do Tabuada Rush 3.0

> "O Tabuada Rush 2.x era um jogo divertido que ensinava tabuada como efeito colateral.
> O Tabuada Rush 3.0 é um sistema de memorização científica embrulhado em um jogo irresistível."

**Três pilares:**
1. **Pedagogia Real:** Repetição Espaçada + Mapa de Domínio + Certificados por Tabuada
2. **Progressão Significativa:** O nível representa domínio real, não tempo jogado
3. **Retenção de Longo Prazo:** Social (leaderboard), Emocional (ofensiva, seguro), Novidade (eventos, modos desbloqueáveis)

---

## Instruções para a próxima sessão

**COMEÇAR PELA FASE 1:**

1. Ler esta sessão (sessao-025.md) + MEMORY_CORE.md
2. Implementar nesta ordem:
   a. Fix da missão impossível (mm_score_1200 → target 350)
   b. Página de Modos (ModesPage.jsx)
   c. Banner do Desafio Diário no Menu
   d. Mapa de Domínio Visual no Catálogo de Precisão
3. Build + commit + push + deploy
4. Registrar em sessao-026.md

**NÃO pular para Fase 2 sem ter Fase 1 completa.**
