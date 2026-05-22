# ☁️ cloud.md — Continuidade entre Sessões

> Ler primeiro ao retomar o projeto. Atualizar ao final de cada sessão.

---

## 🔄 ONDE PARAMOS

**Sessão:** 003  
**Data:** 2026-05-22  
**Resultado:** Deploy no Vercel concluído — app em produção com Supabase configurado

---

## 🚀 COMO CONTINUAR

```bash
cd C:\Users\HP\Documents\TabuadaRush
npm run dev
# → http://localhost:3000
```

---

## 📋 PRÓXIMO PASSO IMEDIATO

1. Testar login/logout em produção (https://tabuada-rush-rho.vercel.app)
2. Testar cloud sync entre dois dispositivos
3. Melhorias visuais: ResultsPage, partículas, RecordsPage
4. Domínio customizado (opcional)

---

## 🔗 LINKS IMPORTANTES

- **Dev local:** `http://localhost:3000`
- **GitHub:** https://github.com/DGomesdpaulagit/tabuada-rush.git
- **Deploy (produção):** https://tabuada-rush-rho.vercel.app
- **Supabase:** https://oevpmbdcvzplbbedrvyt.supabase.co

---

## 📂 ESTRUTURA DO PROJETO

```
C:\Users\HP\Documents\TabuadaRush\
├── src/
│   ├── contexts/
│   │   ├── AppContext.jsx     ← data state + cloud sync
│   │   └── AuthContext.jsx    ← auth state (NEW)
│   ├── hooks/
│   │   └── useAudio.js        ← audio toggle hook (NEW)
│   ├── lib/
│   │   ├── audioManager.js    ← Web Audio API (NEW)
│   │   ├── storage.js         ← localStorage
│   │   └── supabase.js        ← Supabase client (NEW)
│   ├── pages/
│   │   ├── AuthPage.jsx       ← login/register UI (NEW)
│   │   ├── GamePage.jsx       ← + audio feedback
│   │   ├── MenuPage.jsx       ← + streak, auth btn, audio toggle
│   │   └── StatsPage.jsx      ← + export JSON/CSV
│   └── services/
│       └── sync.js            ← cloud save/load (NEW)
├── SUPABASE_SETUP.md          ← guia passo a passo (NEW)
├── .env.example               ← template de env vars (NEW)
├── MEMORY.md                  ← DNA do projeto
├── MEMORY_CORE.md             ← estado atual
├── cloud.md                   ← este arquivo
├── CHANGELOG.md               ← histórico
├── BUGS.md                    ← bugs
├── DECISIONS.md               ← decisões arquiteturais
└── sessions/                  ← logs por sessão
    ├── sessao-001.md
    └── sessao-002.md
```

---

## ⚙️ CONFIGURAÇÃO LOCAL

Criar arquivo `.env` na raiz (não commitado):
```
VITE_SUPABASE_URL=https://oevpmbdcvzplbbedrvyt.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

As mesmas variáveis estão configuradas no Vercel para produção.

## 🚀 DEPLOY

- Plataforma: Vercel
- Projeto: `davi-gomes-de-paula-s-projects/tabuada-rush`
- Branch: `main` → auto-deploy ativo
- Para redesploiar: `vercel --prod --yes` ou push no GitHub
