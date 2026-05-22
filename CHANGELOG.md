# 📝 CHANGELOG

Todas as mudanças notáveis do projeto são documentadas aqui.

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
