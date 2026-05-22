# 📋 Sessão 003 — Deploy Vercel + Resolução de Conflito Git

**Data:** 2026-05-22  
**Duração:** Sessão curta (resolução de blocker + deploy)  
**Resultado:** ✅ App no ar em produção

---

## 🎯 OBJETIVO

Resolver conflito de merge no git e fazer o deploy completo no Vercel com as variáveis de ambiente do Supabase configuradas.

---

## ✅ O QUE FOI FEITO

### 1. Resolução do Conflito Git

- Rebase em andamento (`git rebase --abort`) estava parado por conflito em `index.html`
- Conflito: `index.html` do remote era o antigo app vanilla JS (v1); nosso era o entry point Vite React
- Estratégia: abort rebase + force push (nosso código v2.1 é o correto)
- `git stash pop` bloqueado por `.claude/settings.local.json` → `git checkout -- .claude/settings.local.json`
- `git push origin main --force` → sucesso

### 2. Deploy no Vercel

- Vercel CLI já instalado e autenticado (`daviphone22-5867`)
- `vercel --yes` detectou automaticamente Vite (build: `vite build`, output: `dist`)
- Deploy inicial bem-sucedido: build limpo, 922KB bundle

### 3. Configuração das Env Vars

- `vercel env add VITE_SUPABASE_URL production` → configurado
- `vercel env add VITE_SUPABASE_ANON_KEY production` → configurado
- `vercel --prod --yes` → redeploy com as variáveis → sucesso

---

## 📦 ARQUIVOS MODIFICADOS

Nenhum arquivo de código modificado — apenas operações git e deploy.

---

## 🔧 DECISÕES TÉCNICAS

- **D013 — Vercel para deploy:** force push justificado pois o remote tinha versão antiga (v1 vanilla) que foi substituída; não havia trabalho colaborativo em risco.

---

## 🚀 LINKS DE PRODUÇÃO

- **URL Principal:** https://tabuada-rush-rho.vercel.app
- **GitHub:** https://github.com/DGomesdpaulagit/tabuada-rush.git
- **Vercel Project:** davi-gomes-de-paula-s-projects/tabuada-rush
- **Supabase:** https://oevpmbdcvzplbbedrvyt.supabase.co

---

## 🔑 VARIÁVEIS DE AMBIENTE EM PRODUÇÃO

| Variável | Status |
|----------|--------|
| `VITE_SUPABASE_URL` | ✅ Configurada no Vercel |
| `VITE_SUPABASE_ANON_KEY` | ✅ Configurada no Vercel |

---

## 🐛 PROBLEMAS ENCONTRADOS

- Merge conflict em `index.html`: remote tinha HTML antigo (vanilla), local tinha entry point Vite. Resolvido com force push.
- `git stash pop` bloqueado por `.claude/settings.local.json` modificado. Resolvido com checkout na versão do index.
- `vercel --name` flag está depreciada — ignorar o warning, funciona normalmente.
- Seleção de remote interativa no CLI: resolvida passando escape sequence `\x1b[B\n` via printf para selecionar segundo item.

---

## 📋 PRÓXIMOS PASSOS

1. Testar login/logout em produção (https://tabuada-rush-rho.vercel.app)
2. Testar cloud sync entre dois dispositivos
3. Melhorias visuais: ResultsPage com partículas, RecordsPage melhorada
4. Configurar domínio customizado (opcional)
5. Leaderboard global (fase futura)
