import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://geilroobnavmcalhkore.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlaWxyb29ibmF2bWNhbGhrb3JlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxMDYxOTksImV4cCI6MjA4NzY4MjE5OX0.3EBX0QWlpDvg9Ig4-a0cXRTelk9R0fI3YTPbv1SzRAs'
);

export default supabase;
