import { useEffect, useState } from "react";
import {
    MessageSquare,
    Star,
    Trash2
} from "lucide-react";

import api from "../services/api";
import Loading from "../components/Loading";

function Reviews() {

    const [reviews, setReviews] =
        useState([]);

    const [loading, setLoading] =
        useState(true);


    const loadReviews = async () => {

        try {

            setLoading(true);

            const response =
                await api.get(
                    "/review/get-all-reviews"
                );

            setReviews(
                response.data.reviews || []
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


    const handleDelete = async (
        id
    ) => {

        const confirmed =
            window.confirm(
                "Delete this review?"
            );

        if (!confirmed) {
            return;
        }

        try {

            await api.delete(
                `/review/admin-delete-review/${id}`
            );

            await loadReviews();

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Unable to delete review."
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

        <div>

            <div>

                <p className="
                    text-sm
                    font-semibold
                    text-red-600
                ">
                    Customer Feedback
                </p>

                <h1 className="
                    mt-1
                    text-3xl
                    font-black
                ">
                    Reviews
                </h1>

            </div>


            <div className="
                mt-6
                grid
                gap-4
                lg:grid-cols-2
            ">

                {reviews.map((review) => (

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

                                <div className="
                                    flex
                                    items-center
                                    gap-2
                                ">

                                    <MessageSquare
                                        size={18}
                                        className="
                                            text-red-600
                                        "
                                    />

                                    <h2 className="
                                        font-black
                                    ">
                                        {review.food?.name ||
                                            "Food"}
                                    </h2>

                                </div>


                                <p className="
                                    mt-1
                                    text-xs
                                    text-stone-500
                                ">
                                    By{" "}
                                    {review.user?.username ||
                                        review.user?.email ||
                                        "Customer"}
                                </p>

                            </div>


                            <button
                                type="button"
                                onClick={() =>
                                    handleDelete(
                                        review._id
                                    )
                                }
                                className="
                                    rounded-lg
                                    p-2
                                    text-stone-400
                                    hover:bg-red-50
                                    hover:text-red-600
                                "
                            >
                                <Trash2 size={17} />
                            </button>

                        </div>


                        {/* Rating */}

                        <div className="
                            mt-4
                            flex
                            gap-1
                        ">

                            {[1, 2, 3, 4, 5].map(
                                (star) => (

                                <Star
                                    key={star}
                                    size={17}
                                    className={
                                        star <= review.rating
                                            ? "fill-amber-400 text-amber-400"
                                            : "text-stone-300"
                                    }
                                />

                            ))}

                        </div>


                        <p className="
                            mt-4
                            text-sm
                            leading-6
                            text-stone-600
                        ">
                            {review.comment ||
                                "No comment."}
                        </p>


                        <div className="
                            mt-4
                            border-t
                            border-stone-100
                            pt-4
                        ">

                            <p className="
                                text-xs
                                text-stone-400
                            ">
                                {review.createdAt &&
                                    new Date(
                                        review.createdAt
                                    ).toLocaleDateString(
                                        "en-IN",
                                        {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric"
                                        }
                                    )}
                            </p>

                        </div>

                    </div>

                ))}

            </div>


            {reviews.length === 0 && (

                <div className="
                    mt-6
                    rounded-2xl
                    border
                    border-dashed
                    border-stone-300
                    bg-white
                    py-16
                    text-center
                ">

                    <MessageSquare
                        size={40}
                        className="
                            mx-auto
                            text-stone-300
                        "
                    />

                    <p className="
                        mt-3
                        text-sm
                        text-stone-500
                    ">
                        No customer reviews yet.
                    </p>

                </div>

            )}

        </div>
    );
}

export default Reviews;