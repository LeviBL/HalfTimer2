import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://wapnpuwtfzteavchdxzv.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndhcG5wdXd0Znp0ZWF2Y2hkeHp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxOTEyNDksImV4cCI6MjA3NDc2NzI0OX0.tNthlJkR6xIMNxxMhinqy_HLHD4uvXvXZZl06mlUYXE";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
