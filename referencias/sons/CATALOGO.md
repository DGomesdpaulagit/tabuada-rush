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

---

## 🎛️ Decisão da sessão 106: baú e recompensa vão ser GERADOS no ElevenLabs

O Davi decidiu gerar os sons de baú no ElevenLabs em vez de baixar pacote.
O clique continua vindo do Kenney (lista curta acima).

### Primeiro a estrutura — o que toca, e em que ordem

Na página de recompensa (`PostGameSummary`, página 6) aparece **um item por
vez**: o baú abre e o recurso ou as Multis aparecem. Então o "som do combo
recompensa + baú" **não é um arquivo — é uma sequência de dois**, tocada em
código com ~250 ms entre eles:

```
página de recompensa entra
 └─ [1] BAÚ ABRE       comum (madeira/ferro/ouro)  ~1,3 s
                        OU místico                  ~2,0 s
      └─ +250 ms
         [2] RECURSO APARECE   pop + brilho         ~0,9 s   (power-up / poção)
         OU
         [3] MULTIS CAEM       moedas tilintando    ~1,2 s   (baú de moeda)

página "Nada desta vez"
 └─ [4] BAÚ VAZIO      rangido + moscas            ~1,5 s
```

**Por que separar em vez de gerar um arquivo por combinação:** são 4 baús ×
13 recursos. Separando, são **5 arquivos** e a sequência monta qualquer
combinação. Gerando junto seriam dezenas, e o timing entre baú e recurso
ficaria travado dentro do áudio, sem poder acompanhar a animação da 6.6.

**Sobre a "camada atmosférica":** recomendo **não** fazer um loop de
ambiente separado. Duas camadas de áudio trazem balanço de volume, emenda de
loop e restrição de autoplay no celular — tudo pra ganhar um efeito que a
**cauda de 2 s do baú místico já entrega** se o prompt pedir. A atmosfera
mora dentro do som do baú, não ao lado dele.

### Os 5 prompts (em inglês — o ElevenLabs responde melhor)

| # | Arquivo final | Duração | Prompt |
|---|---|---|---|
| 1 | `som_bau_comum.mp3` | **1.3 s** | Small cartoon treasure chest opening: a wooden lid creaks open with a soft latch click, then a short bright sparkle shimmer as light spills out. Playful game sound, clean, no music, no voice, ends cleanly. |
| 1b *(opcional)* | `som_bau_ferro.mp3` | 1.3 s | *mesmo prompt, trocando o começo por:* an iron lid swings open with a heavier metallic clank and hinge squeak |
| 1c *(opcional)* | `som_bau_ouro.mp3` | 1.3 s | *mesmo prompt, trocando o começo por:* a golden lid opens with a rich, warm metallic ring |
| 2 | `som_bau_mistico.mp3` | **2.0 s** | Mystical treasure chest opening: a deep resonant hum swells, the lid opens with a soft magical whoosh, then an ethereal crystalline shimmer glows and slowly fades. Enchanted, otherworldly, cartoon game style, no drums, no voice, gentle tail. |
| 3 | `som_recurso.mp3` | **0.9 s** | Reward item reveal: a quick soft pop followed by a rising magical sparkle chime, bright and playful, cartoon game UI sound, no voice, no music, clean ending. |
| 4 | `som_multis.mp3` | **1.2 s** | A handful of gold coins pouring and clinking into a pile, bright metallic jingle, short and cheerful, cartoon game style, no voice, no music. |
| 5 | `som_bau_vazio.mp3` | **1.5 s** | An old wooden chest creaks open slowly, revealing nothing; two small flies buzz around for a moment, then a short comedic descending slide whistle. Playful, cartoon, no voice, no music. |

O Davi pediu **1 som pros três baús comuns** — é o #1. Os 1b/1c são
variações opcionais, se ele quiser que ferro e ouro soem diferentes; custam
uma geração cada e a sequência já aceita.

### Como gerar (ElevenLabs → Sound Effects)

1. Colar o prompt **em inglês**.
2. **Definir a duração** no controle (não deixar automático) — é o que
   garante que o som cabe na animação.
3. *Prompt influence* em torno de **0,65** — literal o suficiente pra não
   inventar música.
4. Gerar **4 variações** de cada e escolher a melhor. Uma só quase nunca é a
   boa.
5. Baixar em **MP3** — já sai no formato certo, sem o problema do `.ogg`.

### ⚠️ Licença — conferir ANTES de gerar o conjunto final

O plano **gratuito** do ElevenLabs exige **atribuição** e é **não
comercial**. Só os planos pagos (a partir do Starter) dão direito de uso
comercial. Como o TabuDecor vai ser distribuído, isto precisa estar
resolvido antes de o som entrar no jogo. Conferir o plano na conta.

### Como me entregar

- Os 5 (ou 7) arquivos `.mp3` com os nomes da tabela, no Downloads
- **Sem silêncio no começo** — o ElevenLabs às vezes deixa ~50 ms; se
  deixar, eu corto no processamento, só avisar
- Me dizer qual plano do ElevenLabs foi usado, pro registro de licença

### Próximo passo

1. **Clique:** ouvir os 4 do Kenney e escolher um.
2. **Baús:** gerar os 5 no ElevenLabs com os prompts acima.
3. **Eu integro** os 6 em `src/assets/sons/`, ligo no `audioManager` com a
   sequência de 250 ms, e registro a licença por arquivo.
