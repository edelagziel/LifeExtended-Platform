import { createBrowserRouter, Navigate } from "react-router-dom";
import AdminLayout from "../components/layout/AdminLayout";
import DashboardPage from "../pages/Dashboard/DashboardPage";
import CreatePollPage from "../pages/CreatePoll/CreatePollPage";
import LivePollPage from "../pages/LivePoll/LivePollPage";
// @ts-expect-error - .jsx files without type definitions
import RegisterPage from "../pages/Register/RegisterPage";
// @ts-expect-error - .jsx files without type definitions
import LoginPage from "../pages/Login/LoginPage";
// @ts-expect-error - .jsx files without type definitions
import ConfirmSignUpPage from "../pages/ConfirmSignUp/ConfirmSignUpPage";
// @ts-expect-error - .jsx files without type definitions
import ProtectedRoute from "../routes/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/confirm-signup",
    element: <ConfirmSignUpPage />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "create", element: <CreatePollPage /> },
      { path: "live", element: <LivePollPage /> },
    ],
  },
]);
