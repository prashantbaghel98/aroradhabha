import { useEffect, useState } from "react";
import {
    FolderTree,
    Search
} from "lucide-react";

import Loading from "../components/Loading";
import { getFoodCategories } from "../services/foodService";

function Categories() {

    const [categories, setCategories] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [search, setSearch] = useState("");


    // ==========================================
    // LOAD CATEGORIES
    // ==========================================

    const loadCategories = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await getFoodCategories();

            setCategories(
                response?.categories || []
            );

        } catch (error) {

            console.error(
                "Category error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to load categories."
            );

        } finally {

            setLoading(false);

        }
    };


    // ==========================================
    // LOAD ON PAGE MOUNT
    // ==========================================

    useEffect(() => {

        loadCategories();

    }, []);


    // ==========================================
    // FILTER CATEGORIES
    // ==========================================

    const filteredCategories =
        categories.filter((category) =>
            category
                .toLowerCase()
                .includes(search.toLowerCase())
        );


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (
            <Loading
                fullScreen
                text="Loading categories..."
            />
        );

    }


    return (

        <div>

            {/* ==================================
                PAGE HEADER
            ================================== */}

            <div className="
                flex
                flex-col
                gap-4
                sm:flex-row
                sm:items-center
                sm:justify-between
            ">

                <div>

                    <p className="
                        text-sm
                        font-semibold
                        text-red-600
                    ">
                        Food Management
                    </p>

                    <h1 className="
                        mt-1
                        text-3xl
                        font-black
                        text-stone-900
                    ">
                        Categories
                    </h1>

                    <p className="
                        mt-1
                        text-sm
                        text-stone-500
                    ">
                        Categories available in your food menu
                    </p>

                </div>


                {/* CATEGORY COUNT */}

                <div className="
                    flex
                    w-fit
                    items-center
                    gap-2
                    rounded-xl
                    bg-red-50
                    px-4
                    py-3
                    text-sm
                    font-bold
                    text-red-600
                ">

                    <FolderTree size={18} />

                    {categories.length} Categories

                </div>

            </div>


            {/* ==================================
                ERROR MESSAGE
            ================================== */}

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


            {/* ==================================
                SEARCH
            ================================== */}

            <div className="
                mt-6
                relative
                max-w-md
            ">

                <Search
                    size={18}
                    className="
                        absolute
                        left-4
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
                    placeholder="Search category..."
                    className="
                        w-full
                        rounded-xl
                        border
                        border-stone-200
                        bg-white
                        py-3
                        pl-11
                        pr-4
                        text-sm
                        outline-none
                        transition
                        focus:border-red-500
                        focus:ring-2
                        focus:ring-red-100
                    "
                />

            </div>


            {/* ==================================
                CATEGORY GRID
            ================================== */}

            <div className="
                mt-6
                grid
                gap-4
                sm:grid-cols-2
                lg:grid-cols-3
                xl:grid-cols-4
            ">

                {filteredCategories.map(
                    (category, index) => (

                        <div
                            key={`${category}-${index}`}
                            className="
                                rounded-2xl
                                border
                                border-stone-200
                                bg-white
                                p-5
                                transition
                                hover:-translate-y-1
                                hover:shadow-md
                            "
                        >

                            <div className="
                                flex
                                items-center
                                justify-between
                            ">

                                {/* ICON */}

                                <div className="
                                    flex
                                    h-12
                                    w-12
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-red-50
                                    text-red-600
                                ">

                                    <FolderTree
                                        size={22}
                                    />

                                </div>


                                {/* NUMBER */}

                                <span className="
                                    flex
                                    h-8
                                    min-w-8
                                    items-center
                                    justify-center
                                    rounded-lg
                                    bg-stone-100
                                    px-2
                                    text-xs
                                    font-bold
                                    text-stone-600
                                ">
                                    {index + 1}
                                </span>

                            </div>


                            {/* CATEGORY NAME */}

                            <h2 className="
                                mt-5
                                text-lg
                                font-black
                                text-stone-900
                            ">
                                {category}
                            </h2>


                            <p className="
                                mt-1
                                text-xs
                                text-stone-500
                            ">
                                Food category
                            </p>

                        </div>

                    )
                )}


                {/* ==================================
                    NO SEARCH RESULT
                ================================== */}

                {filteredCategories.length === 0 && (
                    
                    <div className="
                        rounded-2xl
                        border
                        border-dashed
                        border-stone-300
                        bg-white
                        p-10
                        text-center
                        sm:col-span-2
                        lg:col-span-3
                        xl:col-span-4
                    ">

                        <div className="
                            mx-auto
                            flex
                            h-12
                            w-12
                            items-center
                            justify-center
                            rounded-xl
                            bg-stone-100
                            text-stone-400
                        ">

                            <FolderTree
                                size={22}
                            />

                        </div>


                        <h3 className="
                            mt-4
                            font-bold
                            text-stone-800
                        ">
                            No categories found
                        </h3>


                        <p className="
                            mt-1
                            text-sm
                            text-stone-500
                        ">

                            {search
                                ? "Try a different search term."
                                : "Add food items with categories to see them here."
                            }

                        </p>

                    </div>

                )}

            </div>

        </div>

    );

}

export default Categories;