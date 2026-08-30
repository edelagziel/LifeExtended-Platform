import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/UserContext.tsx";

function ProtectedRoute({ children }) {
  const user = useContext(UserContext);

  if (!user) {
    throw new Error("ProtectedRoute must be used within UserProvider");
  }

  const { isAuthenticated } = user;

  if (!isAuthenticated) {
    return <Navigate to="/register" replace />;
  }

  return children;
}

export default ProtectedRoute;
