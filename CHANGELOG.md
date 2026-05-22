# 📝 CHANGELOG

Todas as mudanças notáveis do projeto são documentadas aqui.

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
