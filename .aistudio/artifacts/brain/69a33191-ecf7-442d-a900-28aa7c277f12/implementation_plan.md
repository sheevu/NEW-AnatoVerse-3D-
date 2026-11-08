# Advanced 3D Human Anatomy & Clinical Visualization Platform

An enterprise-grade medical 3D visualization enhancement for VedaShield AI, integrating high-fidelity anatomical models from BodyParts3D and Z-Anatomy with real-time procedural kinematics, dynamic multi-axis cross-sectional clipping, radial exploded system inspection, synchronized cardiopulmonary physiological simulations, and clinical biomarker drawers.

### User Review & Critical Decisions

> [!IMPORTANT]
> The following user preferences were confirmed during Phase 1 clarification and form the core specification:

- **Confirmed Decision 1 (Exploded & Sectional Mode)**: Radial exploded view with dynamic spacing slider (0% to 100% anatomical displacement along calibrated centroid vectors) combined with interactive coronal/sagittal/axial cross-sectional clipping planes.
- **Confirmed Decision 2 (Physiological Simulations)**: Synchronized multi-organ physiological pulse loop including realistic dual-phase cardiac contraction (systole/diastole), respiratory lung expansion with tidal rhythm, and arterial vascular pulse wave propagation.
- **Confirmed Decision 3 (Clinical Panel Layout)**: Slide-out clinical drawer docked at the viewport edge that seamlessly links patient laboratory biomarkers, 3D sub-structures, Terminologia Anatomica 2 (TA2) nomenclature, and Ayurvedic dosha correlations.
- **Architectural Decision (Preservation & Zero-Regression)**: Maintain existing working features intact (bilingual Hindi/English i18n, family member profiles, medical report OCR scanner, Web3 cryptographic verification, medicine library, and Ayurveda wellness) while replacing generic primitives in secondary systems with scientifically grounded anatomical structures.

---

### 1. Overview & Core Concept

- **What It Does**: Upgrades the interactive human anatomy viewer from isolated organ inspection to a unified, multi-layered anatomical explorer. Users can peel through eight discrete physiological systems, explode organs radially to examine internal spatial relationships, slice through tissues with dynamic cross-sectional clipping planes, observe active physiological motion, and inspect highlighted patient biomarker anomalies directly linked to clinical laboratory reports.
- **Target Audience / Persona**: Patients and families seeking clear, visual understanding of their laboratory findings; clinicians and health educators communicating organ pathology; medical students studying Terminologia Anatomica 2 (TA2) bilingual nomenclature.
- **Key Value**: Bridges abstract laboratory numbers (e.g., elevated creatinine or fasting glucose) directly to their biological locations in photorealistic 3D, turning complex pathology into intuitive visual literacy.

---

### 2. User Experience & Visual Design

#### Key User Flows

1. **Zero-State Exploration & System Toggling**:
   - User loads the Anatomy tab; the full human body renders with a subtle holographic skin contour, skeletal ribcage, vascular tree, and visceral organs in standard anatomical position.
   - User clicks system filter buttons in the bottom ergonomic dock (`Skeletal`, `Muscular`, `Cardiovascular`, `Nervous`, `Respiratory`, `Digestive`, `Endocrine`, `Urinary`, or `All Systems`) to isolate specific functional networks.

2. **Radial Exploded View Inspection**:
   - User drags the Exploded View slider in the bottom dock from 0% to 100%.
   - Organs smoothly glide outward from the body midline along calibrated anatomical displacement vectors, revealing retroperitoneal structures (kidneys, pancreas, adrenal glands, spine) without camera obstruction.

3. **Multi-Axis Cross-Sectional Clipping**:
   - User toggles the Cross-Section tool and chooses Coronal (frontal), Sagittal (side), or Axial (transverse) slice planes.
   - Dragging the plane position slider slices cleanly through geometry, revealing internal visceral cross-sections in real time with capped edges.

4. **Organ Focus & Slide-Out Clinical Drawer**:
   - User clicks any organ (or selects an abnormal finding from their medical report).
   - Camera executes a smooth damped glide (`THREE.MathUtils.damp`) to frame the selected organ.
   - An elegant slide-out clinical drawer emerges from the right margin, displaying:
     - Bilingual names in English, Hindi, and Latin (TA2 / FMA ontological ID).
     - Connected lab test rows with clinical severity indicators (High/Low/Normal).
     - Sub-structural anatomical hierarchy (lobes, chambers, vessels).
     - Ayurvedic organ associations (Pitta/Kapha/Vata, Dhatus, Sub-doshas).
     - One-click trigger to ask the AI Health Assistant about related symptoms.

5. **Physiological Simulation Sync**:
   - Heart pulses with realistic rhythmic ventricular ejection and auricular contraction.
   - Lungs expand and contract in counterpoint to simulate respiratory tidal volume.
   - Arterial vascular emissive intensity pulses cyclically down the descending aorta and carotid trunks.

