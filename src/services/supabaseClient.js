import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tvnxqpdimeeqxohqpkcs.supabase.co'; // <- înlocuiește cu URL-ul tău real
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2bnhxcGRpbWVlcXhvaHFwa2NzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3Njg1ODksImV4cCI6MjA2NDM0NDU4OX0.71rBBZmz73IsL7q3A-o6fx--JNPQFPluxAQ3j5YeuQg'; // <- cheia publică din Supabase

export const supabase = createClient(supabaseUrl, supabaseKey);
