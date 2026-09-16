import { useEffect, useState } from "react";
import {
    CheckCircle,
    Copy,
    CreditCard,
    IndianRupee
} from "lucide-react";

import {
    Link,
    useParams
} from "react-router-dom";

import {
    getPayment,
    submitUpiPayment
} from "../services/paymentService";

import Loading from "../components/Loading";

function Payment() {

    const { orderId } = useParams();

    const [payment, setPayment] =
        useState(null);

    const [utr, setUtr] =
        useState("");

    const [loading, setLoading] =
        useState(true);

    const [submitting, setSubmitting] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    useEffect(() => {

        const loadPayment = async () => {

            try {

                const response =
                    await getPayment(orderId);

                setPayment(
                    response?.payment
                );

            } catch (error) {

                console.error(
                    "Payment error:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Unable to load payment."
                );

            } finally {

                setLoading(false);

            }
        };

        loadPayment();

    }, [orderId]);


    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");
        setSuccess("");


        if (!utr.trim()) {

            setError(
                "Please enter your UTR or transaction ID."
            );

            return;
        }


        try {

            setSubmitting(true);

            const response =
                await submitUpiPayment(
                    orderId,
                    utr.trim()
                );

            setPayment(
                response?.payment ||
                payment
            );

            setSuccess(
                "Payment details submitted. Your payment will be verified by the restaurant."
            );

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Unable to submit payment."
            );

        } finally {

            setSubmitting(false);

        }
    };


    const copyUpiId = async () => {

        try {

            await navigator.clipboard.writeText(
                "prashant@ybl"
            );

            setSuccess(
                "UPI ID copied."
            );

        } catch {

            // Ignore clipboard errors
        }
    };


    if (loading) {

        return (
            <Loading
                fullScreen
                text="Loading payment..."
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
                max-w-lg
                px-4
            ">

                <div className="
                    rounded-3xl
                    border
                    border-stone-200
                    bg-white
                    p-6
                    shadow-sm
                    sm:p-8
                ">

                    <div className="text-center">

                        <div className="
                            mx-auto
                            flex
                            h-14
                            w-14
                            items-center
                            justify-center
                            rounded-2xl
                            bg-red-50
                            text-red-600
                        ">
                            <CreditCard size={25} />
                        </div>

                        <h1 className="
                            mt-4
                            text-2xl
                            font-black
                            text-stone-900
                        ">
                            Complete UPI Payment
                        </h1>

                        <p className="
                            mt-2
                            text-sm
                            text-stone-500
                        ">
                            Pay the restaurant and submit
                            your UTR number below.
                        </p>

                    </div>


                    {/* Amount */}

                    <div className="
                        mt-7
                        rounded-2xl
                        bg-stone-50
                        p-5
                        text-center
                    ">

                        <p className="
                            text-xs
                            font-semibold
                            uppercase
                            tracking-wider
                            text-stone-500
                        ">
                            Amount to Pay
                        </p>

                        <p className="
                            mt-1
                            flex
                            items-center
                            justify-center
                            gap-1
                            text-3xl
                            font-black
                            text-stone-900
                        ">
                            <IndianRupee size={25} />
                            {payment?.amount || 0}
                        </p>

                    </div>


                    {/* QR */}

                    <div className="
                        mt-6
                        flex
                        justify-center
                    ">

                        <div className="
                            rounded-2xl
                            border
                            border-stone-200
                            bg-white
                            p-4
                        ">

                            <img
                                src="https://qrexplore.com/icon/apple-icon.png"
                                alt="UPI QR code"
                                className="
                                    h-52
                                    w-52
                                "
                            />

                        </div>

                    </div>


                    {/* UPI */}

                    <div className="
                        mt-5
                        flex
                        items-center
                        justify-between
                        rounded-xl
                        border
                        border-stone-200
                        px-4
                        py-3
                    ">

                        <div>

                            <p className="
                                text-xs
                                text-stone-500
                            ">
                                UPI ID
                            </p>

                            <p className="
                                mt-0.5
                                font-bold
                                text-stone-900
                            ">
                                prashant@ybl
                            </p>

                        </div>

                        <button
                            type="button"
                            onClick={copyUpiId}
                            className="
                                text-stone-500
                                hover:text-red-600
                            "
                        >
                            <Copy size={18} />
                        </button>

                    </div>


                    {/* Messages */}

                    {error && (

                        <div className="
                            mt-5
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

                    {success && (

                        <div className="
                            mt-5
                            flex
                            gap-2
                            rounded-xl
                            bg-green-50
                            px-4
                            py-3
                            text-sm
                            text-green-700
                        ">
                            <CheckCircle
                                size={18}
                                className="shrink-0"
                            />
                            {success}
                        </div>

                    )}


                    {/* UTR */}

                    <form
                        onSubmit={handleSubmit}
                        className="mt-6"
                    >

                        <label className="
                            mb-2
                            block
                            text-sm
                            font-bold
                            text-stone-700
                        ">
                            UTR / Transaction ID
                        </label>

                        <input
                            type="text"
                            value={utr}
                            onChange={(event) =>
                                setUtr(
                                    event.target.value
                                )
                            }
                            placeholder="Enter UTR number"
                            className="
                                w-full
                                rounded-xl
                                border
                                border-stone-200
                                px-4
                                py-3
                                text-sm
                                outline-none
                                focus:border-red-500
                                focus:ring-2
                                focus:ring-red-100
                            "
                        />

                        <button
                            type="submit"
                            disabled={submitting}
                            className="
                                mt-4
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
                            {submitting
                                ? "Submitting..."
                                : "Submit Payment Details"
                            }
                        </button>

                    </form>


                    <Link
                        to={`/order-success/${orderId}`}
                        className="
                            mt-4
                            block
                            text-center
                            text-sm
                            font-semibold
                            text-stone-500
                            hover:text-red-600
                        "
                    >
                        Continue to Order
                    </Link>

                </div>

            </div>

        </div>
    );
}

export default Payment;