import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import UserLayout from "./components/Layout/UserLayout";
import Home from "./pages/Home";
import { Toaster } from "sonner";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import CollectionPage from "./pages/CollectionPage";
import ProductDetails from "./components/Products/ProductDetalis";
import CheckOut from "./components/CheckOut/CheckOut";
import OrderConfrmationPage from "./pages/OrderConfrmationPage";
import OrderDetailsPage from "./pages/OrderDetailsPage";
import MyOrders from "./pages/MyOrders";
import AdminLayout from "./components/Admin/AdminLayout";
import { ThemeProvider } from "./context/ThemeContext";
import DashbourdHome from "./components/Admin/DashbourdHome";
import UsersList from "./components/Admin/UsersList";
import OrdersList from "./components/Admin/OrdersList";
import ProductsList from "./components/Admin/ProductsList";
import ProtectedRoute from "./components/Shared/ProtectedRoute/ProtectedRoute";

import { Provider } from "react-redux";
import store from "./redux/Store";
import CategoriesList from "./components/Admin/CategoriesList";
import BrandsList from "./components/Admin/BrandsList";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Toaster richColors position="top-right" />
        <Routes>
          {/* Layout Wrapper */}
          <Route path="/" element={<UserLayout />}>
            {/* Nested Routes */}
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="collections/:collection" element={<CollectionPage />} />
            <Route path="product/:id" element={<ProductDetails />} />
            <Route path="checkout" element={
              <ProtectedRoute>
                <CheckOut />
              </ProtectedRoute>
            } />
            <Route path="order-confirmation" element={
              <ProtectedRoute>
                <OrderConfrmationPage />
              </ProtectedRoute>
            } />
            <Route path="order/:id" element={
              <ProtectedRoute>
                <OrderDetailsPage />
              </ProtectedRoute>
            } />
            <Route path="my-orders" element={
              <ProtectedRoute>
                <MyOrders />
              </ProtectedRoute>
            } />
          </Route>

          {/* Admin Layout */}
          <Route
            path="admin"
            element={
              <ThemeProvider>
                <ProtectedRoute adminOnly>
                  <AdminLayout />
                </ProtectedRoute>
              </ThemeProvider>
            }
          >
            <Route path="dashboard" element={<DashbourdHome />} />
            <Route path="users" element={<UsersList />} />
            <Route path="products" element={<ProductsList />} />
            <Route path="orders" element={<OrdersList />} />
            <Route path="categories" element={<CategoriesList />} />
            <Route path="brands" element={<BrandsList />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
