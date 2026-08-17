# Sessão 053 — Escada de Ligas ("ver outras ligas", bloqueada por progresso)

**Data:** 2026-08-17
**Versão:** 6.0.2 → 6.0.3
**Tipo:** Feature nova — fecha o ponto que D030 tinha deixado em aberto
("ver outras divisões")

---

## O que aconteceu

O Davi pediu pra retomar exatamente o ponto que a sessão 052 deixou como
"precisa de conversa, não decisão fechada": uma forma de ver a
classificação de uma liga que não é a atual. Em vez de implementar um
design às cegas, mostrei 3 opções de UI (lista de ligas abaixo do ranking
atual, trilha visual em escada, seletor de chips no topo) como mockup
interativo — um artifact HTML publicado com a paleta escura real do app
(`globals.css`) e dados reais das 10 ligas/personagens, pra ele poder
clicar e comparar antes de eu codar qualquer coisa.

Ele escolheu a **escada (opção B)** — e trouxe uma regra de acesso que eu
não tinha proposto em nenhum dos 3 mockups: **progresso bloqueia
visualização**. O jogador só pode ver o roster e a classificação de uma
liga que ele **já alcançou algum dia** (mesmo se caiu dela depois por
rebaixamento); ligas acima disso ficam bloqueadas — sem nome, sem
personagens, só um cadeado.

---

## O que mudou

1. **`leagueHighestId` novo** (`storage.js` + `enterLeague` em
   `utils/leagues.js`) — guarda a liga mais alta já alcançada. Só sobe
   (`Math.max` entre o valor guardado e a nova liga), nunca desce com
   rebaixamento — é isso que garante que uma liga "já visitada" continua
   acessível pra sempre, mesmo depois de cair dela.
2. **Auto-cura em `applyLeaguePromotion`** — recalcula
   `leagueHighestId = max(liga atual, valor guardado)` incondicionalmente,
   antes até do gate de ciclo de 6 dias. Sem isso, todo save salvo antes
   desta sessão (que não tem o campo, ou tem ele como o default `'bronze'`)
   veria a PRÓPRIA liga atual aparecer bloqueada na escada — bug seríssimo
   de regressão pra quem já tinha progresso.
3. **`App.jsx` handleGameEnd** — o código já filtrava campo a campo quais
   partes de `applyLeaguePromotion(...).data` persistir (não fazia spread
   do objeto inteiro). Faltava incluir `leagueHighestId` nessa lista; sem
   isso a promoção calculava certo em memória mas nunca gravava no save.
4. **`RankingPage.jsx` reescrita por completo** — escada vertical (Bronze
   embaixo, Diamante no topo, leve efeito de degraus alternando recuo
   lateral). Degraus desbloqueados (`idx <= highestIdx`) mostram
   emoji/nome/contagem de personagens e abrem uma folha (bottom sheet) ao
   tocar, com roster completo + zona de promoção/rebaixamento
   (`getLeagueStandings(data, league.id)` — o motor já suportava consultar
   qualquer liga desde o Bloco 4, D030 item 4, só faltava a UI). A liga
   atual do jogador mostra a linha "Você" + posição real (comportamento já
   embutido em `getLeagueStandings`); ligas já passadas mas não a atual
   mostram só o roster, sem "Você" — mesma regra que o Davi definiu na
   conversa sobre os mockups. Degraus bloqueados são `disabled`, sem
   clique, sem revelar nada.

---

## Verificação

`npm run build` limpo (2790 módulos, sem erro). **Navegação real (clique +
troca de tela) não pôde ser confirmada neste ambiente** — o Browser pane
desta sessão roda com `document.hidden === true` (aba sem compositing
real), então a transição `AnimatePresence mode="wait"` do `App.jsx` trava
esperando `requestAnimationFrame` e a página nova nunca termina de montar.
Isso é a mesma limitação já registrada em BUGS.md (testada exaustivamente
na sessão 043), não um bug introduzido aqui — confirmei que o roteamento em
si funciona (o clique no item "Ligas" do menu lateral mudou a classe pra
"ativo" corretamente, só a animação de troca de página que não completa
sem a aba visível).

Verificação alternativa feita: leitura cuidadosa do código pros 3 cenários
de migração (save novo com o campo já no default, save antigo sem o campo
nenhum, jogador que foi promovido e depois rebaixado) — os três resolvem
pro comportamento esperado na auto-cura.

**Pendente: confirmação visual do Davi.** Pedir pra ele abrir a tela de
Ligas, tocar num degrau desbloqueado (deve abrir a folha com o roster),
tentar tocar num bloqueado (não deve fazer nada), e confirmar que a
própria liga atual dele não aparece bloqueada (o caso que a auto-cura
existe pra evitar).

---

## Arquivos alterados

| Arquivo | Mudança |
|---------|---------|
| `DECISIONS.md` | D031 — escada de ligas com bloqueio por progresso |
| `CHANGELOG.md` | entrada 6.0.3 |
| `src/lib/storage.js` | `leagueHighestId` novo em DEFAULTS |
| `src/utils/leagues.js` | `enterLeague` atualiza `leagueHighestId` (só sobe); auto-cura no topo de `applyLeaguePromotion` |
| `src/App.jsx` | `leagueHighestId` incluído na persistência pós-partida (handleGameEnd) |
| `src/pages/RankingPage.jsx` | reescrita — escada vertical + folha de detalhe por liga |
| `sessions/sessao-053.md` | este arquivo |

---

## Status para retomar

**Pendências desta sessão:** confirmação visual do Davi (ver seção
Verificação acima) — sem bloqueio técnico conhecido, só não pôde ser
testado interativamente neste ambiente.

**Próximo passo:** a critério do Davi. Se a escada for aprovada como está,
não há bloco novo planejado — mesma situação da sessão 052.
