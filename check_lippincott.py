import pdfplumber

files = [
    r"Rok 3 2025-2026\Farmakologia 💊\PODRĘCZNIKI\Lippincott 1-30.pdf",
    r"Rok 3 2025-2026\Farmakologia 💊\PODRĘCZNIKI\Lippincott 31-end.pdf",
]

out_path = r"C:\Users\Jakub\AppData\Local\Temp\claude\C--Users-Jakub-Desktop-Prod-projekt-w-budowie\5b271756-3497-41b2-84e6-8e1d1037c3aa\scratchpad\lippincott_check.txt"
with open(out_path, "w", encoding="utf-8") as out:
    for path in files:
        try:
            with pdfplumber.open(path) as pdf:
                n = len(pdf.pages)
                sample = pdf.pages[0].extract_text() or ""
                out.write(f"{path} | pages={n} | sample_chars={len(sample)}\n")
        except Exception as e:
            out.write(f"{path} | ERROR {e}\n")
print("done")
