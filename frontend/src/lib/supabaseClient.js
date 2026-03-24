import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://nraiqqjhtuxdvjqdihsr.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5yYWlxcWpodHV4ZHZqcWRpaHNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyNzc4MzksImV4cCI6MjA4OTg1MzgzOX0.w9NjqNKPvkluE6MYS9F4oseLcII6vZ-r-3SngcYLOi8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
