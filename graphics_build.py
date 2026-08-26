"""Original graphics for 'Kocia Baza Wiedzy' / 'Only Cats' study app.
Everything is procedurally drawn with PIL (no traced/copied artwork).
Palette matches the site's existing purple accent (#673AB7 / #6c5ce7)
blended with the pink used in the reworked Nyan Cat.
"""
import math
import random
from PIL import Image, ImageDraw, ImageFilter

OUT = "brand-assets"
SS = 4  # supersampling factor for smooth vector-style shapes

# ---- palette -----------------------------------------------------------
DEEP    = (34, 20, 64)
INDIGO  = (58, 32, 110)
PURPLE  = (103, 58, 183)    # site accent #673AB7
VIOLET  = (140, 82, 209)
PINK    = (216, 96, 196)
LILAC   = (196, 170, 240)
CREAM   = (255, 247, 235)
FUR     = (250, 214, 165)
FUR_DK  = (232, 178, 120)
INK     = (44, 28, 66)
GOLD    = (255, 206, 84)
PANEL   = (26, 21, 48)      # close to site's dark card bg (#1a1530-ish)


def lerp(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))


def diag_gradient(size, c1, c2, c3):
    w, h = size
    img = Image.new("RGB", (w, h))
    px = img.load()
    maxd = w + h
    for y in range(h):
        for x in range(0, w, 2):
            t = (x + y) / maxd
            c = lerp(c1, c2, t / 0.5) if t < 0.5 else lerp(c2, c3, (t - 0.5) / 0.5)
            px[x, y] = c
            if x + 1 < w:
                px[x + 1, y] = c
    return img


def star(draw, cx, cy, r, color, points=4, inner_ratio=0.42, rot=0):
    n = points * 2
    pts = []
    for i in range(n):
        ang = rot + math.pi * i / points
        rad = r if i % 2 == 0 else r * inner_ratio
        pts.append((cx + rad * math.sin(ang), cy - rad * math.cos(ang)))
    draw.polygon(pts, fill=color)


def paw_print(draw, cx, cy, scale, color, angle=0):
    def rot(px, py):
        dx, dy = px - cx, py - cy
        ca, sa = math.cos(angle), math.sin(angle)
        return (cx + dx * ca - dy * sa, cy + dx * sa + dy * ca)

    pad_w, pad_h = 12 * scale, 9.5 * scale
    pcx, pcy = rot(cx, cy + 5 * scale)
    draw.ellipse([pcx - pad_w, pcy - pad_h, pcx + pad_w, pcy + pad_h], fill=color)
    toe_positions = [(-9.5, -3.2), (-3.6, -9.3), (3.6, -9.3), (9.5, -3.2)]
    for (ox, oy) in toe_positions:
        tx, ty = cx + ox * scale, cy + oy * scale
        tx, ty = rot(tx, ty)
        r = 5.9 * scale
        draw.ellipse([tx - r, ty - r, tx + r, ty + r], fill=color)


