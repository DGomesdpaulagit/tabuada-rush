# 📦 RECURSOS.md — Catálogo de Recursos do Tabuada Rush

> Documento de referência único pros 3 tipos de recurso do jogo (Baús,
> Power-ups, Poções): o que cada um faz, quanto vale, e a probabilidade
> de aparecer. Compilado a partir do código-fonte real (`constants/shop.js`,
> `constants/loot.js`) em 2026-08-25 (sessão 078) — é a fonte de verdade,
> atualizar aqui sempre que os números do jogo mudarem.

---

## 🧰 Power-ups

6 power-ups. Compráveis na Loja rotativa (Fase 5) ou achados jogando (loot
de partida, Fase 6). `intervalMédio` = média de partidas até aparecer
como drop — é uma média estatística, não um contador (pode vir na 1ª
partida por sorte, raro mas possível). Ver `utils/loot.js`.

| Recurso                | O que faz                                                                  | Preço na Loja | Raridade (Loja) | Intervalo médio de drop | Ícone padrão                                                                                   |
| ---------------------- | -------------------------------------------------------------------------- | ------------: | --------------- | ----------------------: | ---------------------------------------------------------------------------------------------- |
| **Seguro de Ofensiva** | Salva sua ofensiva se você quebrá-la — restaura automaticamente em até 24h |    100 moedas | Raro 🔵         |           1-15 partidas | `ofensiva-congelada` (chama azul congelada — **NÃO é um escudo**, apesar do emoji 🛡️ do item) |
| **Congelar Missão**    | Estende em 10 dias o prazo de um desafio mensal aceito                     |     50 moedas | Comum ⚪         |            1-5 partidas | `pu-congelar`                                                                                  |
| **Vida Extra**         | Restaura 1 vida quando você perder a última — não deixa o jogo acabar      |     80 moedas | Comum ⚪         |            1-7 partidas | `pu-vida-extra` (coração+cruz, ícone dedicado — não é o genérico de vidas)                     |
| **+60s no relógio**    | Adiciona 60 segundos ao cronômetro durante a partida                       |    120 moedas | Raro 🔵         |           1-10 partidas | `pu-tempo`                                                                                     |
| **Escudo**             | Protege do próximo erro — a vida não é descontada dessa vez. Ativa sozinho |    100 moedas | Raro 🔵         |           1-10 partidas | `pu-escudo`                                                                                    |
| **Largada Turbo**      | Começa a próxima partida de Rush já com +10s no relógio                    |     90 moedas | Comum ⚪         |            1-6 partidas | `pu-largada`                                                                                   |

**Baú-embalagem (D054, quando achado por loot, não comprado):** cada
power-up tem uma classificação PRÓPRIA de baú (diferente da Raridade da
Loja acima) — ver seção "Baú como embalagem" abaixo.

---

## 🧪 Poções de XP

3 poções. Multiplicam o XP ganho por um período de TEMPO (não por 1
partida como o antigo "XP Dobrado", removido na Fase 2) — pode cobrir
várias partidas ou nenhuma, dependendo de quanto o jogador joga na
janela. Duração é o MÁXIMO, não acumula tempo não usado. Só 1 poção
ativa por vez (ativar outra enquanto uma já está rodando é bloqueado).

| Poção | Multiplicador | Duração máxima | Preço na Loja | Intervalo médio de drop | Ícone |
|---|---:|---:|---:|---:|---|
| **×1,5** | ×1.5 XP | 40 min | 300 moedas | 4-10 partidas | `pocao-xp-1` (frasco tubo fino) |
| **×2** | ×2 XP | 25 min | 750 moedas | 5-15 partidas | `pocao-xp-2` (frasco erlenmeyer) |
| **×3** | ×3 XP | 15 min | 1.350 moedas | 1-15 partidas | `pocao-xp-3` (frasco redondo) |

Mapeamento de formato→tier confirmado pelo Davi (sessão 066): tubo=×1,5,
erlenmeyer=×2, redonda=×3.

---

## 💰 Baús (moeda)

