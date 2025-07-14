// import React from "react";
// import { createRoot } from "react-dom/client";
// import { Provider } from "react-redux";
// import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider, Navigate, Outlet } from "react-router-dom";
// import store from "./redux/store.js";
// // import "./index.css";
// import App from "./App.jsx";
// import CallbackPage from "./components/CallbackPage.jsx";
// import ConnectCalendly from "./components/ConnectCalendly.jsx";
// import LinksForm from "./components/LinksForm.jsx";
// import Error from "./components/Error.jsx";
// import Results from "./components/Results.jsx";
// import { useSelector } from "react-redux";
// import './index.css' // <- important
// import ProtectedRoute from "./components/ProtectedRoute.jsx";

// // ✅ Corrected ProtectedRoute Component
// // const ProtectedRoute = () => {
// //   const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
// //   return isAuthenticated ? <Outlet /> : <Navigate to="/auth" replace />;
// // };





// const router = createBrowserRouter(
//   createRoutesFromElements(
//     <Route path="/" element={<App />}>
//       {/* Public Routes */}
//        <Route path="callback"  element={<CallbackPage />} />
//          <Route path="auth"  element={<ConnectCalendly />} />
//          <Route path="results"  element={<Results />}  />
//          <Route path="*"  element={<Error />}    />
//          {/* ✅ Protect "/" Route to Show Either `LinksForm` or Redirect  */}
//            <Route  element={<ProtectedRoute />}> 
//  <Route  element={<LinksForm />} /> 
//          </Route>



     

//     </Route>
//   )
// );

// createRoot(document.getElementById("root")).render(
//   <Provider store={store}>
//     <RouterProvider router={router} />
//   </Provider>
// );

// console.log({
//   App,
//   CallbackPage,
//   ConnectCalendly,
//   LinksForm,
//   Error,
//   Results,
//   ProtectedRoute
// });



// import React from "react";
// import { createRoot } from "react-dom/client";
// import { Provider } from "react-redux";
// import {
//   createBrowserRouter,
//   RouterProvider,
//   Route,
//   createRoutesFromElements,
// } from "react-router-dom";

// import store from "./redux/store.js";
// import App from "./App.jsx";
// import CallbackPage from "./components/CallbackPage.jsx";
// import ConnectCalendly from "./components/ConnectCalendly.jsx";
// import LinksForm from "./components/LinksForm.jsx";
// import Error from "./components/Error.jsx";
// import Results from "./components/Results.jsx";
// import ProtectedRoute from "./components/ProtectedRoute.jsx";

// import "./index.css";

// // 🧠 CORRECT structure: nested routes must be wrapped properly
// const router = createBrowserRouter(
//   createRoutesFromElements(
//     <Route path="/" element={<App />} errorElement={<Error />}>
//       <Route path="auth" element={<ConnectCalendly />} />
//       <Route path="callback" element={<CallbackPage />} />
//       <Route path="results" element={<Results />} />
//       <Route element={<ProtectedRoute />}>
//         <Route index element={<LinksForm />} />
//       </Route>
//       <Route path="*" element={<Error />} />
//     </Route>
//   )
// );

// createRoot(document.getElementById("root")).render(
//   <Provider store={store}>
//     <ErrorBoundary>
//       <RouterProvider router={router} />
//     </ErrorBoundary>
//   </Provider>
// );

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



