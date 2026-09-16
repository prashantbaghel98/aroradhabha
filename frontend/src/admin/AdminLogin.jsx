import { useState } from "react";
import {
    Eye,
    EyeOff,
    Lock,
    Mail,
    ShieldCheck
} from "lucide-react";

import {
    Link,
    useNavigate
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { loginUser } from "../services/authService";

function AdminLogin() {

    const navigate = useNavigate();

    const { login } = useAuth();

    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const [showPassword, setShowPassword] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");


    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value
        }));

    };


    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");

        if (!form.email || !form.password) {

            setError(
                "Please enter email and password."
            );

            return;
        }


        try {

            setLoading(true);

            const response =
                await loginUser(form);

            const user =
                response?.user;

            const token =
                response?.token;


            if (!user || !token) {

                throw new Error(
                    "Invalid login response."
                );

            }


            if (user.role !== "admin") {

                setError(
                    "You do not have admin access."
                );

                return;
            }


            login(
                user,
                token
            );

            navigate("/admin");

        } catch (error) {

            setError(
                error.response?.data?.message ||
                error.message ||
                "Admin login failed."
            );

        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="
            flex
            min-h-screen
            items-center
            justify-center
            bg-stone-950
            px-4
            py-10
        ">

            <div className="
                w-full
                max-w-md
            ">

                <div className="
                    mb-7
                    text-center
                ">

                    <div className="
                        mx-auto
                        flex
                        h-16
                        w-16
                        items-center
                        justify-center
                        rounded-2xl
                        bg-red-600
                        text-white
                    ">
                        <ShieldCheck size={30} />
                    </div>

                    <h1 className="
                        mt-5
                        text-2xl
                        font-black
                        text-white
                    ">
                        Admin Login
                    </h1>

                    <p className="
                        mt-2
                        text-sm
                        text-stone-400
                    ">
                        Arora Da Dhabha Management Panel
                    </p>

                </div>


                <div className="
                    rounded-3xl
                    bg-white
                    p-6
                    shadow-2xl
                    sm:p-8
                ">

                    {error && (

                        <div className="
                            mb-5
                            rounded-xl
                            bg-red-50
                            px-4
                            py-3
                            text-sm
                            text-red-700
                        ">
                            {error}
                        </div>

                    )}


                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >

                        <div>

                            <label className="
                                mb-2
                                block
                                text-sm
                                font-bold
                                text-stone-700
                            ">
                                Email
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
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="admin@example.com"
                                    className="
                                        w-full
                                        rounded-xl
                                        border
                                        border-stone-200
                                        py-3
                                        pl-10
                                        pr-4
                                        text-sm
                                        outline-none
                                        focus:border-red-500
                                        focus:ring-2
                                        focus:ring-red-100
                                    "
                                />

                            </div>

                        </div>


                        <div>

                            <label className="
                                mb-2
                                block
                                text-sm
                                font-bold
                                text-stone-700
                            ">
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
                                    className="
                                        w-full
                                        rounded-xl
                                        border
                                        border-stone-200
                                        py-3
                                        pl-10
                                        pr-11
                                        text-sm
                                        outline-none
                                        focus:border-red-500
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
                                    "
                                >
                                    {showPassword
                                        ? <EyeOff size={18} />
                                        : <Eye size={18} />
                                    }
                                </button>

                            </div>

                        </div>


                        <button
                            type="submit"
                            disabled={loading}
                            className="
                                w-full
                                rounded-xl
                                bg-red-600
                                px-5
                                py-3.5
                                text-sm
                                font-bold
                                text-white
                                hover:bg-red-700
                                disabled:opacity-50
                            "
                        >
                            {loading
                                ? "Signing in..."
                                : "Admin Login"
                            }
                        </button>

                    </form>


                    <Link
                        to="/"
                        className="
                            mt-6
                            block
                            text-center
                            text-sm
                            font-semibold
                            text-stone-500
                            hover:text-red-600
                        "
                    >
                        Back to Website
                    </Link>

                </div>

            </div>

        </div>
    );
}

export default AdminLogin;