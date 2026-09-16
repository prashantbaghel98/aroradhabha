import { useEffect, useState } from "react";

import {
    ArrowLeft,
    ImagePlus,
    Save,
    X
} from "lucide-react";

import {
    Link,
    useNavigate,
    useParams
} from "react-router-dom";

import {
    getFoodById,
    updateFood
} from "../services/foodService";

import Loading from "../components/Loading";


function EditFood() {

    const { id } = useParams();

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

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");


    // Existing Cloudinary images

    const [existingImages, setExistingImages] =
        useState([]);


    // Newly selected images

    const [newImages, setNewImages] =
        useState([]);


    // ==========================================
    // FORM STATE
    // ==========================================

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
    // LOAD FOOD
    // ==========================================

    useEffect(() => {

        const loadFood = async () => {

            try {

                setLoading(true);

                setError("");


                const response =
                    await getFoodById(id);


                const food =
                    response?.food;


                if (!food) {

                    setError(
                        "Food not found."
                    );

                    return;

                }


                // ==================================
                // SET FORM DATA
                // ==================================

                setForm({

                    category:
                        food.category || "",

                    name:
                        food.name || "",

                    description:
                        food.description || "",

                    price:
                        food.price ?? "",

                    discountPrice:
                        food.discountPrice ?? "",

                    foodType:
                        food.foodType || "veg",

                    isAvailable:
                        food.isAvailable ?? true,

                    isFeatured:
                        food.isFeatured ?? false,

                    preparationTime:
                        food.preparationTime ?? ""

                });


                // ==================================
                // SET EXISTING IMAGES
                // ==================================

                setExistingImages(
                    Array.isArray(food.images)
                        ? food.images
                        : []
                );


            } catch (error) {

                console.error(
                    "Edit food error:",
                    error
                );


                setError(
                    error.response?.data?.message ||
                    "Unable to load food."
                );

            } finally {

                setLoading(false);

            }

        };


        if (id) {

            loadFood();

        }

    }, [id]);


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
    // HANDLE IMAGE UPLOAD
    // ==========================================

    const handleImages = (event) => {

        const selected =
            Array.from(
                event.target.files || []
            );


        if (!selected.length) {

            return;

        }


        setError("");


        const currentImageCount =
            existingImages.length +
            newImages.length;


        const remainingSlots =
            5 - currentImageCount;


        if (remainingSlots <= 0) {

            setError(
                "You can upload a maximum of 5 images."
            );

            return;

        }


        const imagesToAdd =
            selected.slice(
                0,
                remainingSlots
            );


        setNewImages((previous) => [

            ...previous,

            ...imagesToAdd

        ]);


        // Allow selecting the same file again

        event.target.value = "";

    };


    // ==========================================
    // REMOVE EXISTING IMAGE
    // ==========================================

    const removeExistingImage = (index) => {

        setExistingImages(
            (previous) =>

                previous.filter(
                    (_, itemIndex) =>
                        itemIndex !== index
                )
        );

    };


    // ==========================================
    // REMOVE NEW IMAGE
    // ==========================================

    const removeNewImage = (index) => {

        setNewImages(
            (previous) =>

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


        // ======================================
        // VALIDATION
        // ======================================

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
            Number(form.discountPrice) >
            Number(form.price)
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


        // ======================================
        // IMAGE VALIDATION
        // ======================================

        const totalImages =
            existingImages.length +
            newImages.length;


        if (totalImages > 5) {

            setError(
                "You can have a maximum of 5 images."
            );

            return;

        }


        try {

            setSaving(true);


            // ======================================
            // CREATE FORMDATA
            // ======================================

            const formData =
                new FormData();


            // ======================================
            // FOOD DETAILS
            // ======================================

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


            formData.append(
                "discountPrice",
                form.discountPrice || ""
            );


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


            // ======================================
            // EXISTING IMAGES
            // ======================================
            //
            // These are Cloudinary URLs that should
            // remain attached to the food.
            //

            existingImages.forEach(
                (image) => {

                    formData.append(
                        "existingImages",
                        image
                    );

                }
            );


            // ======================================
            // NEW IMAGES
            // ======================================

            newImages.forEach(
                (image) => {

                    formData.append(
                        "images",
                        image
                    );

                }
            );


            // ======================================
            // UPDATE FOOD
            // ======================================

            const response =
                await updateFood(
                    id,
                    formData
                );


            // console.log(
            //     "Food updated successfully:",
            //     response
            // );


            // ======================================
            // REDIRECT
            // ======================================

            navigate(
                "/admin/foods"
            );


        } catch (error) {

            console.error(
                "Update food error:",
                error
            );


            setError(
                error.response?.data?.message ||
                "Unable to update food."
            );

        } finally {

            setSaving(false);

        }

    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <Loading
                fullScreen
                text="Loading food..."
            />

        );

    }


    // ==========================================
    // UI
    // ==========================================

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
                    Edit Food
                </h1>


                <p className="
                    mt-1
                    text-sm
                    text-stone-500
                ">
                    Update your restaurant food item.
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
                    sm:p-7
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
                                value={
                                    form.discountPrice
                                }
                                onChange={handleChange}
                                min="0"
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
                                "
                            />

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
                                "
                            />

                        </div>

                    </div>


                    {/* ==================================
                        SETTINGS
                    ================================== */}

                    <div className="
                        mt-6
                        flex
                        flex-col
                        gap-4
                        sm:flex-row
                    ">


                        {/* AVAILABLE */}

                        <label className="
                            flex
                            cursor-pointer
                            items-center
                            gap-2
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

                            Available

                        </label>


                        {/* FEATURED */}

                        <label className="
                            flex
                            cursor-pointer
                            items-center
                            gap-2
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

                            Featured

                        </label>

                    </div>

                </div>


                {/* ==================================
                    SIDEBAR
                ================================== */}

                <div className="space-y-5">


                    {/* ==================================
                        IMAGE SECTION
                    ================================== */}

                    <div className="
                        rounded-2xl
                        border
                        border-stone-200
                        bg-white
                        p-5
                    ">


                        {/* HEADER */}

                        <div className="
                            flex
                            items-center
                            justify-between
                        ">

                            <div>

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

                            </div>


                            {/* IMAGE COUNT */}

                            <div className="
                                rounded-lg
                                bg-stone-100
                                px-2.5
                                py-1
                                text-xs
                                font-bold
                                text-stone-600
                            ">

                                {
                                    existingImages.length +
                                    newImages.length
                                }
                                /5

                            </div>

                        </div>


                        {/* ==================================
                            CURRENT IMAGES
                        ================================== */}

                        {existingImages.length > 0 && (

                            <div className="mt-5">

                                <p className="
                                    mb-3
                                    text-xs
                                    font-bold
                                    text-stone-700
                                ">
                                    Current Images
                                </p>


                                <div className="
                                    grid
                                    grid-cols-2
                                    gap-3
                                ">

                                    {existingImages.map(
                                        (image, index) => (

                                            <div
                                                key={`${image}-${index}`}
                                                className="
                                                    relative
                                                    overflow-hidden
                                                    rounded-xl
                                                    border
                                                    border-stone-200
                                                "
                                            >

                                                <img
                                                    src={image}
                                                    alt={
                                                        `Food ${index + 1}`
                                                    }
                                                    className="
                                                        h-28
                                                        w-full
                                                        object-cover
                                                    "
                                                />


                                                {/* REMOVE EXISTING */}

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeExistingImage(
                                                            index
                                                        )
                                                    }
                                                    className="
                                                        absolute
                                                        right-2
                                                        top-2
                                                        flex
                                                        h-7
                                                        w-7
                                                        items-center
                                                        justify-center
                                                        rounded-full
                                                        bg-black/70
                                                        text-white
                                                        transition
                                                        hover:bg-red-600
                                                    "
                                                >

                                                    <X size={14} />

                                                </button>

                                            </div>

                                        )
                                    )}

                                </div>

                            </div>

                        )}


                        {/* ==================================
                            UPLOAD NEW IMAGES
                        ================================== */}

                        {(
                            existingImages.length +
                            newImages.length
                        ) < 5 && (

                            <label className="
                                mt-5
                                flex
                                cursor-pointer
                                flex-col
                                items-center
                                justify-center
                                rounded-xl
                                border-2
                                border-dashed
                                border-stone-300
                                bg-stone-50
                                p-8
                                text-center
                                transition
                                hover:border-red-400
                                hover:bg-red-50
                            ">

                                <div className="
                                    flex
                                    h-12
                                    w-12
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-white
                                    text-red-600
                                    shadow-sm
                                ">

                                    <ImagePlus
                                        size={25}
                                    />

                                </div>


                                <p className="
                                    mt-3
                                    text-sm
                                    font-bold
                                    text-stone-800
                                ">
                                    Click to upload images
                                </p>


                                <p className="
                                    mt-1
                                    text-xs
                                    text-stone-500
                                ">
                                    JPG, PNG or WEBP
                                </p>


                                <p className="
                                    mt-1
                                    text-xs
                                    text-stone-400
                                ">
                                    {
                                        5 -
                                        (
                                            existingImages.length +
                                            newImages.length
                                        )
                                    }
                                    {" "}
                                    image slot
                                    {
                                        (
                                            5 -
                                            (
                                                existingImages.length +
                                                newImages.length
                                            )
                                        ) !== 1
                                            ? "s"
                                            : ""
                                    }
                                    {" "}remaining
                                </p>


                                <input
                                    type="file"
                                    accept="
                                        image/jpeg,
                                        image/png,
                                        image/webp
                                    "
                                    multiple
                                    onChange={
                                        handleImages
                                    }
                                    className="hidden"
                                />

                            </label>

                        )}


                        {/* ==================================
                            NEW IMAGES
                        ================================== */}

                        {newImages.length > 0 && (

                            <div className="mt-5">

                                <p className="
                                    mb-3
                                    text-xs
                                    font-bold
                                    text-stone-700
                                ">
                                    New Images
                                </p>


                                <div className="
                                    grid
                                    grid-cols-2
                                    gap-3
                                ">

                                    {newImages.map(
                                        (image, index) => (

                                            <div
                                                key={`${image.name}-${index}`}
                                                className="
                                                    relative
                                                    overflow-hidden
                                                    rounded-xl
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
                                                        `New food ${index + 1}`
                                                    }
                                                    className="
                                                        h-28
                                                        w-full
                                                        object-cover
                                                    "
                                                />


                                                {/* REMOVE NEW IMAGE */}

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeNewImage(
                                                            index
                                                        )
                                                    }
                                                    className="
                                                        absolute
                                                        right-2
                                                        top-2
                                                        flex
                                                        h-7
                                                        w-7
                                                        items-center
                                                        justify-center
                                                        rounded-full
                                                        bg-black/70
                                                        text-white
                                                        transition
                                                        hover:bg-red-600
                                                    "
                                                >

                                                    <X size={14} />

                                                </button>

                                            </div>

                                        )
                                    )}

                                </div>

                            </div>

                        )}


                        {/* ==================================
                            NO IMAGES
                        ================================== */}

                        {existingImages.length === 0 &&
                            newImages.length === 0 && (

                                <div className="
                                    mt-4
                                    rounded-xl
                                    bg-stone-50
                                    px-4
                                    py-3
                                    text-center
                                    text-xs
                                    text-stone-500
                                ">
                                    No food images uploaded yet.
                                </div>

                            )}

                    </div>


                    {/* ==================================
                        UPDATE BUTTON
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
                            Update Food
                        </h2>


                        <p className="
                            mt-1
                            text-xs
                            text-stone-500
                        ">
                            Save changes to this food item.
                        </p>


                        <button
                            type="submit"
                            disabled={saving}
                            className="
                                mt-5
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

                            {saving
                                ? "Updating..."
                                : "Update Food"
                            }

                        </button>

                    </div>

                </div>

            </form>

        </div>

    );

}


export default EditFood;