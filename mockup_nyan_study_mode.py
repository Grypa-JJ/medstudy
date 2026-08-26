"""Concept: 'Tryb kolorowy' as a real persistent study mode (toggle next to
'Tryb cichy'), not a fullscreen easter egg -- the moving rainbow/cat scene
sits behind the actual flashcard UI. Reuses helpers + assets from
mockup_features_build.py; nothing in index.html is touched.
"""
from PIL import Image, ImageDraw, ImageFilter
import mockup_features_build as m

A, f, rrect, center_text, shadow_card, pill = m.A, m.f, m.rrect, m.center_text, m.shadow_card, m.pill
draw_refresh = m.draw_refresh
FONT_B, FONT_SB, FONT_R = m.FONT_B, m.FONT_SB, m.FONT_R
PURPLE, PURPLE2, PINK = m.PURPLE, m.PURPLE2, m.PINK
TEXT_DARK, MUTED, WHITE = m.TEXT_DARK, m.MUTED, m.WHITE
RED, AMBER, GREEN = m.RED, m.AMBER, m.GREEN
RED_BG, GREEN_BG = m.RED_BG, m.GREEN_BG
W, H, CHROME_H = m.W, m.H, m.CHROME_H

NAVY = (16, 12, 38)


def build_colorful_scene(page, draw, y0, y1):
    """Paints the moving nyan-cat backdrop into the [y0,y1) band of `page`."""
    import random
    band_h = y1 - y0
    rrect(draw, [0, y0, W, y1], r=0, fill=NAVY + (255,))

    rnd = random.Random(12)
    for _ in range(150):
        x, y = rnd.uniform(0, W), rnd.uniform(y0, y1)
        r = rnd.uniform(1, 2.6)
        op = rnd.randint(80, 200)
        draw.ellipse([x - r, y - r, x + r, y + r], fill=(255, 255, 255, op))

    nyan = Image.open(f"{A}/nyan-cat.gif").convert("RGBA")
    scale = 2.1
    trail_strip = nyan.crop((60, 0, 260, nyan.height))
    strip_big = trail_strip.resize((int(200 * scale), int(nyan.height * scale)), Image.NEAREST)
    cat_part = nyan.crop((260, 0, nyan.width, nyan.height))
    cat_big = cat_part.resize((int(cat_part.width * scale), int(cat_part.height * scale)), Image.NEAREST)

    trail_y = y0 + int(band_h * 0.30)
    cat_x = W - int(cat_big.width * 0.72)

    tx = 0
    while tx < cat_x + cat_big.width:
        page.paste(strip_big, (tx, trail_y), strip_big)
        tx += strip_big.width
    page.paste(cat_big, (cat_x, trail_y), cat_big)

    # a second, fainter trail further down for depth / constant motion feel
    trail_y2 = y0 + int(band_h * 0.74)
    faint = strip_big.copy()
    r, g, b, a = faint.split()
    a = a.point(lambda p: int(p * 0.35))
    faint.putalpha(a)
    tx = -140
    while tx < W:
        page.paste(faint, (tx, trail_y2), faint)
        tx += strip_big.width

    # legibility scrim over the whole band
    scrim = Image.new("RGBA", (W, band_h), (10, 7, 20, 130))
    page.alpha_composite(scrim, (0, y0))


def toggle_switch(draw, box, active_right, left_label, right_label):
    x0, y0, x1, y1 = box
    rrect(draw, box, r=(y1 - y0) / 2, fill=(234, 230, 244, 255))
    half_w = (x1 - x0) / 2
    knob = [x0 + (half_w if active_right else 0), y0, x0 + half_w + (half_w if active_right else 0), y1]
    pad = 3
    knob = [knob[0] + pad, knob[1] + pad, knob[2] - pad, knob[3] - pad]
    rrect(draw, knob, r=(knob[3] - knob[1]) / 2, fill=PURPLE2)
    center_text(draw, x0 + half_w / 2, (y0 + y1) / 2, left_label, f(FONT_SB, 14),
                WHITE if not active_right else MUTED)
    center_text(draw, x0 + half_w + half_w / 2, (y0 + y1) / 2, right_label, f(FONT_SB, 14),
                WHITE if active_right else MUTED)


