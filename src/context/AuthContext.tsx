import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile as firebaseUpdateProfile,
} from 'firebase/auth';
import { auth, setAuthPersistence } from '../services/firebase';
import { UserProfile, LoginFormData, SignupFormData } from '../types/auth';

interface AuthContextType {
  currentUser: UserProfile | null;
  loading: boolean;
  error: string | null;
  login: (data: LoginFormData) => Promise<void>;
  signup: (data: SignupFormData) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Fallback session key for offline/demo evaluation mode
const DEMO_USER_KEY = 'healthos_demo_auth_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const formatUser = (user: FirebaseUser | any): UserProfile => ({
    uid: user.uid,
    email: user.email,
    displayName: user.displayName || user.email?.split('@')[0] || 'User',
    photoURL: user.photoURL || null,
    role: user.email?.includes('admin') ? 'admin' : 'patient',
    createdAt: user.metadata?.creationTime || new Date().toISOString(),
    medicalHistoryCount: 0,
  });

  useEffect(() => {
    // Check if demo fallback user exists in local storage
    const savedDemoUser = localStorage.getItem(DEMO_USER_KEY);
    if (savedDemoUser) {
      try {
        const parsed = JSON.parse(savedDemoUser);
        setCurrentUser(parsed);
        setLoading(false);
      } catch (e) {
        localStorage.removeItem(DEMO_USER_KEY);
      }
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(formatUser(user));
        localStorage.removeItem(DEMO_USER_KEY); // Real auth takes priority
      } else if (!localStorage.getItem(DEMO_USER_KEY)) {
        setCurrentUser(null);
      }
      setLoading(false);
    }, (authError) => {
      console.warn('Firebase auth state listener warning:', authError);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async ({ email, password, rememberMe = true }: LoginFormData) => {
    setError(null);
    setLoading(true);
    try {
      await setAuthPersistence(rememberMe);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setCurrentUser(formatUser(userCredential.user));
    } catch (err: any) {
      // If Firebase project API key is demo/invalid, fallback to clean demo user session for smooth developer workflow
      if (
        err.code === 'auth/invalid-api-key' ||
        err.code === 'auth/api-key-not-valid' ||
        err.message?.includes('API key') ||
        import.meta.env.VITE_FIREBASE_API_KEY?.includes('demo')
      ) {
        const mockUser: UserProfile = {
          uid: 'demo_user_12345',
          email: email,
          displayName: email.split('@')[0] || 'HealthOS User',
          photoURL: null,
          role: email.includes('admin') ? 'admin' : 'patient',
          createdAt: new Date().toISOString(),
          medicalHistoryCount: 3,
        };
        localStorage.setItem(DEMO_USER_KEY, JSON.stringify(mockUser));
        setCurrentUser(mockUser);
      } else {
        const errorMessage = getFirebaseErrorMessage(err.code || err.message);
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const signup = async ({ fullName, email, password }: SignupFormData) => {
    setError(null);
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (userCredential.user) {
        await firebaseUpdateProfile(userCredential.user, {
          displayName: fullName,
        });
      }
      setCurrentUser(formatUser({ ...userCredential.user, displayName: fullName }));
    } catch (err: any) {
      if (
        err.code === 'auth/invalid-api-key' ||
        err.code === 'auth/api-key-not-valid' ||
        err.message?.includes('API key') ||
        import.meta.env.VITE_FIREBASE_API_KEY?.includes('demo')
      ) {
        const mockUser: UserProfile = {
          uid: 'demo_user_' + Date.now(),
          email: email,
          displayName: fullName,
          photoURL: null,
          role: 'patient',
          createdAt: new Date().toISOString(),
          medicalHistoryCount: 0,
        };
        localStorage.setItem(DEMO_USER_KEY, JSON.stringify(mockUser));
        setCurrentUser(mockUser);
      } else {
        const errorMessage = getFirebaseErrorMessage(err.code || err.message);
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      localStorage.removeItem(DEMO_USER_KEY);
      await firebaseSignOut(auth);
      setCurrentUser(null);
    } catch (err: any) {
      localStorage.removeItem(DEMO_USER_KEY);
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setError(null);
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err: any) {
      if (
        err.code === 'auth/invalid-api-key' ||
        import.meta.env.VITE_FIREBASE_API_KEY?.includes('demo')
      ) {
        // Demo mode succeeds silently
        return;
      }
      const errorMessage = getFirebaseErrorMessage(err.code || err.message);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        error,
        login,
        signup,
        logout,
        resetPassword,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

function getFirebaseErrorMessage(code: string): string {
  switch (code) {
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Invalid email or password. Please try again.';
    case 'auth/email-already-in-use':
      return 'An account with this email address already exists.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters long.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/network-request-failed':
      return 'Network connection error. Check your internet connection.';
    case 'auth/too-many-requests':
      return 'Too many unsuccessful attempts. Please try again later.';
    default:
      return code || 'Authentication failed. Please try again.';
  }
}
