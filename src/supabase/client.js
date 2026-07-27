import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://fdafpdpwkgymqregqlqu.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkYWZwZHB3a2d5bXFyZWdxbHF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ1NjkxMzEsImV4cCI6MjEwMDE0NTEzMX0.CrMsy05FsxgzTzOwOPz6CxpLu0ECdUySlA4WMlS04YI";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