def build():
    page = Image.new("RGBA", (W, H + CHROME_H), WHITE + (255,))
    draw = ImageDraw.Draw(page, "RGBA")

    # browser chrome
    rrect(draw, [0, 0, W, CHROME_H], r=0, fill=(226, 222, 236, 255))
    for i, c in enumerate([(255, 95, 87), (255, 189, 46), (39, 201, 63)]):
        draw.ellipse([20 + i * 22, CHROME_H / 2 - 6, 32 + i * 22, CHROME_H / 2 + 6], fill=c)
    bar = [110, 9, W - 110, CHROME_H - 9]
    rrect(draw, bar, r=11, fill=WHITE + (255,))
    center_text(draw, W / 2, CHROME_H / 2, "kociabazawiedzy.pl", f(FONT_R, 14), MUTED)

    # app header
    header_h = 76
    y = CHROME_H
    rrect(draw, [0, y, W, y + header_h], r=0, fill=WHITE + (255,))
    logo = Image.open(f"{A}/only-cats-logo.png").convert("RGBA")
    lh = 30
    lw = int(logo.width * lh / logo.height)
    logo_s = logo.resize((lw, lh), Image.LANCZOS)
    page.paste(logo_s, (32, int(y + (header_h - lh) / 2 - 8)), logo_s)
    draw.text((32, y + header_h - 26), "Mikrobiologia  ›  Clostridium perfringens",
              font=f(FONT_SB, 15), fill=MUTED)

    tw = [W - 300, y + header_h / 2 - 20, W - 32, y + header_h / 2 + 20]
    toggle_switch(draw, tw, active_right=True, left_label="Cichy", right_label="Kolorowy")
    draw.text((tw[2] - (tw[2]-tw[0])/2, tw[1] - 16), "Tryb nauki", font=f(FONT_R, 12),
              fill=MUTED, anchor="mb")
    draw.line([(0, y + header_h), (W, y + header_h)], fill=(226, 222, 236, 255), width=2)

    scene_y0 = y + header_h
    scene_y1 = H + CHROME_H
    build_colorful_scene(page, draw, scene_y0, scene_y1)
    draw = ImageDraw.Draw(page, "RGBA")  # re-bind after alpha_composite calls

    draw.text((W / 2, scene_y0 + 34), "Karta 12 / 48", font=f(FONT_SB, 14), fill=(224, 218, 240, 255), anchor="mm")
    prog = [W / 2 - 200, scene_y0 + 50, W / 2 + 200, scene_y0 + 55]
    rrect(draw, prog, r=3, fill=(255, 255, 255, 70))
    rrect(draw, [prog[0], prog[1], prog[0] + (prog[2] - prog[0]) * 0.25, prog[3]], r=3, fill=PINK)

    card = [W / 2 - 360, scene_y0 + 80, W / 2 + 360, scene_y0 + 80 + 370]
    shadow_card(page, card, radius=26, blur=26, alpha=110, dy=10)
    draw = ImageDraw.Draw(page, "RGBA")
    rrect(draw, card, r=26, fill=WHITE)
    badge = [card[0] + 28, card[1] + 24, card[0] + 190, card[1] + 58]
    pill(draw, badge, "Leitner · pudełko 3", (238, 233, 252, 255), PURPLE, f(FONT_SB, 14))
    q = "Jaki egzotoksyny wytwarza Clostridium perfringens\ni jakie zmiany kliniczne za nie odpowiadają?"
    ty = card[1] + 122
    for line in q.split("\n"):
        draw.text((W / 2, ty), line, font=f(FONT_SB, 23), fill=TEXT_DARK, anchor="mm")
        ty += 36
    draw.line([(card[0] + 60, card[1] + 230), (card[2] - 60, card[1] + 230)], fill=(226, 222, 236, 255), width=2)
    draw.text((W / 2, card[1] + 230 + 32), "kliknij, aby odsłonić odpowiedź",
              font=f(FONT_R, 14), fill=MUTED, anchor="mm")
    flip = [W / 2 - 24, card[3] - 56, W / 2 + 24, card[3] - 8]
    draw.ellipse(flip, fill=(238, 233, 252, 255))
    draw_refresh(draw, (flip[0] + flip[2]) / 2, (flip[1] + flip[3]) / 2, 10, PURPLE)

    ry = card[3] + 34
    draw.text((W / 2, ry), "Jak dobrze to znałeś/aś?", font=f(FONT_R, 15), fill=(230, 224, 245, 255), anchor="mm")
    ry += 36
    ratings = [("Trudne", RED_BG, RED), ("Średnie", (255, 244, 219), AMBER), ("Łatwe", GREEN_BG, GREEN)]
    bw, gap = 170, 20
    startx = W / 2 - (bw * 3 + gap * 2) / 2
    for i, (label, bg, fg) in enumerate(ratings):
        bx = startx + i * (bw + gap)
        box = [bx, ry, bx + bw, ry + 50]
        shadow_card(page, box, radius=14, blur=10, alpha=60)
        draw = ImageDraw.Draw(page, "RGBA")
        rrect(draw, box, r=14, fill=bg)
        center_text(draw, (box[0] + box[2]) / 2, (box[1] + box[3]) / 2, label, f(FONT_SB, 17), fg)

    cap = [40, H + CHROME_H - 54, 520, H + CHROME_H - 16]
    rrect(draw, cap, r=18, fill=(0, 0, 0, 90))
    draw.text((cap[0] + 16, (cap[1] + cap[3]) / 2),
              "Tło rusza się cały czas w tle — Ty w tym czasie czytasz.",
              font=f(FONT_R, 13), fill=(235, 230, 248, 255), anchor="lm")

    page.convert("RGB").save(f"{A}/mockup-tryb-kolorowy-nauka.png", quality=95)
    print("saved mockup-tryb-kolorowy-nauka")


if __name__ == "__main__":
    build()
