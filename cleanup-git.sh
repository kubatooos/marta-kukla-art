#!/usr/bin/env bash
# cleanup-git.sh
# Porządkuje repo marta-kukla-art: dodaje .gitignore, wypisuje node_modules/dist/.astro
# z gita, usuwa .DS_Store, i poprawia stare placeholdery mailto/tel na prawdziwy kontakt.
# Uruchom w GŁÓWNYM folderze projektu (tam gdzie package.json i .git).

set -euo pipefail

if [ ! -d ".git" ]; then
  echo "Błąd: nie widzę folderu .git w bieżącym katalogu."
  echo "Uruchom ten skrypt z głównego folderu projektu (cd marta-kukla-art)."
  exit 1
fi

echo "==> 1/5  Tworzę .gitignore"
cat > .gitignore << 'EOF'
# Dependencies
node_modules/

# Build output
dist/
.astro/

# Astro / Vite cache
.vite/

# Lockfiles — pick ONE package manager (this project uses npm).
pnpm-lock.yaml

# OS clutter
.DS_Store
Thumbs.db

# Env / local secrets
.env
.env.local
EOF

echo "==> 2/5  Wypisuję node_modules / dist / .astro / pnpm-lock.yaml z gita (pliki zostają na dysku)"
git rm -r --cached --ignore-unmatch node_modules dist .astro pnpm-lock.yaml > /dev/null

echo "==> 3/5  Usuwam .DS_Store z gita"
find . -name ".DS_Store" -not -path "./node_modules/*" -print0 | xargs -0 -I{} git rm --cached --ignore-unmatch "{}" > /dev/null 2>&1 || true

echo "==> 4/5  Poprawiam linki mailto/tel na prawdziwy kontakt (mkukla.art@gmail.com, +48 793 780 603)"
if [ -f "src/components/Header.astro" ]; then
  perl -i -pe 's/mailto:kontakt\@martakukla\.pl/mailto:mkukla.art\@gmail.com/g' src/components/Header.astro
  perl -i -pe 's/mkuklaart\@gmail\.com/mkukla.art\@gmail.com/g' src/components/Header.astro
  perl -i -pe 's/tel:\+48000000000/tel:+48793780603/g' src/components/Header.astro
else
  echo "    (pominięto: src/components/Header.astro nie znaleziony)"
fi

if [ -f "src/pages/kontakt.astro" ]; then
  perl -i -pe 's/mailto:kontakt\@martakukla\.pl/mailto:mkukla.art\@gmail.com/g' src/pages/kontakt.astro
else
  echo "    (pominięto: src/pages/kontakt.astro nie znaleziony)"
fi

echo "==> 5/5  Stage'uję zmiany"
git add .gitignore src/components/Header.astro src/pages/kontakt.astro 2>/dev/null || true

echo ""
echo "Gotowe. Podgląd zmian:"
echo "-----------------------------------"
git status --short | grep -v "^D  node_modules/" | grep -v "^D  \.astro/" || true
echo "-----------------------------------"
echo ""
echo "Jeśli wygląda dobrze, zacommituj i wypchnij ręcznie:"
echo "  git commit -m \"Porzadki: gitignore dla node_modules/dist, poprawka mailto/tel\""
echo "  git push"
