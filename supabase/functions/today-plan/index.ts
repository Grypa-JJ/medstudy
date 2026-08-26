// supabase/functions/today-plan/index.ts
// Edge Function: "co dziś na tapecie" dla zalogowanego usera.
//
// Świadomy podział odpowiedzialności: ta funkcja liczy WYŁĄCZNIE to, co wynika
// z danych w bazie (daty jednostek planu, grupa usera) - dokładnie ten sam
// algorytm co getTodaysStudyUnits()/getUpcomingExam() w study_plan.js, tylko
// po stronie serwera. NIE rozwiązuje jednostki na konkretną kategorię pytań
// (resolveTodaySessionTarget) - to zależy od katalogu treści (meta.json,
// kilka MB), który już jest wczytany w przeglądarce; przeliczanie go tu
// wymagałoby dociągania tego samego pliku po raz drugi, bez żadnej korzyści.
// Klient dostaje więc surowe fakty (subject_key/ordinal/tytuł/daty) i sam
// dogrywa "gdzie kliknąć" z danych, które już ma.
//
// Autoryzacja: klient wywołuje przez supabase-js (sb.functions.invoke), który
// automatycznie dokleja nagłówek Authorization z tokenem zalogowanego usera.
// Klient Supabase tworzony TUTAJ z tym nagłówkiem (nie z service role key),
// więc RLS działa dokładnie tak jak przy zwykłych zapytaniach z frontu - ta
// funkcja nie ma żadnych dodatkowych uprawnień ponad to, co user i tak widzi.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function json(body, status = 200) {
    return new Response(JSON.stringify(body), {
        status,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
}

function unitMatchesGroup(unit, groupNumber) {
    return unit.group_number == null || (groupNumber != null && unit.group_number === groupNumber);
}

Deno.serve(async (req) => {
    if (req.method === "OPTIONS") return new Response("ok", { headers: CORS_HEADERS });

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return json({ error: "Brak nagłówka Authorization" }, 401);

    const supabase = createClient(
        Deno.env.get("SUPABASE_URL"),
        Deno.env.get("SUPABASE_ANON_KEY"),
        { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) return json({ error: "Nieautoryzowany" }, 401);

    const [{ data: profile, error: profileError }, { data: units, error: unitsError }] = await Promise.all([
        supabase.from("profiles").select("group_number").eq("id", user.id).single(),
        supabase.from("study_units").select("subject_key,ordinal,title,starts_on,ends_on,exam_on,group_number"),
    ]);

    if (profileError) return json({ error: profileError.message }, 500);
    if (unitsError) return json({ error: unitsError.message }, 500);

    const groupNumber = profile?.group_number ?? null;
    const today = new Date().toISOString().slice(0, 10);
    const eligible = (units || []).filter((u) => unitMatchesGroup(u, groupNumber));

    const todayUnits = eligible
        .filter((u) => u.starts_on && u.ends_on && u.starts_on <= today && today <= u.ends_on)
        .map((u) => ({ subject_key: u.subject_key, ordinal: u.ordinal, title: u.title }));

    const examsBySubject = new Map();
    for (const u of eligible) {
        if (!u.exam_on || u.exam_on < today) continue;
        const existing = examsBySubject.get(u.subject_key);
        if (!existing || u.exam_on < existing.exam_on) {
            examsBySubject.set(u.subject_key, {
                subject_key: u.subject_key,
                ordinal: u.ordinal,
                title: u.title,
                exam_on: u.exam_on,
            });
        }
    }

    const DAY_MS = 86400000;
    const upcomingExams = [...examsBySubject.values()].map((e) => ({
        ...e,
        daysLeft: Math.round(
            (Date.parse(e.exam_on + "T00:00:00Z") - Date.parse(today + "T00:00:00Z")) / DAY_MS
        ),
    }));

    return json({ today, groupNumber, todayUnits, upcomingExams });
});
