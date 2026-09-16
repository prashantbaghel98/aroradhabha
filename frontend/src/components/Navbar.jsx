import { useState } from "react";

import {
    Menu as MenuIcon,
    X,
    ShoppingCart,
    User,
    ChevronDown,
    LogOut,
    LayoutDashboard,
    ClipboardList
} from "lucide-react";

import {
    Link,
    NavLink,
    useNavigate
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";


function Navbar() {

    const [mobileMenuOpen, setMobileMenuOpen] =
        useState(false);

    const [userMenuOpen, setUserMenuOpen] =
        useState(false);


    // ==========================================
    // AUTH
    // ==========================================

    const {
        user,
        logout,
        isAuthenticated,
        isAdmin
    } = useAuth();


    // ==========================================
    // CART
    // ==========================================

    const {
        cartCount
    } = useCart();


    const navigate = useNavigate();


    // ==========================================
    // LOGOUT
    // ==========================================

    const handleLogout = () => {

        logout();

        setUserMenuOpen(false);

        setMobileMenuOpen(false);

        navigate("/");

    };


    // ==========================================
    // NAV LINK STYLE
    // ==========================================

    const navLinkClass = ({ isActive }) =>
        `
            transition-colors
            duration-200
            ${
                isActive
                    ? "text-red-600 font-semibold"
                    : "text-stone-700 hover:text-red-600"
            }
        `;


    // ==========================================
    // CLOSE MOBILE MENU
    // ==========================================

    const closeMobileMenu = () => {

        setMobileMenuOpen(false);

    };


    return (

        <header
            className="
                sticky
                top-0
                z-50
                border-b
                border-stone-200
                bg-white/95
                backdrop-blur
            "
        >

            <div
                className="
                    mx-auto
                    flex
                    h-16
                    max-w-7xl
                    items-center
                    justify-between
                    px-4
                    sm:px-6
                    lg:px-8
                "
            >


                {/* =================================
                    LOGO
                ================================== */}

                <Link
                    to="/"
                    onClick={closeMobileMenu}
                    className="
                        flex
                        items-center
                        gap-3
                    "
                >

                    <div
                        className="
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-xl
                           
                            text-lg
                            font-bold
                            text-white
                        "
                    >
                        <img src="./logo.webp"/>
                    </div>


                    <div className="hidden sm:block">

                        <h1
                            className="
                                text-lg
                                font-extrabold
                                leading-tight
                                text-stone-900
                            "
                        >
                            Arora Da Dhabha
                        </h1>


                        <p
                            className="
                                text-[10px]
                                font-medium
                                uppercase
                                tracking-wider
                                text-stone-500
                            "
                        >
                            Desi Taste
                        </p>

                    </div>

                </Link>



                {/* =================================
                    DESKTOP NAVIGATION
                ================================== */}

                <nav
                    className="
                        hidden
                        items-center
                        gap-7
                        md:flex
                    "
                >

                    <NavLink
                        to="/"
                        className={navLinkClass}
                    >
                        Home
                    </NavLink>


                    <NavLink
                        to="/menu"
                        className={navLinkClass}
                    >
                        Menu
                    </NavLink>


                    {isAuthenticated && (

                        <NavLink
                            to="/orders"
                            className={navLinkClass}
                        >
                            Orders
                        </NavLink>

                    )}

                </nav>



                {/* =================================
                    DESKTOP RIGHT SIDE
                ================================== */}

                <div
                    className="
                        hidden
                        items-center
                        gap-3
                        md:flex
                    "
                >


                    {/* =================================
                        CART
                    ================================== */}

                    <Link
                        to="/cart"
                        className="
                            relative
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-xl
                            text-stone-700
                            transition
                            hover:bg-red-50
                            hover:text-red-600
                        "
                        aria-label="Shopping cart"
                    >

                        <ShoppingCart
                            size={21}
                        />


                        {cartCount > 0 && (

                            <span
                                className="
                                    absolute
                                    -right-1
                                    -top-1
                                    flex
                                    h-5
                                    min-w-5
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-red-600
                                    px-1
                                    text-[10px]
                                    font-bold
                                    text-white
                                "
                            >

                                {cartCount > 99
                                    ? "99+"
                                    : cartCount
                                }

                            </span>

                        )}

                    </Link>



                    {/* =================================
                        AUTHENTICATED USER
                    ================================== */}

                    {isAuthenticated ? (

                        <div className="relative">


                            {/* User Button */}

                            <button
                                type="button"
                                onClick={() =>
                                    setUserMenuOpen(
                                        !userMenuOpen
                                    )
                                }
                                className="
                                    flex
                                    items-center
                                    gap-2
                                    rounded-xl
                                    border
                                    border-stone-200
                                    px-3
                                    py-2
                                    text-sm
                                    font-medium
                                    text-stone-700
                                    transition
                                    hover:border-red-200
                                    hover:bg-red-50
                                "
                            >

                                <div
                                    className="
                                        flex
                                        h-7
                                        w-7
                                        items-center
                                        justify-center
                                        rounded-full
                                        bg-red-100
                                        text-red-600
                                    "
                                >

                                    <User
                                        size={16}
                                    />

                                </div>


                                <span
                                    className="
                                        max-w-24
                                        truncate
                                    "
                                >
                                    {user?.username ||
                                        "Account"}
                                </span>


                                <ChevronDown
                                    size={16}
                                    className={`
                                        transition-transform

                                        ${
                                            userMenuOpen
                                                ? "rotate-180"
                                                : ""
                                        }
                                    `}
                                />

                            </button>



                            {/* =================================
                                USER DROPDOWN
                            ================================== */}

                            {userMenuOpen && (

                                <div
                                    className="
                                        absolute
                                        right-0
                                        top-14
                                        w-56
                                        overflow-hidden
                                        rounded-2xl
                                        border
                                        border-stone-200
                                        bg-white
                                        p-2
                                        shadow-xl
                                    "
                                >


                                    {/* User Info */}

                                    <div
                                        className="
                                            border-b
                                            border-stone-100
                                            px-3
                                            py-3
                                        "
                                    >

                                        <p
                                            className="
                                                truncate
                                                text-sm
                                                font-semibold
                                                text-stone-900
                                            "
                                        >
                                            {user?.username}
                                        </p>


                                        <p
                                            className="
                                                truncate
                                                text-xs
                                                text-stone-500
                                            "
                                        >
                                            {user?.email}
                                        </p>

                                    </div>



                                    {/* Profile */}

                                    <Link
                                        to="/profile"
                                        onClick={() =>
                                            setUserMenuOpen(
                                                false
                                            )
                                        }
                                        className="
                                            flex
                                            items-center
                                            gap-3
                                            rounded-xl
                                            px-3
                                            py-2.5
                                            text-sm
                                            text-stone-700
                                            hover:bg-stone-50
                                        "
                                    >

                                        <User
                                            size={17}
                                        />

                                        Profile

                                    </Link>



                                    {/* My Orders */}

                                    <Link
                                        to="/orders"
                                        onClick={() =>
                                            setUserMenuOpen(
                                                false
                                            )
                                        }
                                        className="
                                            flex
                                            items-center
                                            gap-3
                                            rounded-xl
                                            px-3
                                            py-2.5
                                            text-sm
                                            text-stone-700
                                            hover:bg-stone-50
                                        "
                                    >

                                        <ClipboardList
                                            size={17}
                                        />

                                        My Orders

                                    </Link>



                                    {/* Admin */}

                                    {isAdmin && (

                                        <Link
                                            to="/admin"
                                            onClick={() =>
                                                setUserMenuOpen(
                                                    false
                                                )
                                            }
                                            className="
                                                flex
                                                items-center
                                                gap-3
                                                rounded-xl
                                                px-3
                                                py-2.5
                                                text-sm
                                                font-medium
                                                text-red-600
                                                hover:bg-red-50
                                            "
                                        >

                                            <LayoutDashboard
                                                size={17}
                                            />

                                            Admin Dashboard

                                        </Link>

                                    )}



                                    {/* Logout */}

                                    <button
                                        type="button"
                                        onClick={
                                            handleLogout
                                        }
                                        className="
                                            flex
                                            w-full
                                            items-center
                                            gap-3
                                            rounded-xl
                                            px-3
                                            py-2.5
                                            text-sm
                                            text-red-600
                                            hover:bg-red-50
                                        "
                                    >

                                        <LogOut
                                            size={17}
                                        />

                                        Logout

                                    </button>

                                </div>

                            )}

                        </div>

                    ) : (

                        /* =================================
                            LOGIN / REGISTER
                        ================================== */

                        <div
                            className="
                                flex
                                items-center
                                gap-2
                            "
                        >

                            <Link
                                to="/login"
                                className="
                                    rounded-xl
                                    px-4
                                    py-2.5
                                    text-sm
                                    font-semibold
                                    text-stone-700
                                    transition
                                    hover:bg-stone-100
                                "
                            >
                                Login
                            </Link>


                            <Link
                                to="/register"
                                className="
                                    rounded-xl
                                    bg-red-600
                                    px-4
                                    py-2.5
                                    text-sm
                                    font-semibold
                                    text-white
                                    transition
                                    hover:bg-red-700
                                "
                            >
                                Register
                            </Link>

                        </div>

                    )}

                </div>



                {/* =================================
                    MOBILE RIGHT SIDE
                ================================== */}

                <div
                    className="
                        flex
                        items-center
                        gap-2
                        md:hidden
                    "
                >


                    {/* Mobile Cart */}

                    <Link
                        to="/cart"
                        className="
                            relative
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-xl
                            text-stone-700
                        "
                        aria-label="Shopping cart"
                    >

                        <ShoppingCart
                            size={21}
                        />


                        {cartCount > 0 && (

                            <span
                                className="
                                    absolute
                                    -right-1
                                    -top-1
                                    flex
                                    h-5
                                    min-w-5
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-red-600
                                    px-1
                                    text-[10px]
                                    font-bold
                                    text-white
                                "
                            >

                                {cartCount > 99
                                    ? "99+"
                                    : cartCount
                                }

                            </span>

                        )}

                    </Link>



                    {/* Mobile Menu */}

                    <button
                        type="button"
                        onClick={() =>
                            setMobileMenuOpen(
                                !mobileMenuOpen
                            )
                        }
                        className="
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-xl
                            text-stone-700
                            hover:bg-stone-100
                        "
                        aria-label="Toggle menu"
                    >

                        {mobileMenuOpen
                            ? <X size={23} />
                            : <MenuIcon size={23} />
                        }

                    </button>

                </div>

            </div>



            {/* ==========================================
                MOBILE MENU
            =========================================== */}

            {mobileMenuOpen && (

                <div
                    className="
                        border-t
                        border-stone-100
                        bg-white
                        px-4
                        py-4
                        md:hidden
                    "
                >

                    <div
                        className="
                            mx-auto
                            max-w-7xl
                            space-y-1
                        "
                    >


                        {/* Home */}

                        <NavLink
                            to="/"
                            onClick={
                                closeMobileMenu
                            }
                            className={`
                                block
                                rounded-xl
                                px-4
                                py-3
                                text-sm
                                font-medium
                                ${navLinkClass}
                            `}
                        >
                            Home
                        </NavLink>


                        {/* Menu */}

                        <NavLink
                            to="/menu"
                            onClick={
                                closeMobileMenu
                            }
                            className={`
                                block
                                rounded-xl
                                px-4
                                py-3
                                text-sm
                                font-medium
                                ${navLinkClass}
                            `}
                        >
                            Menu
                        </NavLink>


                        {/* Orders */}

                        {isAuthenticated && (

                            <NavLink
                                to="/orders"
                                onClick={
                                    closeMobileMenu
                                }
                                className={`
                                    block
                                    rounded-xl
                                    px-4
                                    py-3
                                    text-sm
                                    font-medium
                                    ${navLinkClass}
                                `}
                            >
                                My Orders
                            </NavLink>

                        )}



                        {/* Authenticated */}

                        {isAuthenticated ? (

                            <>


                                {/* Profile */}

                                <NavLink
                                    to="/profile"
                                    onClick={
                                        closeMobileMenu
                                    }
                                    className={`
                                        block
                                        rounded-xl
                                        px-4
                                        py-3
                                        text-sm
                                        font-medium
                                        ${navLinkClass}
                                    `}
                                >
                                    Profile
                                </NavLink>



                                {/* Admin */}

                                {isAdmin && (

                                    <NavLink
                                        to="/admin"
                                        onClick={
                                            closeMobileMenu
                                        }
                                        className="
                                            flex
                                            items-center
                                            gap-2
                                            rounded-xl
                                            bg-red-50
                                            px-4
                                            py-3
                                            text-sm
                                            font-semibold
                                            text-red-600
                                        "
                                    >

                                        <LayoutDashboard
                                            size={17}
                                        />

                                        Admin Dashboard

                                    </NavLink>

                                )}



                                {/* Logout */}

                                <button
                                    type="button"
                                    onClick={
                                        handleLogout
                                    }
                                    className="
                                        flex
                                        w-full
                                        items-center
                                        gap-2
                                        rounded-xl
                                        px-4
                                        py-3
                                        text-left
                                        text-sm
                                        font-medium
                                        text-red-600
                                        hover:bg-red-50
                                    "
                                >

                                    <LogOut
                                        size={17}
                                    />

                                    Logout

                                </button>

                            </>

                        ) : (

                            /* =================================
                                MOBILE LOGIN REGISTER
                            ================================== */

                            <div
                                className="
                                    grid
                                    grid-cols-2
                                    gap-2
                                    pt-3
                                "
                            >

                                <Link
                                    to="/login"
                                    onClick={
                                        closeMobileMenu
                                    }
                                    className="
                                        rounded-xl
                                        border
                                        border-stone-200
                                        px-4
                                        py-3
                                        text-center
                                        text-sm
                                        font-semibold
                                        text-stone-700
                                    "
                                >
                                    Login
                                </Link>


                                <Link
                                    to="/register"
                                    onClick={
                                        closeMobileMenu
                                    }
                                    className="
                                        rounded-xl
                                        bg-red-600
                                        px-4
                                        py-3
                                        text-center
                                        text-sm
                                        font-semibold
                                        text-white
                                    "
                                >
                                    Register
                                </Link>

                            </div>

                        )}

                    </div>

                </div>

            )}

        </header>

    );

}


export default Navbar;