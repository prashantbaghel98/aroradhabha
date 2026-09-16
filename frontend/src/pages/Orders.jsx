import { useEffect, useState } from "react";
import {
    ArrowRight,
    ClipboardList,
    Package
} from "lucide-react";

import { Link } from "react-router-dom";

import {
    getMyOrders
} from "../services/orderService";

import Loading from "../components/Loading";

function Orders() {

    const [orders, setOrders] =
        useState([]);

    const [loading, setLoading] =
        useState(true);


    useEffect(() => {

        const loadOrders = async () => {

            try {

                const response =
                    await getMyOrders();

                setOrders(
                    response?.orders || []
                );

            } catch (error) {

                console.error(
                    "Orders error:",
                    error
                );

            } finally {

                setLoading(false);

            }

        };

        loadOrders();

    }, []);


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


    if (loading) {

        return (
            <Loading
                fullScreen
                text="Loading your orders..."
            />
        );

    }


    return (

        <div className="
            min-h-[70vh]
            bg-stone-50
            py-10
        ">

            <div className="
                mx-auto
                max-w-5xl
                px-4
                sm:px-6
                lg:px-8
            ">

                <div className="mb-8">

                    <p className="
                        text-sm
                        font-bold
                        uppercase
                        tracking-wider
                        text-red-600
                    ">
                        Account
                    </p>

                    <h1 className="
                        mt-1
                        text-3xl
                        font-black
                        text-stone-900
                    ">
                        My Orders
                    </h1>

                </div>


                {orders.length === 0 ? (

                    <div className="
                        rounded-2xl
                        border
                        border-stone-200
                        bg-white
                        py-16
                        text-center
                    ">

                        <ClipboardList
                            size={45}
                            className="
                                mx-auto
                                text-stone-300
                            "
                        />

                        <h2 className="
                            mt-4
                            text-xl
                            font-bold
                        ">
                            No orders yet
                        </h2>

                        <p className="
                            mt-2
                            text-sm
                            text-stone-500
                        ">
                            Your previous orders will appear here.
                        </p>

                        <Link
                            to="/menu"
                            className="
                                mt-5
                                inline-flex
                                rounded-xl
                                bg-red-600
                                px-5
                                py-3
                                text-sm
                                font-bold
                                text-white
                            "
                        >
                            Order Food
                        </Link>

                    </div>

                ) : (

                    <div className="space-y-4">

                        {orders.map((order) => (

                            <Link
                                key={order._id}
                                to={`/orders/${order._id}`}
                                className="
                                    block
                                    rounded-2xl
                                    border
                                    border-stone-200
                                    bg-white
                                    p-5
                                    transition
                                    hover:border-red-200
                                    hover:shadow-sm
                                "
                            >

                                <div className="
                                    flex
                                    flex-col
                                    gap-4
                                    sm:flex-row
                                    sm:items-center
                                    sm:justify-between
                                ">

                                    <div className="
                                        flex
                                        gap-4
                                    ">

                                        <div className="
                                            flex
                                            h-11
                                            w-11
                                            shrink-0
                                            items-center
                                            justify-center
                                            rounded-xl
                                            bg-red-50
                                            text-red-600
                                        ">
                                            <Package size={21} />
                                        </div>

                                        <div>

                                            <p className="
                                                text-xs
                                                text-stone-500
                                            ">
                                                Order
                                            </p>

                                            <p className="
                                                mt-0.5
                                                font-bold
                                                text-stone-900
                                            ">
                                                #{order.orderNumber}
                                            </p>

                                            <p className="
                                                mt-1
                                                text-xs
                                                text-stone-500
                                            ">
                                                {new Date(
                                                    order.createdAt
                                                ).toLocaleDateString(
                                                    "en-IN",
                                                    {
                                                        day: "numeric",
                                                        month: "short",
                                                        year: "numeric"
                                                    }
                                                )}
                                            </p>

                                        </div>

                                    </div>


                                    <div className="
                                        flex
                                        items-center
                                        justify-between
                                        gap-5
                                    ">

                                        <div className="text-right">

                                            <span className={`
                                                inline-flex
                                                rounded-full
                                                px-3
                                                py-1
                                                text-xs
                                                font-bold
                                                ${
                                                    statusClass[
                                                        order.orderStatus
                                                    ] ||
                                                    "bg-stone-100 text-stone-600"
                                                }
                                            `}>
                                                {order.orderStatus
                                                    ?.replaceAll(
                                                        "_",
                                                        " "
                                                    )}
                                            </span>

                                            <p className="
                                                mt-2
                                                font-black
                                                text-stone-900
                                            ">
                                                ₹{order.total}
                                            </p>

                                        </div>

                                        <ArrowRight
                                            size={18}
                                            className="text-stone-400"
                                        />

                                    </div>

                                </div>

                            </Link>

                        ))}

                    </div>

                )}

            </div>

        </div>
    );
}

export default Orders;