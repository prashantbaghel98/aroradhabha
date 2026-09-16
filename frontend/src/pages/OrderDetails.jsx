import { useEffect, useState } from "react";
import {
    ArrowLeft,
    Check,
    Clock,
    MapPin,
    Package,
    XCircle
} from "lucide-react";

import {
    Link,
    useNavigate,
    useParams
} from "react-router-dom";

import {
    cancelOrder,
    getOrderById
} from "../services/orderService";

import Loading from "../components/Loading";

function OrderDetails() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [order, setOrder] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [cancelling, setCancelling] =
        useState(false);


    useEffect(() => {

        const loadOrder = async () => {

            try {

                const response =
                    await getOrderById(id);

                setOrder(
                    response?.order
                );

            } catch (error) {

                console.error(
                    "Order details error:",
                    error
                );

            } finally {

                setLoading(false);

            }
        };

        loadOrder();

    }, [id]);


    const handleCancel = async () => {

        const confirmed =
            window.confirm(
                "Are you sure you want to cancel this order?"
            );

        if (!confirmed) {
            return;
        }

        try {

            setCancelling(true);

            const response =
                await cancelOrder(id);

            setOrder(
                response?.order || order
            );

        } catch (error) {

            console.error(
                "Cancel order error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Unable to cancel order."
            );

        } finally {

            setCancelling(false);

        }

    };


    if (loading) {

        return (
            <Loading
                fullScreen
                text="Loading order..."
            />
        );

    }


    if (!order) {

        return (

            <div className="
                flex
                min-h-[60vh]
                items-center
                justify-center
            ">

                <div className="text-center">

                    <h2 className="
                        text-2xl
                        font-black
                    ">
                        Order not found
                    </h2>

                    <Link
                        to="/orders"
                        className="
                            mt-5
                            inline-flex
                            items-center
                            gap-2
                            rounded-xl
                            bg-red-600
                            px-5
                            py-3
                            text-sm
                            font-bold
                            text-white
                        "
                    >
                        <ArrowLeft size={17} />
                        My Orders
                    </Link>

                </div>

            </div>

        );

    }


    const statuses = [
        "pending",
        "confirmed",
        "preparing",
        "ready",
        "out_for_delivery",
        "delivered"
    ];

    const currentIndex =
        statuses.indexOf(
            order.orderStatus
        );


    return (

        <div className="
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

                <Link
                    to="/orders"
                    className="
                        inline-flex
                        items-center
                        gap-2
                        text-sm
                        font-semibold
                        text-stone-600
                        hover:text-red-600
                    "
                >
                    <ArrowLeft size={17} />
                    My Orders
                </Link>


                <div className="
                    mt-6
                    flex
                    flex-col
                    gap-3
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                ">

                    <div>

                        <p className="
                            text-xs
                            text-stone-500
                        ">
                            Order Number
                        </p>

                        <h1 className="
                            text-2xl
                            font-black
                            text-stone-900
                        ">
                            #{order.orderNumber}
                        </h1>

                    </div>


                    {order.orderStatus !== "cancelled" && (
                        <span className="
                            rounded-full
                            bg-green-50
                            px-4
                            py-2
                            text-xs
                            font-bold
                            capitalize
                            text-green-700
                        ">
                            {order.orderStatus?.replaceAll(
                                "_",
                                " "
                            )}
                        </span>
                    )}

                </div>


                {/* Tracking */}

                {order.orderStatus !== "cancelled" && (

                    <div className="
                        mt-6
                        overflow-hidden
                        rounded-2xl
                        border
                        border-stone-200
                        bg-white
                        p-5
                    ">

                        <h2 className="
                            font-black
                            text-stone-900
                        ">
                            Order Status
                        </h2>


                        <div className="
                            mt-7
                            overflow-x-auto
                        ">

                            <div className="
                                flex
                                min-w-[650px]
                                justify-between
                            ">

                                {statuses.map(
                                    (status, index) => {

                                    const completed =
                                        currentIndex >= index;

                                    return (

                                        <div
                                            key={status}
                                            className="
                                                relative
                                                flex
                                                w-28
                                                flex-col
                                                items-center
                                                text-center
                                            "
                                        >

                                            <div className={`
                                                relative
                                                z-10
                                                flex
                                                h-9
                                                w-9
                                                items-center
                                                justify-center
                                                rounded-full
                                                ${
                                                    completed
                                                        ? "bg-red-600 text-white"
                                                        : "bg-stone-100 text-stone-400"
                                                }
                                            `}>

                                                {completed
                                                    ? <Check size={16} />
                                                    : <Clock size={15} />
                                                }

                                            </div>

                                            <p className="
                                                mt-2
                                                text-xs
                                                font-semibold
                                                capitalize
                                            ">
                                                {status.replaceAll(
                                                    "_",
                                                    " "
                                                )}
                                            </p>

                                        </div>

                                    );

                                })}

                            </div>

                        </div>

                    </div>

                )}


                {order.orderStatus === "cancelled" && (

                    <div className="
                        mt-6
                        flex
                        items-center
                        gap-3
                        rounded-2xl
                        border
                        border-red-200
                        bg-red-50
                        p-5
                        text-red-700
                    ">

                        <XCircle size={22} />

                        <div>

                            <p className="font-bold">
                                Order Cancelled
                            </p>

                            <p className="mt-1 text-xs">
                                This order has been cancelled.
                            </p>

                        </div>

                    </div>

                )}


                <div className="
                    mt-6
                    grid
                    gap-6
                    lg:grid-cols-[1fr_350px]
                ">

                    {/* Items */}

                    <div className="
                        rounded-2xl
                        border
                        border-stone-200
                        bg-white
                        p-5
                    ">

                        <h2 className="
                            text-lg
                            font-black
                        ">
                            Order Items
                        </h2>

                        <div className="
                            mt-5
                            divide-y
                            divide-stone-100
                        ">

                            {order.items?.map(
                                (item, index) => (

                                <div
                                    key={index}
                                    className="
                                        flex
                                        items-center
                                        justify-between
                                        gap-4
                                        py-4
                                    "
                                >

                                    <div>

                                        <p className="
                                            font-bold
                                            text-stone-900
                                        ">
                                            {item.name}
                                        </p>

                                        <p className="
                                            mt-1
                                            text-xs
                                            text-stone-500
                                        ">
                                            ₹{item.price} × {item.quantity}
                                        </p>

                                    </div>

                                    <p className="
                                        font-bold
                                    ">
                                        ₹{item.total}
                                    </p>

                                </div>

                            ))}

                        </div>

                    </div>


                    {/* Side */}

                    <div className="space-y-5">

                        {/* Address */}

                        <div className="
                            rounded-2xl
                            border
                            border-stone-200
                            bg-white
                            p-5
                        ">

                            <div className="
                                flex
                                items-center
                                gap-2
                            ">

                                <MapPin
                                    size={18}
                                    className="text-red-600"
                                />

                                <h2 className="
                                    font-black
                                ">
                                    Delivery Address
                                </h2>

                            </div>

                            <div className="
                                mt-4
                                text-sm
                                leading-6
                                text-stone-600
                            ">

                                <p className="
                                    font-bold
                                    text-stone-900
                                ">
                                    {order.deliveryAddress?.name}
                                </p>

                                <p>
                                    {order.deliveryAddress?.addressLine1}
                                </p>

                                {order.deliveryAddress?.addressLine2 && (
                                    <p>
                                        {order.deliveryAddress.addressLine2}
                                    </p>
                                )}

                                <p>
                                    {order.deliveryAddress?.city},{" "}
                                    {order.deliveryAddress?.state}{" "}
                                    -{" "}
                                    {order.deliveryAddress?.pincode}
                                </p>

                                <p>
                                    Phone:{" "}
                                    {order.deliveryAddress?.phone}
                                </p>

                            </div>

                        </div>


                        {/* Summary */}

                        <div className="
                            rounded-2xl
                            border
                            border-stone-200
                            bg-white
                            p-5
                        ">

                            <h2 className="font-black">
                                Payment Summary
                            </h2>

                            <div className="
                                mt-4
                                space-y-3
                                text-sm
                            ">

                                <div className="
                                    flex
                                    justify-between
                                ">
                                    <span className="text-stone-500">
                                        Subtotal
                                    </span>
                                    <span>
                                        ₹{order.subtotal}
                                    </span>
                                </div>

                                <div className="
                                    flex
                                    justify-between
                                ">
                                    <span className="text-stone-500">
                                        Delivery
                                    </span>
                                    <span>
                                        ₹{order.deliveryFee}
                                    </span>
                                </div>

                                <div className="
                                    flex
                                    justify-between
                                ">
                                    <span className="text-stone-500">
                                        Payment
                                    </span>
                                    <span className="uppercase">
                                        {order.paymentMethod}
                                    </span>
                                </div>

                            </div>

                            <div className="
                                my-4
                                border-t
                                border-stone-200
                            " />

                            <div className="
                                flex
                                justify-between
                            ">

                                <span className="font-bold">
                                    Total
                                </span>

                                <span className="
                                    text-xl
                                    font-black
                                ">
                                    ₹{order.total}
                                </span>

                            </div>

                        </div>


                        {/* Cancel */}

                        {[
                            "pending",
                            "confirmed"
                        ].includes(
                            order.orderStatus
                        ) && (

                            <button
                                type="button"
                                disabled={cancelling}
                                onClick={handleCancel}
                                className="
                                    flex
                                    w-full
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-xl
                                    border
                                    border-red-200
                                    bg-white
                                    px-5
                                    py-3
                                    text-sm
                                    font-bold
                                    text-red-600
                                    hover:bg-red-50
                                "
                            >
                                <XCircle size={17} />
                                {cancelling
                                    ? "Cancelling..."
                                    : "Cancel Order"
                                }
                            </button>

                        )}

                    </div>

                </div>

            </div>

        </div>
    );
}

export default OrderDetails;