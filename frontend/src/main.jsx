

// Current Code 

import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, Route } from "react-router-dom";
import App from "./App.jsx";
import ConnectCalendly from "./components/ConnectCalendly.jsx";
import CallbackPage from "./components/CallbackPage.jsx";
import LinksForm from "./components/LinksForm.jsx";
import Results from "./components/Results.jsx";
import Error from "./components/Error.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { Provider } from "react-redux";
import store from "./redux/store.js";
import "./index.css";
import ErrorBoundary from "./components/ErrorBoundry.jsx";
import Title from "./components/Title.jsx";


console.log("🧠 Debug - Component Imports:", {
  App,
  CallbackPage,
  ConnectCalendly,
  LinksForm,
  Results,
  Error,
  ProtectedRoute
});


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <Error />,
    children: [
      {
        path: "auth",
        element: <ConnectCalendly />,
      },
      {
        path: "callback",
        element: <CallbackPage />,
      },
      {
        path: "results",
        element: <Results />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            index: true,
            element: <LinksForm />,
          },
        ],
      },
    ],
  },
]);


ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
     <ErrorBoundary>
    <RouterProvider router={router} />
    </ErrorBoundary>
  </Provider>
);



