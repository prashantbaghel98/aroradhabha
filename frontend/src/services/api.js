import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080/api",

    withCredentials: true,

    headers: {
        "Content-Type": "application/json"
    }
});


// ==========================================
// REQUEST INTERCEPTOR
// ==========================================

api.interceptors.request.use(
    (config) => {

        return config;

    },
    (error) => {

        return Promise.reject(error);

    }
);


// ==========================================
// RESPONSE INTERCEPTOR
// ==========================================

api.interceptors.response.use(

    (response) => response,

    (error) => {

        if (error.response?.status === 401) {

            console.log(
                "Authentication required."
            );

        }

        return Promise.reject(error);

    }
);


export default api;