import {
    CheckCircle,
    ClipboardList,
    Home,
    ArrowRight
} from "lucide-react";

import {
    Link,
    useParams
} from "react-router-dom";

function OrderSuccess() {

    const { orderId } = useParams();

    return (

        <div className="
            flex
            min-h-[70vh]
            items-center
            justify-center
            bg-stone-50
            px-4
            py-12
        ">

            <div className="
                w-full
                max-w-lg
                rounded-3xl
                border
                border-stone-200
                bg-white
                p-8
                text-center
                shadow-sm
                sm:p-10
            ">

                <div className="
                    mx-auto
                    flex
                    h-20
                    w-20
                    items-center
                    justify-center
                    rounded-full
                    bg-green-50
                    text-green-600
                ">

                    <CheckCircle
                        size={48}
                    />

                </div>


                <p className="
                    mt-6
                    text-sm
                    font-bold
                    uppercase
                    tracking-wider
                    text-green-600
                ">
                    Order Placed
                </p>


                <h1 className="
                    mt-2
                    text-3xl
                    font-black
                    text-stone-900
                ">
                    Thank You!
                </h1>


                <p className="
                    mx-auto
                    mt-3
                    max-w-md
                    text-sm
                    leading-6
                    text-stone-500
                ">
                    Your order has been placed successfully.
                    We will start preparing your food soon.
                </p>


                <div className="
                    mt-6
                    rounded-xl
                    bg-stone-50
                    p-4
                ">

                    <p className="
                        text-xs
                        text-stone-500
                    ">
                        Order ID
                    </p>

                    <p className="
                        mt-1
                        break-all
                        font-bold
                        text-stone-900
                    ">
                        {orderId}
                    </p>

                </div>


                <div className="
                    mt-7
                    grid
                    gap-3
                    sm:grid-cols-2
                ">

                    <Link
                        to={`/orders/${orderId}`}
                        className="
                            flex
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
                            hover:bg-red-700
                        "
                    >
                        Track Order
                        <ArrowRight size={17} />
                    </Link>


                    <Link
                        to="/orders"
                        className="
                            flex
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            border
                            border-stone-200
                            px-5
                            py-3
                            text-sm
                            font-bold
                            text-stone-700
                            hover:bg-stone-50
                        "
                    >
                        <ClipboardList size={17} />
                        My Orders
                    </Link>

                </div>


                <Link
                    to="/"
                    className="
                        mt-5
                        inline-flex
                        items-center
                        gap-2
                        text-sm
                        font-semibold
                        text-stone-500
                        hover:text-red-600
                    "
                >
                    <Home size={16} />
                    Back Home
                </Link>

            </div>

        </div>
    );
}

export default OrderSuccess;