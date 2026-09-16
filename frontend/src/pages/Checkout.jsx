import { useEffect, useState } from "react";
import {
    ArrowLeft,
    ArrowRight,
    Check,
    MapPin,
    Plus
} from "lucide-react";

import {
    Link,
    useNavigate
} from "react-router-dom";

import { useCart } from "../context/CartContext";
import { getAddresses } from "../services/addressService";
import { createOrder } from "../services/orderService";
import Loading from "../components/Loading";
import { createPayment } from "../services/paymentService";

function Checkout() {

    const navigate = useNavigate();

    const { cart } = useCart();

    const [addresses, setAddresses] =
        useState([]);

    const [selectedAddress, setSelectedAddress] =
        useState("");

    const [paymentMethod, setPaymentMethod] =
        useState("cash");

    const [customerNote, setCustomerNote] =
        useState("");

    const [loading, setLoading] =
        useState(true);

    const [placingOrder, setPlacingOrder] =
        useState(false);

    const [error, setError] =
        useState("");


    useEffect(() => {

        const loadAddresses = async () => {

            try {

                const response =
                    await getAddresses();

                const data =
                    response?.data || [];

                setAddresses(data);

                const defaultAddress =
                    data.find(
                        (address) =>
                            address.isDefault
                    );

                if (defaultAddress) {

                    setSelectedAddress(
                        defaultAddress._id
                    );

                } else if (data.length > 0) {

                    setSelectedAddress(
                        data[0]._id
                    );

                }

            } catch (error) {

                console.error(
                    "Address error:",
                    error
                );

                setError(
                    "Unable to load addresses."
                );

            } finally {

                setLoading(false);

            }
        };

        loadAddresses();

    }, []);


  const handlePlaceOrder = async () => {

    setError("");

    if (!selectedAddress) {

        setError(
            "Please select a delivery address."
        );

        return;
    }

    try {

        setPlacingOrder(true);

        // =============================================
        // 1. CREATE ORDER
        // =============================================

        const orderResponse = await createOrder({
            addressId: selectedAddress,
            paymentMethod,
            customerNote
        });

        // console.log(
        //     "CREATE ORDER RESPONSE:",
        //     orderResponse
        // );

        const order = orderResponse?.order;

        if (!order?._id) {

            throw new Error(
                "Order ID missing"
            );
        }


        // =============================================
        // 2. CREATE PAYMENT
        // =============================================

        const paymentResponse =
            await createPayment({
                orderId: order._id,
                method: paymentMethod
            });

        // console.log(
        //     "CREATE PAYMENT RESPONSE:",
        //     paymentResponse
        // );


        // =============================================
        // 3. UPI
        // =============================================

        if (paymentMethod === "upi") {

            navigate(
                `/payment/${order._id}`
            );

        }


        // =============================================
        // 4. CASH
        // =============================================

        else {

            navigate(
                `/order-success/${order._id}`
            );

        }

    } catch (error) {

        console.error(
            "CREATE ORDER / PAYMENT ERROR:",
            error.response?.data ||
            error.message
        );

        setError(
            error.response?.data?.message ||
            "Unable to place order."
        );

    } finally {

        setPlacingOrder(false);

    }
};


    if (loading) {

        return (
            <Loading
                fullScreen
                text="Loading checkout..."
            />
        );

    }


    if (!cart.items?.length) {

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
                        Your cart is empty
                    </h2>

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
                        Browse Menu
                    </Link>

                </div>

            </div>

        );

    }


    return (

        <div className="
            bg-stone-50
            py-10
        ">

            <div className="
                mx-auto
                max-w-7xl
                px-4
                sm:px-6
                lg:px-8
            ">

                <Link
                    to="/cart"
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
                    Back to Cart
                </Link>


                <h1 className="
                    mt-5
                    text-3xl
                    font-black
                    text-stone-900
                ">
                    Checkout
                </h1>


                {error && (

                    <div className="
                        mt-5
                        rounded-xl
                        border
                        border-red-200
                        bg-red-50
                        px-4
                        py-3
                        text-sm
                        text-red-700
                    ">
                        {error}
                    </div>

                )}


                <div className="
                    mt-8
                    grid
                    gap-6
                    lg:grid-cols-[1fr_380px]
                ">

                    {/* Main */}

                    <div className="space-y-6">

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
                                justify-between
                            ">

                                <div>

                                    <h2 className="
                                        text-lg
                                        font-black
                                    ">
                                        Delivery Address
                                    </h2>

                                    <p className="
                                        mt-1
                                        text-sm
                                        text-stone-500
                                    ">
                                        Where should we deliver?
                                    </p>

                                </div>

                                <MapPin
                                    className="text-red-600"
                                />

                            </div>


                            {addresses.length === 0 ? (

                                <div className="
                                    mt-5
                                    rounded-xl
                                    border
                                    border-dashed
                                    border-stone-300
                                    p-6
                                    text-center
                                ">

                                    <p className="
                                        text-sm
                                        text-stone-500
                                    ">
                                        No saved address found.
                                    </p>

                                    <Link
                                        to="/profile"
                                        className="
                                            mt-4
                                            inline-flex
                                            items-center
                                            gap-2
                                            rounded-lg
                                            bg-red-600
                                            px-4
                                            py-2
                                            text-sm
                                            font-bold
                                            text-white
                                        "
                                    >
                                        <Plus size={16} />
                                        Add Address
                                    </Link>

                                </div>

                            ) : (

                                <div className="
                                    mt-5
                                    space-y-3
                                ">

                                    {addresses.map(
                                        (address) => (

                                        <button
                                            key={address._id}
                                            type="button"
                                            onClick={() =>
                                                setSelectedAddress(
                                                    address._id
                                                )
                                            }
                                            className={`
                                                flex
                                                w-full
                                                items-start
                                                gap-3
                                                rounded-xl
                                                border
                                                p-4
                                                text-left
                                                ${
                                                    selectedAddress ===
                                                    address._id
                                                        ? "border-red-500 bg-red-50"
                                                        : "border-stone-200"
                                                }
                                            `}
                                        >

                                            <div className={`
                                                mt-0.5
                                                flex
                                                h-5
                                                w-5
                                                shrink-0
                                                items-center
                                                justify-center
                                                rounded-full
                                                border
                                                ${
                                                    selectedAddress ===
                                                    address._id
                                                        ? "border-red-600 bg-red-600 text-white"
                                                        : "border-stone-300"
                                                }
                                            `}>

                                                {selectedAddress ===
                                                    address._id && (
                                                    <Check size={12} />
                                                )}

                                            </div>


                                            <div>

                                                <div className="
                                                    flex
                                                    items-center
                                                    gap-2
                                                ">

                                                    <p className="
                                                        font-bold
                                                        text-stone-900
                                                    ">
                                                        {address.name}
                                                    </p>

                                                    {address.isDefault && (

                                                        <span className="
                                                            rounded-full
                                                            bg-green-50
                                                            px-2
                                                            py-0.5
                                                            text-[10px]
                                                            font-bold
                                                            text-green-700
                                                        ">
                                                            Default
                                                        </span>

                                                    )}

                                                </div>

                                                <p className="
                                                    mt-1
                                                    text-sm
                                                    leading-5
                                                    text-stone-600
                                                ">
                                                    {address.addressLine1}
                                                    {address.addressLine2 &&
                                                        `, ${address.addressLine2}`}
                                                    {address.landmark &&
                                                        `, ${address.landmark}`}
                                                    , {address.city}
                                                    , {address.state}
                                                    {" - "}
                                                    {address.pincode}
                                                </p>

                                                <p className="
                                                    mt-1
                                                    text-xs
                                                    text-stone-500
                                                ">
                                                    Phone: {address.phone}
                                                </p>

                                            </div>

                                        </button>

                                    ))}

                                </div>

                            )}

                        </div>


                        {/* Payment */}

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
                                Payment Method
                            </h2>

                            <div className="
                                mt-5
                                grid
                                gap-3
                                sm:grid-cols-2
                            ">

                                <button
                                    type="button"
                                    onClick={() =>
                                        setPaymentMethod(
                                            "cash"
                                        )
                                    }
                                    className={`
                                        rounded-xl
                                        border
                                        p-4
                                        text-left
                                        ${
                                            paymentMethod === "cash"
                                                ? "border-red-500 bg-red-50"
                                                : "border-stone-200"
                                        }
                                    `}
                                >

                                    <p className="font-bold">
                                        Cash on Delivery
                                    </p>

                                    <p className="
                                        mt-1
                                        text-xs
                                        text-stone-500
                                    ">
                                        Pay when your food arrives.
                                    </p>

                                </button>


                                <button
                                    type="button"
                                    onClick={() =>
                                        setPaymentMethod(
                                            "upi"
                                        )
                                    }
                                    className={`
                                        rounded-xl
                                        border
                                        p-4
                                        text-left
                                        ${
                                            paymentMethod === "upi"
                                                ? "border-red-500 bg-red-50"
                                                : "border-stone-200"
                                        }
                                    `}
                                >

                                    <p className="font-bold">
                                        UPI
                                    </p>

                                    <p className="
                                        mt-1
                                        text-xs
                                        text-stone-500
                                    ">
                                        Pay using UPI QR.
                                    </p>

                                </button>

                            </div>

                        </div>


                        {/* Note */}

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
                                Order Note
                            </h2>

                            <textarea
                                value={customerNote}
                                onChange={(event) =>
                                    setCustomerNote(
                                        event.target.value
                                    )
                                }
                                rows={4}
                                maxLength={500}
                                placeholder="Any special instructions?"
                                className="
                                    mt-4
                                    w-full
                                    resize-none
                                    rounded-xl
                                    border
                                    border-stone-200
                                    p-3
                                    text-sm
                                    outline-none
                                    focus:border-red-500
                                "
                            />

                        </div>

                    </div>


                    {/* Summary */}

                    <div>

                        <div className="
                            sticky
                            top-24
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
                                Order Summary
                            </h2>

                            <div className="
                                mt-5
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
                                        ₹{cart.subtotal}
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
                                        ₹{cart.deliveryFee}
                                    </span>
                                </div>

                                <div className="
                                    flex
                                    justify-between
                                ">
                                    <span className="text-stone-500">
                                        Discount
                                    </span>
                                    <span className="text-green-600">
                                        - ₹{cart.discount || 0}
                                    </span>
                                </div>

                            </div>

                            <div className="
                                my-5
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
                                    ₹{cart.total}
                                </span>

                            </div>


                            <button
                                type="button"
                                disabled={
                                    placingOrder ||
                                    !selectedAddress
                                }
                                onClick={handlePlaceOrder}
                                className="
                                    mt-6
                                    flex
                                    w-full
                                    items-center
                                    justify-center
                                    gap-2
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

                                {placingOrder
                                    ? "Placing Order..."
                                    : "Place Order"
                                }

                                {!placingOrder && (
                                    <ArrowRight size={17} />
                                )}

                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Checkout;