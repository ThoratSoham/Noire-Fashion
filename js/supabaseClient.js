// js/supabaseClient.js

const SUPABASE_URL = "https://xpfydaohsihasabnalyw.supabase.co"
const SUPABASE_ANON_KEY = "sb_publishable_y9IGmcNotMSeJhbE7gqXig_tgAPScy3"

function initSupabase() {
  if (!window.supabase) {
    console.warn("Supabase not loaded yet, retrying...");
    setTimeout(initSupabase, 50);
    return;
  }

  window.supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  );

  console.log("Supabase initialized");
}

initSupabase();
