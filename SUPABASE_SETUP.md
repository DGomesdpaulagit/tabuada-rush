# ☁️ Configuração do Supabase — Passo a Passo

> Tempo estimado: 10 minutos

---

## 1. Criar conta gratuita

1. Acesse https://supabase.com
2. Clique em **Start for free**
3. Faça login com GitHub ou email

---

## 2. Criar novo projeto

1. Clique em **New project**
2. Escolha um nome (ex: `tabuada-rush`)
3. Defina uma senha para o banco (guarde em lugar seguro)
4. Selecione a região mais próxima (ex: South America - São Paulo)
5. Clique em **Create new project** — aguarde ~1 min

---

## 3. Criar a tabela de perfis

1. No painel do Supabase, clique em **SQL Editor** (ícone de código no menu lateral)
2. Clique em **New query**
3. Cole o SQL abaixo e clique em **Run**:

```sql
-- Tabela de dados do usuário
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null default '{}',
  updated_at timestamptz not null default now()
);

-- Segurança: cada usuário só acessa seus próprios dados
alter table public.profiles enable row level security;

create policy "Usuário acessa só seus dados" on public.profiles
  for all
  using (auth.uid() = id)
  with check (auth.uid() = id);
```

### 3.1. Leaderboard — REMOVIDO (sessão de 2026-07-06)

O Leaderboard Global (Desafio Diário/Semanal) foi removido do app — sem
página, sem botão no menu, sem upload de score. As tabelas
`leaderboard_daily`/`leaderboard_weekly` no Supabase (se você as criou
seguindo uma versão antiga deste guia) ficaram órfãs — não são mais lidas
nem escritas pelo app. Não foram apagadas automaticamente (ação destrutiva,
fora do escopo da remoção no código). Se quiser limpar o banco:

```sql
drop table if exists public.leaderboard_daily;
drop table if exists public.leaderboard_weekly;
```

---

## 4. Pegar as credenciais

1. No menu lateral, clique em **Project Settings** (ícone de engrenagem)
2. Clique em **API**
3. Copie:
   - **Project URL** → vai virar `VITE_SUPABASE_URL`
   - **anon public** key → vai virar `VITE_SUPABASE_ANON_KEY`

---

## 5. Configurar o projeto local

1. Na pasta do projeto, crie um arquivo chamado `.env`:

```
VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-aqui
```

2. Reinicie o servidor de desenvolvimento:

```bash
npm run dev
```

3. Abra o app → clique no ícone de login (canto superior direito do menu) → Criar Conta!

---

## 6. Configurar confirmação de email (opcional)

Por padrão, o Supabase exige confirmação de email.
Para desativar durante desenvolvimento:

1. **Authentication** → **Providers** → **Email**
2. Desative **Confirm email**
3. Salve

---

## ✅ Pronto!

Depois de configurado, o app vai:
- Criar conta e fazer login com email/senha
- Salvar XP, conquistas, recordes e histórico na nuvem
- Sincronizar automaticamente em qualquer dispositivo
- Migrar dados locais existentes para a nuvem no primeiro login

---

## Deploy no Vercel

Para publicar o app online com as credenciais do Supabase:

1. Push do código para GitHub
2. Acesse https://vercel.com → importe o repositório
3. Em **Environment Variables**, adicione:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy!
