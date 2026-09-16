import { useState } from "react";

import {
    Eye,
    EyeOff,
    Lock,
    Mail,
    User,
    Utensils
} from "lucide-react";

import {
    Link,
    useNavigate
} from "react-router-dom";

import { registerUser } from "../services/authService";


function Register() {

    const navigate = useNavigate();


    // ==========================================
    // FORM STATE
    // ==========================================

    const [form, setForm] = useState({
        username: "",
        email: "",
        password: ""
    });


    const [confirmPassword, setConfirmPassword] =
        useState("");


    // ==========================================
    // UI STATE
    // ==========================================

    const [showPassword, setShowPassword] =
        useState(false);


    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);


    const [loading, setLoading] =
        useState(false);


    const [error, setError] =
        useState("");


    const [success, setSuccess] =
        useState("");


    // ==========================================
    // HANDLE INPUT CHANGE
    // ==========================================

    const handleChange = (event) => {

        const { name, value } =
            event.target;


        setForm((previous) => ({
            ...previous,
            [name]: value
        }));

    };


    // ==========================================
    // HANDLE REGISTER
    // ==========================================

    const handleSubmit = async (event) => {

        event.preventDefault();


        setError("");
        setSuccess("");


        // ------------------------------------------
        // Clean values
        // ------------------------------------------

        const username =
            form.username.trim();


        const email =
            form.email.trim().toLowerCase();


        const password =
            form.password;


        // ------------------------------------------
        // Required validation
        // ------------------------------------------

        if (
            !username ||
            !email ||
            !password ||
            !confirmPassword
        ) {

            setError(
                "Please fill all required fields."
            );

            return;
        }


        // ------------------------------------------
        // Username validation
        // ------------------------------------------

        if (username.length < 3) {

            setError(
                "Username must be at least 3 characters."
            );

            return;
        }


        // ------------------------------------------
        // Email validation
        // ------------------------------------------

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (!emailRegex.test(email)) {

            setError(
                "Please enter a valid email address."
            );

            return;
        }


        // ------------------------------------------
        // Password validation
        // ------------------------------------------

        if (password.length < 6) {

            setError(
                "Password must be at least 6 characters."
            );

            return;
        }


        // ------------------------------------------
        // Confirm password
        // ------------------------------------------

        if (
            password !== confirmPassword
        ) {

            setError(
                "Passwords do not match."
            );

            return;
        }


        try {

            setLoading(true);


            // --------------------------------------
            // Register user
            // --------------------------------------

            const response =
                await registerUser({
                    username,
                    email,
                    password
                });


            // console.log(
            //     "Register Response:",
            //     response
            // );


            // --------------------------------------
            // Success
            // --------------------------------------

            setSuccess(
                response?.message ||
                "Account created successfully. Redirecting to login..."
            );


            // --------------------------------------
            // Redirect
            // --------------------------------------

            setTimeout(() => {

                navigate(
                    "/login",
                    {
                        replace: true
                    }
                );

            }, 1200);


        } catch (error) {

            console.error(
                "Registration Error:",
                error.response?.data ||
                error.message
            );


            setError(
                error.response?.data?.message ||
                "Registration failed. Please try again."
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


                {/* ======================================
                    BRAND
                ====================================== */}

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
                            shadow-sm
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
                        Create Account
                    </h1>


                    <p
                        className="
                            mt-1
                            text-sm
                            text-stone-500
                        "
                    >
                        Join Arora Da Dhabha today
                    </p>

                </div>



                {/* ======================================
                    REGISTER CARD
                ====================================== */}

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


                    {/* ==================================
                        ERROR MESSAGE
                    ================================== */}

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



                    {/* ==================================
                        SUCCESS MESSAGE
                    ================================== */}

                    {success && (

                        <div
                            className="
                                mb-5
                                rounded-xl
                                border
                                border-green-200
                                bg-green-50
                                px-4
                                py-3
                                text-sm
                                text-green-700
                            "
                        >

                            {success}

                        </div>

                    )}



                    {/* ==================================
                        FORM
                    ================================== */}

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >


                        {/* =================================
                            USERNAME
                        ================================= */}

                        <div>

                            <label
                                htmlFor="username"
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
                                    id="username"
                                    type="text"
                                    name="username"
                                    value={form.username}
                                    onChange={handleChange}
                                    placeholder="Choose a username"
                                    autoComplete="username"
                                    minLength={3}
                                    maxLength={30}
                                    required
                                    disabled={loading}
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
                                        text-stone-900
                                        outline-none
                                        transition
                                        placeholder:text-stone-400
                                        focus:border-red-500
                                        focus:ring-2
                                        focus:ring-red-100
                                        disabled:bg-stone-100
                                        disabled:cursor-not-allowed
                                    "
                                />

                            </div>

                        </div>



                        {/* =================================
                            EMAIL
                        ================================= */}

                        <div>

                            <label
                                htmlFor="email"
                                className="
                                    mb-2
                                    block
                                    text-sm
                                    font-semibold
                                    text-stone-700
                                "
                            >
                                Email Address
                            </label>


                            <div className="relative">

                                <Mail
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
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                    required
                                    disabled={loading}
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
                                        text-stone-900
                                        outline-none
                                        transition
                                        placeholder:text-stone-400
                                        focus:border-red-500
                                        focus:ring-2
                                        focus:ring-red-100
                                        disabled:bg-stone-100
                                        disabled:cursor-not-allowed
                                    "
                                />

                            </div>

                        </div>



                        {/* =================================
                            PASSWORD
                        ================================= */}

                        <div>

                            <label
                                htmlFor="password"
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
                                    id="password"
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="Minimum 6 characters"
                                    autoComplete="new-password"
                                    minLength={6}
                                    required
                                    disabled={loading}
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
                                        text-stone-900
                                        outline-none
                                        transition
                                        placeholder:text-stone-400
                                        focus:border-red-500
                                        focus:ring-2
                                        focus:ring-red-100
                                        disabled:bg-stone-100
                                        disabled:cursor-not-allowed
                                    "
                                />


                                <button
                                    type="button"
                                    disabled={loading}
                                    onClick={() =>
                                        setShowPassword(
                                            (previous) =>
                                                !previous
                                        )
                                    }
                                    className="
                                        absolute
                                        right-3
                                        top-1/2
                                        -translate-y-1/2
                                        text-stone-400
                                        transition
                                        hover:text-stone-700
                                        disabled:cursor-not-allowed
                                    "
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
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
                            CONFIRM PASSWORD
                        ================================= */}

                        <div>

                            <label
                                htmlFor="confirmPassword"
                                className="
                                    mb-2
                                    block
                                    text-sm
                                    font-semibold
                                    text-stone-700
                                "
                            >
                                Confirm Password
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
                                    id="confirmPassword"
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    value={confirmPassword}
                                    onChange={(event) =>
                                        setConfirmPassword(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Confirm password"
                                    autoComplete="new-password"
                                    minLength={6}
                                    required
                                    disabled={loading}
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
                                        text-stone-900
                                        outline-none
                                        transition
                                        placeholder:text-stone-400
                                        focus:border-red-500
                                        focus:ring-2
                                        focus:ring-red-100
                                        disabled:bg-stone-100
                                        disabled:cursor-not-allowed
                                    "
                                />


                                <button
                                    type="button"
                                    disabled={loading}
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            (previous) =>
                                                !previous
                                        )
                                    }
                                    className="
                                        absolute
                                        right-3
                                        top-1/2
                                        -translate-y-1/2
                                        text-stone-400
                                        transition
                                        hover:text-stone-700
                                        disabled:cursor-not-allowed
                                    "
                                    aria-label={
                                        showConfirmPassword
                                            ? "Hide confirm password"
                                            : "Show confirm password"
                                    }
                                >

                                    {showConfirmPassword ? (
                                        <EyeOff size={18} />
                                    ) : (
                                        <Eye size={18} />
                                    )}

                                </button>

                            </div>

                        </div>



                        {/* =================================
                            CREATE ACCOUNT BUTTON
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
                                focus:outline-none
                                focus:ring-2
                                focus:ring-red-200
                                disabled:cursor-not-allowed
                                disabled:opacity-60
                            "
                        >

                            {loading
                                ? "Creating account..."
                                : "Create Account"
                            }

                        </button>

                    </form>



                    {/* ==================================
                        LOGIN LINK
                    ================================== */}

                    <p
                        className="
                            mt-6
                            text-center
                            text-sm
                            text-stone-500
                        "
                    >

                        Already have an account?{" "}


                        <Link
                            to="/login"
                            className="
                                font-bold
                                text-red-600
                                transition
                                hover:text-red-700
                            "
                        >
                            Login
                        </Link>

                    </p>

                </div>

            </div>

        </div>

    );
}


export default Register;