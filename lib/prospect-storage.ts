import { db } from "./firebase";
import {
  collection,
  getDocs,
  addDoc,
  getDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";

interface ProspectProfile {
  id: string;
  prospectName: string;
  companyName: string;
  generatedAt: string;
  rawAnalysis: string;
  sections: Record<string, string>;
  status: 'Completed' | 'In Progress' | 'Pending';
}

// ✅ Save to Firestore
export async function saveProspectProfileToFirestore(profile: Omit<ProspectProfile, 'id'>): Promise<string> {
  const res = await addDoc(collection(db, "prospects"), profile);
  return res.id;
}

// ✅ Get all from Firestore
export async function getProspectProfilesFromFirestore(): Promise<ProspectProfile[]> {
  const snapshot = await getDocs(collection(db, "prospects"));
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<ProspectProfile, 'id'>),
  }));
}

// ✅ Get single by ID from Firestore
export async function getProspectById(id: string): Promise<ProspectProfile | null> {
  const ref = doc(db, "prospects", id);
  const snap = await getDoc(ref);
  return snap.exists() ? ({ id: snap.id, ...(snap.data() as Omit<ProspectProfile, 'id'>) }) : null;
}

// ✅ Delete from Firestore
export async function deleteProspectProfile(id: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, "prospects", id));
    return true;
  } catch (e) {
    console.error("Delete failed", e);
    return false;
  }
}

// 🔧 Legacy localStorage methods below (optional for fallback/testing)

function getProspectProfilesAsObject(): Record<string, ProspectProfile> {
  if (typeof window === 'undefined') return {};
  return JSON.parse(localStorage.getItem('prospectProfiles') || '{}');
}

export function saveProspectProfile(profile: Omit<ProspectProfile, 'id' | 'status'>): string {
  const id = Date.now().toString();
  const fullProfile: ProspectProfile = {
    ...profile,
    id,
    status: 'Completed'
  };
  const existingProfiles = getProspectProfilesAsObject();
  existingProfiles[id] = fullProfile;
  if (typeof window !== 'undefined') {
    localStorage.setItem('prospectProfiles', JSON.stringify(existingProfiles));
  }
  return id;
}

export function getProspectProfiles(): Record<string, ProspectProfile>;
export function getProspectProfiles(asArray: true): ProspectProfile[];
export function getProspectProfiles(asArray?: boolean): Record<string, ProspectProfile> | ProspectProfile[] {
  if (typeof window === 'undefined') return asArray ? [] : {};
  const profiles = JSON.parse(localStorage.getItem('prospectProfiles') || '{}');
  return asArray ? Object.values(profiles) : profiles;
}

export function getProspectProfile(id: string): ProspectProfile | null {
  const profiles = getProspectProfilesAsObject();
  return profiles[id] || null;
}

export function initializeMockData(): void {
  if (typeof window === 'undefined') return;
  const existing = localStorage.getItem('prospectProfiles');
  if (!existing || existing === '{}') {
    const mockProfiles = {
      '1': {
        id: '1',
        prospectName: 'Lewis Cook',
        companyName: 'Catapult Print',
        status: 'Completed' as const,
        generatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
        rawAnalysis: 'Mock analysis for Lewis Cook at Catapult Print...',
        sections: {}
      },
      '2': {
        id: '2',
        prospectName: 'John Abbott',
        companyName: 'Abbott Label',
        status: 'In Progress' as const,
        generatedAt: new Date(Date.now() - 86400000).toISOString(),
        rawAnalysis: 'Mock analysis for John Abbott at Abbott Label...',
        sections: {}
      },
      '3': {
        id: '3',
        prospectName: 'Sarah Mitchell',
        companyName: 'PrintTech Solutions',
        status: 'Pending' as const,
        generatedAt: new Date().toISOString(),
        rawAnalysis: 'Mock analysis for Sarah Mitchell at PrintTech Solutions...',
        sections: {}
      }
    };
    localStorage.setItem('prospectProfiles', JSON.stringify(mockProfiles));
  }
}

export async function getTasks(): Promise<any[]> {
  const snapshot = await getDocs(collection(db, "tasks"));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}
