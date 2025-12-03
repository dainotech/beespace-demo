"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import { useRouter } from "next/navigation";

type AuthContextType = {
    user: User | null;
    loading: boolean;
    error: string | null;
    signInWithGoogle: () => Promise<void>;
    signInWithEmail: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    error: null,
    signInWithGoogle: async () => { },
    signInWithEmail: async () => { },
    signOut: async () => { },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signInWithGoogle = async () => {
        setError(null);
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            router.push("/dashboard");
        } catch (error: any) {
            console.error("Error signing in with Google", error);
            setError(error.message || "Failed to sign in");
        }
    };

    const signInWithEmail = async (email: string, password: string) => {
        setError(null);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push("/dashboard");
        } catch (error: any) {
            console.error("Error signing in with Email", error);
            setError(error.message || "Failed to sign in");
        }
    };

    const signOut = async () => {
        try {
            await firebaseSignOut(auth);
            router.push("/login");
        } catch (error) {
            console.error("Error signing out", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, error, signInWithGoogle, signInWithEmail, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
