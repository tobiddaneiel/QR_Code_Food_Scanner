import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail
} from "firebase/auth";

// SIGN UP
export const signup = async (email, password) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  return userCredential.user;
};

// LOGIN
export const login = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  return userCredential.user;
};

// RESET PASSWORD
export const resetPassword = async (email) => {
  return sendPasswordResetEmail(auth, email);
};

// LOGOUT
export const logout = async () => {
  await signOut(auth);
};
