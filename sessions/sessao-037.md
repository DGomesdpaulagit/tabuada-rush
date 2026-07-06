# Sessão 037 — Tabuada Rush 4.0 · FASE 3 (Divisão)

**Data:** 2026-07-06
**Versão:** 3.12.0 → **3.13.0**
**Tipo:** Implementação (Fase 3 do roadmap 4.0 — última operação nova, roadmap "Matemática Completa" fechado)
**Próxima sessão:** Fase 4 — Inteligência Preditiva (Curva de Esquecimento)

---

## Resumo

Terceira e última operação nova da 4.0. Divisão é **derivada da multiplicação**
— cada fato de divisão é o inverso de um fato de multiplicação (`divisor ×
quociente = dividendo` ⟺ `dividendo ÷ divisor = quociente`). Isso trouxe um
desafio arquitetural que Soma/Subtração não tinham: a grade do Mapa de
Domínio/Certificados não podia usar `(a,b)` diretamente como em todas as
outras operações.

---

## O problema: grade vs. fato real

Nas operações anteriores, as coordenadas da grade (linha, coluna) SÃO os dois
operandos do fato (`getFactKey(op, row, col)`, `cfg.answer(row, col)`). Para
divisão isso quebra: se a grade fosse organizada por (dividendo, divisor)
diretamente, o dividendo teria que variar numa faixa "esparsa" (2 a 90, nem
todo valor entre eles é um dividendo válido) — não dá pra fazer um
`domainRows: [2..90]` limpo como as outras operações.

**Solução:** a grade organiza por **(divisor, quociente)** — exatamente a
mesma geometria 8×10 da multiplicação, só que invertida — e um novo mecanismo,
`cellFact(divisor, quociente)`, resolve o fato REAL (`{ a: dividendo, b:
divisor, ans: quociente }`) a partir das coordenadas. `getFactSpace`,
`computeCertificates` e o `MasteryMap` foram generalizados para chamar
`cellFact` quando ele existe (senão comportamento idêntico ao de antes).

Resultado visual: o Mapa de Domínio de Divisão é **literalmente idêntico em
números** ao de Multiplicação (linha `2÷` até `9÷`, coluna quociente 1-10,
célula = dividendo = divisor×quociente) — só a interpretação muda. Faz
sentido: são os dois lados do mesmo fato.

---

## O que foi feito

### 1. `OPERATIONS.div` (`src/utils/index.js`)
```js
div: {
  domainRows: [2..9],   // divisor
  domainCols: [1..10],  // quociente
  cellFact: (divisor, quociente) => ({ a: divisor*quociente, b: divisor, ans: quociente }),
  answer: (a, b) => a / b, // a=dividendo, b=divisor (usado na geração real)
}
```
Sem `isValid` — ao contrário da subtração, toda combinação (divisor,
quociente) é válida por construção (divisor×quociente sempre existe e é
exato). O "problema de combinação impossível" da divisão foi resolvido por
**construção** (`cellFact`), não por **filtro** (`isValid`).

### 2. Geração de perguntas: `getDivQuestion`
Sorteia divisor e quociente (mesma progressão por `diffLevel` de add/sub) e
calcula o dividendo — a divisão é **sempre exata**, nunca sorteia com resto.
Pergunta exibida: `"56 ÷ 7 = ?"`, resposta = quociente.

### 3. `getFactSpace`/`computeCertificates`/`MasteryMap` generalizados
Todos os três agora resolvem `(a,b)` via `cellFact` quando a operação tiver
um (função `resolveCellFact` em utils; lógica equivalente inline no
`MasteryMap`). Para mult/add/sub, `cellFact` é ausente → comportamento
100% idêntico ao de antes.

### 4. Escopo: Revisão em Divisão ainda cai para multiplicação
`tableStats.div` é agrupado por **dividendo** (não por divisor) — a lógica de
"tabuada mais fraca" do Modo Revisão não bate matematicamente com essa
indireção (um dividendo fraco não identifica QUAL divisor foi difícil). Em
vez de generalizar essa lógica agora (mais uma camada de indireção), a
Revisão em Divisão **cai para multiplicação** — decisão explícita, com aviso
no `ModesPage` ("Revisão em Divisão ainda usa multiplicação"). Rush,
Sobrevivência, Velocidade e Zen funcionam normalmente em Divisão.

### 5. `App.jsx` — operação efetiva por partida
Novo estado `activeOperation` (separado de `data.selectedOperation`) —
resolve o caso acima sem contaminar o `GamePage` com essa exceção: `startGame`
decide a operação efetiva (Divisão → multiplicação só para Revisão) e passa
o valor já resolvido para o `GamePage`, que continua sem saber dessa regra.

---

## Verificação (ponta a ponta, no navegador)

1. `getFactSpace('div').length === 80` (8×10, sem dedup — divisão não é
   comutativa, cada `(dividendo,divisor)` é único)
