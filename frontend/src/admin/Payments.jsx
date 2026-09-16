import { useEffect, useState } from "react";
import {
    CheckCircle,
    CreditCard,
    IndianRupee,
    Search,
    XCircle
} from "lucide-react";

import api from "../services/api";
import Loading from "../components/Loading";

function Payments() {

    const [payments, setPayments] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [search, setSearch] =
        useState("");


    const loadPayments = async () => {

        try {

            setLoading(true);

            const response =
                await api.get(
                    "/payment/get-all-payments"
                );

            setPayments(
                response.data.payments || []
            );

        } catch (error) {

            console.error(
                "Payments error:",
                error
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        loadPayments();

    }, []);


    const verifyUpi = async (
        id
    ) => {

        const confirmed =
            window.confirm(
                "Have you verified this UPI payment in the bank/UPI account?"
            );

        if (!confirmed) {
            return;
        }

        try {

            await api.put(
                `/payment/verify-upi/${id}`
            );

            await loadPayments();

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Unable to verify payment."
            );

        }
    };


    const rejectUpi = async (
        id
    ) => {

        const confirmed =
            window.confirm(
                "Reject this UPI payment?"
            );

        if (!confirmed) {
            return;
        }

        try {

            await api.put(
                `/payment/reject-upi/${id}`
            );

            await loadPayments();

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Unable to reject payment."
            );

        }
    };


    const markCashPaid = async (
        id
    ) => {

        const confirmed =
            window.confirm(
                "Confirm that cash has been received?"
            );

        if (!confirmed) {
            return;
        }

        try {

            await api.put(
                `/payment/mark-cash-paid/${id}`
            );

            await loadPayments();

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Unable to mark cash payment."
            );

        }
    };


    const filtered =
        payments.filter(
            (payment) => {

                const orderNumber =
                    payment.order?.orderNumber ||
                    "";

                const transactionId =
                    payment.transactionId ||
                    "";

                return (
                    orderNumber
                        .toLowerCase()
                        .includes(
                            search.toLowerCase()
                        ) ||
                    transactionId
                        .toLowerCase()
                        .includes(
                            search.toLowerCase()
                        )
                );

            }
        );


    const statusClass = {

        pending:
            "bg-yellow-50 text-yellow-700",

        processing:
            "bg-blue-50 text-blue-700",

        paid:
            "bg-green-50 text-green-700",

        failed:
            "bg-red-50 text-red-700",

        cancelled:
            "bg-stone-100 text-stone-600",

        refunded:
            "bg-purple-50 text-purple-700"
    };


    if (loading) {

        return (
            <Loading
                fullScreen
                text="Loading payments..."
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
                    Finance
                </p>

                <h1 className="
                    mt-1
                    text-3xl
                    font-black
                ">
                    Payments
                </h1>

            </div>


            <div className="
                mt-6
                relative
                max-w-md
            ">

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
                    placeholder="Search order or UTR..."
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
                    "
                />

            </div>


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
                        min-w-[900px]
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
                                    text-stone-500
                                ">
                                    Order
                                </th>

                                <th className="
                                    px-5
                                    py-4
                                    text-left
                                    text-xs
                                    text-stone-500
                                ">
                                    Amount
                                </th>

                                <th className="
                                    px-5
                                    py-4
                                    text-left
                                    text-xs
                                    text-stone-500
                                ">
                                    Method
                                </th>

                                <th className="
                                    px-5
                                    py-4
                                    text-left
                                    text-xs
                                    text-stone-500
                                ">
                                    UTR / Transaction
                                </th>

                                <th className="
                                    px-5
                                    py-4
                                    text-left
                                    text-xs
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

                            {filtered.map(
                                (payment) => (

                                <tr
                                    key={payment._id}
                                    className="hover:bg-stone-50"
                                >

                                    <td className="px-5 py-4">

                                        <p className="
                                            font-bold
                                        ">
                                            #
                                            {payment.order?.orderNumber ||
                                                payment.order ||
                                                "-"}
                                        </p>

                                    </td>


                                    <td className="px-5 py-4">

                                        <span className="
                                            flex
                                            items-center
                                            gap-1
                                            font-black
                                        ">
                                            <IndianRupee size={14} />
                                            {payment.amount}
                                        </span>

                                    </td>


                                    <td className="
                                        px-5
                                        py-4
                                        text-sm
                                        font-semibold
                                        uppercase
                                    ">
                                        {payment.method}
                                    </td>


                                    <td className="
                                        px-5
                                        py-4
                                        text-sm
                                    ">
                                        {payment.transactionId ||
                                            "Not submitted"}
                                    </td>


                                    <td className="px-5 py-4">

                                        <span className={`
                                            rounded-full
                                            px-3
                                            py-1
                                            text-xs
                                            font-bold
                                            capitalize
                                            ${
                                                statusClass[
                                                    payment.status
                                                ] ||
                                                "bg-stone-100 text-stone-600"
                                            }
                                        `}>
                                            {payment.status}
                                        </span>

                                    </td>


                                    <td className="px-5 py-4">

                                        <div className="
                                            flex
                                            gap-2
                                        ">

                                            {payment.method === "upi" &&
                                                payment.status === "processing" && (

                                                <>
                                                    <button
                                                        onClick={() =>
                                                            verifyUpi(
                                                                payment._id
                                                            )
                                                        }
                                                        className="
                                                            flex
                                                            items-center
                                                            gap-1.5
                                                            rounded-lg
                                                            bg-green-600
                                                            px-3
                                                            py-2
                                                            text-xs
                                                            font-bold
                                                            text-white
                                                        "
                                                    >
                                                        <CheckCircle
                                                            size={14}
                                                        />
                                                        Verify
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            rejectUpi(
                                                                payment._id
                                                            )
                                                        }
                                                        className="
                                                            flex
                                                            items-center
                                                            gap-1.5
                                                            rounded-lg
                                                            bg-red-50
                                                            px-3
                                                            py-2
                                                            text-xs
                                                            font-bold
                                                            text-red-600
                                                        "
                                                    >
                                                        <XCircle
                                                            size={14}
                                                        />
                                                        Reject
                                                    </button>
                                                </>

                                            )}


                                            {payment.method === "cash" &&
                                                payment.status === "pending" && (

                                                <button
                                                    onClick={() =>
                                                        markCashPaid(
                                                            payment._id
                                                        )
                                                    }
                                                    className="
                                                        rounded-lg
                                                        bg-green-600
                                                        px-3
                                                        py-2
                                                        text-xs
                                                        font-bold
                                                        text-white
                                                    "
                                                >
                                                    Mark Paid
                                                </button>

                                            )}

                                        </div>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>


                {filtered.length === 0 && (

                    <div className="
                        py-16
                        text-center
                    ">

                        <CreditCard
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
                            No payments found.
                        </p>

                    </div>

                )}

            </div>

        </div>
    );
}

export default Payments;