import { useEffect, useMemo, useState } from "react";
import {
    Search,
    SlidersHorizontal,
    X
} from "lucide-react";

import FoodCard from "../components/FoodCard";
import Loading from "../components/Loading";

import { getFoods } from "../services/foodService";

function Menu() {

    const [foods, setFoods] = useState([]);

    const [loading, setLoading] =
        useState(true);

    const [search, setSearch] =
        useState("");

    const [category, setCategory] =
        useState("all");

    const [foodType, setFoodType] =
        useState("all");


    const loadFoods = async () => {

        try {

            setLoading(true);

            const response =
                await getFoods();

            setFoods(
                response?.food ||
                response?.foods ||
                []
            );

        } catch (error) {

            console.error(
                "Menu Error:",
                error
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {
        loadFoods();
    }, []);


    /*
    |--------------------------------------------------------------------------
    | Categories
    |--------------------------------------------------------------------------
    */

    const categories = useMemo(() => {

        const uniqueCategories =
            [...new Set(
                foods
                    .map((food) => food.category)
                    .filter(Boolean)
            )];

        return uniqueCategories;

    }, [foods]);


    /*
    |--------------------------------------------------------------------------
    | Filter
    |--------------------------------------------------------------------------
    */

    const filteredFoods = useMemo(() => {

        return foods.filter((food) => {

            const matchesSearch =
                food.name
                    ?.toLowerCase()
                    .includes(
                        search.toLowerCase()
                    );

            const matchesCategory =
                category === "all" ||
                food.category === category;

            const matchesType =
                foodType === "all" ||
                food.foodType === foodType;

            return (
                matchesSearch &&
                matchesCategory &&
                matchesType
            );

        });

    }, [
        foods,
        search,
        category,
        foodType
    ]);


    return (

        <div className="bg-stone-50">

            {/* Header */}

            <section className="
                bg-stone-950
                px-4
                py-12
                sm:px-6
                lg:px-8
            ">

                <div className="mx-auto max-w-7xl">

                    <p className="
                        text-sm
                        font-bold
                        uppercase
                        tracking-wider
                        text-red-500
                    ">
                        Arora Da Dhabha
                    </p>

                    <h1 className="
                        mt-2
                        text-4xl
                        font-black
                        text-white
                    ">
                        Our Menu
                    </h1>

                    <p className="
                        mt-3
                        max-w-xl
                        text-sm
                        leading-6
                        text-stone-400
                    ">
                        Choose from our delicious selection
                        of freshly prepared food.
                    </p>

                </div>

            </section>


            {/* Filters */}

            <section className="
                sticky
                top-16
                z-30
                border-b
                border-stone-200
                bg-white
            ">

                <div className="
                    mx-auto
                    max-w-7xl
                    px-4
                    py-4
                    sm:px-6
                    lg:px-8
                ">

                    <div className="
                        flex
                        flex-col
                        gap-3
                        lg:flex-row
                        lg:items-center
                    ">

                        {/* Search */}

                        <div className="
                            relative
                            w-full
                            lg:max-w-md
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
                                type="text"
                                value={search}
                                onChange={(event) =>
                                    setSearch(
                                        event.target.value
                                    )
                                }
                                placeholder="Search food..."
                                className="
                                    w-full
                                    rounded-xl
                                    border
                                    border-stone-200
                                    py-3
                                    pl-10
                                    pr-10
                                    text-sm
                                    outline-none
                                    focus:border-red-500
                                    focus:ring-2
                                    focus:ring-red-100
                                "
                            />

                            {search && (

                                <button
                                    onClick={() =>
                                        setSearch("")
                                    }
                                    className="
                                        absolute
                                        right-3
                                        top-1/2
                                        -translate-y-1/2
                                        text-stone-400
                                    "
                                >
                                    <X size={17} />
                                </button>

                            )}

                        </div>


                        {/* Category */}

                        <div className="
                            flex
                            items-center
                            gap-2
                            overflow-x-auto
                            pb-1
                        ">

                            <SlidersHorizontal
                                size={17}
                                className="
                                    shrink-0
                                    text-stone-400
                                "
                            />

                            <button
                                onClick={() =>
                                    setCategory("all")
                                }
                                className={`
                                    whitespace-nowrap
                                    rounded-full
                                    px-4
                                    py-2
                                    text-xs
                                    font-bold
                                    ${
                                        category === "all"
                                            ? "bg-red-600 text-white"
                                            : "bg-stone-100 text-stone-600"
                                    }
                                `}
                            >
                                All
                            </button>

                            {categories.map((item) => (

                                <button
                                    key={item}
                                    onClick={() =>
                                        setCategory(item)
                                    }
                                    className={`
                                        whitespace-nowrap
                                        rounded-full
                                        px-4
                                        py-2
                                        text-xs
                                        font-bold
                                        ${
                                            category === item
                                                ? "bg-red-600 text-white"
                                                : "bg-stone-100 text-stone-600"
                                        }
                                    `}
                                >
                                    {item}
                                </button>

                            ))}

                        </div>

                    </div>


                    {/* Food Type */}

                    <div className="
                        mt-3
                        flex
                        items-center
                        gap-2
                    ">

                        <span className="
                            text-xs
                            font-semibold
                            text-stone-500
                        ">
                            Type:
                        </span>

                        {[
                            ["all", "All"],
                            ["veg", "Veg"],
                            ["non-veg", "Non-Veg"],
                            ["egg", "Egg"]
                        ].map(([value, label]) => (

                            <button
                                key={value}
                                onClick={() =>
                                    setFoodType(value)
                                }
                                className={`
                                    rounded-lg
                                    px-3
                                    py-1.5
                                    text-xs
                                    font-semibold
                                    ${
                                        foodType === value
                                            ? "bg-stone-900 text-white"
                                            : "bg-stone-100 text-stone-600"
                                    }
                                `}
                            >
                                {label}
                            </button>

                        ))}

                    </div>

                </div>

            </section>


            {/* Food */}

            <section className="
                mx-auto
                max-w-7xl
                px-4
                py-10
                sm:px-6
                lg:px-8
            ">

                {loading ? (

                    <Loading
                        fullScreen
                        text="Loading menu..."
                    />

                ) : filteredFoods.length === 0 ? (

                    <div className="
                        rounded-2xl
                        border
                        border-dashed
                        border-stone-300
                        bg-white
                        py-20
                        text-center
                    ">

                        <Search
                            size={40}
                            className="
                                mx-auto
                                text-stone-300
                            "
                        />

                        <h2 className="
                            mt-4
                            font-bold
                            text-stone-800
                        ">
                            No food found
                        </h2>

                        <p className="
                            mt-1
                            text-sm
                            text-stone-500
                        ">
                            Try another search or category.
                        </p>

                    </div>

                ) : (

                    <>

                        <div className="
                            mb-6
                            flex
                            items-center
                            justify-between
                        ">

                            <p className="
                                text-sm
                                text-stone-500
                            ">
                                Showing{" "}
                                <strong className="text-stone-900">
                                    {filteredFoods.length}
                                </strong>{" "}
                                items
                            </p>

                        </div>


                        <div className="
                            grid
                            gap-5
                            sm:grid-cols-2
                            lg:grid-cols-3
                            xl:grid-cols-4
                        ">

                            {filteredFoods.map((food) => (

                                <FoodCard
                                    key={food._id}
                                    food={food}
                                />

                            ))}

                        </div>

                    </>

                )}

            </section>

        </div>
    );
}

export default Menu;