"""Concept mockup: composes ALREADY-GENERATED brand assets (hero image, logo,
bg pattern) into a single 'what the page could look like' preview PNG.
No new illustrated assets are created here -- only layout chrome (bars,
buttons, cards, text) around the existing images. Nothing in index.html
is touched.
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


def f(path, size):
    return ImageFont.truetype(path, size)


def rrect(draw, box, r, **kw):
    draw.rounded_rectangle(box, radius=r, **kw)


def center_text(draw, cx, y, text, font, fill, anchor="mm"):
    draw.text((cx, y), text, font=font, fill=fill, anchor=anchor)


def shadow_card(base, box, radius=18, blur=22, alpha=70):
    x0, y0, x1, y1 = box
    pad = blur * 2
    layer = Image.new("RGBA", base.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    d.rounded_rectangle([x0, y0 + 8, x1, y1 + 8], radius=radius, fill=(20, 15, 40, alpha))
    layer = layer.filter(ImageFilter.GaussianBlur(blur))
    base.alpha_composite(layer)


def main():
    W = 1440
    NAV_H = 88
    HERO_H = 560
    STATS_H = 200
    SUBJ_H = 520
    CTA_H = 300
    FOOT_H = 140
    H = NAV_H + HERO_H + STATS_H + SUBJ_H + CTA_H + FOOT_H

    page = Image.new("RGBA", (W, H), BG_LIGHT + (255,))
    draw = ImageDraw.Draw(page, "RGBA")

    # ---------------------------------------------------------------- HERO
    hero_src = Image.open(f"{A}/hero-studying-cat.png").convert("RGBA")
    scale = W / hero_src.width
    hero = hero_src.resize((W, int(hero_src.height * scale)), Image.LANCZOS)
    hy0 = 0
    crop_top = max(0, (hero.height - (NAV_H + HERO_H)) // 3)
    hero_crop = hero.crop((0, crop_top, W, crop_top + NAV_H + HERO_H))
    page.paste(hero_crop, (0, hy0), hero_crop)

    # nav bar (transparent, sits over the hero image)
    logo = Image.open(f"{A}/only-cats-logo.png").convert("RGBA")
    logo_h = 40
    logo_w = int(logo.width * logo_h / logo.height)
    logo_pill_pad = 14
    pill_box = [40, (NAV_H - logo_h) // 2 - logo_pill_pad, 40 + logo_w + logo_pill_pad * 2,
                (NAV_H - logo_h) // 2 + logo_h + logo_pill_pad]
    rrect(draw, pill_box, r=16, fill=(255, 255, 255, 235))
    logo_nav = logo.resize((logo_w, logo_h), Image.LANCZOS)
    page.paste(logo_nav, (40 + logo_pill_pad, pill_box[1] + logo_pill_pad), logo_nav)

    nav_items = ["Fiszki", "Testy", "Giełdy", "Statystyki"]
    nx = W - 560
    nav_font = f(FONT_SB, 19)
    for item in nav_items:
        draw.text((nx, NAV_H / 2), item, font=nav_font, fill=(255, 255, 255, 235), anchor="lm")
        bbox = draw.textbbox((nx, NAV_H / 2), item, font=nav_font, anchor="lm")
        nx = bbox[2] + 34
    btn_box = [nx + 6, NAV_H / 2 - 22, nx + 6 + 150, NAV_H / 2 + 22]
    rrect(draw, btn_box, r=20, fill=(255, 255, 255, 235))
    center_text(draw, (btn_box[0] + btn_box[2]) / 2, NAV_H / 2, "Zaloguj się",
                f(FONT_B, 18), PURPLE)

    # hero headline (left column, over the empty starry area of the image)
    hx = 76
    hy = NAV_H + 150
    draw.text((hx, hy), "Kocia Baza Wiedzy", font=f(FONT_B, 54), fill=WHITE)
    draw.text((hx, hy + 76), "Only Cats", font=f(FONT_B, 30), fill=(230, 210, 255, 255))
    sub_font = f(FONT_R, 21)
    sub_lines = ["Fiszki, testy i giełdy pytań do sesji —", "wszystko w jednym miejscu, pilnowane przez koty."]
    sy = hy + 140
    for line in sub_lines:
        draw.text((hx, sy), line, font=sub_font, fill=(226, 220, 245, 255))
        sy += 30

    cta_box = [hx, sy + 26, hx + 250, sy + 26 + 58]
    shadow_card(page, cta_box, radius=29, blur=16, alpha=90)
    rrect(draw, cta_box, r=29, fill=PINK)
    center_text(draw, (cta_box[0] + cta_box[2]) / 2, (cta_box[1] + cta_box[3]) / 2,
                "Zacznij naukę  →", f(FONT_B, 20), WHITE)

    sec_box = [hx + 268, sy + 26, hx + 268 + 210, sy + 26 + 58]
    rrect(draw, sec_box, r=29, outline=(255, 255, 255, 220), width=2)
    center_text(draw, (sec_box[0] + sec_box[2]) / 2, (sec_box[1] + sec_box[3]) / 2,
                "Tryb Nyan Cat", f(FONT_SB, 17), WHITE)

    # ------------------------------------------------------------ STATS ROW
    sy0 = NAV_H + HERO_H
    stats = [("38 000+", "pytań w bazie"), ("20+", "przedmiotów"), ("100%", "z wytłumaczeniem"), ("0 zł", "dla studentów")]
    card_w = (W - 80 - 3 * 24) / 4
    for i, (num, label) in enumerate(stats):
        x0 = 40 + i * (card_w + 24)
        box = [x0, sy0 + 32, x0 + card_w, sy0 + STATS_H - 32]
        shadow_card(page, box, radius=20, blur=14, alpha=35)
        rrect(draw, box, r=20, fill=WHITE)
        cx = (box[0] + box[2]) / 2
        center_text(draw, cx, box[1] + 46, num, f(FONT_B, 32), PURPLE)
        center_text(draw, cx, box[1] + 84, label, f(FONT_R, 15), MUTED)

    # -------------------------------------------------------------- SUBJECTS
    sy1 = sy0 + STATS_H
    draw.text((40, sy1 + 34), "Wybierz przedmiot", font=f(FONT_B, 28), fill=TEXT_DARK)
    draw.text((40, sy1 + 74), "Kliknij i zacznij powtórkę — fiszki, testy albo tryb wpisywania.",
              font=f(FONT_R, 16), fill=MUTED)

    subjects = [
        ("Mikrobiologia", (238, 243, 251), (21, 101, 192)),
        ("Farmakologia", (245, 243, 252), (103, 58, 183)),
        ("Fizjopatologia", (255, 240, 246), (194, 24, 132)),
        ("Anatomia", (240, 249, 241), (46, 125, 50)),
        ("Biochemia", (255, 247, 230), (191, 128, 12)),
        ("Immunologia", (236, 246, 255), (25, 118, 210)),
        ("Histologia", (247, 240, 255), (123, 31, 162)),
        ("Angielski", (232, 250, 244), (0, 121, 107)),
    ]
    cols, rows = 4, 2
    gap = 22
    tw = (W - 80 - (cols - 1) * gap) / cols
    th = 160
    for i, (name, bg, fg) in enumerate(subjects):
        c, r = i % cols, i // cols
        x0 = 40 + c * (tw + gap)
        y0 = sy1 + 130 + r * (th + gap)
        box = [x0, y0, x0 + tw, y0 + th]
        shadow_card(page, box, radius=18, blur=10, alpha=25)
        rrect(draw, box, r=18, fill=bg)
        badge = [x0 + 22, y0 + 20, x0 + 22 + 40, y0 + 20 + 40]
        rrect(draw, badge, r=12, fill=fg)
        center_text(draw, (badge[0] + badge[2]) / 2, (badge[1] + badge[3]) / 2,
                    name[0], f(FONT_B, 20), WHITE)
        draw.text((x0 + 22, y0 + 82), name, font=f(FONT_SB, 19), fill=fg)
        draw.text((x0 + 22, y0 + 114), "przećwicz teraz  →", font=f(FONT_R, 13), fill=MUTED)

    # ------------------------------------------------------------- CTA BAND
    sy2 = sy1 + SUBJ_H
    band = [40, sy2 + 20, W - 40, sy2 + CTA_H - 20]
    band_img = Image.new("RGBA", (int(band[2] - band[0]), int(band[3] - band[1])), (0, 0, 0, 0))
    bd = ImageDraw.Draw(band_img)
    for yy in range(band_img.height):
        t = yy / band_img.height
        col = tuple(int(PURPLE[i] + (PINK[i] - PURPLE[i]) * t) for i in range(3))
        bd.line([(0, yy), (band_img.width, yy)], fill=col + (255,))
    mask = Image.new("L", band_img.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, band_img.width, band_img.height], radius=26, fill=255)
    band_img.putalpha(mask)
    shadow_card(page, band, radius=26, blur=18, alpha=55)
    page.paste(band_img, (int(band[0]), int(band[1])), band_img)

    bcx = (band[0] + band[2]) / 2
    draw.text((bcx, band[1] + 60), "Sesja tuż-tuż. Ogarnij materiał z kotami.",
              font=f(FONT_B, 30), fill=WHITE, anchor="mm")
    draw.text((bcx, band[1] + 104), "Codzienna kolejka powtórek, Leitner i statystyki na Twój profil.",
              font=f(FONT_R, 17), fill=(240, 232, 250), anchor="mm")
    btn2 = [bcx - 130, band[1] + 140, bcx + 130, band[1] + 140 + 54]
    rrect(draw, btn2, r=27, fill=WHITE)
    center_text(draw, bcx, (btn2[1] + btn2[3]) / 2, "Załóż konto", f(FONT_B, 19), PURPLE)

    # ---------------------------------------------------------------- FOOTER
    fy0 = sy2 + CTA_H
    rrect(draw, [0, fy0, W, H], r=0, fill=(26, 21, 48, 255))
    flogo_h = 26
    flogo_w = int(logo.width * flogo_h / logo.height)
    flogo_pill = [40, fy0 + (FOOT_H - flogo_h) / 2 - 10, 40 + flogo_w + 20, fy0 + (FOOT_H - flogo_h) / 2 + flogo_h + 10]
    rrect(draw, flogo_pill, r=12, fill=(255, 255, 255, 230))
    flogo = logo.resize((flogo_w, flogo_h), Image.LANCZOS)
    page.paste(flogo, (50, int(flogo_pill[1] + 10)), flogo)
    draw.text((W - 40, fy0 + FOOT_H / 2), "Kocia Baza Wiedzy \u00b7 zrobione z mi\u0142o\u015bci\u0105 dla sesji",
              font=f(FONT_R, 15), fill=(190, 182, 214, 255), anchor="rm")

    page.convert("RGB").save("brand-assets/_concept_preview.png", quality=95)
    print("mockup saved", page.size)


if __name__ == "__main__":
    main()
