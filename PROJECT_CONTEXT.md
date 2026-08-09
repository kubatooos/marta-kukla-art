# Context & Architecture Rules: Marta Kukla Portfolio

## 1. Tech Stack (Stos Technologiczny)
- **Framework:** Astro 5 (SSG – Static Site Generation / statyczne generowanie stron)
- **Styling:** Tailwind CSS v3 + Zmienne CSS (`src/styles/global.css`)
- **Language:** TypeScript (`tsconfig.json`)
- **Package Manager:** pnpm

## 2. Directory Structure (Struktura Katalogów)
```text
WWW_MARTA_CLAUDE/
├── public/                     # Zasoby statyczne niepodlegające kompilacji
├── src/
│   ├── components/             # Komponenty UI (User Interface – interfejs użytkownika)
│   │   ├── CursorEffects.astro # Interaktywny kursor JS
│   │   ├── Header.astro        # Nawigacja i nagłówek
│   │   ├── Hero.astro          # Sekcja główna (Hero)
│   │   ├── Lightbox.astro      # Modal do powiększania obrazów
│   │   └── WorkCard.astro      # Karta pojedynczego obrazu
│   ├── data/
│   │   └── works.ts            # Baza danych prac (typowana lista obrazów)
│   ├── layouts/
│   │   └── Layout.astro        # Główny szablon HTML (Head, meta, style globalne)
│   ├── pages/                  # Routing oparty na plikach (File-based routing)
│   │   ├── index.astro         # Strona główna
│   │   ├── katalog.astro       # Galeria / Katalog prac
│   │   ├── kontakt.astro       # Strona kontaktowa
│   │   ├── o-mnie.astro        # Biografia / O artystce
│   │   └── wystawy.astro       # Lista wystaw
│   └── styles/
│       └── global.css          # Style globalne, dyrektywy Tailwinda
├── astro.config.mjs            # Konfiguracja Astro
├── tailwind.config.mjs         # Kolory (ivory, ivory-muted), fonty (serif/sans)
└── package.json