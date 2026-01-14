import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dlahqyyheawhuwephrmp.supabase.co';
const supabaseAnonKey = 'sb_publishable_3pC6mhauyue5tdD9HVMy7w_stfB6V2m';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
