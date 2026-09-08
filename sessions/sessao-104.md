# Sessão 104 — O jogo virou TabuDecor e ganhou o Tatuba

**Data:** 2026-09-08
**Versão:** 6.0.57 → 6.0.58
**Tipo:** Identidade (versão 6.2) — decisão de marca + renome

---

## O que o Davi trouxe

> *"O nome do Jogo agora vai ser TabuDecor e o nome do Mascote é Tatuba e ele
> é um tatu."*

Mais um zip com as primeiras artes. **Só 2 dos arquivos chegaram** — o ícone
do app e o letreiro. As poses do mascote que ele mencionou não vieram no zip.

Originais arquivados em `referencias/marca/`.

## As duas artes

**Ícone (Tatuba):** tatu de frente, chapado, dentro do quadrado arredondado
de ícone de app. Silhueta forte, olhos grandes, casco com as faixas —
funciona no tamanho de ícone de celular. É a arte mais alinhada ao estilo
Duolingo que o projeto já produziu.

**Letreiro:** "TabuDecor" em verde, com uma calculadora laranja/amarela à
esquerda, sobre fundo preto.

## 🎨 O achado: as cores quase batem — e "quase" é caro

Eu ia apontar um conflito de três paletas (violeta do jogo × azul do tatu ×
verde do letreiro). **Fui conferir a paleta real antes de falar, e estava
errado.** O `CLAUDE.md` diz "paleta violeta", mas isso está desatualizado: o
violeta saiu na v5.0. Os tokens de verdade (`globals.css`) são:

| Token | Cor | Papel |
|---|---|---|
| `--accent` | **#58CC02** | verde — CTA primária, nav ativa |
| `--primary` | **#3B4FCC** | azul-índigo |
| `--coin` | **#FFC800** | amarelo |

**Ou seja: verde + azul + amarelo já É a paleta do jogo.** As artes dele
caíram na família certa por conta própria.

Medi as cores das imagens (canvas, amostragem por frequência de pixel):

| | Arte do Davi | Jogo hoje | Situação |
|---|---|---|---|
| Verde do letreiro | **#70B010** | `--accent` #58CC02 | mais escuro e oliva |
| Azul do Tatuba | **#2E7DF3** | `--primary` #3B4FCC | mais claro e mais ciano |
| Laranja da calculadora | **#FFA010** | `--coin` #FFC800 | laranja × amarelo-ouro |

**Nenhuma das três bate exatamente.** Não é conflito de identidade — é
desalinho de tom, do tipo que só aparece quando as coisas ficam lado a lado
na tela. **Barato de corrigir agora, caro depois de 93 ícones gerados.**

**Resíduo real encontrado de quebra:** o `index.html` ainda tem
`theme-color="#7C3AED"` — violeta, da paleta que saiu na v5.0. Isso é bug de
consistência do jogo, independente da arte.

## ✅ O renome (8 lugares)

Aplicado em Sidebar, MenuPage, notificações (2×), share card, Configurações,
e o `<title>` e a descrição do `index.html`. Build passa; conferido rodando —
`document.title` e a tela mostram **TabuDecor**, sem sobra de "Tabuada Rush".

### ⚠️ O que eu NÃO toquei, de propósito

**`const KEY = 'tabuada_rush_v2'` (`src/lib/storage.js`).**

A chave do `localStorage` é **endereço, não nome**. Trocar ela apagaria o
save inteiro do Davi — incluindo as **462 tentativas da coleta da Fase 1**,
que custaram 5 dias de jogo. O script de renome confere isso explicitamente
e falha se a chave mudar.

Mesma lógica pros comentários de código que citam o nome antigo: são
registro histórico, ficam.

## O que ainda falta nas artes

| | Problema | Por quê |
|---|---|---|
| Ambas | marca d'água **"Made with AI"** | vai aparecer no ícone do app |
| Ambas | são **JPEG** | precisa PNG |
| Letreiro | fundo **preto sólido** | precisa transparente |
| Ícone | tem a **caixa arredondada** embutida | ótimo pro ícone do app; mas pro mascote solto (conquista, tela vazia) preciso dele **sem caixa e de corpo inteiro** |
| — | as **poses** não vieram no zip | só chegaram 2 arquivos |

## Uma observação sobre o nome

Registrando uma vez, sem insistir — a decisão é dele e já foi tomada:
**"Decor" em português é a palavra de decoração.** A intenção é "decorar" no
sentido de memorizar, e o trocadilho funciona, mas convive com essa segunda
leitura. Se um dia aparecer confusão em loja de app ou em busca, é por aí.

## Próximos passos

1. **Davi reenvia as poses do Tatuba** — não vieram no zip.
2. **Decidir os tons:** o verde e o azul das artes viram os do jogo, ou os
   tokens do jogo viram os das artes? Uma das duas — hoje são quase iguais,
   que é o pior dos mundos.
3. **Artes limpas:** PNG, sem marca d'água, letreiro com fundo transparente,
   e o Tatuba de corpo inteiro sem a caixa.
4. **Aí eu integro:** ícone do app + manifest do PWA (que está quebrado —
   `manifet.json` sem o "s" e sem `<link rel="manifest">`), letreiro no
   Header e no Menu, `theme-color` corrigido.
5. **Renome fora do código** (repositório, URL do Vercel, docs) — decidir se
   vale agora ou depois.
6. **E o principal, que não é arte:** jogar em mais 2-3 dias diferentes pra
   fechar a Fase 1.
