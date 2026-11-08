import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode
} from "react";
import { apiFetch } from "../functions/api";
import type { UserResponse } from "../types/types";

type AuthStatus =
    | "loading"
    | "authenticated"
    | "unauthenticated";

interface AuthContextType {
    status: AuthStatus;
    user: UserResponse | null;
    checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [status, setStatus] = useState<AuthStatus>("loading");
    const [user, setUser] = useState<UserResponse | null>(null);

    const checkAuth = async () => {
        try {
            const response = await apiFetch<UserResponse>("client/users/me", {
                credentials: "include"
            });

            if (response.id) {
                setUser(response);
                setStatus("authenticated");
            } else {
                setUser(null);
                setStatus("unauthenticated");
            }
        } catch (error: any) {
            if (error.status === 401) {
                setStatus("unauthenticated");
            }
            if (error.status >= 500) {
            }
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);


    return (
        <AuthContext.Provider value={{ status, user, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used inside AuthProvider");
    return context;
}