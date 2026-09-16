import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

// Customer Layout
import Layout from "./components/Layout";

// Customer Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Menu from "./pages/Menu";
import FoodDetails from "./pages/FoodDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Payment from "./pages/Payment";
import OrderSuccess from "./pages/OrderSuccess";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import Profile from "./pages/Profile";
import MyReviews from "./pages/MyReviews";

// Admin Layout
import AdminLayout from "./admin/AdminLayout";
import AdminLogin from "./admin/AdminLogin";

// Admin Pages
import Dashboard from "./admin/Dashboard";
import Categories from "./admin/Categories";
import Foods from "./admin/Foods";
import AddFood from "./admin/AddFood";
import EditFood from "./admin/EditFood";
import AdminOrders from "./admin/Orders";
import AdminOrderDetails from "./admin/OrderDetails";
import Payments from "./admin/Payments";
import Reviews from "./admin/Reviews";

// Protected Route
import ProtectedRoute from "./components/ProtectedRoute";


function App() {
    return (
        <BrowserRouter>

            <Routes>

                {/* =====================================================
                    CUSTOMER ROUTES
                ====================================================== */}

                <Route element={<Layout />}>

                    {/* =================================================
                        PUBLIC CUSTOMER ROUTES
                    ================================================== */}

                    {/* Home */}
                    <Route
                        path="/"
                        element={<Home />}
                    />

                    {/* Login */}
                    <Route
                        path="/login"
                        element={<Login />}
                    />

                    {/* Register */}
                    <Route
                        path="/register"
                        element={<Register />}
                    />

                    {/* Menu */}
                    <Route
                        path="/menu"
                        element={<Menu />}
                    />

                    {/* Food Details */}
                    <Route
                        path="/food/:id"
                        element={<FoodDetails />}
                    />


                    {/* =================================================
                        PROTECTED CUSTOMER ROUTES
                    ================================================== */}

                    {/* Cart */}
                    <Route
                        path="/cart"
                        element={
                            <ProtectedRoute>
                                <Cart />
                            </ProtectedRoute>
                        }
                    />

                    {/* Checkout */}
                    <Route
                        path="/checkout"
                        element={
                            <ProtectedRoute>
                                <Checkout />
                            </ProtectedRoute>
                        }
                    />

                    {/* Payment */}
                    <Route
                        path="/payment/:orderId"
                        element={
                            <ProtectedRoute>
                                <Payment />
                            </ProtectedRoute>
                        }
                    />

                    {/* Order Success */}
                    <Route
                        path="/order-success/:orderId"
                        element={
                            <ProtectedRoute>
                                <OrderSuccess />
                            </ProtectedRoute>
                        }
                    />

                    {/* My Orders */}
                    <Route
                        path="/orders"
                        element={
                            <ProtectedRoute>
                                <Orders />
                            </ProtectedRoute>
                        }
                    />

                    {/* Order Details */}
                    <Route
                        path="/orders/:id"
                        element={
                            <ProtectedRoute>
                                <OrderDetails />
                            </ProtectedRoute>
                        }
                    />

                    {/* Profile */}
                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        }
                    />

                    {/* My Reviews */}
                    <Route
                        path="/my-reviews"
                        element={
                            <ProtectedRoute>
                                <MyReviews />
                            </ProtectedRoute>
                        }
                    />

                </Route>


                {/* =====================================================
                    ADMIN LOGIN
                ====================================================== */}

                {/* This page MUST remain public */}
                <Route
                    path="/admin/login"
                    element={<AdminLogin />}
                />


                {/* =====================================================
                    PROTECTED ADMIN ROUTES
                ====================================================== */}

                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute adminOnly>
                            <AdminLayout />
                        </ProtectedRoute>
                    }
                >

                    {/* =================================================
                        ADMIN DASHBOARD
                    ================================================== */}

                    <Route
                        index
                        element={<Dashboard />}
                    />


                    {/* =================================================
                        ADMIN CATEGORIES
                    ================================================== */}

                    <Route
                        path="categories"
                        element={<Categories />}
                    />


                    {/* =================================================
                        ADMIN FOODS
                    ================================================== */}

                    <Route
                        path="foods"
                        element={<Foods />}
                    />

                    {/* Add Food */}
                    <Route
                        path="foods/add"
                        element={<AddFood />}
                    />

                    {/* Edit Food */}
                    <Route
                        path="foods/edit/:id"
                        element={<EditFood />}
                    />


                    {/* =================================================
                        ADMIN ORDERS
                    ================================================== */}

                    <Route
                        path="orders"
                        element={<AdminOrders />}
                    />

                    {/* Admin Order Details */}
                    <Route
                        path="orders/:id"
                        element={<AdminOrderDetails />}
                    />


                    {/* =================================================
                        ADMIN PAYMENTS
                    ================================================== */}

                    <Route
                        path="payments"
                        element={<Payments />}
                    />


                    {/* =================================================
                        ADMIN REVIEWS
                    ================================================== */}

                    <Route
                        path="reviews"
                        element={<Reviews />}
                    />

                </Route>

            </Routes>

        </BrowserRouter>
    );
}

export default App;