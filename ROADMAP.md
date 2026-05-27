# 🗺️ ROADMAP — Tabuada Rush

---

## ✅ v2.0–v2.14 — FASES 1–7 (COMPLETO)

- [x] React + Vite + Tailwind + Framer Motion + Recharts
- [x] 4 modos: Rush, Sobrevivência, Velocidade, Desafio Diário
- [x] Design system premium (paleta violeta, fonte Nunito)
- [x] Sistema de XP + 28 níveis com curva equilibrada
- [x] Sistema de conquistas (25 conquistas com ofensiva)
- [x] Persistência localStorage + Supabase cloud sync opcional
- [x] Auth (email/senha) + migração automática local→cloud
- [x] Ranking de QI Matemático (104 personagens)
- [x] Catálogos: Progresso, Precisão, Acertos, Erros
- [x] Web Audio API (sons procedurais)
- [x] Sistema de Moedas, Loja, Missões, Temporadas
- [x] PWA básico (manifest, service worker)
- [x] Notificações push (lembrete diário com app fechado)
- [x] Exportação de dados (JSON + CSV)

---

## ✅ v3.0 — CALIBRAÇÃO (COMPLETO — 2026-05-27)

- [x] XP 100% performance-based: score × multiplicador por modo
- [x] Rush = menor multiplicador (0.18) — penaliza vantagem de 5min
- [x] Removidos bônus de streak/dia
- [x] LEVELS thresholds ×2 — curva equilibrada de longo prazo
- [x] computeQI mais difícil (caps: speedBest→80, totalGames→300)
- [x] Botão "Resetar Progresso" com confirmação (SettingsPage)

---

## 🔜 v3.1 — EXPERIÊNCIA VISUAL (PRÓXIMA SESSÃO)

- [ ] **Modo Zen** — sem timer, sem pontuação, treino livre (XP zero)
- [ ] **Animação level-up** — explosão de partículas ao subir de nível
- [ ] **Mascote matemático** — personagem reativo (acerto/erro/combo)
- [ ] **INSANE COMBO!** — texto épico + screen shake no combo alto

---

## 🔜 v3.2 — ANÁLISE E REVISÃO

- [ ] **Gráfico de tempo médio** — tempo por questão no ResultsPage
- [ ] **Histórico semanal de erros** — lista dos erros da semana
- [ ] **Modo Revisão** — foca nas tabuadas com maior taxa de erro do jogador

---

## 🔜 v3.3 — PWA E ENGAJAMENTO

- [ ] **PWA install prompt** — banner para instalar o app (evento `beforeinstallprompt`)
- [ ] **Leaderboard global** — Supabase rankings por modo
- [ ] **Notificação de missão expirando** — push antes de resetar sem completar
- [ ] **Compartilhar resultado** — imagem gerada para redes sociais

---

## 💡 IDEIAS FUTURAS (sem prazo)

- Modo "Tabuada Invertida" (mostrar resultado, digitar os fatores)
- Divisões/liga (Bronze → Prata → Ouro → Diamante)
- Avatar customizável com XP
- Streak calendar heatmap
- Multiplayer online (WebSockets)
- Conquistas raras com animações especiais
