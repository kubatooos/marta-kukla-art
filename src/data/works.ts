import fs from 'node:fs';
import path from 'node:path';

export type Accent = 'pink' | 'acid' | 'turquoise';
export type Status = 'available' | 'sold';

export interface Work {
  slug: string;
  title: { pl: string; en: string };
  year: number;
  dimensions: string; // cm
  materials: { pl: string; en: string };
  description: { pl: string; en: string };
  price: number;
  currency: 'PLN' | 'EUR';
  accent: Accent;
  status: Status; // 'sold' pokazuje plakietkę i zamienia cenę na "Sprzedane"
  featuredOrder: number | null; // pozycja na stronie głównej; null = nie pokazuj
  sortOrder: number | null; // ręczna pozycja w katalogu; null = naturalna kolejność z arkusza
  images: string[]; // every shot found on disk for this slug, in order
}

type WorkMeta = Omit<Work, 'images'>;

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp']);

/**
 * Reads /public/images/{slug}/ from disk at build time and returns every
 * image file found, sorted numerically (1.jpg, 2.jpg, ..., 10.jpg — not
 * "1, 10, 2" like a plain string sort would give). Returns [] if the
 * folder doesn't exist or is empty — that's how a work gets excluded
 * from the catalogue below.
 */
function readShots(slug: string): string[] {
  const dir = path.join(process.cwd(), 'public', 'images', slug);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((file) => IMAGE_EXTENSIONS.has(path.extname(file).toLowerCase()))
    .sort((a, b) => {
      const na = parseInt(a, 10);
      const nb = parseInt(b, 10);
      if (!Number.isNaN(na) && !Number.isNaN(nb)) return na - nb;
      return a.localeCompare(b);
    })
    .map((file) => `/images/${slug}/${file}`);
}

/**
 * Minimalny, ale poprawny parser CSV (RFC4180): obsługuje pola w cudzysłowie
 * z przecinkami/nowymi liniami w środku oraz podwójne cudzysłowy jako escape
 * ("" -> "). Świadomie bez zewnętrznej zależności.
 */
function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;
  let i = 0;

  while (i < text.length) {
    const char = text[i];

    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 2;
        } else {
          inQuotes = false;
          i += 1;
        }
      } else {
        field += char;
        i += 1;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
      i += 1;
    } else if (char === ',') {
      row.push(field);
      field = '';
      i += 1;
    } else if (char === '\r') {
      i += 1; // skip, \n handles the row break
    } else if (char === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
      i += 1;
    } else {
      field += char;
      i += 1;
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows.filter((r) => !(r.length === 1 && r[0] === ''));
}

function rowsToWorkMeta(rows: string[][]): WorkMeta[] {
  const header = rows[0].map((h) => h.trim());
  const dataRows = rows.slice(1);

  return dataRows
    .filter((cols) => cols.some((c) => c.trim() !== '')) // pomiń puste wiersze
    .map((cols) => {
      const rec: Record<string, string> = {};
      header.forEach((h, idx) => {
        rec[h] = (cols[idx] ?? '').trim();
      });

      return {
        slug: rec.slug,
        title: { pl: rec.title_pl, en: rec.title_en },
        year: parseInt(rec.year, 10),
        dimensions: rec.dimensions,
        materials: { pl: rec.materials_pl, en: rec.materials_en },
        description: { pl: rec.description_pl, en: rec.description_en },
        price: parseInt(rec.price, 10),
        currency: rec.currency === 'EUR' ? 'EUR' : 'PLN',
        accent: (rec.accent as Accent) || 'turquoise',
        status: rec.status === 'sold' ? 'sold' : 'available',
        featuredOrder: rec.featured_order ? parseInt(rec.featured_order, 10) : null,
        sortOrder: rec.sort_order ? parseInt(rec.sort_order, 10) : null,
      };
    });
}

const LOCAL_CSV_PATH = path.join(process.cwd(), 'src', 'data', 'works.csv');

/**
 * Źródło danych katalogu — z priorytetem:
 *
 * 1. Jeśli w środowisku builda jest ustawiona zmienna WORKS_CSV_URL
 *    (link do arkusza Google opublikowanego jako CSV), pobiera dane stamtąd.
 *    To pozwala edytować katalog z telefonu w Google Sheets, bez gita.
 * 2. Jeśli zmiennej nie ma, albo pobranie się nie uda (np. arkusz chwilowo
 *    niedostępny), używa lokalnego src/data/works.csv jako bezpiecznego
 *    fallbacku — strona nigdy się nie wywali z powodu problemów z siecią
 *    podczas builda.
 *
 * Log w terminalu builda zawsze mówi, które źródło faktycznie zostało użyte.
 */
async function readWorksCSV(): Promise<WorkMeta[]> {
  const remoteUrl = process.env.WORKS_CSV_URL;

  if (remoteUrl) {
    try {
      const res = await fetch(remoteUrl);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      console.log(`[works] Dane katalogu wczytane z Google Sheets (WORKS_CSV_URL).`);
      return rowsToWorkMeta(parseCSV(text));
    } catch (err) {
      console.warn(
        `[works] Nie udało się pobrać danych z WORKS_CSV_URL (${remoteUrl}). Używam lokalnego src/data/works.csv jako fallback. Błąd:`,
        err,
      );
    }
  }

  const text = fs.readFileSync(LOCAL_CSV_PATH, 'utf-8');
  console.log(`[works] Dane katalogu wczytane z lokalnego src/data/works.csv.`);
  return rowsToWorkMeta(parseCSV(text));
}

const worksMeta: WorkMeta[] = await readWorksCSV();

// Dołącz zdjęcia z dysku, odrzuć prace bez zdjęć, i posortuj:
// prace z ustawionym sort_order idą pierwsze (rosnąco wg numeru),
// reszta zostaje w naturalnej kolejności z arkusza/CSV (sort jest stabilny).
export const works: Work[] = worksMeta
  .map((meta) => ({ ...meta, images: readShots(meta.slug) }))
  .filter((work) => work.images.length > 0)
  .sort((a, b) => {
    if (a.sortOrder !== null && b.sortOrder !== null) return a.sortOrder - b.sortOrder;
    if (a.sortOrder !== null) return -1;
    if (b.sortOrder !== null) return 1;
    return 0;
  });

// Prace do sekcji "Wybrane prace" na stronie głównej — sterowane kolumną
// featured_order w CSV (puste = pomiń, liczba = pokaż w tej kolejności).
export const featuredWorks: Work[] = works
  .filter((w) => w.featuredOrder !== null)
  .sort((a, b) => (a.featuredOrder as number) - (b.featuredOrder as number));

// Krótki log w terminalu podczas builda — łatwo sprawdzić, które prace
// zostały pominięte z braku zdjęć.
if (process.env.NODE_ENV !== 'test') {
  const skipped = worksMeta.filter((m) => !works.some((w) => w.slug === m.slug));
  console.log(`[works] ${works.length}/${worksMeta.length} prac ma zdjęcia i pojawi się w katalogu.`);
  if (skipped.length) {
    console.log(`[works] Pominięto (brak plików w public/images/{slug}/): ${skipped.map((m) => m.slug).join(', ')}`);
  }
  console.log(`[works] Wyróżnione na stronie głównej: ${featuredWorks.map((w) => w.slug).join(', ') || '(brak)'}`);
}
