import pdfplumber
import os

files = [
    (r"Rok 3 2025-2026\Farmakologia 💊\SKRYPTY\FARMA 101.pdf", None),
    (r"Rok 3 2025-2026\Farmakologia 💊\SKRYPTY\SKRYPT PIERDOLONY Z FARMAKOLOGII wersja OSTATECZNA.pdf", None),
    (r"Rok 3 2025-2026\Farmakologia 💊\SKRYPTY\receptura-zeszyt-ćwiczeń.pdf", None),
    (r"Rok 3 2025-2026\Farmakologia 💊\SKRYPTY\„OFICYNY 102”.pdf", None),
    (r"Rok 3 2025-2026\Farmakologia 💊\PODRĘCZNIKI\Farmakologia w zadaniach - farmakologia ogólna i kliniczna.pdf", None),
    (r"Rok 3 2025-2026\Farmakologia 💊\PODRĘCZNIKI\Farmakologia w zadaniach - układ autonomiczny i krążenia.pdf", None),
    (r"Rok 3 2025-2026\Farmakologia 💊\PODRĘCZNIKI\Farmakologia-w-zadaniach-Receptura-i-Postacie-Leków.pdf", None),
    (r"Rok 3 2025-2026\Immunologia 🧫\Ćwiczenia-z-Immunologii-Ogólnej-III-WL.pdf", None),
    (r"Rok 3 2025-2026\Immunologia 🧫\💻Prezentacje z seminariów - Immunologia ogólna.pdf", None),
]

out_path = r"C:\Users\Jakub\AppData\Local\Temp\claude\C--Users-Jakub-Desktop-Prod-projekt-w-budowie\5b271756-3497-41b2-84e6-8e1d1037c3aa\scratchpad\scope_check.txt"
with open(out_path, "w", encoding="utf-8") as out:
    for path, _ in files:
        try:
            with pdfplumber.open(path) as pdf:
                n = len(pdf.pages)
                sample = ""
                for p in pdf.pages[:2]:
                    sample += p.extract_text() or ""
                out.write(f"{os.path.basename(path)} | pages={n} | sample_chars={len(sample)}\n")
        except Exception as e:
            out.write(f"{os.path.basename(path)} | ERROR {e}\n")

print("done")
