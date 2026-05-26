# 📋 Sessão 014 — Modo escuro: fundo global da tela

**Data:** 2026-05-26
**Duração:** Sessão curta (correção de tema)
**Resultado:** ✅ No modo escuro, a TELA INTEIRA escurece (não só os cards) — html, body e container raiz

---

## 🎯 OBJETIVO

Corrigir o modo escuro: o fundo global continuava claro (só os cards escureciam),
criando "blocos escuros sobre tela clara", especialmente no mobile.

---

## 🐛 CAUSA

O `<div>` raiz do App usava `bg-[hsl(250,30%,98%)]` (classe arbitrária fixa) que cobria o
body com cor clara e NÃO era adaptada no `html.dark`. Resultado: body atrás escurecia, mas o
container claro por cima permanecia.

---

## ✅ O QUE FOI FEITO

- `App.jsx`: container raiz trocou `bg-[hsl(250,30%,98%)]` → classe semântica **`app-shell`**.
- `globals.css`:
  - `.app-shell { background-color: var(--background); }` → no claro, **cor idêntica à original** (sem mudança visual).
  - `html.dark { background-color: hsl(240 12% 11%); }` → cobre overscroll/áreas do mobile.
  - `html.dark body` e `html.dark .app-shell` → mesmo escuro.
- Resultado: html + body + container raiz escurecem juntos → tela inteira coerente.

---

## 📦 ARQUIVOS

| Arquivo | Mudança |
|---------|---------|
| `src/App.jsx` | container raiz usa `app-shell` (em vez de bg arbitrário claro) |
| `src/styles/globals.css` | `.app-shell` adaptativo + `html.dark` no html/body/app-shell |

---

## 🔧 DECISÃO TÉCNICA

- **D049 — Fundo global via classe semântica:** `.app-shell` = `var(--background)` (claro original) e escuro no dark. Evita classe arbitrária não-adaptável e garante tela 100% escura, inclusive html (mobile overscroll).

---

## 🎨 IDENTIDADE VISUAL

✅ Modo claro idêntico ao original (mesma cor de fundo). Cores da marca intactas. No escuro só o fundo/neutros adaptam.

---

## ✅ VERIFICAÇÃO

- Claro: `.app-shell` = rgb(249,248,251) (original). Escuro: html/body/`.app-shell` = rgb(25,25,31). ✓

---

## 📋 PRÓXIMOS PASSOS / SESSÕES / ETAPAS

1. Economia/Loja (uso das moedas).
2. Leaderboard global via Supabase.
3. Música de fundo real + notificações reais.
4. Futuros: temporadas, sistema social, recompensas avançadas, gráficos, catálogo, marketplace, missões.
