# Cairns Cracker V3

## What changed from V2
- Temperature selector now matches the other pizza app:
  - Summer / hot
  - Mild
  - Winter / cooler
- Removed the live-weather button from the main workflow.
- 24 / 48 / 72-hour fermentation remains based only on cook start.
- Rolled-skin stage has been redesigned:
  - skins are rolled closer to pizza night
  - uncovered fridge drying is longer
  - covering is based on actual skin feel, not just elapsed time
- Skin-check logic:
  - Soft / tacky -> keep uncovered
  - Dry / firm -> loosely cover
  - Very dry / brittle -> cover now
- Cairns drying minimums:
  - Summer / hot: 180 minutes
  - Mild: 120 minutes
  - Winter / cooler: 90 minutes
- 72-hour mode no longer leaves skins rolled for multiple days.
- Saved pizza nights and calendar export remain included.

## Master dough formula for 6 x 12-inch pizzas
- Lighthouse Bread & Pizza Flour: 830 g
- Traditional cornmeal: 43 g
- Cool water: 471 g
- Salt: 21 g
- Sugar: 10 g
- Vegetable oil: 56 g
- Olive oil: 16 g

Base yeast before Cairns seasonal adjustment:
- 24 h: 2.8 g
- 48 h: 1.9 g
- 72 h: 1.25 g

Season multipliers:
- Summer / hot: x0.85
- Mild: x1.00
- Winter / cooler: x1.10

## GitHub update
Replace the old site files with all V3 files, including the `icons` folder.
The service-worker cache has been bumped to `cairns-cracker-v3`.


## V3.1 icon refresh
This build uses completely new icon filenames to force Safari/iOS to fetch fresh artwork:
- `icons/cairns-cracker-v31-180.png`
- `icons/cairns-cracker-v31-192.png`
- `icons/cairns-cracker-v31-512.png`

After uploading all files to GitHub Pages:
1. Wait for the Pages deployment to finish.
2. Delete the old Cairns Cracker Home Screen app/icon.
3. Open the GitHub Pages URL in Safari.
4. Refresh once.
5. Share -> Add to Home Screen.
6. Confirm the pizza-slice icon appears in the preview before tapping Add.


## V3.2 iPhone safe-area fix
The sticky Cairns Cracker header now respects `env(safe-area-inset-top)` when the PWA is opened from the iPhone Home Screen. This prevents the iOS status bar from covering the banner. The sticky tab bar also moves down by the same inset.
