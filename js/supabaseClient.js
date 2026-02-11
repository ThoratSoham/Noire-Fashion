const SUPABASE_URL = "https://xpfydaohsihasabnalyw.supabase.co"
const SUPABASE_ANON_KEY = "sb_publishable_y9IGmcNotMSeJhbE7gqXig_tgAPScy3"

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
)

window.supabaseClient = supabase
