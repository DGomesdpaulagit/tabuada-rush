# Sessão 044 — Tabuada Rush 6.0: planejamento do reset + Bloco 1 (base visual)

**Data:** 2026-08-16
**Versão:** 5.0.0 → 6.0.0 (em andamento, Bloco 1/7)
**Tipo:** Planejamento (documentação) + implementação (base visual)

---

## O que aconteceu

Davi abriu a sessão insatisfeito com o resultado da 5.0 ("não conseguimos" chegar perto
do Duolingo — animações do mascote e paleta abaixo do esperado) e pediu um **reset
completo**, a 6.0 — não uma continuação incremental. Mandou 3 áudios longos (Design,
Infraestrutura/Inovações, Estatísticas) com o escopo inteiro, junto com prints de
referência: o Duolingo e um protótipo que ele fez no Lovable (que usou como referência
principal de paleta/layout).

### 1. Planejamento — `sessions/planejamento-6.0.md` (novo)

Documentei os 3 áudios organizados por seção (Design, Navegação/Infraestrutura, Ligas,
Vidas, Progressão de tabuada, Missões/desafios mensais, Power-ups, Perfil, Estatísticas),
separando o que ficou fechado do que Davi disse explicitamente "não sei ainda" (nº de
personagens por liga, nome das faixas de tabuada, cálculo de XP/dia, etc — não inventado,
fica marcado como pendente de conversa).

Antes de implementar, levantei 3 pontos com o Davi via pergunta direta (confirmados):
1. A 6.0 substitui de vez as pendências abertas da 5.0 (migração de paleta restante,
   posição do mascote, painel temático por personagem) — não ficam como itens paralelos.
2. Escopo fechado — sem mais áudio pendente antes de começar a implementar.
3. **Desafios mensais com saldo negativo** (jogador pode ficar "devendo" moeda se não
   cumprir um desafio aceito) — sinalizei que é estruturalmente uma mecânica de
   aposta/dívida, na linha do que já discuti com o Davi antes (ver
   [[feedback_scope_guard_new_features]] na memória — cuidado com mecânica "viciante"
   desconectada de aprendizado). Davi confirmou que é a intenção mesmo assim; não é
   bloqueador, é opt-in e tem teto. Registrado, não implementado ainda (é do Bloco 5).

Documento propõe 7 blocos de implementação (base visual → vidas → progressão de
tabuada → ligas → missões → perfil → estatísticas). Davi aprovou começar pelo Bloco 1.

### 2. Bloco 1 — Base visual

**Paleta/tema:** criado um segundo sistema de tokens de cor, semântico, dark-first,
via CSS var (`background/surface/surface-2/border/fg/fg-muted/accent/accent-dark/
streak/coin/danger/success`) — ver D020 pro raciocínio completo e a pegadinha técnica
(vars precisam guardar "R G B" sem `rgb()` pra `bg-accent/15` funcionar; mudança em
`tailwind.config.js` exige reiniciar o servidor dev, não pega via HMR sozinho). Tema
escuro virou o **padrão** do app (`lib/prefs.js` `DEFAULTS.theme: 'dark'`). Bege do
tema claro removido (`--background` era `#FBF7EC`, agora `#F7F8FA`).

Tokens legados ("Caderno Quadriculado" da 5.0 — `paper/ink/pen/check/graphite` — e os
brutos do Duolingo `feather/macaw/...`) continuam existindo, intocados, pra telas que
ainda não migraram (Modos/Estatísticas/Loja/Recompensas — blocos futuros).

**Componentes tocados:**
- `components/ui/index.jsx` — `Button` (primary/secondary/ghost), `Card`, `Badge`
  (primary/success/danger) migrados pros tokens novos. Como esses componentes são
  usados em quase toda página, isso corrige de tabela a classe de bug "cor custom sem
  override de tema escuro" em vários lugares além do que foi só verificado (ver B009).
- `components/Sidebar.jsx` — reescrito: 5 destinos primários (Arena/Ligas/Missões/
  Loja/Perfil, planejamento-6.0.md seção 3) substituindo os 5 antigos (Início/Modos/
  Recompensas/Estatísticas/Ranking QI). Modos e Estatísticas deixam de ser destino de
  sidebar — são alcançados a partir da Arena/Perfil, como no áudio do Davi.
- `components/Header.jsx` (**novo**) — barra superior persistente (faixa/nível ·
  ofensiva · moedas · vidas), estilo Duolingo. Some na tela de jogo (`screen==='game'`,
  que já tem HUD próprio). Faixa/nível e contagem de vidas são **placeholders visuais**
  — o sistema real de faixa de tabuada é o Bloco 3, o de vidas diárias é o Bloco 2; não
  inventei a lógica de nenhum dos dois, só deixei o espaço certo no layout.
