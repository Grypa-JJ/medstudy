# -*- coding: utf-8 -*-
# Farmakologia (Rok 3) - RUNDA 3. Źródło: własny folder WYKŁADY/"Farmakokinetyka.pdf"
# (dr hab. Anna Wiktorowska-Owczarek) - materiał dydaktyczny własnej uczelni,
# tekst w pełni ekstrahowalny (nie skan).
import json

NEW_ITEMS = [
    {"category": "Farmakokinetyka — podstawy", "q": "Co oznacza skrót LADME?",
     "mode": "typed", "answers": ["Liberation (uwalnianie), Absorption (wchłanianie), Distribution (dystrybucja), Metabolism (metabolizm), Excretion (wydalanie)"]},
    {"category": "Farmakokinetyka — podstawy", "q": "Które etapy LADME są pomijane przy podaniu leku dożylnym (w ampułce, w roztworze)?",
     "mode": "typed", "answers": ["uwalnianie (Liberation) i wchłanianie (Absorption) — substancja jest już rozpuszczona i podana bezpośrednio do krążenia"]},
    {"category": "Farmakokinetyka — podstawy", "q": "Jakimi drogami odbywa się transport leku przez błony komórkowe?",
     "mode": "typed", "answers": ["dyfuzja bierna (związki lipofilne, niezjonizowane), dyfuzja ułatwiona (z udziałem nośnika, np. witamina B12), transport czynny (z udziałem nośników, np. bariera krew-mózg), endocytoza"]},
    {"category": "Farmakokinetyka — podstawy", "q": "Kiedy lek wykazuje działanie ogólnoustrojowe BEZ konieczności wchłaniania?",
     "mode": "typed", "answers": ["gdy jest podany bezpośrednio do krwiobiegu: dożylnie, dotętniczo, dosercowo, dolędźwiowo lub do płynu mózgowo-rdzeniowego"]},
    {"category": "Farmakokinetyka — podstawy", "q": "Czym jest stała dysocjacji (jonizacji) leku i dlaczego ma znaczenie dla wchłaniania?",
     "mode": "typed", "answers": ["określa przy jakim pH ustala się równowaga między formą zjonizowaną a niezjonizowaną leku; większość leków to słabe kwasy lub zasady, więc decyduje ona, czy lek lepiej wchłania się w żołądku czy w jelitach"]},
    {"category": "Farmakokinetyka — podstawy", "q": "Wymień czynniki fizjologiczne wpływające na wchłanianie leku z przewodu pokarmowego.",
     "mode": "typed", "answers": ["wiek, płeć, czas kontaktu z powierzchnią wchłaniania, wielkość powierzchni wchłaniania, aktywność motoryczna przewodu pokarmowego, pozycja ciała, ukrwienie narządu, pH miejsca wchłaniania"]},
    {"category": "Farmakokinetyka — podstawy", "q": "Czym jest efekt pierwszego przejścia (first-pass effect)?",
     "mode": "typed", "answers": ["zjawisko, w którym lek zaraz po wchłonięciu z jelita jest wychwytywany przez wątrobę (via żyła wrotna) i ulega metabolizmowi, zanim trafi do krążenia ogólnego"]},
    {"category": "Farmakokinetyka — podstawy", "q": "Wymień leki, które w znacznym stopniu podlegają efektowi pierwszego przejścia.",
     "mode": "typed", "answers": ["metoprolol, propranolol, nitrogliceryna, werapamil, morfina"]},
    {"category": "Farmakokinetyka — podstawy", "q": "Czym jest prolek i podaj przykład wykorzystania efektu pierwszego przejścia w tym kontekście.",
     "mode": "typed", "answers": ["substancja nieaktywna, przekształcana w wątrobie do formy aktywnej — np. enalapryl ulega przemianie do aktywnego enalaprylatu"]},
    {"category": "Farmakokinetyka — podstawy", "q": "Co obejmuje pojęcie biodostępności (dostępności biologicznej) leku?",
     "mode": "typed", "answers": ["ułamek dawki leku, który dociera do krążenia ogólnego po podaniu pozanaczyniowym — obejmuje zarówno etap wchłaniania, jak i efekt pierwszego przejścia"]},
    {"category": "Farmakokinetyka — podstawy", "q": "Propranolol podany doustnie — jaki jest jego los farmakokinetyczny (wchłanianie i metabolizm)?",
     "mode": "typed", "answers": ["wchłania się całkowicie z przewodu pokarmowego, ale ok. 90% dawki ulega przemianie w wątrobie (silny efekt pierwszego przejścia)"]},
]

with open('farmakologia_raw.json', encoding='utf-8') as f:
    existing = json.load(f)

before = len(existing)
existing.extend(NEW_ITEMS)
with open('farmakologia_raw.json', 'w', encoding='utf-8') as f:
    json.dump(existing, f, ensure_ascii=False, indent=2)

print(f"farmakologia_raw.json: {before} -> {len(existing)} (+{len(NEW_ITEMS)})")
