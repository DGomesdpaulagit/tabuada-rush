# Sessão 065 — Fases 1 e 2 do PLANO_ACAO.md: ícones novos + XP Dobrado removido

**Data:** 2026-08-17
**Versão:** 6.0.13 → 6.0.14
**Tipo:** Execução do plano (primeira leva)

---

## O que aconteceu

Davi confirmou as 3 perguntas em aberto do `PLANO_ACAO.md`:

1. **XP Dobrado:** confirmado remover de vez, inclusive da tabela de drop.
2. **Calendário de 5 dias:** confirmado que é diferente do calendário
   semanal do Header — ele manda a imagem de referência quando chegar a
   vez dessa fase (Fase 7).
3. **"Partida" nas probabilidades por tempo (Fase 6):** ele lembrou um
   detalhe que muda a implementação — o Rush tem bônus de tempo por combo,
   então um jogador craque pode esticar uma partida bem além do esperado.
   Não dá pra assumir duração por modo; tem que ser a duração REAL de cada
   partida.

E mandou seguir com a Fase 1.

---

## Fase 1 — 16 ícones novos

### Dois achados que mudaram o resultado

**"Vidas" e "Vida Extra" não são o mesmo ícone**, mesmo o Davi tendo
escrito no texto original "usar o mesmo ícone de vidas" pro power-up. Ele
baixou dois arquivos com nomes diferentes:
- `novo_icone_vidas.png` — coração liso, uso geral (Header, contador)
- `novo_icone_vida_extra.png` — coração com cruz, estilo ícone médico —
  claramente feito especificamente pro power-up que revive o jogador

O arquivo mais específico venceu a instrução escrita. Usei o
coração-com-cruz só no power-up Vida Extra (`pu-vida-extra`, registro
novo), deixando um comentário no código pra ele confirmar essa escolha.

**Sem ícone novo pro Escudo** — nenhum arquivo baixado com esse nome.
Mantido o `pu-escudo.png` da sessão 062, sem mudança.

### O que foi trocado (mesmo arquivo, sem mexer em import)
`vidas.png`, `ofensiva.png` (estado "acesa"), `pu-largada.png`,
`pu-congelar.png`, `pu-tempo.png`.

### O que é novo (registro novo em `GameIcon.jsx`)
- `pu-vida-extra` — coração+cruz
- `missao-mensal` (calendário) / `missao-diaria` (sol) — categorias de
  missão, substituindo ☀️/🗓️
- `mochila` — só registrado, tela ainda não existe (Fase 3)
- `pocao-xp-1/2/3` — fatiados de uma folha vertical única. **Sem cor
  diferenciando os 3 tiers** (todos roxos), mapeei por formato: tubo de
  ensaio = x1,5, erlenmeyer = x2, frasco redondo = x3. **É suposição
  minha, não confirmada pelo Davi.**
- `bau-madeira/ferro/ouro/mistico` — fatiados de uma fileira horizontal de
  4. A ordem bateu certinho com os 4 tiers já descritos no
  `PLANO_ACAO.md` (madeira → místico, crescendo em raridade e brilho)

Mochila/Poções/Baús só foram **registrados** — nenhuma tela nova ainda
(isso é trabalho das Fases 3/4/6).

### Consistência extra (mesmo espírito da "varredura" da sessão 060)
O ícone de "Congelar" nos botões e badges de missão (antes `Snowflake` da
lucide) virou a mesma arte usada na Loja — os dois lugares que mencionam a
mesma coisa agora usam o mesmo desenho.

---

## Fase 2 — XP Dobrado removido; regra nova do Congelar Missão

### XP Dobrado — removido do jogo inteiro
- `SHOP_ITEMS` (`constants/shop.js`) — item retirado
- `App.jsx handleGameEnd` — o multiplicador ×2 por partida saiu do
  cálculo de XP. Deixei um comentário marcando onde o multiplicador das
  Poções de XP vai entrar (Fase 4) — são conceitos diferentes: XP Dobrado
  valia por 1 PARTIDA, Poção vale por TEMPO (pode cobrir várias partidas
  ou nenhuma)
