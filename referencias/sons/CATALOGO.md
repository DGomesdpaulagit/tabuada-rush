# 🔊 CATALOGO.md — acervo de sons (versão 6.2, etapa 7)

> Baixado pelo Davi na sessão 105. **Nada foi integrado ao jogo ainda** — isto
> é acervo de referência. A integração é trabalho de código, e depende das
> escolhas abaixo.
>
> Hoje o jogo **não usa arquivo de som nenhum**: ele sintetiza os bipes em
> código (`src/lib/audioManager.js`, Web Audio API).

---

## O que chegou

| Pasta | Arquivos | Licença | Origem |
|---|---|---|---|
| `kenney-interface/` | 100 `.ogg` | **CC0** ✅ *(conferido no `License.txt`)* | kenney.nl — "Interface Sounds (1.0)" |
| `kenney-ui/` | 54 `.ogg` | **CC0** ✅ *(conferido no `License.txt`)* | kenney.nl — "UI SFX Set" |
| `pixabay/` | 4 `.mp3` | ⚠️ **a confirmar** | nomes seguem o padrão de download do Pixabay |

**Sobre o `pixabay/`:** os nomes (`autor-titulo-ID.mp3`) batem com o padrão do
Pixabay, cuja licença permite uso comercial sem atribuição. **Mas não dá pra
confirmar isso pelo arquivo** — o Davi precisa confirmar de onde baixou. Os
do Kenney estão comprovados por arquivo de licença dentro do pacote.

---

## ⚠️ Dois problemas que a medição revelou

### 1. Tudo do Kenney é `.ogg`, e isso não toca no iPhone

O `.ogg` funciona bem em Chrome e Firefox, mas o **Safari do iOS não é
confiável com ele**. Como o TabuDecor é PWA e vai rodar em celular, **os
arquivos escolhidos precisam ser convertidos pra `.mp3`** antes de entrar no
jogo. Não é problema do material — é etapa de preparo.

### 2. Falta som de baú e de recompensa — e o motivo é estrutural

Medi a duração de cada candidato. Os pacotes do Kenney são de **interface**:
os sons de sucesso deles são *blips* de 300-500 ms, não jingles.

| Precisamos | Alvo | O mais longo que temos | Situação |
|---|---|---|---|
| Clique de botão | ≤ 200 ms | vários entre 32-100 ms | ✅ **resolvido** |
| Abrir baú | ~1,2 s (tampa + brilho) | `open_004` = 323 ms | ⚠️ **curto demais** |
| Recompensa | ~1,5 s (jingle) | `confirmation_002` = 539 ms | ⚠️ **não é jingle** |

**Duas saídas pro baú e pra recompensa:**

- **A —** baixar um pacote de **jingle/recompensa** (não de interface).
  Buscar por `reward jingle`, `level up`, `treasure chest` no Pixabay, ou o
  pacote de jingles do próprio Kenney.
- **B —** **montar em camadas no código**: tocar `open_00x` e, 150 ms depois,
  `glass_00x` ou `confirmation_00x`. Dá o efeito de duas partes sem baixar
  nada — e o `audioManager` já sabe tocar em sequência.

*(A opção B é mais trabalho de código e menos de download. Decidir com o Davi.)*

---

## 🎯 A lista curta — os candidatos, com duração medida

### Clique de botão ✅
Ouvir estes quatro e escolher **um**:

| Arquivo | Duração | Nota |
|---|---|---|
| `kenney-ui/click1.ogg` | **94 ms** | 🥇 o mais "cheio" dos curtos |
| `kenney-ui/click2.ogg` | **56 ms** | 🥈 mais seco |
| `kenney-ui/click3.ogg` | 86 ms | |
| `kenney-interface/click_001.ogg` | 100 ms | |

⚠️ **Não use `kenney-interface/click_002` a `click_005`** — medem **10 ms**
cada. Isso é 1/100 de segundo: não é som, é estalo digital. Provavelmente
arquivos truncados no pacote.

Outros que não servem pra clique: `switch_001`/`switch_002` têm **611-618 ms**
— longos demais, viram "ploc" arrastado. `tick_001`/`tick_002` (23 ms) são
curtos demais pra botão, mas **serviriam pro cronômetro**.

### Abrir baú — melhores disponíveis (curtos)

| Arquivo | Duração |
|---|---|
| `kenney-interface/open_004.ogg` | 323 ms |
| `kenney-interface/open_002.ogg` | 314 ms |
| `kenney-interface/glass_001.ogg` | 278 ms — o mais "brilho" |
| `pixabay/dragon-studio-pop-402324.mp3` | **720 ms** — o único longo, e já é `.mp3` |

**Combinação que eu tentaria (opção B):** `open_004` (tampa) + `glass_001`
(brilho) 150 ms depois. Ou o `pop` do Pixabay sozinho, que já tem corpo.

### Recompensa — melhores disponíveis

| Arquivo | Duração |
|---|---|
| `kenney-interface/confirmation_002.ogg` | 539 ms |
| `kenney-interface/maximize_005.ogg` | 526 ms |
| `kenney-interface/question_001.ogg` | 491 ms |
| `kenney-interface/confirmation_004.ogg` | 490 ms |

Nenhum é jingle. Servem como "confirmação", não como celebração.

---

## ⏸️ Guardado pra depois — sons de DENTRO da partida

Estes **não entram agora**: som novo durante a partida muda o ritmo de
resposta do jogador, que é exatamente o que a Fase 1 do Domínio está medindo.

| Arquivo | Duração | Serviria pra |
|---|---|---|
| `pixabay/11325622-clock-ticking-...mp3` | **9,4 s** | cronômetro acabando (em laço) |
| `pixabay/sdanezis-...riser-4.mp3` | **6,0 s** | tensão / combo subindo — precisa de corte |
| `pixabay/sdanezis-...riser-5.mp3` | **6,0 s** | idem |
| `kenney-interface/error_001..008` | — | som de erro (8 opções) |

O acervo de erro do Kenney tem **8 variações** — quando a Fase 1 fechar, tem
material de sobra pro acerto/erro/combo.

---

## Próximo passo

1. **Davi ouve a lista curta do clique** (4 arquivos) e escolhe um.
2. **Decide baú e recompensa:** baixar pacote de jingle (opção A) ou montar
   em camadas (opção B).
3. **Eu converto pra `.mp3`**, coloco em `src/assets/sons/` e ligo no
   `audioManager` — com registro de licença por arquivo.
