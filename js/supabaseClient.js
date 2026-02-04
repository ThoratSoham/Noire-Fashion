// Initialize Supabase client
// In production, replace with your env vars. Locally, set via a .env file or global window object.
const SUPABASE_URL = 'https://xpfydaohsihasabnalyw.supabase.co';  // Replace with your URL
const SUPABASE_ANON_KEY = 'sb_publishable_y9IGmcNotMSeJhbE7gqXig_tgAPScy3';  // Replace with your anon key

// Wait for Supabase library to load
function initSupabase() {
    if (!window.supabase) {
        console.warn('Supabase library not loaded yet, retrying...');
        setTimeout(initSupabase, 100);
        return;
    }
    
    try {
        const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        window.supabaseClient = supabase;
        console.log('Supabase client initialized successfully');
    } catch (err) {
        console.error('Failed to initialize Supabase client:', err);
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSupabase);
} else {
    initSupabase();
}
