// ── Leaderboard global (Supabase) ───────────────────────────────────────────
//
// Duas tabelas no Supabase:
//   - public.leaderboard_daily (user_id, date, display_name, score)
//   - public.leaderboard_weekly (user_id, week, display_name, score)
// RLS: todos leem (authenticated), só o dono escreve.
//
// Graceful degradation:
//   - Se Supabase não configurado → retorna { ok: false, reason: 'unconfigured' }
//   - Se tabelas não existem (42P01) → retorna { ok: false, reason: 'no_table' }
//   - Outros erros → reason: 'error', message
//
// SQL para criar as tabelas está documentado em SUPABASE_SETUP.md.

import { supabase, isSupabaseConfigured } from '../lib/supabase';

const TOP_N = 20;

function parseError(error) {
  if (!error) return null;
  // 42P01 = undefined_table (Postgres). Indica que o usuário ainda não rodou
  // o SQL de leaderboard. Tratamos como caso esperado, não como erro fatal.
  if (error.code === '42P01' || /relation .* does not exist/i.test(error.message || '')) {
    return { ok: false, reason: 'no_table' };
  }
  return { ok: false, reason: 'error', message: error.message };
}

// ── DAILY ──────────────────────────────────────────────────────────────────

export async function upsertDailyScore({ userId, date, displayName, score }) {
  if (!isSupabaseConfigured || !supabase) return { ok: false, reason: 'unconfigured' };
  if (!userId || !date || score == null) return { ok: false, reason: 'bad_args' };
  const { error } = await supabase
    .from('leaderboard_daily')
    .upsert(
      { user_id: userId, date, display_name: displayName || 'Anônimo', score, updated_at: new Date().toISOString() },
      { onConflict: 'user_id,date' }
    );
  const err = parseError(error);
  if (err) return err;
  return { ok: true };
}

export async function fetchDailyLeaderboard(date) {
  if (!isSupabaseConfigured || !supabase) return { ok: false, reason: 'unconfigured' };
  const { data, error } = await supabase
    .from('leaderboard_daily')
    .select('user_id, display_name, score, updated_at')
    .eq('date', date)
    .order('score', { ascending: false })
    .limit(TOP_N);
  const err = parseError(error);
  if (err) return err;
  return { ok: true, entries: data || [] };
}

// ── WEEKLY ─────────────────────────────────────────────────────────────────

export async function upsertWeeklyScore({ userId, week, displayName, score }) {
  if (!isSupabaseConfigured || !supabase) return { ok: false, reason: 'unconfigured' };
  if (!userId || !week || score == null) return { ok: false, reason: 'bad_args' };
  const { error } = await supabase
    .from('leaderboard_weekly')
    .upsert(
      { user_id: userId, week, display_name: displayName || 'Anônimo', score, updated_at: new Date().toISOString() },
      { onConflict: 'user_id,week' }
    );
  const err = parseError(error);
  if (err) return err;
  return { ok: true };
}

export async function fetchWeeklyLeaderboard(week) {
  if (!isSupabaseConfigured || !supabase) return { ok: false, reason: 'unconfigured' };
  const { data, error } = await supabase
    .from('leaderboard_weekly')
    .select('user_id, display_name, score, updated_at')
    .eq('week', week)
    .order('score', { ascending: false })
    .limit(TOP_N);
  const err = parseError(error);
  if (err) return err;
  return { ok: true, entries: data || [] };
}
