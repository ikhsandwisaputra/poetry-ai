// src/firebase/client.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword as firebaseCreateUser,
  signInWithEmailAndPassword as firebaseSignIn,
  type User as FirebaseUser,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

// initialize only once
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app); // Ekspor database

export const googleProvider = new GoogleAuthProvider();

/**
 * Sign in with Google using popup
 */
export async function signInWithGooglePopup() {
  try {
    const credential = await signInWithPopup(auth, googleProvider);
    return credential; // caller can inspect credential.user
  } catch (error) {
    throw error;
  }
}

/**
 * Sign out
 */
export async function signOutUser() {
  return firebaseSignOut(auth);
}

/**
 * Fungsi baru untuk registrasi dengan email dan password
 */
export async function createUser(email: string, password: any) {
  return firebaseCreateUser(auth, email, password);
}

/**
 * Fungsi baru untuk login dengan email dan password
 */
export async function signIn(email: string, password: any) {
  return firebaseSignIn(auth, email, password);
}

export type User = FirebaseUser | null;