- `pages/PerfilPage.jsx` (**novo**) — destino novo, resumo mínimo (nome/QI/recorde de
  ofensiva/XP total) pra não ser link morto. Conquistas/Recordes/Catálogo (que hoje
  vivem em Estatísticas) migram pra cá de verdade no Bloco 6.
- `pages/MenuPage.jsx` — corrigido o bug B009 (rodapé "Partidas/Melhor Seq./Acertos"
  ilegível no escuro) migrando pros tokens novos; botão "Definir meta" ajustado.
- `App.jsx` — monta `<Header/>` global, adiciona rota `perfil`.

**Não renomeado:** a chave interna `screen === 'menu'` continua `'menu'` (só o label
visível virou "Arena") — renomear a string em todo o app é mudança mecânica de baixo
valor agora, decidi não fazer pra manter o diff pequeno.

---

## Verificação

`npm run build` limpo (rodado 3× ao longo do bloco, sempre 0 erros). Ambiente de
preview desta sessão (Browser pane) **ainda não compõe frames** (mesma limitação
documentada na sessao-043) — cliques que dependem de animação Framer Motion
(`AnimatePresence mode="wait"`) travam porque o `requestAnimationFrame` que resolve a
transição nunca dispara. Contornei checando estado via `document.body.innerText` /
`getComputedStyle` direto no DOM (sem depender de composição de frame), e pra verificar
a `PerfilPage` troquei temporariamente o `useState` inicial do `screen` pra `'perfil'`,
conferi, e reverti — sem depender do clique animado. Confirmado via inspeção de DOM:
- `html` tem classe `dark` por padrão (tema escuro ativo sem ação do usuário)
- Sidebar: 5 itens corretos, item ativo com `bg-accent/15`/`text-accent` (verde,
  `rgba(88,204,2,0.15)` / `rgb(88,204,2)`) depois do fix da opacidade (ver D020)
- Header: fundo `rgb(23,27,36)` (`--surface` escuro), 🔥 laranja / 🪙 dourado / ❤️
  vermelho nas cores certas
- `PerfilPage` renderiza sem erro, conteúdo correto
- Console sem erros (só um `ERR_CONNECTION_REFUSED` residual do restart do servidor,
  não relacionado ao código)

**Não verificado nesta sessão** (limitação do ambiente, não decisão de pular): como
fica visualmente de verdade (cores exatas lado a lado, espaçamento, responsividade) —
recomendo o Davi dar uma olhada no navegador dele antes de eu seguir pro Bloco 2, já
que ele reclamou justamente de resultado visual na 5.0.

---

## Arquivos alterados

| Arquivo | Mudança |
|---------|---------|
| `sessions/planejamento-6.0.md` | **novo** — spec completa do reset 6.0, organizada por seção |
| `tailwind.config.js` | Tokens semânticos novos + `chunky-accent`/`chunky-surface` |
| `src/styles/globals.css` | `:root`/`html.dark` com os tokens novos; bege removido do claro |
| `src/lib/prefs.js` | Tema padrão `dark` (era `light`) |
| `src/components/Sidebar.jsx` | Reescrito — 5 destinos novos (Arena/Ligas/Missões/Loja/Perfil) |
| `src/components/Header.jsx` | **novo** — barra superior persistente |
| `src/components/ui/index.jsx` | `Button`/`Card`/`Badge` migrados pros tokens novos |
| `src/pages/PerfilPage.jsx` | **novo** — resumo mínimo, placeholder pro Bloco 6 |
| `src/pages/MenuPage.jsx` | Fix B009 (rodapé ilegível) + botão "Definir meta" |
| `src/App.jsx` | Monta `Header`, rota `perfil` |
| `sessions/sessao-044.md` | este arquivo |

---

## Status para retomar

**Pendências desta sessão:** nenhuma dentro do escopo do Bloco 1 — está fechado.

**Não fazer sem pedir:** não segui pro Bloco 2 (Vidas) ainda — combinei com o Davi ir
bloco por bloco, confirmando cada um antes de avançar.

**Próximo passo sugerido:** Davi confirma visualmente no navegador dele (ambiente de
preview não compõe frame aqui) → Bloco 2 (Vidas: 5/dia + compra) → Bloco 3 (Progressão
de tabuada) → Bloco 4 (Ligas) → Bloco 5 (Missões/desafios mensais) → Bloco 6 (Perfil
completo) → Bloco 7 (reorganização de Estatísticas). Ordem completa em
`sessions/planejamento-6.0.md`.

**Débito técnico conhecido, aceito de propósito:** duplo sistema de cor em paralelo
até o resto das telas migrar (ver D020) — normal durante um rollout em blocos, não é
esquecimento.
