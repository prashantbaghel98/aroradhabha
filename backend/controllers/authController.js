const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const bcrypt = require("bcrypt");


// ==========================================
// USER REGISTRATION
// ==========================================

const userRegister = async (req, res) => {

    try {

        const {
            username,
            email,
            password
        } = req.body;


        // --------------------------------------
        // Required fields
        // --------------------------------------

        if (
            !username ||
            !email ||
            !password
        ) {

            return res.status(400).json({
                success: false,
                message: "Please enter all information."
            });

        }


        const cleanUsername =
            username.trim();

        const cleanEmail =
            email.trim().toLowerCase();


        // --------------------------------------
        // Username validation
        // --------------------------------------

        if (cleanUsername.length < 3) {

            return res.status(400).json({
                success: false,
                message: "Username must be at least 3 characters."
            });

        }


        // --------------------------------------
        // Email validation
        // --------------------------------------

        if (!validator.isEmail(cleanEmail)) {

            return res.status(400).json({
                success: false,
                message: "Enter a valid email address."
            });

        }


        // --------------------------------------
        // Password validation
        // --------------------------------------

        if (password.length < 6) {

            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters."
            });

        }


        // --------------------------------------
        // Check existing user
        // --------------------------------------

        const userExist =
            await userModel.findOne({
                $or: [
                    {
                        email: cleanEmail
                    },
                    {
                        username: cleanUsername
                    }
                ]
            });


        if (userExist) {

            if (
                userExist.username ===
                cleanUsername
            ) {

                return res.status(409).json({
                    success: false,
                    message: "Username already exists."
                });

            }


            if (
                userExist.email ===
                cleanEmail
            ) {

                return res.status(409).json({
                    success: false,
                    message: "Email already exists."
                });

            }


            return res.status(409).json({
                success: false,
                message: "User already exists."
            });

        }


        // --------------------------------------
        // Hash password
        // --------------------------------------

        const salt =
            await bcrypt.genSalt(10);


        const hashPassword =
            await bcrypt.hash(
                password,
                salt
            );


        // --------------------------------------
        // Create user
        // --------------------------------------

        const newUser =
            await userModel.create({

                username: cleanUsername,

                email: cleanEmail,

                password: hashPassword

            });


        // --------------------------------------
        // Response
        // --------------------------------------

        return res.status(201).json({

            success: true,

            message:
                "Account successfully created."

        });


    } catch (error) {

        console.error(
            "Registration Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Server error during registration."

        });

    }

};


// ==========================================
// USER LOGIN
// ==========================================

const userLogin = async (req, res) => {

    try {

        const {
            username,
            password
        } = req.body;


        // --------------------------------------
        // Validate input
        // --------------------------------------

        if (
            !username ||
            !password
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Username and password are required."

            });

        }


        const cleanUsername =
            username.trim();


        // --------------------------------------
        // Find user
        // --------------------------------------

        const user =
            await userModel.findOne({
                username: cleanUsername
            });


        if (!user) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid username or password."

            });

        }


        // --------------------------------------
        // Compare password
        // --------------------------------------

        const passwordMatch =
            await bcrypt.compare(
                password,
                user.password
            );


        if (!passwordMatch) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid username or password."

            });

        }


        // --------------------------------------
        // Create JWT
        // --------------------------------------

        const token =
            jwt.sign(
                {
                    userId: user._id
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "1d"
                }
            );


        // --------------------------------------
        // Set HTTP-only cookie
        // --------------------------------------

        res.cookie(
            "token",
            token,
            {
                httpOnly: true,

                secure:
                    process.env.NODE_ENV ===
                    "production",

                sameSite:
                    process.env.NODE_ENV ===
                    "production"
                        ? "none"
                        : "lax",

                maxAge:
                    24 *
                    60 *
                    60 *
                    1000
            }
        );


        // --------------------------------------
        // User response
        // Never send password
        // --------------------------------------

        const userData = {

            _id: user._id,

            username: user.username,

            email: user.email,

            role: user.role

        };


        // --------------------------------------
        // Login response
        // --------------------------------------

        return res.status(200).json({

            success: true,

            message:
                "Successfully Login",

            user: userData

        });


    } catch (error) {

        console.error(
            "Login Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Server error during login."

        });

    }

};


// ==========================================
// USER LOGOUT
// ==========================================

const userLogout = async (req, res) => {

    try {

        res.clearCookie(
            "token",
            {
                httpOnly: true,

                secure:
                    process.env.NODE_ENV ===
                    "production",

                sameSite:
                    process.env.NODE_ENV ===
                    "production"
                        ? "none"
                        : "lax"
            }
        );


        return res.status(200).json({

            success: true,

            message:
                "Successfully Logout"

        });


    } catch (error) {

        console.error(
            "Logout Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Server error during logout."

        });

    }

};


module.exports = {

    userRegister,

    userLogin,

    userLogout

};