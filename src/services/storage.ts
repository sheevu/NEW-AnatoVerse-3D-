import { FamilyProfile, MedicalReport } from '../types';
import { SAMPLE_REPORTS } from './sampleReports';
import { supabase, isSupabaseConfigured } from './supabaseClient';

const PROFILES_KEY = 'vedashield_profiles_v2';
const REPORTS_KEY = 'vedashield_reports_v2';
const ACTIVE_PROFILE_KEY = 'vedashield_active_profile_v2';

const DEFAULT_PROFILES: FamilyProfile[] = [
  {
    id: 'prof-self',
    name: 'Rahul Sharma',
    relationship: 'Self',
    dob: '1984-06-14',
    bloodGroup: 'B+',
    allergies: 'Penicillin (mild rash)',
    chronicConditions: 'Prediabetes, Mild Hypertension',
    notes: 'Takes morning walk, low salt diet',
    avatarColor: '#059669',
    createdAt: new Date().toISOString()
  },
  {
    id: 'prof-mother',
    name: 'Sunita Sharma (Mataji)',
    relationship: 'Parent',
    dob: '1958-11-22',
    bloodGroup: 'O+',
    allergies: 'None reported',
    chronicConditions: 'Osteoporosis, Hypothyroidism',
    notes: 'Takes Thyronorm 50mcg empty stomach daily',
    avatarColor: '#d97706',
    createdAt: new Date().toISOString()
  },
  {
    id: 'prof-spouse',
    name: 'Priya Sharma',
    relationship: 'Spouse',
    dob: '1987-03-09',
    bloodGroup: 'A+',
    allergies: 'Dust & pollen allergy',
    chronicConditions: 'None',
    notes: 'Takes multivitamin & calcium',
    avatarColor: '#7c3aed',
    createdAt: new Date().toISOString()
  }
];

export async function getProfiles(): Promise<FamilyProfile[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: true });
      if (!error && data && data.length > 0) {
        return data.map((d: any) => ({
          id: d.id,
          name: d.name,
          relationship: d.relationship,
          dob: d.dob || '',
          bloodGroup: d.blood_group || '',
          allergies: d.allergies || '',
          chronicConditions: d.chronic_conditions || '',
          notes: d.notes || '',
          avatarColor: d.avatar_color || '#059669',
          createdAt: d.created_at
        }));
      }
    } catch (e) {
      console.warn('Supabase fetch profiles error, using offline store:', e);
    }
  }

  const raw = localStorage.getItem(PROFILES_KEY);
  if (!raw) {
    localStorage.setItem(PROFILES_KEY, JSON.stringify(DEFAULT_PROFILES));
    return DEFAULT_PROFILES;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return DEFAULT_PROFILES;
  }
}

export async function saveProfile(profile: FamilyProfile): Promise<void> {
  const current = await getProfiles();
  const exists = current.findIndex(p => p.id === profile.id);
  let updated: FamilyProfile[];
  if (exists >= 0) {
    updated = current.map(p => p.id === profile.id ? profile : p);
  } else {
    updated = [...current, profile];
  }
  localStorage.setItem(PROFILES_KEY, JSON.stringify(updated));

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('profiles').upsert({
        id: profile.id,
        name: profile.name,
        relationship: profile.relationship,
        dob: profile.dob,
        blood_group: profile.bloodGroup,
        allergies: profile.allergies,
        chronic_conditions: profile.chronicConditions,
        notes: profile.notes,
        avatar_color: profile.avatarColor,
      });
    } catch (e) {
      console.warn('Supabase save profile failed:', e);
    }
  }
}

export async function deleteProfile(id: string): Promise<void> {
  const current = await getProfiles();
  const updated = current.filter(p => p.id !== id);
  localStorage.setItem(PROFILES_KEY, JSON.stringify(updated));

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('profiles').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase delete profile failed:', e);
    }
  }
}

export function getActiveProfileId(): string {
  const id = localStorage.getItem(ACTIVE_PROFILE_KEY);
  return id || 'prof-self';
}

export function setActiveProfileId(id: string): void {
  localStorage.setItem(ACTIVE_PROFILE_KEY, id);
}

export async function getReports(profileId?: string): Promise<MedicalReport[]> {
  let reports: MedicalReport[] = [];
  if (isSupabaseConfigured && supabase) {
    try {
      let query = supabase.from('reports').select('*');
      if (profileId) query = query.eq('profile_id', profileId);
      const { data, error } = await query.order('date', { ascending: false });
      if (!error && data && data.length > 0) {
        reports = data.map((d: any) => ({
          id: d.id,
          profileId: d.profile_id,
          title: d.title,
          date: d.date,
          labName: d.lab_name,
          type: d.type,
          rows: d.rows || [],
          extractedText: d.extracted_text,
          doctorNotes: d.doctor_notes,
          aiSummaryEn: d.ai_summary_en,
          aiSummaryHi: d.ai_summary_hi,
          prescribedMedicines: d.prescribed_medicines || [],
          fileUrl: d.file_url,
          verified: d.verified,
          createdAt: d.created_at
        }));
        return reports;
      }
    } catch (e) {
      console.warn('Supabase fetch reports error, using offline store:', e);
    }
  }

  const raw = localStorage.getItem(REPORTS_KEY);
  if (!raw) {
    // Populate sample reports linked to default self and mother profiles
    const seeded: MedicalReport[] = [
      {
        id: 'rep-sample-1',
        profileId: 'prof-self',
        ...SAMPLE_REPORTS[0],
        createdAt: new Date(Date.now() - 3 * 86400000).toISOString()
      },
      {
        id: 'rep-sample-2',
        profileId: 'prof-self',
        ...SAMPLE_REPORTS[1],
        createdAt: new Date(Date.now() - 28 * 86400000).toISOString()
      },
      {
        id: 'rep-sample-3',
        profileId: 'prof-mother',
        ...SAMPLE_REPORTS[2],
        createdAt: new Date(Date.now() - 60 * 86400000).toISOString()
      }
    ];
    localStorage.setItem(REPORTS_KEY, JSON.stringify(seeded));
    reports = seeded;
  } else {
    try {
      reports = JSON.parse(raw);
    } catch {
      reports = [];
    }
  }

  if (profileId) {
    return reports.filter(r => r.profileId === profileId);
  }
  return reports;
}

export async function saveReport(report: MedicalReport): Promise<void> {
  const current = await getReports();
  const exists = current.findIndex(r => r.id === report.id);
  let updated: MedicalReport[];
  if (exists >= 0) {
    updated = current.map(r => r.id === report.id ? report : r);
  } else {
    updated = [report, ...current];
  }
  localStorage.setItem(REPORTS_KEY, JSON.stringify(updated));

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('reports').upsert({
        id: report.id,
        profile_id: report.profileId,
        title: report.title,
        date: report.date,
        lab_name: report.labName,
        type: report.type,
        rows: report.rows,
        extracted_text: report.extractedText,
        doctor_notes: report.doctorNotes,
        ai_summary_en: report.aiSummaryEn,
        ai_summary_hi: report.aiSummaryHi,
        prescribed_medicines: report.prescribedMedicines,
        verified: report.verified
      });
    } catch (e) {
      console.warn('Supabase save report failed:', e);
    }
  }
}

export async function deleteReport(id: string): Promise<void> {
  const current = await getReports();
  const updated = current.filter(r => r.id !== id);
  localStorage.setItem(REPORTS_KEY, JSON.stringify(updated));

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('reports').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase delete report failed:', e);
    }
  }
}