def draw_cat_head(draw, cx, cy, R, ear_tilt=10, closed_eyes=True):
    """Round cute cat head with ears, blush, whiskers. Returns nothing."""
    ear_r = R * 0.40
    for sgn in (-1, 1):
        ex = cx + sgn * R * 0.60
        ey = cy - R * 0.70
        tip_x = ex + sgn * ear_r * (ear_tilt / 100)
        draw.polygon([(ex - ear_r * 0.95, ey + ear_r * 0.85),
                      (tip_x, ey - ear_r * 1.05),
                      (ex + ear_r * 0.95, ey + ear_r * 0.85)], fill=FUR)
        draw.polygon([(ex - ear_r * 0.5, ey + ear_r * 0.5),
                      (tip_x, ey - ear_r * 0.45),
                      (ex + ear_r * 0.5, ey + ear_r * 0.5)], fill=(255, 202, 212))
    draw.ellipse([cx - R, cy - R, cx + R, cy + R], fill=FUR)

    ew = R * 0.15
    for sgn in (-1, 1):
        ex, ey = cx + sgn * R * 0.35, cy + R * 0.02
        if closed_eyes:
            draw.arc([ex - ew, ey - ew * 0.9, ex + ew, ey + ew * 0.9], start=10, end=170,
                      fill=INK, width=max(2, int(R * 0.045)))
        else:
            draw.ellipse([ex - ew * 0.6, ey - ew * 0.75, ex + ew * 0.6, ey + ew * 0.75], fill=INK)
            draw.ellipse([ex - ew * 0.22, ey - ew * 0.6, ex + ew * 0.05, ey - ew * 0.2], fill=(255, 255, 255))
    for sgn in (-1, 1):
        bx, by = cx + sgn * R * 0.66, cy + R * 0.26
        draw.ellipse([bx - R * 0.15, by - R * 0.09, bx + R * 0.15, by + R * 0.09], fill=(255, 172, 190))
    draw.polygon([(cx - R * 0.06, cy + R * 0.16), (cx + R * 0.06, cy + R * 0.16), (cx, cy + R * 0.24)],
                 fill=(205, 128, 138))
    draw.arc([cx - R * 0.15, cy + R * 0.17, cx, cy + R * 0.36], start=10, end=95,
              fill=INK, width=max(2, int(R * 0.03)))
    draw.arc([cx, cy + R * 0.17, cx + R * 0.15, cy + R * 0.36], start=85, end=170,
              fill=INK, width=max(2, int(R * 0.03)))
    for sgn in (-1, 1):
        for k, dy in enumerate((-0.06, 0.02, 0.10)):
            x0 = cx + sgn * R * 0.42
            y0 = cy + R * (0.20 + dy)
            x1 = cx + sgn * R * 0.92
            y1 = y0 - (1 - k) * R * 0.05 * sgn * 0 + (1 - k) * R * 0.02
            draw.line([(x0, y0), (x1, y1)], fill=(150, 110, 90), width=max(2, int(R * 0.018)))


