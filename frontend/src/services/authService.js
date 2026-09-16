import api from "./api";


// ==========================================
// LOGIN USER
// ==========================================

export const loginUser = async (userData) => {

    try {

        const response = await api.post(
            "/user/login",
            {
                username: userData.username,
                password: userData.password
            }
        );

        return response.data;

    } catch (error) {

        console.error(
            "Login Error:",
            error.response?.data ||
            error.message
        );

        throw error;
    }
};


// ==========================================
// REGISTER USER
// ==========================================

export const registerUser = async (userData) => {

    try {

        const response = await api.post(
            "/user/register",
            {
                username: userData.username,
                email: userData.email,
                password: userData.password
            }
        );

        return response.data;

    } catch (error) {

        console.error(
            "Register Error:",
            error.response?.data ||
            error.message
        );

        throw error;
    }
};


// ==========================================
// GET CURRENT USER
// ==========================================

export const getCurrentUser = async () => {

    try {

        const response = await api.get(
            "/user/profile"
        );

        return response.data;

    } catch (error) {

        console.error(
            "Get Current User Error:",
            error.response?.data ||
            error.message
        );

        throw error;
    }
};


// ==========================================
// LOGOUT USER
// ==========================================

export const logoutUser = async () => {

    try {

        const response = await api.post(
            "/user/logout"
        );

        return response.data;

    } catch (error) {

        console.error(
            "Logout Error:",
            error.response?.data ||
            error.message
        );

        throw error;
    }
};