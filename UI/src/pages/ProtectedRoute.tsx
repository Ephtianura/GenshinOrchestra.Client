import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import { Mosaic } from "react-loading-indicators";

export function ProtectedRoute() {
    const { status } = useAuth();
    const location = useLocation();

    if (status === "loading")
        return (
            <div className="rotate-45 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <Mosaic
                    // Индиго, лавандовый, золотистый, голубой, стальной, серый.
                    // color={["#545490", "#8A87A0", "#D6B86A", "#6FC2FD", "#8A9EBA", "#424146"]}

                    //Синий, жёлтый, голубой, серый
                    color={["#545490", "#D6B86A", "#6FC2FD", "#424146"]}
                    size="large"
                    speedPlus={-2}
                />
            </div>
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