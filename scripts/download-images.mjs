// Downloads every photo the site uses into public/images and writes the manifest.
// Usage (from the project root): node scripts/download-images.mjs .
// Re-run after adding a new Unsplash id; existing files are skipped.
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.argv[2];
if (!ROOT) throw new Error('pass project root');
const APP = path.join(ROOT, 'src', 'app');
const OUT_PHOTOS = path.join(ROOT, 'public', 'images', 'photos');
const OUT_PRODUCTS = path.join(ROOT, 'public', 'images', 'products');
fs.mkdirSync(OUT_PHOTOS, { recursive: true });
fs.mkdirSync(OUT_PRODUCTS, { recursive: true });

// Ratio buckets (width / height). Keep in sync with media.ts.
const BUCKETS = { r9x16: 9 / 16, r2x3: 2 / 3, r4x5: 4 / 5, r1x1: 1, r5x4: 5 / 4, r4x3: 4 / 3, r3x2: 3 / 2, r16x9: 16 / 9, r12x5: 12 / 5 };
const LONG = 1200;
const bucketOf = (ratio) =>
  Object.entries(BUCKETS).reduce((best, [k, v]) =>
    Math.abs(Math.log(v / ratio)) < Math.abs(Math.log(BUCKETS[best] / ratio)) ? k : best, 'r1x1');
const dims = (ratio) => (ratio >= 1 ? [LONG, Math.round(LONG / ratio)] : [Math.round(LONG * ratio), LONG]);

const POOL = ['16', '24', '48', '56', '64', '89', '158', '174', '182', '225', '234', '242', '287', '295', '348', '381', '398', '406',
  '424', '441', '493', '509', '517', '525', '550', '575', '659', '676', '692', '701', '737', '755', '835', '870', '940', '948'];

// ---- 1. Static scan for unsplash() usage --------------------------------------------------------
const media = fs.readFileSync(path.join(APP, 'shared', 'media.ts'), 'utf8');
const PRODUCT_PHOTOS = Object.fromEntries([...media.matchAll(/^\s+(\w+): '([^']+)',/gm)].map((m) => [m[1], m[2]]));

const files = [];
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).forEach((e) => {
  const p = path.join(d, e.name);
  if (e.isDirectory()) walk(p); else if (p.endsWith('.ts')) files.push(p);
});
walk(path.join(APP, 'pages'));

