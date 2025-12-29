import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SUPABASE_URL = 'https://zsycixfhbwlwphgfhvfn.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_IF7r5gOCy8eq-V-eDpRnxQ_1s_MOzBm';

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      storage: AsyncStorage,
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
    },
  }
);