#### Visual Identity & Theme

- **Aesthetic Direction**: Clinical Precision & Biomechanical Studio. High-contrast dark obsidian canvas (`#020617` / `#090d16`) with cyan rim lighting (`#00e5ff`), warm key highlights (`#ffffff`), and calibrated anatomical organ tones.
- **Color Palette & Discipline (60-30-10)**:
  - *60% Neutral Canvas*: Slate-950 deep backdrop (`#020617`) with subtle studio vignette.
  - *30% Structural Surfaces*: Translucent obsidian panels (`rgba(15, 23, 42, 0.85)`), hairline slate borders (`#1e293b`), and subdued typographic hierarchy.
  - *10% Clinical Accent*: Emerald green (`#10b981`) for normal findings and active selections; Ruby red (`#ef4444`) for elevated biomarker alerts; Amber (`#f59e0b`) for subnormal values; Electric cyan (`#00e5ff`) for anatomical rim highlights.
- **Typography**:
  - *Display / Headers*: `Plus Jakarta Sans`, clean bold title-case with balanced measure (`text-wrap: balance`).
  - *Clinical Body*: `Plus Jakarta Sans` / `DM Sans` (14px–15px, 1.6 line height).
  - *Data & Ontological Codes*: Monospace tabular figures (`JetBrains Mono` / `font-mono tabular-nums`) for FMA IDs, TA2 codes, reference ranges, and lab values.
- **Zero-Pill Restraint**: Static metadata (TA2 IDs, system categories, blood biomarkers) rendered with unboxed text and clean separators (`·` / `/`). Buttons reserved strictly for interactive actions.

---

### 3. Key Product Decisions & Trade-Offs

#### Decision 1: Vector-Based Radial Exploded View vs. Simple Z-Axis Translation
- *Chosen Approach*: Calculate per-organ radial expansion vectors originating from the anatomical thoracic/abdominal center point. The heart moves anterior-left, lungs move lateral-bilateral, stomach moves anterior-left, liver moves lateral-right, kidneys move posterior-lateral, pancreas moves anterior, and intestines glide inferior-anterior.
- *Why*: True radial displacement prevents organs from colliding into each other during explosion, creating a museum-grade exploded diagram where every retroperitoneal structure is visible from a single viewpoint.
- *Alternatives Considered*: Linear Z-stacking (looks unnatural and obscures posterior organs) and random outward scatter (loses anatomical orientation).

#### Decision 2: Multi-Pass WebGL Clipping Planes vs. Mesh Boolean Slicing
- *Chosen Approach*: Hardware-accelerated `THREE.Plane` clipping integrated directly into WebGL materials (`renderer.localClippingEnabled = true`).
- *Why*: Near-zero runtime performance cost (60 FPS on mobile and low-power laptops), instantaneous slider response, and zero polygon reconstruction overhead.
- *Alternatives Considered*: CSG (Constructive Solid Geometry) mesh boolean slicing (computationally heavy, stalls the main thread, and causes WebGL frame drops).

#### Decision 3: Procedural Dual-Phase Physiological Motion vs. Static Models
- *Chosen Approach*: Frame-rate independent mathematical animation loops driven by `clock.getElapsedTime()` with delta damping for dual-phase cardiac pulsation (ejection click + recovery), sinusoidal pulmonary breathing cycles, and vascular emissive wave propagation.
- *Why*: Brings the human body to life for educational immersion without requiring massive pre-baked skeletal animation files that bloat network download sizes.
- *Alternatives Considered*: Pre-baked FBX/GLTF skeletal animations (adds 15–30MB of animation tracks that slow initial PWA download).

#### Decision 4: Consolidated Bottom Control Dock (Ergonomic HUD)
- *Chosen Approach*: Follow the Three.js and Frontend Design directives by placing camera controls, exploded slider, system selector, clipping toggle, and view presets into a single collapsible bottom dock (`bottom-4 left-1/2 -translate-x-1/2`).
- *Why*: Keeps the entire central 3D viewport 100% unobstructed so the anatomical model remains the undisputed hero subject.

---

### 4. Technical Architecture & Data Strategy

