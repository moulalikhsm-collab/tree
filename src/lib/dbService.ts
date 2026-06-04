import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  User as FirebaseUser 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  collection, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  where, 
  getDocFromServer 
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  grade: string;
  createdAt: string;
}

export interface SowedSeed {
  seedId: string;
  userId: string;
  plantName: string;
  dateSowed: string;
  status: 'germinated' | 'growing' | 'ready-to-harvest' | 'harvested';
  soilQuality?: string;
  waterSupply?: string;
  climate?: string;
  createdAt: string;
}

export interface ActivityLog {
  logId: string;
  userId: string;
  title: string;
  description?: string;
  timestamp: string;
}

// ----------------------------------------------------
// DYNAMIC FEATURE MODE: FIREBASE DETECT ACTION
// ----------------------------------------------------
const IS_FIREBASE_ENABLED = 
  firebaseConfig && 
  firebaseConfig.apiKey && 
  firebaseConfig.apiKey !== "MOCK_AI_STUDIO_BUILD_FIREBASE_API_KEY";

let app: any = null;
export let auth: any = null;
export let db: any = null;

if (IS_FIREBASE_ENABLED) {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    console.log("Firebase is initialized with production keys.");

    // Validate Connection to Firestore on startup as mandated in instructions
    const testConnection = async () => {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration.");
        }
      }
    };
    testConnection();
  } catch (err) {
    console.error("Firebase SDK init failed, falling back to full-stack Express API.", err);
  }
} else {
  console.log("Using High-Fidelity full-stack Express Database framework (Cooperative fallback).");
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid || null,
      email: auth?.currentUser?.email || null,
      emailVerified: auth?.currentUser?.emailVerified || null,
      isAnonymous: auth?.currentUser?.isAnonymous || null,
      tenantId: auth?.currentUser?.tenantId || null,
      providerInfo: auth?.currentUser?.providerData?.map((p: any) => ({
        providerId: p.providerId,
        email: p.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Hardened Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// ----------------------------------------------------
// UNIFIED AUTHENTICATION SERVICES
// ----------------------------------------------------
export const dbService = {
  isFirebaseMode(): boolean {
    return IS_FIREBASE_ENABLED && auth !== null && db !== null;
  },

  async register(name: string, email: string, password: string, grade: string): Promise<UserProfile> {
    if (this.isFirebaseMode()) {
      try {
        // 1. Create User in Firebase Auth
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        const user = cred.user;
        
        // 2. Save User Profile in Firestore
        const profile: UserProfile = {
          uid: user.uid,
          name,
          email: email.toLowerCase(),
          grade,
          createdAt: new Date().toISOString(),
        };

        const userDocRef = doc(db, 'users', user.uid);
        await setDoc(userDocRef, profile);
        return profile;
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `users/new`);
      }
    }

    // Fallback to Express backend database
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, grade }),
    });
    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || 'Failed to register seed ledger.');
    }
    return await res.json();
  },

  async login(email: string, password: string): Promise<UserProfile> {
    if (this.isFirebaseMode()) {
      try {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        const user = cred.user;

        // Fetch profile
        const userDocRef = doc(db, 'users', user.uid);
        // Using snapshot style to read profile
        const snap = await getDocs(query(collection(db, 'users'), where('uid', '==', user.uid)));
        if (snap.empty) {
          // If profile doc is missing in Firestore, recreate
          const fallbackProfile: UserProfile = {
            uid: user.uid,
            name: email.split('@')[0],
            email: email,
            grade: 'Beginner Grade 6',
            createdAt: new Date().toISOString(),
          };
          await setDoc(userDocRef, fallbackProfile);
          return fallbackProfile;
        }
        return snap.docs[0].data() as UserProfile;
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, `users/login`);
      }
    }

    // Fallback to Express backend database
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || 'Invalid profile credential matching.');
    }
    return await res.json();
  },

  async logout(): Promise<void> {
    if (this.isFirebaseMode()) {
      await signOut(auth);
    }
  },

  // ----------------------------------------------------
  // UNIFIED DATABASE SEEDS PERSISTENCE
  // ----------------------------------------------------
  async fetchSeeds(userId: string): Promise<SowedSeed[]> {
    if (this.isFirebaseMode()) {
      const colPath = `users/${userId}/seeds`;
      try {
        const q = collection(db, 'users', userId, 'seeds');
        const snap = await getDocs(q);
        return snap.docs.map(doc => doc.data() as SowedSeed);
      } catch (err) {
        handleFirestoreError(err, OperationType.LIST, colPath);
      }
    }

    // Fallback Express backend
    const res = await fetch('/api/db/seeds', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
    if (!res.ok) throw new Error('Failed to retrieve sowed seed register.');
    return await res.json();
  },

  async createSeed(userId: string, plantName: string, soilQuality: string, waterSupply: string, climate: string, status?: 'germinated' | 'growing' | 'ready-to-harvest' | 'harvested'): Promise<SowedSeed> {
    if (this.isFirebaseMode()) {
      const seedId = 'seed_' + Math.random().toString(36).substr(2, 9);
      const colPath = `users/${userId}/seeds/${seedId}`;
      try {
        const newSeed: SowedSeed = {
          seedId,
          userId,
          plantName,
          dateSowed: new Date().toISOString(),
          status: status || 'germinated',
          soilQuality,
          waterSupply,
          climate,
          createdAt: new Date().toISOString(),
        };

        const docRef = doc(db, 'users', userId, 'seeds', seedId);
        await setDoc(docRef, newSeed);
        return newSeed;
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, colPath);
      }
    }

    // Fallback Express backend
    const res = await fetch('/api/db/seed/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, plantName, soilQuality, waterSupply, climate, status }),
    });
    if (!res.ok) throw new Error('Failed to persist sowed seed ledger.');
    return await res.json();
  },

  async updateSeed(seedId: string, userId: string, fields: Partial<Pick<SowedSeed, 'status' | 'soilQuality' | 'waterSupply' | 'climate'>>): Promise<SowedSeed> {
    if (this.isFirebaseMode()) {
      const colPath = `users/${userId}/seeds/${seedId}`;
      try {
        const docRef = doc(db, 'users', userId, 'seeds', seedId);
        await updateDoc(docRef, fields);
        // Fetch and return the updated seed
        const snap = await getDocs(query(collection(db, 'users', userId, 'seeds'), where('seedId', '==', seedId)));
        return snap.docs[0].data() as SowedSeed;
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, colPath);
      }
    }

    // Fallback Express backend
    const res = await fetch('/api/db/seed/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ seedId, userId, ...fields }),
    });
    if (!res.ok) throw new Error('Failed to update plant growth cycle.');
    return await res.json();
  },

  async deleteSeed(seedId: string, userId: string): Promise<boolean> {
    if (this.isFirebaseMode()) {
      const colPath = `users/${userId}/seeds/${seedId}`;
      try {
        const docRef = doc(db, 'users', userId, 'seeds', seedId);
        await deleteDoc(docRef);
        return true;
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, colPath);
      }
    }

    // Fallback Express backend
    const res = await fetch('/api/db/seed/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ seedId, userId }),
    });
    if (!res.ok) return false;
    const body = await res.json();
    return body.success;
  },

  // ----------------------------------------------------
  // UNIFIED GARDENING ACTIVITY LOGS PERSISTENCE
  // ----------------------------------------------------
  async fetchLogs(userId: string): Promise<ActivityLog[]> {
    if (this.isFirebaseMode()) {
      const colPath = `users/${userId}/logs`;
      try {
        const q = collection(db, 'users', userId, 'logs');
        const snap = await getDocs(q);
        return snap.docs.map(doc => doc.data() as ActivityLog);
      } catch (err) {
        handleFirestoreError(err, OperationType.LIST, colPath);
      }
    }

    // Fallback Express backend
    const res = await fetch('/api/db/logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
    if (!res.ok) throw new Error('Failed to load botanical ledger activity log.');
    return await res.json();
  },

  async createLog(userId: string, title: string, description?: string): Promise<ActivityLog> {
    if (this.isFirebaseMode()) {
      const logId = 'log_' + Math.random().toString(36).substr(2, 9);
      const colPath = `users/${userId}/logs/${logId}`;
      try {
        const newLog: ActivityLog = {
          logId,
          userId,
          title,
          description: description || '',
          timestamp: new Date().toISOString(),
        };

        const docRef = doc(db, 'users', userId, 'logs', logId);
        await setDoc(docRef, newLog);
        return newLog;
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, colPath);
      }
    }

    // Fallback Express backend
    const res = await fetch('/api/db/log/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, title, description }),
    });
    if (!res.ok) throw new Error('Failed to update activities book.');
    return await res.json();
  },

  listenSeeds(userId: string, callback: (seeds: SowedSeed[]) => void): () => void {
    if (this.isFirebaseMode()) {
      const q = collection(db, 'users', userId, 'seeds');
      return onSnapshot(q, (snapshot) => {
        const seedsList = snapshot.docs.map(doc => doc.data() as SowedSeed);
        callback(seedsList);
      }, (error) => {
        handleFirestoreError(error, OperationType.LIST, `users/${userId}/seeds`);
      });
    }

    // Express Polling simulation to keep UI perfectly real-time
    let active = true;
    const poll = async () => {
      while (active) {
        try {
          const seeds = await this.fetchSeeds(userId);
          callback(seeds);
        } catch (e) {
          console.warn("Polling seeds error:", e);
        }
        await new Promise(r => setTimeout(r, 4000));
      }
    };
    poll();
    return () => { active = false; };
  },

  listenLogs(userId: string, callback: (logs: ActivityLog[]) => void): () => void {
    if (this.isFirebaseMode()) {
      const q = collection(db, 'users', userId, 'logs');
      return onSnapshot(q, (snapshot) => {
        const logsList = snapshot.docs.map(doc => doc.data() as ActivityLog);
        callback(logsList);
      }, (error) => {
        handleFirestoreError(error, OperationType.LIST, `users/${userId}/logs`);
      });
    }

    // Express Polling simulation to keep UI perfectly real-time
    let active = true;
    const poll = async () => {
      while (active) {
        try {
          const logs = await this.fetchLogs(userId);
          callback(logs);
        } catch (e) {
          console.warn("Polling logs error:", e);
        }
        await new Promise(r => setTimeout(r, 4500));
      }
    };
    poll();
    return () => { active = false; };
  }
};
