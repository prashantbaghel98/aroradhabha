import {
    Clock,
    Plus,
    ShoppingCart,
    Star
} from "lucide-react";

import {
    Link,
    useNavigate
} from "react-router-dom";

import { useState } from "react";

import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";


function FoodCard({ food }) {

    const navigate = useNavigate();


    // ==========================================
    // LOCAL LOADING STATE
    // ==========================================

    const [isAdding, setIsAdding] = useState(false);


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
        addToCart,
        isInCart,
        getCartItem
    } = useCart();


    // ==========================================
    // SAFETY
    // ==========================================

    if (!food) {
        return null;
    }


    // ==========================================
    // FOOD ID
    // ==========================================

    const foodId = food?._id;


    // ==========================================
    // CART STATUS
    // ==========================================

    const inCart =
        typeof isInCart === "function"
            ? isInCart(foodId)
            : false;


    const cartItem =
        typeof getCartItem === "function"
            ? getCartItem(foodId)
            : null;


    const quantity =
        cartItem?.quantity || 0;


    // ==========================================
    // PRICE
    // ==========================================

    const price =
        food?.discountPrice != null &&
        Number(food.discountPrice) < Number(food.price)
            ? food.discountPrice
            : food?.price || 0;


    // ==========================================
    // DISCOUNT
    // ==========================================

    const hasDiscount =
        food?.discountPrice != null &&
        Number(food.discountPrice) < Number(food.price);


    // ==========================================
    // ADD TO CART
    // ==========================================

    const handleAddToCart = async () => {

        if (!foodId) {
            console.error("Food ID is missing");
            return;
        }


        // ======================================
        // LOGIN CHECK
        // ======================================

        if (!isAuthenticated) {

            navigate("/login", {
                state: {
                    from: window.location.pathname
                }
            });

            return;
        }


        // ======================================
        // PREVENT DOUBLE CLICK
        // ======================================

        if (isAdding) {
            return;
        }


        try {

            // Only THIS card will show loading
            setIsAdding(true);


            await addToCart(foodId, 1);


        } catch (error) {

            console.error(
                "ADD TO CART ERROR:",
                error?.response?.data || error?.message
            );


        } finally {

            // Only THIS card stops loading
            setIsAdding(false);

        }
    };


    // ==========================================
    // RENDER
    // ==========================================

    return (

        <div
            className="
                group
                overflow-hidden
                rounded-2xl
                border
                border-stone-200
                bg-white
                shadow-sm
                transition
                duration-300
                hover:-translate-y-1
                hover:shadow-lg
            "
        >

            {/* =====================================
                IMAGE
            ====================================== */}

            <Link
                to={`/food/${foodId}`}
            >

                <div
                    className="
                        relative
                        aspect-[4/3]
                        overflow-hidden
                        bg-stone-100
                    "
                >

                    <img
                        src={
                            food.images?.[0] ||
                            "https://placehold.co/600x450?text=Food"
                        }
                        alt={
                            food.name ||
                            "Food"
                        }
                        className="
                            h-full
                            w-full
                            object-cover
                            transition
                            duration-500
                            group-hover:scale-105
                        "
                    />


                    {/* Featured */}

                    {food.isFeatured && (

                        <span
                            className="
                                absolute
                                left-3
                                top-3
                                rounded-full
                                bg-orange-500
                                px-3
                                py-1
                                text-xs
                                font-semibold
                                text-white
                            "
                        >
                            Featured
                        </span>

                    )}


                    {/* Food Type */}

                    {food.foodType && (

                        <span
                            className={`
                                absolute
                                right-3
                                top-3
                                rounded-full
                                px-3
                                py-1
                                text-xs
                                font-semibold

                                ${
                                    food.foodType === "veg"
                                        ? "bg-green-100 text-green-700"
                                        : food.foodType === "egg"
                                        ? "bg-yellow-100 text-yellow-700"
                                        : "bg-red-100 text-red-700"
                                }
                            `}
                        >

                            {food.foodType === "veg"
                                ? "VEG"
                                : food.foodType === "egg"
                                ? "EGG"
                                : "NON-VEG"}

                        </span>

                    )}


                    {/* Unavailable */}

                    {!food.isAvailable && (

                        <div
                            className="
                                absolute
                                inset-0
                                flex
                                items-center
                                justify-center
                                bg-black/50
                            "
                        >

                            <span
                                className="
                                    rounded-full
                                    bg-white
                                    px-4
                                    py-2
                                    text-sm
                                    font-semibold
                                    text-stone-800
                                "
                            >
                                Currently Unavailable
                            </span>

                        </div>

                    )}

                </div>

            </Link>


            {/* =====================================
                CONTENT
            ====================================== */}

            <div className="p-4">


                {/* Name */}

                <div className="mb-2">

                    <Link
                        to={`/food/${foodId}`}
                        className="
                            line-clamp-1
                            text-lg
                            font-bold
                            text-stone-900
                            transition
                            hover:text-red-600
                        "
                    >
                        {food.name}
                    </Link>

                </div>


                {/* Description */}

                <p
                    className="
                        mb-3
                        line-clamp-2
                        min-h-[40px]
                        text-sm
                        leading-5
                        text-stone-500
                    "
                >
                    {food.description ||
                        "Delicious food prepared fresh for you."}
                </p>


                {/* Rating + Preparation Time */}

                <div
                    className="
                        mb-4
                        flex
                        items-center
                        gap-4
                        text-sm
                    "
                >

                    {/* Rating */}

                    <div
                        className="
                            flex
                            items-center
                            gap-1
                            text-yellow-500
                        "
                    >

                        <Star
                            size={15}
                            fill="currentColor"
                        />

                        <span className="font-medium">

                            {Number(
                                food.rating || 0
                            ).toFixed(1)}

                        </span>

                        {food.totalReviews > 0 && (

                            <span className="text-stone-400">

                                (
                                {food.totalReviews}
                                )

                            </span>

                        )}

                    </div>


                    {/* Time */}

                    <div
                        className="
                            flex
                            items-center
                            gap-1
                            text-stone-500
                        "
                    >

                        <Clock size={15} />

                        <span>
                            {food.preparationTime || 15} min
                        </span>

                    </div>

                </div>


                {/* =================================
                    PRICE + ADD BUTTON
                ================================== */}

                <div
                    className="
                        flex
                        items-center
                        justify-between
                        gap-3
                    "
                >

                    {/* Price */}

                    <div>

                        <div
                            className="
                                flex
                                items-center
                                gap-2
                            "
                        >

                            <span
                                className="
                                    text-xl
                                    font-bold
                                    text-stone-900
                                "
                            >
                                ₹{price}
                            </span>


                            {hasDiscount && (

                                <span
                                    className="
                                        text-sm
                                        text-stone-400
                                        line-through
                                    "
                                >
                                    ₹{food.price}
                                </span>

                            )}

                        </div>

                    </div>


                    {/* Add Button */}

                    <button
                        type="button"
                        disabled={
                            !food.isAvailable ||
                            isAdding
                        }
                        onClick={handleAddToCart}
                        className={`
                            flex
                            items-center
                            gap-2
                            rounded-xl
                            px-4
                            py-2.5
                            text-sm
                            font-semibold
                            transition

                            ${
                                !food.isAvailable
                                    ? "cursor-not-allowed bg-stone-200 text-stone-400"

                                    : isAdding
                                    ? "cursor-not-allowed bg-stone-300 text-stone-500"

                                    : inCart
                                    ? "bg-green-100 text-green-700"

                                    : "bg-red-600 text-white hover:bg-red-700"
                            }
                        `}
                    >

                        {/* =================================
                            ONLY THIS CARD LOADING
                        ================================= */}

                        {isAdding ? (

                            <>

                                <span
                                    className="
                                        h-4
                                        w-4
                                        animate-spin
                                        rounded-full
                                        border-2
                                        border-stone-300
                                        border-t-stone-600
                                    "
                                />

                                Adding...

                            </>

                        ) : inCart ? (

                            <>

                                <ShoppingCart
                                    size={17}
                                />

                                Added

                                {quantity > 1 &&
                                    ` (${quantity})`}

                            </>

                        ) : (

                            <>

                                <Plus
                                    size={17}
                                />

                                Add

                            </>

                        )}

                    </button>

                </div>

            </div>

        </div>
    );
}


export default FoodCard;