import {
    MapPin,
    Phone,
    Mail,
    Clock,
    MessageCircle
} from "lucide-react";

import { Link } from "react-router-dom";

function Footer() {
    return (
        <footer className="border-t border-stone-200 bg-stone-950 text-stone-300">

            {/* =========================
                MAIN FOOTER
            ========================== */}

            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

                <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">

                    {/* Restaurant */}

                    <div>

                        <Link to="/">
                            <h2 className="text-2xl font-extrabold text-white">
                                Arora Da Dhabha
                            </h2>
                        </Link>

                        <p className="mt-4 max-w-sm text-sm leading-6 text-stone-400">
                            Delicious food, fresh ingredients and
                            authentic flavours served with love.
                        </p>


                        {/* Social Links */}

                        <div className="mt-6 flex items-center gap-3">

                            {/* Facebook */}

                            <a
                                href="#"
                                aria-label="Facebook"
                                className="
                                    flex h-10 w-10
                                    items-center justify-center
                                    rounded-full
                                    bg-stone-800
                                    text-sm font-bold
                                    text-white
                                    transition
                                    hover:bg-red-600
                                "
                            >
                                f
                            </a>


                            {/* Instagram */}

                            <a
                                href="#"
                                aria-label="Instagram"
                                className="
                                    flex h-10 w-10
                                    items-center justify-center
                                    rounded-full
                                    bg-stone-800
                                    text-sm font-bold
                                    text-white
                                    transition
                                    hover:bg-red-600
                                "
                            >
                                IG
                            </a>


                            {/* YouTube */}

                            <a
                                href="#"
                                aria-label="YouTube"
                                className="
                                    flex h-10 w-10
                                    items-center justify-center
                                    rounded-full
                                    bg-stone-800
                                    text-xs font-bold
                                    text-white
                                    transition
                                    hover:bg-red-600
                                "
                            >
                                YT
                            </a>


                            {/* WhatsApp */}

                            <a
                                href="#"
                                aria-label="WhatsApp"
                                className="
                                    flex h-10 w-10
                                    items-center justify-center
                                    rounded-full
                                    bg-stone-800
                                    text-white
                                    transition
                                    hover:bg-green-600
                                "
                            >
                                <MessageCircle size={19} />
                            </a>

                        </div>

                    </div>


                    {/* Quick Links */}

                    <div>

                        <h3 className="text-base font-bold text-white">
                            Quick Links
                        </h3>

                        <ul className="mt-5 space-y-3">

                            <li>
                                <Link
                                    to="/"
                                    className="text-sm transition hover:text-red-500"
                                >
                                    Home
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/menu"
                                    className="text-sm transition hover:text-red-500"
                                >
                                    Our Menu
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/cart"
                                    className="text-sm transition hover:text-red-500"
                                >
                                    My Cart
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/orders"
                                    className="text-sm transition hover:text-red-500"
                                >
                                    My Orders
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/profile"
                                    className="text-sm transition hover:text-red-500"
                                >
                                    My Profile
                                </Link>
                            </li>

                        </ul>

                    </div>


                    {/* Contact */}

                    <div>

                        <h3 className="text-base font-bold text-white">
                            Contact Us
                        </h3>

                        <div className="mt-5 space-y-4">

                            <div className="flex gap-3">

                                <MapPin
                                    size={19}
                                    className="mt-0.5 shrink-0 text-red-500"
                                />

                                <p className="text-sm leading-6 text-stone-400">
                                    Your Restaurant Address,
                                    <br />
                                    Your City, India
                                </p>

                            </div>


                            <a
                                href="tel:+919876543210"
                                className="
                                    flex items-center gap-3
                                    text-sm text-stone-400
                                    transition
                                    hover:text-red-500
                                "
                            >

                                <Phone
                                    size={18}
                                    className="shrink-0 text-red-500"
                                />

                                +91 98765 43210

                            </a>


                            <a
                                href="mailto:info@aroradadhaba.com"
                                className="
                                    flex items-center gap-3
                                    text-sm text-stone-400
                                    transition
                                    hover:text-red-500
                                "
                            >

                                <Mail
                                    size={18}
                                    className="shrink-0 text-red-500"
                                />

                                info@aroradadhaba.com

                            </a>

                        </div>

                    </div>


                    {/* Opening Hours */}

                    <div>

                        <h3 className="text-base font-bold text-white">
                            Opening Hours
                        </h3>

                        <div className="mt-5">

                            <div className="flex gap-3">

                                <Clock
                                    size={19}
                                    className="mt-0.5 shrink-0 text-red-500"
                                />

                                <div className="space-y-3 text-sm">

                                    <div>

                                        <p className="font-semibold text-white">
                                            Monday - Sunday
                                        </p>

                                        <p className="mt-1 text-stone-400">
                                            11:00 AM - 11:00 PM
                                        </p>

                                    </div>

                                    <div>

                                        <p className="font-semibold text-white">
                                            Online Orders
                                        </p>

                                        <p className="mt-1 text-stone-400">
                                            Available during opening hours
                                        </p>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>


            {/* Bottom */}

            <div className="border-t border-stone-800">

                <div className="
                    mx-auto
                    flex
                    max-w-7xl
                    flex-col
                    gap-3
                    px-4
                    py-5
                    text-center
                    text-sm
                    text-stone-500
                    sm:px-6
                    md:flex-row
                    md:items-center
                    md:justify-between
                    md:text-left
                    lg:px-8
                ">

                    <p>
                        © {new Date().getFullYear()} Arora Da Dhabha.
                        All rights reserved.
                    </p>

                    <p>
                        Fresh Food • Great Taste • Happy Customers
                    </p>

                </div>

            </div>

        </footer>
    );
}

export default Footer;