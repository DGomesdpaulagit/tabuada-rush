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

## ✅ Checagem de processo (D042 — a sessão 063 pulou o passo 1 sem eu notar)
Antes de considerar qualquer sessão encerrada, conferir que a `Versão` no topo de
`MEMORY_CORE.md` bate com a última entrada de `CHANGELOG.md`. **Se não bater, a
rotina acima não foi cumprida** — voltar e completar os passos 1 e 4 antes de seguir
pra outra coisa. Commit+push sozinho (passo 2) NÃO conta como sessão registrada.

## 📋 Planejamento antes de codar (pedido do Davi, sessão 064)
`PLANO_ACAO.md` (raiz) é o backlog vivo — ler antes de começar qualquer trabalho novo,
atualizar (marcar itens, mover de fase) ao terminar cada fase. Ideias que surgirem no
meio de uma fase e não pertencem a ela vão pra `PENDENCIAS.md`, não pro meio da fase
em andamento. Não implementar uma fase nova sem o Davi ter confirmado o plano dela.

## 🖼️ Referência visual ambígua → pedir "imagem base" (pedido do Davi, sessão 078)
Quando uma feature visual nova depender de posicionamento/layout que só texto não
resolve (onde exatamente um ícone fica, como um elemento se comporta visualmente),
não adivinhar. Pedir ao Davi pra baixar uma imagem de referência ("base") — e sou EU
quem dá o nome do arquivo (não ele), pra facilitar localizar depois no Downloads
(que já acumula dezenas de arquivos de sessões diferentes). Ele confirma o nome,
salva assim, eu processo a partir daí. Motivo: confusão de nomes/arquivos já causou
retrabalho real na revisão da Fase 7 (ver D056, sessao-078.md).

## 📸 Verificação visual (resolvido na sessão 084 — ver D062)

Dá pra tirar screenshot das telas do jogo. Com `npm run dev` rodando:

```
node scripts/tirar-telas.mjs                      # 13 telas do resumo pós-partida
node scripts/tirar-telas.mjs "screen=menu" menu   # uma tela específica
```

Saída em `telas/` (fora do Git). Antes de dizer que uma mudança visual
está pronta, **capturar e olhar** — foi assim que apareceram problemas que
asserção de DOM não pegava.

**Por que o `&still=1`** (o script já põe sozinho): o framer-motion anima
por `requestAnimationFrame`, que o navegador não roda sem janela sendo
pintada; sem a flag a tela congela no primeiro quadro da animação e sai
deslocada. Isso era o D034 — não é mais impedimento.

## Estrutura
- `src/constants/` — `index.js` (MODES, LEVELS 28 c/ title, ACHIEVEMENTS, STREAK_GOALS), `characters.js` (104 personagens do Ranking de QI).
- `src/utils/index.js` — geração de perguntas, scoring, datas, `computeQI`/`getQiInfo`.
- `src/lib/storage.js` — localStorage (KEY `tabuada_rush_v2`).
- `src/pages/` — Menu, Game, Results, Records, Stats, Achievements, Ranking, Auth.
- `src/App.jsx` — orquestrador (navegação por `screen`, `handleGameEnd`, toasts).

## Contexto / memória
Ler em ordem: `MEMORY_CORE.md` → `MEMORY.md` → `PLANO_ACAO.md` → última `sessions/sessao-00X.md` → `BUGS.md`.

## Git/Deploy
- Remote canônico: `origin` (github.com/DGomesdpaulagit/tabuada-rush). Branch `main`.
- Produção Vercel: https://tabuada-rush-rho.vercel.app
- NUNCA commitar `.env` (Supabase keys) — já está no `.gitignore`.
