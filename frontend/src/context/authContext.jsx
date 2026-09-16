import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";


const AuthContext = createContext(null);


export function AuthProvider({ children }) {

    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);


    // ==========================================
    // LOAD USER FROM LOCAL STORAGE
    // ==========================================

    useEffect(() => {

        try {

            const storedUser =
                localStorage.getItem("user");


            // No user stored
            if (
                !storedUser ||
                storedUser === "undefined" ||
                storedUser === "null"
            ) {

                localStorage.removeItem("user");

                setUser(null);

                return;
            }


            const parsedUser =
                JSON.parse(storedUser);


            // Make sure parsed value is an object
            if (
                parsedUser &&
                typeof parsedUser === "object"
            ) {

                setUser(parsedUser);

            } else {

                localStorage.removeItem("user");

                setUser(null);

            }

        } catch (error) {

            console.error(
                "Auth Load Error:",
                error
            );

            // Remove corrupted user data
            localStorage.removeItem("user");

            setUser(null);

        } finally {

            setLoading(false);

        }

    }, []);


    // ==========================================
    // LOGIN
    // ==========================================

    const login = (
        userData,
        token
    ) => {

        localStorage.setItem(
            "user",
            JSON.stringify(userData)
        );

        localStorage.setItem(
            "token",
            token
        );

        setUser(userData);
    };


    // ==========================================
    // LOGOUT
    // ==========================================

    const logout = () => {

        localStorage.removeItem("user");

        localStorage.removeItem("token");

        setUser(null);
    };


    // ==========================================
    // UPDATE USER
    // ==========================================

    const updateUser = (userData) => {

        localStorage.setItem(
            "user",
            JSON.stringify(userData)
        );

        setUser(userData);
    };


    return (
        <AuthContext.Provider
            value={{

                user,

                setUser,

                login,

                logout,

                updateUser,

                loading,

                isAuthenticated:
                    Boolean(user),

                isAdmin:
                    user?.role === "admin"

            }}
        >

            {children}

        </AuthContext.Provider>
    );
}


export function useAuth() {

    return useContext(AuthContext);
}