import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged, signOut as firebaseSignOut, signInWithEmailAndPassword, User, setPersistence, browserLocalPersistence, browserSessionPersistence } from 'firebase/auth';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';

interface UserProfile {
  id: string;
  email: string | null;
  fullName: string | null;
  phone?: string | null;
  role: 'user' | 'vip' | 'admin';
  isVip: boolean;
  vipExpiry?: any;
  vipPackage?: string;
  vipStartDate?: any;
  notificationSettings?: {
    email: boolean;
    browser: boolean;
    onlyVip: boolean;
  };
  favoriteTracks?: string[];
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  signIn: (email: string, pass: string, rememberMe?: boolean) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signOut: async () => {},
  signIn: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeProfile: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      // Cleanup previous profile listener if it exists
      if (unsubscribeProfile) {
        unsubscribeProfile();
        unsubscribeProfile = null;
      }

      if (firebaseUser) {
        // We know the user is logged in, stop the 'loading' state immediately so UI unblocks
        setLoading(false);
        
        // Listen for profile changes
        unsubscribeProfile = onSnapshot(doc(db, 'users', firebaseUser.uid), (docSnap) => {
          if (docSnap.exists()) {
            setProfile({ id: docSnap.id, ...docSnap.data() } as UserProfile);
          } else {
            console.warn('No firestore profile found for user', firebaseUser.uid);
            // Default profile creation if missing
            setProfile({
               id: firebaseUser.uid,
               email: firebaseUser.email,
               fullName: firebaseUser.email,
               role: 'user',
               isVip: false
            });
          }
        }, (error) => {
          console.error('Profile snapshot error:', error);
          // Fallback profile if rules completely block access
          setProfile({
             id: firebaseUser.uid,
             email: firebaseUser.email,
             fullName: firebaseUser.email,
             role: 'user',
             isVip: false
          });
        });
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    // Cleanup auth listener and any active profile listeners
    return () => {
      if (unsubscribeProfile) unsubscribeProfile();
      unsubscribeAuth();
    };
  }, []);

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  const signIn = async (email: string, pass: string, rememberMe: boolean = false) => {
    // Set persistence type before logging in
    await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
    await signInWithEmailAndPassword(auth, email, pass);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut, signIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
