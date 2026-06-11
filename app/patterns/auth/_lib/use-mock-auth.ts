"use client";

import * as React from "react";

const STORAGE_KEY = "gunjo-showcase-auth";

export interface MockAuthState {
    email: string;
    plan: "free" | "standard" | "team";
    name: string;
}

interface UseMockAuth {
    user: MockAuthState | null;
    signIn: (state: MockAuthState) => void;
    signOut: () => void;
    hydrated: boolean;
}

function readStorage(): MockAuthState | null {
    if (typeof window === "undefined") return null;
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (typeof parsed?.email !== "string") return null;
        return parsed as MockAuthState;
    } catch {
        return null;
    }
}

export function useMockAuth(): UseMockAuth {
    const [user, setUser] = React.useState<MockAuthState | null>(null);
    const [hydrated, setHydrated] = React.useState(false);

    React.useEffect(() => {
        setUser(readStorage());
        setHydrated(true);
    }, []);

    const signIn = React.useCallback((state: MockAuthState) => {
        setUser(state);
        try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch {
            // Storage may be disabled — fail silently.
        }
    }, []);

    const signOut = React.useCallback(() => {
        setUser(null);
        try {
            window.localStorage.removeItem(STORAGE_KEY);
        } catch {
            // Storage may be disabled — fail silently.
        }
    }, []);

    return { user, signIn, signOut, hydrated };
}
