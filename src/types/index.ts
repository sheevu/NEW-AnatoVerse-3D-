export type Relationship = 'Self' | 'Spouse' | 'Parent' | 'Child' | 'Grandparent' | 'Other';

export interface UserAuth {
  id: string;
  name: string;
  email?: string;
  isGuest: boolean;
  avatarUrl?: string;
}

export interface FamilyProfile {
  id: string;
  name: string;
  relationship: Relationship;
  dob: string;
  bloodGroup: string;
  allergies?: string;
  chronicConditions?: string;
  notes?: string;
  avatarColor?: string;
  createdAt: string;
}

export type OrganKey =
  | 'heart'
  | 'brain'
  | 'lungs'
  | 'liver'
  | 'kidneys'
  | 'pancreas'
  | 'stomach'
  | 'intestines';

export type RangeStatus = 'low' | 'within' | 'high' | 'unknown';

export interface TestRow {
  id: string;
  name: string;
  value: string;
  numericValue?: number;
  unit: string;
  range: string;
  status: RangeStatus;
  organ?: OrganKey | null;
  clinicalNote?: string;
}

export interface PrescribedMedication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  timing: string;
  duration: string;
  purposeEn?: string;
  purposeHi?: string;
  targetOrgan?: OrganKey | null;
}

export interface VitalSigns {
  systolicBP?: number;
  diastolicBP?: number;
  heartRate?: number;
  spO2?: number;
  weightKg?: number;
  temperatureF?: number;
}

export interface PrescriptionDetails {
  doctorName: string;
  specialty?: string;
  clinicName: string;
  rxDate: string;
  diagnosis: string;
  chiefComplaints?: string;
  medications: PrescribedMedication[];
  vitals?: VitalSigns;
  adviceNotes: string;
  followUpDate?: string;
  rawScrapedText?: string;
}

export interface MedicineBiomarkerCorrelation {
  medicine: string;
  dosage: string;
  linkedBiomarker: string;
  clinicalRationaleEn: string;
  clinicalRationaleHi: string;
  precautionNoteEn?: string;
  precautionNoteHi?: string;
  organ?: OrganKey | null;
}

export interface MedicalReport {
  id: string;
  profileId: string;
  title: string;
  date: string;
  labName?: string;
  type: 'lab' | 'prescription' | 'imaging' | 'other';
  rows: TestRow[];
  extractedText?: string;
  doctorNotes?: string;
  aiSummaryEn?: string;
  aiSummaryHi?: string;
  prescribedMedicines?: string[];
  prescriptionDetails?: PrescriptionDetails;
  vitals?: VitalSigns;
  combinedSynthesisEn?: string;
  combinedSynthesisHi?: string;
  medicineCorrelations?: MedicineBiomarkerCorrelation[];
  actionableRecommendationsEn?: string[];
  actionableRecommendationsHi?: string[];
  fileUrl?: string;
  verified: boolean;
  createdAt: string;
}

export interface OrganDetail {
  key: OrganKey;
  nameEn: string;
  nameHi: string;
  fmaId: string;
  color: string;
  highlightColor: string;
  position: [number, number, number];
  arrowOffset: [number, number, number];
  cameraDistance: number;
  shortInsightEn: string;
  shortInsightHi: string;
  descriptionEn: string;
  descriptionHi: string;
  functionEn: string;
  functionHi: string;
  symptomsEn: string[];
  symptomsHi: string[];
  recommendedTests: string[];
  triangles: number;
  files: string[];
}

export interface IndianMedicine {
  id: string;
  brandName: string;
  genericName: string;
  genericNameHi: string;
  category: string;
  categoryHi: string;
  commonUsesEn: string[];
  commonUsesHi: string[];
  dosageForm: string;
  strengths: string[];
  precautionsEn: string;
  precautionsHi: string;
  sideEffectsEn: string;
  sideEffectsHi: string;
  foodInteractionEn: string;
  foodInteractionHi: string;
  isPrescriptionRequired: boolean;
  verifiedSource: string;
}

export interface DoctorQuestion {
  en: string;
  hi: string;
}

export type SkinMode = 'hologram' | 'glass' | 'solid' | 'wireframe' | 'hidden';

export type AnatomicalSystemKey =
  | 'skeletal'
  | 'muscular'
  | 'nervous'
  | 'cardiovascular'
  | 'respiratory'
  | 'digestive'
  | 'urinary'
  | 'endocrine'
  | 'lymphatic';

export interface AnatomicalLayers {
  skin: boolean;
  skinMode: SkinMode;
  skinOpacity: number;
  organs: boolean;
  skeleton: boolean;
  vascular: boolean;
  muscular: boolean;
  nervous: boolean;
  lymphatic: boolean;
  endocrine: boolean;
  urinary: boolean;
  showLabels: boolean;
  showArrows: boolean;
  clippingPlane: boolean;
  clippingHeight: number;
  clippingAxis: 'axial' | 'coronal' | 'sagittal';
  explodedFactor: number;
  animationHeart: boolean;
  animationBreathing: boolean;
  animationBloodFlow: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  relatedOrgan?: OrganKey | null;
  suggestedTests?: string[];
  timestamp: string;
}
