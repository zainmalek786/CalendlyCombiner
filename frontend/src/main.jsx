import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider, Navigate, Outlet } from "react-router-dom";
import store from "./redux/store.js";
import "./index.css";
import App from "./App.jsx";
import CallbackPage from "./components/CallbackPage.jsx";
import ConnectCalendly from "./components/ConnectCalendly.jsx";
import LinksForm from "./components/LinksForm.jsx";
import Error from "./components/Error.jsx";
import Results from "./components/Results.jsx";
import { useSelector } from "react-redux";

// ✅ Corrected ProtectedRoute Component
const ProtectedRoute = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return isAuthenticated ? <Outlet /> : <Navigate to="/auth" replace />;
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      {/* Public Routes */}
      <Route path="callback" element={<CallbackPage />} />
      <Route path="auth" element={<ConnectCalendly />} />
      <Route path="results" element={<Results />} />

      <Route path="*" element={<Error />} />

      {/* ✅ Protect "/" Route to Show Either `LinksForm` or Redirect */}
      <Route element={<ProtectedRoute />}>
        <Route path="" element={<LinksForm />} />
      </Route>
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
