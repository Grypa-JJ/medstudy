-- supabase_schema_profile_v2.sql
-- Rozbudowa profilu: awatar (klucz z gotowej puli emoji, nie plik), wybrana
-- obwódka, oraz łączny czas nauki (per dzień, tak jak `count`). Dodaje też
-- dwie funkcje SQL do bezpiecznych, ZBIORCZYCH statystyk (RLS w profiles i
-- progress pozwala userowi widzieć TYLKO swój wiersz - te funkcje działają
-- jako "security definer", więc widzą wszystko, ale zwracają wyłącznie liczby,
-- nigdy pojedyncze wiersze z danymi innych userów).
-- Wklej i uruchom w Supabase Dashboard -> SQL Editor -> Run (po wcześniejszym
-- uruchomieniu supabase_schema.sql).

alter table public.profiles add column if not exists avatar_key text;
alter table public.profiles add column if not exists equipped_border text;

alter table public.activity add column if not exists seconds int not null default 0;

-- Ile userów ma ustawiony każdy rok studiów - publiczny agregat, bez imion/id.
create or replace function public.year_distribution()
returns table(year int, user_count bigint)
language sql
security definer
set search_path = public
as $$
    select year, count(*) as user_count
    from public.profiles
    where year is not null
    group by year
    order by year;
$$;

grant execute on function public.year_distribution() to authenticated;

-- Pozycja wywołującego na tle jego rocznika, licząc po liczbie odpowiedzianych
-- pytań. Przyjmuje własną liczbę odpowiedzi jako argument (appka już ją zna
-- lokalnie z `progress`) - funkcja nigdy nie zwraca listy userów, tylko dwie
-- liczby zbiorcze.
create or replace function public.year_percentile(my_year int, my_answer_count bigint)
returns table(cohort_size bigint, rank_percentile numeric)
language plpgsql
security definer
set search_path = public
as $$
declare
    total bigint;
    fewer_or_equal bigint;
begin
    select count(*) into total from public.profiles where year = my_year;

    select count(*) into fewer_or_equal
    from (
        select p.id, count(pr.question_id) as cnt
        from public.profiles p
        left join public.progress pr on pr.user_id = p.id
        where p.year = my_year
        group by p.id
    ) t
    where t.cnt <= my_answer_count;

    return query select total, case when total > 0 then round(100.0 * fewer_or_equal / total) else null end;
end;
$$;

grant execute on function public.year_percentile(int, bigint) to authenticated;
