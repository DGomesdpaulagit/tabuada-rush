# Sessão 040 — Tabuada Rush 4.0 · FASE 6 (Perfil de Domínio Unificado) · 🎉 ROADMAP 4.0 COMPLETO

**Data:** 2026-07-06
**Versão:** 3.15.0 → **3.16.0**
**Tipo:** Implementação (Fase 6 — última fase do roadmap 4.0)
**Próxima sessão:** (a definir — roadmap 4.0 completo)

---

## 🎉 Roadmap 4.0 100% entregue

Esta sessão fecha o roadmap completo da Tabuada Rush 4.0, planejado na
sessão 034. **Seis fases**, dois pilares (**Matemática Completa** +
**Inteligência Adaptativa**), de v3.11.0 a v3.16.0.

---

## Resumo executivo da Fase 6

Últimos três itens do roadmap — todos sobre **consolidar** as 4 operações
num perfil só, em vez de tratá-las como 4 abas isoladas:

1. **`computeOperationMastery(data)`** — nova função central que resume o
   domínio do jogador nas 4 operações (dominado/total/% por operação). Vira
   a base dos outros dois itens.
2. **Certificado "Matemática Fundamental Completa"** — só desbloqueia
   quando as 4 operações têm TODOS os certificados de domínio completos.
   Card dedicado no topo da tela de Conquistas (antes das abas por
   operação), com progresso "X/4 completas" quando ainda bloqueado.
3. **`computeQI` pesa amplitude** — novo componente (0-10 pontos) baseado
   na média do % de domínio nas 4 operações. Um jogador só-multiplicação
   trava perto de 25% desse bônus; um jogador bem distribuído chega perto
   do máximo. Não reduz nenhum peso existente (só adiciona), preservando o
   QI de quem já jogava antes desta sessão.
4. **Radar "Domínio por Operação"** — gráfico novo (Recharts `RadarChart`)
   no topo do Mapa de Domínio no Catálogo de Precisão, mostrando o % de
   domínio nas 4 operações de uma vez, antes do usuário entrar no detalhe
   por aba.

---

## Detalhes técnicos

### `computeOperationMastery(data)` (`src/utils/index.js`)
```js
OPERATION_ORDER.map((op) => {
  const certs = computeCertificates(data.factStats?.[op] || {}, op);
  const dominated = certs.reduce((s, c) => s + c.dominated, 0);
  const total = certs.reduce((s, c) => s + c.total, 0);
  return { operation, label, dominated, total, pct, allCertsUnlocked };
});
```
Reaproveita `computeCertificates` (já existia desde a Fase 1) — sem duplicar
nenhuma lógica de classificação de domínio.

### `hasFullMasteryCertificate(data)`
`computeOperationMastery(data).every((m) => m.allCertsUnlocked)`.

### `computeQI` — novo componente de amplitude
```js
const avgMasteryPct = computeOperationMastery(data).reduce((s,m)=>s+m.pct,0) / 4;
const breadthPts = (avgMasteryPct / 100) * 10; // 0-10
```
Somado aos componentes existentes (precisão, velocidade, ofensiva,
consistência, progresso) — nenhum peso anterior foi reduzido.

### UI
- **AchievementsPage.jsx**: card "Matemática Fundamental Completa" (ícone
  `Crown`, dourado quando completo) entre a barra de progresso geral e os
  Certificados de Domínio por aba.
- **AccuracyCatalogPage.jsx**: card "Domínio por Operação" com
  `RadarChart` (4 eixos: Multiplicação/Adição/Subtração/Divisão), antes das
  abas do Mapa de Domínio.

---

## Verificação (ponta a ponta)

1. `computeOperationMastery({})` → 4 operações, todas 0%, totais corretos
   por operação (mult=80, add=121, sub=66, div=80 — batendo com os cálculos
   das Fases 2/3)
2. Simulado domínio total só em multiplicação → `hasFullMasteryCertificate`
   = `false` (1/4), QI = 73
3. Simulado domínio total nas 4 operações → `hasFullMasteryCertificate` =
   `true` (4/4), QI = 80 — confirma o bônus de amplitude funcionando e o
   certificado desbloqueando só no caso certo
