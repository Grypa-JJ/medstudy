-- supabase_schema_email_confirm.sql
-- Wklej całość w Supabase Dashboard -> SQL Editor -> Run.
--
-- Wymuszenie potwierdzenia emaila przy rejestracji ma DWIE części:
-- 1. Przełącznik po stronie Supabase (NIE SQL - trzeba kliknąć ręcznie):
--    Dashboard -> Authentication -> Sign In / Providers -> Email
--    -> włącz "Confirm email" (w starszym UI: Authentication -> Settings
--    -> "Enable email confirmations"). Bez tego poniższa zmiana w SQL nic
--    nie zmieni w praktyce - to ten przełącznik odpowiada za wymóg kliknięcia
--    linku z maila przed pierwszym zalogowaniem.
-- 2. Ta zmiana w SQL (poniżej) - potrzebna NIEZALEŻNIE od powyższego, bo gdy
--    potwierdzenie emaila jest wymagane, po signUp() NIE MA jeszcze aktywnej
--    sesji (auth.uid() jest pusty) - stary trigger tworzył PUSTY wiersz w
--    profiles, a index.html próbował go zaraz potem UZUPEŁNIĆ osobnym
--    zapytaniem UPDATE z poziomu klienta - to zapytanie wywaliłoby się z
--    błędem RLS (brak sesji = brak uprawnień do update własnego wiersza).
--    Rozwiązanie: trigger (który działa jako "security definer", więc RLS go
--    nie dotyczy) od razu zapisuje display_name/year z metadanych podanych
--    przy rejestracji (signUp({ options: { data: {...} } }) - patrz auth.js),
--    więc klient nie musi nic dogrywać osobnym zapytaniem.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
    insert into public.profiles (id, display_name, year)
    values (
        new.id,
        new.raw_user_meta_data->>'display_name',
        nullif(new.raw_user_meta_data->>'year', '')::int
    );
    return new;
end;
$$;
