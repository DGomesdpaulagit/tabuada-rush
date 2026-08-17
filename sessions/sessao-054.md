# Sessão 054 — Header maior com painéis no hover (estilo Duolingo)

**Data:** 2026-08-17
**Versão:** 6.0.3 → 6.0.4
**Tipo:** Redesign de UI — barra superior persistente

---

## O que aconteceu

O Davi mandou 5 screenshots de referência: o stat bar do Duolingo (bandeira
do idioma / ofensiva / gemas / vidas) e os 4 painéis que abrem ao passar o
mouse em cada ícone daquele bar. Pediu pra recriar o mesmo padrão de
interação no Header do Tabuada Rush — bandeira do idioma vira o selo da
faixa de tabuada, gemas viram as moedas do jogo — com uma barra maior
(a atual "está muito pequena") e a faixa de tabuada juntada ao mesmo grupo
dos outros 3 indicadores (hoje ela fica isolada na ponta esquerda,
`justify-between` separando do resto).

Importante: os screenshots eram referência de **padrão de interação**, não
um pedido pra clonar as mecânicas do Duolingo. Onde a imagem mostrava algo
que o Tabuada Rush não tem (ofensivas de amigos, "Sociedade da Chama
Acesa", vidas ilimitadas por assinatura), adaptei pro que existe de
verdade no jogo em vez de inventar feature nova — mantendo o espírito do
guia de escopo do projeto (não adicionar mecânica desconectada do
aprendizado só pra "parecer com o app X").

---

## O que mudou

`src/components/Header.jsx` foi reescrito:

1. **Barra maior** — 70px de altura (era ~48px), pills com `text-base` em
   vez de `text-sm`.
2. **Faixa de tabuada junta ao grupo** — antes ficava sozinha na ponta
   esquerda; agora é a 1ª pill de um grupo único centralizado, junto com
   ofensiva/moedas/vidas. É o equivalente direto de onde fica a bandeira do
   idioma no Duolingo.
3. **Ícone de moedas trocou** — de `Coins` (lucide, dois círculos
   sobrepostos que lê fácil como gema) pra 🪙, que já era usado em outro
   canto do app (`NoLivesModal`) — resolve uma inconsistência visual que já
   existia, não só atende o pedido.
4. **Painel ao passar o mouse (ou tocar) em cada pill**, cada um com um
   botão de ação de verdade:
   - **Faixa:** progresso real até a próxima faixa (`getXpProgress`, já
     existia) → "Ver perfil".
   - **Ofensiva:** contador + mini-semana (Dom-Sáb, derivada de
     `data.sessions`) + recorde + a PRÓXIMA conquista de ofensiva ainda não
     batida, lida direto de `ACHIEVEMENTS` (categoria "Ofensiva") — nada
     hardcoded. Sem "amigos" nem "sociedade" fake — o jogo não tem sistema
     social; a conquista real "Chama Acesa" (10 dias) já cobre a mesma
     função de motivação.
   - **Moedas:** saldo + "Ir pra loja".
   - **Vidas:** corações preenchidos + tempo até o pote encher de novo
     (calculado até meia-noite — a mecânica real é pote diário, não
     regeneração por vida) + botão "Recuperar vidas" funcional (mesma
     lógica de `App.jsx handleBuyLifeRefill`, reimplementada local porque o
     original depende de um "modo pendente" que não existe aqui).
5. **Só um painel aberto por vez** — estado único `openId` compartilhado
   entre as 4 pills.

`App.jsx` passou a passar `onNavigate={setScreen}` pro Header (antes ele
não recebia nenhuma prop).

---

## Verificação

`npm run build` limpo. Diferente da sessão anterior, desta vez consegui
confirmar mais do que só o código — usei inspeção de DOM/JS pra clicar nos
4 gatilhos de verdade (bypassando o clique via mouse, que esbarra na mesma
limitação de compositing do Browser pane) e ler o conteúdo real renderizado:

- Painel da Faixa: "Faltam 27000 XP pra 📚 10×20" (número real, não
  fixo) — confirmado.
- Painel da Ofensiva (save zerado): "Faltam 5 dias pra 'Faísca' 🔥" —
  confirma que a leitura de `ACHIEVEMENTS` funciona.
- Só um painel abre por vez (faixa fechou ao abrir ofensiva).
- Fluxo de comprar vida testado de ponta a ponta: forcei
  `coins:200, vidas:2/5` no localStorage, cliquei "Recuperar vidas" (que
  aparece habilitado só quando dá pra comprar), e confirmei depois no
  storage: `coins:50, vidas:5/5` — descontou exatamente 150 e encheu o
  pote. O botão fica desabilitado sozinho tanto com pote cheio quanto sem
  moeda.

**Não confirmado:** a animação visual do hover em si (fade/slide do
painel) — mesma limitação de compositing do Browser pane já registrada na
sessão 053/BUGS.md. O conteúdo e a lógica, dessa vez, foram testados de
verdade (não só lidos no código).

---

## Arquivos alterados

| Arquivo | Mudança |
|---------|---------|
| `DECISIONS.md` | D032 — Header maior com painéis no hover |
| `CHANGELOG.md` | entrada 6.0.4 |
| `src/components/Header.jsx` | reescrita completa — barra maior, 4 pills unificadas, painéis no hover/clique |
| `src/App.jsx` | passa `onNavigate={setScreen}` pro Header |
| `sessions/sessao-054.md` | este arquivo |

---

## Status para retomar

**Pendências:** confirmação visual do Davi de como o hover/posicionamento
dos painéis fica na prática (o layout pode precisar ajuste fino olhando de
verdade — mesma ressalva da escada de Ligas na sessão 053).

**Próximo passo:** a critério do Davi.
