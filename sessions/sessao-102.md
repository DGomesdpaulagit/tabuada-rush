# Sessão 102 — O botão de baixar a coleta foi pro lugar errado

**Data:** 2026-09-07
**Versão:** 6.0.55 → 6.0.56
**Tipo:** Correção de acesso (ferramenta de Fase 1)

---

## O problema

Na sessão 101 eu pus o botão "Baixar coleta" no painel `?screen=dominio` e
mandei o Davi abrir `localhost:3000/?screen=dominio`. Ele voltou: *"não
consigo entrar."*

**Estava errado por três motivos, e o terceiro é meu erro de raciocínio.**

### 1. O servidor não estava de pé

O dev server que eu subi na 101 foi encerrado junto com a sessão (1h depois),
e a porta 3000 estava livre. `localhost:3000` não respondia pra ninguém.

### 2. `?screen=` não existe em produção

`App.jsx:378` — `if (!import.meta.env.DEV) return 'menu'`. O atalho de tela
é ferramenta de desenvolvimento e o Vite remove o ramo no build. Ou seja:
mesmo que ele tentasse no Vercel, ia cair no menu.

### 3. 🚨 O save está no endereço onde ele JOGA — e eu mandei no outro

Este é o que importa. O `localStorage` é **por origem**. Se o Davi joga em
`tabuada-rush-rho.vercel.app`, a coleta está lá; o `localhost:3000` tem um
save **vazio e diferente**. Eu estava mandando ele buscar o dado num lugar
onde o dado nunca esteve.

**A lição:** ferramenta que depende de servidor local + URL com parâmetro +
build de desenvolvimento tem três pontos de falha antes de o Davi conseguir
clicar em qualquer coisa. Pra uma ação que ele precisa fazer **uma vez**,
isso é frágil demais.

## A correção: botão dentro de Configurações

Seção nova **"Coleta de Aprendizado"** na `SettingsPage`, logo acima da Zona
de Perigo. Funciona **em qualquer endereço, sem servidor e sem URL mágica** —
ele abre o jogo do jeito que sempre abre, vai em Configurações e clica.

Mostra os três números **antes** de baixar, pra ele ver de relance se vale a
pena mandar o arquivo ou se falta jogar mais:

```
[ 412 ]      [ 18 ]      [ 4 ]
RESPOSTAS    CONTAS      DIAS
```

O arquivo sai como `coleta-dominio-AAAA-MM-DD.json` e agora carrega também o
**`origin`** — assim eu sei de qual endereço veio, e a confusão do motivo 3
não se repete.

**Botão desabilitado** quando não há nada coletado, com a explicação ("jogue
uma partida até o fim") em vez de um botão morto sem motivo.

**É temporário:** sai quando a Fase 2 fechar, junto com o `calibra` — que já
é descartável por construção (`ARQUITETURA_XP.md` §4.2). Anotado no código.

## Conferido

Os dois estados, pelo DOM:

| Estado | Resultado |
|---|---|
| Perfil vazio | `0 / 0 / 0`, botão travado, texto "Nada coletado neste aparelho ainda" |
| Com coleta semeada | `412 respostas / 18 contas / 4 dias`, botão liberado |

**Não saiu captura de tela:** a janela do preview parou de desenhar no meio
da verificação (fica atrás de outra janela e o navegador para de pintar).
Como a mudança é uma seção de texto + botão reaproveitando os componentes
`Section` e `Button` que a página inteira já usa, a checagem por DOM cobre —
mas fica registrado que não foi visto com o olho.

O dado falso que usei pra testar foi removido do perfil de teste.

## Próximos passos

1. **Davi abre o jogo do jeito que sempre abre** → Configurações → **Baixar
   coleta** → manda o arquivo.
2. **Eu rodo a análise da Fase 1**: distribuição 🔴/🟡/🟢 das 54 contas,
   quais ficam vermelhas, se o corte de 95% é alcançável, se a base p25 está
   estável, e o falso positivo/negativo por hold-out no tempo.
3. **Decidir**: fecha a Fase 1 e vai pra Fase 2 (calibrar), ou joga mais.
4. **Se fechar**, destrava em cascata: Fase 2 → Fase 3 → 6.3 (painel de
   domínio), 6.7 (Semana de Chama), 6.8 (Modo Geral) e os ícones de
   pontuação que saíram da 6.2.
5. **6.2 continua esperando ele:** logo, mascote e sons de fora da partida.
6. 🔴 **`DAILY_LIVES_ENABLED = true`** quando a Fase 1 acabar.
