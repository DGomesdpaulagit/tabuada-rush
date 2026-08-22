# Sessão 066 — Ícones por tipo de missão + confirmações da sessão 065

**Data:** 2026-08-22
**Versão:** 6.0.14 → 6.0.15
**Tipo:** Continuação da Fase 1 (ícones)

---

## O que aconteceu

Davi confirmou as duas escolhas em aberto da sessão anterior (ver D043):
- Ícone dedicado do power-up Vida Extra (coração+cruz) — confirmado
- Mapeamento das 3 Poções de XP por formato do frasco — confirmado

E mandou uma folha nova: `icocones_para_missoes.png`, com 4 ícones
(controle/gamepad, alvo/mira, halter, selo "100") pras missões.

---

## Ícones por tipo de missão

Em vez de mapear ícone por missão individual (o que exigiria tocar em
código toda vez que uma missão nova entrasse no pool), mapeei por **`type`**
— o campo que já existe em `constants/missions.js` e agrupa missões pelo
mesmo objetivo:

| `type` | Ícone | Por quê |
|---|---|---|
| `play` (jogue N partidas) | gamepad | Match direto — "Controle" era literalmente o nome que o Davi deu pra esse conceito lá no texto original |
| `accuracy` (precisão %) | mira | Match direto — "Alvo" também já nomeado por ele, e coincide com o emoji 🎯 que a missão já usava |
| `score` (pontuação) | selo "100" | Coincide com o emoji 💯 que a missão já usava |
| `correct_single`/`correct_day`/`correct_month` (acertos acumulados) | halter | **Decisão minha, por eliminação** — sobrava um tipo sem ícone nomeado e um ícone sem destino óbvio na folha. Pedir confirmação. |
| `streak`/`streak_month` (sequência de acertos / dias de ofensiva no mês) | continua 🔥 | Nenhum dos 4 ícones combinava, e não é o mesmo conceito da chama da barra superior (D039) |

Implementado como um mapa `TYPE_ICON` + componente `MissionIcon` — os 3
lugares que mostravam o emoji cru (missão diária, desafio mensal já
aceito, desafio mensal disponível pra aceitar) passam pelo mesmo
componente agora, então não tem como um dos três ficar pra trás.

---

## Verificação

- Diária "20 Acertos" → halter; "Precisão de 90%" → mira; "Cem Pontos" →
  selo 100
- Mensal "80 Partidas" → gamepad; "1.500 Acertos" → halter
- 0 imagens quebradas, 0 erros no console
- `npm run build` limpo

---

## Arquivos alterados

| Arquivo | Mudança |
|---------|---------|
| `src/assets/icons/missao-tipo-*.png` | 4 arquivos novos |
| `src/components/GameIcon.jsx` | registro dos 4 |
| `src/pages/MissionsPage.jsx` | `TYPE_ICON` + `MissionIcon`, 3 usos trocados |
| `PLANO_ACAO.md` | Fase 1.2 concluída; confirmações da 065 marcadas |
| `DECISIONS.md` | D044 |
| `CHANGELOG.md` | entrada 6.0.15 |

---

## Status para retomar

**Fase 1 do `PLANO_ACAO.md` está praticamente fechada** — só falta o ícone
de acertos/erros pra tela de resumo (Fase 7, ainda não começou) e um ícone
de "sequência" pro `streak`/`streak_month`, se o Davi mandar algum dia.

**Pendente de confirmação:** mapeamento do halter pra "acertos acumulados"
— única escolha desta leva que não veio de um nome explícito dele.

**Próxima:** Fase 3 (Mochila) — precisa que o Davi diga onde ela fica
acessível no app.
