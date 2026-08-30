# Sessão 098 — "Trazer ofensiva de volta" = jogar uma partida

**Data:** 2026-08-30
**Versão:** 6.0.46 → 6.0.47
**Tipo:** Correção de mecânica (esclarecimento do Davi)

---

## O que ele esclareceu

Na sessão 097 eu tinha ligado o botão "Trazer ofensiva de volta" ao
**Seguro de Ofensiva**, porque o "desafio especial" da referência não
existia no jogo. Ele corrigiu:

> "Quando eu disse trazer a ofensiva de volta digo pra fazer uma lição,
> então quando ele apertar esse botão irá direcioná-lo para o modo
> principal (Rush)."

Ou seja: **a lição É o desafio**. Não precisa de mecânica nova nenhuma.

## Como ficou

- O botão marca a recuperação como pendente
  (`ofensivaPerdida.recuperando`) e **chama `startGame('rush')`** — vai
  direto pra partida
- **Terminar a partida devolve os dias perdidos + o de hoje.** Quem faz
  isso é o `handleGameEnd`: se a recuperação está pendente,
  `currentStreak = dias perdidos + 1` em vez da contagem normal (que
  daria 1, já que a ofensiva tinha zerado)
- Se ele **abandonar** a partida, a marca continua de pé e ele pode tentar
  de novo. Ela só some quando ele joga ou quando aceita o zero em
  "Reiniciar com 0 dias"
- A recuperação vale pra **qualquer modo**: ele é mandado pro Rush, mas se
  trocar de modo e jogar mesmo assim, cumpriu o combinado — travar isso
  seria punir sem motivo

O **Seguro de Ofensiva** volta a ter só o papel dele de sempre: evitar a
perda automaticamente quando o jogador falha um dia (`applyStreakDecay`).
Os dois mecanismos agora não se misturam.

---

## Arquivos alterados

| Arquivo | Mudança |
|---------|---------|
| `src/components/LostStreakModal.jsx` | botão único que leva pra partida |
| `src/App.jsx` | `recuperarOfensiva` inicia o Rush; fim de partida devolve os dias |

---

## Continua valendo pra próxima conversa

O que está em `PENDENCIAS.md` (sessão 097): a pergunta sobre **tirar os
pontos do jogo**, os ícones das conquistas, o modal de meta abrindo por
cima e conferir o balanceamento da zona de rebaixamento na prática.
