"""Build app/components/landDots.js for the chapter 04 Asia-Pacific globe.

Source: Natural Earth v4.1.0 1:50m Admin 0 countries (public domain), as
redistributed by world-atlas@2.0.2 (ISC, (c) Mike Bostock):

    npm pack world-atlas@2.0.2 && tar -xzf world-atlas-2.0.2.tgz
    python3 scripts/build-land-dots.py package/countries-50m.json app/components/landDots.js

Land is sampled on an equal-area 1.5 degree dot grid and run-length encoded per
latitude row. Rings that cross the 180 degree meridian are unwrapped before the
point-in-polygon test, so countries such as Russia, Fiji and New Zealand are
sampled correctly. Asia-Pacific countries too small to catch a grid point get
one dot on their largest island.
"""

import json
import math
import sys

STEP = 1.5
NROWS = int(180 / STEP)

# East, Southeast and South Asia, plus Oceania (UN M49), by ISO 3166-1 numeric.
APAC = {
    # East Asia
    "156", "392", "410", "408", "496", "158", "344", "446",
    # Southeast Asia
    "608", "704", "764", "458", "702", "360", "096", "116", "418", "104", "626",
    # South Asia
    "356", "050", "144", "524", "064", "586", "462",
    # Oceania: Australia, New Zealand, Melanesia, Micronesia, Polynesia
    "036", "554", "598", "242", "090", "548", "540",
    "316", "580", "296", "584", "583", "585", "520",
    "882", "776", "798", "570", "184", "258", "016", "876", "612", "574", "772",
}

# Hand-placed dots: APAC countries missing from the 1:50m data, and
# archipelagos whose largest island is far from where most people live.
# (name, lon, lat)
MANUAL = [
    ("Tuvalu", 179.2, -8.52),
    ("Kiribati", 172.98, 1.33),  # Tarawa, not Kiritimati
]

# No automatic fallback dot: uninhabited reefs, and countries placed by hand.
NO_FALLBACK = {"Ashmore and Cartier Is.", "Kiribati"}


def load(src):
    topo = json.load(open(src))
    sx, sy = topo["transform"]["scale"]
    tx, ty = topo["transform"]["translate"]
    arcs = []
    for arc in topo["arcs"]:
        x = y = 0
        pts = []
        for dx, dy in arc:
            x += dx
            y += dy
            pts.append((x * sx + tx, y * sy + ty))
        arcs.append(pts)

    def ring(idx):
        pts = []
        for i in idx:
            a = arcs[i] if i >= 0 else arcs[~i][::-1]
            pts.extend(a if not pts else a[1:])
        return pts

    countries = []
    for g in topo["objects"]["countries"]["geometries"]:
        if g["type"] == "Polygon":
            polys = [g["arcs"]]
        elif g["type"] == "MultiPolygon":
            polys = g["arcs"]
        else:
            continue
        rings = [prep_ring(ring(r)) for p in polys for r in p]
        countries.append({
            "id": g.get("id"),
            "name": g["properties"].get("name"),
            "rings": rings,
            "apac": g.get("id") in APAC,
        })
    return countries


def prep_ring(pts):
    """Unwrap longitudes so consecutive vertices never jump by more than 180.

    Rings that wind around a pole (Antarctica) keep their raw coordinates."""
    out = [pts[0]]
    for lon, lat in pts[1:]:
        prev = out[-1][0]
        while lon - prev > 180:
            lon -= 360
        while lon - prev < -180:
            lon += 360
        out.append((lon, lat))
    polar = abs(out[-1][0] - out[0][0]) > 180
    use = pts if polar else out
    xs = [p[0] for p in use]
    ys = [p[1] for p in use]
    area = 0.0
    for i in range(len(use) - 1):
        (x1, y1), (x2, y2) = use[i], use[i + 1]
        area += (x1 * y2 - x2 * y1) * math.cos(math.radians((y1 + y2) / 2))
    return {
        "pts": use,
        "shifts": (0,) if polar else (0, 360, -360),
        "bbox": (min(xs), min(ys), max(xs), max(ys)),
        "area": abs(area) / 2,
    }


