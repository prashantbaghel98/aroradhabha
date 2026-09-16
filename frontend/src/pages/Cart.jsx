import {
    ArrowRight,
    Minus,
    Plus,
    ShoppingBag,
    Trash2
} from "lucide-react";

import {
    Link,
    useNavigate
} from "react-router-dom";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";


function Cart() {

    const navigate = useNavigate();


    // ==========================================
    // AUTH
    // ==========================================

    const {
        isAuthenticated
    } = useAuth();


    // ==========================================
    // CART
    // ==========================================

    const {
        cart,
        updateCartItem,
        removeFromCart,
        loading
    } = useCart();


    // ==========================================
    // NOT LOGGED IN
    // ==========================================

    if (!isAuthenticated) {

        return (

            <div
                className="
                    flex
                    min-h-[60vh]
                    items-center
                    justify-center
                    px-4
                "
            >

                <div
                    className="
                        max-w-md
                        text-center
                    "
                >

                    <ShoppingBag
                        size={52}
                        className="
                            mx-auto
                            text-stone-300
                        "
                    />


                    <h1
                        className="
                            mt-5
                            text-2xl
                            font-black
                            text-stone-900
                        "
                    >
                        Login to view your cart
                    </h1>


                    <p
                        className="
                            mt-2
                            text-sm
                            leading-6
                            text-stone-500
                        "
                    >
                        Please login before adding items
                        to your cart.
                    </p>


                    <Link
                        to="/login"
                        state={{
                            from: "/cart"
                        }}
                        className="
                            mt-6
                            inline-flex
                            items-center
                            gap-2
                            rounded-xl
                            bg-red-600
                            px-6
                            py-3
                            text-sm
                            font-bold
                            text-white
                            transition
                            hover:bg-red-700
                        "
                    >
                        Login

                        <ArrowRight
                            size={17}
                        />

                    </Link>

                </div>

            </div>

        );

    }


    // ==========================================
    // LOADING
    // ==========================================

    if (loading && !cart.items?.length) {

        return (

            <div
                className="
                    flex
                    min-h-[60vh]
                    items-center
                    justify-center
                "
            >

                <div className="text-center">

                    <div
                        className="
                            mx-auto
                            h-10
                            w-10
                            animate-spin
                            rounded-full
                            border-4
                            border-stone-200
                            border-t-red-600
                        "
                    />


                    <p
                        className="
                            mt-4
                            text-sm
                            font-medium
                            text-stone-500
                        "
                    >
                        Loading your cart...
                    </p>

                </div>

            </div>

        );

    }


    // ==========================================
    // EMPTY CART
    // ==========================================

    if (!cart.items?.length) {

        return (

            <div
                className="
                    flex
                    min-h-[60vh]
                    items-center
                    justify-center
                    px-4
                "
            >

                <div className="text-center">

                    <ShoppingBag
                        size={56}
                        className="
                            mx-auto
                            text-stone-300
                        "
                    />


                    <h1
                        className="
                            mt-5
                            text-2xl
                            font-black
                            text-stone-900
                        "
                    >
                        Your cart is empty
                    </h1>


                    <p
                        className="
                            mt-2
                            text-sm
                            leading-6
                            text-stone-500
                        "
                    >
                        Add some delicious food
                        to get started.
                    </p>


                    <Link
                        to="/menu"
                        className="
                            mt-6
                            inline-flex
                            items-center
                            gap-2
                            rounded-xl
                            bg-red-600
                            px-6
                            py-3
                            text-sm
                            font-bold
                            text-white
                            transition
                            hover:bg-red-700
                        "
                    >
                        Browse Menu

                        <ArrowRight
                            size={17}
                        />

                    </Link>

                </div>

            </div>

        );

    }


    // ==========================================
    // CART
    // ==========================================

    return (

        <div
            className="
                min-h-[70vh]
                bg-stone-50
                py-10
                sm:py-14
            "
        >

            <div
                className="
                    mx-auto
                    max-w-7xl
                    px-4
                    sm:px-6
                    lg:px-8
                "
            >


                {/* =================================
                    HEADER
                ================================== */}

                <div className="mb-8">

                    <p
                        className="
                            text-sm
                            font-bold
                            uppercase
                            tracking-wider
                            text-red-600
                        "
                    >
                        Your Order
                    </p>


                    <h1
                        className="
                            mt-1
                            text-3xl
                            font-black
                            text-stone-900
                            sm:text-4xl
                        "
                    >
                        Shopping Cart
                    </h1>


                    <p
                        className="
                            mt-2
                            text-sm
                            text-stone-500
                        "
                    >
                        Review your items before checkout.
                    </p>

                </div>



                {/* =================================
                    MAIN GRID
                ================================== */}

                <div
                    className="
                        grid
                        gap-6
                        lg:grid-cols-[1fr_380px]
                    "
                >


                    {/* =================================
                        CART ITEMS
                    ================================== */}

                    <div className="space-y-4">

                        {cart.items.map(
                            (item) => {

                                /*
                                    item.food can be:

                                    object
                                    OR
                                    ObjectId/string
                                */

                                const food =
                                    item.food &&
                                    typeof item.food === "object"
                                        ? item.food
                                        : {};


                                const foodId =
                                    food?._id ||
                                    item.food;


                                const image =
                                    food?.images?.[0] ||
                                    "https://placehold.co/200x150?text=Food";


                                const itemTotal =
                                    Number(
                                        item.total || 0
                                    );


                                const itemPrice =
                                    Number(
                                        item.price || 0
                                    );


                                return (

                                    <div
                                        key={foodId}
                                        className="
                                            flex
                                            gap-4
                                            rounded-2xl
                                            border
                                            border-stone-200
                                            bg-white
                                            p-4
                                            shadow-sm
                                        "
                                    >


                                        {/* IMAGE */}

                                        <Link
                                            to={`/food/${foodId}`}
                                            className="
                                                shrink-0
                                            "
                                        >

                                            <img
                                                src={image}
                                                alt={
                                                    food?.name ||
                                                    "Food"
                                                }
                                                className="
                                                    h-24
                                                    w-24
                                                    rounded-xl
                                                    object-cover
                                                    sm:h-28
                                                    sm:w-28
                                                "
                                            />

                                        </Link>



                                        {/* CONTENT */}

                                        <div
                                            className="
                                                min-w-0
                                                flex-1
                                            "
                                        >


                                            {/* TOP */}

                                            <div
                                                className="
                                                    flex
                                                    items-start
                                                    justify-between
                                                    gap-3
                                                "
                                            >

                                                <div className="min-w-0">

                                                    <Link
                                                        to={`/food/${foodId}`}
                                                        className="
                                                            block
                                                            truncate
                                                            font-bold
                                                            text-stone-900
                                                            hover:text-red-600
                                                        "
                                                    >
                                                        {food?.name ||
                                                            "Food Item"}
                                                    </Link>


                                                    <p
                                                        className="
                                                            mt-1
                                                            text-sm
                                                            text-stone-500
                                                        "
                                                    >
                                                        ₹{itemPrice}
                                                        {" "}each
                                                    </p>

                                                </div>


                                                {/* DELETE */}

                                                <button
                                                    type="button"
                                                    disabled={loading}
                                                    onClick={() =>
                                                        removeFromCart(
                                                            foodId
                                                        )
                                                    }
                                                    className="
                                                        flex
                                                        h-9
                                                        w-9
                                                        shrink-0
                                                        items-center
                                                        justify-center
                                                        rounded-lg
                                                        text-stone-400
                                                        transition
                                                        hover:bg-red-50
                                                        hover:text-red-600
                                                        disabled:cursor-not-allowed
                                                        disabled:opacity-50
                                                    "
                                                    aria-label="Remove item"
                                                >
                                                    <Trash2
                                                        size={18}
                                                    />
                                                </button>

                                            </div>



                                            {/* BOTTOM */}

                                            <div
                                                className="
                                                    mt-4
                                                    flex
                                                    items-center
                                                    justify-between
                                                    gap-3
                                                "
                                            >


                                                {/* QUANTITY */}

                                                <div
                                                    className="
                                                        flex
                                                        items-center
                                                        rounded-xl
                                                        border
                                                        border-stone-200
                                                        bg-stone-50
                                                    "
                                                >

                                                    <button
                                                        type="button"
                                                        disabled={
                                                            loading ||
                                                            item.quantity <= 1
                                                        }
                                                        onClick={() =>
                                                            updateCartItem(
                                                                foodId,
                                                                Math.max(
                                                                    1,
                                                                    Number(
                                                                        item.quantity
                                                                    ) - 1
                                                                )
                                                            )
                                                        }
                                                        className="
                                                            flex
                                                            h-9
                                                            w-9
                                                            items-center
                                                            justify-center
                                                            rounded-l-xl
                                                            text-stone-600
                                                            transition
                                                            hover:bg-stone-200
                                                            disabled:cursor-not-allowed
                                                            disabled:opacity-40
                                                        "
                                                        aria-label="Decrease quantity"
                                                    >
                                                        <Minus
                                                            size={15}
                                                        />
                                                    </button>


                                                    <span
                                                        className="
                                                            w-9
                                                            text-center
                                                            text-sm
                                                            font-bold
                                                            text-stone-900
                                                        "
                                                    >
                                                        {item.quantity}
                                                    </span>


                                                    <button
                                                        type="button"
                                                        disabled={loading}
                                                        onClick={() =>
                                                            updateCartItem(
                                                                foodId,
                                                                Number(
                                                                    item.quantity
                                                                ) + 1
                                                            )
                                                        }
                                                        className="
                                                            flex
                                                            h-9
                                                            w-9
                                                            items-center
                                                            justify-center
                                                            rounded-r-xl
                                                            text-stone-600
                                                            transition
                                                            hover:bg-stone-200
                                                            disabled:cursor-not-allowed
                                                            disabled:opacity-40
                                                        "
                                                        aria-label="Increase quantity"
                                                    >
                                                        <Plus
                                                            size={15}
                                                        />
                                                    </button>

                                                </div>



                                                {/* ITEM TOTAL */}

                                                <p
                                                    className="
                                                        text-lg
                                                        font-black
                                                        text-stone-900
                                                    "
                                                >
                                                    ₹{itemTotal}
                                                </p>

                                            </div>

                                        </div>

                                    </div>

                                );

                            }
                        )}

                    </div>



                    {/* =================================
                        SUMMARY
                    ================================== */}

                    <div>

                        <div
                            className="
                                sticky
                                top-24
                                rounded-2xl
                                border
                                border-stone-200
                                bg-white
                                p-5
                                shadow-sm
                            "
                        >

                            <h2
                                className="
                                    text-lg
                                    font-black
                                    text-stone-900
                                "
                            >
                                Order Summary
                            </h2>


                            {/* SUMMARY */}

                            <div
                                className="
                                    mt-5
                                    space-y-3
                                    text-sm
                                "
                            >

                                {/* Subtotal */}

                                <div
                                    className="
                                        flex
                                        justify-between
                                    "
                                >

                                    <span
                                        className="
                                            text-stone-500
                                        "
                                    >
                                        Subtotal
                                    </span>


                                    <span
                                        className="
                                            font-semibold
                                            text-stone-900
                                        "
                                    >
                                        ₹{cart.subtotal || 0}
                                    </span>

                                </div>


                                {/* Discount */}

                                <div
                                    className="
                                        flex
                                        justify-between
                                    "
                                >

                                    <span
                                        className="
                                            text-stone-500
                                        "
                                    >
                                        Discount
                                    </span>


                                    <span
                                        className="
                                            font-semibold
                                            text-green-600
                                        "
                                    >
                                        - ₹{cart.discount || 0}
                                    </span>

                                </div>


                                {/* Delivery */}

                                <div
                                    className="
                                        flex
                                        justify-between
                                    "
                                >

                                    <span
                                        className="
                                            text-stone-500
                                        "
                                    >
                                        Delivery Fee
                                    </span>


                                    <span
                                        className="
                                            font-semibold
                                            text-stone-900
                                        "
                                    >
                                        ₹{cart.deliveryFee || 0}
                                    </span>

                                </div>

                            </div>



                            {/* DIVIDER */}

                            <div
                                className="
                                    my-5
                                    border-t
                                    border-stone-200
                                "
                            />



                            {/* TOTAL */}

                            <div
                                className="
                                    flex
                                    items-center
                                    justify-between
                                "
                            >

                                <span
                                    className="
                                        font-bold
                                        text-stone-900
                                    "
                                >
                                    Total
                                </span>


                                <span
                                    className="
                                        text-2xl
                                        font-black
                                        text-stone-900
                                    "
                                >
                                    ₹{cart.total || 0}
                                </span>

                            </div>



                            {/* CHECKOUT */}

                            <button
                                type="button"
                                disabled={loading}
                                onClick={() =>
                                    navigate(
                                        "/checkout"
                                    )
                                }
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
                                    transition
                                    hover:bg-red-700
                                    disabled:cursor-not-allowed
                                    disabled:opacity-60
                                "
                            >
                                Proceed to Checkout

                                <ArrowRight
                                    size={17}
                                />

                            </button>



                            {/* CONTINUE */}

                            <Link
                                to="/menu"
                                className="
                                    mt-3
                                    block
                                    text-center
                                    text-sm
                                    font-semibold
                                    text-stone-500
                                    transition
                                    hover:text-red-600
                                "
                            >
                                Continue Shopping
                            </Link>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}


export default Cart;