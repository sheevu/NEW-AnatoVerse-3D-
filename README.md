# AnatoVerse 3D (एनाटोवर्स 3D) · Interactive 3D Human Anatomy & Medical Intelligence

> **Next-Generation Interactive 3D Human Anatomy Atlas, Neural Report Scanner & Holistic Health Visualization Platform.**  
> Built with React 19, TypeScript, Three.js / React Three Fiber, Blender 5.2 LTS automation, Web3 Health Passport, Tesseract.js OCR, and clinical biomarker correlation.

---

## 🌟 Overview & Key Capabilities

**AnatoVerse 3D** transforms complex medical diagnostic reports and anatomical science into an interactive, scientifically grounded 3D exploration experience.

### Core Features:

1. **Interactive 3D Anatomical Atlas**:
   - Upright full-body anatomical model featuring skeletal, muscular, cardiovascular, nervous, respiratory, digestive, endocrine, and urinary systems.
   - Individually selectable organ meshes (`heart.glb`, `brain.glb`, `lungs.glb`, `liver.glb`, `kidneys.glb`, `pancreas.glb`, `stomach.glb`, `intestines.glb`, `skeleton.glb`, `vascular.glb`, `body.glb`).
   - Dynamic real-time PBR lighting, anatomical cross-section slicing, smooth camera orbit, and mobile-calibrated perspective framing.
   - Biomechanical animations: Real-time heartbeat systole, respiratory lung breathing, and hemodynamic vascular flow.

2. **Streamlined UX for General Users**:
   - Clean, uncluttered primary toolbar: **Auto-Orbit**, **Solo Focus**, and **Reset View**.
   - Integrated **`Layers ▾` Dropdown**: Outer skin peel transparency slider (`0% - 100%`), skin holographic/wireframe modes, individual system toggles, and anatomical pins.
   - Compact **`Tools ⚙️ ▾` Menu**: Houses Blender 5.2 automation, Web3 Health Passport, 2,234 Micro-Structures browser, Planar Cross-section slicing, and Audio chimes.

3. **Multi-Organ High-Risk Highlighting & Alert Engine**:
   - Deeply scans laboratory findings to identify all abnormal biomarkers (`high` or `low`).
   - **Simultaneous Multi-Organ Glow**: Flagged organs pulse with a radiant red/amber aura and 3D radar beacon.
   - **Critical Health Alerts Banner**: Displays prominent alert pills for every detected abnormal finding (e.g. *Pancreas: HbA1c 7.6%*, *Liver: SGPT 78 U/L*, *Heart: LDL 158 mg/dL*), enabling 1-click focus.

4. **Mobile Screen Viewport Optimization**:
   - Auto-calibrated camera framing (`4.3m` distance, `(0, 1.05, 0)` target) ensures complete upright human body visibility without clipping on portrait phone viewports.
   - Dedicated mobile view switcher: **`[ 🧍 3D Body ]`** and **`[ 📋 Findings (N) ]`** to eliminate canvas touch conflicts with report scrolling.

5. **Client-Side Neural OCR & Random Report Ingestion**:
   - Ingests arbitrary pathology reports, paper photos, camera snapshots (JPG, PNG, WebP), and digital or scanned PDFs.
   - Powered by **Tesseract.js** client-side neural OCR and **PDF.js** stream parsing.
   - Comprehensive clinical dictionary covering 100+ lab tests across CBC, Lipid, Metabolic, Liver (LFT), Kidney (KFT), Thyroid (TSH, T3, T4), and Electrolyte panels.

6. **Blender 5.2 LTS Pipeline**:
   - Headless Python pipeline (`scripts/blender_pipeline.py`) interfacing with Blender 5.2.3 LTS for automated mesh decimation, LOD generation, and Z-Anatomy template workspace launches.

7. **Web3 Decentralized Health Attestation**:
   - Uses Web3.js to generate Keccak256 cryptographic hashes and smart contract signatures for report immutability and verifiable medical data custody.

8. **Family Care, Ayurveda & WhatsApp Integration**:
   - Multi-profile management (Self, Parents, Children).
   - Ayurvedic dosha (`Vata`, `Pitta`, `Kapha`) and Dhatu correlations for each anatomical organ.
   - One-click user-consented WhatsApp summary card generation.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend Framework** | React 19, TypeScript, Vite 6 |
| **3D Graphics & Shaders** | Three.js, React Three Fiber (`@react-three/fiber`), Drei (`@react-three/drei`) |
| **Styling & Icons** | Tailwind CSS, Lucide Icons, Framer Motion |
| **Document OCR & Vision** | Tesseract.js (Client-side Neural OCR), PDF.js (`pdfjs-dist`), React Dropzone |
| **3D Modeling & Pipeline** | Blender 5.2.3 LTS headless Python pipeline, BodyParts3D, Z-Anatomy |
| **Web3 & Cryptography** | Web3.js, Keccak256 document hashing, EVM wallet signature attestation |
| **Backend & Persistence** | Hono edge server, Supabase (PostgreSQL + RLS), LocalStorage fallback |
| **Internationalization** | i18next, react-i18next (English & हिन्दी) |

---

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** or **pnpm**
- *(Optional)* **Blender 5.2+** for 3D mesh automation

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/sheevu/AnatoVerse-3D-nov.git
cd AnatoVerse-3D-nov

# Install all dependencies
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for Production
```bash
npm run build
```

### 5. Blender 3D Automation
```bash
# Run automated mesh decimation pipeline
npm run blender:pipeline

# Launch Blender with Z-Anatomy workspace
npm run blender:launch
```

---

## 📂 Project Architecture

```
AnatoVerse-3D-nov/
├── public/
│   ├── models/                # Optimized GLB anatomical meshes (body, heart, brain, etc.)
│   ├── favicon.svg
│   └── manifest.json          # PWA configuration
├── scripts/
│   └── blender_pipeline.py    # Headless Blender 5.2 automation scripts
├── server/
│   └── index.js               # Hono backend API server
├── src/
│   ├── components/
│   │   ├── anatomy/           # 3D Canvas, OrganModel, StabilizedCameraController
│   │   ├── scanner/           # Neural OCR & Document upload dropzone
│   │   ├── dashboard/         # Health analytics & clinical trends
│   │   ├── insights/          # Verified lab findings & AI recommendations
│   │   └── sharing/           # WhatsApp report card generator
│   ├── data/
│   │   ├── anatomyNomenclature.ts  # TA2 & Ayurveda bio-energetic data
│   │   └── bp3dCatalog.json        # 2,234 BodyParts3D structure index
│   ├── services/
│   │   ├── aiScanner.ts       # Tesseract OCR & PDF text extraction engine
│   │   ├── medicalRules.ts    # 100+ clinical biomarker ranges & organ mapping
│   │   └── web3HealthVerification.ts # Web3 cryptographic health passport
│   ├── types/
│   ├── App.tsx
│   └── main.tsx
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

---

## 📜 Medical & Scientific Attribution

- **BodyParts3D**: Database Center for Life Science (DBCLS), licensed under [Creative Commons Attribution 2.1 Japan (CC BY 2.1 JP)](https://creativecommons.org/licenses/by/2.1/jp/).
- **Z-Anatomy**: Open anatomical visualization initiative, licensed under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).
- **Terminologia Anatomica 2 (TA2)**: Federative International Programme on Anatomical Terminologies (FIPAT).

---

## ⚖️ Clinical Disclaimer

*AnatoVerse 3D is designed for educational, anatomical visualization, and personal health tracking purposes only. It does not provide clinical medical diagnoses or replace consultations with licensed healthcare professionals.*
