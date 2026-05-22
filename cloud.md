# ☁️ cloud.md — Continuidade entre Sessões

> Ler primeiro ao retomar o projeto. Atualizar ao final de cada sessão.

---

## 🔄 ONDE PARAMOS

**Sessão:** 002  
**Data:** 2026-05-22  
**Resultado:** Implementação da Fase 2 — Auth + Audio + Cloud Sync + Export

---

## 🚀 COMO CONTINUAR

```bash
cd C:\Users\HP\Documents\TabuadaRush
npm run dev
# → http://localhost:3000
```

---

## 📋 PRÓXIMO PASSO IMEDIATO

1. Configurar Supabase seguindo `SUPABASE_SETUP.md`
2. Criar `.env` com as credenciais
3. Testar login/cadastro em browser real
4. Deploy no Vercel

---

## 🔗 LINKS IMPORTANTES

- **Dev local:** `http://localhost:3000`
- **GitHub:** (configurar remote)
- **Deploy:** (ainda não feito — próxima sessão)
- **Supabase:** (ainda não configurado — próxima sessão)

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

## ⚙️ CONFIGURAÇÃO PARA TESTAR AUTH

Criar arquivo `.env` na raiz:
```
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-aqui
```

Executar SQL do `SUPABASE_SETUP.md` no painel do Supabase.
