# Sessão 096 — Painel de ofensiva (8.2): FASE 8 CONCLUÍDA

**Data:** 2026-08-29
**Versão:** 6.0.44 → 6.0.45
**Tipo:** Implementação (último bloco da FASE 8)

---

## 1. Estrela no Catálogo

Pedido rápido dele: a estrela também em **Catálogo → Marcos de Progresso**.
Entrou no cabeçalho da seção e no card "Nível alcançado" (que usava o
`Star` da lucide).

## 2. Bloco 8.2 — painel de ofensiva

### Três estados, não dois

O Header tratava "sem ofensiva" e "congelada pelo Seguro" como a **mesma
coisa** (chama azul). Isso dizia algo errado: quem está com 0 dias não tem
nada congelado, está **apagado**. Agora:

| Estado | Quando | Ícone | Cor |
|---|---|---|---|
| **Acesa** | ofensiva > 0 | `ofensiva` | laranja |
| **Congelada** | Seguro segurando (`streakInsuredAt`) | `ofensiva-congelada` | azul |
| **Apagada** | ofensiva = 0 | `ofensiva-apagada` | neutro |

O bloco do painel inteiro **veste a cor da situação**, como ele pediu.

### O que mudou no painel

- **Ícone grande** (52px) no lugar do pequeno
- **Caixas dos dias maiores** (28px) e mais juntas
- **O recorde saiu** — vive agora no Perfil e no painel completo. No lugar
  entra uma das **15 frases** dele, conforme a situação
- **Próxima conquista de ofensiva** logo abaixo, com o cadeado novo
- Botão virou **"Ver mais"**, que abre o painel completo

### As frases

`constants/streakPhrases.js`, texto dele preservado. Duas decisões:

1. A frase "Duas horas para sua ofensiva zerar!" virou **tempo real até a
   meia-noite** (ele autorizou) — por isso as frases são funções, não
   strings, e a de tempo tem variante pra "menos de uma hora".
2. **O sorteio é preso ao dia**, não aleatório a cada render. Com
   `Math.random()` puro a frase trocaria toda vez que o painel abrisse e
   fechasse, o que fica nervoso na cara do jogador. Assim ela é estável
   durante o dia e muda no dia seguinte.

### Painel completo ("Ver mais")

Componente novo `components/StreakPanel.jsx`, com tudo que ele listou:
quantidade · ícone da situação · frase · **calendário mensal** (dias
jogados com a arte, dia congelado em azul, hoje contornado) · **meta de
ofensiva** com barra · **caixa de conquista** · **recorde geral**.

---

## 3. Ferramenta: o script agora sabe clicar

O painel de ofensiva só existe depois de um clique — não dava pra
fotografar. `scripts/tirar-telas.mjs` ganhou **`--acao "<js>"`**: roda uma
interação na página carregada, espera, e aí captura. Foi assim que
registrei o painel aberto e o modal completo.

---

## Um tropeço

A troca do botão "Ver perfil" → "Ver mais" pegou **dois** painéis (o da
faixa de tabuada e o da ofensiva), porque os dois tinham o mesmo código de
botão. O da faixa voltou pro "Ver perfil". Achei conferindo o resultado da
substituição, não confiando nela.

---

## Arquivos alterados

| Arquivo | Mudança |
|---------|---------|
| `src/constants/streakPhrases.js` | **novo** — as 15 frases + tempo real |
| `src/components/StreakPanel.jsx` | **novo** — estados, calendário e o painel completo |
| `src/components/Header.jsx` | painel reformado + modal |
| `src/pages/CatalogPage.jsx` | estrela em Marcos de Progresso |
| `scripts/tirar-telas.mjs` | `--acao` |

---

## 🏁 FASE 8 concluída

| Bloco | |
|---|---|
| 8.1 troféus das faixas | ✅ |
| 8.2 painel de ofensiva | ✅ |
| 8.3 caixa de divisão | ✅ |
| 8.4 missões do dia | ✅ |
| 8.5 três modos | ✅ |
| 8.6 edições gerais | ✅ |

**O que sobra no backlog** (nada bloqueando):
- Tipos de pontuação por faixa numérica (100/200/500/1000) —
  `PENDENCIAS.md`, esperando ele definir o que fazer com alvo entre faixas
- Ícones das conquistas (ele mencionou que viriam depois)
- Dívida de layout: o modal de meta de ofensiva ainda abre por cima do
  conteúdo na primeira visita
