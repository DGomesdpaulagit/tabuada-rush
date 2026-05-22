import { supabase, isSupabaseConfigured } from '../lib/supabase';

export async function loadCloudData(userId) {
  if (!isSupabaseConfigured || !supabase) return null;
  const { data, error } = await supabase
    .from('profiles')
    .select('data')
    .eq('id', userId)
    .single();
  // PGRST116 = row not found — not an error for us
  if (error && error.code !== 'PGRST116') {
    console.error('[sync] load:', error.message);
    return null;
  }
  return data?.data ?? null;
}

export async function saveCloudData(userId, gameData) {
  if (!isSupabaseConfigured || !supabase) return false;
  const { error } = await supabase
    .from('profiles')
    .upsert({ id: userId, data: gameData, updated_at: new Date().toISOString() });
  if (error) {
    console.error('[sync] save:', error.message);
    return false;
  }
  return true;
}
