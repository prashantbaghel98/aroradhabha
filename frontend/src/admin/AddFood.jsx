import { useState } from "react";
import {
    ArrowLeft,
    ImagePlus,
    Save,
    X
} from "lucide-react";

import {
    Link,
    useNavigate
} from "react-router-dom";

import { addFood } from "../services/foodService";


function AddFood() {

    const navigate = useNavigate();


    // ==========================================
    // CATEGORIES
    // ==========================================

    const categories = [
        "Noodle",
        "Staters",
        "Momos",
        "Burgers",
        "Rice",
        "Tandoori Zaika,",
        "Roti & Naan",
        "Beverages",
        "Desserts"
    ];


    // ==========================================
    // STATES
    // ==========================================

    const [images, setImages] =
        useState([]);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");


    const [form, setForm] = useState({
        category: "",
        name: "",
        description: "",
        price: "",
        discountPrice: "",
        foodType: "veg",
        isAvailable: true,
        isFeatured: false,
        preparationTime: ""
    });


    // ==========================================
    // HANDLE FORM CHANGE
    // ==========================================

    const handleChange = (event) => {

        const {
            name,
            value,
            type,
            checked
        } = event.target;


        setForm((previous) => ({
            ...previous,

            [name]:
                type === "checkbox"
                    ? checked
                    : value
        }));

    };


    // ==========================================
    // HANDLE IMAGE SELECTION
    // ==========================================

    const handleImages = (event) => {

        const selected =
            Array.from(
                event.target.files || []
            ).slice(0, 5);


        setImages(selected);

    };


    // ==========================================
    // REMOVE IMAGE
    // ==========================================

    const removeImage = (index) => {

        setImages((previous) =>
            previous.filter(
                (_, itemIndex) =>
                    itemIndex !== index
            )
        );

    };


    // ==========================================
    // SUBMIT FORM
    // ==========================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");


        // --------------------------------------
        // VALIDATION
        // --------------------------------------

        if (!form.name.trim()) {

            setError(
                "Food name is required."
            );

            return;

        }


        if (!form.category) {

            setError(
                "Please select a category."
            );

            return;

        }


        if (!form.description.trim()) {

            setError(
                "Food description is required."
            );

            return;

        }


        if (!form.price) {

            setError(
                "Food price is required."
            );

            return;

        }


        if (
            form.discountPrice &&
            Number(form.discountPrice) > Number(form.price)
        ) {

            setError(
                "Discount price cannot be greater than the original price."
            );

            return;

        }


        if (!form.preparationTime) {

            setError(
                "Preparation time is required."
            );

            return;

        }


        try {

            setLoading(true);


            // --------------------------------------
            // CREATE FORMDATA
            // --------------------------------------

            const formData =
                new FormData();


            formData.append(
                "category",
                form.category
            );


            formData.append(
                "name",
                form.name.trim()
            );


            formData.append(
                "description",
                form.description.trim()
            );


            formData.append(
                "price",
                form.price
            );


            if (form.discountPrice) {

                formData.append(
                    "discountPrice",
                    form.discountPrice
                );

            }


            formData.append(
                "foodType",
                form.foodType
            );


            formData.append(
                "isAvailable",
                form.isAvailable
            );


            formData.append(
                "isFeatured",
                form.isFeatured
            );


            formData.append(
                "preparationTime",
                form.preparationTime
            );


            // --------------------------------------
            // ADD IMAGES
            // --------------------------------------

            images.forEach((image) => {

                formData.append(
                    "images",
                    image
                );

            });


            // --------------------------------------
            // API CALL
            // --------------------------------------

            // const response =
            //     await addFood(formData);


            // console.log(
            //     "Food Added:",
            //     response
            // );


            // --------------------------------------
            // REDIRECT
            // --------------------------------------

            navigate("/admin/foods");


        } catch (error) {

            console.error(
                "Add Food Error:",
                error
            );


            setError(
                error.response?.data?.message ||
                "Unable to add food."
            );

        } finally {

            setLoading(false);

        }

    };


    return (

        <div>


            {/* ==================================
                BACK BUTTON
            ================================== */}

            <Link
                to="/admin/foods"
                className="
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

                Back to Foods

            </Link>


            {/* ==================================
                HEADER
            ================================== */}

            <div className="mt-5">

                <h1 className="
                    text-3xl
                    font-black
                    text-stone-900
                ">
                    Add Food
                </h1>


                <p className="
                    mt-1
                    text-sm
                    text-stone-500
                ">
                    Add a new item to your restaurant menu.
                </p>

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
                FORM
            ================================== */}

            <form
                onSubmit={handleSubmit}
                className="
                    mt-6
                    grid
                    gap-6
                    lg:grid-cols-[1fr_340px]
                "
            >


                {/* ==================================
                    MAIN CONTENT
                ================================== */}

                <div className="
                    rounded-2xl
                    border
                    border-stone-200
                    bg-white
                    p-5
                    sm:p-6
                ">


                    <div className="
                        grid
                        gap-5
                        sm:grid-cols-2
                    ">


                        {/* ==================================
                            FOOD NAME
                        ================================== */}

                        <div className="sm:col-span-2">

                            <label className="
                                mb-2
                                block
                                text-sm
                                font-bold
                                text-stone-800
                            ">
                                Food Name
                            </label>


                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Veg Steamed Momos"
                                required
                                className="
                                    w-full
                                    rounded-xl
                                    border
                                    border-stone-200
                                    px-4
                                    py-3
                                    text-sm
                                    outline-none
                                    focus:border-red-500
                                    focus:ring-2
                                    focus:ring-red-100
                                "
                            />

                        </div>


                        {/* ==================================
                            CATEGORY
                        ================================== */}

                        <div>

                            <label className="
                                mb-2
                                block
                                text-sm
                                font-bold
                                text-stone-800
                            ">
                                Category
                            </label>


                            <select
                                name="category"
                                value={form.category}
                                onChange={handleChange}
                                required
                                className="
                                    w-full
                                    rounded-xl
                                    border
                                    border-stone-200
                                    bg-white
                                    px-4
                                    py-3
                                    text-sm
                                    outline-none
                                    focus:border-red-500
                                    focus:ring-2
                                    focus:ring-red-100
                                "
                            >

                                <option value="">
                                    Select Category
                                </option>


                                {categories.map(
                                    (category) => (

                                        <option
                                            key={category}
                                            value={category}
                                        >
                                            {category}
                                        </option>

                                    )
                                )}

                            </select>

                        </div>


                        {/* ==================================
                            FOOD TYPE
                        ================================== */}

                        <div>

                            <label className="
                                mb-2
                                block
                                text-sm
                                font-bold
                                text-stone-800
                            ">
                                Food Type
                            </label>


                            <select
                                name="foodType"
                                value={form.foodType}
                                onChange={handleChange}
                                className="
                                    w-full
                                    rounded-xl
                                    border
                                    border-stone-200
                                    bg-white
                                    px-4
                                    py-3
                                    text-sm
                                    outline-none
                                    focus:border-red-500
                                    focus:ring-2
                                    focus:ring-red-100
                                "
                            >

                                <option value="veg">
                                    Veg
                                </option>


                                <option value="non-veg">
                                    Non-Veg
                                </option>


                                <option value="egg">
                                    Egg
                                </option>

                            </select>

                        </div>


                        {/* ==================================
                            PRICE
                        ================================== */}

                        <div>

                            <label className="
                                mb-2
                                block
                                text-sm
                                font-bold
                                text-stone-800
                            ">
                                Price
                            </label>


                            <input
                                type="number"
                                name="price"
                                value={form.price}
                                onChange={handleChange}
                                min="0"
                                required
                                placeholder="120"
                                className="
                                    w-full
                                    rounded-xl
                                    border
                                    border-stone-200
                                    px-4
                                    py-3
                                    text-sm
                                    outline-none
                                    focus:border-red-500
                                    focus:ring-2
                                    focus:ring-red-100
                                "
                            />

                        </div>


                        {/* ==================================
                            DISCOUNT PRICE
                        ================================== */}

                        <div>

                            <label className="
                                mb-2
                                block
                                text-sm
                                font-bold
                                text-stone-800
                            ">
                                Discount Price
                            </label>


                            <input
                                type="number"
                                name="discountPrice"
                                value={form.discountPrice}
                                onChange={handleChange}
                                min="0"
                                placeholder="99"
                                className="
                                    w-full
                                    rounded-xl
                                    border
                                    border-stone-200
                                    px-4
                                    py-3
                                    text-sm
                                    outline-none
                                    focus:border-red-500
                                    focus:ring-2
                                    focus:ring-red-100
                                "
                            />


                            <p className="
                                mt-1
                                text-xs
                                text-stone-400
                            ">
                                Optional
                            </p>

                        </div>


                        {/* ==================================
                            PREPARATION TIME
                        ================================== */}

                        <div>

                            <label className="
                                mb-2
                                block
                                text-sm
                                font-bold
                                text-stone-800
                            ">
                                Preparation Time
                            </label>


                            <input
                                type="number"
                                name="preparationTime"
                                value={
                                    form.preparationTime
                                }
                                onChange={handleChange}
                                min="1"
                                required
                                placeholder="15"
                                className="
                                    w-full
                                    rounded-xl
                                    border
                                    border-stone-200
                                    px-4
                                    py-3
                                    text-sm
                                    outline-none
                                    focus:border-red-500
                                    focus:ring-2
                                    focus:ring-red-100
                                "
                            />


                            <p className="
                                mt-1
                                text-xs
                                text-stone-400
                            ">
                                Time in minutes
                            </p>

                        </div>


                        {/* ==================================
                            DESCRIPTION
                        ================================== */}

                        <div className="sm:col-span-2">

                            <label className="
                                mb-2
                                block
                                text-sm
                                font-bold
                                text-stone-800
                            ">
                                Description
                            </label>


                            <textarea
                                name="description"
                                value={
                                    form.description
                                }
                                onChange={handleChange}
                                rows={5}
                                required
                                placeholder="Fresh steamed vegetable momos..."
                                className="
                                    w-full
                                    resize-none
                                    rounded-xl
                                    border
                                    border-stone-200
                                    px-4
                                    py-3
                                    text-sm
                                    outline-none
                                    focus:border-red-500
                                    focus:ring-2
                                    focus:ring-red-100
                                "
                            />

                        </div>

                    </div>

                </div>


                {/* ==================================
                    SIDEBAR
                ================================== */}

                <div className="space-y-5">


                    {/* ==================================
                        FOOD IMAGES
                    ================================== */}

                    <div className="
                        rounded-2xl
                        border
                        border-stone-200
                        bg-white
                        p-5
                    ">

                        <h2 className="
                            font-black
                            text-stone-900
                        ">
                            Food Images
                        </h2>


                        <p className="
                            mt-1
                            text-xs
                            text-stone-500
                        ">
                            Upload up to 5 images.
                        </p>


                        {/* IMAGE UPLOAD */}

                        <label className="
                            mt-4
                            flex
                            cursor-pointer
                            flex-col
                            items-center
                            justify-center
                            rounded-xl
                            border-2
                            border-dashed
                            border-stone-200
                            p-7
                            text-center
                            transition
                            hover:border-red-300
                            hover:bg-red-50/30
                        ">

                            <ImagePlus
                                size={28}
                                className="
                                    text-stone-400
                                "
                            />


                            <p className="
                                mt-2
                                text-sm
                                font-semibold
                                text-stone-700
                            ">
                                Choose Images
                            </p>


                            <p className="
                                mt-1
                                text-xs
                                text-stone-400
                            ">
                                JPG, PNG, WEBP
                            </p>


                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImages}
                                className="hidden"
                            />

                        </label>


                        {/* IMAGE PREVIEW */}

                        {images.length > 0 && (

                            <div className="
                                mt-4
                                grid
                                grid-cols-3
                                gap-2
                            ">

                                {images.map(
                                    (image, index) => (

                                        <div
                                            key={index}
                                            className="
                                                relative
                                                overflow-hidden
                                                rounded-lg
                                                border
                                                border-stone-200
                                            "
                                        >

                                            <img
                                                src={
                                                    URL.createObjectURL(
                                                        image
                                                    )
                                                }
                                                alt={
                                                    `Food ${index + 1}`
                                                }
                                                className="
                                                    h-20
                                                    w-full
                                                    object-cover
                                                "
                                            />


                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeImage(
                                                        index
                                                    )
                                                }
                                                className="
                                                    absolute
                                                    right-1
                                                    top-1
                                                    rounded-full
                                                    bg-black/60
                                                    p-1
                                                    text-white
                                                    hover:bg-red-600
                                                "
                                            >

                                                <X
                                                    size={12}
                                                />

                                            </button>

                                        </div>

                                    )
                                )}

                            </div>

                        )}

                    </div>


                    {/* ==================================
                        SETTINGS
                    ================================== */}

                    <div className="
                        rounded-2xl
                        border
                        border-stone-200
                        bg-white
                        p-5
                    ">

                        <h2 className="
                            font-black
                            text-stone-900
                        ">
                            Settings
                        </h2>


                        {/* AVAILABLE */}

                        <label className="
                            mt-4
                            flex
                            cursor-pointer
                            items-center
                            gap-3
                            text-sm
                            font-semibold
                            text-stone-700
                        ">

                            <input
                                type="checkbox"
                                name="isAvailable"
                                checked={
                                    form.isAvailable
                                }
                                onChange={handleChange}
                                className="
                                    h-4
                                    w-4
                                    accent-red-600
                                "
                            />


                            Available for ordering

                        </label>


                        {/* FEATURED */}

                        <label className="
                            mt-4
                            flex
                            cursor-pointer
                            items-center
                            gap-3
                            text-sm 
                            font-semibold
                            text-stone-700
                        ">

                            <input
                                type="checkbox"
                                name="isFeatured"
                                checked={
                                    form.isFeatured
                                }
                                onChange={handleChange}
                                className="
                                    h-4
                                    w-4
                                    accent-red-600
                                "
                            />


                            Featured food

                        </label>


                        {/* SUBMIT */}

                        <button
                            type="submit"
                            disabled={loading}
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
                                disabled:opacity-50
                            "
                        >

                            <Save size={17} />


                            {loading
                                ? "Adding Food..."
                                : "Add Food"
                            }

                        </button>

                    </div>

                </div>

            </form>

        </div>

    );
}


export default AddFood;