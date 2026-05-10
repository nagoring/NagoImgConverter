#!/bin/bash
set -e
cd "$(dirname "$0")"

# Clean up leftover temporary files from previous failed DMG builds
rm -f src-tauri/target/release/bundle/macos/rw.*.dmg
rm -f src-tauri/target/release/bundle/dmg/rw.*.dmg

npm run tauri -- build

# If tauri's DMG bundler failed, create DMG manually
DMG_PATH="src-tauri/target/release/bundle/dmg/NagoImgConverter_0.1.0_aarch64.dmg"
APP_PATH="src-tauri/target/release/bundle/macos/NagoImgConverter.app"

if [ ! -f "$DMG_PATH" ] && [ -d "$APP_PATH" ]; then
  echo "Creating DMG manually..."
  /opt/homebrew/bin/create-dmg \
    --volname "NagoImgConverter" \
    --volicon "$APP_PATH/Contents/Resources/icon.icns" \
    --window-pos 200 120 \
    --window-size 600 400 \
    --icon-size 100 \
    --icon "NagoImgConverter.app" 175 190 \
    --hide-extension "NagoImgConverter.app" \
    --app-drop-link 425 190 \
    --skip-jenkins \
    "$DMG_PATH" \
    "$(dirname "$APP_PATH")/"
fi

echo ""
echo "Build complete:"
[ -d "$APP_PATH" ] && echo "  .app → $APP_PATH"
[ -f "$DMG_PATH" ] && echo "  .dmg → $DMG_PATH"
