import { useState } from "react";

import {
    Eye,
    EyeOff,
    Lock,
    User,
    Utensils
} from "lucide-react";

import {
    Link,
    useLocation,
    useNavigate
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { loginUser } from "../services/authService";


function Login() {

    const navigate = useNavigate();
    const location = useLocation();

    const { login } = useAuth();


    const [form, setForm] = useState({
        username: "",
        password: ""
    });


    const [showPassword, setShowPassword] =
        useState(false);


    const [loading, setLoading] =
        useState(false);


    const [error, setError] =
        useState("");


    // ==========================================
    // HANDLE INPUT
    // ==========================================

    const handleChange = (event) => {

        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value
        }));

    };


    // ==========================================
    // LOGIN
    // ==========================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");


        if (
            !form.username.trim() ||
            !form.password
        ) {

            setError(
                "Please enter username and password."
            );

            return;
        }


        try {

            setLoading(true);


            const response = await loginUser({
                username: form.username.trim(),
                password: form.password
            });


            // console.log(
            //     "Login Response:",
            //     response
            // );


            // Get user from backend response
            const userData = response?.user;


            if (!userData) {

                setError(
                    "Invalid login response from server."
                );

                return;
            }


            // JWT is stored in HTTP-only cookie
            login(userData);


            // Redirect user
            const from =
                location.state?.from;


            navigate(
                typeof from === "string"
                    ? from
                    : "/"
            );


        } catch (error) {

            console.error(
                "Login Error:",
                error.response?.data ||
                error.message
            );


            setError(
                error.response?.data?.message ||
                "Invalid username or password."
            );


        } finally {

            setLoading(false);

        }

    };


    return (

        <div
            className="
                flex
                min-h-[calc(100vh-64px)]
                items-center
                justify-center
                bg-stone-50
                px-4
                py-12
            "
        >

            <div className="w-full max-w-md">


                {/* =================================
                    BRAND
                ================================= */}

                <div className="mb-8 text-center">

                    <div
                        className="
                            mx-auto
                            flex
                            h-14
                            w-14
                            items-center
                            justify-center
                            rounded-2xl
                            bg-red-600
                            text-white
                        "
                    >
                        <Utensils size={25} />
                    </div>


                    <h1
                        className="
                            mt-4
                            text-2xl
                            font-black
                            text-stone-900
                        "
                    >
                        Welcome Back
                    </h1>


                    <p
                        className="
                            mt-1
                            text-sm
                            text-stone-500
                        "
                    >
                        Login to order from Arora Da Dhabha
                    </p>

                </div>



                {/* =================================
                    LOGIN CARD
                ================================= */}

                <div
                    className="
                        rounded-2xl
                        border
                        border-stone-200
                        bg-white
                        p-6
                        shadow-sm
                        sm:p-8
                    "
                >


                    {/* ERROR */}

                    {error && (

                        <div
                            className="
                                mb-5
                                rounded-xl
                                border
                                border-red-200
                                bg-red-50
                                px-4
                                py-3
                                text-sm
                                text-red-700
                            "
                        >
                            {error}
                        </div>

                    )}



                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >


                        {/* =================================
                            USERNAME
                        ================================= */}

                        <div>

                            <label
                                className="
                                    mb-2
                                    block
                                    text-sm
                                    font-semibold
                                    text-stone-700
                                "
                            >
                                Username
                            </label>


                            <div className="relative">

                                <User
                                    size={18}
                                    className="
                                        absolute
                                        left-3
                                        top-1/2
                                        -translate-y-1/2
                                        text-stone-400
                                    "
                                />


                                <input
                                    type="text"
                                    name="username"
                                    value={form.username}
                                    onChange={handleChange}
                                    placeholder="Enter username"
                                    autoComplete="username"
                                    required
                                    className="
                                        w-full
                                        rounded-xl
                                        border
                                        border-stone-200
                                        bg-white
                                        py-3
                                        pl-10
                                        pr-4
                                        text-sm
                                        outline-none
                                        transition
                                        focus:border-red-500
                                        focus:ring-2
                                        focus:ring-red-100
                                    "
                                />

                            </div>

                        </div>



                        {/* =================================
                            PASSWORD
                        ================================= */}

                        <div>

                            <label
                                className="
                                    mb-2
                                    block
                                    text-sm
                                    font-semibold
                                    text-stone-700
                                "
                            >
                                Password
                            </label>


                            <div className="relative">

                                <Lock
                                    size={18}
                                    className="
                                        absolute
                                        left-3
                                        top-1/2
                                        -translate-y-1/2
                                        text-stone-400
                                    "
                                />


                                <input
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="Enter password"
                                    autoComplete="current-password"
                                    required
                                    className="
                                        w-full
                                        rounded-xl
                                        border
                                        border-stone-200
                                        bg-white
                                        py-3
                                        pl-10
                                        pr-11
                                        text-sm
                                        outline-none
                                        focus:border-red-500
                                        focus:ring-2
                                        focus:ring-red-100
                                    "
                                />


                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(
                                            !showPassword
                                        )
                                    }
                                    className="
                                        absolute
                                        right-3
                                        top-1/2
                                        -translate-y-1/2
                                        text-stone-400
                                        hover:text-stone-700
                                    "
                                >

                                    {showPassword ? (
                                        <EyeOff size={18} />
                                    ) : (
                                        <Eye size={18} />
                                    )}

                                </button>

                            </div>

                        </div>



                        {/* =================================
                            LOGIN BUTTON
                        ================================= */}

                        <button
                            type="submit"
                            disabled={loading}
                            className="
                                flex
                                w-full
                                items-center
                                justify-center
                                rounded-xl
                                bg-red-600
                                px-5
                                py-3.5
                                text-sm
                                font-bold
                                text-white
                                transition
                                hover:bg-red-700
                                disabled:cursor-not-allowed
                                disabled:opacity-60
                            "
                        >

                            {loading
                                ? "Logging in..."
                                : "Login"
                            }

                        </button>

                    </form>



                    {/* REGISTER */}

                    <p
                        className="
                            mt-6
                            text-center
                            text-sm
                            text-stone-500
                        "
                    >

                        Don't have an account?{" "}

                        <Link
                            to="/register"
                            className="
                                font-bold
                                text-red-600
                                hover:text-red-700
                            "
                        >
                            Create account
                        </Link>

                    </p>

                </div>

            </div>

        </div>
    );
}


export default Login;