# VedaShield AI · System Architecture & Flow Blueprint

This document specifies the end-to-end architecture, component hierarchy, data flows, and security boundaries of the **VedaShield AI** platform.

---

## 🏛️ System Architecture Overview

```mermaid
flowchart TD
    User([User / Caregiver]) -->|Opens PWA / Mobile / Desktop| UI[VedaShield React PWA]
    
    subgraph Frontend [Client Layer - React 19 + TypeScript + Vite]
        UI --> Nav[Navigation & Multi-Family Profile Switcher]
        UI --> Lang[i18n Engine: English / हिन्दी]
        UI --> Scanner[AI Medical Report Scanner & Verification Table]
        UI --> Anatomy[Interactive 3D Anatomy Viewer - Three.js / R3F]
        UI --> Insights[AI Health Insights & Doctor Consultation Guide]
        UI --> Meds[Indian Medicine Library & Drug-Drug Interactions]
        UI --> Trends[Health Dashboard & Biomarker History - Recharts]
        UI --> WhatsApp[User-Consented WhatsApp Summary Exporter]
    end

    subgraph Storage [Dual-Mode Storage Engine]
        Local[IndexedDB / LocalStorage - Offline First]
        Cloud[Supabase Cloud Sync - PostgreSQL + RLS]
        UI <-->|Immediate Local Access| Local
        Local <-->|Encrypted Background Sync| Cloud
    end

    subgraph Backend [Edge & AI Processing Layer]
        Hono[Cloudflare Workers / Hono API]
        Gemini[Google Gemini Multimodal Vision API]
        Scanner -->|Uploads PDF / Image| Hono
        Hono -->|OCR & Structured JSON Prompt| Gemini
        Gemini -->|Extracted Biomarkers & Intervals| Hono
        Hono -->|Structured Payload| Scanner
    end

    subgraph Knowledge [Clinical & Anatomical Knowledge Base]
        BP3D[(BodyParts3D & Z-Anatomy 3D Meshes)]
        TA2[(Terminologia Anatomica 2 Nomenclature)]
        Rules[(Biomarker Reference Ranges & Organ Mapping)]
        DrugDB[(Indian Pharmaceutical & Interaction Catalog)]
        
        Anatomy <--> BP3D
        Anatomy <--> TA2
        Insights <--> Rules
        Meds <--> DrugDB
    end
```

---

## 🔄 End-to-End User Flow

```mermaid
sequenceDiagram
    autonumber
    actor User as Patient / Family Caregiver
    participant PWA as VedaShield PWA
    participant AI as Gemini Vision API
    participant Engine as Clinical Rules Engine
    participant Viewer as 3D Anatomy Viewer (Three.js)
    participant WA as WhatsApp Share Engine

    User->>PWA: 1. Selects or adds Family Member (e.g., Father)
    User->>PWA: 2. Uploads Blood Test / LFT / Lipid Panel (Image or PDF)
    PWA->>AI: 3. Sends document to Gemini Multimodal Vision
    AI-->>PWA: 4. Returns extracted test names, values, units & reference ranges
    PWA->>User: 5. Displays Interactive Verification Table (User can edit/confirm)
    User->>PWA: 6. Confirms & saves verified lab results
    PWA->>Engine: 7. Evaluates values against clinical reference intervals
    Engine-->>PWA: 8. Tags findings: Within Range, High, or Low
    PWA->>Viewer: 9. Highlights affected organ (e.g., Liver in Amber/Red)
    Viewer-->>User: 10. User inspects 3D organ, Latin name, and educational explanation
    PWA->>PWA: 11. Generates Plain-Language Insights & "Questions for Your Doctor"
    User->>WA: 12. Clicks "Share Summary on WhatsApp"
    WA->>User: 13. Prompts explicit Consent & Privacy confirmation modal
    User->>WA: 14. Confirms consent
    WA->>User: 15. Triggers WhatsApp Web / Native Share with formatted summary card
```

---

## 🫀 3D Anatomy & Biomarker Mapping Architecture

The 3D Anatomy module connects laboratory findings directly to their physiological counterparts:

| Organ System | 3D Asset | Associated Lab Biomarkers | Clinical Focus |
|---|---|---|---|
| **Heart** | `heart.glb` | Total Cholesterol, LDL, HDL, Triglycerides, Troponin | Cardiovascular health & lipid profile |
| **Brain** | `brain.glb` | Sodium, Potassium, Vitamin B12, Calcium | Neurological function & electrolyte balance |
| **Lungs** | `lungs.glb` | Hemoglobin, RBC Count, Oxygen Saturation, ESR | Respiratory gas exchange & oxygenation |
| **Liver** | `liver.glb` | SGPT (ALT), SGOT (AST), Bilirubin, Alkaline Phosphatase | Hepatic metabolism, enzymes & detoxification |
| **Kidneys** | `kidneys.glb` | Serum Creatinine, Blood Urea Nitrogen, eGFR, Uric Acid | Renal clearance & fluid balance |
| **Pancreas** | `pancreas.glb` | Fasting Blood Glucose, HbA1c, Post-Prandial Glucose, Amylase | Endocrine regulation & glucose metabolism |
| **Stomach** | `stomach.glb` | Helicobacter pylori, Gastric Acidity, Pepsinogen | Gastric digestion & mucosal integrity |
| **Intestines** | `intestines.glb` | ESR, C-Reactive Protein (CRP), Platelet Count | Nutrient absorption & systemic inflammation |

---

## 🛡️ Security, Privacy & Compliance Architecture

1. **Zero-Knowledge Offline Mode**:
   - Users can operate VedaShield in Guest mode without creating an account or transmitting health data over the network.
   - All records are stored locally in IndexedDB / LocalStorage.

2. **Supabase Cloud Security**:
   - Multi-tenant data segregation enforced using PostgreSQL **Row Level Security (RLS)**.
   - Every read and write query is restricted to `auth.uid() = user_id`.
   - Medical reports and private attachments are protected in isolated storage buckets.

3. **WhatsApp Consent Enforcement**:
   - No medical data is sent via WhatsApp without the user reviewing the summary and checking the explicit consent confirmation dialog.

4. **Medical Guardrails**:
   - The platform strictly enforces educational guidance.
   - Autonomous diagnosis, prescription changes, and dosage recommendations are permanently barred by design.
