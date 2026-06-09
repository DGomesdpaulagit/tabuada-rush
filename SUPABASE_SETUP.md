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

### 3.1. Tabelas de Leaderboard (Fase 5 do roadmap 3.0)

Para ativar os leaderboards globais do Desafio Diário e do Desafio Semanal,
rode o SQL abaixo numa nova query. Sem essas tabelas, a página de
Leaderboard mostra "Leaderboard ainda não foi ativado" (sem quebrar nada).

```sql
-- ── LEADERBOARD DO DESAFIO DIÁRIO ──────────────────────────────────────────
create table public.leaderboard_daily (
  user_id uuid not null references auth.users(id) on delete cascade,
  date text not null,            -- 'YYYY-MM-DD'
  display_name text,
  score int not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, date)
);

alter table public.leaderboard_daily enable row level security;

-- todos os usuários autenticados podem LER o ranking
create policy "leem todos (daily)" on public.leaderboard_daily
  for select to authenticated using (true);

-- só o dono pode escrever/atualizar
create policy "dono escreve (daily)" on public.leaderboard_daily
  for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index leaderboard_daily_date_score_idx
  on public.leaderboard_daily (date, score desc);

-- ── LEADERBOARD DO DESAFIO SEMANAL ─────────────────────────────────────────
create table public.leaderboard_weekly (
  user_id uuid not null references auth.users(id) on delete cascade,
  week text not null,            -- 'YYYY-Www' (ISO week)
  display_name text,
  score int not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, week)
);

alter table public.leaderboard_weekly enable row level security;

create policy "leem todos (weekly)" on public.leaderboard_weekly
  for select to authenticated using (true);

create policy "dono escreve (weekly)" on public.leaderboard_weekly
  for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index leaderboard_weekly_week_score_idx
  on public.leaderboard_weekly (week, score desc);
```

**Importante:** o `display_name` enviado pelo cliente é a parte antes do `@`
do email. Se quiser proteger contra spoofing, ative trigger que sobrescreva
com o email real do `auth.users` — para a maioria dos casos não é necessário.

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
