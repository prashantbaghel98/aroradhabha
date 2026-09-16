import { useEffect, useState } from "react";

import {
    Edit3,
    Plus,
    Search,
    Trash2
} from "lucide-react";

import { Link } from "react-router-dom";

import {
    deleteFood,
    getFoods
} from "../services/foodService";

import Loading from "../components/Loading";

function Foods() {
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [deletingId, setDeletingId] = useState(null);

    /* ================= LOAD FOODS ================= */

const loadFoods = async () => {
    try {
        setLoading(true);

        const response = await getFoods();

        

        const foodList =
            response?.foods || [];

        

        setFoods(foodList);

    } catch (error) {
        console.error(
            "Foods error:",
            error.response?.data || error.message
        );

        setFoods([]);

    } finally {
        setLoading(false);
    }
};

    /* ================= INITIAL LOAD ================= */

    useEffect(() => {
        loadFoods();
    }, []);

    /* ================= DELETE FOOD ================= */

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this food?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeletingId(id);

            const response = await deleteFood(id);

            if (response?.success) {
                await loadFoods();
            } else {
                alert(
                    response?.message ||
                    "Unable to delete food."
                );
            }

        } catch (error) {
            console.error(
                "Delete food error:",
                error.response?.data || error.message
            );

            alert(
                error.response?.data?.message ||
                "Unable to delete food."
            );

        } finally {
            setDeletingId(null);
        }
    };

    /* ================= SEARCH ================= */

    const searchText = search.trim().toLowerCase();

    const filteredFoods = foods.filter((food) => {
        const name =
            food.name?.toLowerCase() || "";

        const category =
            food.category?.toLowerCase() || "";

        return (
            name.includes(searchText) ||
            category.includes(searchText)
        );
    });

    /* ================= LOADING ================= */

    if (loading) {
        return (
            <Loading
                fullScreen
                text="Loading foods..."
            />
        );
    }

    /* ================= UI ================= */

    return (
        <div>

            {/* ================= HEADER ================= */}

            <div
                className="
                    flex
                    flex-col
                    gap-4
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                "
            >

                <div>

                    <p
                        className="
                            text-sm
                            font-semibold
                            text-red-600
                        "
                    >
                        Food Management
                    </p>

                    <h1
                        className="
                            mt-1
                            text-3xl
                            font-black
                            text-stone-900
                        "
                    >
                        Foods
                    </h1>

                    <p
                        className="
                            mt-1
                            text-sm
                            text-stone-500
                        "
                    >
                        Manage your restaurant food items.
                    </p>

                </div>


                <Link
                    to="/admin/foods/add"
                    className="
                        inline-flex
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
                    "
                >
                    <Plus size={18} />
                    Add Food
                </Link>

            </div>


            {/* ================= SEARCH ================= */}

            <div
                className="
                    relative
                    mt-6
                    max-w-md
                "
            >

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
                        setSearch(event.target.value)
                    }
                    placeholder="Search food or category..."
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
                        text-stone-900
                        outline-none
                        transition
                        focus:border-red-500
                        focus:ring-2
                        focus:ring-red-100
                    "
                />

            </div>


            {/* ================= FOOD COUNT ================= */}

            <div
                className="
                    mt-5
                    text-sm
                    text-stone-500
                "
            >
                Showing{" "}
                <span className="font-bold text-stone-900">
                    {filteredFoods.length}
                </span>{" "}
                of{" "}
                <span className="font-bold text-stone-900">
                    {foods.length}
                </span>{" "}
                foods
            </div>


            {/* ================= FOOD GRID ================= */}

            <div
                className="
                    mt-4
                    grid
                    gap-5
                    sm:grid-cols-2
                    lg:grid-cols-3
                    xl:grid-cols-4
                "
            >

                {filteredFoods.map((food) => {

                    const image =
                        food.images?.[0] ||
                        "https://placehold.co/500x400?text=Food";

                    const price =
                        Number(food.discountPrice) > 0
                            ? food.discountPrice
                            : food.price;

                    const hasDiscount =
                        Number(food.discountPrice) > 0 &&
                        Number(food.discountPrice) <
                        Number(food.price);

                    const isDeleting =
                        deletingId === food._id;

                    return (
                        <div
                            key={food._id}
                            className="
                                overflow-hidden
                                rounded-2xl
                                border
                                border-stone-200
                                bg-white
                                shadow-sm
                                transition
                                hover:-translate-y-0.5
                                hover:shadow-md
                            "
                        >

                            {/* ================= IMAGE ================= */}

                            <div className="relative">

                                <img
                                    src={image}
                                    alt={food.name || "Food"}
                                    className="
                                        h-48
                                        w-full
                                        object-cover
                                    "
                                    onError={(event) => {
                                        event.currentTarget.src =
                                            "https://placehold.co/500x400?text=Food";
                                    }}
                                />

                                {/* Availability */}

                                <span
                                    className={`
                                        absolute
                                        left-3
                                        top-3
                                        rounded-full
                                        px-2.5
                                        py-1
                                        text-[10px]
                                        font-bold
                                        ${
                                            food.isAvailable
                                                ? "bg-green-500 text-white"
                                                : "bg-red-500 text-white"
                                        }
                                    `}
                                >
                                    {food.isAvailable
                                        ? "Available"
                                        : "Unavailable"}
                                </span>

                                {/* Featured */}

                                {food.isFeatured && (
                                    <span
                                        className="
                                            absolute
                                            right-3
                                            top-3
                                            rounded-full
                                            bg-white
                                            px-2.5
                                            py-1
                                            text-[10px]
                                            font-bold
                                            text-stone-700
                                            shadow-sm
                                        "
                                    >
                                        Featured
                                    </span>
                                )}

                            </div>


                            {/* ================= CONTENT ================= */}

                            <div className="p-4">

                                <div
                                    className="
                                        flex
                                        items-start
                                        justify-between
                                        gap-3
                                    "
                                >

                                    <div className="min-w-0">

                                        <h2
                                            className="
                                                line-clamp-1
                                                font-black
                                                text-stone-900
                                            "
                                        >
                                            {food.name}
                                        </h2>

                                        <p
                                            className="
                                                mt-1
                                                text-xs
                                                text-stone-500
                                            "
                                        >
                                            {food.category}
                                        </p>

                                    </div>


                                    {/* PRICE */}

                                    <div
                                        className="
                                            shrink-0
                                            text-right
                                        "
                                    >

                                        <span
                                            className="
                                                font-black
                                                text-stone-900
                                            "
                                        >
                                            ₹
                                            {Number(
                                                price || 0
                                            ).toLocaleString(
                                                "en-IN"
                                            )}
                                        </span>

                                        {hasDiscount && (
                                            <span
                                                className="
                                                    ml-1
                                                    text-xs
                                                    text-stone-400
                                                    line-through
                                                "
                                            >
                                                ₹
                                                {Number(
                                                    food.price
                                                ).toLocaleString(
                                                    "en-IN"
                                                )}
                                            </span>
                                        )}

                                    </div>

                                </div>


                                {/* FOOD INFO */}

                                <div
                                    className="
                                        mt-4
                                        flex
                                        items-center
                                        justify-between
                                        text-xs
                                        text-stone-500
                                    "
                                >

                                    <span className="capitalize">
                                        {food.foodType || "N/A"}
                                    </span>

                                    <span>
                                        {food.preparationTime
                                            ? `${food.preparationTime} min`
                                            : "N/A"}
                                    </span>

                                </div>


                                {/* ================= ACTIONS ================= */}

                                <div
                                    className="
                                        mt-4
                                        flex
                                        gap-2
                                    "
                                >

                                    <Link
                                        to={`/admin/foods/edit/${food._id}`}
                                        className="
                                            flex
                                            flex-1
                                            items-center
                                            justify-center
                                            gap-2
                                            rounded-xl
                                            bg-stone-100
                                            py-2.5
                                            text-xs
                                            font-bold
                                            text-stone-700
                                            transition
                                            hover:bg-stone-200
                                        "
                                    >
                                        <Edit3 size={15} />
                                        Edit
                                    </Link>


                                    <button
                                        type="button"
                                        disabled={isDeleting}
                                        onClick={() =>
                                            handleDelete(
                                                food._id
                                            )
                                        }
                                        className="
                                            flex
                                            h-10
                                            w-10
                                            shrink-0
                                            items-center
                                            justify-center
                                            rounded-xl
                                            bg-red-50
                                            text-red-600
                                            transition
                                            hover:bg-red-100
                                            disabled:cursor-not-allowed
                                            disabled:opacity-50
                                        "
                                    >
                                        {isDeleting ? (
                                            <span
                                                className="
                                                    h-4
                                                    w-4
                                                    animate-spin
                                                    rounded-full
                                                    border-2
                                                    border-red-600
                                                    border-t-transparent
                                                "
                                            />
                                        ) : (
                                            <Trash2 size={16} />
                                        )}
                                    </button>

                                </div>

                            </div>

                        </div>
                    );
                })}

            </div>


            {/* ================= EMPTY STATE ================= */}

            {filteredFoods.length === 0 && (
                <div
                    className="
                        mt-6
                        rounded-2xl
                        border
                        border-dashed
                        border-stone-300
                        bg-white
                        px-5
                        py-16
                        text-center
                    "
                >

                    <div
                        className="
                            mx-auto
                            flex
                            h-12
                            w-12
                            items-center
                            justify-center
                            rounded-full
                            bg-stone-100
                            text-stone-400
                        "
                    >
                        <Search size={20} />
                    </div>

                    <h2
                        className="
                            mt-4
                            font-bold
                            text-stone-900
                        "
                    >
                        No food found
                    </h2>

                    <p
                        className="
                            mt-1
                            text-sm
                            text-stone-500
                        "
                    >
                        {search
                            ? `No food matches "${search}".`
                            : "You have not added any food yet."
                        }
                    </p>

                    {!search && (
                        <Link
                            to="/admin/foods/add"
                            className="
                                mt-5
                                inline-flex
                                items-center
                                gap-2
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
                            <Plus size={17} />
                            Add Food
                        </Link>
                    )}

                </div>
            )}

        </div>
    );
}

export default Foods;