#### System Architecture & Component Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           VedaShield AI Workspace                           │
├─────────────────────────────────────────────────────────────────────────────┤
│  Top Navigation (Brand Wordmark · Nav Links · Profile / Auth Switcher)       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────────────────────────────────┐  ┌─────────────────────┐  │
│  │           3D Viewport (Full Height)          │  │ Slide-Out Clinical  │  │
│  │                                              │  │ Drawer (Collapsible)│  │
│  │  Three.js Canvas (R3F + Drei + WebGL)        │  │                     │  │
│  │  ├─ Studio Lighting (Key + Cyan Rim + Spot)  │  │ ├─ Bilingual Names  │  │
│  │  ├─ BodyShell (Hologram / Wireframe / Glass) │  │ │  (EN / HI / LA)   │  │
│  │  ├─ Skeletal System (BodyParts3D GLB)        │  │ ├─ TA2 & FMA Codes  │  │
│  │  ├─ Vascular System (Pulsing Emissive GLB)   │  │ ├─ Patient Lab Rows │  │
│  │  ├─ Muscular, Nervous, Lymphatic, Endocrine  │  │ │  (High/Low/Normal)│  │
│  │  ├─ Visceral Organs (GLB + Radial Vectors)   │  │ ├─ Sub-Structures   │  │
│  │  ├─ Dynamic Clipping Plane (Axial/Coronal)   │  │ ├─ Ayurvedic Dosha  │  │
│  │  ├─ 3D Organ Leader Callouts & Markers       │  │ └─ Ask Health AI    │  │
│  │  └─ Stabilized OrbitControls (Smooth Lerp)   │  │                     │  │
│  │                                              │  └─────────────────────┘  │
│  │  ┌────────────────────────────────────────┐  │                           │
│  │  │ Consolidated Bottom Ergonomic Dock     │  │                           │
│  │  │ ═══●═══ Explode | Systems | Clip | Cam │  │                           │
│  │  └────────────────────────────────────────┘  │                           │
│  └──────────────────────────────────────────────┘                           │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### State Model & Interaction Mapping

| State Variable | Type | Scope | User Interaction & Behavior |
| :--- | :--- | :--- | :--- |
| `activeOrgan` | `OrganKey \| null` | Viewer Root | Clicking organ mesh or marker triggers camera zoom + opens clinical drawer |
| `explodedFactor` | `number (0.0 to 1.0)` | Viewer Root | Dragging exploded slider smoothly offsets organ centroids along radial vectors |
| `clippingConfig` | `{ axis: 'coronal' \| 'sagittal' \| 'axial', height: number, active: boolean }` | R3F Scene | Toggling cross-section clips geometry along active axis plane with live slider |
| `activeSystem` | `AnatomicalSystemKey \| 'all'` | Scene / Layers | Toggling system pills isolates skeletal, muscular, vascular, digestive, etc. |
| `simulationSync` | `{ heart: boolean, breathing: boolean, vascular: boolean }` | useFrame loop | Controls real-time physiological wave generators in WebGL render loop |
| `drawerOpen` | `boolean` | DOM Overlay | Slides in from right when organ is clicked; dismissible via backdrop or unzoom |

#### Step-by-Step Implementation Sequence

1. **Step 1: Anatomical Data & Vector Registry Expansion**:
   - Enhance `/src/data/anatomyNomenclature.ts` with explicit radial explosion displacement vectors, bounding centroids, and sub-structure anatomical hierarchies for all primary visceral organs and secondary systems.

2. **Step 2: 3D Shader, Material & Clipping Plane Pipeline**:
   - Update `/src/components/anatomy/AnatomyViewer.tsx` to enable WebGL local clipping (`gl.localClippingEnabled = true`).
   - Implement dynamic clipping planes for Coronal, Sagittal, and Axial cross-sections.
   - Refactor PBR material creation to support smooth opacity cross-fades and emissive physiological pulses without garbage collection in the render loop.

3. **Step 3: Radial Exploded View & Kinematics Engine**:
   - Implement frame-rate independent position lerping (`THREE.MathUtils.damp`) for all organ groups based on `explodedFactor`.
   - Ensure raycasting, 3D leader arrows, and HTML pins follow displaced organ centroids dynamically during explosion.

4. **Step 4: Synchronized Physiological Simulation Loop**:
   - Implement dual-phase cardiac cycle simulation on the Heart mesh.
   - Implement tidal volume sinusoidal expansion on Lungs.
   - Implement propagating emissive vascular wave on Aorta and Carotid trunks.

5. **Step 5: Slide-Out Clinical Biomarker Drawer**:
   - Build a sleek, accessible slide-out drawer replacing the modal overlay, showing patient laboratory rows, normal reference ranges, TA2 nomenclature, Ayurvedic balance, and symptom quick-actions.

6. **Step 6: Ergonomic Bottom Control Dock & Mobile Optimization**:
   - Consolidate all controls (exploded slider, system toggles, clipping options, camera angle presets, audio chime, and zen mode) into the unified bottom dock.
   - Ensure responsive touch gesture controls (pinch-zoom, two-finger pan, one-finger rotate) and 2D interactive fallback on mobile devices.

7. **Step 7: Verification & Full Compilation Check**:
   - Run `compile_applet` and `lint_applet` to verify clean build and type safety.
