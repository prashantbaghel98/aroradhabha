import { useEffect, useState } from "react";

import {
    ArrowRight,
    Clock,
    MapPin,
    ShoppingBag,
    Utensils
} from "lucide-react";

import { Link } from "react-router-dom";

import { getFoods } from "../services/foodService";
import FoodCard from "../components/FoodCard";


function Home() {

    const [foods, setFoods] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // ==========================================
    // GET FOODS
    // ==========================================

    useEffect(() => {

        const fetchFoods = async () => {

            try {

                setLoading(true);

                setError("");


                const response =
                    await getFoods();


                // console.log(
                //     "Home Foods Response:",
                //     response
                // );


                /*
                    Depending on your backend response,
                    foods may be inside:

                    response.food
                    response.foods
                    response.data
                */

                const foodData =
                    response?.foods ||
                    response?.food ||
                    response?.data ||
                    [];


                setFoods(
                    Array.isArray(foodData)
                        ? foodData
                        : []
                );


            } catch (error) {

                console.error(
                    "Home Food Error:",
                    error.response?.data ||
                    error.message
                );


                setError(
                    error.response?.data?.message ||
                    "Unable to load food."
                );


            } finally {

                setLoading(false);

            }

        };


        fetchFoods();

    }, []);


    // ==========================================
    // POPULAR FOOD
    // ==========================================

    const popularFoods =
        foods
            .filter(
                (food) =>
                    food?.isAvailable !== false
            )
            .slice(0, 6);


    return (

        <div className="bg-stone-50">


            {/* =====================================
                HERO
            ====================================== */}

            <section className="relative overflow-hidden bg-red-600">

                <div
                    className="
                        mx-auto
                        max-w-7xl
                        px-4
                        py-20
                        sm:px-6
                        lg:px-8
                        lg:py-28
                    "
                >

                    <div
                        className="
                            grid
                            items-center
                            gap-12
                            lg:grid-cols-2
                        "
                    >


                        {/* Hero Content */}

                        <div className="text-white">

                            <span
                                className="
                                    inline-flex
                                    rounded-full
                                    bg-white/15
                                    px-4
                                    py-2
                                    text-sm
                                    font-semibold
                                    backdrop-blur
                                "
                            >
                                🍽️ Authentic Desi Taste
                            </span>


                            <h1
                                className="
                                    mt-6
                                    max-w-2xl
                                    text-4xl
                                    font-extrabold
                                    leading-tight
                                    sm:text-5xl
                                    lg:text-6xl
                                "
                            >
                                Delicious Food,
                                <br />
                                Made With Love
                            </h1>


                            <p
                                className="
                                    mt-6
                                    max-w-xl
                                    text-base
                                    leading-7
                                    text-red-100
                                    sm:text-lg
                                "
                            >
                                Enjoy fresh, delicious and authentic
                                food from Arora Da Dhabha. Order your
                                favourite food online and get it
                                delivered to your doorstep.
                            </p>


                            {/* Buttons */}

                            <div
                                className="
                                    mt-8
                                    flex
                                    flex-wrap
                                    gap-4
                                "
                            >

                                <Link
                                    to="/menu"
                                    className="
                                        inline-flex
                                        items-center
                                        gap-2
                                        rounded-xl
                                        bg-white
                                        px-6
                                        py-3
                                        text-sm
                                        font-bold
                                        !text-red-600
                                        shadow-lg
                                        transition
                                        hover:bg-stone-100
                                    "
                                >
                                    Order Now

                                    <ArrowRight size={18} />

                                </Link>


                                <Link
                                    to="/menu"
                                    className="
                                        inline-flex
                                        items-center
                                        gap-2
                                        rounded-xl
                                        border
                                        border-white/40
                                        px-6
                                        py-3
                                        text-sm
                                        font-bold
                                        text-white
                                        transition
                                        hover:bg-white/10
                                    "
                                >
                                    View Menu
                                </Link>

                            </div>

                        </div>



                        {/* =================================
                            HERO VISUAL
                        ================================= */}

                        <div className="relative">

                            <div
                                className="
                                    overflow-hidden
                                    rounded-3xl
                                    border
                                    border-white/20
                                    bg-white/10
                                    p-3
                                    shadow-2xl
                                    backdrop-blur
                                "
                            >

                                <div
                                    className="
                                        flex
                                        min-h-[360px]
                                        items-center
                                        justify-center
                                        rounded-2xl
                                        bg-stone-900
                                        p-8
                                    "
                                >

                                    <div className="text-center">

                                        <div
                                            className="
                                                mx-auto
                                                flex
                                                h-28
                                                w-28
                                                items-center
                                                justify-center
                                                rounded-full
                                                bg-red-600
                                                text-5xl
                                            "
                                        >
                                            <Utensils size={48} />
                                        </div>


                                        <h2
                                            className="
                                                mt-6
                                                text-3xl
                                                font-extrabold
                                                text-white
                                            "
                                        >
                                            Arora Da Dhabha
                                        </h2>


                                        <p
                                            className="
                                                mt-2
                                                text-stone-400
                                            "
                                        >
                                            Fresh • Tasty • Desi
                                        </p>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </section>



            {/* =====================================
                FEATURES
            ====================================== */}

            <section
                className="
                    border-b
                    border-stone-200
                    bg-white
                "
            >

                <div
                    className="
                        mx-auto
                        grid
                        max-w-7xl
                        gap-6
                        px-4
                        py-8
                        sm:grid-cols-2
                        sm:px-6
                        lg:grid-cols-3
                        lg:px-8
                    "
                >


                    {/* Feature 1 */}

                    <div className="flex items-center gap-4">

                        <div
                            className="
                                flex
                                h-12
                                w-12
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                                bg-red-50
                                text-red-600
                            "
                        >
                            <ShoppingBag size={22} />
                        </div>


                        <div>

                            <h3
                                className="
                                    font-bold
                                    text-stone-900
                                "
                            >
                                Easy Online Ordering
                            </h3>


                            <p
                                className="
                                    mt-1
                                    text-sm
                                    text-stone-500
                                "
                            >
                                Order your favourite food easily
                            </p>

                        </div>

                    </div>



                    {/* Feature 2 */}

                    <div className="flex items-center gap-4">

                        <div
                            className="
                                flex
                                h-12
                                w-12
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                                bg-red-50
                                text-red-600
                            "
                        >
                            <Clock size={22} />
                        </div>


                        <div>

                            <h3
                                className="
                                    font-bold
                                    text-stone-900
                                "
                            >
                                Freshly Prepared
                            </h3>


                            <p
                                className="
                                    mt-1
                                    text-sm
                                    text-stone-500
                                "
                            >
                                Fresh food prepared after your order
                            </p>

                        </div>

                    </div>



                    {/* Feature 3 */}

                    <div className="flex items-center gap-4">

                        <div
                            className="
                                flex
                                h-12
                                w-12
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                                bg-red-50
                                text-red-600
                            "
                        >
                            <MapPin size={22} />
                        </div>


                        <div>

                            <h3
                                className="
                                    font-bold
                                    text-stone-900
                                "
                            >
                                Local Delivery
                            </h3>


                            <p
                                className="
                                    mt-1
                                    text-sm
                                    text-stone-500
                                "
                            >
                                Fast delivery around your area
                            </p>

                        </div>

                    </div>

                </div>

            </section>



            {/* =====================================
                POPULAR FOOD
            ====================================== */}

            <section className="py-16">

                <div
                    className="
                        mx-auto
                        max-w-7xl
                        px-4
                        sm:px-6
                        lg:px-8
                    "
                >


                    {/* Header */}

                    <div
                        className="
                            flex
                            flex-col
                            gap-4
                            sm:flex-row
                            sm:items-end
                            sm:justify-between
                        "
                    >

                        <div>

                            <p
                                className="
                                    text-sm
                                    font-bold
                                    uppercase
                                    tracking-wider
                                    text-red-600
                                "
                            >
                                Customer Favourites
                            </p>


                            <h2
                                className="
                                    mt-2
                                    text-3xl
                                    font-extrabold
                                    text-stone-900
                                "
                            >
                                Popular Food
                            </h2>


                            <p
                                className="
                                    mt-2
                                    max-w-xl
                                    text-stone-500
                                "
                            >
                                Explore some of the delicious food
                                available at Arora Da Dhabha.
                            </p>

                        </div>


                        <Link
                            to="/menu"
                            className="
                                inline-flex
                                items-center
                                gap-2
                                text-sm
                                font-bold
                                text-red-600
                                hover:text-red-700
                            "
                        >
                            View Full Menu

                            <ArrowRight size={17} />

                        </Link>

                    </div>



                    {/* =================================
                        LOADING
                    ================================= */}

                    {loading && (

                        <div
                            className="
                                mt-10
                                grid
                                gap-6
                                sm:grid-cols-2
                                lg:grid-cols-3
                            "
                        >

                            {[1, 2, 3].map((item) => (

                                <div
                                    key={item}
                                    className="
                                        h-[390px]
                                        animate-pulse
                                        rounded-2xl
                                        border
                                        border-stone-200
                                        bg-white
                                    "
                                />

                            ))}

                        </div>

                    )}



                    {/* =================================
                        ERROR
                    ================================= */}

                    {!loading && error && (

                        <div
                            className="
                                mt-10
                                rounded-2xl
                                border
                                border-red-200
                                bg-red-50
                                p-6
                                text-center
                            "
                        >

                            <p
                                className="
                                    text-sm
                                    font-medium
                                    text-red-700
                                "
                            >
                                {error}
                            </p>


                            <button
                                type="button"
                                onClick={() =>
                                    window.location.reload()
                                }
                                className="
                                    mt-4
                                    rounded-xl
                                    bg-red-600
                                    px-5
                                    py-2.5
                                    text-sm
                                    font-bold
                                    text-white
                                    hover:bg-red-700
                                "
                            >
                                Try Again
                            </button>

                        </div>

                    )}



                    {/* =================================
                        NO FOOD
                    ================================= */}

                    {!loading &&
                        !error &&
                        popularFoods.length === 0 && (

                            <div
                                className="
                                    mt-10
                                    rounded-2xl
                                    border
                                    border-stone-200
                                    bg-white
                                    p-10
                                    text-center
                                "
                            >

                                <Utensils
                                    size={40}
                                    className="
                                        mx-auto
                                        text-stone-300
                                    "
                                />


                                <h3
                                    className="
                                        mt-4
                                        text-lg
                                        font-bold
                                        text-stone-900
                                    "
                                >
                                    No food available right now
                                </h3>


                                <p
                                    className="
                                        mt-2
                                        text-sm
                                        text-stone-500
                                    "
                                >
                                    Please check our menu again soon.
                                </p>

                            </div>

                        )}



                    {/* =================================
                        REAL FOOD FROM DATABASE
                    ================================= */}

                    {!loading &&
                        !error &&
                        popularFoods.length > 0 && (

                            <div
                                className="
                                    mt-10
                                    grid
                                    gap-6
                                    sm:grid-cols-2
                                    lg:grid-cols-3
                                "
                            >

                                {popularFoods.map((food) => (

                                    <FoodCard
                                        key={food._id}
                                        food={food}
                                    />

                                ))}

                            </div>

                        )}

                </div>

            </section>



            {/* =====================================
                CTA
            ====================================== */}

            <section className="bg-stone-900">

                <div
                    className="
                        mx-auto
                        max-w-7xl
                        px-4
                        py-16
                        text-center
                        sm:px-6
                        lg:px-8
                    "
                >

                    <h2
                        className="
                            text-3xl
                            font-extrabold
                            text-white
                            sm:text-4xl
                        "
                    >
                        Hungry? Let's Fix That!
                    </h2>


                    <p
                        className="
                            mx-auto
                            mt-4
                            max-w-xl
                            text-stone-400
                        "
                    >
                        Browse our menu and order delicious food
                        from Arora Da Dhabha.
                    </p>


                    <Link
                        to="/menu"
                        className="
                            mt-8
                            inline-flex
                            items-center
                            gap-2
                            rounded-xl
                            bg-red-600
                            px-7
                            py-3.5
                            text-sm
                            font-bold
                            text-white
                            transition
                            hover:bg-red-700
                        "
                    >
                        Explore Menu

                        <ArrowRight size={18} />

                    </Link>

                </div>

            </section>

        </div>
    );
}


export default Home;