# -*- coding: utf-8 -*-
import json

CATEGORY = "Egzamin praktyczny — Testy (PDF)"

TOSIK = [
    ("Jak nazywa się element morfotyczny krwi zaznaczony czerwoną strzałką?", ["Trombocyt"]),
    ("Podaj przykład barwienia swoistego dla włókien występujących najliczniej w tej tkance (szpik kostny).", ["Sole srebra", "sole złota"]),
    ("Podaj nazwę połączeń komórkowych występujących w jednej ze struktur mięśnia sercowego, pełniącej rolę \"synaps elektrycznych\".", ["Neksusy i desmosomy"], "Neksus (gap junction) pełni rolę \"synapsy elektrycznej\", umożliwiając szybkie przewodzenie pobudzenia między kardiomiocytami; wraz z desmosomami i fascia adherens wchodzi w skład wstawki (discus intercalatus)."),
    ("Podaj funkcję komórki zaznaczonej strzałką (płuco).", ["Wydzielanie surfaktantu płucnego"], "Komórka to pneumocyt typu II."),
    ("Jak nazywa się komórka zaznaczona czerwoną strzałką?", ["Erytrocyt"]),
    ("Podaj nazwę narządu przedstawionego na zdjęciu.", ["Tętnica typu mięśniowego"]),
    ("Podaj typ tkanki podstawowej zamieszczonej na zdjęciu.", ["Tkanka nerwowa"]),
    ("Z jakich listków zarodkowych zbudowany jest widoczny na zdjęciu narząd embriologiczny?", ["Mezoderma i ektoderma"]),
    ("Jak nazywa się struktura zaznaczona czerwonym kółkiem na zdjęciu (nerka)?", ["Plamka gęsta"]),
    ("Podaj pełną nazwę struktury zaznaczonej numerem 1 na zdjęciu (sznur pępowinowy).", ["Żyła pępowinowa"]),
    ("Z jakiego listka zarodkowego wywodzi się poniższy narząd (tkanka limfatyczna)?", ["Mezoderma"]),
    ("Podaj nazwę struktury, na którą wskazuje strzałka (siatkówka).", ["Nabłonek barwnikowy siatkówki"]),
    ("Z jakiej struktury embriologicznej wywodzi się komórka przedstawiona na zdjęciu (pęcherzyk jajnikowy)?", ["Epiblast"]),
    ("Jak nazywa się warstwa narządu oznaczona cyfrą 1 (kora nadnerczy)?", ["Warstwa pasmowata"]),
    ("Co wchodzi w skład substancji oznaczonej znakiem zapytania (pęcherzyk tarczycowy)?", ["Tyreoglobulina"]),
    ("Podaj nazwę białek wchodzących w skład macierzy zewnątrzkomórkowej poniższej tkanki (chrząstka szklista).", ["Agrekan, kolagen II, siarczan keratanu i chondroityny"]),
    ("Jak nazywa się struktura oznaczona strzałką (elektronogram nabłonka urzęsionego)?", ["Ciałko podstawne"]),
    ("Jaki typ naczynia przedstawiono na zdjęciu (elektronogram)?", ["Naczynie włosowate typu ciągłego"]),
    ("W jakich komórkach znajduje się struktura widoczna na zdjęciu (elektronogram, gęste ciałko w jądrze)?", ["W komórkach starych, degenerujących"]),
    ("Jakie barwienie zastosowano w tym skrawku (tchawica/przełyk)?", ["Trójbarwienie Mallory'ego"]),
]

OLA = [
    ("Którym numerkiem oznaczono przestrzeń moczową (elektronogram kłębuszka nerkowego)?", ["4"]),
    ("Na zdjęciu przedstawiono pewien specyficzny typ nabłonka. Podaj przykład innego narządu niż ukazany na zdjęciu, w którym występuje ten rodzaj nabłonka.", ["Oskrzele, migdałek gardłowy, jelito cienkie"]),
    ("Podaj nazwę gruczołów przedstawionych na zdjęciu (dwunastnica).", ["Gruczoły Brunnera"]),
    ("Podaj nazwę listka/listków, z których wywodzi się narząd przedstawiony na zdjęciu (tkanka limfatyczna).", ["Endoderma i mezoderma (mezenchyma)"]),
    ("Podaj nazwę narządu ukazanego na zdjęciu.", ["Migdałek gardłowy"]),
    ("Jak nazywa się błona podstawna, na której spoczywa nabłonek wskazany strzałką?", ["Błona Bowmana"]),
    ("Co wskazują strzałki na zdjęciu (kłębuszek nerkowy)?", ["Błony podstawne (nabłonków)"]),
    ("Które stadium rozwoju następuje PO stadium przedstawionym na fotografii (pęcherzyk jajnikowy)?", ["Pęcherzyk dojrzewający"]),
    ("Podaj przykład komórki, której prekursorem jest komórka krwi przedstawiona na zdjęciu.", ["Osteoklasty, komórki mikrogleju"], "Przedstawiona komórka to monocyt."),
    ("Podaj nazwę struktury histologicznej oznaczonej jako \"MC\" (węzeł chłonny).", ["Sinusy rdzenne (węzła chłonnego)"]),
    ("Podaj funkcję struktury oznaczonej numerem 4.", ["Wydzielanie śluzu"]),
    ("Podaj nazwę narządu widocznego na zdjęciu.", ["Przysadka, część gruczołowa"]),
    ("Podaj nazwę struktury zaznaczonej kółkiem (rozmaz komórki mięśnia sercowego).", ["Wstawka"]),
    ("Podaj jakie rodzaje włókien występują we wskazanej tkance.", ["Włókna kolagenowe, włókna sprężyste, włókna siateczkowe"]),
    ("Który typ naczynia krwionośnego przedstawiono na zdjęciu (elektronogram)?", ["Naczynie włosowate porowate"]),
    ("Który typ kolagenu dominuje w warstwie oznaczonej literą \"S\" (rogówka)?", ["Kolagen typu I"]),
    ("Którą cyfrą oznaczono warstwę, w której znajdują się ziarna keratohialinowe (naskórek)?", ["3"]),
    ("Podaj nazwę podstawowej tkanki ustroju wskazanej na zdjęciu (obwódka na preparacie).", ["Tkanka nerwowa"]),
    ("Jakie barwienie zastosowano na tej fotografii (tkanka kostna z osteoblastami/osteoklastem)?", ["Trójbarwienie Mallory'ego"]),
    ("Jaki typ nabłonka przedstawiono na zdjęciu (przewody gruczołu).", ["Nabłonek wielowarstwowy sześcienny"]),
]

def build(prefix, items):
    out = []
    for i, item in enumerate(items, start=1):
        q, answers = item[0], item[1]
        rationale = item[2] if len(item) > 2 else None
        entry = {
            "subject": "histologia",
            "category": CATEGORY,
            "q": q,
            "mode": "typed",
            "answers": answers,
            "img": f"hist_pdf/{prefix}_q{i:02d}.png",
        }
        if rationale:
            entry["rationale"] = rationale
        out.append(entry)
    return out

out = build("tosik", TOSIK) + build("ola", OLA)
json.dump(out, open("histologia_pdf_testy_raw.json", "w", encoding="utf-8"), ensure_ascii=False)
print("zapisano", len(out), "pytan")