def in_ring(lon, lat, r):
    pts = r["pts"]
    c = False
    j = len(pts) - 1
    for i in range(len(pts)):
        xi, yi = pts[i]
        xj, yj = pts[j]
        if (yi > lat) != (yj > lat) and lon < (xj - xi) * (lat - yi) / (yj - yi) + xi:
            c = not c
        j = i
    return c


def contains(country, lon, lat):
    inside = False
    for r in country["rings"]:
        b = r["bbox"]
        if not b[1] <= lat <= b[3]:
            continue
        for s in r["shifts"]:
            x = lon + s
            if b[0] <= x <= b[2] and in_ring(x, lat, r):
                inside = not inside  # even-odd across rings handles holes
                break
    return inside


def row_lat(r):
    return -90 + STEP / 2 + STEP * r


def row_count(lat):
    return max(1, int(math.floor(360 * math.cos(math.radians(lat)) / STEP + 0.5)))


def dot_lon(k, n):
    return -180 + (k + 0.5) * 360 / n


def nearest_cell(lon, lat):
    lon = ((lon + 180) % 360) - 180
    r = min(NROWS - 1, max(0, int((lat + 90) / STEP)))
    n = row_count(row_lat(r))
    k = int((lon + 180) / (360 / n)) % n
    return r, k


def main(src, out):
    countries = load(src)
    counts = [row_count(row_lat(r)) for r in range(NROWS)]
    grid = {}
    hits = {}
    for r in range(NROWS):
        lat = row_lat(r)
        for k in range(counts[r]):
            lon = dot_lon(k, counts[r])
            for c in countries:
                if contains(c, lon, lat):
                    grid[(r, k)] = 1 if c["apac"] else 0
                    hits[c["name"]] = hits.get(c["name"], 0) + 1
                    break

    added = []
    for c in countries:
        if not c["apac"] or c["name"] in NO_FALLBACK or hits.get(c["name"]):
            continue
        big = max(c["rings"], key=lambda r: r["area"])
        pts = big["pts"][:-1] or big["pts"]
        lon = sum(p[0] for p in pts) / len(pts)
        lat = sum(p[1] for p in pts) / len(pts)
        cell = nearest_cell(lon, lat)
        if grid.get(cell) != 1:
            grid[cell] = 1
            added.append(c["name"])
    known = {c["id"] for c in countries}
    for name, lon, lat in MANUAL:
        cell = nearest_cell(lon, lat)
        if grid.get(cell) != 1:
            grid[cell] = 1
            added.append(name)

    rows = []
    for r in range(NROWS):
        ks = sorted(k for (rr, k) in grid if rr == r)
        if not ks:
            continue
        row = [r, counts[r]]
        i = 0
        while i < len(ks):
            k0 = ks[i]
            f = grid[(r, k0)]
            n = 1
            while i + n < len(ks) and ks[i + n] == k0 + n and grid[(r, k0 + n)] == f:
                n += 1
            row += [k0, n, f]
            i += n
        rows.append(row)

    js = (
        "// Generated by scripts/build-land-dots.py from Natural Earth v4.1.0 1:50m\n"
        "// Admin 0 countries (public domain) via world-atlas@2.0.2 countries-50m.json\n"
        "// (ISC, (c) Mike Bostock). Land sampled on an equal-area 1.5° dot grid.\n"
        "// Each row: [rowIndex, dotsInRow, startDot, runLength, isAsiaPacific, ...].\n"
        "// Row r sits at latitude -90 + 0.75 + 1.5r; dot k at longitude\n"
        "// -180 + (k + 0.5) * 360 / dotsInRow.\n"
        "export const LAND_ROWS = " + json.dumps(rows, separators=(",", ":")) + ";\n"
    )
    open(out, "w").write(js)
    total = len(grid)
    apac = sum(grid.values())
    missing = sorted(i for i in APAC if i not in known)
    print(f"dots {total} apac {apac} rows {len(rows)} bytes {len(js)}")
    print("fallback/manual dots:", ", ".join(added))
    print("APAC ids not in source:", missing)


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
