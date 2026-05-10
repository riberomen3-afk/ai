import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { 
  collection, 
  query, 
  onSnapshot, 
  setDoc, 
  doc, 
  deleteDoc,
  serverTimestamp,
  orderBy
} from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { TeamCore } from '../types';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
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
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

interface FirebaseContextType {
  user: User | null;
  loading: boolean;
  teams: TeamCore[];
  saveTeam: (team: TeamCore) => Promise<void>;
  deleteTeam: (teamId: string) => Promise<void>;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [teams, setTeams] = useState<TeamCore[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currUser) => {
      setUser(currUser);
      setLoading(false);
      
      if (currUser) {
        // Save user info to firestore
        const userRef = doc(db, `users/${currUser.uid}`);
        try {
          await setDoc(userRef, {
            uid: currUser.uid,
            email: currUser.email,
            displayName: currUser.displayName,
            photoURL: currUser.photoURL,
            updatedAt: serverTimestamp()
          }, { merge: true });
        } catch (error) {
          console.error("Failed to sync user profile:", error);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setTeams([]);
      return;
    }

    const path = `users/${user.uid}/teams`;
    const q = query(collection(db, path), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const teamsData: TeamCore[] = [];
      snapshot.forEach((doc) => {
        teamsData.push(doc.data() as TeamCore);
      });
      setTeams(teamsData);
    }, (error) => {
      // Still load what we have even if error
      handleFirestoreError(error, OperationType.LIST, path);
    });

    return () => unsubscribe();
  }, [user]);

  const saveTeam = async (team: TeamCore) => {
    if (!user) return;
    const path = `users/${user.uid}/teams/${team.id}`;
    try {
      await setDoc(doc(db, path), {
        ...team,
        ownerId: user.uid,
        createdAt: team.createdAt || serverTimestamp(),
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  const deleteTeam = async (teamId: string) => {
    if (!user) return;
    const path = `users/${user.uid}/teams/${teamId}`;
    try {
      await deleteDoc(doc(db, path));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  return (
    <FirebaseContext.Provider value={{ user, loading, teams, saveTeam, deleteTeam }}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};