# =========================================================================
# 1) HERO BANNER — cat peeking over an open book
# =========================================================================
def build_hero():
    W, H = 1200, 480
    S = SS
    big = (W * S, H * S)
    base = diag_gradient(big, DEEP, INDIGO, (78, 42, 132)).convert("RGBA")
    draw = ImageDraw.Draw(base, "RGBA")

    cx, cy = int(W * 0.665 * S), int(H * 0.40 * S)
    R = 118 * S

    glow = Image.new("RGBA", big, (0, 0, 0, 0))
    gdraw = ImageDraw.Draw(glow)
    gr = int(260 * S)
    gdraw.ellipse([cx - gr, cy - gr + 40 * S, cx + gr, cy + gr + 40 * S], fill=(*PINK, 85))
    glow = glow.filter(ImageFilter.GaussianBlur(60 * S))
    base = Image.alpha_composite(base, glow)
    draw = ImageDraw.Draw(base, "RGBA")

    rnd = random.Random(7)
    for _ in range(50):
        x = rnd.uniform(0, W) * S
        y = rnd.uniform(0, H * 0.9) * S
        if abs(x - cx) < R * 1.4 and abs(y - cy) < R * 1.6:
            continue
        r = rnd.uniform(3, 8) * S
        op = rnd.randint(90, 210)
        p = rnd.choice([4, 4, 8])
        star(draw, x, y, r, (255, 255, 255, op), points=p)

    arc_cx, arc_cy = int(-30 * S), int(H * S + 30 * S)
    rainbow = [(255, 99, 132), (255, 178, 84), (255, 238, 120),
               (140, 224, 150), (110, 180, 240), (176, 128, 235)]
    for i, col in enumerate(rainbow):
        rr = int((160 + i * 17) * S)
        bbox = [arc_cx - rr, arc_cy - rr, arc_cx + rr, arc_cy + rr]
        draw.arc(bbox, start=-95, end=-5, fill=(*col, 120), width=int(10 * S))

    # ---- tail: simple hook, drawn low & to the side, well clear of the head
    tail_root = (cx + R * 0.55, cy + R * 1.35)
    pts = []
    for t in range(24):
        u = t / 23
        ang = math.pi * (0.15 + 1.35 * u)
        rx = R * (0.85 - 0.35 * u)
        px = tail_root[0] + math.cos(ang) * rx
        py = tail_root[1] - math.sin(ang) * rx * 0.9
        pts.append((px, py))
    draw.line(pts, fill=FUR_DK, width=int(24 * S), joint="curve")
    draw.ellipse([pts[0][0] - 12 * S, pts[0][1] - 12 * S, pts[0][0] + 12 * S, pts[0][1] + 12 * S], fill=FUR_DK)
    draw.ellipse([pts[-1][0] - 12 * S, pts[-1][1] - 12 * S, pts[-1][0] + 12 * S, pts[-1][1] + 12 * S], fill=FUR_DK)

    # ---- open book, drawn below the head, cat "resting" on top edge
    bx, by = cx, cy + R * 1.18
    bw, bh = R * 1.85, R * 0.62
    spine_top = (bx, by - bh * 0.28)
    draw.polygon([(bx - bw, by + bh * 0.30), spine_top, (bx, by + bh),
                  (bx - bw * 0.92, by + bh * 1.18)], fill=CREAM)
    draw.polygon([(bx + bw, by + bh * 0.30), spine_top, (bx, by + bh),
                  (bx + bw * 0.92, by + bh * 1.18)], fill=(240, 231, 216))
    for k in range(1, 4):
        f = k / 4
        draw.line([(bx - bw * (0.15 + 0.75 * f), by + bh * (0.42 + 0.05 * k)),
                   (bx - bw * 0.06, by + bh * (0.92 + 0.05 * k))],
                   fill=(196, 176, 154), width=int(2.2 * S))
        draw.line([(bx + bw * (0.15 + 0.75 * f), by + bh * (0.42 + 0.05 * k)),
                   (bx + bw * 0.06, by + bh * (0.92 + 0.05 * k))],
                   fill=(196, 176, 154), width=int(2.2 * S))
    draw.line([spine_top, (bx, by + bh)], fill=(205, 186, 164), width=int(3 * S))

    # front paws resting on the book's top edge
    for sgn in (-1, 1):
        px, py = bx + sgn * R * 0.52, by - bh * 0.05
        draw.ellipse([px - R * 0.22, py - R * 0.16, px + R * 0.22, py + R * 0.20], fill=FUR)

    # ---- body hint behind the book (just enough to read as a torso)
    draw.ellipse([cx - R * 0.78, cy + R * 0.55, cx + R * 0.78, cy + R * 1.5], fill=FUR)

    # ---- head + cap on top
    draw_cat_head(draw, cx, cy, R, closed_eyes=True)

    cap_y = cy - R * 1.0
    board_w, board_h = R * 1.55, R * 0.17
    draw.polygon([(cx - board_w / 2, cap_y), (cx, cap_y - board_h * 2.0),
                  (cx + board_w / 2, cap_y), (cx, cap_y + board_h * 2.0)], fill=INK)
    draw.ellipse([cx - R * 0.48, cap_y - board_h * 0.15, cx + R * 0.48, cap_y + board_h * 1.9],
                 fill=(58, 40, 94))
    draw.line([(cx, cap_y + board_h * 1.5), (cx + R * 0.5, cap_y + R * 0.62)],
               fill=GOLD, width=int(4 * S))
    draw.ellipse([cx + R * 0.5 - 9 * S, cap_y + R * 0.62 - 9 * S,
                  cx + R * 0.5 + 9 * S, cap_y + R * 0.62 + 9 * S], fill=GOLD)

    star(draw, cx - R * 1.35, cy - R * 0.75, 15 * S, (*GOLD, 255), points=4)
    star(draw, cx + R * 1.5, cy - R * 0.15, 10 * S, (*CREAM, 255), points=4)
    star(draw, cx - R * 1.55, cy + R * 0.55, 8 * S, (*LILAC, 255), points=4)

    img = base.resize((W, H), Image.LANCZOS)
    img.convert("RGB").save(f"{OUT}/hero-studying-cat.png")
    print("hero saved")


