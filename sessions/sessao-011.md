# 📋 Sessão 011 — Gráfico de evolução focado no Desafio Diário

**Data:** 2026-05-26
**Duração:** Sessão curta (ajuste pontual)
**Resultado:** ✅ Gráfico "Evolução de Pontos" agora considera apenas as partidas do Desafio Diário

---

## 🎯 OBJETIVO

O gráfico de evolução de pontos deve refletir somente as sessões do modo **Desafio Diário**
(comparação justa: mesmas 20 perguntas determinísticas por dia, ideal para medir evolução).

---

## ✅ O QUE FOI FEITO

- `StatsPage.jsx`: `chartData` agora filtra `s.mode === 'daily'` antes de pegar as últimas 20.
- Título do card: "Evolução de Pontos" → **"Evolução — Desafio Diário"** + subtítulo explicativo.
- Estado vazio ajustado: "Jogue mais alguns Desafios Diários para ver sua evolução."

---

## 📦 ARQUIVOS

| Arquivo | Mudança |
|---------|---------|
| `src/pages/StatsPage.jsx` | gráfico filtra modo `daily`; título/estado-vazio atualizados |

---

## 🔧 DECISÃO TÉCNICA

- **D043 — Gráfico só do Desafio Diário:** o diário usa perguntas fixas por dia, então a pontuação
  é comparável entre dias — base mais honesta para "evolução" que misturar todos os modos.

---

## 🎨 IDENTIDADE VISUAL

✅ Inalterada — só filtro de dados + textos do card.

---

## 📋 PRÓXIMOS PASSOS / SESSÕES / ETAPAS

1. Economia/Loja (uso completo das moedas).
2. Leaderboard global via Supabase.
3. Futuros: temporadas, sistema social, recompensas avançadas, gráficos avançados, catálogo, marketplace, missões.
4. Possível: exibir `fastestAvgMs` como recorde de velocidade.
