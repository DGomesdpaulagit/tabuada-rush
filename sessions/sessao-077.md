# Sessão 077 — Ícones combo em resolução maior (mesma peça faltando)

**Data:** 2026-08-24
**Versão:** 6.0.25 → 6.0.26
**Tipo:** Atualização de arte (resolução), pendência confirmada

---

## O que aconteceu

Davi gerou de novo o conjunto de ícones combo (arquivo `ChatGPT Image 24
de ago. de 2026, 16_58_05.png`, 1254×1254 — bem maior que o `Design sem
nome.png` de 524×524 da sessão anterior).

---

## O que foi feito

Comparei os dois arquivos (tamanhos diferentes confirmam 2 gerações
independentes, não o mesmo arquivo salvo de novo): os 8 recursos que já
tinham saído certos continuam certos, mesma classificação de baú
(Madeira/Ferro/Ouro/Místico), só com resolução bem melhor. Reprocessei
os 8 (`combo-congelar/vida-extra/largada/pocao-1/tempo/escudo/pocao-2/
pocao-3`) a partir da imagem nova.

**Seguro de Ofensiva errou de novo, exatamente do mesmo jeito** — a
célula voltou a mostrar o cristal azul reciclado em vez de escudo+baú de
ouro. Duas gerações independentes com o mesmo erro no mesmo item sugere
que não é acaso — sinalizei ao Davi que provavelmente falta uma
referência clara do ícone do Seguro de Ofensiva no material anexado.

Nenhuma mudança de código foi necessária — mesmo nome de arquivo,
`REWARD_COMBO`/`FALLBACK_CHEST` do D054 continuam válidos.

---

## Verificação

- `npm run build` limpo
- `combo-vida-extra` carrega sem erro na página de recompensa, 0 imagem
  quebrada
- Comparação visual dos 8 ícones novos com os da sessão anterior — mesma
  classificação, mesmo estilo, mais nítidos

---

## Arquivos alterados

| Arquivo | Mudança |
|---------|---------|
| `src/assets/icons/combo-*.png` | 8 substituídos por versão de resolução maior |
| `DECISIONS.md` | D055 |
| `CHANGELOG.md` | entrada 6.0.26 |

---

## Status para retomar

**Pendente:** Seguro de Ofensiva — 2 tentativas seguidas não geraram
essa peça. Continua no fallback funcional (ícone + Baú de Ouro).

**Próximo item formal do backlog:** Fase 8 (painel central da Arena) —
começar perguntando o que ele quer, não propor design pronto.
