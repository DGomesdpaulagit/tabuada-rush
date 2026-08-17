# Sessão 052 — Recalibração completa das Ligas (respostas do Davi às perguntas em aberto)

**Data:** 2026-08-17
**Versão:** 6.0.1 → 6.0.2
**Tipo:** Recalibração (não é bloco novo — implementa especificações que o Davi deu
pras perguntas que ficaram em aberto desde o Bloco 4/D023)

---

## O que aconteceu

Depois da limpeza de débitos (sessão 051), perguntei ao Davi os números que
faltavam pra calibração de verdade (XP por faixa, personagens por liga,
zonas de promoção — tudo que eu tinha deixado como "estimativa minha" nos
Blocos 3 e 4). Ele respondeu com especificações detalhadas — não só números,
mas um modelo de tempo inteiro novo pro sistema de ligas. Implementei tudo
nesta sessão. Ver DECISIONS.md D030 pro registro completo, ponto por ponto.

### Resumo do que mudou

1. **XP por faixa de tabuada** — recalculado com o método que o Davi pediu
   (XP/dia × meses-alvo): 1ª faixa 9 meses, última faixa ~28,5 meses no
   total. `FIRST_TIER_XP`/`TIER_XP_DECAY`/`TIER_XP_FLOOR` em
   `constants/index.js`.
2. **Personagens por liga** — decrescendo de 20 (Bronze) até 4 (Diamante),
   114 no total (era 100 fixo). Einstein migrou de Pérola pra Diamante (o
   próprio Davi deu ele como exemplo de "personagem que vive no jogo").
3. **Zonas de promoção** — decrescendo de 8 (Bronze) até 0 (Diamante,
   topo). `leagueMultiplier` esticado (0.7×-2.2×, era 0.7×-1.6×) pra liga
   alta ser de fato muito mais difícil com pote menor.
4. **Conquistas por liga alcançada** — 9 entradas novas em `ACHIEVEMENTS`
   (Prata até Diamante), concedidas no momento exato da promoção.
5. **Bônus de XP no pódio da Diamante** — +25% de XP em toda partida
   enquanto o jogador estiver no top 3 da Diamante.
6. **Modelo de tempo (a mudança mais estrutural)** — personagens atualizam
   XP a cada 12h; promoção/rebaixamento só é avaliado uma vez por CICLO de
   6 dias (relógio global, `getCurrentCycle()`), não mais a cada partida.
   Isso também resolveu o bug de ping-pong (D023) de um jeito mais robusto
   que o grace-period manual da sessão 051 (D027, agora removido — virou
   redundante).
7. **Arquitetura pra "todas as ligas competem sempre"** — já era assim por
   construção (`getCharacterXp` é função pura de personagem+horário, não
   depende de qual liga o jogador está vendo); documentado explicitamente.
   "Ver outras divisões" como tela nova NÃO foi implementado — o próprio
   Davi disse que isso ainda precisa de conversa, não uma decisão fechada.

---

## Verificação

`npm run build` limpo. Testado neste ambiente (troca temporária do `screen`
inicial, removida antes do commit):
- Liga Bronze: 21 competidores (20 personagens + jogador), "zona de
  promoção (top 8)" — bate com a calibração nova
- Liga Diamante: 5 competidores (4 personagens + jogador, Einstein entre
  eles), "zona de rebaixamento (últimos 1)", sem zona de promoção (correto
  — é o topo, não tem pra onde subir)
- XP dos personagens da Diamante (1894-2674) muito maior que os do Bronze
  (746-1006) — confirma o multiplicador de liga esticado funcionando
- Tela de Conquistas carrega as 9 entradas novas de liga sem erro de console

**Não verificado nesta sessão:** o ciclo de 6 dias avançando de verdade (só
revisei a lógica — `getCurrentCycle()` é determinístico e vai até bater um
número diferente daqui a 6 dias reais, não dá pra simular isso instantâneo
sem mexer no relógio do sistema); o toast do bônus de pódio Diamante
aparecendo numa partida de verdade (mesma ressalva de sempre, não montei
partida completa neste ambiente).

---

## Arquivos alterados

| Arquivo | Mudança |
|---------|---------|
| `DECISIONS.md` | D030 — recalibração completa, 8 pontos |
| `src/constants/index.js` | Curva de XP das faixas recalculada; import de `LEAGUES`; 9 `ACHIEVEMENTS` de liga |
| `src/constants/leagues.js` | 114 personagens (era 100), promoção/liga-multiplicador recalibrados |
| `src/utils/leagues.js` | Modelo de ciclo (6 dias), XP por meio-dia (12h), pódio Diamante, `checkInactivityRelegation` removido (redundante) |
| `src/contexts/AppContext.jsx` | Chama `applyLeaguePromotion` no load (seguro agora com o ciclo) |
| `src/App.jsx` | Persiste campos novos de ciclo/pódio; bônus de XP da Diamante; achievement check usa dado pós-liga |
| `src/lib/storage.js` | `leagueLastCycleChecked`, `diamondPodiumActive` novos |
| `sessions/sessao-052.md` | este arquivo |

---

## Status para retomar

**Pendências desta sessão:** nenhuma das perguntas em aberto ficou sem
resposta — todas as 3 (XP/faixa, personagens/liga, zonas de promoção) foram
respondidas pelo Davi e implementadas.

**Em aberto, não é pendência técnica:** "ver outras divisões" (tela pra
acompanhar a competição de uma liga que não é a do jogador) — o próprio
Davi disse que isso precisa de conversa antes de virar decisão.

**Próximo passo:** a critério do Davi — recalibração das ligas concluída.
