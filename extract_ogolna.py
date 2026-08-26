import pdfplumber
import os

src_dir = r"Rok 3 2025-2026\Farmakologia 💊\PREZENTACJE TEAMS\Semestr zimowy"
fname = [f for f in os.listdir(src_dir) if f.startswith("Farmakologia og")][0]
path = os.path.join(src_dir, fname)

out_dir = r"C:\Users\Jakub\AppData\Local\Temp\claude\C--Users-Jakub-Desktop-Prod-projekt-w-budowie\5b271756-3497-41b2-84e6-8e1d1037c3aa\scratchpad\farma_full12"
os.makedirs(out_dir, exist_ok=True)

with pdfplumber.open(path) as pdf:
    text = ""
    n = len(pdf.pages)
    for p in pdf.pages:
        text += (p.extract_text() or "") + "\n---PAGE---\n"
with open(os.path.join(out_dir, "ogolna.txt"), "w", encoding="utf-8") as out:
    out.write(text)
print(fname, n, len(text))
