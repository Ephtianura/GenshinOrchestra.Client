import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import { LoadingScreen } from "../components/LoadingScreen";

export function ProtectedRoute() {
    const { status } = useAuth();
    const location = useLocation();

    if (status === "loading")
        return (
            <LoadingScreen />
        );
    if (status === "unauthenticated") {
        return (
            <Navigate
                to="/login"
                replace
                state={{ from: location }}
            />
        );
    }

    return <Outlet />;
}