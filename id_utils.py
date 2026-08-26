"""
id_utils.py
Deterministyczne ID pytań - lustrzane odbicie id-utils.js.
Używane przeze mnie offline przy migracji starych baz (anatomia/histologia/biochemia)
do nowego wspólnego schematu, żeby ID zgadzały się z tym, co appka policzy w przeglądarce.
"""
import re

SUBJECT_PREFIX = {
    "anatomia": "anat",
    "histologia": "hist",
    "biochemia": "bioch",
    "ebm": "ebm",
    "historia_medycyny": "hmed",
    "angielski_2": "ang2",
    "mikrobiologia": "mikro",
}


def normalize_text(s: str) -> str:
    s = re.sub(r'^\s*\d+\.\s*', '', s)  # usuń numerację "123. " z początku
    s = s.strip()
    s = re.sub(r'\s+', ' ', s)
    return s


def fnv1a(s: str) -> str:
    """FNV-1a 32-bit nad bajtami UTF-8 - identyczne z wersją JS (TextEncoder)."""
    h = 0x811c9dc5
    for byte in s.encode('utf-8'):
        h ^= byte
        h = (h * 0x01000193) & 0xFFFFFFFF
    return format(h, '08x')


def make_question_id(subject: str, q: str, o: list[str]) -> str:
    prefix = SUBJECT_PREFIX.get(subject, subject[:5])
    norm_q = normalize_text(q)
    norm_o = "|".join(x.strip() for x in o)
    h = fnv1a(norm_q + "||" + norm_o)
    return f"{prefix}_{h}"


def assign_ids(questions: list[dict], subject: str) -> list[dict]:
    out = []
    for item in questions:
        if not item.get("id"):
            item = dict(item)
            item["id"] = make_question_id(subject, item["q"], item["o"])
        out.append(item)
    return out


if __name__ == "__main__":
    # szybki self-test
    sample_q = "1. Gdzie znajduje się jądro wierzchu (nucleus fastigii)?"
    sample_o = ["Wzgórze", "Most", "Móżdżek", "Śródmózgowie", "Rdzeń przedłużony"]
    print(make_question_id("anatomia", sample_q, sample_o))
