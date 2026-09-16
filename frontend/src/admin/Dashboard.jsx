import { useEffect, useState } from "react";

import {
    ArrowRight,
    ClipboardList,
    CreditCard,
    IndianRupee,
    MessageSquare,
    ShoppingBag,
    TrendingUp,
    Utensils
} from "lucide-react";

import { Link } from "react-router-dom";

import api from "../services/api";
import Loading from "../components/Loading";

function Dashboard() {
    const [loading, setLoading] = useState(true);

    const [data, setData] = useState({
        foods: [],
        orders: [],
        payments: [],
        reviews: []
    });

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                setLoading(true);

                /*
                 * Load each API separately.
                 * If one API fails, the others can still load.
                 */

                const [
                    foodsResult,
                    ordersResult,
                    paymentsResult,
                    reviewsResult
                ] = await Promise.allSettled([
                    api.get("/food/get-food"),
                    api.get("/order/get-all-orders"),
                    api.get("/payment/get-all-payments"),
                    api.get("/review/get-all-reviews")
                ]);

                /* ---------------- FOOD ---------------- */

                let foods = [];

                if (foodsResult.status === "fulfilled") {
                    const response = foodsResult.value.data;

                    foods =
                        response?.foods ||
                        response?.food ||
                        [];
                } else {
                    console.error(
                        "Foods API Error:",
                        foodsResult.reason?.response?.data ||
                        foodsResult.reason?.message
                    );
                }

                /* ---------------- ORDERS ---------------- */

                let orders = [];

                if (ordersResult.status === "fulfilled") {
                    const response = ordersResult.value.data;

                    orders =
                        response?.orders ||
                        [];
                } else {
                    console.error(
                        "Orders API Error:",
                        ordersResult.reason?.response?.data ||
                        ordersResult.reason?.message
                    );
                }

                /* ---------------- PAYMENTS ---------------- */

                let payments = [];

                if (paymentsResult.status === "fulfilled") {
                    const response = paymentsResult.value.data;

                    payments =
                        response?.payments ||
                        [];
                } else {
                    console.error(
                        "Payments API Error:",
                        paymentsResult.reason?.response?.data ||
                        paymentsResult.reason?.message
                    );
                }

                /* ---------------- REVIEWS ---------------- */

                let reviews = [];

                if (reviewsResult.status === "fulfilled") {
                    const response = reviewsResult.value.data;

                    reviews =
                        response?.reviews ||
                        [];
                } else {
                    console.error(
                        "Reviews API Error:",
                        reviewsResult.reason?.response?.data ||
                        reviewsResult.reason?.message
                    );
                }

                setData({
                    foods,
                    orders,
                    payments,
                    reviews
                });

            } catch (error) {
                console.error(
                    "Dashboard error:",
                    error.response?.data ||
                    error.message
                );
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, []);

    /* ---------------- LOADING ---------------- */

    if (loading) {
        return (
            <Loading
                fullScreen
                text="Loading dashboard..."
            />
        );
    }

    /* ---------------- STATS ---------------- */

    const totalOrders = data.orders.length;

    const totalFoods = data.foods.length;

    const totalReviews = data.reviews.length;

    const pendingOrders = data.orders.filter(
        (order) =>
            [
                "pending",
                "confirmed",
                "preparing"
            ].includes(order.orderStatus)
    ).length;

    /* ---------------- REVENUE ---------------- */

    const paidPayments = data.payments.filter(
        (payment) =>
            payment.status === "paid"
    );

    const revenue = paidPayments.reduce(
        (sum, payment) =>
            sum + Number(payment.amount || 0),
        0
    );

    /* ---------------- STATS CARDS ---------------- */

    const stats = [
        {
            label: "Total Orders",
            value: totalOrders,
            icon: ClipboardList,
            bg: "bg-blue-50",
            color: "text-blue-600"
        },
        {
            label: "Pending Orders",
            value: pendingOrders,
            icon: ShoppingBag,
            bg: "bg-orange-50",
            color: "text-orange-600"
        },
        {
            label: "Total Foods",
            value: totalFoods,
            icon: Utensils,
            bg: "bg-red-50",
            color: "text-red-600"
        },
        {
            label: "Revenue",
            value: `₹${revenue.toLocaleString("en-IN")}`,
            icon: IndianRupee,
            bg: "bg-green-50",
            color: "text-green-600"
        }
    ];

    /* ---------------- ORDER STATUS COLORS ---------------- */

    const statusClass = {
        pending:
            "bg-yellow-50 text-yellow-700",

        confirmed:
            "bg-blue-50 text-blue-700",

        preparing:
            "bg-orange-50 text-orange-700",

        ready:
            "bg-purple-50 text-purple-700",

        out_for_delivery:
            "bg-indigo-50 text-indigo-700",

        delivered:
            "bg-green-50 text-green-700",

        cancelled:
            "bg-red-50 text-red-700"
    };

    /* ---------------- DATE FORMAT ---------------- */

    const formatDate = (date) => {
        if (!date) return "";

        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );
    };

    return (
        <div>

            {/* ================= HEADER ================= */}

            <div
                className="
                    mb-7
                    flex
                    flex-col
                    gap-4
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                "
            >

                <div>

                    <p
                        className="
                            text-sm
                            font-semibold
                            text-red-600
                        "
                    >
                        Overview
                    </p>

                    <h1
                        className="
                            mt-1
                            text-3xl
                            font-black
                            text-stone-900
                        "
                    >
                        Dashboard
                    </h1>

                    <p
                        className="
                            mt-1
                            text-sm
                            text-stone-500
                        "
                    >
                        Manage your restaurant at a glance.
                    </p>

                </div>

                <Link
                    to="/admin/foods/add"
                    className="
                        inline-flex
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        bg-red-600
                        px-5
                        py-3
                        text-sm
                        font-bold
                        text-white
                        transition
                        hover:bg-red-700
                    "
                >
                    <Utensils size={17} />
                    Add Food
                </Link>

            </div>


            {/* ================= STATS ================= */}

            <div
                className="
                    grid
                    gap-4
                    sm:grid-cols-2
                    xl:grid-cols-4
                "
            >

                {stats.map((stat) => {
                    const Icon = stat.icon;

                    return (
                        <div
                            key={stat.label}
                            className="
                                rounded-2xl
                                border
                                border-stone-200
                                bg-white
                                p-5
                                shadow-sm
                            "
                        >

                            <div
                                className="
                                    flex
                                    items-center
                                    justify-between
                                "
                            >

                                <div
                                    className={`
                                        flex
                                        h-11
                                        w-11
                                        items-center
                                        justify-center
                                        rounded-xl
                                        ${stat.bg}
                                        ${stat.color}
                                    `}
                                >
                                    <Icon size={21} />
                                </div>

                                <TrendingUp
                                    size={17}
                                    className="text-stone-300"
                                />

                            </div>

                            <p
                                className="
                                    mt-5
                                    text-sm
                                    text-stone-500
                                "
                            >
                                {stat.label}
                            </p>

                            <p
                                className="
                                    mt-1
                                    text-2xl
                                    font-black
                                    text-stone-900
                                "
                            >
                                {stat.value}
                            </p>

                        </div>
                    );
                })}

            </div>


            {/* ================= EXTRA SUMMARY ================= */}

            <div
                className="
                    mt-6
                    grid
                    gap-4
                    sm:grid-cols-2
                    lg:grid-cols-3
                "
            >

                <div
                    className="
                        rounded-2xl
                        border
                        border-stone-200
                        bg-white
                        p-5
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            justify-between
                        "
                    >

                        <div>

                            <p
                                className="
                                    text-sm
                                    text-stone-500
                                "
                            >
                                Total Reviews
                            </p>

                            <p
                                className="
                                    mt-1
                                    text-2xl
                                    font-black
                                    text-stone-900
                                "
                            >
                                {totalReviews}
                            </p>

                        </div>

                        <div
                            className="
                                flex
                                h-11
                                w-11
                                items-center
                                justify-center
                                rounded-xl
                                bg-purple-50
                                text-purple-600
                            "
                        >
                            <MessageSquare size={21} />
                        </div>

                    </div>

                </div>


                <div
                    className="
                        rounded-2xl
                        border
                        border-stone-200
                        bg-white
                        p-5
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            justify-between
                        "
                    >

                        <div>

                            <p
                                className="
                                    text-sm
                                    text-stone-500
                                "
                            >
                                Paid Payments
                            </p>

                            <p
                                className="
                                    mt-1
                                    text-2xl
                                    font-black
                                    text-stone-900
                                "
                            >
                                {paidPayments.length}
                            </p>

                        </div>

                        <div
                            className="
                                flex
                                h-11
                                w-11
                                items-center
                                justify-center
                                rounded-xl
                                bg-green-50
                                text-green-600
                            "
                        >
                            <CreditCard size={21} />
                        </div>

                    </div>

                </div>


                <div
                    className="
                        rounded-2xl
                        border
                        border-stone-200
                        bg-white
                        p-5
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            justify-between
                        "
                    >

                        <div>

                            <p
                                className="
                                    text-sm
                                    text-stone-500
                                "
                            >
                                Active Orders
                            </p>

                            <p
                                className="
                                    mt-1
                                    text-2xl
                                    font-black
                                    text-stone-900
                                "
                            >
                                {pendingOrders}
                            </p>

                        </div>

                        <div
                            className="
                                flex
                                h-11
                                w-11
                                items-center
                                justify-center
                                rounded-xl
                                bg-orange-50
                                text-orange-600
                            "
                        >
                            <ShoppingBag size={21} />
                        </div>

                    </div>

                </div>

            </div>


            {/* ================= CONTENT ================= */}

            <div
                className="
                    mt-6
                    grid
                    gap-6
                    xl:grid-cols-[1fr_360px]
                "
            >

                {/* ================= RECENT ORDERS ================= */}

                <div
                    className="
                        rounded-2xl
                        border
                        border-stone-200
                        bg-white
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            justify-between
                            border-b
                            border-stone-100
                            p-5
                        "
                    >

                        <div>

                            <h2
                                className="
                                    font-black
                                    text-stone-900
                                "
                            >
                                Recent Orders
                            </h2>

                            <p
                                className="
                                    mt-1
                                    text-xs
                                    text-stone-500
                                "
                            >
                                Latest customer orders
                            </p>

                        </div>

                        <Link
                            to="/admin/orders"
                            className="
                                flex
                                items-center
                                gap-1
                                text-xs
                                font-bold
                                text-red-600
                            "
                        >
                            View All
                            <ArrowRight size={14} />
                        </Link>

                    </div>


                    <div
                        className="
                            divide-y
                            divide-stone-100
                        "
                    >

                        {data.orders
                            .slice(0, 6)
                            .map((order) => (

                                <Link
                                    key={order._id}
                                    to={`/admin/orders/${order._id}`}
                                    className="
                                        flex
                                        items-center
                                        justify-between
                                        gap-4
                                        p-5
                                        transition
                                        hover:bg-stone-50
                                    "
                                >

                                    <div className="min-w-0">

                                        <p
                                            className="
                                                truncate
                                                font-bold
                                                text-stone-900
                                            "
                                        >
                                            #
                                            {order.orderNumber ||
                                                order._id}
                                        </p>

                                        <p
                                            className="
                                                mt-1
                                                text-xs
                                                text-stone-500
                                            "
                                        >
                                            {order.deliveryAddress?.name ||
                                                order.user?.username ||
                                                "Customer"}
                                        </p>

                                        {order.createdAt && (
                                            <p
                                                className="
                                                    mt-1
                                                    text-[11px]
                                                    text-stone-400
                                                "
                                            >
                                                {formatDate(
                                                    order.createdAt
                                                )}
                                            </p>
                                        )}

                                    </div>


                                    <div
                                        className="
                                            shrink-0
                                            text-right
                                        "
                                    >

                                        <span
                                            className={`
                                                inline-flex
                                                rounded-full
                                                px-2.5
                                                py-1
                                                text-[10px]
                                                font-bold
                                                capitalize
                                                ${
                                                    statusClass[
                                                        order.orderStatus
                                                    ] ||
                                                    "bg-stone-100 text-stone-600"
                                                }
                                            `}
                                        >
                                            {order.orderStatus
                                                ? order.orderStatus.replace(
                                                    /_/g,
                                                    " "
                                                )
                                                : "Unknown"}
                                        </span>

                                        <p
                                            className="
                                                mt-1
                                                text-sm
                                                font-black
                                                text-stone-900
                                            "
                                        >
                                            ₹
                                            {Number(
                                                order.total || 0
                                            ).toLocaleString(
                                                "en-IN"
                                            )}
                                        </p>

                                    </div>

                                </Link>

                            ))}


                        {data.orders.length === 0 && (

                            <div
                                className="
                                    p-10
                                    text-center
                                    text-sm
                                    text-stone-500
                                "
                            >
                                No orders yet.
                            </div>

                        )}

                    </div>

                </div>


                {/* ================= QUICK ACTIONS ================= */}

                <div
                    className="
                        rounded-2xl
                        border
                        border-stone-200
                        bg-white
                        p-5
                    "
                >

                    <h2
                        className="
                            font-black
                            text-stone-900
                        "
                    >
                        Quick Actions
                    </h2>

                    <p
                        className="
                            mt-1
                            text-xs
                            text-stone-500
                        "
                    >
                        Manage your restaurant quickly.
                    </p>


                    <div
                        className="
                            mt-5
                            grid
                            gap-3
                        "
                    >

                        <Link
                            to="/admin/foods/add"
                            className="
                                flex
                                items-center
                                gap-3
                                rounded-xl
                                bg-red-50
                                p-4
                                text-red-700
                                transition
                                hover:bg-red-100
                            "
                        >
                            <Utensils size={19} />

                            <span
                                className="
                                    text-sm
                                    font-bold
                                "
                            >
                                Add New Food
                            </span>
                        </Link>


                        <Link
                            to="/admin/orders"
                            className="
                                flex
                                items-center
                                gap-3
                                rounded-xl
                                bg-blue-50
                                p-4
                                text-blue-700
                                transition
                                hover:bg-blue-100
                            "
                        >
                            <ClipboardList size={19} />

                            <span
                                className="
                                    text-sm
                                    font-bold
                                "
                            >
                                Manage Orders
                            </span>
                        </Link>


                        <Link
                            to="/admin/payments"
                            className="
                                flex
                                items-center
                                gap-3
                                rounded-xl
                                bg-green-50
                                p-4
                                text-green-700
                                transition
                                hover:bg-green-100
                            "
                        >
                            <CreditCard size={19} />

                            <span
                                className="
                                    text-sm
                                    font-bold
                                "
                            >
                                Check Payments
                            </span>
                        </Link>


                        <Link
                            to="/admin/reviews"
                            className="
                                flex
                                items-center
                                gap-3
                                rounded-xl
                                bg-purple-50
                                p-4
                                text-purple-700
                                transition
                                hover:bg-purple-100
                            "
                        >
                            <MessageSquare size={19} />

                            <span
                                className="
                                    text-sm
                                    font-bold
                                "
                            >
                                Manage Reviews
                            </span>
                        </Link>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Dashboard;