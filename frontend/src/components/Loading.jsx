function Loading({
    fullScreen = false,
    text = "Loading..."
}) {

    if (fullScreen) {

        return (

            <div className="
                flex
                min-h-[60vh]
                items-center
                justify-center
                px-4
            ">

                <div className="
                    flex
                    flex-col
                    items-center
                    gap-4
                ">

                    <div className="
                        h-10
                        w-10
                        animate-spin
                        rounded-full
                        border-4
                        border-stone-200
                        border-t-red-600
                    " />

                    <p className="
                        text-sm
                        font-medium
                        text-stone-500
                    ">
                        {text}
                    </p>

                </div>

            </div>

        );
    }


    return (

        <div className="
            flex
            items-center
            justify-center
            py-10
        ">

            <div className="
                flex
                items-center
                gap-3
            ">

                <div className="
                    h-6
                    w-6
                    animate-spin
                    rounded-full
                    border-3
                    border-stone-200
                    border-t-red-600
                " />

                <span className="
                    text-sm
                    font-medium
                    text-stone-500
                ">
                    {text}
                </span>

            </div>

        </div>

    );
}

export default Loading;