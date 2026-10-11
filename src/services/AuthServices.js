import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { auth, provider } from "../lib/firebase";

export const register = async (email, password) => {
    const response = await createUserWithEmailAndPassword(auth, email, password);
    return response;
}

export const login = async (email, password) => {
    const response = await signInWithEmailAndPassword(auth, email, password);
    return response;
}

export const googleSignIn = async () => {
    const response = await signInWithPopup(auth, provider);
    return response;
}

export const logout = async () => {
    const response = await signOut(auth);
    return response;
}