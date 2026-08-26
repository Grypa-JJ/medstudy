import pdfplumber, os

src = r"Giełdy tegoroczne\GIEŁDY WCZEŚNIEJSZE-20260719T204252Z-1-001\GIEŁDY WCZEŚNIEJSZE"
out = r"C:\Users\Jakub\AppData\Local\Temp\claude\C--Users-Jakub-Desktop-Prod-projekt-w-budowie\5b271756-3497-41b2-84e6-8e1d1037c3aa\scratchpad\gielda_tegoroczne_top"

files = [
 '1_rok_II_TERMIN_2024_2025.pdf',
 '2022_2023 I termin biochemia.pdf',
 '2_ROK_2024_2025_II_TERMIN_czesc_1.pdf',
 '2_ROK_I_TERMIN_2024_2025_pytania_1_44_TURAII_1_50_final.pdf',
 '3_termin_2022_2023_pytania_schemat.pdf',
 'II termin biochemia 2022_2023.pdf',
 'II_termin_2021_2022_pytania_1_39_schemat.pdf',
 'I_ROK_I_TERMIN_pytania_pelne_uzasadnienia.pdf',
 'I_termin_2021_2022_pytania_1_35_schemat.pdf',
 'biochemia II termin 2023_2024.pdf',
 'biochemia termin 2023_2024 I termin.pdf',
]

for f in files:
    path = os.path.join(src, f)
    outname = f.replace('.pdf', '').replace(' ', '_') + '.txt'
    with pdfplumber.open(path) as pdf:
        pages = len(pdf.pages)
        text = ''
        for p in pdf.pages:
            t = p.extract_text()
            if t:
                text += t + '\n---PAGE---\n'
    with open(os.path.join(out, outname), 'w', encoding='utf-8') as fh:
        fh.write(text)
    print(f, '->', pages, 'pages,', len(text), 'chars')
