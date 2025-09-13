# Human 3D – Muscular Tension (Web)

A simple Three.js demo: drag joints to rotate limbs; muscle tension visualized via color.

## Run locally

Option A: Python HTTP server
```bash
cd ~/Projects/Human3D
python3 -m http.server 5173
# open http://localhost:5173
```

Option B: Node (serve)
```bash
cd ~/Projects/Human3D
npx serve . -l 5173 --single --yes
# open http://localhost:5173
```

## Files
- `index.html`
- `style.css`
- `app.js`
