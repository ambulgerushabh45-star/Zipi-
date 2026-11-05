# ZIPI – Aerospace & Autonomous Drone Technology Platform

[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.3-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-11.18-black.svg)](https://www.framer.com/motion/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ESNext-F7DF1E.svg)](https://developer.mozilla.org/)

**ZIPI** is a premium, futuristic international unmanned aerial vehicle (UAV) e-commerce and interactive mission simulation platform engineered for **Defence & Security**, **Precision Agriculture**, and **Industrial Operations**.

---

## 🌟 Strategic Sectors & Interactive Mission Simulators

### 1. Defence & Perimeter Security (`/defence`)
- **Lawful, Non-Weaponized ISR Applications Only**: High-altitude loiter, border security, critical infrastructure vigilance, and humanitarian search and rescue.
- **Visual Styling**: Pure black cinematic surfaces with restrained electric cyan accents and tactical HUD overlays.
- **4 Click-Triggered Mission Profiles**:
  1. **Surveillance & Monitoring** (`MSN-SURV-01`): Continuous 40x optical EO/IR zoom and 640x512 FLIR Boson thermal radiometric isolation.
  2. **Reconnaissance** (`MSN-RECON-02`): Silent acoustic signature (<38 dBA) and radar-absorbent composite coating.
  3. **Border & Perimeter Security** (`MSN-BORDER-03`): Autonomous drone-in-a-box scheduled patrols with AI intruder classification.
  4. **Search and Rescue** (`MSN-SAR-04`): Human body heat isolation (+37°C filter) with 12,000-lumen tracking spotlights and lifeline winches.
- **Integrated Hardware Packages**: Each mission provides a complete matching suite of UAV Drone, Remote Controller, Ground Control Station, and Avionics/Datalinks.

### 2. Precision Agriculture & Smart Farming (`/agriculture`)
- **Agronomic Productivity**: Autonomous aerial application, sub-centimeter RTK topographical terrain mapping, and 5-band NDVI diagnostics.
- **Visual Styling**: Premium light surfaces (`#f8faf9`) with natural emerald and forest green accents.
- **4 Click-Triggered Agronomic Missions**:
  1. **Precision Spraying** (`AGRI-SPRAY-01`): 40-liter centrifugal atomizing sprayers with micron droplet calibration (50–500 μm).
  2. **Crop Health Monitoring** (`AGRI-MONITOR-02`): Synchronized NIR and RedEdge radiometric sensors computing live NDVI vegetative indices.
  3. **Field Mapping** (`AGRI-MAP-03`): 61MP photogrammetry and Digital Elevation Models (DEM) for drainage optimization.
  4. **Precision Agriculture Ecosystem** (`AGRI-ECO-04`): Full-cycle cooperative scout and sprayer swarm management.
- **Interactive Agronomy Tools**:
  - **NDVI False-Color Simulator**: Toggle between True-Color RGB and calibrated 5-band NDVI canopy health maps.
  - **Acreage & Chemical Reduction Estimator**: Real-time calculator for flight hours, battery swap cycles, and input reduction (-32%).

---

## 🛒 Complete Hardware E-Commerce Catalogue

ZIPI features an expansive catalogue across four dedicated UAV hardware categories:

1. **UAV Drones**: Defence surveillance, precision agronomy sprayers, commercial survey platforms.
2. **UAV Remote Controllers**: Professional handhelds, long-range COFDM transmitters, 2,000-nit daylight touchscreen units, multi-UAV swarm commanders.
3. **Ground Control Stations (GCS)**: Pelican briefcases, dual-screen command consoles, IP67 rugged field tablets, tactical vehicle hubs.
4. **Avionics & Datalink Intelligence**: Tactical IP mesh radios, micro-datalinks, Low-Earth-Orbit satellite telemetry, triple-redundant autopilots.

### Procurement Workflows:
- **Instant Checkout**: Cart drawer and checkout flow for standard aerospace products.
- **Enterprise RFP Modal**: Dedicated quote generation (`ZP-RFP-XXXXX`) for classified, defence-restricted, and custom fleet integrations.
- **Cinematic 3D Product Showcase**: Full-screen modal featuring transparent drone renders, 3D mouse parallax tilt, and interactive diagnostic hotspots (Shooting Functions, Advanced Stabilization, Premium Quality, Remote Control).

---

## 🛠️ Technology Stack

- **Framework**: React 18 (Pure JavaScript / JSX)
- **Bundler & Dev Server**: Vite 7
- **Styling**: Tailwind CSS 3
- **Motion & UI Dynamics**: Framer Motion 11
- **Icons**: Lucide React
- **Routing**: React Router DOM 6
- **Backend & Database**: Supabase
- **Code Standards**: ESLint 9 (Pure JavaScript + React Hooks)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/ambulgerushabh45-star/Zipi-.git

# Navigate to project folder
cd Zipi-

# Install dependencies
npm install
```

### Development
```bash
# Start local Vite development server
npm run dev
```
Visit `http://localhost:5173` in your browser.

### Production Build
```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

### Linting
```bash
# Run ESLint validation
npm run lint
```

---

## 📁 Project Architecture

```
├── public/                 # Static assets, drone photography, and logo marks
├── src/
│   ├── components/
│   │   ├── cart/          # Cart drawer and procurement bag
│   │   ├── common/        # RFP Quote Modal, Section headings, product rows
│   │   ├── feedback/      # Toast notifications
│   │   ├── home/          # Hero, sector split, category explorer
│   │   ├── layout/        # Navbar, MegaMenu dropdowns, Footer, Modals
│   │   ├── product/       # Product cards, quick view modal, star ratings
│   │   └── showcase/      # Fullscreen Cinematic Showcase and 3D renders
│   ├── context/           # Shopping cart context and provider
│   ├── data/              # Product catalogue, hardware specs, navigation
│   ├── hooks/             # useShop, useMegaMenu
│   ├── lib/               # Currency formatting and helpers
│   ├── pages/             # Home, Defence, Agriculture, Products, Showcase, Cart
│   ├── App.jsx            # Routing and global modal controllers
│   ├── index.css          # Tailwind CSS layer definitions and glow animations
│   └── main.jsx           # React DOM root entry
├── index.html             # Application HTML shell
├── jsconfig.json          # JavaScript alias configuration (@/*)
├── vite.config.js         # Vite bundler configuration
└── package.json           # Scripts and dependencies
```

---

## 📄 License

Proprietary © ZIPI Aerospace Technologies. All Rights Reserved.
