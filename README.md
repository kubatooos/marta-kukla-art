# Marta Kukla — Portfolio

Astro 5 + Tailwind CSS + TypeScript. Static output, no client-side UI framework.

## Uruchomienie

```bash
npm install
npm run dev       # http://localhost:4321
npm run build      # -> dist/
```

## Co jest "zero-JS"

- **Menu pełnoekranowe** — checkbox hack (`<input type="checkbox">` + `<label>`), przełączanie stanu i animacja `hamburger → X` czystym CSS.
- **Przełącznik PL / ENG** — dwa radiobuttony na górze `<body>` + selektor `:has()` w CSS. Treść jest napisana dwukrotnie (`.pl` / `.en` spany), widoczność przełącza CSS.
- **Efekt neonowego podkreślenia (`brush-underline`)** — pojedynczy `background-size` transition, bez JS.
- **Lightbox (podgląd zdjęć obrazu)** — jedyny prawdziwy JS w projekcie (`src/components/Lightbox.astro`, ok. 50 linii, bez frameworka, bez hydratacji). Klik w miniaturę obrazu otwiera pełnoekranowy podgląd z możliwością przełączania kolejnych ujęć tej samej pracy (strzałki, kropki, klawiatura ←/→, Esc, klik w tło).

Poza tym jednym plikiem na stronie nie ma żadnego frameworka UI (React/Vue/Svelte) ani hydratowanych wysp.

## Zdjęcia

Projekt renderuje się w pełni bez zdjęć — tło hero i miniatury prac to malowane gradienty CSS w tej samej tonacji, żeby layout nie wyglądał na "zepsuty" bez assetów.

**Katalog prac — każdy obraz ma teraz własny folder z kilkoma ujęciami** (całość, detal, w aranżacji itp.):

```
public/images/
  cisza-przed-switem/
    1.jpg
    2.jpg
    3.jpg
  zapach-terpentyny/
    1.jpg
    2.jpg
    3.jpg
  ...
```

Nazwa folderu = `slug` danej pracy z `src/data/works.ts`. **Liczba zdjęć jest wykrywana automatycznie** — funkcja `readShots()` w `works.ts` skanuje folder przy każdym buildzie i bierze wszystkie znalezione pliki (`.jpg`, `.jpeg`, `.png`, `.webp`), posortowane numerycznie (`1, 2, ..., 10`, a nie leksykograficznie). Wrzucisz 2 zdjęcia — lightbox pokaże 2, wrzucisz 7 — pokaże 7.

**Prace bez zdjęć nie pojawiają się na stronie.** Jeśli folder `public/images/{slug}/` nie istnieje albo jest pusty, dana praca jest automatycznie pomijana — nie trafia ani do katalogu, ani na stronę główną, ani do licznika "X prac" (licznik liczy tylko prace, które faktycznie mają zdjęcia). Podczas builda w terminalu zobaczysz log typu:

```
[works] 6/21 prac ma zdjęcia i pojawi się w katalogu.
[works] Pominięto (brak plików w public/images/{slug}/): sol, kruche, ...
```

— to podpowiedź, którym pracom brakuje jeszcze zdjęć. Dopóki żaden folder nie ma plików, katalog i sekcja "Wybrane prace" na stronie głównej pokażą krótki komunikat zamiast pustej siatki.

Inne miejsca do podmiany:

- `src/components/Hero.astro` → podmień `<div class="hero-brush-fallback">` na `<img src="/images/hero-brush.jpg" ...>`
- `src/pages/o-mnie.astro` → podmień `<div class="portrait-placeholder">` na portret autorki

## Struktura

```
src/
  layouts/Layout.astro       – szkielet HTML, przełącznik języka, Header, footer
  components/
    Header.astro             – logo, PL/ENG, hamburger, overlay nawigacji
    Hero.astro                – sekcja hero strony głównej
    WorkCard.astro            – karta obrazu (katalog + strona główna)
  data/works.ts               – dane katalogu (typowane, PL/EN)
  pages/
    index.astro                – Home
    o-mnie.astro                – O mnie
    wystawy.astro               – Wystawy
    katalog.astro                – Katalog prac
    kontakt.astro                 – Kontakt
  styles/global.css            – fonty, tokeny, CSS dla i18n / menu / neonów
tailwind.config.mjs            – paleta graphite/ivory/neon, fonty, dropShadow
```

## Kontakt / formularz

Strona kontaktowa używa `mailto:` i `tel:`, bez backendu. Jeśli chcesz prawdziwy formularz
(z walidacją i wysyłką), będzie to wymagało endpointu (np. Resend, Formspree) i minimalnego
JS do obsługi `fetch` — świadomie pominięte, żeby zachować zero-JS.
