import { useEffect, useState } from "react";
import {
    MapPin,
    Plus,
    Trash2,
    User,
    Pencil,
    X,
    Check
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

import {
    addAddress,
    deleteAddress,
    getAddresses,
    updateAddress,
    setDefaultAddress
} from "../services/addressService";

function Profile() {

    const { user } = useAuth();

    const [addresses, setAddresses] = useState([]);

    const [showForm, setShowForm] = useState(false);

    const [editingId, setEditingId] = useState(null);

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    const [deletingId, setDeletingId] = useState(null);

    const [defaultId, setDefaultId] = useState(null);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");

    const getInitialForm = () => ({
        name: user?.username || "",
        phone: "",
        addressLine1: "",
        addressLine2: "",
        landmark: "",
        city: "",
        state: "",
        pincode: "",
        addressType: "home",
        isDefault: false
    });

    const [form, setForm] = useState(getInitialForm);


    // =====================================================
    // LOAD ADDRESSES
    // =====================================================

    const loadAddresses = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await getAddresses();

            // console.log(
            //     "GET ADDRESSES RESPONSE:",
            //     response
            // );

            // Backend returns:
            // {
            //   success: true,
            //   data: [...]
            // }

            const data = response?.data || [];

            setAddresses(data);

        } catch (error) {

            console.error(
                "GET ADDRESSES ERROR:",
                error.response?.data || error.message
            );

            setError(
                error.response?.data?.message ||
                "Unable to load addresses."
            );

        } finally {

            setLoading(false);

        }
    };


    // =====================================================
    // LOAD ON PAGE
    // =====================================================

    useEffect(() => {

        if (user) {

            setForm((previous) => ({
                ...previous,
                name: previous.name || user.username || ""
            }));

        }

        loadAddresses();

    }, [user]);


    // =====================================================
    // FORM CHANGE
    // =====================================================

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


    // =====================================================
    // OPEN ADD FORM
    // =====================================================

    const openAddForm = () => {

        setEditingId(null);

        setForm(getInitialForm());

        setError("");

        setSuccess("");

        setShowForm(true);
    };


    // =====================================================
    // OPEN EDIT FORM
    // =====================================================

    const openEditForm = (address) => {

        setEditingId(address._id);

        setForm({
            name: address.name || "",
            phone: address.phone || "",
            addressLine1: address.addressLine1 || "",
            addressLine2: address.addressLine2 || "",
            landmark: address.landmark || "",
            city: address.city || "",
            state: address.state || "",
            pincode: address.pincode || "",
            addressType: address.addressType || "home",
            isDefault: Boolean(address.isDefault)
        });

        setError("");

        setSuccess("");

        setShowForm(true);

        // Scroll to form
        window.scrollTo({
            top: 350,
            behavior: "smooth"
        });
    };


    // =====================================================
    // CLOSE FORM
    // =====================================================

    const closeForm = () => {

        if (saving) {
            return;
        }

        setShowForm(false);

        setEditingId(null);

        setForm(getInitialForm());

        setError("");
    };


    // =====================================================
    // SUBMIT ADDRESS
    // =====================================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");

        setSuccess("");

        // ---------------------------------------------
        // Basic frontend validation
        // ---------------------------------------------

        const phone = form.phone.trim();

        const pincode = form.pincode.trim();

        if (!/^[0-9]{10}$/.test(phone)) {

            setError(
                "Please enter a valid 10-digit phone number."
            );

            return;
        }

        if (!/^[0-9]{6}$/.test(pincode)) {

            setError(
                "Please enter a valid 6-digit pincode."
            );

            return;
        }


        try {

            setSaving(true);

            let response;

            // -----------------------------------------
            // UPDATE
            // -----------------------------------------

            if (editingId) {

                response = await updateAddress(
                    editingId,
                    form
                );

                // console.log(
                //     "UPDATE ADDRESS RESPONSE:",
                //     response
                // );

                setSuccess(
                    "Address updated successfully."
                );

            }

            // -----------------------------------------
            // CREATE
            // -----------------------------------------

            else {

                response = await addAddress(form);

                // console.log(
                //     "ADD ADDRESS RESPONSE:",
                //     response
                // );

                setSuccess(
                    "Address added successfully."
                );
            }


            // -----------------------------------------
            // Reset form
            // -----------------------------------------

            setForm(getInitialForm());

            setEditingId(null);

            setShowForm(false);


            // -----------------------------------------
            // Reload addresses
            // -----------------------------------------

            await loadAddresses();

        } catch (error) {

            console.error(
                "SAVE ADDRESS ERROR:",
                error.response?.data || error.message
            );

            setError(
                error.response?.data?.message ||
                "Unable to save address."
            );

        } finally {

            setSaving(false);

        }
    };


    // =====================================================
    // DELETE ADDRESS
    // =====================================================

    const handleDelete = async (id) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this address?"
        );

        if (!confirmed) {
            return;
        }

        try {

            setDeletingId(id);

            setError("");

            setSuccess("");

            const response =
                await deleteAddress(id);

            // console.log(
            //     "DELETE ADDRESS RESPONSE:",
            //     response
            // );

            setSuccess(
                "Address deleted successfully."
            );

            // If editing deleted address
            if (editingId === id) {

                setEditingId(null);

                setShowForm(false);

                setForm(getInitialForm());
            }

            await loadAddresses();

        } catch (error) {

            console.error(
                "DELETE ADDRESS ERROR:",
                error.response?.data || error.message
            );

            setError(
                error.response?.data?.message ||
                "Unable to delete address."
            );

        } finally {

            setDeletingId(null);

        }
    };


    // =====================================================
    // SET DEFAULT ADDRESS
    // =====================================================

    const handleDefault = async (id) => {

        try {

            setDefaultId(id);

            setError("");

            setSuccess("");

            const response =
                await setDefaultAddress(id);

            // console.log(
            //     "SET DEFAULT RESPONSE:",
            //     response
            // );

            setSuccess(
                "Default address updated successfully."
            );

            await loadAddresses();

        } catch (error) {

            console.error(
                "SET DEFAULT ADDRESS ERROR:",
                error.response?.data || error.message
            );

            setError(
                error.response?.data?.message ||
                "Unable to set default address."
            );

        } finally {

            setDefaultId(null);

        }
    };


    return (

        <div className="
            min-h-[70vh]
            bg-stone-50
            py-10
        ">

            <div className="
                mx-auto
                max-w-5xl
                px-4
                sm:px-6
                lg:px-8
            ">


                {/* =====================================================
                    PROFILE HEADER
                ===================================================== */}

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
                        text-stone-900
                    ">
                        My Profile
                    </h1>

                </div>


                {/* =====================================================
                    ERROR
                ===================================================== */}

                {error && (

                    <div className="
                        mb-5
                        flex
                        items-center
                        justify-between
                        gap-3
                        rounded-xl
                        border
                        border-red-200
                        bg-red-50
                        px-4
                        py-3
                        text-sm
                        text-red-700
                    ">

                        <span>
                            {error}
                        </span>

                        <button
                            type="button"
                            onClick={() => setError("")}
                        >
                            <X size={17} />
                        </button>

                    </div>

                )}


                {/* =====================================================
                    SUCCESS
                ===================================================== */}

                {success && (

                    <div className="
                        mb-5
                        flex
                        items-center
                        gap-2
                        rounded-xl
                        border
                        border-green-200
                        bg-green-50
                        px-4
                        py-3
                        text-sm
                        text-green-700
                    ">

                        <Check size={17} />

                        {success}

                    </div>

                )}


                {/* =====================================================
                    USER INFORMATION
                ===================================================== */}

                <div className="
                    rounded-2xl
                    border
                    border-stone-200
                    bg-white
                    p-5
                ">

                    <div className="
                        flex
                        items-center
                        gap-4
                    ">

                        <div className="
                            flex
                            h-14
                            w-14
                            items-center
                            justify-center
                            rounded-full
                            bg-red-100
                            text-red-600
                        ">

                            <User size={25} />

                        </div>

                        <div>

                            <h2 className="
                                text-xl
                                font-black
                                text-stone-900
                            ">
                                {user?.username || "User"}
                            </h2>

                            <p className="
                                mt-1
                                text-sm
                                text-stone-500
                            ">
                                {user?.email}
                            </p>

                        </div>

                    </div>

                </div>


                {/* =====================================================
                    ADDRESS SECTION
                ===================================================== */}

                <div className="
                    mt-6
                    rounded-2xl
                    border
                    border-stone-200
                    bg-white
                    p-5
                ">


                    {/* Header */}

                    <div className="
                        flex
                        items-center
                        justify-between
                        gap-4
                    ">

                        <div>

                            <h2 className="
                                text-lg
                                font-black
                                text-stone-900
                            ">
                                Saved Addresses
                            </h2>

                            <p className="
                                mt-1
                                text-sm
                                text-stone-500
                            ">
                                Manage your delivery addresses.
                            </p>

                        </div>


                        {!showForm && (

                            <button
                                type="button"
                                onClick={openAddForm}
                                className="
                                    flex
                                    items-center
                                    gap-2
                                    rounded-xl
                                    bg-red-600
                                    px-4
                                    py-2.5
                                    text-sm
                                    font-bold
                                    text-white
                                    hover:bg-red-700
                                "
                            >

                                <Plus size={17} />

                                Add Address

                            </button>

                        )}

                    </div>


                    {/* =====================================================
                        ADD / EDIT FORM
                    ===================================================== */}

                    {showForm && (

                        <form
                            onSubmit={handleSubmit}
                            className="
                                mt-6
                                rounded-2xl
                                border
                                border-stone-200
                                bg-stone-50
                                p-5
                            "
                        >

                            {/* Form heading */}

                            <div className="
                                mb-5
                                flex
                                items-center
                                justify-between
                            ">

                                <div>

                                    <h3 className="
                                        text-base
                                        font-black
                                        text-stone-900
                                    ">
                                        {editingId
                                            ? "Edit Address"
                                            : "Add New Address"
                                        }
                                    </h3>

                                    <p className="
                                        mt-1
                                        text-xs
                                        text-stone-500
                                    ">
                                        Enter your complete delivery address.
                                    </p>

                                </div>

                                <button
                                    type="button"
                                    onClick={closeForm}
                                    className="
                                        rounded-lg
                                        p-2
                                        text-stone-400
                                        hover:bg-white
                                        hover:text-stone-700
                                    "
                                >
                                    <X size={18} />
                                </button>

                            </div>


                            {/* Fields */}

                            <div className="
                                grid
                                gap-4
                                sm:grid-cols-2
                            ">

                                {/* Name */}

                                <div>

                                    <label className="
                                        mb-1.5
                                        block
                                        text-xs
                                        font-bold
                                        text-stone-700
                                    ">
                                        Name *
                                    </label>

                                    <input
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        required
                                        type="text"
                                        placeholder="Enter name"
                                        className="
                                            w-full
                                            rounded-xl
                                            border
                                            border-stone-200
                                            bg-white
                                            px-3
                                            py-2.5
                                            text-sm
                                            outline-none
                                            focus:border-red-500
                                        "
                                    />

                                </div>


                                {/* Phone */}

                                <div>

                                    <label className="
                                        mb-1.5
                                        block
                                        text-xs
                                        font-bold
                                        text-stone-700
                                    ">
                                        Phone *
                                    </label>

                                    <input
                                        name="phone"
                                        value={form.phone}
                                        onChange={handleChange}
                                        required
                                        type="tel"
                                        maxLength={10}
                                        placeholder="10-digit mobile number"
                                        className="
                                            w-full
                                            rounded-xl
                                            border
                                            border-stone-200
                                            bg-white
                                            px-3
                                            py-2.5
                                            text-sm
                                            outline-none
                                            focus:border-red-500
                                        "
                                    />

                                </div>


                                {/* Address Line 1 */}

                                <div className="sm:col-span-2">

                                    <label className="
                                        mb-1.5
                                        block
                                        text-xs
                                        font-bold
                                        text-stone-700
                                    ">
                                        Address Line 1 *
                                    </label>

                                    <input
                                        name="addressLine1"
                                        value={form.addressLine1}
                                        onChange={handleChange}
                                        required
                                        type="text"
                                        placeholder="House no, street, area"
                                        className="
                                            w-full
                                            rounded-xl
                                            border
                                            border-stone-200
                                            bg-white
                                            px-3
                                            py-2.5
                                            text-sm
                                            outline-none
                                            focus:border-red-500
                                        "
                                    />

                                </div>


                                {/* Address Line 2 */}

                                <div className="sm:col-span-2">

                                    <label className="
                                        mb-1.5
                                        block
                                        text-xs
                                        font-bold
                                        text-stone-700
                                    ">
                                        Address Line 2
                                    </label>

                                    <input
                                        name="addressLine2"
                                        value={form.addressLine2}
                                        onChange={handleChange}
                                        type="text"
                                        placeholder="Apartment, floor, building etc."
                                        className="
                                            w-full
                                            rounded-xl
                                            border
                                            border-stone-200
                                            bg-white
                                            px-3
                                            py-2.5
                                            text-sm
                                            outline-none
                                            focus:border-red-500
                                        "
                                    />

                                </div>


                                {/* Landmark */}

                                <div>

                                    <label className="
                                        mb-1.5
                                        block
                                        text-xs
                                        font-bold
                                        text-stone-700
                                    ">
                                        Landmark
                                    </label>

                                    <input
                                        name="landmark"
                                        value={form.landmark}
                                        onChange={handleChange}
                                        type="text"
                                        placeholder="Nearby landmark"
                                        className="
                                            w-full
                                            rounded-xl
                                            border
                                            border-stone-200
                                            bg-white
                                            px-3
                                            py-2.5
                                            text-sm
                                            outline-none
                                            focus:border-red-500
                                        "
                                    />

                                </div>


                                {/* City */}

                                <div>

                                    <label className="
                                        mb-1.5
                                        block
                                        text-xs
                                        font-bold
                                        text-stone-700
                                    ">
                                        City *
                                    </label>

                                    <input
                                        name="city"
                                        value={form.city}
                                        onChange={handleChange}
                                        required
                                        type="text"
                                        placeholder="City"
                                        className="
                                            w-full
                                            rounded-xl
                                            border
                                            border-stone-200
                                            bg-white
                                            px-3
                                            py-2.5
                                            text-sm
                                            outline-none
                                            focus:border-red-500
                                        "
                                    />

                                </div>


                                {/* State */}

                                <div>

                                    <label className="
                                        mb-1.5
                                        block
                                        text-xs
                                        font-bold
                                        text-stone-700
                                    ">
                                        State *
                                    </label>

                                    <input
                                        name="state"
                                        value={form.state}
                                        onChange={handleChange}
                                        required
                                        type="text"
                                        placeholder="State"
                                        className="
                                            w-full
                                            rounded-xl
                                            border
                                            border-stone-200
                                            bg-white
                                            px-3
                                            py-2.5
                                            text-sm
                                            outline-none
                                            focus:border-red-500
                                        "
                                    />

                                </div>


                                {/* Pincode */}

                                <div>

                                    <label className="
                                        mb-1.5
                                        block
                                        text-xs
                                        font-bold
                                        text-stone-700
                                    ">
                                        Pincode *
                                    </label>

                                    <input
                                        name="pincode"
                                        value={form.pincode}
                                        onChange={handleChange}
                                        required
                                        type="text"
                                        maxLength={6}
                                        placeholder="6-digit pincode"
                                        className="
                                            w-full
                                            rounded-xl
                                            border
                                            border-stone-200
                                            bg-white
                                            px-3
                                            py-2.5
                                            text-sm
                                            outline-none
                                            focus:border-red-500
                                        "
                                    />

                                </div>


                                {/* Address Type */}

                                <div>

                                    <label className="
                                        mb-1.5
                                        block
                                        text-xs
                                        font-bold
                                        text-stone-700
                                    ">
                                        Address Type
                                    </label>

                                    <select
                                        name="addressType"
                                        value={form.addressType}
                                        onChange={handleChange}
                                        className="
                                            w-full
                                            rounded-xl
                                            border
                                            border-stone-200
                                            bg-white
                                            px-3
                                            py-2.5
                                            text-sm
                                            outline-none
                                            focus:border-red-500
                                        "
                                    >

                                        <option value="home">
                                            Home
                                        </option>

                                        <option value="work">
                                            Work
                                        </option>

                                        <option value="other">
                                            Other
                                        </option>

                                    </select>

                                </div>


                                {/* Default */}

                                <label className="
                                    flex
                                    items-center
                                    gap-2
                                    self-end
                                    pb-2
                                    text-sm
                                    font-medium
                                    text-stone-700
                                ">

                                    <input
                                        type="checkbox"
                                        name="isDefault"
                                        checked={form.isDefault}
                                        onChange={handleChange}
                                        className="
                                            h-4
                                            w-4
                                            accent-red-600
                                        "
                                    />

                                    Make default address

                                </label>


                                {/* Buttons */}

                                <div className="
                                    flex
                                    gap-2
                                    sm:col-span-2
                                ">

                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="
                                            rounded-xl
                                            bg-red-600
                                            px-5
                                            py-3
                                            text-sm
                                            font-bold
                                            text-white
                                            hover:bg-red-700
                                            disabled:cursor-not-allowed
                                            disabled:opacity-50
                                        "
                                    >

                                        {saving
                                            ? editingId
                                                ? "Updating..."
                                                : "Saving..."
                                            : editingId
                                                ? "Update Address"
                                                : "Save Address"
                                        }

                                    </button>


                                    <button
                                        type="button"
                                        disabled={saving}
                                        onClick={closeForm}
                                        className="
                                            rounded-xl
                                            border
                                            border-stone-200
                                            bg-white
                                            px-5
                                            py-3
                                            text-sm
                                            font-bold
                                            text-stone-600
                                            hover:bg-stone-100
                                            disabled:opacity-50
                                        "
                                    >
                                        Cancel
                                    </button>

                                </div>

                            </div>

                        </form>

                    )}


                    {/* =====================================================
                        ADDRESS LIST
                    ===================================================== */}

                    <div className="
                        mt-6
                        space-y-3
                    ">

                        {loading ? (

                            <div className="
                                py-10
                                text-center
                            ">

                                <p className="
                                    text-sm
                                    text-stone-500
                                ">
                                    Loading addresses...
                                </p>

                            </div>

                        ) : addresses.length === 0 ? (

                            <div className="
                                rounded-xl
                                border
                                border-dashed
                                border-stone-300
                                py-10
                                text-center
                            ">

                                <MapPin
                                    size={34}
                                    className="
                                        mx-auto
                                        text-stone-300
                                    "
                                />

                                <p className="
                                    mt-3
                                    text-sm
                                    font-medium
                                    text-stone-600
                                ">
                                    No saved addresses.
                                </p>

                                <p className="
                                    mt-1
                                    text-xs
                                    text-stone-400
                                ">
                                    Add an address for faster checkout.
                                </p>

                                {!showForm && (

                                    <button
                                        type="button"
                                        onClick={openAddForm}
                                        className="
                                            mt-4
                                            inline-flex
                                            items-center
                                            gap-2
                                            rounded-xl
                                            bg-red-600
                                            px-4
                                            py-2.5
                                            text-sm
                                            font-bold
                                            text-white
                                        "
                                    >

                                        <Plus size={16} />

                                        Add Address

                                    </button>

                                )}

                            </div>

                        ) : (

                            addresses.map((address) => (

                                <div
                                    key={address._id}
                                    className={`
                                        rounded-xl
                                        border
                                        p-4
                                        ${
                                            address.isDefault
                                                ? "border-green-200 bg-green-50/30"
                                                : "border-stone-200 bg-white"
                                        }
                                    `}
                                >

                                    <div className="
                                        flex
                                        items-start
                                        justify-between
                                        gap-4
                                    ">


                                        {/* Address information */}

                                        <div className="
                                            flex
                                            min-w-0
                                            gap-3
                                        ">

                                            <MapPin
                                                size={19}
                                                className="
                                                    mt-1
                                                    shrink-0
                                                    text-red-600
                                                "
                                            />

                                            <div className="min-w-0">

                                                <div className="
                                                    flex
                                                    flex-wrap
                                                    items-center
                                                    gap-2
                                                ">

                                                    <p className="
                                                        font-bold
                                                        text-stone-900
                                                    ">
                                                        {address.name}
                                                    </p>


                                                    <span className="
                                                        rounded-full
                                                        bg-stone-100
                                                        px-2
                                                        py-0.5
                                                        text-[10px]
                                                        font-bold
                                                        capitalize
                                                        text-stone-600
                                                    ">
                                                        {address.addressType}
                                                    </span>


                                                    {address.isDefault && (

                                                        <span className="
                                                            flex
                                                            items-center
                                                            gap-1
                                                            rounded-full
                                                            bg-green-100
                                                            px-2
                                                            py-0.5
                                                            text-[10px]
                                                            font-bold
                                                            text-green-700
                                                        ">

                                                            <Check size={11} />

                                                            Default

                                                        </span>

                                                    )}

                                                </div>


                                                <p className="
                                                    mt-2
                                                    text-sm
                                                    leading-6
                                                    text-stone-600
                                                ">

                                                    {address.addressLine1}

                                                    {address.addressLine2 &&
                                                        `, ${address.addressLine2}`}

                                                    {address.landmark &&
                                                        `, ${address.landmark}`}

                                                    {address.city &&
                                                        `, ${address.city}`}

                                                    {address.state &&
                                                        `, ${address.state}`}

                                                    {address.pincode &&
                                                        ` - ${address.pincode}`}

                                                </p>


                                                <p className="
                                                    mt-1
                                                    text-xs
                                                    text-stone-500
                                                ">
                                                    Phone: {address.phone}
                                                </p>


                                                {/* Address actions */}

                                                <div className="
                                                    mt-4
                                                    flex
                                                    flex-wrap
                                                    items-center
                                                    gap-4
                                                ">

                                                    {!address.isDefault && (

                                                        <button
                                                            type="button"
                                                            disabled={
                                                                defaultId ===
                                                                address._id
                                                            }
                                                            onClick={() =>
                                                                handleDefault(
                                                                    address._id
                                                                )
                                                            }
                                                            className="
                                                                text-xs
                                                                font-bold
                                                                text-red-600
                                                                hover:text-red-700
                                                                disabled:opacity-50
                                                            "
                                                        >

                                                            {defaultId ===
                                                            address._id
                                                                ? "Updating..."
                                                                : "Make Default"
                                                            }

                                                        </button>

                                                    )}


                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            openEditForm(
                                                                address
                                                            )
                                                        }
                                                        className="
                                                            flex
                                                            items-center
                                                            gap-1
                                                            text-xs
                                                            font-bold
                                                            text-stone-600
                                                            hover:text-red-600
                                                        "
                                                    >

                                                        <Pencil size={14} />

                                                        Edit

                                                    </button>


                                                    <button
                                                        type="button"
                                                        disabled={
                                                            deletingId ===
                                                            address._id
                                                        }
                                                        onClick={() =>
                                                            handleDelete(
                                                                address._id
                                                            )
                                                        }
                                                        className="
                                                            flex
                                                            items-center
                                                            gap-1
                                                            text-xs
                                                            font-bold
                                                            text-red-600
                                                            hover:text-red-700
                                                            disabled:opacity-50
                                                        "
                                                    >

                                                        <Trash2 size={14} />

                                                        {deletingId ===
                                                        address._id
                                                            ? "Deleting..."
                                                            : "Delete"
                                                        }

                                                    </button>

                                                </div>

                                            </div>

                                        </div>

                                    </div>

                                </div>

                            ))

                        )}

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Profile;