const wanted = new Map(); // unsplash id (may include ?params) -> Set(bucket)
const want = (id, b) => { if (!wanted.has(id)) wanted.set(id, new Set(['natural'])); if (b) wanted.get(id).add(b); };
Object.values(PRODUCT_PHOTOS).forEach((id) => want(id));
for (const f of files) {
  const src = fs.readFileSync(f, 'utf8');
  const literals = [...src.matchAll(/'(photo-\d{10,13}-[0-9a-f]{12}[^']*)'/g)].map((m) => m[1]);
  const aliasIds = [...src.matchAll(/\b(?:PRODUCT_PHOTOS|P)\.(\w+)/g)].map((m) => PRODUCT_PHOTOS[m[1]]).filter(Boolean);
  literals.forEach((id) => want(id));
  for (const m of src.matchAll(/unsplash\(\s*([^,()]+?)\s*,\s*([^,()]+?)\s*(?:,\s*([^,()]+?)\s*)?\)/g)) {
    const [, arg, w, h] = m;
    const b = h && /^\d+$/.test(w) && /^\d+$/.test(h) ? bucketOf(+w / +h) : null;
    let ids = [];
    const alias = arg.match(/^(?:PRODUCT_PHOTOS|P)\.(\w+)$/);
    if (alias) ids = [PRODUCT_PHOTOS[alias[1]]];
    else if (/^'photo-/.test(arg)) ids = [arg.slice(1, -1)];
    else ids = [...new Set([...literals, ...aliasIds])]; // variable arg: any id this file mentions
    ids.filter(Boolean).forEach((id) => want(id, b));
  }
}

// ---- 2. Download helpers -----------------------------------------------------------------------
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function download(url, dest) {
  if (fs.existsSync(dest) && fs.statSync(dest).size > 1000) return 'cached';
  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      const res = await fetch(url, { redirect: 'follow' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const type = res.headers.get('content-type') || '';
      if (!type.startsWith('image/')) throw new Error(`not an image: ${type}`);
      fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
      return 'ok';
    } catch (e) {
      if (attempt === 4) throw new Error(`${url}: ${e.message}`);
      await sleep(600 * attempt);
    }
  }
}
async function runPool(jobs, size = 8) {
  const errors = [];
  let i = 0, done = 0;
  await Promise.all(Array.from({ length: size }, async () => {
    while (i < jobs.length) {
      const job = jobs[i++];
      try { await job(); } catch (e) { errors.push(e.message); }
      if (++done % 50 === 0) console.log(`  ${done}/${jobs.length}`);
    }
  }));
  return errors;
}
const slug = (id) => {
  const base = id.split('?')[0];
  return id.includes('?') ? `${base}-${id.split('?')[1].replace(/[^a-z0-9]+/gi, '').slice(0, 16)}` : base;
};

// ---- 3. Jobs -------------------------------------------------------------------------------------
const jobs = [];
for (const pid of POOL) for (const [b, r] of Object.entries(BUCKETS)) {
  const [w, h] = dims(r);
  jobs.push(() => download(`https://picsum.photos/id/${pid}/${w}/${h}.webp`, path.join(OUT_PHOTOS, `p${pid}-${b}.webp`)));
}
const products = {};
for (const [id, set] of wanted) {
  const [base, params] = id.split('?');
  const key = slug(id);
  products[id] = { file: key, buckets: [...set].filter((b) => b !== 'natural') };
  for (const b of set) {
    let url = `https://images.unsplash.com/${base}?fm=webp&q=78${params ? `&${params}` : ''}`;
    if (b === 'natural') url += `&w=${LONG}`;
    else { const [w, h] = dims(BUCKETS[b]); url += `&fit=crop&crop=entropy&w=${w}&h=${h}`; }
    jobs.push(() => download(url, path.join(OUT_PRODUCTS, `${key}-${b}.webp`)));
  }
}

console.log(`Downloading ${jobs.length} files (${POOL.length} pool photos x ${Object.keys(BUCKETS).length} shapes, ${wanted.size} unsplash ids)…`);
const errors = await runPool(jobs);

// Natural ratio for each product photo, read from the WebP header (VP8/VP8L/VP8X).
function webpSize(file) {
  const b = fs.readFileSync(file);
  const chunk = b.toString('ascii', 12, 16);
  if (chunk === 'VP8X') return [1 + b.readUIntLE(24, 3), 1 + b.readUIntLE(27, 3)];
  if (chunk === 'VP8 ') return [b.readUInt16LE(26) & 0x3fff, b.readUInt16LE(28) & 0x3fff];
  if (chunk === 'VP8L') { const n = b.readUInt32LE(21); return [1 + (n & 0x3fff), 1 + ((n >> 14) & 0x3fff)]; }
  return null;
}
for (const [id, p] of Object.entries(products)) {
  const f = path.join(OUT_PRODUCTS, `${p.file}-natural.webp`);
  const s = fs.existsSync(f) ? webpSize(f) : null;
  p.ratio = s ? +(s[0] / s[1]).toFixed(4) : 1;
}

// ---- 4. Manifest + credits -------------------------------------------------------------------------
const list = JSON.parse(fs.readFileSync(new URL('./picsum-list.json', import.meta.url)));
const credits = POOL.map((id) => list.find((x) => x.id === id)).filter(Boolean);
const manifest = `// GENERATED by download-images.mjs — local copies of every photo used on the site.
// Files live in /public/images; see /public/images/CREDITS.md for photographers.

/** Picsum photo ids available in every ratio bucket under images/photos/p<id>-<bucket>.webp */
export const PHOTO_POOL: readonly string[] = ${JSON.stringify(POOL)};

/** Unsplash photos under images/products/<file>-<bucket>.webp (plus "-natural"). */
export const PRODUCT_IMAGES: Readonly<Record<string, { file: string; ratio: number; buckets: string[] }>> = ${JSON.stringify(products, null, 2)};
`;
fs.writeFileSync(path.join(APP, 'shared', 'image-manifest.ts'), manifest);
fs.writeFileSync(path.join(ROOT, 'public', 'images', 'CREDITS.md'),
  `# Photo credits\n\nAll photos are from Unsplash, downloaded via Picsum (scene photos) and the Unsplash CDN (product photos), and used under the Unsplash License.\n\n## Scene photos (images/photos)\n\n${credits.map((c) => `- p${c.id}: ${c.author} (${c.url})`).join('\n')}\n\n## Product photos (images/products)\n\nUnsplash CDN ids (https://images.unsplash.com/<id>):\n\n${Object.keys(products).map((id) => `- ${id.split('?')[0]}`).join('\n')}\n`);

const bytes = (d) => fs.readdirSync(d).reduce((s, f) => s + fs.statSync(path.join(d, f)).size, 0);
console.log(JSON.stringify({ errors, photos: fs.readdirSync(OUT_PHOTOS).length, products: fs.readdirSync(OUT_PRODUCTS).length,
  mb: +((bytes(OUT_PHOTOS) + bytes(OUT_PRODUCTS)) / 1048576).toFixed(1) }, null, 1));
