# 📝 CHANGELOG

Todas as mudanças notáveis do projeto são documentadas aqui.

---

## [2.5.1] — 2026-05-26 — POLISH: ANIMAÇÕES DE EVOLUÇÃO

### Adicionado
- Auto-scroll até o personagem atual ao abrir a página de Ranking de QI
- Toast animado "Nova Classificação!" ao subir de personagem no Ranking (além do toast de level-up já existente)

---

## [2.5.0] — 2026-05-26 — DEPLOY AUTOMÁTICO + REBALANCEAMENTO DE XP

### Adicionado
- Rotina de fim de bloco/sessão (`CLAUDE.md`): registros → push → deploy auto → resumo
- Deploy automático via integração Git Vercel↔GitHub (push em `main` publica produção)

### Alterado
- **XP mais "real" / difícil de subir de nível:**
  - Curva de níveis íngreme (deltas crescentes ~×1.235); topo 90.000 → **227.900 XP**
  - Ganho de XP por partida agora é modesto: `round(score×0.5) + bônus diário(20) + ofensiva(≤30)` (antes: score cheio + bônus maiores)

### Nota
- Retrocompatível (níveis por XP); identidade visual inalterada

---

## [2.4.0] — 2026-05-25 — FASE 2 / BLOCO 3: RANKING DE QI MATEMÁTICO

### Adicionado
- **Sistema "Ranking de QI Matemático"** (lúdico — não mede QI real)
- Página de Ranking (`RankingPage.jsx`): hero do usuário (QI, personagem, classificação, posição, progresso) + lista completa por categoria com destaque do personagem atual
- **104 personagens** (`constants/characters.js`) em 4 categorias (baixo/médio/alto/gênio), 26 cada — **personagens famosos e reconhecíveis** (Patrick → Einstein) com nome, emoji/avatar, descrição e posição
- Cálculo de QI (`computeQI`) baseado em precisão, velocidade, ofensiva, consistência e progresso; faixa lúdica 70–200
- `getQiInfo` mapeia QI → posição/personagem/tier + progresso até o próximo
- Botão "Ranking QI" no menu (substitui o placeholder "Ranking em breve")
- Linha de QI/classificação no card de perfil (pequena, integrada, clicável)

### Nota
- Identidade visual, cores e estética originais preservadas (avatares = emoji, tokens de cor do projeto)

---

## [2.3.0] — 2026-05-25 — FASE 2 / BLOCO 2: PERFIL E IDENTIDADE DO USUÁRIO

### Adicionado
- Sistema de níveis expandido: **7 → 28 níveis**, cada um com nome, **título** e emoji/avatar
- Sistema de títulos do usuário (muda conforme o nível) — visível no card de perfil e na ResultsPage
- Sistema de ofensiva diária com recorde (`bestDayStreak`)
- Meta de ofensiva pessoal (`streakGoal`: 7/15/30/100 dias) com barra de progresso e seleção por pills
- Card de perfil expandido: avatar, título, nível, XP, barra de progresso, ofensiva, recorde e meta — no mesmo gradiente violeta
- XP agora também vem de bônus: desafio diário (+30) e ofensiva diária mantida

### Melhorado
- `handleGameEnd`: cálculo de XP integra score + bônus de diário + bônus de ofensiva
- Persistência: novos campos `bestDayStreak` e `streakGoal` (retrocompatível via DEFAULTS)

### Corrigido / Alterado
- **Desafio Diário não fica mais bloqueado** — sempre acessível; badge "✓ hoje" apenas informativo

### Nota
- Identidade visual, cores, layout e estética originais 100% preservados

---

## [2.2.0] — 2026-05-25 — FASE 1 / BLOCO 1: REMOÇÃO DO 2 JOGADORES

### Removido
- Modo 2 Jogadores completamente removido (sem código morto)
  - Deletado `src/pages/BattlePage.jsx`
  - Removido import + rota `battle` em `App.jsx`
  - Removido botão "2 Jogadores" e ícone `Swords` do `MenuPage.jsx`

