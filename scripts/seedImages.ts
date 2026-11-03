// Erzeugt eigene Illustrationen als SVG (keine Fremdbilder, keine Rechte Dritter).
export type ImageKind = "candles" | "line" | "chain" | "bars" | "rings" | "shield" | "coins" | "document";

const W = 1200;
const H = 675;
const BG = "#1b1a18";
const SURFACE = "#121110";
const LINE = "#34312c";
const AMBER = "#f2b01e";
const CYAN = "#3fc5dc";
const UP = "#7ccf9e";
const DOWN = "#f27d68";
const INK = "#ece7dc";

const hash = (s: string) => {
  let h = 1779033703 ^ s.length;
  for (let i = 0; i < s.length; i++) {
    h = Math.imul(h ^ s.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return h >>> 0;
};

// kleiner, deterministischer Zufallsgenerator
const rng = (seed: string) => {
  let a = hash(seed);
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const frame = (inner: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-hidden="true">` +
  `<rect width="${W}" height="${H}" fill="${BG}"/>` +
  `<rect x="40" y="40" width="${W - 80}" height="${H - 80}" rx="12" fill="${SURFACE}" stroke="${LINE}" stroke-width="2"/>` +
  gridLines() +
  inner +
  `</svg>`;

const gridLines = () => {
  let g = "";
  for (let i = 1; i < 6; i++) {
    const y = 40 + ((H - 80) / 6) * i;
    g += `<line x1="40" y1="${y.toFixed(1)}" x2="${W - 40}" y2="${y.toFixed(1)}" stroke="${LINE}" stroke-width="1" opacity="0.55"/>`;
  }
  return g;
};

const candles = (r: () => number) => {
  let price = 330 + r() * 60;
  let out = "";
  const n = 30;
  const step = (W - 160) / n;
  for (let i = 0; i < n; i++) {
    const open = price;
    price += (r() - 0.46) * 46;
    price = Math.max(150, Math.min(520, price));
    const close = price;
    const hi = Math.min(open, close) - r() * 26;
    const lo = Math.max(open, close) + r() * 26;
    const x = 90 + i * step + step / 2;
    const col = close <= open ? UP : DOWN;
    out += `<line x1="${x.toFixed(1)}" y1="${hi.toFixed(1)}" x2="${x.toFixed(1)}" y2="${lo.toFixed(1)}" stroke="${col}" stroke-width="3"/>`;
    out += `<rect x="${(x - step * 0.3).toFixed(1)}" y="${Math.min(open, close).toFixed(1)}" width="${(step * 0.6).toFixed(1)}" height="${Math.max(6, Math.abs(close - open)).toFixed(1)}" rx="2" fill="${col}"/>`;
  }
  out += `<line x1="80" y1="${price.toFixed(1)}" x2="${W - 80}" y2="${price.toFixed(1)}" stroke="${AMBER}" stroke-width="2" stroke-dasharray="10 8"/>`;
  return out;
};

const linePath = (pts: [number, number][]) => pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");

const line = (r: () => number) => {
  const n = 48;
  const pts: [number, number][] = [];
  let y = 400;
  for (let i = 0; i < n; i++) {
    y += (r() - 0.5) * 60 - 4;
    y = Math.max(160, Math.min(500, y));
    pts.push([90 + (i * (W - 180)) / (n - 1), y]);
  }
  const avg: [number, number][] = pts.map((p, i) => {
    const from = Math.max(0, i - 6);
    const slice = pts.slice(from, i + 1);
    return [p[0], slice.reduce((s, q) => s + q[1], 0) / slice.length];
  });
  const area = `${linePath(pts)} L${pts[n - 1][0]} ${H - 70} L${pts[0][0]} ${H - 70} Z`;
  return (
    `<path d="${area}" fill="${AMBER}" opacity="0.12"/>` +
    `<path d="${linePath(pts)}" fill="none" stroke="${AMBER}" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/>` +
    `<path d="${linePath(avg)}" fill="none" stroke="${CYAN}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="2 10"/>`
  );
};

const chain = (r: () => number) => {
  let out = "";
  const rows = 3;
  const cols = 5;
  const bw = 150;
  const bh = 96;
  const gx = (W - 160 - cols * bw) / (cols - 1);
  for (let row = 0; row < rows; row++) {
    const y = 130 + row * 150;
    for (let c = 0; c < cols; c++) {
      const x = 80 + c * (bw + gx);
      const hot = row === 0 && c === 0;
      out += `<rect x="${x.toFixed(1)}" y="${y}" width="${bw}" height="${bh}" rx="10" fill="${hot ? AMBER : "#242220"}" stroke="${hot ? AMBER : LINE}" stroke-width="2"/>`;
      out += `<line x1="${x + 24}" y1="${y + 34}" x2="${x + bw - 24}" y2="${y + 34}" stroke="${hot ? BG : LINE}" stroke-width="5" stroke-linecap="round"/>`;
      out += `<line x1="${x + 24}" y1="${y + 58}" x2="${x + 24 + (bw - 48) * (0.4 + r() * 0.5)}" y2="${y + 58}" stroke="${hot ? BG : CYAN}" stroke-width="5" stroke-linecap="round" opacity="${hot ? 0.8 : 0.7}"/>`;
      if (c < cols - 1) {
        out += `<line x1="${(x + bw).toFixed(1)}" y1="${y + bh / 2}" x2="${(x + bw + gx).toFixed(1)}" y2="${y + bh / 2}" stroke="${AMBER}" stroke-width="4"/>`;
      }
    }
  }
  return out;
};

const bars = (r: () => number) => {
  let out = "";
  const n = 26;
  const step = (W - 180) / n;
  for (let i = 0; i < n; i++) {
    const h = 60 + r() * 280;
    const x = 90 + i * step;
    const col = r() > 0.5 ? UP : DOWN;
    out += `<rect x="${x.toFixed(1)}" y="${(H - 80 - h).toFixed(1)}" width="${(step * 0.62).toFixed(1)}" height="${h.toFixed(1)}" rx="3" fill="${col}" opacity="0.85"/>`;
  }
  const pts: [number, number][] = [];
  let y = 300;
  for (let i = 0; i < 24; i++) {
    y += (r() - 0.5) * 50;
    y = Math.max(150, Math.min(380, y));
    pts.push([100 + (i * (W - 200)) / 23, y]);
  }
  out += `<path d="${linePath(pts)}" fill="none" stroke="${AMBER}" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/>`;
  return out;
};

const arc = (cx: number, cy: number, rad: number, a0: number, a1: number) => {
  const p = (a: number) => [cx + rad * Math.cos(a), cy + rad * Math.sin(a)];
  const [x0, y0] = p(a0);
  const [x1, y1] = p(a1);
  return `M${x0.toFixed(1)} ${y0.toFixed(1)} A${rad} ${rad} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`;
};

const rings = (r: () => number) => {
  const cx = W / 2;
  const cy = H / 2;
  const cols = [AMBER, CYAN, UP, DOWN];
  let out = "";
  [210, 160, 110].forEach((rad, i) => {
    out += `<circle cx="${cx}" cy="${cy}" r="${rad}" fill="none" stroke="${LINE}" stroke-width="26"/>`;
    let a = -Math.PI / 2;
    const parts = [0.4 + r() * 0.2, 0.2 + r() * 0.15, 0.1 + r() * 0.1];
    parts.forEach((p, k) => {
      const a1 = a + p * Math.PI * 2;
      out += `<path d="${arc(cx, cy, rad, a, a1 - 0.05)}" fill="none" stroke="${cols[(i + k) % cols.length]}" stroke-width="26" stroke-linecap="round"/>`;
      a = a1;
    });
  });
  out += `<circle cx="${cx}" cy="${cy}" r="48" fill="${AMBER}"/>`;
  return out;
};

const shield = () => {
  const cx = W / 2;
  const top = 120;
  return (
    `<path d="M${cx} ${top} L${cx + 190} ${top + 70} L${cx + 190} ${top + 250} C${cx + 190} ${top + 360} ${cx + 80} ${top + 410} ${cx} ${top + 440} C${cx - 80} ${top + 410} ${cx - 190} ${top + 360} ${cx - 190} ${top + 250} L${cx - 190} ${top + 70} Z" fill="#242220" stroke="${AMBER}" stroke-width="6" stroke-linejoin="round"/>` +
    `<circle cx="${cx}" cy="${top + 220}" r="46" fill="none" stroke="${AMBER}" stroke-width="12"/>` +
    `<rect x="${cx - 60}" y="${top + 230}" width="120" height="96" rx="14" fill="${AMBER}"/>` +
    `<rect x="${cx - 8}" y="${top + 262}" width="16" height="36" rx="6" fill="${BG}"/>` +
    `<line x1="120" y1="${top + 120}" x2="${cx - 230}" y2="${top + 120}" stroke="${CYAN}" stroke-width="4" stroke-linecap="round" opacity="0.6"/>` +
    `<line x1="${cx + 230}" y1="${top + 320}" x2="${W - 120}" y2="${top + 320}" stroke="${CYAN}" stroke-width="4" stroke-linecap="round" opacity="0.6"/>`
  );
};

const coins = (r: () => number) => {
  let out = "";
  const spots: [number, number, number][] = [
    [380, 330, 150],
    [600, 260, 110],
    [790, 380, 130],
    [560, 440, 80],
    [270, 200, 60],
    [900, 210, 70],
  ];
  spots.forEach(([x, y, rad], i) => {
    const col = [AMBER, CYAN, UP, AMBER, DOWN, CYAN][i];
    out += `<circle cx="${x}" cy="${y}" r="${rad}" fill="${col}" opacity="${0.9 - i * 0.05}"/>`;
    out += `<circle cx="${x}" cy="${y}" r="${rad * 0.72}" fill="none" stroke="${BG}" stroke-width="${Math.max(4, rad * 0.08)}" opacity="0.55"/>`;
    out += `<line x1="${x - rad * 0.28}" y1="${y}" x2="${x + rad * 0.28}" y2="${y}" stroke="${BG}" stroke-width="${Math.max(5, rad * 0.1)}" stroke-linecap="round" opacity="0.55"/>`;
  });
  void r;
  return out;
};

const documentSheet = (r: () => number) => {
  const x = W / 2 - 190;
  let out = `<rect x="${x}" y="95" width="380" height="485" rx="14" fill="#242220" stroke="${LINE}" stroke-width="3"/>`;
  out += `<rect x="${x + 36}" y="135" width="140" height="22" rx="6" fill="${AMBER}"/>`;
  for (let i = 0; i < 9; i++) {
    const w = 120 + r() * 190;
    out += `<rect x="${x + 36}" y="${190 + i * 38}" width="${w.toFixed(0)}" height="12" rx="6" fill="${i % 4 === 3 ? CYAN : LINE}" opacity="${i % 4 === 3 ? 0.8 : 1}"/>`;
  }
  out += `<rect x="${x + 36}" y="${190 + 9 * 38 + 6}" width="120" height="34" rx="8" fill="none" stroke="${UP}" stroke-width="3"/>`;
  return out;
};

export const makeSvg = (kind: ImageKind, slug: string): string => {
  const r = rng(slug);
  switch (kind) {
    case "candles":
      return frame(candles(r));
    case "line":
      return frame(line(r));
    case "chain":
      return frame(chain(r));
    case "bars":
      return frame(bars(r));
    case "rings":
      return frame(rings(r));
    case "shield":
      return frame(shield());
    case "coins":
      return frame(coins(r));
    case "document":
      return frame(documentSheet(r));
  }
};

export const _ink = INK;
