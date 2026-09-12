# Sessão 108 — Vídeo com áudio nativo, e o limite dos sons do Duolingo

**Data:** 2026-09-12
**Versão:** 6.0.61 → 6.0.62
**Tipo:** Decisão de fluxo (6.2, etapa 7) — nenhum código de jogo mudou

---

## O pedido

O Davi quer abandonar a mesa de som (achou "muito áudio") e gerar
**vídeo + som no mesmo prompt**, perguntando se dá pra fazer isso no Google
Flow (Veo) ou outra plataforma — sem pagar Veo agora. E foi taxativo sobre
os sons do Duolingo do myinstants: quer eles **dentro do jogo de verdade**,
não como referência, e contestou a objeção de direito autoral ("está sendo
publicado na internet, ou seja, conteúdo público").

## Pesquisa de plataformas (dado muda rápido, então busquei ao vivo)

| Plataforma | Áudio nativo | Grátis | Preço |
|---|---|---|---|
| **Kling 3.0** | ✅ sim | ✅ sim, com marca d'água | ~R$0,50/s |
| Veo 3.1 (Flow) | ✅ sim, melhor qualidade | ❌ não | mais caro |
| Pika 2.5 | ⚠️ áudio é etapa separada | ✅ sim | ~R$40/mês |
| Runway Gen-4.5 | ❌ não | ✅ sim | — |

Recomendado: **Kling 3.0** — é a única grátis com áudio nativo real no
mesmo prompt.

## Por que vídeo gerado ainda não é o arquivo do jogo

Os mesmos 4 problemas da sessão anterior continuam valendo,
independentemente da plataforma: sem transparência real no celular, sem
contador de moedas variável (o jogo tem 52 combinações de baú×recurso),
peso incompatível com PWA, e o traço não seria o Tatuba/baú do jogo.

**Mas o vídeo resolve a dor real dele — nunca saber se som e animação
combinam antes de gerar.** Fluxo proposto:

1. Ele gera no Kling um vídeo com o prompt completo (visual + som),
   pedindo a duração desejada.
2. Eu extraio só o **áudio** do vídeo (ffmpeg).
3. A animação real (código, com a arte do jogo) usa esse tempo como
   referência.

Ele prompta os dois juntos, como queria; o vídeo em si não entra no jogo —
só o áudio e o tempo. Oferecido: escrever os prompts do Kling pros 3
momentos do roteiro (baú comum, místico, Multis).

## 🚨 Os sons do Duolingo — limite mantido, explicado sem ambiguidade

O Davi reafirmou que quer os arquivos de verdade no jogo e contestou a
objeção com "quem manda aqui sou eu" e "não é plágio, está publicado na
internet".

**Resposta dada, e o raciocínio por trás dela:** autoridade sobre o produto
(escopo, mecânica, direção visual) é dele, sempre — isso não está em
disputa nunca. Mas isto não é uma decisão de produto: é um fato sobre
direito de um **terceiro** (Duolingo) sobre um arquivo que não é dele nem
meu. "Publicado na internet" ≠ domínio público — é a mesma lógica de uma
faixa de música estar no Spotify: tocável não é o mesmo que livre pra
redistribuir dentro de outro produto.

**A distinção que fica registrada, porque ele mesmo já valida a metade
legítima:** copiar o **estilo** visual do Duolingo é prática do projeto
desde a sessão 063 (D041) e não é o problema. Copiar o **arquivo exato de
áudio** e distribuí-lo dentro de outro app é infração de direito autoral —
categoria diferente, risco real (remoção de loja, notificação legal).

**Decisão registrada:** não vou integrar os arquivos `.mp3` do Duolingo no
jogo. A alternativa oferecida — e que dá o mesmo resultado audível — é ele
mandar os 5 arquivos como **referência privada** (nunca redistribuídos), eu
descrevo o caráter de cada um pro ElevenLabs, e ele gera o equivalente.

**Se ele insistir depois de ver esta resposta, isso já é decisão dele
sabendo o risco** — mas a integração de código continua pela via do
equivalente gerado, não do arquivo original.

## Próximos passos

1. Davi decide: quer os prompts do Kling pros 3 momentos do roteiro?
2. Ele manda (ou não) os 5 `.mp3` do Duolingo como referência privada pro
   ElevenLabs gerar o equivalente.
3. Ainda pendente: o áudio de "conclusão de missões" que ele mencionou
   mas não anexou.
4. Ainda pendente da 6.2: poses do Tatuba, artes limpas, decisão dos tons.
5. 🔴 E o principal: jogar em mais 2-3 dias diferentes pra fechar a Fase 1.
