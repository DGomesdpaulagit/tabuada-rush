# Sessão 103 — A análise da Fase 1 (dado real)

**Data:** 2026-09-07
**Versão:** 6.0.56 → 6.0.57
**Tipo:** Análise — nenhum código de jogo mudou

---

## O que chegou

O Davi mandou `coleta-dominio-2026-09-07.json`: **462 tentativas, 16
partidas, 53 das 54 contas**, jogadas entre 31/08 e 02/09.

**Origem: `http://localhost:3000`.** Vale registrar porque na sessão 102 eu
levantei a hipótese de que ele jogava no Vercel — **não jogava**. Ele joga
local mesmo. A hipótese estava errada; o botão em Configurações continua
sendo a solução certa pelos outros dois motivos (servidor caído e `?screen=`
ser DEV-only), mas o motivo que eu chamei de "o mais importante" não era o
caso dele.

Resultados completos em **`ARQUITETURA_XP.md` §4.3-R**. Aqui fica o resumo e
o raciocínio.

## Veredito: 5 de 6 perguntas respondidas; trava numa só

### ✅ A Fase 0 entregou

462 tentativas gravadas, **100% com tempo de decisão**, 99% válidas pra
fluência. A instrumentação funciona.

### ✅ O `firstKeyMs` valeu a pena — e o número prova

> até a 1ª tecla: 1886 ms · até enviar: 2445 ms → **digitação = 23%**

Medir pelo envio inflaria tudo em ~1/4 e puniria resposta de 2 dígitos por
ser de 2 dígitos. O "furo nº 1" da v4 era real, e agora tem tamanho.

### ✅ A 1ª pergunta É mais lenta: +49%

2759 ms contra 1855 ms. A §4.2 tinha registrado isso como *"suspeita a
verificar — medir antes de decidir"*. **Medido: descarta.** O marcador `q1`
já é gravado; falta só usar no filtro.

Gosto especialmente deste porque é o método funcionando: uma dúvida honesta
virou marcador, o marcador virou número, o número virou decisão.

### ✅ A base p25 é confiável

1451 ms, 39 fatos medidos, sem estabilizar. A definição não se mordeu.

### 🚨 O ACHADO: a precisão está saturada; quem discrimina é o tempo

| | p10 | mediana | p90 | amplitude |
|---|---|---|---|---|
| Precisão por conta | 80% | **100%** | 100% | **20 pontos** |
| Tempo por conta | 1239 ms | 1740 ms | 3489 ms | **2,8×** |

Acerto geral **95%**; **69% das contas com 100%**.

E o hold-out no tempo fecha o argumento — calculei a nota usando só o que
aconteceu até um corte T e medi o erro **depois** de T:

| Precisão ANTES | Contas | Acerto DEPOIS |
|---|---|---|
| < 70% | 2 | 94% |
| 70-89% | 3 | 96% |
| ≥ 90% | 20 | 97% |

**As três bandas dão o mesmo resultado.** Falso positivo: 0 de 20 — mas isso
é barato quando quase tudo é acerto. O que importa é que **a precisão não
prevê nada porque não varia**.

O tempo separa, e separa do jeito certo:

```
mais lentas                    mais rápidas
6×9   4176ms   63%             5×10  1201ms  100%
4×9   3616ms   90%             1×3   1228ms  100%
3×6   3513ms  100%   <---      6×10  1250ms  100%
3×9   3489ms  100%   <---      6×6   1282ms  100%
6×7   3149ms   77%             5×5   1319ms  100%
```

**3×6 e 3×9: 100% de acerto e entre os mais lentos do jogo.** A precisão diz
"dominado"; o tempo diz "ele está calculando". É literalmente a distinção
que motivou a arquitetura inteira — *"os dois terminam em acerto, e é por
isso que contar acertos não enxerga aprendizado"*.

**Consequência pra Fase 2:** os pesos estão invertidos em relação ao que o
dado mostra. Precisão pesa **40** e não separa; fluência pesa **20** e separa
tudo. A catraca (`PISO_PRECISAO` = 70) segue fazendo sentido como piso de
segurança — o que está caro é a precisão como *componente de nota*.

**Ressalva que eu faço questão de registrar:** é **um jogador só**, e um que
já sabe a tabuada do 2 ao 10. Numa criança aprendendo, a precisão deve variar
muito mais. O que este dado prova é mais estreito e mais útil: **para quem já
passou do estágio de errar, o tempo é o único sinal que sobra** — e é
exatamente esse jogador que o portão de faixa precisa julgar.

### ❌ O que trava: dias distintos

> **2 dias.** `MIN_DIAS_VERDE` = 3, `DIAS_ALVO` = 4.

| Estado | Contas |
|---|---|
| 🟢 verde | **0** (0%) |
| 🟡 amarelo | 48 (89%) |
| 🔴 vermelho | 6 (11%) |

**Mas 11 contas já têm nota ≥80 e estão travadas só pela falta de dias.**
Nota máxima 82, mediana 73 — o teto vem da consistência entregando 25-50 de
100 (1 ou 2 dias de 4).

O "0 verde" **não é o jogador falhando, é a medida incompleta.** E sem
espaçamento real não dá pra dizer se o corte de 95% é alcançável ou utópico —
que é uma das perguntas centrais da §4.3.

## O que falta: dias, não partidas

462 tentativas e mediana de 8 por conta já são volume suficiente. Falta o
jogador **aparecer em mais 2 dias diferentes**, mesmo que com poucas partidas
em cada.

Registro um dado de produto que apareceu de lado: `currentStreak: 0` e
`bestDayStreak: 1` — **ele nunca manteve 2 dias seguidos.** Num jogo cuja
mecânica central é a ofensiva, isso diz algo sobre o jogo, não só sobre a
coleta.

## Próximos passos

1. **Davi joga em mais 2-3 dias diferentes** — poucas partidas por dia
   bastam. Depois, Configurações → Baixar coleta de novo.
2. **Eu refaço a análise** com consistência de verdade e fecho a Fase 1.
3. **Fase 2 (calibrar)** já tem duas decisões prontas, esperando só o
   fechamento: **descartar a Q1 da fluência** e **rebalancear os pesos**
   (precisão saturada × fluência discriminante).
4. **Fase 3** liga o domínio → destrava 6.3 (painel), 6.7 (Semana de Chama),
   6.8 (Modo Geral) e os ícones de pontuação que saíram da 6.2.
5. **6.2 continua esperando ele:** logo, mascote e sons de fora da partida.
6. 🔴 **`DAILY_LIVES_ENABLED = true`** quando a Fase 1 fechar.
