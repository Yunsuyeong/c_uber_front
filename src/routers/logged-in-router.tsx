import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Restaurants from "../pages/client/restaurants";
import Header from "../components/header";
import useMe from "../hooks/useMe";
import ConfirmEmail from "../pages/user/confirm-email";
import EditProfile from "../pages/user/edit-profile";
import Search from "../pages/client/search";
import Category from "../pages/client/category";
import Restaurant from "../pages/client/restaurant";
import MyRestaurants from "../pages/owner/my-restaurants";
import AddRestaurants from "../pages/owner/add-restaurant";
import MyRestaurant from "../pages/owner/my-restaurant";
import AddDish from "../pages/owner/add-dish";
import Order from "../pages/order";
import Dashboard from "../pages/driver/dashboard";
import { UserRole } from "../__generated__/graphql";

const clientRoutes = [
  {
    path: "/",
    element: <Restaurants />,
  },
  {
    path: "/search",
    element: <Search />,
  },
  {
    path: "/category/:slug",
    element: <Category />,
  },
  {
    path: "/restaurant/:id",
    element: <Restaurant />,
  },
];

const commonRoutes = [
  {
    path: "/confirm",
    element: <ConfirmEmail />,
  },
  {
    path: "/edit-profile",
    element: <EditProfile />,
  },
  {
    path: "/orders/:id",
    element: <Order />,
  },
];

const restaurantRoutes = [
  {
    path: "/",
    element: <MyRestaurants />,
  },
  {
    path: "/add-restaurant",
    element: <AddRestaurants />,
  },
  {
    path: "/restaurant/:id",
    element: <MyRestaurant />,
  },
  {
    path: "/restaurant/:id/add-dish",
    element: <AddDish />,
  },
];

const driverRoutes = [
  {
    path: "/",
    element: <Dashboard />,
  },
];

export const LoggedInRouter = () => {
  const { data, loading, error } = useMe();
  if (!data || loading || error) {
    return (
      <div className="h-screen flex justify-center items-center">
        <span className="font-medium text-xl tracking-wide">Loading...</span>
      </div>
    );
  }
  return (
    <Router>
      <Header email={data.me.email} />
      <Routes>
        {data.me.role === UserRole.Client &&
          clientRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        {data.me.role === UserRole.Owner &&
          restaurantRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        {data.me.role === UserRole.Delivery &&
          driverRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        {commonRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
        {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
      </Routes>
    </Router>
  );
};
