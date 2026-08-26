// auth.js
// Logowanie/rejestracja/sesja oparte o Supabase Auth. Wymaga supabase-client.js (globalny `sb`).

// Gdy w Supabase włączone jest "Confirm email" (patrz supabase_schema_email_confirm.sql),
// po signUp() NIE MA jeszcze aktywnej sesji (auth.uid() pusty, dopóki user nie
// kliknie linku w mailu) - dlatego display_name/year NIE są dogrywane osobnym
// zapytaniem UPDATE z klienta (wywaliłoby się na RLS), tylko przekazywane jako
// metadane rejestracji - trigger po stronie bazy (security definer, więc RLS
// go nie dotyczy) zapisuje je do profiles od razu przy tworzeniu wiersza.
// `data.session` w zwróconym obiekcie jest `null`, dopóki email nie zostanie
// potwierdzony - index.html na tej podstawie pokazuje "sprawdź skrzynkę".
async function signUp(email, password, displayName, year) {
    const { data, error } = await sb.auth.signUp({
        email,
        password,
        options: { data: { display_name: displayName, year } },
    });
    if (error) throw error;
    return data;
}

async function signIn(email, password) {
    const { data, error } = await sb.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
}

async function signOut() {
    const { error } = await sb.auth.signOut();
    if (error) throw error;
}

// Wysyła mail z linkiem resetującym hasło. Link prowadzi z powrotem na tę
// samą stronę z tokenem odzyskiwania w URL hash (#access_token=...&type=recovery) -
// Supabase JS SDK (detectSessionInUrl, domyślnie włączone) sam ustanawia z niego
// tymczasową sesję i odpala event PASSWORD_RECOVERY, który index.html obsługuje.
async function resetPasswordForEmail(email) {
    const { error } = await sb.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + window.location.pathname,
    });
    if (error) throw error;
}

// Ustawia nowe hasło - wymaga aktywnej sesji odzyskiwania (patrz wyżej) lub
// zwykłej zalogowanej sesji (np. zmiana hasła z poziomu profilu).
async function updatePassword(newPassword) {
    const { error } = await sb.auth.updateUser({ password: newPassword });
    if (error) throw error;
}

async function getSessionUser() {
    const { data, error } = await sb.auth.getSession();
    if (error) throw error;
    return data.session ? data.session.user : null;
}

async function getMyProfile(userId) {
    const { data, error } = await sb.from("profiles").select("*").eq("id", userId).single();
    if (error) throw error;
    return data;
}
