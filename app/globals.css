@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

:root {
  --font-sans: 'DM Sans', system-ui, sans-serif;
  --font-display: 'Lora', Georgia, serif;
  --farm-green: #2d6a4f;
  --farm-light: #74c69d;
  --farm-cream: #f8f4ec;
  --farm-brown: #6b4226;
  --farm-accent: #f4a261;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body {
  height: 100%;
  font-family: var(--font-sans);
  background: var(--farm-cream);
  color: #1a1a1a;
}

/* Leaflet map overrides */
.leaflet-container {
  font-family: var(--font-sans) !important;
}

.leaflet-popup-content-wrapper {
  border-radius: 1rem !important;
  box-shadow: 0 8px 32px rgba(0,0,0,0.15) !important;
  padding: 0 !important;
  overflow: hidden;
}

.leaflet-popup-content {
  margin: 0 !important;
  width: 280px !important;
}

.leaflet-popup-tip-container {
  display: none;
}

/* Custom pin styles */
.farm-pin {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50% 50% 50% 0;
  transform: rotate(-45deg);
  box-shadow: 0 3px 12px rgba(0,0,0,0.25);
  border: 2px solid white;
  cursor: pointer;
  transition: transform 0.15s ease;
}

.farm-pin:hover {
  transform: rotate(-45deg) scale(1.2);
}

.farm-pin-inner {
  transform: rotate(45deg);
  font-size: 14px;
}

/* Scrollbar */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #ccc; border-radius: 3px; }
