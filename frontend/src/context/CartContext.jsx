import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState
} from "react";

import api from "../services/api";
import { useAuth } from "./AuthContext";


const CartContext = createContext(null);


const emptyCart = {
    items: [],
    subtotal: 0,
    discount: 0,
    deliveryFee: 0,
    total: 0
};


export function CartProvider({ children }) {

    const { isAuthenticated } = useAuth();

    const [cart, setCart] = useState(emptyCart);

    const [loading, setLoading] = useState(false);


    // =====================================================
    // GET CART
    // =====================================================

    const getCart = useCallback(async () => {

        if (!isAuthenticated) {
            setCart(emptyCart);
            return null;
        }

        try {

            setLoading(true);

            const response = await api.get(
                "/cart/get-cart-items"
            );

            const cartData =
                response.data?.cart ||
                emptyCart;

            setCart(cartData);

            return response.data;

        } catch (error) {

            // Do not show anything in console
            setCart(emptyCart);

            return null;

        } finally {

            setLoading(false);

        }

    }, [isAuthenticated]);


    // =====================================================
    // ADD TO CART
    // =====================================================

    const addToCart = useCallback(
        async (foodId, quantity = 1) => {

            if (!foodId) {
                return null;
            }

            try {

                const response = await api.post(
                    "/cart/add-to-cart",
                    {
                        foodId,
                        quantity: Number(quantity)
                    }
                );

                if (response.data?.success) {

                    await getCart();

                }

                return response.data;

            } catch (error) {

                // Do not show anything in console
                throw error;

            }

        },
        [getCart]
    );


    // =====================================================
    // UPDATE CART ITEM
    // =====================================================

    const updateCartItem = useCallback(
        async (foodId, quantity) => {

            if (!foodId) {
                return null;
            }

            try {

                const response = await api.put(
                    `/cart/update-cart-item/${String(foodId)}`,
                    {
                        quantity: Number(quantity)
                    }
                );

                await getCart();

                return response.data;

            } catch (error) {

                // Do not show anything in console
                throw error;

            }

        },
        [getCart]
    );


    // =====================================================
    // REMOVE FROM CART
    // =====================================================

    const removeFromCart = useCallback(
        async (foodId) => {

            if (!foodId) {
                return null;
            }

            try {

                const response = await api.delete(
                    `/cart/remove-from-cart/${String(foodId)}`
                );

                if (response.data?.success) {

                    setCart(
                        response.data?.cart ||
                        emptyCart
                    );

                }

                return response.data;

            } catch (error) {

                // Do not show anything in console
                throw error;

            }

        },
        []
    );


    // =====================================================
    // CLEAR CART
    // =====================================================

    const clearCart = useCallback(async () => {

        try {

            const response = await api.delete(
                "/cart/clear-cart"
            );

            setCart(
                response.data?.cart ||
                emptyCart
            );

            return response.data;

        } catch (error) {

            // Do not show anything in console
            throw error;

        }

    }, []);


    // =====================================================
    // CHECK FOOD IN CART
    // =====================================================

    const isInCart = useCallback(
        (foodId) => {

            if (!foodId) {
                return false;
            }

            return (
                cart.items?.some((item) => {

                    const itemFoodId =
                        typeof item.food === "object"
                            ? item.food?._id
                            : item.food;

                    return (
                        String(itemFoodId) ===
                        String(foodId)
                    );

                }) || false
            );

        },
        [cart.items]
    );


    // =====================================================
    // GET CART ITEM
    // =====================================================

    const getCartItem = useCallback(
        (foodId) => {

            if (!foodId) {
                return null;
            }

            return (
                cart.items?.find((item) => {

                    const itemFoodId =
                        typeof item.food === "object"
                            ? item.food?._id
                            : item.food;

                    return (
                        String(itemFoodId) ===
                        String(foodId)
                    );

                }) || null
            );

        },
        [cart.items]
    );


    // =====================================================
    // CART COUNT
    // =====================================================

    const cartCount =
        cart.items?.reduce(
            (total, item) => {

                return (
                    total +
                    Number(item.quantity || 0)
                );

            },
            0
        ) || 0;


    // =====================================================
    // LOAD CART WHEN AUTHENTICATION CHANGES
    // =====================================================

    useEffect(() => {

        if (!isAuthenticated) {

            setCart(emptyCart);
            return;

        }

        getCart();

    }, [
        isAuthenticated,
        getCart
    ]);


    // =====================================================
    // PROVIDER
    // =====================================================

    return (

        <CartContext.Provider
            value={{
                cart,
                setCart,

                loading,

                cartCount,

                getCart,

                addToCart,

                updateCartItem,

                removeFromCart,

                clearCart,

                isInCart,

                getCartItem
            }}
        >

            {children}

        </CartContext.Provider>

    );

}


// =====================================================
// USE CART HOOK
// =====================================================

export function useCart() {

    return useContext(CartContext);

}
