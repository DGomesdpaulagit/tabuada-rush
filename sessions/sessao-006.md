# 📋 Sessão 006 — Fase 2 / Bloco 3: Ranking de QI Matemático

**Data:** 2026-05-25
**Duração:** Sessão média-longa (novo sistema completo)
**Resultado:** ✅ Sistema de Ranking de QI com 104 personagens, página dedicada, cálculo de QI e integração ao perfil — visual original preservado

---

## 🎯 OBJETIVO

Criar o sistema "Ranking de QI Matemático" — **lúdico** (NÃO mede QI real): transformar desempenho em classificação/personagem/posição, gerando identidade, progressão e sensação de evolução intelectual. Ocupa o espaço do antigo botão "2 Jogadores" (que no Bloco 1 virou placeholder "Ranking em breve").

---

## ✅ O QUE FOI FEITO

### 1. Página de Ranking (`src/pages/RankingPage.jsx` — NOVA)
- Segue o estilo das demais páginas (header com `ArrowLeft`, `pageVariants`, `Button` "Voltar ao Menu").
- **Hero do usuário:** card com gradiente do tier atual, avatar (emoji do personagem), nome do personagem, classificação intelectual, **QI**, **posição (#X de Y)** e barra de progresso até o próximo personagem.
- **Lista completa** agrupada por categoria (baixo/médio/alto/gênio), cada personagem com posição, avatar, nome e descrição. Personagens já alcançados aparecem coloridos; futuros ficam em grayscale/opacidade. O personagem atual é destacado (ring + accent do tier + selo "VOCÊ").

### 2. Sistema de personagens (`src/constants/characters.js` — NOVO)
- **104 personagens** (>100 exigido), 26 por categoria, nomes únicos.
- Cada personagem: `name`, `emoji` (avatar/símbolo), `tier`, `desc`.
- **CARICATURAS / versões inspiradas** (paródia) — não cópias de IP oficial. Ex.: Burro Tagarela, Esponja Animada, Ogro Rabugento, Bruxo de Óculos, Detetive de Cachimbo, Morcego Sombrio, Homem de Ferro-Velho, Cabeludo da Relatividade, O Físico da Cadeira, O Pai da Reação, etc.
- `TIERS` (metadados: label, classification, cores/gradientes no estilo do projeto) + `TIER_ORDER`.
- Ordenado do menor ao maior nível intelectual → escalável (limiares de QI derivados do índice, não hardcoded).

### 3. Cálculo de QI (`src/utils/index.js`)
- `computeQI(data)`: combina precisão (lifetime + melhor), velocidade (speedBest), ofensiva (currentStreak + bestDayStreak), consistência (totalGames) e progresso (nível). Base 70, faixa lúdica **70–200**.
- `getQiInfo(data)`: mapeia QI → índice/posição/personagem/tier + progresso fracionário até o próximo. (`QI_MIN`/`QI_MAX` em characters.js.)
- **Testado em Node:** novo→QI70 "Burro Tagarela" (pos 1); médio→QI131 "Engenheiro Criativo" (pos 49); forte→QI200 "O Iluminado" (pos 104). Distribuição 26/26/26/26. ✅

### 4. Integração ao Menu/Perfil
- `MenuPage.jsx`: botão placeholder "Ranking em breve" → **"Ranking QI"** funcional (`onNavigate('ranking')`).
- Linha de QI no card de perfil (pequena, integrada, abaixo do nível): `{emoji} QI {qi} · {personagem}` — clicável, leva ao ranking. Mantém o gradiente violeta sem poluir.
- `App.jsx`: import `RankingPage` + rota `screen === 'ranking'`.

---

## 📦 ARQUIVOS

| Arquivo | Mudança |
|---------|---------|
| `src/constants/characters.js` | **NOVO** — 104 personagens + TIERS + QI_MIN/MAX |
| `src/pages/RankingPage.jsx` | **NOVO** — página de ranking |
| `src/utils/index.js` | `computeQI`, `getQiInfo` + imports de characters |
| `src/App.jsx` | import + rota `ranking` |
| `src/pages/MenuPage.jsx` | botão "Ranking QI" + linha de QI no perfil |

---

## 🔧 DECISÕES TÉCNICAS

- **D021 — Limiares de QI derivados do índice:** CHARACTERS é apenas uma lista ordenada; o QI mapeia para posição via `ratio*(len-1)`. Adicionar/remover personagens é trivial (nenhum número a reajustar). Escalável conforme pedido.
- **D022 — Personagens como caricaturas:** nomes estilizados/paródia + emoji, evitando cópia de IP oficial, mantendo o humor/referência pedidos.
- **D023 — QI lúdico (70–200):** fórmula combina os fatores pedidos (precisão/velocidade/ofensiva/consistência/progresso). Novo usuário começa no piso (70 → personagem mais baixo) e sobe com a evolução — sensação de progresso desde cedo.
- **D024 — Avatar = emoji:** reaproveita a estética de emojis já usada nos níveis/modos; zero assets externos, sem transformar o visual.
- **D025 — QI no perfil discreto:** uma linha pequena e clicável, sem nova seção pesada, atendendo "pequeno/organizado/integrado".

---

## 🎨 IDENTIDADE VISUAL

✅ **Preservada.** Cores por tier usam tokens do projeto (slate/blue/violet/amber), mesmos componentes (`Progress`, `Button`), mesmos formatos (rounded-3xl/2xl, font-black, gradientes). Sem redesign. Build sem erros de console/servidor.

---

## 🐛 PROBLEMAS / OBSERVAÇÕES

- Transição de página (`AnimatePresence mode="wait"`) não roda no preview headless → não foi possível ver a RankingPage renderizada no tool. Verificação: build limpo, lógica testada em Node, e padrão idêntico ao da RecordsPage (que funciona). Card de perfil com QI confirmado no DOM ("🫏 QI 70 · Burro Tagarela").

---

## 🔁 AJUSTE (mesma sessão) — Personagens reais/reconhecíveis

A primeira versão usava nomes genéricos/adjetivos ("Mente Brilhante", "Cabeludo da
Relatividade" etc.). Conforme feedback, **substituídos por personagens FAMOSOS e
reconhecíveis**, mantendo 104 personagens (26 por categoria), avatar em emoji e a
mesma estrutura/lógica (sem mudança de código além de `characters.js`).

- **Baixo (engraçados):** Patrick, Burro do Shrek, Homer, Bob Esponja, Sid, Pinky, Scooby, Olaf, Minions, Garfield, Pateta, Mr. Bean, Po, Pumba, Dory, Bart, Kevin Malone, Joey, Cartman, Patolino, Piu-Piu, Coragem, Gary, Timão, Jar Jar, Plankton.
- **Médio (heróis/aventureiros):** Shrek, Mario, Sonic, Pikachu, Harry Potter, Goku, Luffy, Naruto, Buzz, Woody, Aladdin, Simba, Jack Sparrow, Indiana Jones, Katniss, Aang, Homem-Aranha, Thor, Mulan, Link, Mega Man, Kirby, He-Man, Wolverine, Capitão América, Ben 10.
- **Alto (estrategistas/calculistas):** Batman, Sherlock, Hermione, Tony Stark, Dr. Estranho, L, Light, Lex Luthor, Professor X, Yoda, Gandalf, Dumbledore, Walter White, Tyrion, Loki, Moriarty, Magneto, Gru, Megamente, Velma, Lisa Simpson, Stewie, Mycroft, Hannibal, Dr. Octopus, Bruce Banner.
- **Gênio (cientistas/gênios):** Rick Sanchez, Da Vinci, Galileu, Arquimedes, Pitágoras, Euclides, Sócrates, Aristóteles, Darwin, Kepler, Ada Lovelace, Hipátia, Carl Sagan, Schrödinger, Max Planck, Feynman, Gauss, Babbage, Marie Curie, Turing, Newton, Tesla, Oppenheimer, Hawking, Ramanujan, **Albert Einstein (topo)**.

**Verificado no preview:** usuário novo → "⭐ QI 70 · Patrick Estrela"; usuário forte → "🧠 QI 200 · Albert Einstein". Sem erros. Avatares continuam sendo emoji (sem imagens externas), preservando o visual.

- **D026 — Personagens reais como rótulos + emoji:** nomes de personagens/figuras são apenas referências (não material protegido); avatar é emoji (estética existente, sem assets externos). Atende ao pedido de identificação visual forte sem redesign.

---

## 📋 PRÓXIMOS PASSOS

1. Testar a RankingPage em browser real (transições Framer Motion)
2. Blocos futuros (NÃO implementados): loja, moedas, recompensas avançadas, temporadas, sistema social, dashboard, análise inteligente, gráficos avançados, catálogo completo, marketplace, missões
3. Possível polish: animação ao subir de classificação / desbloquear novo personagem; auto-scroll até o personagem atual na lista
