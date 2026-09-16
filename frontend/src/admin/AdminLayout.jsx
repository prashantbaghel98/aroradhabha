import {
    BarChart3,
    ClipboardList,
    CreditCard,
    FolderTree,
    LayoutDashboard,
    LogOut,
    Menu,
    MessageSquare,
    PlusCircle,
    Settings,
    Utensils,
    X
} from "lucide-react";

import { useState } from "react";
import {
    Link,
    NavLink,
    Outlet,
    useNavigate
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function AdminLayout() {

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const {
        user,
        logout
    } = useAuth();

    const navigate = useNavigate();


    const handleLogout = () => {

        logout();

        navigate("/admin/login");
    };


    const menuItems = [
        {
            name: "Dashboard",
            path: "/admin",
            icon: LayoutDashboard,
            end: true
        },
        {
            name: "Foods",
            path: "/admin/foods",
            icon: Utensils
        },
        {
            name: "Add Food",
            path: "/admin/foods/add",
            icon: PlusCircle
        },
        {
            name: "Orders",
            path: "/admin/orders",
            icon: ClipboardList
        },
        {
            name: "Payments",
            path: "/admin/payments",
            icon: CreditCard
        },
        {
            name: "Reviews",
            path: "/admin/reviews",
            icon: MessageSquare
        }
    ];


    const linkClass = ({
        isActive
    }) => `
        flex
        items-center
        gap-3
        rounded-xl
        px-4
        py-3
        text-sm
        font-semibold
        transition
        ${
            isActive
                ? "bg-red-600 text-white"
                : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
        }
    `;


    return (

        <div className="
            min-h-screen
            bg-stone-100
        ">

            {/* Mobile Overlay */}

            {sidebarOpen && (

                <div
                    onClick={() =>
                        setSidebarOpen(false)
                    }
                    className="
                        fixed
                        inset-0
                        z-40
                        bg-black/40
                        lg:hidden
                    "
                />

            )}


            {/* =============================================================
                SIDEBAR
            ============================================================== */}

            <aside className={`
                fixed
                inset-y-0
                left-0
                z-50
                flex
                w-72
                flex-col
                border-r
                border-stone-200
                bg-white
                transition-transform
                duration-300
                lg:translate-x-0
                ${
                    sidebarOpen
                        ? "translate-x-0"
                        : "-translate-x-full"
                }
            `}>

                {/* Logo */}

                <div className="
                    flex
                    h-20
                    items-center
                    justify-between
                    border-b
                    border-stone-100
                    px-5
                ">

                    <Link
                        to="/admin"
                        className="flex items-center gap-3"
                    >

                        <div className="
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-xl
                            bg-red-600
                            font-black
                            text-white
                        ">
                            A
                        </div>

                        <div>

                            <p className="
                                font-black
                                text-stone-900
                            ">
                                Arora Da Dhabha
                            </p>

                            <p className="
                                text-[10px]
                                font-bold
                                uppercase
                                tracking-wider
                                text-red-600
                            ">
                                Admin Panel
                            </p>

                        </div>

                    </Link>


                    <button
                        type="button"
                        onClick={() =>
                            setSidebarOpen(false)
                        }
                        className="
                            rounded-lg
                            p-2
                            text-stone-500
                            lg:hidden
                        "
                    >
                        <X size={20} />
                    </button>

                </div>


                {/* Navigation */}

                <nav className="
                    flex-1
                    space-y-1
                    overflow-y-auto
                    p-4
                ">

                    {menuItems.map((item) => {

                        const Icon =
                            item.icon;

                        return (

                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={item.end}
                                onClick={() =>
                                    setSidebarOpen(false)
                                }
                                className={linkClass}
                            >

                                <Icon size={19} />

                                {item.name}

                            </NavLink>

                        );

                    })}

                </nav>


                {/* User */}

                <div className="
                    border-t
                    border-stone-100
                    p-4
                ">

                    <div className="
                        mb-3
                        rounded-xl
                        bg-stone-50
                        p-3
                    ">

                        <p className="
                            truncate
                            text-sm
                            font-bold
                            text-stone-900
                        ">
                            {user?.username || "Admin"}
                        </p>

                        <p className="
                            truncate
                            text-xs
                            text-stone-500
                        ">
                            {user?.email}
                        </p>

                    </div>


                    <button
                        type="button"
                        onClick={handleLogout}
                        className="
                            flex
                            w-full
                            items-center
                            gap-3
                            rounded-xl
                            px-4
                            py-3
                            text-sm
                            font-semibold
                            text-red-600
                            hover:bg-red-50
                        "
                    >

                        <LogOut size={18} />

                        Logout

                    </button>

                </div>

            </aside>


            {/* =============================================================
                MAIN
            ============================================================== */}

            <div className="lg:pl-72">

                {/* Top Bar */}

                <header className="
                    sticky
                    top-0
                    z-30
                    flex
                    h-16
                    items-center
                    justify-between
                    border-b
                    border-stone-200
                    bg-white/95
                    px-4
                    backdrop-blur
                    sm:px-6
                ">

                    <button
                        type="button"
                        onClick={() =>
                            setSidebarOpen(true)
                        }
                        className="
                            rounded-xl
                            p-2
                            text-stone-600
                            hover:bg-stone-100
                            lg:hidden
                        "
                    >
                        <Menu size={22} />
                    </button>


                    <div className="ml-auto flex items-center gap-3">

                        <Link
                            to="/"
                            className="
                                hidden
                                rounded-xl
                                border
                                border-stone-200
                                px-4
                                py-2
                                text-xs
                                font-bold
                                text-stone-600
                                hover:bg-stone-50
                                sm:block
                            "
                        >
                            View Website
                        </Link>

                        <div className="
                            flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            rounded-full
                            bg-red-100
                            text-sm
                            font-black
                            text-red-600
                        ">
                            {user?.username
                                ?.charAt(0)
                                ?.toUpperCase() || "A"}
                        </div>

                    </div>

                </header>


                {/* Page */}

                <main className="
                    min-h-[calc(100vh-64px)]
                    p-4
                    sm:p-6
                    lg:p-8
                ">

                    <Outlet />

                </main>

            </div>

        </div>
    );
}

export default AdminLayout;