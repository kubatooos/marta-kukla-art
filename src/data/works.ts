import fs from 'node:fs';
import path from 'node:path';

export type Accent = 'pink' | 'acid' | 'turquoise';

export interface Work {
  slug: string;
  title: { pl: string; en: string };
  year: number;
  dimensions: string; // cm
  materials: { pl: string; en: string };
  description: { pl: string; en: string };
  price: number; // PLN
  accent: Accent;
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

// Metadane 21 prac. Liczba zdjęć NIE jest tu ustalana — pobierana jest
// automatycznie z zawartości folderu public/images/{slug}/ (patrz readShots
// powyżej). Ile plików wrzucisz do folderu, tyle ujęć pokaże lightbox.
const worksMeta: WorkMeta[] = [
  {
    slug: 'cisza-przed-switem',
    title: { pl: 'Cisza przed świtem', en: 'Silence Before Dawn' },
    year: 2025,
    dimensions: '100 × 140 cm',
    materials: { pl: 'Olej na płótnie', en: 'Oil on canvas' },
    description: { pl: 'Warstwy błękitu i popiołu budują moment tuż przed pierwszym światłem.', en: 'Layers of blue and ash build the moment just before first light.' },
    price: 8200,
    accent: 'turquoise',
  },
  {
    slug: 'zapach-terpentyny',
    title: { pl: 'Zapach terpentyny', en: 'Scent of Turpentine' },
    year: 2024,
    dimensions: '80 × 100 cm',
    materials: { pl: 'Akryl, pigment, płótno', en: 'Acrylic, pigment, canvas' },
    description: { pl: 'Gęste, impastowe pociągnięcia pędzla zachowują ruch dłoni.', en: 'Dense, impasto strokes preserve the motion of the hand.' },
    price: 5400,
    accent: 'pink',
  },
  {
    slug: 'linia-horyzontu',
    title: { pl: 'Linia horyzontu', en: 'The Horizon Line' },
    year: 2024,
    dimensions: '120 × 90 cm',
    materials: { pl: 'Olej na płótnie', en: 'Oil on canvas' },
    description: { pl: 'Minimalna kompozycja szukająca granicy między wodą a niebem.', en: 'A minimal composition searching for the border between water and sky.' },
    price: 6900,
    accent: 'acid',
  },
  {
    slug: 'wewnetrzny-ogrod',
    title: { pl: 'Wewnętrzny ogród', en: 'Interior Garden' },
    year: 2023,
    dimensions: '150 × 100 cm',
    materials: { pl: 'Olej, złoty pigment, płótno', en: 'Oil, gold pigment, canvas' },
    description: { pl: 'Roślinne formy wynurzające się z ciemnego tła.', en: 'Botanical forms emerging from a dark ground.' },
    price: 11200,
    accent: 'turquoise',
  },
  {
    slug: 'echo',
    title: { pl: 'Echo', en: 'Echo' },
    year: 2025,
    dimensions: '60 × 60 cm',
    materials: { pl: 'Akryl na płótnie', en: 'Acrylic on canvas' },
    description: { pl: 'Powtarzający się gest jako sposób na zapamiętanie chwili.', en: 'A repeated gesture as a way of remembering a moment.' },
    price: 3600,
    accent: 'pink',
  },
  {
    slug: 'nokturn',
    title: { pl: 'Nokturn', en: 'Nocturne' },
    year: 2023,
    dimensions: '100 × 100 cm',
    materials: { pl: 'Olej na płótnie', en: 'Oil on canvas' },
    description: { pl: 'Granatowe tło przecięte pojedynczą smugą światła.', en: 'A deep navy ground cut by a single streak of light.' },
    price: 7300,
    accent: 'acid',
  },
  {
    slug: 'druga-strona',
    title: { pl: 'Druga strona', en: 'The Other Side' },
    year: 2025,
    dimensions: '90 × 120 cm',
    materials: { pl: 'Olej na płótnie', en: 'Oil on canvas' },
    description: { pl: 'Dwie płaszczyzny koloru spotykają się na jednej, niepewnej linii.', en: 'Two fields of colour meet along a single, uncertain line.' },
    price: 6200,
    accent: 'pink',
  },
  {
    slug: 'zimowy-sad',
    title: { pl: 'Zimowy sad', en: 'Winter Orchard' },
    year: 2022,
    dimensions: '70 × 90 cm',
    materials: { pl: 'Olej na płótnie', en: 'Oil on canvas' },
    description: { pl: 'Gałęzie jako rysunek na tle stłumionej bieli.', en: 'Branches as drawing against a muted white.' },
    price: 4800,
    accent: 'turquoise',
  },
  {
    slug: 'niedokonczona-rozmowa',
    title: { pl: 'Niedokończona rozmowa', en: 'Unfinished Conversation' },
    year: 2024,
    dimensions: '110 × 140 cm',
    materials: { pl: 'Akryl, olej, płótno', en: 'Acrylic, oil, canvas' },
    description: { pl: 'Dwie warstwy farby, które nigdy się nie dogadały do końca.', en: 'Two layers of paint that never quite agreed.' },
    price: 9100,
    accent: 'acid',
  },
  {
    slug: 'sol',
    title: { pl: 'Sól', en: 'Salt' },
    year: 2023,
    dimensions: '50 × 70 cm',
    materials: { pl: 'Akryl na płótnie', en: 'Acrylic on canvas' },
    description: { pl: 'Biała faktura budowana warstwa po warstwie.', en: 'A white texture built layer by layer.' },
    price: 2900,
    accent: 'pink',
  },
  {
    slug: 'droga-do-domu',
    title: { pl: 'Droga do domu', en: 'The Way Home' },
    year: 2022,
    dimensions: '100 × 80 cm',
    materials: { pl: 'Olej na płótnie', en: 'Oil on canvas' },
    description: { pl: 'Perspektywa zapamiętana, nie odwzorowana.', en: 'A perspective remembered, not reproduced.' },
    price: 6700,
    accent: 'turquoise',
  },
  {
    slug: 'wewnetrzne-morze',
    title: { pl: 'Wewnętrzne morze', en: 'Inner Sea' },
    year: 2025,
    dimensions: '130 × 160 cm',
    materials: { pl: 'Olej na płótnie', en: 'Oil on canvas' },
    description: { pl: 'Duży format, spokojny gest, powtarzalny rytm fali.', en: 'Large format, a calm gesture, the repeating rhythm of a wave.' },
    price: 13400,
    accent: 'acid',
  },
  {
    slug: 'popiol-i-zloto',
    title: { pl: 'Popiół i złoto', en: 'Ash and Gold' },
    year: 2023,
    dimensions: '90 × 90 cm',
    materials: { pl: 'Olej, złoty pigment, płótno', en: 'Oil, gold pigment, canvas' },
    description: { pl: 'Kontrast matowej szarości i pojedynczej złotej smugi.', en: 'A contrast of matte grey and a single streak of gold.' },
    price: 8900,
    accent: 'pink',
  },
  {
    slug: 'pierwszy-mroz',
    title: { pl: 'Pierwszy mróz', en: 'First Frost' },
    year: 2024,
    dimensions: '60 × 80 cm',
    materials: { pl: 'Akryl na płótnie', en: 'Acrylic on canvas' },
    description: { pl: 'Chłodna paleta i twarda, precyzyjna linia.', en: 'A cool palette and a hard, precise line.' },
    price: 4200,
    accent: 'turquoise',
  },
  {
    slug: 'oddech',
    title: { pl: 'Oddech', en: 'Breath' },
    year: 2025,
    dimensions: '80 × 60 cm',
    materials: { pl: 'Olej na płótnie', en: 'Oil on canvas' },
    description: { pl: 'Jeden gest pędzla powtórzony aż stał się rytmem.', en: 'One brush gesture repeated until it became a rhythm.' },
    price: 4700,
    accent: 'acid',
  },
  {
    slug: 'zapomniany-ogrod',
    title: { pl: 'Zapomniany ogród', en: 'Forgotten Garden' },
    year: 2022,
    dimensions: '120 × 100 cm',
    materials: { pl: 'Olej na płótnie', en: 'Oil on canvas' },
    description: { pl: 'Gęsta roślinność wynurzająca się z cienia.', en: 'Dense foliage emerging from shadow.' },
    price: 7800,
    accent: 'pink',
  },
  {
    slug: 'niebieska-godzina',
    title: { pl: 'Niebieska godzina', en: 'Blue Hour' },
    year: 2024,
    dimensions: '100 × 100 cm',
    materials: { pl: 'Olej na płótnie', en: 'Oil on canvas' },
    description: { pl: 'Moment między dniem a nocą złapany w jednym tonie.', en: 'The moment between day and night, caught in a single tone.' },
    price: 7100,
    accent: 'turquoise',
  },
  {
    slug: 'kruche',
    title: { pl: 'Kruche', en: 'Fragile' },
    year: 2023,
    dimensions: '50 × 50 cm',
    materials: { pl: 'Akryl na płótnie', en: 'Acrylic on canvas' },
    description: { pl: 'Mały format, delikatna, niemal przezroczysta warstwa farby.', en: 'A small format, a delicate, near-transparent layer of paint.' },
    price: 2400,
    accent: 'acid',
  },
  {
    slug: 'przystan',
    title: { pl: 'Przystań', en: 'Harbour' },
    year: 2025,
    dimensions: '110 × 90 cm',
    materials: { pl: 'Olej na płótnie', en: 'Oil on canvas' },
    description: { pl: 'Stonowana kompozycja budowana wokół pustego środka.', en: 'A muted composition built around an empty centre.' },
    price: 6500,
    accent: 'pink',
  },
  {
    slug: 'cien-lipca',
    title: { pl: 'Cień lipca', en: 'July Shadow' },
    year: 2022,
    dimensions: '90 × 70 cm',
    materials: { pl: 'Olej na płótnie', en: 'Oil on canvas' },
    description: { pl: 'Ciepłe światło filtrowane przez gęsty cień.', en: 'Warm light filtered through dense shadow.' },
    price: 5300,
    accent: 'turquoise',
  },
  {
    slug: 'ostatnie-swiatlo',
    title: { pl: 'Ostatnie światło', en: 'Last Light' },
    year: 2025,
    dimensions: '140 × 100 cm',
    materials: { pl: 'Olej na płótnie', en: 'Oil on canvas' },
    description: { pl: 'Duża, spokojna praca zamykająca cykl o świetle.', en: 'A large, quiet piece closing the cycle on light.' },
    price: 10800,
    accent: 'acid',
  },
];

// Dołącz zdjęcia z dysku i odrzuć prace, dla których nie znaleziono
// żadnego pliku — to jest jedyne miejsce, które decyduje, czy dana
// praca pojawi się w katalogu.
export const works: Work[] = worksMeta
  .map((meta) => ({ ...meta, images: readShots(meta.slug) }))
  .filter((work) => work.images.length > 0);

// Krótki log w terminalu podczas builda — łatwo sprawdzić, które prace
// zostały pominięte z braku zdjęć.
if (process.env.NODE_ENV !== 'test') {
  const skipped = worksMeta.filter((m) => !works.some((w) => w.slug === m.slug));
  console.log(`[works] ${works.length}/${worksMeta.length} prac ma zdjęcia i pojawi się w katalogu.`);
  if (skipped.length) {
    console.log(`[works] Pominięto (brak plików w public/images/{slug}/): ${skipped.map((m) => m.slug).join(', ')}`);
  }
}