2. `generateQuestion('div', ...)` × 30 amostras: sempre exata, sempre bate
   com `dividendo/divisor === quociente` esperado
3. `computeCertificates({}, 'div')`: todos os 8 certificados com `total: 10`
   (nenhuma linha incompleta — confirma que `cellFact` não precisa de `isValid`)
4. **Fluxo completo no app**: Rush em Divisão → "12 ÷ 4", "15 ÷ 5" (símbolo ÷
   renderizado corretamente)
5. **Sobrevivência em Divisão até perder** (3 erros) → `localStorage`
   confirmado: `tableStats.div` (por dividendo: 4, 8, 20) e `factStats.div`
   (`div:4-2`, `div:8-4`, `div:20-4`) gravados corretamente
6. **Mapa de Domínio → aba Divisão**: grade idêntica em números à
   multiplicação (linha `2÷`...`9÷`, célula = dividendo), com as 3 células
   praticadas (`4`, `8`, `20`) exatamente nas posições esperadas
7. **Certificados → aba Divisão**: `÷2` a `÷9`, todos `0/10`, header `0/8`

**Build:** ✅ `npm run build`, 0 erros (2780 módulos, ~13s)

---

## Decisões técnicas

1. **`cellFact` em vez de forçar `(a,b)` = coordenadas da grade** — a
   alternativa (grade organizada por dividendo, com `domainRows` esparso)
   quebraria a geometria limpa que todas as outras operações têm. `cellFact`
   isola a indireção "grade ≠ fato real" num único ponto, sem espalhar
   `if (operation === 'div')` pelo código.
2. **Sem `isValid` para divisão** — diferente da subtração (que filtra
   combinações inválidas de um espaço bruto), a divisão CONSTRÓI só
   combinações válidas via `cellFact`. Mais simples e não precisa do filtro.
3. **Revisão em Divisão cai pra multiplicação, não vira "sem revisão"** —
   melhor ter uma Revisão funcional (ainda que da operação "errada") do que
   quebrar ou esconder o modo. Aviso explícito no `ModesPage` avisa o
   jogador. Fica pra uma fase futura resolver de verdade (precisa de
   `factStats.div`, não `tableStats.div`, pra identificar o divisor certo).
4. **Não reaproveitei o Modo Inverso como base da Divisão** — avaliado
   conforme o roadmap pedia, mas decidido manter separados: Inverso pergunta
   "quais os fatores de 56" (multiplicação), Divisão pergunta "56÷7=?"
   (conceito different — só um é derivado do outro na cabeça do jogador).

---

## 🎉 Roadmap "Matemática Completa" fechado

Com Soma (Fase 2), Subtração (Fase 2) e Divisão (Fase 3), a Tabuada Rush
agora cobre as **4 operações fundamentais**, todas com Mapa de Domínio e
Certificados próprios, selecionáveis via `OperationTabs`. O pilar
"Amplitude" da filosofia da 4.0 (sessao-034) está completo — os próximos
passos (Fases 4-6) são sobre **Inteligência Adaptativa** (previsão de
esquecimento, dificuldade adaptativa universal, perfil unificado).

---

## Arquivos alterados

| Arquivo | Mudança |
|---------|---------|
| `src/utils/index.js` | `OPERATIONS.div` (com `cellFact`), `resolveCellFact`, `getDivQuestion`, `generateQuestion` com `div`, `getFactSpace`/`computeCertificates` generalizados |
| `src/pages/AccuracyCatalogPage.jsx` | `MasteryMap` usa `cellFact` (linha/coluna ≠ fato real quando aplicável) |
| `src/App.jsx` | novo estado `activeOperation`; `startGame` resolve operação efetiva (Revisão+Divisão → mult) |
| `src/pages/ModesPage.jsx` | aviso quando Divisão selecionada (Revisão ainda é multiplicação) |
| `CHANGELOG.md` | entrada [3.13.0] |
| `MEMORY_CORE.md` | Fase 3 marcada ✅, roadmap Matemática Completa fechado, próxima sessão = Fase 4 |
| `MEMORY.md` | versão atualizada |
| `sessions/sessao-037.md` | este arquivo |

---

## Status para retomar

- **Build:** ✅ limpo
- **Fase 3 da 4.0:** ✅ completa — Divisão jogável, Mapa de Domínio/Certificados
  próprios, Rush/Sobrevivência/Velocidade/Zen respeitam a operação
- **Pilar "Matemática Completa" (Fases 1-3):** ✅ 100% entregue
- **Próxima sessão:** Fase 4 — Inteligência Preditiva. Ver `sessao-034.md`
  para o detalhamento: modelo de decaimento de memória por fato, painel
  "Fatos a Vencer", notificações via `lib/push.js`, aplicado às 4 operações.
