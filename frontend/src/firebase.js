import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAifib4T3dAxk2VyeuIHSB_SKv2OLm_Be8",
  authDomain: "fir-195dc.firebaseapp.com",
  projectId: "fir-195dc",
  storageBucket: "fir-195dc.firebasestorage.app",
  messagingSenderId: "141386583783",
  appId: "1:141386583783:web:31ab97953e875bf6659c42",
  measurementId: "G-ZTF2YZ0FTJ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();

// Sign in with Google — returns the Google ID token
export const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  const idToken = await result.user.getIdToken();
  return idToken;
};

// Sign in with GitHub — returns the GitHub access token
export const signInWithGithub = async () => {
  const result = await signInWithPopup(auth, githubProvider);
  // GitHub credential gives us the access token
  const credential = GithubAuthProvider.credentialFromResult(result);
  return credential.accessToken;
};

export const firebaseSignOut = () => signOut(auth);
