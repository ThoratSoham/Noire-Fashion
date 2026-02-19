// js/supabaseClient.js

const SUPABASE_URL = "https://xpfydaohsihasabnalyw.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhwZnlkYW9oc2loYXNhYm5hbHl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxNzAwNzcsImV4cCI6MjA4NTc0NjA3N30.2E53HfEOdW48WP_jZUXOgZOmPyqAOaFs1cAc8LspUqM";

// Ensure Supabase library exists
if (!window.supabase) {
  throw new Error("Supabase CDN not loaded. Check script order in your HTML files.");
}

// Create client ONLY ONCE to prevend duplicate listeners and state issues
if (!window.supabaseClient) {
  window.supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: 'noire-fashion-auth-token' // Specific key for persistence
      }
    }
  );
  console.log("Supabase client initialized uniquely.");
}