### Adicionado
- Placeholder "Ranking em breve" (botão desabilitado, ícone `Medal`) no lugar do antigo botão 2 Jogadores — reserva o espaço para a futura página "Ranking de QI Matemático"

### Melhorado
- Card de perfil (level card) marcado estruturalmente para futuras adições (ofensiva, ranking, QI, recompensas) — sem alteração visual

### Nota
- Identidade visual, cores, layout e estética originais 100% preservados

---

## [2.1.1] — 2026-05-22 — DEPLOY VERCEL

### Adicionado
- Deploy em produção: https://tabuada-rush-rho.vercel.app
- Variáveis de ambiente configuradas no Vercel (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)

### Corrigido
- Conflito de merge no `index.html` resolvido via force push (remote tinha versão v1 vanilla)

---

## [2.1.0] — 2026-05-22 — FASE 2: AUTH + AUDIO + CLOUD

### Adicionado
- Sistema de áudio via Web Audio API (zero arquivos — 100% sintetizado)
  - 10 sons: correct, wrong, combo, levelUp, achievement, gameOver, victory, click, timerWarning, newRecord
  - Mute/unmute com persistência em localStorage
  - Hook `useAudio` para toggle no UI
- Autenticação com Supabase (email/senha)
  - AuthPage com tabs login/cadastro, validação e feedback
  - Login opcional — app funciona 100% sem conta
  - Botão de logout no header do menu
- Sincronização em nuvem via Supabase
  - Migração automática: localStorage → Supabase no primeiro login
  - Sync automático após cada partida
  - Degradação graceful sem credenciais configuradas
- Exportação de dados na StatsPage
  - JSON completo (stats + conquistas + histórico)
  - CSV do histórico de sessões
- Streak diária visível no level card (🔥 N dias)
- Toast "Novo Recorde!" além de level up e conquistas
- `SUPABASE_SETUP.md` — guia passo a passo para configurar backend
- `.env.example` — template de variáveis de ambiente

### Melhorado
- MenuPage: controles de áudio e auth no header
- GamePage: sons em todos os eventos (acerto, erro, combo, timer, fim)
- AppContext: sync automático com cloud quando logado
- Lógica de streak mais precisa (não duplica em jogos múltiplos no mesmo dia)

### Corrigido
- Removido React.StrictMode (conflito com Framer Motion AnimatePresence)
- Bug de streak: mantém valor se já jogou hoje (não incrementa duas vezes)

---

## [2.0.0] — 2026-05-22 — RECONSTRUÇÃO COMPLETA

### Adicionado
- React 18 + Vite 5 substituindo HTML/JS/CSS vanilla
- TailwindCSS 3 com design system completo
- Framer Motion para todas as animações
- Recharts para gráfico de evolução nas estatísticas
- Lucide React para ícones consistentes
- Design system com tokens CSS (paleta por modo)
- Font Nunito (Black 900 para impacto visual)
- Gradientes únicos por modo (violet, rose, amber, emerald)
- GamePage com useReducer (arquitetura limpa de estado)
- AchievementsPage com 16 conquistas e estados visuais
- BattlePage modo 2 jogadores local (split screen)
- Toast animado para conquistas desbloqueadas
- Toast animado para level up
- Sistema de memória persistente (MEMORY.md, etc.)
- .claude/launch.json para preview integrado

### Melhorado
- Modo Sobrevivência agora conta tempo decorrido
- Seed determinística para Desafio Diário (LCG algorithm)
- Persistência mais robusta com defaults completos
- Animações de feedback (shake no erro, pop no acerto)
- Combo popup animado a cada 5 streak
- Progress bar por modo com cor temática
- Empty states elegantes em Recordes e Estatísticas

### Removido
- index.html vanilla (substituído pelo entry point Vite)
- Chart.js (substituído por Recharts)
- Toda lógica inline no HTML

---

## [1.0.0] — 2026-05 — VERSÃO INICIAL

- HTML/CSS/JS vanilla em arquivo único
- 4 modos de jogo básicos
- localStorage simples
- Chart.js para gráfico
- Service Worker básico
