# -*- coding: utf-8 -*-
# Propedeutyka chirurgii (Rok 3) - NOWY przedmiot od zera (bardzo mały - tylko
# 1 plik "zaliczenie 2025-2026" o skromnej treści, ale wystarczającej na
# minimalną talię startową).
import json

ITEMS = [
    {"category": "Podstawy propedeutyki chirurgii", "q": "Objaw Murphy'ego — na czym polega i na co wskazuje?",
     "mode": "typed", "answers": ["ból/wstrzymanie wdechu przy głębokiej palpacji prawego podżebrza — wskazuje na zapalenie pęcherzyka żółciowego"]},
    {"category": "Podstawy propedeutyki chirurgii", "q": "Ile maksymalnie punktów można uzyskać w skali Glasgow (GCS)?",
     "mode": "typed", "answers": ["15 punktów"]},
    {"category": "Podstawy propedeutyki chirurgii", "q": "Jak leczy się czyrak mnogi (carbunculus)?",
     "mode": "typed", "answers": ["nacięcie i sączenie (drenaż chirurgiczny)"]},
    {"category": "Podstawy propedeutyki chirurgii", "q": "Co oznacza klasa V w skali ASA (przedoperacyjnej oceny ryzyka znieczulenia)?",
     "mode": "typed", "answers": ["pacjent umierający, który bez operacji nie przeżyje 24 godzin"]},
    {"category": "Podstawy propedeutyki chirurgii", "q": "W jakim czasie należy podać koncentrat krwinek czerwonych (KKCz) od jego wydania z banku krwi?",
     "mode": "typed", "answers": ["do 4 godzin"]},
    {"category": "Podstawy propedeutyki chirurgii", "q": "Jaki jest charakterystyczny odgłos osłuchowy jamy brzusznej w niedrożności porażennej jelit?",
     "mode": "typed", "answers": ["brak (cisza) — zniesiona perystaltyka"]},
    {"category": "Podstawy propedeutyki chirurgii", "q": "Pacjent zasypia, gdy się do niego nie mówi, ale reaguje na bodźce (budzi się po nich) — jak nazywamy ten stan świadomości?",
     "mode": "typed", "answers": ["somnolencja"]},
    {"category": "Podstawy propedeutyki chirurgii", "q": "Czym charakteryzuje się ciężkie ostre zapalenie trzustki?",
     "mode": "typed", "answers": ["przetrwałą (>48h) niewydolnością narządową"]},
    {"category": "Podstawy propedeutyki chirurgii", "q": "Jakim procesem goi się rana przez ziarninowanie (gojenie wtórne)?",
     "mode": "typed", "answers": ["poprzez wypełnienie ubytku tkanki ziarniną, wolniej niż rychłozrost (gojenie pierwotne), zwykle z pozostawieniem bardziej widocznej blizny"]},
]

with open('propedeutyka_chir_raw.json', 'w', encoding='utf-8') as f:
    json.dump(ITEMS, f, ensure_ascii=False, indent=2)
print('TOTAL', len(ITEMS))
