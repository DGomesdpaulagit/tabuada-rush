# 🤖 PROMPTS.md — Prompts Úteis para IA

> Prompts testados e eficazes para continuar o desenvolvimento.

---

## 🚀 INÍCIO DE SESSÃO

```
Leia MEMORY_CORE.md e cloud.md.
Projeto: Tabuada Rush v2.0 — React/Vite/Tailwind/Framer Motion.
Dev server: npm run dev → http://localhost:3000
Storage key: tabuada_rush_v2 no localStorage.

[DESCREVER OBJETIVO DA SESSÃO AQUI]
```

---

## 🐛 DEBUG

```
Projeto Tabuada Rush (ver MEMORY.md para arquitetura).
Bug encontrado: [DESCRIÇÃO]
Arquivo suspeito: [CAMINHO]
Comportamento esperado vs atual: [DESCREVER]
Verifique o código e corrija.
```

---

## ✨ NOVA FEATURE

```
Projeto Tabuada Rush (ver MEMORY.md).
Quero adicionar: [FEATURE]
Contexto: [ONDE SE ENCAIXA NA ARQUITETURA]
Não altere outros componentes que funcionam.
Siga o design system existente (Nunito, rounded-2xl/3xl, gradientes por modo).
```

---

## 🎨 MELHORIA VISUAL

```
Projeto Tabuada Rush (ver MEMORY.md para design system).
Arquivo: [CAMINHO]
Melhoria: [DESCRIÇÃO]
Siga: fonte Nunito, rounded-3xl para cards, gradientes violeta/rose/amber/emerald por modo.
Animations: Framer Motion, pageVariants para transições.
```

---

## 📊 NOVA ESTATÍSTICA

```
Projeto Tabuada Rush.
Storage: tabuada_rush_v2 no localStorage (ver MEMORY.md → Schema de Dados).
Quero rastrear: [DADO]
Onde salvar: no handleGameEnd() em src/App.jsx
Onde exibir: src/pages/StatsPage.jsx
```

---

## 🚢 DEPLOY

```
Projeto Tabuada Rush — React/Vite.
Quero fazer deploy no Vercel.
Build: npm run build → pasta dist/
Verificar: vite.config.js (base path), index.html (meta tags), manifest
Passos: [configurar repositório GitHub, conectar Vercel, variáveis de ambiente se necessário]
```
