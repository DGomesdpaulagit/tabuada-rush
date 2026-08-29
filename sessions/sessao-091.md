# Sessão 091 — FASE 8 planejada (Arena) + arte nova processada

**Data:** 2026-08-29
**Versão:** 6.0.39 → 6.0.40
**Tipo:** Planejamento + preparação de arte (nenhuma tela mudou)

---

## O que aconteceu

O Davi ditou a **Fase 8 inteira** de uma vez: Header (faixa de tabuada
virando troféu + painel de ofensiva reformado), painel de início da Arena
(divisão no canto, missões do dia, 3 modos mais jogados) e uma lista de
edições gerais. Mandou junto 6 arquivos e um artigo do Duolingo sobre a
reforma das abas deles.

Pela regra do `CLAUDE.md` — **fase nova só depois dele confirmar o plano**
— esta sessão **não implementou nada**: montei o plano em 6 blocos no
`PLANO_ACAO.md` e preparei a arte que já dava pra preparar.

---

## Arte processada

| Arquivo dele | Virou | Onde vai ser usado |
|---|---|---|
| `icone de estrela.png` | `conquista-estrela` | Perfil → Conquistas |
| `icone de relogio.png` | `conquista-relogio` | Conquistas |
| `icone de livro.png` | `catalogo-livro` | Perfil → Catálogo |
| `icone de conquista bloqueada.png` | `conquista-bloqueada` | Conquistas |
| `ícones das faixas de tabuada.png` | ⛔ **não deu** | ver bloqueio |
| `frases_ofensiva.pdf` | 15 frases extraídas | painel de ofensiva |

### As frases do PDF

O PDF é do ReportLab com fonte embutida em subset — as bibliotecas de
leitura de PDF não estão instaladas aqui, então extraí na mão:
descomprimi os streams (ASCII85 + Flate), li os CMaps `ToUnicode` e mapeei
byte a byte. Resultado: **15 frases, 5 por estado** (acesa / apagada /
congelada), transcritas no `PLANO_ACAO.md`.

---

## 🔴 Dois bloqueios pra ele resolver

1. **Folha dos troféus de faixa com fundo colorido.** A imagem que ele
   colou no chat tinha fundo branco; o arquivo que chegou no Downloads tem
   um **fundo colorido borrado** atrás dos 20 troféus. É o pior caso pro
   recorte (D064): fundo colorido em volta de arte colorida, com brilho.
   Pedi a mesma folha com fundo **branco ou transparente** —
   `trofeus_faixas_fundo_branco.png`.

2. **Falta o ícone de ofensiva APAGADA** (cinza). Ele mesmo previu isso
   ("se não tiver o apagado faça o pedido") — `ofensiva_apagada.png`.
   Ofereci a alternativa de dessaturar a acesa, se ele preferir não gerar.

---

## Achado bom: 20 faixas ↔ 20 troféus

`TABUADA_TIER_RANGES` gera **20 faixas** (1 + 19), e a folha dele tem
exatamente **20 troféus** (5×4), em ordem de simples → elaborado. Encaixa
1 pra 1, sem sobra nem falta.

**De quebra:** o `CLAUDE.md` diz "LEVELS 28 c/ title" — está **errado**
desde alguma versão antiga. Corrigido pra 20 nesta sessão.

---

## Duas perguntas que o plano deixou em aberto

1. A frase *"Duas horas para sua ofensiva zerar!"* fala de tempo — deixo
   fixa ou troco pelo tempo real até a meia-noite?
2. Tirando o botão "Recompensas" do menu, a `RewardsPage` fica sem porta
   de entrada — apago a tela ou movo o acesso pra outro lugar?

---

## Arquivos alterados

| Arquivo | Mudança |
|---------|---------|
| `PLANO_ACAO.md` | FASE 8 detalhada em 6 blocos, com bloqueios e ordem |
| `src/assets/icons/*` | 4 ícones novos (estrela, relógio, livro, bloqueada) |
| `referencias/icones/**` | 6 arquivos organizados (categorias novas: `faixas-tabuada`, `conquistas`) |
| `CLAUDE.md` | "LEVELS 28" → 20 |

---

## Status para retomar

**Esperando o Davi confirmar o plano da Fase 8** (e responder as duas
perguntas). Assim que ele aprovar, a ordem sugerida é:
**8.6 (edições gerais, sem bloqueio) → 8.1 (troféus) → 8.2 (ofensiva) →
8.3/8.4/8.5 (Arena)**.