**Arte (sessão 080):** cada baú tem DUAS versões — `bau-<tier>`
(fechado, usado na Mochila/decoração) e `bau-<tier>-aberto` (aberto, com
as moedas à vista), usado na página de recompensa do resumo pós-partida.

4 tiers. **Só valem pra baú COM MOEDA** — a Loja não vende baú (não tem
preço, não se compra). Só aparecem como loot de partida.

| Baú         | Intervalo médio de drop |              Moedas | Ícone         |
| ----------- | ----------------------: | ------------------: | ------------- |
| **Madeira** |           3-10 partidas |  10-100 (aleatório) | `bau-madeira` |
| **Ferro**   |           1-25 partidas | 200-400 (aleatório) | `bau-ferro`   |
| **Ouro**    |           1-40 partidas | 500-800 (aleatório) | `bau-ouro`    |
| **Místico** |           1-50 partidas |        1.000 (fixo) | `bau-mistico` |

---

## ⏱️ Modificador de chance por tempo real de partida

A duração REAL da partida (relógio de parede, medido em `GamePage.jsx`
desde a sessão 071 — antes tinha um bug que ignorava o bônus de tempo
por combo do Rush) multiplica a chance de CADA categoria de drop:

| Duração real da partida | Chance de Baú | Chance de Power-up | Chance de Poção |
|---|---:|---:|---:|
| 1-5 min | 30% | 60% | 50% |
| 6-20 min | 50% | 90% | 70% |
| 21-50 min | 80% | 100% | 95% |
| 51+ min (~1h) | 100% (garantido) | 200% (garantido 2x) | 195% (garantido 1x + 95% de +1) |

Acima de 100%: `floor(pct/100)` unidades garantidas + 1 rolagem extra com
o resto (`pct % 100`)%. Cada partida é uma rolagem independente — não é
um contador até garantir.

**Zen não sorteia loot nenhum** (sem timer, viraria farm parado — decisão
D049).

---

## 📦 Baú como EMBALAGEM de recurso (visual, D052→D054)

Quando um power-up ou poção é achado (não comprado), a página de
recompensa mostra ele já fundido visualmente com um baú — mas esse baú é
só DECORAÇÃO, tem uma classificação PRÓPRIA, separada da Raridade da
Loja e da frequência de drop acima:

| Baú (visual) | Recursos |
|---|---|
| **Madeira** | Congelar Missão, Vida Extra |
| **Ferro** | Largada Turbo, Poção ×1,5 |
| **Ouro** | Seguro de Ofensiva, +60s no relógio, Escudo, Poção ×2 |
| **Místico** | Poção ×3 (sozinha — o recurso mais raro) |

Ícones combo prontos (recurso+baú numa imagem só, arte do Davi, sessão
076-077): `combo-congelar`, `combo-vida-extra`, `combo-largada`,
`combo-pocao-1`, `combo-tempo`, `combo-escudo`, `combo-pocao-2`,
`combo-pocao-3` — **falta só `combo-streak-insurance` (Seguro de
Ofensiva)**, 2 gerações seguidas saíram erradas porque o prompt anterior
pedia um ESCUDO por engano — o ícone certo é a chama azul congelada
(`ofensiva-congelada`), ver correção na sessão 078.

---

## 🗂️ Onde cada número vive no código

| Dado | Arquivo |
|---|---|
| Preço, raridade, ícone, descrição dos power-ups/poções | `src/constants/shop.js` |
| Intervalo médio de drop, faixas de moeda dos baús, tabela de tempo | `src/constants/loot.js` |
| Algoritmo de sorteio (RNG por peso, `rollCount`) | `src/utils/loot.js` |
| Mapeamento recurso→baú-embalagem (visual) | `src/pages/PostGameSummary.jsx` (`REWARD_COMBO`/`FALLBACK_CHEST`) |
| Gênero gramatical de cada item ("um"/"uma") | `src/pages/PostGameSummary.jsx` (`LOOT_GENDER`) |

**Regra permanente:** ao adicionar um recurso novo em qualquer um dos
arquivos acima, atualizar também este documento.
