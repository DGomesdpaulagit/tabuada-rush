# Sessão 105 — Acervo de sons catalogado (6.2, etapa 7)

**Data:** 2026-09-08
**Versão:** 6.0.58 → 6.0.59
**Tipo:** Acervo + medição — nenhum código de jogo mudou

---

## O que chegou

O Davi baixou som e avisou que ia sair (*"preciso sair agora, mas tarde vejo
mais"*). Então o trabalho desta sessão foi **inventariar, medir e deixar uma
lista curta**, pra quando ele voltar não ter que ouvir 158 arquivos.

| Pasta | Arquivos | Licença |
|---|---|---|
| `referencias/sons/kenney-interface/` | 100 `.ogg` | **CC0** — conferido no `License.txt` do pacote |
| `referencias/sons/kenney-ui/` | 54 `.ogg` | **CC0** — conferido |
| `referencias/sons/pixabay/` | 4 `.mp3` | ⚠️ a confirmar com ele |

Catálogo completo em **`referencias/sons/CATALOGO.md`**.

## O que eu fiz em vez de só guardar

Medi a **duração real de cada candidato** carregando os arquivos no navegador
(`loadedmetadata`) — 43 arquivos medidos. Sem isso, "click_002" e "click1"
parecem equivalentes pelo nome. Não são.

## Dois achados que mudam o plano

### 1. ⚠️ Tudo do Kenney é `.ogg`, e o iOS não toca `.ogg` de forma confiável

O jogo é PWA e vai rodar em celular. **Os arquivos escolhidos precisam ser
convertidos pra `.mp3`** antes de entrar. Não é defeito do material — é etapa
de preparo que ninguém tinha previsto.

### 2. ⚠️ Falta som de baú e de recompensa — e o motivo é estrutural

Os pacotes do Kenney são de **interface**. Os sons de "sucesso" deles são
*blips* curtos, não jingles:

| Precisamos | Alvo | O mais longo disponível | |
|---|---|---|---|
| Clique | ≤ 200 ms | vários entre 32-100 ms | ✅ resolvido |
| Abrir baú | ~1,2 s | `open_004` = **323 ms** | ⚠️ curto demais |
| Recompensa | ~1,5 s | `confirmation_002` = **539 ms** | ⚠️ não é jingle |

**Duas saídas, pra ele decidir:**
- **A** — baixar um pacote de *jingle/recompensa* (buscar `reward jingle`,
  `level up`, `treasure chest`), não de interface.
- **B** — **montar em camadas no código**: `open_004` e, 150 ms depois,
  `glass_001`. Dá as duas partes (tampa + brilho) sem baixar nada, e o
  `audioManager` já sabe tocar em sequência.

### 3. E um detalhe que só a medição pega

**`kenney-interface/click_002` a `click_005` medem 10 ms cada.** Isso é
1/100 de segundo — não é som, é estalo digital. Provavelmente truncados no
pacote. Pelo nome, seriam os candidatos óbvios pro clique; pela medição,
estão fora. Marcado no catálogo pra não cair nessa depois.

## A lista curta do clique (o único item resolvido)

| Arquivo | Duração |
|---|---|
| `kenney-ui/click1.ogg` | **94 ms** — o mais cheio dos curtos |
| `kenney-ui/click2.ogg` | **56 ms** — mais seco |
| `kenney-ui/click3.ogg` | 86 ms |
| `kenney-interface/click_001.ogg` | 100 ms |

Ele ouve os quatro e escolhe um.

## Guardado pra depois (dentro da partida — espera a Fase 1)

Os dois *risers* de 6 s (tensão/combo), o *clock ticking* de 9,4 s
(cronômetro acabando, em laço) e as **8 variações de erro** do Kenney. Som
novo durante a partida muda o ritmo de resposta, que é o que a Fase 1 mede.

Quando a Fase 1 fechar, tem material de sobra pro acerto/erro/combo.

## Próximos passos

1. **Davi ouve os 4 candidatos de clique** e escolhe um.
2. **Decide baú e recompensa:** opção A (baixar jingle) ou B (camadas).
3. **Confirma a origem dos 4 `.mp3`** do Pixabay, pro registro de licença.
4. **Eu converto pra `.mp3`**, coloco em `src/assets/sons/` e ligo no
   `audioManager`, com licença registrada por arquivo.
5. **Ainda pendente da 6.2:** as **poses do Tatuba** (não vieram no zip da
   sessão 104), as artes limpas (PNG, sem marca d'água, letreiro
   transparente, Tatuba sem a caixa) e a **decisão dos tons** de verde e azul.
6. 🔴 **E o principal, que não é arte nem som:** jogar em mais 2-3 dias
   diferentes pra fechar a Fase 1.
