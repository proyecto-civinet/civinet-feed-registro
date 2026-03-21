import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://wzjtteeyaluvbznhdfwl.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6anR0ZWV5YWx1dmJ6bmhkZndsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxMDY4MjUsImV4cCI6MjA4NzY4MjgyNX0.jFitbRXUFrZ66PlHTlAMG-mYnSMI18VknxnvNJyFQFs'
);

export default supabase;
