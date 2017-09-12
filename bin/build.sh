mkdir -p dist/chrome/ dist/firefox/

rsync -a --delete src/ dist/chrome/
rm dist/chrome/manifest.firefox.json

rsync -a --delete src/ dist/firefox/
mv dist/firefox/manifest.firefox.json dist/firefox/manifest.json
