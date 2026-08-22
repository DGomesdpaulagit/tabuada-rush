# Sessão 067 — Mochila (Fase 3 do PLANO_ACAO.md)

**Data:** 2026-08-22
**Versão:** 6.0.15 → 6.0.16
**Tipo:** Tela nova (execução do plano)

---

## O que aconteceu

Davi confirmou o acesso pelo **menu lateral** e mandou começar a Fase 3.

---

## O que foi feito

### 1. `SHOP_ITEMS` ganhou o campo `group`
Categoria de exibição na Mochila (Arena/Vida/Ofensiva/Missões),
deliberadamente separado do `category` que já existia (esse é a aba
dentro da própria Loja, hoje só tem `'powerup'`). Misturar os dois criaria
acoplamento entre duas telas que vão evoluir por razões diferentes — a
Loja pode ganhar mais abas um dia sem isso afetar como a Mochila agrupa.

### 2. `MochilaPage.jsx` — tela nova
Só mostra o que o jogador **TEM** (`data.powerups[key] > 0`), agrupado,
com contador `×N` no mesmo padrão visual da Loja. **Sem preço, sem botão
de comprar** — é inventário, não vitrine (comprar continua sendo trabalho
da Loja). Item com estoque 0 não aparece: decisão de design — mochila é o
que você tem, não um catálogo do que existe no jogo.

### 3. Poções preparadas, não forçadas
A seção de Poções só renderiza se `data.potions` tiver alguma entrada com
contagem > 0. Esse campo não existe no storage ainda (é trabalho da Fase
4) — a seção fica invisível até lá. Não é um placeholder fake fingindo
que a feature existe; é ausência honesta até a mecânica ser real.

### 4. Estado vazio
Mochila sem nada de nenhum grupo mostra "Sua mochila está vazia... compre
power-ups na Loja ou ache jogando" em vez de uma tela em branco.

### 5. Sidebar
Item novo entre Loja e Perfil. Ordem final: Arena → Ligas → Missões →
Loja → Mochila → Perfil — segue uma lógica de fluxo (ganhar → competir →
objetivo → comprar → guardar → perfil).

---

## Verificação

Forcei um estoque variado (`streakInsurance:2, missionFreeze:1, life:3,
time:0, shield:1, headstart:2`) e confirmei:

- Os 4 grupos aparecem na ordem certa (Arena, Vida, Ofensiva, Missões)
- Os 5 itens com estoque > 0 aparecem com contador batendo exatamente
  (Escudo ×1, Largada Turbo ×2, Vida Extra ×3, Seguro de Ofensiva ×2,
  Congelar Missão ×1)
- **"+60s no relógio" (`time: 0`) não aparece** — prova que o filtro de
  estoque funciona de verdade, não é só estética
- Com `powerups: {}`, mostra o estado vazio
- Item "Mochila" na Sidebar com ícone certo, destaque ativo quando a tela
  está aberta
- 0 imagens quebradas, 0 sobra horizontal, `npm run build` limpo

**Navegação real (clique) não testada de ponta a ponta** — mesma
limitação de compositing do Browser pane já documentada nas sessões
anteriores (D034): `document.hidden === true` trava a transição de
página. Confirmei por outro caminho que o roteamento funciona (o clique
real mudou a classe ativa do botão da Sidebar corretamente) e usei o
atalho `?screen=mochila` (só em ambiente de desenvolvimento) pra testar o
conteúdo da tela de verdade.

---

## Arquivos alterados

| Arquivo | Mudança |
|---------|---------|
| `src/constants/shop.js` | campo `group` nos 6 power-ups + `MOCHILA_GROUPS` |
| `src/pages/MochilaPage.jsx` | tela nova |
| `src/components/Sidebar.jsx` | item novo |
| `src/App.jsx` | import + rota `screen === 'mochila'` |
| `PLANO_ACAO.md` | Fase 3 concluída |
| `DECISIONS.md` | D045 |
| `CHANGELOG.md` | entrada 6.0.16 |

---

## Status para retomar

**Fase 3 concluída.** Próxima: **Fase 4 (Poções de XP)** — precisa criar
o campo `potions` no storage, as 3 variações (x1,5/x2/x3) com
multiplicador + duração + preço, e a tela de ativação nas cores roxas que
o Davi mostrou de referência.

**Pendente de olhada dele:** se o layout/agrupamento da Mochila ficou do
jeito que ele imaginou — nunca vista rodando de verdade neste ambiente.
