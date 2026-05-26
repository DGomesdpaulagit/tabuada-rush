# CLAUDE.md — Instruções do Projeto Tabuada Rush

App **React 18 + Vite 5** (PWA educacional de tabuada). Persistência em localStorage
+ Supabase (auth/cloud sync opcional). Estilo: TailwindCSS + Framer Motion, paleta
violeta, fonte Nunito. **Não alterar a identidade visual** ao implementar features.

## Como rodar
- `npm run dev` → http://localhost:3000 (NUNCA abrir o `index.html` direto pelo file:// — tela branca por CORS/módulo ES).
- `npm run build` / `npm run preview`.

## 📌 ROTINA OBRIGATÓRIA DE FIM DE BLOCO/SESSÃO
> Definida pelo usuário (Davi). Executar ao concluir CADA bloco ou sessão, nesta ordem:

1. **Registros completos** nos arquivos de registro (são também o vault do Obsidian — esta pasta):
   - `sessions/sessao-00X.md` (nova sessão), `CHANGELOG.md`, `MEMORY_CORE.md`, `MEMORY.md`,
     e `BUGS.md`/`DECISIONS.md` quando aplicável.
2. **Commit + Push no GitHub**: `git add -A` (o `.gitignore` já protege `.env`/`.vercel`/`.obsidian`)
   → commit descritivo → `git push origin main`.
3. **Deploy no Vercel**: AUTOMÁTICO via integração Git (Vercel↔GitHub). O push do passo 2
   dispara o deploy de produção sozinho — NÃO rodar `npx vercel` (o token CLI expirou).
   - Fallback manual (só se a integração cair): o usuário roda `vercel login` e então `npx vercel --prod --yes`.
4. **Resumo final** (apresentar ao usuário no chat): o que foi feito neste bloco
   + **próximos passos, sessões e etapas** (roadmap do que vem a seguir). Deve bater com a
   seção "Próximos passos" da `sessions/sessao-00X.md`.

Notas:
- **Obsidian**: os `.md` de registro vivem nesta pasta (que é o vault). Mantê-los atualizados JÁ cobre o Obsidian.
- Esta rotina é executada por mim ao final de cada bloco enquanto a sessão está ativa.
  Não é um hook automático (deploy cego a cada parada seria arriscado).

## Estrutura
- `src/constants/` — `index.js` (MODES, LEVELS 28 c/ title, ACHIEVEMENTS, STREAK_GOALS), `characters.js` (104 personagens do Ranking de QI).
- `src/utils/index.js` — geração de perguntas, scoring, datas, `computeQI`/`getQiInfo`.
- `src/lib/storage.js` — localStorage (KEY `tabuada_rush_v2`).
- `src/pages/` — Menu, Game, Results, Records, Stats, Achievements, Ranking, Auth.
- `src/App.jsx` — orquestrador (navegação por `screen`, `handleGameEnd`, toasts).

## Contexto / memória
Ler em ordem: `MEMORY_CORE.md` → `MEMORY.md` → última `sessions/sessao-00X.md` → `BUGS.md`.

## Git/Deploy
- Remote canônico: `origin` (github.com/DGomesdpaulagit/tabuada-rush). Branch `main`.
- Produção Vercel: https://tabuada-rush-rho.vercel.app
- NUNCA commitar `.env` (Supabase keys) — já está no `.gitignore`.