- `GamePage.jsx` — badge "⚡ XP ×2" no HUD removido
- `ResultsPage.jsx` — banner e label especial removidos; a lógica de
  `highlight` nos cards de estatística também saiu, já que nada mais a usa

### Regra nova do Congelar Missão (pedido explícito do Davi)
Antes: o botão sempre aparecia, com fallback de comprar na hora por 50
moedas quando não tinha estoque. **Agora: o botão só existe se
`powerups.missionFreeze > 0`.** Sem estoque, não aparece nada — nem preço,
nem botão desabilitado. Vale igual pra missão diária e desafio mensal já
aceito.

---

## Verificação

- **Loja:** 6 itens (XP Dobrado sumiu), 0 imagens quebradas, Vida Extra
  usando `pu-vida-extra.png` de verdade
- **Regra do Congelar**, testada nos dois sentidos:
  - Sem estoque → botão ausente, 0 menção de preço
  - Com estoque forçado (2) → botão aparece "Congelar (estoque ×2)";
    clique consome 1 (vira `×1`) e a missão passa a mostrar "Congelada —
    sobrevive até amanhã"
- **Header:** chama nova aparece tanto acesa (`ofensiva.png`, streak>0)
  quanto congelada (`ofensiva-congelada.png`, streak=0 ou seguro ativo)
- 0 erros no console em Arena/Loja/Missões
- `npm run build` limpo

**Nota útil pra Fase 6, achada nesta sessão (não implementada ainda):**
`result.timePlayed` já existe e já é mostrado no `ResultsPage` — é a fonte
natural pra medir a duração real de uma partida, resolvendo a pergunta que
o Davi esclareceu sobre "o que conta como partida" sem precisar
instrumentar nada novo.

---

## Arquivos alterados

| Arquivo | Mudança |
|---------|---------|
| `src/assets/icons/*.png` | 16 arquivos novos/atualizados |
| `src/components/GameIcon.jsx` | registros novos |
| `src/constants/shop.js` | XP Dobrado removido; `art` do Vida Extra |
| `src/lib/storage.js` | comentário do formato de `powerups` atualizado |
| `src/App.jsx` | cálculo de XP sem `xp2`; `lastResult` sem `xp2Used` |
| `src/pages/GamePage.jsx` | badge de XP Dobrado removido |
| `src/pages/ResultsPage.jsx` | banner/label/highlight de XP Dobrado removidos |
| `src/pages/MissionsPage.jsx` | regra nova do Congelar; categorias com ícone |
| `PLANO_ACAO.md` | conflitos marcados como resolvidos |
| `DECISIONS.md` | D043 |
| `CHANGELOG.md` | entrada 6.0.14 |

---

## Status para retomar

**Fases 1 e 2 do `PLANO_ACAO.md` concluídas.** Próximas na ordem: Fase 3
(Mochila), Fase 4 (Poções de XP), Fase 5 (loja rotativa), Fase 6
(baús/recompensas por partida), Fase 7 (páginas de resumo), Fase 8
(painel da Arena — só no final).

**Duas coisas pra confirmar com o Davi quando puder:**
1. Ícone do Vida Extra (coração+cruz) — ele escreveu pra reusar o ícone
   geral de vidas, mas o arquivo específico que ele baixou sugere o
   contrário. Usei o específico.
2. Mapeamento das 3 poções por formato (tubo=x1,5/erlenmeyer=x2/
   redonda=x3) — a folha não diferencia por cor, foi suposição minha.

**Itens da Fase 1 ainda pendentes** (não bloqueiam nada, mas ficaram de
fora desta leva): ícones "Controle"/"Alvo" por tipo de missão individual —
precisa de mais inventário de quais tipos de missão existem hoje antes de
mapear.
