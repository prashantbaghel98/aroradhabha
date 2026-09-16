import {
    Navigate,
    useLocation
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import Loading from "./Loading";

function ProtectedRoute({
    children,
    adminOnly = false
}) {

    const {
        user,
        loading,
        isAuthenticated,
        isAdmin
    } = useAuth();

    const location = useLocation();


    /*
    |--------------------------------------------------------------------------
    | Loading
    |--------------------------------------------------------------------------
    */

    if (loading) {

        return (
            <Loading
                fullScreen
                text="Checking authentication..."
            />
        );

    }


    /*
    |--------------------------------------------------------------------------
    | Not Logged In
    |--------------------------------------------------------------------------
    */

    if (!isAuthenticated) {

        return (
            <Navigate
                to="/login"
                replace
                state={{
                    from: location.pathname +
                        location.search
                }}
            />
        );

    }


    /*
    |--------------------------------------------------------------------------
    | Admin Protection
    |--------------------------------------------------------------------------
    */

    if (adminOnly && !isAdmin) {

        return (
            <Navigate
                to="/"
                replace
            />
        );

    }


    /*
    |--------------------------------------------------------------------------
    | Authorized
    |--------------------------------------------------------------------------
    */

    return children;
}

export default ProtectedRoute;