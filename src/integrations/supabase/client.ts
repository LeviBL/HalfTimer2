import { createClient } from '@supabase/supabase-js';

// Hardcoding Supabase URL and Anon Key for immediate functionality.
// For production, it's recommended to use environment variables.
const supabaseUrl = "https://wapnpuwtfzteavchdxzv.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndhcG5wdXd0Znp0ZWF2Y2hkeHp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxOTEyNDksImV4cCI6MjA3NDc2NzI0OX0.tNthlJkR6xIMNxxMhinqy_HLHD4uvXvXZZl06mlUYXE";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);