4. **Fluxo real no app**: dados de domínio total nas 4 operações
   gravados no `localStorage`, app recarregado — **"QI 80" apareceu no
   Menu**, confirmando que o cálculo passa pelo fluxo real
   (`AppContext` → `getQiInfo` → `computeQI`), não só em teste isolado
5. Módulos `AchievementsPage.jsx`/`AccuracyCatalogPage.jsx` carregam sem
   erro via `import()` dinâmico contra o bundle real

**Build:** ✅ `npm run build`, 0 erros (2780 módulos, ~22s)

---

## Decisões técnicas

1. **Amplitude é ADITIVA no QI, nunca subtrativa** — um jogador que já
   tinha QI alto só de multiplicação não perde pontos por não ter tocado
   soma/subtração/divisão ainda. O bônus de amplitude é só mais um caminho
   pra subir, preservando o QI de quem já jogava antes desta sessão.
2. **Certificado supremo não entra no contador de `ACHIEVEMENTS`** —
   fica como card visual separado (mesmo padrão dos Certificados de
   Domínio normais, que também são "por fora" da lista principal de
   conquistas). Evitou reestruturar o sistema de conquistas pra um item só.
3. **Radar antes das abas, não substituindo** — a visão unificada
   (radar) complementa o detalhe por aba (Mapa de Domínio/Certificados),
   não substitui. O jogador vê o resumo primeiro, decide se quer entrar
   no detalhe de uma operação específica.

---

## 📋 Resumo final do roadmap 4.0

| Fase | Versão | Sessão | Entrega |
|------|--------|--------|---------|
| 1 — Fundação Multi-Operação | 3.11.0 | 035 | `OPERATIONS`, `getFactKey`/`getFactSpace`, `generateQuestion`, schema namespaced |
| 2 — Soma e Subtração | 3.12.0 | 036 | Conteúdo novo, seletor de operação, `isValid` (grade triangular) |
| 3 — Divisão | 3.13.0 | 037 | `cellFact` (grade invertida da mult), 🎉 Matemática Completa fechada |
| 4 — Inteligência Preditiva | 3.14.0 | 038 | Curva de esquecimento, motor preditivo no Modo Revisão, banner "Fatos a Vencer" |
| 5 — Adaptação Universal | 3.15.0 | 039 | Viés adaptativo em Rush/Sobrevivência/Velocidade/Zen, toggle em Configurações |
| 6 — Perfil de Domínio Unificado | 3.16.0 | 040 (esta) | Certificado supremo, QI com amplitude, radar cross-operação |

**Total:** 6 fases · de v3.10.0 a v3.16.0 em 6 sessões consecutivas (035-040).

**Filosofia realizada** (sessao-034): *"O Tabuada Rush 3.0 ensinou a
dominar a tabuada de multiplicação. O 4.0 expande esse domínio para a
matemática básica completa e usa os dados reais de cada sessão para prever
o que o jogador está prestes a esquecer, adaptando a dificuldade antes que
ele erre, não depois."* — os dois pilares (Amplitude + Inteligência
Adaptativa) estão implementados e verificados.

---

## Arquivos alterados

| Arquivo | Mudança |
|---------|---------|
| `src/utils/index.js` | `computeOperationMastery`, `hasFullMasteryCertificate`, `computeQI` com bônus de amplitude |
| `src/pages/AchievementsPage.jsx` | card "Matemática Fundamental Completa" |
| `src/pages/AccuracyCatalogPage.jsx` | radar "Domínio por Operação" (Recharts) |
| `CHANGELOG.md` | entrada [3.16.0] + fechamento do roadmap 4.0 |
| `MEMORY_CORE.md` | Fase 6 marcada ✅, roadmap 4.0 100% fechado |
| `MEMORY.md` | versão atualizada |
| `sessions/sessao-040.md` | este arquivo |

---

## Status para retomar

- **Build:** ✅ limpo
- **Roadmap 4.0:** ✅ **100% ENTREGUE** (Fases 1-6)
- **Próxima sessão:** sem roadmap formal — possíveis caminhos (nenhum
  urgente): polimento/bug-fixing, pequenas iterações baseadas em uso real,
  publicação Play Store (ação pendente desde a sessão 033), ou início de
  uma futura 5.0 se surgir uma nova visão.
