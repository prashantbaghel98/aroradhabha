import { useEffect, useState } from "react";

import {
    ArrowLeft,
    MapPin,
    Package,
    Save,
    User,
    CreditCard,
    Clock
} from "lucide-react";

import {
    Link,
    useParams
} from "react-router-dom";

import {
    getAdminOrderById,
    updateOrderStatus
} from "../services/orderService";

import Loading from "../components/Loading";


function OrderDetails() {

    const { id } = useParams();


    // ==========================================
    // STATE
    // ==========================================

    const [order, setOrder] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [status, setStatus] =
        useState("");


    // ==========================================
    // LOAD ORDER
    // ==========================================

    useEffect(() => {

        const loadOrder = async () => {

            try {

                setLoading(true);

                // console.log(
                //     "Loading Admin Order:",
                //     id
                // );


                const response =
                    await getAdminOrderById(id);


                // console.log(
                //     "Admin Order Response:",
                //     response
                // );


                const data =
                    response?.order;


                if (!data) {

                    console.error(
                        "Order data not found:",
                        response
                    );

                    setOrder(null);

                    return;
                }


                setOrder(data);

                setStatus(
                    data.orderStatus || "pending"
                );


            } catch (error) {

                console.error(
                    "Order detail error:",
                    error.response?.data ||
                    error.message ||
                    error
                );

                setOrder(null);

            } finally {

                setLoading(false);

            }

        };


        if (id) {
            loadOrder();
        }

    }, [id]);


    // ==========================================
    // UPDATE ORDER STATUS
    // ==========================================

    const handleUpdateStatus = async () => {

        if (!order) {
            return;
        }


        if (!status) {

            alert(
                "Please select an order status."
            );

            return;
        }


        if (
            [
                "delivered",
                "cancelled"
            ].includes(order.orderStatus)
        ) {

            alert(
                "This order can no longer be updated."
            );

            return;
        }


        try {

            setSaving(true);


            const response =
                await updateOrderStatus(
                    id,
                    status
                );


            // console.log(
            //     "Updated Order:",
            //     response
            // );


            if (response?.order) {

                setOrder(
                    response.order
                );

                setStatus(
                    response.order.orderStatus
                );

            }


            alert(
                response?.message ||
                "Order status updated successfully."
            );


        } catch (error) {

            console.error(
                "Update status error:",
                error.response?.data ||
                error.message ||
                error
            );


            alert(
                error.response?.data?.message ||
                "Unable to update order."
            );

        } finally {

            setSaving(false);

        }

    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (
            <Loading
                fullScreen
                text="Loading order..."
            />
        );

    }


    // ==========================================
    // ORDER NOT FOUND
    // ==========================================

    if (!order) {

        return (

            <div className="
                flex
                min-h-[60vh]
                flex-col
                items-center
                justify-center
                px-4
                text-center
            ">

                <Package
                    size={48}
                    className="
                        text-stone-300
                    "
                />

                <h2 className="
                    mt-4
                    text-2xl
                    font-black
                    text-stone-900
                ">
                    Order not found
                </h2>

                <p className="
                    mt-2
                    text-sm
                    text-stone-500
                ">
                    The order may have been deleted
                    or the order ID is invalid.
                </p>


                <Link
                    to="/admin/orders"
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
                        hover:bg-red-700
                    "
                >

                    <ArrowLeft size={17} />

                    Back to Orders

                </Link>

            </div>

        );

    }


    // ==========================================
    // CALCULATIONS
    // ==========================================

    const items =
        order.items || [];


    const deliveryAddress =
        order.deliveryAddress || {};


    const isLocked =
        [
            "delivered",
            "cancelled"
        ].includes(
            order.orderStatus
        );


    // ==========================================
    // UI
    // ==========================================

    return (

        <div className="
            mx-auto
            max-w-7xl
        ">


            {/* =====================================
                BACK BUTTON
            ====================================== */}

            <Link
                to="/admin/orders"
                className="
                    inline-flex
                    items-center
                    gap-2
                    text-sm
                    font-semibold
                    text-stone-600
                    transition
                    hover:text-red-600
                "
            >

                <ArrowLeft size={17} />

                Back to Orders

            </Link>


            {/* =====================================
                HEADER
            ====================================== */}

            <div className="
                mt-5
                flex
                flex-col
                gap-4
                sm:flex-row
                sm:items-center
                sm:justify-between
            ">

                <div>

                    <p className="
                        text-xs
                        font-semibold
                        uppercase
                        tracking-wider
                        text-stone-500
                    ">
                        Order Number
                    </p>


                    <h1 className="
                        mt-1
                        text-3xl
                        font-black
                        text-stone-900
                    ">

                        #{order.orderNumber}

                    </h1>


                    {order.createdAt && (

                        <p className="
                            mt-2
                            flex
                            items-center
                            gap-2
                            text-sm
                            text-stone-500
                        ">

                            <Clock size={15} />

                            {new Date(
                                order.createdAt
                            ).toLocaleString("en-IN")}

                        </p>

                    )}

                </div>


                {/* Current Status */}

                <div className="
                    inline-flex
                    w-fit
                    items-center
                    rounded-full
                    bg-stone-100
                    px-4
                    py-2
                    text-sm
                    font-bold
                    capitalize
                    text-stone-700
                ">

                    {order.orderStatus?.replace(
                        /_/g,
                        " "
                    )}

                </div>

            </div>


            {/* =====================================
                MAIN GRID
            ====================================== */}

            <div className="
                mt-6
                grid
                gap-6
                lg:grid-cols-[1fr_350px]
            ">


                {/* =================================
                    LEFT CONTENT
                ================================== */}

                <div className="space-y-6">


                    {/* =================================
                        ORDER ITEMS
                    ================================== */}

                    <div className="
                        rounded-2xl
                        border
                        border-stone-200
                        bg-white
                        p-5
                        shadow-sm
                    ">


                        <div className="
                            flex
                            items-center
                            gap-2
                        ">

                            <Package
                                size={19}
                                className="
                                    text-red-600
                                "
                            />

                            <h2 className="
                                font-black
                                text-stone-900
                            ">
                                Order Items
                            </h2>

                        </div>


                        <div className="
                            mt-5
                            divide-y
                            divide-stone-100
                        ">


                            {items.length > 0 ? (

                                items.map(
                                    (item, index) => (

                                        <div
                                            key={
                                                item._id ||
                                                index
                                            }
                                            className="
                                                flex
                                                items-center
                                                justify-between
                                                gap-4
                                                py-4
                                            "
                                        >

                                            <div className="
                                                min-w-0
                                            ">

                                                <p className="
                                                    font-bold
                                                    text-stone-900
                                                ">

                                                    {item.name}

                                                </p>


                                                <p className="
                                                    mt-1
                                                    text-sm
                                                    text-stone-500
                                                ">

                                                    ₹{item.price}
                                                    {" × "}
                                                    {item.quantity}

                                                </p>

                                            </div>


                                            <p className="
                                                shrink-0
                                                font-black
                                                text-stone-900
                                            ">

                                                ₹{item.total}

                                            </p>

                                        </div>

                                    )
                                )

                            ) : (

                                <p className="
                                    py-6
                                    text-sm
                                    text-stone-500
                                ">
                                    No items found.
                                </p>

                            )}

                        </div>


                        {/* =================================
                            ORDER TOTALS
                        ================================== */}

                        <div className="
                            mt-5
                            border-t
                            border-stone-200
                            pt-5
                        ">


                            <div className="
                                space-y-3
                                text-sm
                            ">


                                <div className="
                                    flex
                                    justify-between
                                ">

                                    <span className="
                                        text-stone-500
                                    ">
                                        Subtotal
                                    </span>

                                    <span className="
                                        font-semibold
                                    ">
                                        ₹{order.subtotal || 0}
                                    </span>

                                </div>


                                <div className="
                                    flex
                                    justify-between
                                ">

                                    <span className="
                                        text-stone-500
                                    ">
                                        Delivery Fee
                                    </span>

                                    <span className="
                                        font-semibold
                                    ">
                                        ₹{order.deliveryFee || 0}
                                    </span>

                                </div>


                                {Number(order.discount) > 0 && (

                                    <div className="
                                        flex
                                        justify-between
                                    ">

                                        <span className="
                                            text-stone-500
                                        ">
                                            Discount
                                        </span>

                                        <span className="
                                            font-semibold
                                            text-green-600
                                        ">
                                            -₹{order.discount}
                                        </span>

                                    </div>

                                )}


                                {Number(order.tax) > 0 && (

                                    <div className="
                                        flex
                                        justify-between
                                    ">

                                        <span className="
                                            text-stone-500
                                        ">
                                            Tax
                                        </span>

                                        <span className="
                                            font-semibold
                                        ">
                                            ₹{order.tax}
                                        </span>

                                    </div>

                                )}

                            </div>


                            <div className="
                                mt-4
                                flex
                                items-center
                                justify-between
                                border-t
                                border-stone-200
                                pt-4
                            ">

                                <span className="
                                    font-bold
                                    text-stone-900
                                ">
                                    Total
                                </span>

                                <span className="
                                    text-2xl
                                    font-black
                                    text-stone-900
                                ">
                                    ₹{order.total}
                                </span>

                            </div>

                        </div>

                    </div>


                    {/* =================================
                        CUSTOMER INFORMATION
                    ================================== */}

                    <div className="
                        rounded-2xl
                        border
                        border-stone-200
                        bg-white
                        p-5
                        shadow-sm
                    ">


                        <div className="
                            flex
                            items-center
                            gap-2
                        ">

                            <User
                                size={19}
                                className="
                                    text-red-600
                                "
                            />

                            <h2 className="
                                font-black
                                text-stone-900
                            ">
                                Customer
                            </h2>

                        </div>


                        <div className="
                            mt-4
                            space-y-2
                            text-sm
                        ">

                            <p className="
                                font-bold
                                text-stone-900
                            ">

                                {order.user?.username ||
                                deliveryAddress.name ||
                                "Customer"}

                            </p>


                            {order.user?.email && (

                                <p className="
                                    text-stone-500
                                ">

                                    {order.user.email}

                                </p>

                            )}

                        </div>

                    </div>


                    {/* =================================
                        DELIVERY ADDRESS
                    ================================== */}

                    <div className="
                        rounded-2xl
                        border
                        border-stone-200
                        bg-white
                        p-5
                        shadow-sm
                    ">


                        <div className="
                            flex
                            items-center
                            gap-2
                        ">

                            <MapPin
                                size={19}
                                className="
                                    text-red-600
                                "
                            />

                            <h2 className="
                                font-black
                                text-stone-900
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

                                {deliveryAddress.name}

                            </p>


                            {deliveryAddress.phone && (

                                <p>
                                    Phone:{" "}
                                    {deliveryAddress.phone}
                                </p>

                            )}


                            {deliveryAddress.addressLine1 && (

                                <p>
                                    {deliveryAddress.addressLine1}
                                </p>

                            )}


                            {deliveryAddress.addressLine2 && (

                                <p>
                                    {deliveryAddress.addressLine2}
                                </p>

                            )}


                            {deliveryAddress.landmark && (

                                <p>
                                    Landmark:{" "}
                                    {deliveryAddress.landmark}
                                </p>

                            )}


                            {(deliveryAddress.city ||
                                deliveryAddress.state ||
                                deliveryAddress.pincode) && (

                                <p>

                                    {deliveryAddress.city}

                                    {deliveryAddress.city &&
                                        deliveryAddress.state
                                        ? ", "
                                        : ""}

                                    {deliveryAddress.state}

                                    {deliveryAddress.pincode
                                        ? ` - ${deliveryAddress.pincode}`
                                        : ""}

                                </p>

                            )}


                            {deliveryAddress.addressType && (

                                <p className="
                                    mt-2
                                    capitalize
                                ">

                                    Type:{" "}
                                    {deliveryAddress.addressType}

                                </p>

                            )}

                        </div>

                    </div>

                </div>


                {/* =================================
                    RIGHT SIDEBAR
                ================================== */}

                <div className="
                    space-y-5
                ">


                    {/* =================================
                        UPDATE STATUS
                    ================================== */}

                    <div className="
                        rounded-2xl
                        border
                        border-stone-200
                        bg-white
                        p-5
                        shadow-sm
                    ">


                        <h2 className="
                            font-black
                            text-stone-900
                        ">
                            Update Status
                        </h2>


                        <select
                            value={status}
                            onChange={(event) =>
                                setStatus(
                                    event.target.value
                                )
                            }
                            disabled={isLocked}
                            className="
                                mt-4
                                w-full
                                rounded-xl
                                border
                                border-stone-200
                                bg-white
                                px-4
                                py-3
                                text-sm
                                outline-none
                                focus:border-red-500
                            "
                        >

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


                        <button
                            type="button"
                            onClick={
                                handleUpdateStatus
                            }
                            disabled={
                                saving ||
                                isLocked
                            }
                            className="
                                mt-4
                                flex
                                w-full
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
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "
                        >

                            <Save size={17} />

                            {saving
                                ? "Updating..."
                                : "Update Status"}

                        </button>


                        {isLocked && (

                            <p className="
                                mt-3
                                text-xs
                                text-stone-500
                            ">

                                This order is{" "}
                                {order.orderStatus} and
                                cannot be updated.

                            </p>

                        )}

                    </div>


                    {/* =================================
                        PAYMENT
                    ================================== */}

                    <div className="
                        rounded-2xl
                        border
                        border-stone-200
                        bg-white
                        p-5
                        shadow-sm
                    ">


                        <div className="
                            flex
                            items-center
                            gap-2
                        ">

                            <CreditCard
                                size={19}
                                className="
                                    text-red-600
                                "
                            />

                            <h2 className="
                                font-black
                                text-stone-900
                            ">
                                Payment
                            </h2>

                        </div>


                        <div className="
                            mt-4
                            space-y-3
                            text-sm
                        ">


                            <div className="
                                flex
                                justify-between
                                gap-4
                            ">

                                <span className="
                                    text-stone-500
                                ">
                                    Method
                                </span>

                                <span className="
                                    font-bold
                                    uppercase
                                ">
                                    {order.paymentMethod ||
                                    "N/A"}
                                </span>

                            </div>


                            <div className="
                                flex
                                justify-between
                                gap-4
                            ">

                                <span className="
                                    text-stone-500
                                ">
                                    Status
                                </span>

                                <span className="
                                    font-bold
                                    capitalize
                                ">

                                    {order.paymentStatus ||
                                    "pending"}

                                </span>

                            </div>


                            <div className="
                                flex
                                justify-between
                                gap-4
                            ">

                                <span className="
                                    text-stone-500
                                ">
                                    Amount
                                </span>

                                <span className="
                                    font-black
                                ">

                                    ₹{order.total}

                                </span>

                            </div>

                        </div>

                    </div>


                    {/* =================================
                        CUSTOMER NOTE
                    ================================== */}

                    {order.customerNote && (

                        <div className="
                            rounded-2xl
                            border
                            border-stone-200
                            bg-white
                            p-5
                            shadow-sm
                        ">

                            <h2 className="
                                font-black
                                text-stone-900
                            ">
                                Customer Note
                            </h2>

                            <p className="
                                mt-3
                                text-sm
                                leading-6
                                text-stone-600
                            ">

                                {order.customerNote}

                            </p>

                        </div>

                    )}

                </div>

            </div>

        </div>

    );
}


export default OrderDetails;