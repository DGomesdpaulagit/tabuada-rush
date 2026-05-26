# 📋 Sessão 013 — Ajustes: header (remover áudio) + login condicional

**Data:** 2026-05-26
**Duração:** Sessão curta (ajustes de lógica/organização)
**Resultado:** ✅ Botão de áudio do header removido (centralizado nas Configurações); botão de login só aparece quando deslogado

---

## 🎯 OBJETIVO

Remover redundâncias nos botões do header do menu, sem mexer no visual.

---

## ✅ O QUE FOI FEITO

### 1. Remoção do botão de áudio/volume separado
- Removido do header do `MenuPage` o botão de ligar/desligar som (Volume2/VolumeX).
- Motivo: som, música e volume já estão na página de Configurações → não faz sentido um botão separado.
- Limpeza: removidos `useAudio`, `Volume2`, `VolumeX` e usos correlatos (sem código morto — grep confirmou 0 referências).

### 2. Botão de login/conta condicional
- Antes: mostrava botão de login (deslogado) **e** botão de logout (logado) no header.
- Agora: **só mostra o botão de login quando o usuário NÃO está logado** (`{!user && ...}`).
- Logado → header sem botão redundante (logout/conta ficam dentro das Configurações → Conta).
- Removido o branch de logout do header e o `signOut`/`LogOut` não usados.

### 3. Mantido
- Área de Conta dentro das Configurações (login/logout/sincronização/progresso) — intacta.
- Indicadores informativos do menu (sincronizando / e-mail logado) mantidos (não são botões).

---

## 📦 ARQUIVOS

| Arquivo | Mudança |
|---------|---------|
| `src/pages/MenuPage.jsx` | header: removido botão de áudio; login só quando deslogado; imports/usos limpos |

---

## 🔧 DECISÃO TÉCNICA

- **D047 — Centralizar áudio nas Configurações:** evita controle duplicado; o toggle/volume/música vivem só em Settings.
- **D048 — Login condicional no header:** sem botão quando logado (conta acessível via Configurações), reduzindo poluição.

---

## 🎨 IDENTIDADE VISUAL

✅ Inalterada — apenas remoção/condicional de botões. Mesmos estilos e layout.

---

## ✅ VERIFICAÇÃO

- Header (deslogado) agora tem só: **Configurações** + **Entrar / Criar conta**. Botão de áudio ausente. Build sem erros.

---

## 📋 PRÓXIMOS PASSOS / SESSÕES / ETAPAS

1. Economia/Loja (uso completo das moedas).
2. Leaderboard global via Supabase.
3. Música de fundo real + notificações reais (estrutura preparada).
4. Futuros: temporadas, sistema social, recompensas avançadas, gráficos avançados, catálogo, marketplace, missões.
