// supabase-client.js
// Wspólny klient Supabase używany przez auth.js i storage.js.
// Wymaga wcześniejszego załadowania CDN @supabase/supabase-js oraz supabase-config.js.
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
