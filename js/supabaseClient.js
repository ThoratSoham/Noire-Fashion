// js/supabaseClient.js

const SUPABASE_URL = "https://xpfydaohsihasabnalyw.supabase.co";
const SUPABASE_ANON_KEY = "YOUR_REAL_ANON_KEY_HERE";

// Make sure Supabase library exists
if (!window.supabase) {
  throw new Error("Supabase CDN not loaded. Check script order in index.html");
}

// Create client ONLY ONCE
window.supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
);

console.log("Supabase client initialized");