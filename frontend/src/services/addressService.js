import api from "./api";

// Add address
export const addAddress = async (addressData) => {
    try {
        const response = await api.post(
            "/address/add-address",
            addressData
        );

        return response.data;
    } catch (error) {
        console.error(
            "Add Address Error:",
            error.response?.data || error.message
        );

        throw error;
    }
};

// Get all addresses
export const getAddresses = async () => {
    try {
        const response = await api.get(
            "/address/get-addresses"
        );

        return response.data;
    } catch (error) {
        console.error(
            "Get Addresses Error:",
            error.response?.data || error.message
        );

        throw error;
    }
};

// Get single address
export const getAddressById = async (id) => {
    try {
        const response = await api.get(
            `/address/get-address/${id}`
        );

        return response.data;
    } catch (error) {
        console.error(
            "Get Address Error:",
            error.response?.data || error.message
        );

        throw error;
    }
};

// Update address
export const updateAddress = async (
    id,
    addressData
) => {
    try {
        const response = await api.put(
            `/address/update-address/${id}`,
            addressData
        );

        return response.data;
    } catch (error) {
        console.error(
            "Update Address Error:",
            error.response?.data || error.message
        );

        throw error;
    }
};

// Delete address
export const deleteAddress = async (id) => {
    try {
        const response = await api.delete(
            `/address/delete-address/${id}`
        );

        return response.data;
    } catch (error) {
        console.error(
            "Delete Address Error:",
            error.response?.data || error.message
        );

        throw error;
    }
};

// Set default address
export const setDefaultAddress = async (id) => {
    try {
        const response = await api.put(
            `/address/set-default/${id}`
        );

        return response.data;
    } catch (error) {
        console.error(
            "Set Default Address Error:",
            error.response?.data || error.message
        );

        throw error;
    }
};