# =========================================================================
# 2) SEAMLESS BACKGROUND PATTERN — faint paw prints + stars, purple tones
# =========================================================================
def build_pattern_tile():
    T = 240
    S = SS
    cell = T * S
    big = cell * 3
    canvas = Image.new("RGB", (big, big), PANEL)
    overlay = Image.new("RGBA", (big, big), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay, "RGBA")

    rnd = random.Random(11)
    motifs = []
    for _ in range(5):
        motifs.append(dict(
            kind="paw",
            x=rnd.uniform(0.08, 0.92), y=rnd.uniform(0.08, 0.92),
            scale=rnd.uniform(0.55, 0.85), ang=rnd.uniform(0, math.pi * 2),
            op=rnd.randint(14, 24),
        ))
    for _ in range(6):
        motifs.append(dict(
            kind="star",
            x=rnd.uniform(0.05, 0.95), y=rnd.uniform(0.05, 0.95),
            scale=rnd.uniform(0.5, 1.0), ang=0,
            op=rnd.randint(30, 55),
        ))

    for gx in range(3):
        for gy in range(3):
            ox, oy = gx * cell, gy * cell
            for m in motifs:
                x, y = ox + m["x"] * cell, oy + m["y"] * cell
                if m["kind"] == "paw":
                    paw_print(draw, x, y, 1.5 * S * m["scale"], (255, 255, 255, m["op"]), angle=m["ang"])
                else:
                    star(draw, x, y, 6 * S * m["scale"], (*LILAC, m["op"]), points=4)

    canvas = canvas.convert("RGBA")
    canvas = Image.alpha_composite(canvas, overlay)
    x0 = y0 = cell
    tile = canvas.crop((x0, y0, x0 + cell, y0 + cell)).resize((T, T), Image.LANCZOS)
    tile.convert("RGB").save(f"{OUT}/bg-pattern-tile.png")

    preview = Image.new("RGB", (T * 4, T * 4))
    for i in range(4):
        for j in range(4):
            preview.paste(tile, (i * T, j * T))
    preview.save(f"{OUT}/bg-pattern-preview.png")
    print("pattern saved")


# =========================================================================
# 3) PAW-PRINT LOADING SPINNER (GIF, real transparency)
# =========================================================================
def build_spinner():
    N = 96
    S = SS
    n_frames = 16
    bg_key = (255, 0, 254)  # magic color -> becomes the transparent index

    # draw one crisp paw icon on a supersampled transparent canvas
    icon_size = N * S
    icon = Image.new("RGBA", (icon_size, icon_size), (0, 0, 0, 0))
    idraw = ImageDraw.Draw(icon, "RGBA")
    paw_print(idraw, icon_size / 2, icon_size / 2, 2.6 * S, (*VIOLET, 255), angle=0)
    icon = icon.resize((N, N), Image.LANCZOS)

    # fixed index palette shared by every frame: index 0 = transparent,
    # index (1+f) = that frame's tint. No quantization -> no per-frame drift.
    tints = [lerp(PURPLE, PINK, f / n_frames) for f in range(n_frames)]
    flat_palette = list(bg_key)
    for t in tints:
        flat_palette += list(t)
    flat_palette += [0, 0, 0] * (256 - (1 + n_frames))

    imgs = []
    for f in range(n_frames):
        ang = 360 * f / n_frames
        rot = icon.rotate(-ang, resample=Image.BICUBIC, expand=False)
        a = rot.split()[3]
        a = a.point(lambda p: 255 if p > 120 else 0)  # hard edge -> crisp cutout, no halo

        idx = Image.new("L", (N, N), 0)
        idx.paste(1 + f, (0, 0), a)
        p_img = Image.new("P", (N, N))
        p_img.putdata(list(idx.getdata()))
        p_img.putpalette(flat_palette)
        imgs.append(p_img)

    imgs[0].save(
        f"{OUT}/paw-spinner.gif",
        save_all=True,
        append_images=imgs[1:],
        duration=60,
        loop=0,
        disposal=2,
        transparency=0,
    )
    print("spinner saved")


if __name__ == "__main__":
    build_hero()
    build_pattern_tile()
    build_spinner()
