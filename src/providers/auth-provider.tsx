"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// User interface update
interface User {
    id: string;
    email: string;
    name: string | null;
    role: string;
    avatar?: string | null;
    image?: string | null;
    phone?: string | null;
    location?: string | null; // Added location
    createdAt: string;
    subscriptionStatus?: string | null;
    subscriptionEndsAt?: Date | string | null;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const fetchUser = async () => {
        try {
            const response = await fetch("/api/auth/me");
            if (response.ok) {
                const data = await response.json();
                setUser(data.user);
            } else if (response.status === 401) {
                // Only clear user if explicitly unauthorized
                setUser(null);
            } else {
                // For other errors (500, etc), do nothing or log error
                // keeping the user session potentially valid in client memory
                // or let the user retry. Do NOT log out.
                console.warn("Error fetching user session:", response.status);
            }
        } catch (error) {
            console.error("Error fetching user (network?):", error);
            // Do NOT log out on network error
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const logout = async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" });
            setUser(null);
            router.push("/login");
            router.refresh();
            toast.success("Sesión cerrada correctamente");
        } catch (error) {
            console.error("Error logging out:", error);
            toast.error("Error al cerrar sesión");
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, logout, refreshUser: fetchUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        // Return default context during SSR/build time instead of throwing
        // This allows error boundaries to render without crashing
        return {
            user: null,
            isLoading: true,
            logout: async () => {},
            refreshUser: async () => {}
        };
    }
    return context;
}
