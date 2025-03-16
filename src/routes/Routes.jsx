import {
    createBrowserRouter,
  } from "react-router-dom";
import ErrorPage from "../pages/ErrorPage";
import MainLayout from "../pages/MainLayout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Products from "../pages/Products";
import Dashboard from "./Dashboard";
import MyProducts from "../Dashboard/MyProducts";
import AddProduct from "../Dashboard/AddProduct";
import Profile from "../Dashboard/Profile";
import Welcome from "../Dashboard/Welcome";
import PrivateRoute from "./PrivateRoute";
import DetailsPage from "../pages/DetailsPage";
import Users from "../Dashboard/Users";
import Coupons from "../Dashboard/Coupons";
import ReportedContent from "../Dashboard/ReportedContent";
import AllProducts from "../Dashboard/AllProducts";
  
export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout></MainLayout>,
    errorElement: <ErrorPage></ErrorPage>,
    children: [
      {
        path: '/',
        element: <Home></Home>
      },
      {
        path: '/login',
        element: <Login></Login>
      },
      {
        path: '/register',
        element: <Register></Register>
      },
      {
        path: '/products',
        element: <Products></Products>
      },
      {
        path: '/products/:id',
        element: <DetailsPage></DetailsPage>,
        loader: ({params}) => fetch(`https://tech-prod-server.vercel.app/products/${params.id}`)
      }
      
    ]
  },
  {
    path: '/dashboard',
    element: <PrivateRoute> <Dashboard></Dashboard> </PrivateRoute>,
    errorElement: <ErrorPage></ErrorPage>,
    children: [
      {
        path: '/dashboard/',
        element: <PrivateRoute> <Welcome></Welcome> </PrivateRoute>
      },
      {
        path: '/dashboard/my-products',
        element: <PrivateRoute> <MyProducts></MyProducts> </PrivateRoute>
      },
      {
        path: '/dashboard/add-product',
        element: <PrivateRoute> <AddProduct></AddProduct> </PrivateRoute>
      },
      {
        path: '/dashboard/profile',
        element: <PrivateRoute> <Profile></Profile> </PrivateRoute>
      },
      {
        path: '/dashboard/users',
        element: <PrivateRoute> <Users></Users> </PrivateRoute>
      },
      {
        path: '/dashboard/coupons',
        element: <PrivateRoute> <Coupons></Coupons> </PrivateRoute>
      },
      {
        path: '/dashboard/all-products',
        element: <PrivateRoute>  <AllProducts></AllProducts> </PrivateRoute>
      },
      {
        path: '/dashboard/reported-products',
        element: <PrivateRoute> <ReportedContent></ReportedContent> </PrivateRoute>
      },
      
      
    ]
  }
]);
