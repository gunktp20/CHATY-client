import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ReactDOM from "react-dom/client";
import React from "react";
import "./index.css";
import "./App.css";
import { Provider } from "react-redux";
import { store } from "./app/store.ts";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import SharedLayout from "./pages/SharedLayout/index.tsx";
import Profile from "./pages/Profile/index.tsx";
import UserChat from "./pages/UserChat/index.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <SharedLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <UserChat /> },
      // { path: "user", element: <User /> },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/home",
    element: <Home />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
