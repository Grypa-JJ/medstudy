# -*- coding: utf-8 -*-
# Diagnostyka laboratoryjna (Rok 3) - RUNDA 2. Źródło: własny folder Materiały
# tegoroczne/"Choroby nerek II WWL" (dr Kinga Rośniak-Bąk, dr Joanna Toszek,
# Zakład Diagnostyki Laboratoryjnej i Biochemii Klinicznej UM w Łodzi).
import json

NEW_ITEMS = [
    {"category": "Czynność nerek", "q": "Czym jest frakcja filtracyjna (FF)?",
     "mode": "typed", "answers": ["stosunek ilości osocza przesączanego w kłębuszkach nerkowych do całkowitej ilości osocza przepływającego przez nerki"]},
    {"category": "Czynność nerek", "q": "Ile wynosi prawidłowe GFR u zdrowego dorosłego?",
     "mode": "typed", "answers": ["ok. 120 mL/min/1,73m²"]},
    {"category": "Czynność nerek", "q": "Jakie warunki musi spełniać idealny marker (substancja) do oceny GFR metodą klirensu?",
     "mode": "typed", "answers": ["stabilne stężenie w surowicy, swobodna filtracja kłębuszkowa, brak reabsorpcji i wydzielania cewkowego, brak metabolizmu w cewkach, brak wiązania z białkami, fizjologiczna obojętność"]},
    {"category": "Czynność nerek", "q": "Jaka substancja jest złotym standardem (\"nr 1\") w ocenie GFR metodą klirensu?",
     "mode": "typed", "answers": ["inulina (naturalny wielocukier z grupy fruktanów)"]},
    {"category": "Czynność nerek", "q": "Dlaczego wartości klirensu kreatyniny są ok. 10% wyższe niż klirensu inuliny?",
     "mode": "typed", "answers": ["kreatynina jest w niewielkim stopniu (śladowo) wydzielana czynnie przez cewki nerkowe, co zawyża obliczony klirens"]},
    {"category": "Czynność nerek", "q": "Przy jakiej wartości klirensu kreatyniny staje się on niewiarygodnym (znacznie zawyżonym) miernikiem GFR?",
     "mode": "typed", "answers": ["poniżej 15 mL/min/1,73m² — błąd pomiarowy związany z sekrecją kreatyniny do moczu może sięgać nawet 100%"]},
    {"category": "Czynność nerek", "q": "Jak zmienia się GFR w rytmie dobowym?",
     "mode": "typed", "answers": ["najniższe wartości występują późno w nocy, najwyższe rano"]},
    {"category": "Czynność nerek", "q": "Jak zmienia się GFR w pierwszym trymestrze ciąży?",
     "mode": "typed", "answers": ["wzrasta o ok. 20-30% i utrzymuje się na tym poziomie do końca ciąży, normalizując się po porodzie"]},
    {"category": "Czynność nerek", "q": "Jaką wydolność (w stosunku do nerki natywnej) osiąga typowo nerka przeszczepiona?",
     "mode": "typed", "answers": ["ok. 80% pierwotnej wydolności"]},
    {"category": "Czynność nerek", "q": "Czym jest eGFR i jak się go zwykle wyznacza?",
     "mode": "typed", "answers": ["szacowany współczynnik filtracji kłębuszkowej (estimated GFR) — wyliczany wzorem matematycznym na podstawie jednorazowego, przygodnego stężenia kreatyniny w surowicy (np. wzór Cockcrofta-Gaulta, MDRD, CKD-EPI)"]},
    {"category": "Czynność nerek", "q": "Który wzór szacowania eGFR jest szczególnie przydatny w zaawansowanych stadiach przewlekłej choroby nerek?",
     "mode": "typed", "answers": ["wzór MDRD (Modification of Diet in Renal Disease)"]},
    {"category": "Czynność nerek", "q": "Jakie są kategorie (G1-G5) klasyfikacji GFR wg wartości?",
     "mode": "typed", "answers": ["G1: ≥90 (prawidłowe/zwiększone), G2: 89-60 (niewielkie zmniejszenie), G3: 59-30 (niewielkie do ciężkiego), G4: 29-15 (ciężkie zmniejszenie), G5: <15 (schyłkowa niewydolność nerek)"]},
    {"category": "Czynność nerek", "q": "Jakie przygotowanie pacjenta jest wymagane przed oznaczeniem klirensu kreatyniny (24-48h przed badaniem)?",
     "mode": "typed", "answers": ["unikanie dużej ilości mięsa (zwłaszcza wołowiny) i produktów białkowych oraz ograniczenie intensywnego wysiłku fizycznego (oba czynniki podnoszą poziom kreatyniny)"]},
]

with open('diagnostyka_lab_raw.json', encoding='utf-8') as f:
    existing = json.load(f)

before = len(existing)
existing.extend(NEW_ITEMS)
with open('diagnostyka_lab_raw.json', 'w', encoding='utf-8') as f:
    json.dump(existing, f, ensure_ascii=False, indent=2)

print(f"diagnostyka_lab_raw.json: {before} -> {len(existing)} (+{len(NEW_ITEMS)})")
