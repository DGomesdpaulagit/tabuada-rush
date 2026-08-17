# Sessão 049 — Tabuada Rush 6.0: Bloco 6 (Perfil completo)

**Data:** 2026-08-17
**Versão:** 6.0.0-bloco5 → 6.0.0-bloco6
**Tipo:** Implementação

---

## O que aconteceu

Continuação direta das sessões 044-048 ("bora pra próxima"). Implementei o Bloco 6
— Perfil completo: absorve Conquistas/Recordes/Catálogo, e remove de vez o
sistema antigo de QI (pendência sinalizada desde D023, Bloco 4).

### Perfil — reescrito por completo

- `pages/PerfilPage.jsx` — de resumo mínimo (Bloco 1) pra tela completa:
  - Cabeçalho: email do usuário (ou "Jogador"), "No jogo desde {mês/ano}"
    (`data.createdAt`, novo — setado uma vez no primeiro load, ver
    `AppContext.jsx`; pra quem já jogava antes deste bloco, marca a partir de
    agora, não retroativo — não tinha como saber a data real de início).
  - Card de identidade: faixa de tabuada atual (Bloco 3) + liga e posição
    (Bloco 4) — substitui o QI que estava aqui desde o Bloco 1.
  - Stats resumidas: recorde de ofensiva, XP total.
  - 3 botões de acesso — Conquistas / Recordes / Catálogo — abrindo
    `AchievementsPage`/`RecordsPage`/`CatalogPage` (componentes reaproveitados
    como estavam, só a navegação mudou de dentro-de-Estatísticas pra
    dentro-de-Perfil, mesmo padrão de `view` state que a StatsPage já usava).
- `pages/StatsPage.jsx` — removido o grid de 3 botões (Recordes/Conquistas/
  Catálogo) e as 3 rotas de `view` correspondentes. Fica só com Acertos/Erros/
  Catálogo de Precisão/Análise Inteligente/etc — reorganização de verdade
  dessas telas remanescentes é o Bloco 7.

### Sistema antigo de QI removido por completo (não só trocado de tela)

Migrei as 5 telas que ainda usavam `getQiInfo` pra Faixa de tabuada + Liga, e
**deletei o código antigo inteiro** em vez de deixar morto:
- `MenuPage.jsx` — card de identidade agora mostra liga+posição (era
  personagem+QI)
- `SettingsPage.jsx` — linha "Conta" mostra liga; grid de stats trocou "QI"
  por "Vidas" (Bloco 2, fazia mais sentido ali que um número morto)
- `ResultsPage.jsx` — cartão de compartilhamento usa emoji/nome da liga em
  vez de personagem QI
- `CatalogPage.jsx` — subtítulo do herói mostra liga+posição
- `App.jsx` — removida a opção "+5 de QI" do modal de recompensa de ofensiva
  (não fazia mais sentido — era a última coisa que ainda escrevia
  `data.qiBonus`, removido também)
- **Deletado:** `computeQI`/`getQiInfo` (`utils/index.js`),
  `src/constants/characters.js` inteiro (104→52 personagens ao longo das
  versões, o antigo Ranking de QI) — confirmei via grep que não sobrava
  nenhum consumidor antes de apagar. Ver DECISIONS.md D025.

---

## Verificação

`npm run build` limpo. Testado neste ambiente (sem composição de frame, mesma
limitação de sempre) via troca temporária do `screen` inicial (removida antes
do commit) + inspeção de DOM/console, tela por tela:
- **Perfil**: renderiza tudo certo — "No jogo desde agosto de 2026", faixa
  "Tabuada 190×200", liga "Bronze · 11º de 11", stats, 3 botões. Sem erro de
  console.
- **Catálogo** (dentro de Perfil): subtítulo mostra "🥉 Liga Bronze · 11º de
  11" no lugar do QI antigo. Sem erro.
- **Recordes** (dentro de Perfil): renderiza (estado vazio, sem partidas
  jogadas neste perfil de teste). Sem erro.
- **Conquistas** (dentro de Perfil): renderiza ("0/25 desbloqueadas",
  certificados de domínio). Sem erro.
- **Menu**: card de identidade mostra "🥉 LIGA BRONZE · 11º de 11" no lugar do
  personagem QI. Sem erro.
- **Configurações**: seção Conta mostra "Tabuada 190×200 · 🥉 Liga Bronze",
  grid de stats mostra XP/Vidas/Moedas. Sem erro.

**Não verificado nesta sessão:** a tela de Resultados (`ResultsPage`) de
verdade, pelo motivo de sempre (não montei uma partida completa neste
ambiente) — a mudança lá é de 2 linhas (`qiChar`/`qiName` passados pro
`shareCard` agora vêm da liga em vez do QI), revisada no código, baixo risco.

---

## Arquivos alterados

| Arquivo | Mudança |
|---------|---------|
| `sessions/planejamento-6.0.md` | Marca a seção 9 (Perfil) como implementada |
| `DECISIONS.md` | D025 — remoção completa do sistema antigo de QI |
| `src/pages/PerfilPage.jsx` | Reescrito — faixa+liga, stats, Conquistas/Recordes/Catálogo |
| `src/pages/StatsPage.jsx` | Grid de Recordes/Conquistas/Catálogo removido (migrou pro Perfil) |
| `src/pages/MenuPage.jsx` | Card de identidade usa liga em vez de QI |
| `src/pages/SettingsPage.jsx` | Conta mostra liga; stats trocou QI por Vidas |
| `src/pages/ResultsPage.jsx` | Compartilhamento usa liga em vez de QI |
| `src/pages/CatalogPage.jsx` | Subtítulo do herói usa liga em vez de QI |
| `src/App.jsx` | Removida opção "+5 de QI" do modal de recompensa |
| `src/lib/storage.js` | `createdAt` novo; `qiBonus` removido |
| `src/contexts/AppContext.jsx` | Seta `createdAt` no primeiro load |
| `src/utils/index.js` | `computeQI`/`getQiInfo` removidos |
| `src/constants/characters.js` | **deletado** — sistema antigo de QI inteiro |
| `sessions/sessao-049.md` | este arquivo |

---

## Status para retomar

**Pendências desta sessão:** "Pódios conquistados nas ligas" (mencionado no
áudio original do Perfil) não foi implementado — não existe histórico de
pódio ainda, só a posição atual da liga. Lacuna conhecida, não esquecimento;
registrada em planejamento-6.0.md seção 9.

**Próximo passo:** Bloco 7 — Estatísticas (reorganização, não reset):
navegação lateral tipo sumário, Acertos/Erros movem pra dentro do Catálogo de
Precisão. Último bloco do reset 6.0.
