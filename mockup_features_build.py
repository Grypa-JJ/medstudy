"""Concept mockups for the site's main features/modes. Composes existing
brand assets (logo, nyan-cat.gif) with plain drawn UI chrome (bars, cards,
buttons) -- no new illustrated artwork, nothing in index.html touched.
Each function renders one standalone screen mockup.
"""
from PIL import Image, ImageDraw, ImageFont, ImageFilter

A = "brand-assets"
FONT_B = "C:/Windows/Fonts/LatoWeb-Bold.ttf"
FONT_SB = "C:/Windows/Fonts/LatoWeb-Semibold.ttf"
FONT_R = "C:/Windows/Fonts/LatoWeb-Regular.ttf"

PURPLE = (103, 58, 183)
PURPLE2 = (108, 92, 231)
PINK = (216, 96, 196)
TEXT_DARK = (42, 34, 66)
MUTED = (120, 114, 145)
BG_LIGHT = (243, 241, 249)
WHITE = (255, 255, 255)
GREEN = (67, 160, 71)
GREEN_BG = (222, 245, 224)
RED = (211, 47, 47)
RED_BG = (253, 226, 226)
AMBER = (245, 166, 35)

W, H = 1280, 800
CHROME_H = 40


def f(path, size):
    return ImageFont.truetype(path, size)


def rrect(draw, box, r, **kw):
    draw.rounded_rectangle(box, radius=r, **kw)


def center_text(draw, cx, y, text, font, fill, anchor="mm"):
    draw.text((cx, y), text, font=font, fill=fill, anchor=anchor)


