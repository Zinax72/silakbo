import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  confirmPasswordReset,
  verifyPasswordResetCode,
} from "firebase/auth";

import { auth, provider } from "../lib/firebase";

export const register = async (email, password, fullName) => {
    const response = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(response.user, { displayName: fullName });
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

export const resetPassword = async (email) => {
    const actionCodeSettings = {
        url: `${window.location.origin}/ResetPassword`,
        handleCodeInApp: true,
    };
    const response = await sendPasswordResetEmail(auth, email, actionCodeSettings);
    return response;
}

export const verifyResetCode = async (oobCode) => {
    return await verifyPasswordResetCode(auth, oobCode);
}

export const confirmReset = async (oobCode, newPassword) => {
    const response = await confirmPasswordReset(auth, oobCode, newPassword);
    return response;
}

