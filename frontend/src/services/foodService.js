import api from "./api";

// ===============================
// GET ALL FOODS
// ===============================
export const getFoods = async () => {
    try {
        const response = await api.get("/food/get-food");

        // console.log("Food Service Response:", response.data);

        return response.data;

    } catch (error) {
        console.error(
            "Get Foods Error:",
            error.response?.data || error.message
        );

        throw error;
    }
};


// ===============================
// GET FOOD BY ID
// ===============================
export const getFoodById = async (id) => {
    try {
        const response = await api.get(
            `/food/get-food/${id}`
        );

        return response.data;

    } catch (error) {
        console.error(
            "Get Food Error:",
            error.response?.data || error.message
        );

        throw error;
    }
};


// ===============================
// GET FOOD CATEGORIES
// ===============================
export const getFoodCategories = async () => {
    try {
        const response = await api.get(
            "/food/get-categories"
        );

        // console.log(
        //     "Food Categories Response:",
        //     response.data
        // );

        return response.data;

    } catch (error) {
        console.error(
            "Get Food Categories Error:",
            error.response?.data || error.message
        );

        throw error;
    }
};


// ===============================
// ADD FOOD
// ===============================
export const addFood = async (formData) => {
    try {
        const response = await api.post(
            "/food/add-food",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }
        );

        return response.data;

    } catch (error) {
        console.error(
            "Add Food Error:",
            error.response?.data || error.message
        );

        throw error;
    }
};


// ===============================
// UPDATE FOOD
// ===============================
export const updateFood = async (id, formData) => {
    try {
        const response = await api.put(
            `/food/update-food/${id}`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }
        );

        return response.data;

    } catch (error) {
        console.error(
            "Update Food Error:",
            error.response?.data || error.message
        );

        throw error;
    }
};


// ===============================
// DELETE FOOD
// ===============================
export const deleteFood = async (id) => {
    try {
        const response = await api.delete(
            `/food/delete-food/${id}`
        );

        return response.data;

    } catch (error) {
        console.error(
            "Delete Food Error:",
            error.response?.data || error.message
        );

        throw error;
    }
};