def shadow_card(base, box, radius=18, blur=20, alpha=45, dy=6):
    x0, y0, x1, y1 = box
    layer = Image.new("RGBA", base.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    d.rounded_rectangle([x0, y0 + dy, x1, y1 + dy], radius=radius, fill=(20, 15, 40, alpha))
    layer = layer.filter(ImageFilter.GaussianBlur(blur))
    base.alpha_composite(layer)


def new_page(bg=BG_LIGHT):
    page = Image.new("RGBA", (W, H + CHROME_H), bg + (255,))
    draw = ImageDraw.Draw(page, "RGBA")
    # minimal browser chrome so every mockup reads as "a screenshot"
    rrect(draw, [0, 0, W, CHROME_H], r=0, fill=(226, 222, 236, 255))
    for i, c in enumerate([(255, 95, 87), (255, 189, 46), (39, 201, 63)]):
        draw.ellipse([20 + i * 22, CHROME_H / 2 - 6, 32 + i * 22, CHROME_H / 2 + 6], fill=c)
    bar = [110, 9, W - 110, CHROME_H - 9]
    rrect(draw, bar, r=11, fill=(255, 255, 255, 255))
    center_text(draw, W / 2, CHROME_H / 2, "kociabazawiedzy.pl", f(FONT_R, 14), MUTED)
    return page, draw


def app_header(page, draw, title, crumbs, y=CHROME_H):
    logo = Image.open(f"{A}/only-cats-logo.png").convert("RGBA")
    lh = 30
    lw = int(logo.width * lh / logo.height)
    header_h = 64
    rrect(draw, [0, y, W, y + header_h], r=0, fill=(255, 255, 255, 255))
    draw.line([(0, y + header_h), (W, y + header_h)], fill=(226, 222, 236, 255), width=2)
    logo_s = logo.resize((lw, lh), Image.LANCZOS)
    page.paste(logo_s, (32, int(y + (header_h - lh) / 2)), logo_s)
    center_text(draw, W / 2, y + header_h / 2, crumbs, f(FONT_SB, 17), TEXT_DARK)
    return y + header_h


def pill(draw, box, text, fill, text_color, font, outline=None):
    rrect(draw, box, r=(box[3] - box[1]) / 2, fill=fill, outline=outline, width=2 if outline else 0)
    center_text(draw, (box[0] + box[2]) / 2, (box[1] + box[3]) / 2, text, font, text_color)


def draw_check(draw, cx, cy, r, color, w=4):
    draw.line([(cx - r * 0.55, cy + r * 0.05), (cx - r * 0.1, cy + r * 0.5),
               (cx + r * 0.6, cy - r * 0.5)], fill=color, width=w, joint="curve")


def draw_x(draw, cx, cy, r, color, w=4):
    draw.line([(cx - r * 0.5, cy - r * 0.5), (cx + r * 0.5, cy + r * 0.5)], fill=color, width=w)
    draw.line([(cx - r * 0.5, cy + r * 0.5), (cx + r * 0.5, cy - r * 0.5)], fill=color, width=w)


def draw_refresh(draw, cx, cy, r, color, w=3):
    draw.arc([cx - r, cy - r, cx + r, cy + r], start=-210, end=150, fill=color, width=w)
    tip = (cx + r * 0.87, cy - r * 0.5)
    draw.polygon([(tip[0] - 7, tip[1] - 2), (tip[0] + 6, tip[1] - 8), (tip[0] + 2, tip[1] + 8)], fill=color)


def save(page, name):
    page.convert("RGB").save(f"{A}/{name}.png", quality=95)
    print("saved", name)


# =========================================================================
# 1) NYAN CAT MODE
# =========================================================================
def build_nyancat_mode():
    NAVY = (16, 12, 38)  # exact bg color baked into nyan-cat.gif -> zero seam when matched
    page = Image.new("RGBA", (W, H + CHROME_H), NAVY + (255,))
    draw = ImageDraw.Draw(page, "RGBA")
    rrect(draw, [0, 0, W, CHROME_H], r=0, fill=(24, 19, 46, 255))
    for i, c in enumerate([(255, 95, 87), (255, 189, 46), (39, 201, 63)]):
        draw.ellipse([20 + i * 22, CHROME_H / 2 - 6, 32 + i * 22, CHROME_H / 2 + 6], fill=c)

    # starfield
    import random
    rnd = random.Random(4)
    for _ in range(120):
        x, y = rnd.uniform(0, W), rnd.uniform(CHROME_H, H + CHROME_H)
        r = rnd.uniform(1, 2.4)
        op = rnd.randint(90, 220)
        draw.ellipse([x - r, y - r, x + r, y + r], fill=(255, 255, 255, op))

    nyan = Image.open(f"{A}/nyan-cat.gif").convert("RGBA")
    scale = 2.6
    ny = int(CHROME_H + H * 0.30)
    nx = int(W * 0.30)

    # the source frame fades its trail out at its own left edge (x<60) -- skip that fade
    # and tile a clean mid-trail chunk across the full width instead, then place the
    # cat + its clean local trail (x>=260) on top at the right.
    trail_strip = nyan.crop((60, 0, 260, nyan.height))
    strip_big = trail_strip.resize((int(200 * scale), int(nyan.height * scale)), Image.NEAREST)
    cat_part = nyan.crop((260, 0, nyan.width, nyan.height))
    cat_big = cat_part.resize((int(cat_part.width * scale), int(cat_part.height * scale)), Image.NEAREST)
    cat_x = nx + int(260 * scale)

    tx = 0
    while tx < cat_x:
        page.paste(strip_big, (tx, ny), strip_big)
        tx += strip_big.width
    page.paste(cat_big, (cat_x, ny), cat_big)

    draw.text((W / 2, CHROME_H + 90), "Tryb Nyan Cat", font=f(FONT_B, 46), fill=WHITE, anchor="mm")
    draw.text((W / 2, CHROME_H + 138), "Easter egg z ustawień — muzyka leci, kot lata, sesja czeka.",
              font=f(FONT_R, 18), fill=(210, 200, 235, 255), anchor="mm")

    # now-playing widget, bottom-left
    pw = [32, H + CHROME_H - 110, 470, H + CHROME_H - 32]
    shadow_card(page, pw, radius=20, blur=16, alpha=90)
    rrect(draw, pw, r=20, fill=(30, 24, 54, 235))
    play_c = (pw[0] + 44, (pw[1] + pw[3]) / 2)
    draw.ellipse([play_c[0] - 26, play_c[1] - 26, play_c[0] + 26, play_c[1] + 26], fill=PINK)
    draw.polygon([(play_c[0] - 8, play_c[1] - 13), (play_c[0] - 8, play_c[1] + 13),
                  (play_c[0] + 14, play_c[1])], fill=WHITE)
    draw.text((pw[0] + 90, pw[1] + 22), "Nyan Cat — theme", font=f(FONT_SB, 16), fill=WHITE)
    draw.text((pw[0] + 90, pw[1] + 48), "01:07 / 01:33", font=f(FONT_R, 13), fill=(190, 182, 214, 255))
    prog = [pw[0] + 90, pw[1] + 70, pw[2] - 24, pw[1] + 74]
    rrect(draw, prog, r=2, fill=(70, 62, 100, 255))
    rrect(draw, [prog[0], prog[1], prog[0] + (prog[2] - prog[0]) * 0.72, prog[3]], r=2, fill=PINK)

    # exit button, top-right
    ex = [W - 240, CHROME_H + 28, W - 32, CHROME_H + 76]
    pill(draw, ex, "Wyłącz tryb Nyan Cat", (255, 255, 255, 235), PURPLE, f(FONT_SB, 16))

    save(page, "mockup-nyan-cat-mode")


# =========================================================================
# 2) FISZKI (flashcards + Leitner rating)
# =========================================================================
def build_fiszki():
    page, draw = new_page()
    y = app_header(page, draw, "Fiszki", "Mikrobiologia  ›  Clostridium perfringens")

    draw.text((W / 2, y + 34), "Karta 12 / 48", font=f(FONT_SB, 15), fill=MUTED, anchor="mm")
    prog = [W / 2 - 220, y + 52, W / 2 + 220, y + 58]
    rrect(draw, prog, r=3, fill=(226, 222, 236, 255))
    rrect(draw, [prog[0], prog[1], prog[0] + (prog[2] - prog[0]) * 0.25, prog[3]], r=3, fill=PURPLE2)

    card = [W / 2 - 380, y + 90, W / 2 + 380, y + 90 + 400]
    shadow_card(page, card, radius=26, blur=22, alpha=45)
    rrect(draw, card, r=26, fill=WHITE)
    badge = [card[0] + 28, card[1] + 26, card[0] + 190, card[1] + 60]
    pill(draw, badge, "Leitner · pudełko 3", (238, 233, 252, 255), PURPLE, f(FONT_SB, 14))
    q = "Jaki egzotoksyny wytwarza Clostridium perfringens\ni jakie zmiany kliniczne za nie odpowiadają?"
    ty = card[1] + 130
    for line in q.split("\n"):
        draw.text((W / 2, ty), line, font=f(FONT_SB, 24), fill=TEXT_DARK, anchor="mm")
        ty += 38
    draw.line([(card[0] + 60, card[1] + 250), (card[2] - 60, card[1] + 250)], fill=(226, 222, 236, 255), width=2)
    draw.text((W / 2, card[1] + 250 + 34), "kliknij, aby odsłonić odpowiedź",
              font=f(FONT_R, 15), fill=MUTED, anchor="mm")
    flip = [W / 2 - 26, card[3] - 60, W / 2 + 26, card[3] - 8]
    draw.ellipse(flip, fill=(238, 233, 252, 255))
    draw_refresh(draw, (flip[0] + flip[2]) / 2, (flip[1] + flip[3]) / 2, 11, PURPLE)

    ry = card[3] + 40
    draw.text((W / 2, ry), "Jak dobrze to znałeś/aś?", font=f(FONT_R, 16), fill=MUTED, anchor="mm")
    ry += 40
    ratings = [("Trudne", RED_BG, RED), ("Średnie", (255, 244, 219), AMBER), ("Łatwe", GREEN_BG, GREEN)]
    bw, gap = 190, 24
    startx = W / 2 - (bw * 3 + gap * 2) / 2
    for i, (label, bg, fg) in enumerate(ratings):
        bx = startx + i * (bw + gap)
        box = [bx, ry, bx + bw, ry + 56]
        shadow_card(page, box, radius=16, blur=10, alpha=25)
        rrect(draw, box, r=16, fill=bg)
        center_text(draw, (box[0] + box[2]) / 2, (box[1] + box[3]) / 2, label, f(FONT_SB, 18), fg)

    save(page, "mockup-fiszki")


# =========================================================================
# 3) TEST ABCDE (multiple choice + rationale)
# =========================================================================
def build_test():
    page, draw = new_page()
    y = app_header(page, draw, "Test", "Farmakologia  ›  Antybiotyki beta-laktamowe")

    top = [40, y + 24, W - 40, y + 24 + 52]
    draw.text((top[0], top[1] + 26), "Pytanie 7 / 20", font=f(FONT_SB, 16), fill=TEXT_DARK, anchor="lm")
    timer = [top[2] - 130, top[1], top[2], top[1] + 44]
    pill(draw, timer, "Czas: 08:42", (238, 233, 252, 255), PURPLE, f(FONT_SB, 15))

    qcard = [40, top[3] + 16, W - 40, top[3] + 16 + 110]
    shadow_card(page, qcard, radius=20, blur=16, alpha=35)
    rrect(draw, qcard, r=20, fill=WHITE)
    draw.text((qcard[0] + 30, (qcard[1] + qcard[3]) / 2),
              "Który mechanizm odpowiada za oporność MRSA na metycylinę?",
              font=f(FONT_SB, 21), fill=TEXT_DARK, anchor="lm")

    options = [
        ("A", "Wytwarzanie beta-laktamazy hydrolizującej pierścień", "neutral"),
        ("B", "Zmieniona struktura białka PBP2a (gen mecA)", "correct"),
        ("C", "Pompa efluksowa usuwająca antybiotyk z komórki", "wrong"),
        ("D", "Zmniejszona przepuszczalność błony zewnętrznej", "neutral"),
        ("E", "Enzymatyczna modyfikacja antybiotyku przez acetylację", "neutral"),
    ]
    oy = qcard[3] + 26
    for letter, text, state in options:
        box = [40, oy, W - 40, oy + 62]
        if state == "correct":
            bg, bd, tc = GREEN_BG, GREEN, GREEN
        elif state == "wrong":
            bg, bd, tc = RED_BG, RED, RED
        else:
            bg, bd, tc = WHITE, (222, 218, 234), TEXT_DARK
        shadow_card(page, box, radius=14, blur=8, alpha=20)
        rrect(draw, box, r=14, fill=bg, outline=bd, width=2)
        lb = [box[0] + 18, box[1] + 11, box[0] + 58, box[3] - 11]
        rrect(draw, lb, r=20, fill=bd if state != "neutral" else (238, 233, 252, 255))
        center_text(draw, (lb[0] + lb[2]) / 2, (lb[1] + lb[3]) / 2, letter, f(FONT_B, 17),
                    WHITE if state != "neutral" else PURPLE)
        draw.text((lb[2] + 20, (box[1] + box[3]) / 2), text, font=f(FONT_R, 17), fill=tc, anchor="lm")
        if state == "correct":
            draw_check(draw, box[2] - 34, (box[1] + box[3]) / 2, 15, GREEN)
        if state == "wrong":
            draw_x(draw, box[2] - 34, (box[1] + box[3]) / 2, 13, RED)
        oy += 74

    rat = [40, oy + 6, W - 40, oy + 6 + 96]
    rrect(draw, rat, r=16, fill=(238, 233, 252, 255))
    draw.text((rat[0] + 24, rat[1] + 18), "Wytłumaczenie teoretyczne", font=f(FONT_SB, 16), fill=PURPLE)
    draw.text((rat[0] + 24, rat[1] + 48),
              "MRSA nabywa gen mecA na kasecie SCCmec, kodujący PBP2a o niskim",
              font=f(FONT_R, 14), fill=(90, 70, 130, 255))
    draw.text((rat[0] + 24, rat[1] + 70),
              "powinowactwie do beta-laktamów — dlatego cała ta klasa leków przestaje działać.",
              font=f(FONT_R, 14), fill=(90, 70, 130, 255))

    save(page, "mockup-test-abcde")


# =========================================================================
# 4) TRYB WPISYWANIA (typed answer + error requeue)
# =========================================================================
def build_wpisywanie():
    page, draw = new_page()
    y = app_header(page, draw, "Tryb wpisywania", "Fizjopatologia  ›  Zaburzenia gospodarki kwasowo-zasadowej")

    qcard = [40, y + 30, W - 40, y + 30 + 130]
    shadow_card(page, qcard, radius=20, blur=16, alpha=35)
    rrect(draw, qcard, r=20, fill=WHITE)
    draw.text((qcard[0] + 30, qcard[1] + 30),
              "Jak nazywa się zaburzenie z pH < 7,35, pCO2 > 45 mmHg", font=f(FONT_SB, 21), fill=TEXT_DARK)
    draw.text((qcard[0] + 30, qcard[1] + 66),
              "i prawidłowym / podwyższonym HCO3- ?", font=f(FONT_SB, 21), fill=TEXT_DARK)

    inp = [40, qcard[3] + 26, W - 40, qcard[3] + 26 + 64]
    rrect(draw, inp, r=14, fill=WHITE, outline=RED, width=3)
    draw.text((inp[0] + 22, (inp[1] + inp[3]) / 2), "kwasica oddechowa wyrównana",
              font=f(FONT_R, 18), fill=TEXT_DARK, anchor="lm")

    fb = [40, inp[3] + 16, W - 40, inp[3] + 16 + 60]
    rrect(draw, fb, r=14, fill=RED_BG)
    draw.text((fb[0] + 22, (fb[1] + fb[3]) / 2),
              "Prawie! Poprawna odpowiedź: kwasica oddechowa NIE wyrównana \u2014 ta karta wraca na koniec kolejki.",
              font=f(FONT_R, 15), fill=RED, anchor="lm")

    btn = [W - 240, fb[3] + 26, W - 40, fb[3] + 26 + 54]
    pill(draw, btn, "Dalej  \u2192", PURPLE2, WHITE, f(FONT_SB, 17))

    # queue strip showing the missed card looping to the back
    qy = btn[3] + 50
    draw.text((40, qy), "Kolejka na dziś", font=f(FONT_SB, 16), fill=TEXT_DARK)
    qy += 34
    chips = ["12", "13", "14", "15 (ta)", "16", "17", "\u2026", "12"]
    cx = 40
    boxes = []
    for i, c in enumerate(chips):
        is_current = "(ta)" in c
        is_requeued = i == len(chips) - 1
        w_ = 70 if not is_current else 96
        box = [cx, qy, cx + w_, qy + 46]
        boxes.append((box, is_requeued))
        if is_current:
            fill_, tc = PURPLE2, WHITE
        elif is_requeued:
            fill_, tc = (255, 244, 219, 255), AMBER
        elif c == "\u2026":
            fill_, tc = (255, 255, 255, 0), MUTED
        else:
            fill_, tc = WHITE, TEXT_DARK
        if c != "\u2026":
            rrect(draw, box, r=12, fill=fill_, outline=None if is_current else (222, 218, 234, 255),
                  width=0 if is_current else 2)
        center_text(draw, (box[0] + box[2]) / 2, (box[1] + box[3]) / 2, c, f(FONT_SB, 14), tc)
        cx += w_ + 12
    last_box = boxes[-1][0]
    draw.text(((last_box[0] + last_box[2]) / 2, last_box[3] + 18), "wraca na koniec kolejki",
              font=f(FONT_R, 12), fill=AMBER, anchor="mm")

    save(page, "mockup-tryb-wpisywania")


# =========================================================================
# 5) PROFIL / STATYSTYKI
# =========================================================================
def build_profil():
    page, draw = new_page()
    y = app_header(page, draw, "Profil", "Twój profil i statystyki")

    card = [40, y + 30, 420, y + 30 + 230]
    shadow_card(page, card, radius=22, blur=18, alpha=35)
    rrect(draw, card, r=22, fill=WHITE)
    ac = (card[0] + 100, card[1] + 100)
    for rad, col in [(64, PINK), (58, WHITE)]:
        draw.ellipse([ac[0] - rad, ac[1] - rad, ac[0] + rad, ac[1] + rad], fill=col if rad == 58 else col)
    icon = Image.open(f"{A}/only-cats-icon.png").convert("RGBA")
    isz = 96
    icon_s = icon.resize((isz, isz), Image.LANCZOS)
    page.paste(icon_s, (int(ac[0] - isz / 2), int(ac[1] - isz / 2)), icon_s)
    draw.text((card[0] + 190, card[1] + 60), "Kasia", font=f(FONT_B, 24), fill=TEXT_DARK)
    draw.text((card[0] + 190, card[1] + 94), "Rok III \u00b7 WUM", font=f(FONT_R, 15), fill=MUTED)
    streak = [card[0] + 190, card[1] + 122, card[0] + 340, card[1] + 154]
    pill(draw, streak, "seria: 12 dni z rzędu", (255, 244, 219, 255), AMBER, f(FONT_SB, 13))
    draw.text((card[0] + 30, card[1] + 180), "Poziom 7 \u00b7 2 340 XP", font=f(FONT_SB, 15), fill=PURPLE)
    xp = [card[0] + 30, card[1] + 206, card[2] - 30, card[1] + 212]
    rrect(draw, xp, r=3, fill=(226, 222, 236, 255))
    rrect(draw, [xp[0], xp[1], xp[0] + (xp[2] - xp[0]) * 0.62, xp[3]], r=3, fill=PURPLE2)

    stats = [("14 820", "pytań przerobionych"), ("87%", "skuteczność"), ("312", "godzin nauki")]
    sx = 460
    for label_num, label_txt in stats:
        box = [sx, y + 30, sx + 240, y + 30 + 110]
        shadow_card(page, box, radius=18, blur=14, alpha=30)
        rrect(draw, box, r=18, fill=WHITE)
        center_text(draw, (box[0] + box[2]) / 2, box[1] + 42, label_num, f(FONT_B, 26), PURPLE)
        center_text(draw, (box[0] + box[2]) / 2, box[1] + 78, label_txt, f(FONT_R, 13), MUTED)
        sx += 260

    # activity heatmap
    hy = card[3] + 40
    draw.text((40, hy), "Aktywność \u2014 ostatnie 12 tygodni", font=f(FONT_SB, 17), fill=TEXT_DARK)
    hy += 34
    import random
    rnd = random.Random(9)
    cell, gap = 20, 5
    for wcol in range(24):
        for drow in range(7):
            v = rnd.random()
            if v < 0.25:
                col = (232, 228, 242, 255)
            elif v < 0.5:
                col = (196, 176, 235, 255)
            elif v < 0.75:
                col = (150, 110, 220, 255)
            else:
                col = (103, 58, 183, 255)
            x0 = 40 + wcol * (cell + gap)
            y0 = hy + drow * (cell + gap)
            rrect(draw, [x0, y0, x0 + cell, y0 + cell], r=4, fill=col)

    # per-subject bars
    by = hy + 7 * (cell + gap) + 40
    draw.text((40, by), "Postęp wg przedmiotu", font=f(FONT_SB, 17), fill=TEXT_DARK)
    by += 36
    subj = [("Mikrobiologia", 0.82, (21, 101, 192)), ("Farmakologia", 0.61, (103, 58, 183)),
            ("Fizjopatologia", 0.45, (194, 24, 132)), ("Anatomia", 0.90, (46, 125, 50))]
    for name, pct, col in subj:
        draw.text((40, by), name, font=f(FONT_R, 15), fill=TEXT_DARK)
        bar = [260, by + 3, W - 40, by + 3 + 16]
        rrect(draw, bar, r=8, fill=(232, 228, 242, 255))
        rrect(draw, [bar[0], bar[1], bar[0] + (bar[2] - bar[0]) * pct, bar[3]], r=8, fill=col)
        draw.text((bar[2] - 4, by), f"{int(pct*100)}%", font=f(FONT_SB, 13), fill=MUTED, anchor="ra")
        by += 40

    save(page, "mockup-profil-statystyki")


if __name__ == "__main__":
    build_nyancat_mode()
    build_fiszki()
    build_test()
    build_wpisywanie()
    build_profil()
