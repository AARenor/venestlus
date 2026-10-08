#!/usr/bin/env python3
"""Generate PWA icons (192/512 png, apple-touch 180, maskable 512) without deps."""

from PIL import Image, ImageDraw
import os

OUT = os.path.join(os.path.dirname(__file__), "..", "public", "icons")
os.makedirs(OUT, exist_ok=True)


def lerp(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))


def make(size, maskable=False):
    # cobalt plate, white bridge, marigold cables — reads on light home screens
    top, bottom = (27, 72, 208), (16, 44, 150)
    img = Image.new("RGB", (size, size))
    d = ImageDraw.Draw(img)
    for y in range(size):
        d.line([(0, y), (size, y)], fill=lerp(top, bottom, y / size))

    s = size / 512.0
    pad = 0.10 * size if maskable else 0.0
    # bridge geometry: deck line, two towers, two cable arcs
    deck_y = int(0.62 * size)
    x0, x1 = int(0.16 * size + pad * 0.5), int(0.84 * size - pad * 0.5)
    tw1, tw2 = int(0.34 * size), int(0.66 * size)
    tower_top = int(0.30 * size)
    white = (255, 255, 255)
    accent = (245, 165, 36)
    w = max(2, int(14 * s))

    d.line([(x0, deck_y), (x1, deck_y)], fill=white, width=w)
    for tx in (tw1, tw2):
        d.line([(tx, tower_top), (tx, deck_y)], fill=white, width=w)
    # cables: quadratic-ish arcs approximated with arc segments
    d.arc(
        [
            tw1 - int(0.22 * size),
            deck_y - int(0.34 * size),
            tw1 + int(0.22 * size),
            deck_y + int(0.10 * size),
        ],
        start=200,
        end=340,
        fill=accent,
        width=w,
    )
    d.arc(
        [
            tw2 - int(0.22 * size),
            deck_y - int(0.34 * size),
            tw2 + int(0.22 * size),
            deck_y + int(0.10 * size),
        ],
        start=200,
        end=340,
        fill=accent,
        width=w,
    )
    d.line([(tw1, deck_y), (int(0.5 * size), int(0.47 * size))], fill=accent, width=w)
    d.line([(int(0.5 * size), int(0.47 * size)), (tw2, deck_y)], fill=accent, width=w)
    # people dots on the deck (both sides meeting in the middle)
    r = max(3, int(16 * s))
    for cx, col in (
        (0.26 * size, white),
        (0.74 * size, white),
        (0.42 * size, accent),
        (0.58 * size, accent),
    ):
        cy = deck_y - int(30 * s)
        d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=col)
    return img


for name, size, maskable in (
    ("icon-192.png", 192, False),
    ("icon-512.png", 512, False),
    ("icon-maskable-512.png", 512, True),
    ("apple-touch-icon.png", 180, False),
):
    make(size, maskable).save(os.path.join(OUT, name), "PNG")
    print("wrote", name, size)
