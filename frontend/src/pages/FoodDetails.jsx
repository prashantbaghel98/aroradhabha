import { useEffect, useState } from "react";
import {
    ArrowLeft,
    Clock,
    Minus,
    Plus,
    ShoppingCart,
    Star
} from "lucide-react";

import {
    Link,
    useNavigate,
    useParams
} from "react-router-dom";

import { getFoodById } from "../services/foodService";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import Loading from "../components/Loading";

function FoodDetails() {

    const { id } = useParams();

    const navigate = useNavigate();

    const { isAuthenticated } =
        useAuth();

    const { addToCart } =
        useCart();

    const [food, setFood] =
        useState(null);

    const [quantity, setQuantity] =
        useState(1);

    const [loading, setLoading] =
        useState(true);

    const [adding, setAdding] =
        useState(false);


    useEffect(() => {

        const loadFood = async () => {

            try {

                const response =
                    await getFoodById(id);

                setFood(
                    response?.food
                );

            } catch (error) {

                console.error(
                    "Food details error:",
                    error
                );

            } finally {

                setLoading(false);

            }
        };

        loadFood();

    }, [id]);


    const handleAddToCart = async () => {

        if (!isAuthenticated) {

            navigate("/login", {
                state: {
                    from: `/food/${id}`
                }
            });

            return;
        }

        try {

            setAdding(true);

            await addToCart(
                food._id,
                quantity
            );

            navigate("/cart");

        } catch (error) {

            console.error(error);

        } finally {

            setAdding(false);

        }
    };


    if (loading) {

        return (
            <Loading
                fullScreen
                text="Loading food..."
            />
        );

    }


    if (!food) {

        return (

            <div className="
                flex
                min-h-[60vh]
                items-center
                justify-center
                px-4
            ">

                <div className="text-center">

                    <h2 className="
                        text-2xl
                        font-bold
                        text-stone-900
                    ">
                        Food not found
                    </h2>

                    <Link
                        to="/menu"
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
                        Back to Menu
                    </Link>

                </div>

            </div>

        );

    }


    const image =
        food.images?.[0] ||
        "https://placehold.co/800x600?text=Food";

    const price =
        food.discountPrice ??
        food.price;

    const total =
        price * quantity;


    return (

        <div className="
            bg-stone-50
            py-8
            sm:py-12
        ">

            <div className="
                mx-auto
                max-w-7xl
                px-4
                sm:px-6
                lg:px-8
            ">

                <Link
                    to="/menu"
                    className="
                        mb-6
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
                    Back to Menu
                </Link>


                <div className="
                    grid
                    overflow-hidden
                    rounded-3xl
                    border
                    border-stone-200
                    bg-white
                    shadow-sm
                    lg:grid-cols-2
                ">

                    {/* Image */}

                    <div className="
                        relative
                        bg-stone-100
                    ">

                        <img
                            src={image}
                            alt={food.name}
                            className="
                                h-full
                                min-h-[350px]
                                w-full
                                object-cover
                                lg:min-h-[600px]
                            "
                        />

                        {food.foodType && (

                            <span className="
                                absolute
                                left-5
                                top-5
                                rounded-full
                                bg-white
                                px-4
                                py-2
                                text-xs
                                font-bold
                                capitalize
                                shadow-sm
                            ">
                                {food.foodType}
                            </span>

                        )}

                    </div>


                    {/* Content */}

                    <div className="
                        flex
                        flex-col
                        justify-center
                        p-6
                        sm:p-10
                        lg:p-14
                    ">

                        <p className="
                            text-sm
                            font-bold
                            uppercase
                            tracking-wider
                            text-red-600
                        ">
                            {food.category}
                        </p>

                        <h1 className="
                            mt-3
                            text-3xl
                            font-black
                            text-stone-900
                            sm:text-4xl
                        ">
                            {food.name}
                        </h1>


                        {/* Rating */}

                        <div className="
                            mt-4
                            flex
                            items-center
                            gap-3
                        ">

                            {food.rating > 0 && (

                                <div className="
                                    flex
                                    items-center
                                    gap-1
                                    rounded-lg
                                    bg-green-50
                                    px-2.5
                                    py-1.5
                                    text-sm
                                    font-bold
                                    text-green-700
                                ">
                                    <Star
                                        size={14}
                                        fill="currentColor"
                                    />
                                    {Number(food.rating).toFixed(1)}
                                </div>

                            )}

                            {food.totalReviews > 0 && (

                                <span className="
                                    text-sm
                                    text-stone-500
                                ">
                                    {food.totalReviews} reviews
                                </span>

                            )}

                        </div>


                        <p className="
                            mt-6
                            leading-7
                            text-stone-600
                        ">
                            {food.description}
                        </p>


                        {/* Preparation */}

                        {food.preparationTime && (

                            <div className="
                                mt-5
                                flex
                                items-center
                                gap-2
                                text-sm
                                text-stone-500
                            ">

                                <Clock size={17} />

                                Preparation time:
                                <strong className="text-stone-800">
                                    {food.preparationTime} min
                                </strong>

                            </div>

                        )}


                        {/* Price */}

                        <div className="
                            mt-7
                            flex
                            items-end
                            gap-3
                        ">

                            <span className="
                                text-3xl
                                font-black
                                text-stone-900
                            ">
                                ₹{price}
                            </span>

                            {food.discountPrice &&
                                food.discountPrice < food.price && (

                                <span className="
                                    pb-1
                                    text-lg
                                    text-stone-400
                                    line-through
                                ">
                                    ₹{food.price}
                                </span>

                            )}

                        </div>


                        {/* Quantity */}

                        <div className="
                            mt-7
                            flex
                            flex-wrap
                            items-center
                            gap-4
                        ">

                            <div className="
                                flex
                                items-center
                                rounded-xl
                                border
                                border-stone-200
                            ">

                                <button
                                    type="button"
                                    onClick={() =>
                                        setQuantity(
                                            Math.max(
                                                1,
                                                quantity - 1
                                            )
                                        )
                                    }
                                    className="
                                        flex
                                        h-11
                                        w-11
                                        items-center
                                        justify-center
                                        text-stone-600
                                        hover:bg-stone-50
                                    "
                                >
                                    <Minus size={17} />
                                </button>

                                <span className="
                                    flex
                                    h-11
                                    w-10
                                    items-center
                                    justify-center
                                    text-sm
                                    font-bold
                                ">
                                    {quantity}
                                </span>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setQuantity(
                                            quantity + 1
                                        )
                                    }
                                    className="
                                        flex
                                        h-11
                                        w-11
                                        items-center
                                        justify-center
                                        text-stone-600
                                        hover:bg-stone-50
                                    "
                                >
                                    <Plus size={17} />
                                </button>

                            </div>


                            <button
                                type="button"
                                disabled={
                                    !food.isAvailable ||
                                    adding
                                }
                                onClick={handleAddToCart}
                                className="
                                    flex
                                    min-h-11
                                    flex-1
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
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                "
                            >

                                <ShoppingCart size={18} />

                                {adding
                                    ? "Adding..."
                                    : `Add to Cart • ₹${total}`
                                }

                            </button>

                        </div>


                        {!food.isAvailable && (

                            <p className="
                                mt-4
                                text-sm
                                font-semibold
                                text-red-600
                            ">
                                This food is currently unavailable.
                            </p>

                        )}

                    </div>

                </div>

            </div>

        </div>
    );
}

export default FoodDetails;