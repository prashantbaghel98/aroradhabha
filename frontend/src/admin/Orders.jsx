import { useEffect, useState } from "react";
import {
    ArrowRight,
    ClipboardList,
    Search
} from "lucide-react";

import {
    Link
} from "react-router-dom";

import api from "../services/api";
import Loading from "../components/Loading";

function Orders() {

    const [orders, setOrders] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [search, setSearch] =
        useState("");

    const [status, setStatus] =
        useState("all");


    const loadOrders = async () => {

        try {

            setLoading(true);

            const response =
                await api.get(
                    "/order/get-all-orders"
                );

            setOrders(
                response.data.orders || []
            );

        } catch (error) {

            console.error(
                "Admin orders error:",
                error
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        loadOrders();

    }, []);


    const filteredOrders =
        orders.filter((order) => {

            const matchesSearch =
                order.orderNumber
                    ?.toLowerCase()
                    .includes(
                        search.toLowerCase()
                    ) ||
                order.deliveryAddress?.name
                    ?.toLowerCase()
                    .includes(
                        search.toLowerCase()
                    );

            const matchesStatus =
                status === "all" ||
                order.orderStatus === status;

            return (
                matchesSearch &&
                matchesStatus
            );

        });


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
                text="Loading orders..."
            />
        );

    }


    return (

        <div>

            <div>

                <p className="
                    text-sm
                    font-semibold
                    text-red-600
                ">
                    Order Management
                </p>

                <h1 className="
                    mt-1
                    text-3xl
                    font-black
                ">
                    Orders
                </h1>

            </div>


            {/* Filters */}

            <div className="
                mt-6
                grid
                gap-3
                lg:grid-cols-[1fr_auto]
            ">

                <div className="relative">

                    <Search
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
                        value={search}
                        onChange={(event) =>
                            setSearch(
                                event.target.value
                            )
                        }
                        placeholder="Search order number or customer..."
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
                            focus:border-red-500
                        "
                    />

                </div>


                <select
                    value={status}
                    onChange={(event) =>
                        setStatus(
                            event.target.value
                        )
                    }
                    className="
                        rounded-xl
                        border
                        border-stone-200
                        bg-white
                        px-4
                        py-3
                        text-sm
                    "
                >

                    <option value="all">
                        All Status
                    </option>

                    <option value="pending">
                        Pending
                    </option>

                    <option value="confirmed">
                        Confirmed
                    </option>

                    <option value="preparing">
                        Preparing
                    </option>

                    <option value="ready">
                        Ready
                    </option>

                    <option value="out_for_delivery">
                        Out for Delivery
                    </option>

                    <option value="delivered">
                        Delivered
                    </option>

                    <option value="cancelled">
                        Cancelled
                    </option>

                </select>

            </div>


            {/* Table */}

            <div className="
                mt-6
                overflow-hidden
                rounded-2xl
                border
                border-stone-200
                bg-white
            ">

                <div className="overflow-x-auto">

                    <table className="
                        min-w-[800px]
                        w-full
                    ">

                        <thead className="
                            border-b
                            border-stone-100
                            bg-stone-50
                        ">

                            <tr>

                                <th className="
                                    px-5
                                    py-4
                                    text-left
                                    text-xs
                                    font-bold
                                    text-stone-500
                                ">
                                    Order
                                </th>

                                <th className="
                                    px-5
                                    py-4
                                    text-left
                                    text-xs
                                    font-bold
                                    text-stone-500
                                ">
                                    Customer
                                </th>

                                <th className="
                                    px-5
                                    py-4
                                    text-left
                                    text-xs
                                    font-bold
                                    text-stone-500
                                ">
                                    Items
                                </th>

                                <th className="
                                    px-5
                                    py-4
                                    text-left
                                    text-xs
                                    font-bold
                                    text-stone-500
                                ">
                                    Total
                                </th>

                                <th className="
                                    px-5
                                    py-4
                                    text-left
                                    text-xs
                                    font-bold
                                    text-stone-500
                                ">
                                    Status
                                </th>

                                <th />

                            </tr>

                        </thead>


                        <tbody className="
                            divide-y
                            divide-stone-100
                        ">

                            {filteredOrders.map(
                                (order) => (

                                <tr
                                    key={order._id}
                                    className="hover:bg-stone-50"
                                >

                                    <td className="px-5 py-4">

                                        <p className="
                                            font-bold
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
                                                "en-IN"
                                            )}
                                        </p>

                                    </td>


                                    <td className="px-5 py-4">

                                        <p className="
                                            font-semibold
                                        ">
                                            {order.deliveryAddress?.name ||
                                                "Customer"}
                                        </p>

                                        <p className="
                                            mt-1
                                            text-xs
                                            text-stone-500
                                        ">
                                            {order.deliveryAddress?.phone}
                                        </p>

                                    </td>


                                    <td className="
                                        px-5
                                        py-4
                                        text-sm
                                    ">
                                        {order.items?.length || 0}
                                    </td>


                                    <td className="
                                        px-5
                                        py-4
                                        font-black
                                    ">
                                        ₹{order.total}
                                    </td>


                                    <td className="px-5 py-4">

                                        <span className={`
                                            inline-flex
                                            rounded-full
                                            px-3
                                            py-1
                                            text-xs
                                            font-bold
                                            capitalize
                                            ${
                                                statusClass[
                                                    order.orderStatus
                                                ] ||
                                                "bg-stone-100 text-stone-600"
                                            }
                                        `}>
                                            {order.orderStatus?.replaceAll(
                                                "_",
                                                " "
                                            )}
                                        </span>

                                    </td>


                                    <td className="px-5 py-4">

                                        <Link
                                            to={`/admin/orders/${order._id}`}
                                            className="
                                                flex
                                                h-9
                                                w-9
                                                items-center
                                                justify-center
                                                rounded-lg
                                                bg-stone-100
                                                text-stone-600
                                                hover:bg-red-50
                                                hover:text-red-600
                                            "
                                        >
                                            <ArrowRight
                                                size={16}
                                            />
                                        </Link>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>


                {filteredOrders.length === 0 && (

                    <div className="
                        py-16
                        text-center
                    ">

                        <ClipboardList
                            size={40}
                            className="
                                mx-auto
                                text-stone-300
                            "
                        />

                        <p className="
                            mt-3
                            text-sm
                            text-stone-500
                        ">
                            No orders found.
                        </p>

                    </div>

                )}

            </div>

        </div>
    );
}

export default Orders;