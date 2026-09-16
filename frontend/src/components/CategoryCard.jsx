import {
    ArrowRight,
    Utensils
} from "lucide-react";

import { Link } from "react-router-dom";

function CategoryCard({ category }) {

    if (!category) {
        return null;
    }

    /*
    |--------------------------------------------------------------------------
    | Support Different Image Field Names
    |--------------------------------------------------------------------------
    */

    const image =
        category.image ||
        category.images?.[0] ||
        "https://placehold.co/500x350?text=Food";


    /*
    |--------------------------------------------------------------------------
    | Category Name
    |--------------------------------------------------------------------------
    */

    const categoryName =
        category.name ||
        category.category ||
        "Food";


    return (

        <Link
            to={`/menu?category=${encodeURIComponent(categoryName)}`}
            className="
                group
                relative
                block
                overflow-hidden
                rounded-2xl
                bg-stone-200
                shadow-sm
                transition
                duration-300
                hover:-translate-y-1
                hover:shadow-lg
            "
        >

            {/* =============================================================
                IMAGE
            ============================================================== */}

            <img
                src={image}
                alt={categoryName}
                className="
                    h-44
                    w-full
                    object-cover
                    transition
                    duration-500
                    group-hover:scale-105
                "
                loading="lazy"
            />


            {/* =============================================================
                OVERLAY
            ============================================================== */}

            <div className="
                absolute
                inset-0
                bg-gradient-to-t
                from-black/75
                via-black/20
                to-transparent
            " />


            {/* =============================================================
                CONTENT
            ============================================================== */}

            <div className="
                absolute
                inset-x-0
                bottom-0
                p-4
            ">

                <div className="
                    flex
                    items-end
                    justify-between
                    gap-3
                ">

                    <div>

                        <div className="
                            mb-2
                            flex
                            h-8
                            w-8
                            items-center
                            justify-center
                            rounded-lg
                            bg-white/90
                            text-red-600
                        ">
                            <Utensils size={16} />
                        </div>

                        <h3 className="
                            text-lg
                            font-bold
                            text-white
                        ">
                            {categoryName}
                        </h3>

                    </div>


                    <div className="
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-white
                        text-red-600
                        transition
                        duration-300
                        group-hover:bg-red-600
                        group-hover:text-white
                    ">

                        <ArrowRight size={18} />

                    </div>

                </div>

            </div>

        </Link>
    );
}

export default CategoryCard;