import { useEffect, useState } from "react";
import {
    Edit3,
    MessageSquare,
    Star,
    Trash2
} from "lucide-react";

import {
    deleteReview,
    getMyReviews,
    updateReview
} from "../services/reviewService";

import Loading from "../components/Loading";

function MyReviews() {

    const [reviews, setReviews] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [editing, setEditing] =
        useState(null);

    const [rating, setRating] =
        useState(5);

    const [comment, setComment] =
        useState("");

    const [saving, setSaving] =
        useState(false);


    const loadReviews = async () => {

        try {

            const response =
                await getMyReviews();

            setReviews(
                response?.reviews || []
            );

        } catch (error) {

            console.error(
                "Reviews error:",
                error
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        loadReviews();

    }, []);


    const startEdit = (review) => {

        setEditing(review._id);

        setRating(review.rating);

        setComment(
            review.comment || ""
        );

    };


    const handleUpdate = async (
        event
    ) => {

        event.preventDefault();

        try {

            setSaving(true);

            await updateReview(
                editing,
                {
                    rating,
                    comment
                }
            );

            setEditing(null);

            await loadReviews();

        } catch (error) {

            console.error(
                "Update review error:",
                error
            );

        } finally {

            setSaving(false);

        }

    };


    const handleDelete = async (
        reviewId
    ) => {

        const confirmed =
            window.confirm(
                "Delete this review?"
            );

        if (!confirmed) {
            return;
        }

        try {

            await deleteReview(
                reviewId
            );

            await loadReviews();

        } catch (error) {

            console.error(
                "Delete review error:",
                error
            );

        }

    };


    if (loading) {

        return (
            <Loading
                fullScreen
                text="Loading reviews..."
            />
        );

    }


    return (

        <div className="
            min-h-[70vh]
            bg-stone-50
            py-10
        ">

            <div className="
                mx-auto
                max-w-4xl
                px-4
                sm:px-6
                lg:px-8
            ">

                <div className="mb-8">

                    <p className="
                        text-sm
                        font-bold
                        uppercase
                        tracking-wider
                        text-red-600
                    ">
                        Account
                    </p>

                    <h1 className="
                        mt-1
                        text-3xl
                        font-black
                    ">
                        My Reviews
                    </h1>

                </div>


                {reviews.length === 0 ? (

                    <div className="
                        rounded-2xl
                        border
                        border-stone-200
                        bg-white
                        py-16
                        text-center
                    ">

                        <MessageSquare
                            size={42}
                            className="
                                mx-auto
                                text-stone-300
                            "
                        />

                        <h2 className="
                            mt-4
                            text-xl
                            font-bold
                        ">
                            No reviews yet
                        </h2>

                        <p className="
                            mt-2
                            text-sm
                            text-stone-500
                        ">
                            Your food reviews will appear here.
                        </p>

                    </div>

                ) : (

                    <div className="space-y-4">

                        {reviews.map(
                            (review) => (

                            <div
                                key={review._id}
                                className="
                                    rounded-2xl
                                    border
                                    border-stone-200
                                    bg-white
                                    p-5
                                "
                            >

                                <div className="
                                    flex
                                    items-start
                                    justify-between
                                    gap-4
                                ">

                                    <div>

                                        <h2 className="
                                            font-bold
                                            text-stone-900
                                        ">
                                            {review.food?.name ||
                                                "Food"}
                                        </h2>

                                        <div className="
                                            mt-2
                                            flex
                                            gap-1
                                        ">

                                            {[1, 2, 3, 4, 5].map(
                                                (star) => (

                                                <Star
                                                    key={star}
                                                    size={16}
                                                    className={
                                                        star <=
                                                        review.rating
                                                            ? "fill-amber-400 text-amber-400"
                                                            : "text-stone-300"
                                                    }
                                                />

                                            ))}

                                        </div>

                                    </div>


                                    <div className="
                                        flex
                                        gap-2
                                    ">

                                        <button
                                            type="button"
                                            onClick={() =>
                                                startEdit(
                                                    review
                                                )
                                            }
                                            className="
                                                flex
                                                h-9
                                                w-9
                                                items-center
                                                justify-center
                                                rounded-lg
                                                bg-stone-100
                                                text-stone-600
                                                hover:bg-red-50
                                                hover:text-red-600
                                            "
                                        >
                                            <Edit3 size={16} />
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleDelete(
                                                    review._id
                                                )
                                            }
                                            className="
                                                flex
                                                h-9
                                                w-9
                                                items-center
                                                justify-center
                                                rounded-lg
                                                bg-stone-100
                                                text-stone-600
                                                hover:bg-red-50
                                                hover:text-red-600
                                            "
                                        >
                                            <Trash2 size={16} />
                                        </button>

                                    </div>

                                </div>


                                {editing === review._id ? (

                                    <form
                                        onSubmit={
                                            handleUpdate
                                        }
                                        className="
                                            mt-5
                                            rounded-xl
                                            bg-stone-50
                                            p-4
                                        "
                                    >

                                        <label className="
                                            text-sm
                                            font-bold
                                        ">
                                            Rating
                                        </label>

                                        <div className="
                                            mt-2
                                            flex
                                            gap-1
                                        ">

                                            {[1, 2, 3, 4, 5].map(
                                                (star) => (

                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() =>
                                                        setRating(
                                                            star
                                                        )
                                                    }
                                                >

                                                    <Star
                                                        size={22}
                                                        className={
                                                            star <=
                                                            rating
                                                                ? "fill-amber-400 text-amber-400"
                                                                : "text-stone-300"
                                                        }
                                                    />

                                                </button>

                                            ))}

                                        </div>


                                        <textarea
                                            value={comment}
                                            onChange={(event) =>
                                                setComment(
                                                    event.target.value
                                                )
                                            }
                                            rows={4}
                                            maxLength={1000}
                                            className="
                                                mt-4
                                                w-full
                                                resize-none
                                                rounded-xl
                                                border
                                                border-stone-200
                                                p-3
                                                text-sm
                                                outline-none
                                                focus:border-red-500
                                            "
                                        />


                                        <div className="
                                            mt-3
                                            flex
                                            gap-2
                                        ">

                                            <button
                                                type="submit"
                                                disabled={saving}
                                                className="
                                                    rounded-xl
                                                    bg-red-600
                                                    px-4
                                                    py-2.5
                                                    text-sm
                                                    font-bold
                                                    text-white
                                                    disabled:opacity-50
                                                "
                                            >
                                                {saving
                                                    ? "Saving..."
                                                    : "Save Changes"
                                                }
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setEditing(
                                                        null
                                                    )
                                                }
                                                className="
                                                    rounded-xl
                                                    border
                                                    border-stone-200
                                                    px-4
                                                    py-2.5
                                                    text-sm
                                                    font-bold
                                                "
                                            >
                                                Cancel
                                            </button>

                                        </div>

                                    </form>

                                ) : (

                                    <p className="
                                        mt-4
                                        text-sm
                                        leading-6
                                        text-stone-600
                                    ">
                                        {review.comment ||
                                            "No comment added."}
                                    </p>

                                )}

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </div>
    );
}

export default MyReviews;