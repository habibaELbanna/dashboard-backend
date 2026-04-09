import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fmsrakinxicxiejjujlr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZtc3Jha2lueGljeGllamp1amxyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDUxNTA4NSwiZXhwIjoyMDkwMDkxMDg1fQ.bmQIXJrAsyRgX-PxaI-6ZCZtpZCf-xD6jl7FBwP1U6w';

export const supabase = createClient(supabaseUrl, supabaseKey);
