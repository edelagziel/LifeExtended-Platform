import { Navigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext.tsx";

function ProtectedRoute({ children }) {
  const user = useContext(UserContext);
  const [isChecking, setIsChecking] = useState(true);

  if (!user) {
    throw new Error("ProtectedRoute must be used within UserProvider");
  }

  const { isAuthenticated, setIsAuthenticated, setEmail } = user;

  // בדיקת אימות אמיתי מ-Cognito בטעינה ראשונית
  useEffect(() => {
    async function checkAuth() {
      try {
        const { authCheckAuth } = await import("../services/authService");
        const { isAuthenticated: cognitoAuth, user: cognitoUser } = await authCheckAuth();

        if (cognitoAuth && cognitoUser) {
          // עדכון המצב הגלובלי
          setIsAuthenticated(true);
          setEmail(cognitoUser.username);
        } else {
          // לא מחובר - נקה את ה-state
          setIsAuthenticated(false);
          setEmail(null);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setIsAuthenticated(false);
        setEmail(null);
      } finally {
        setIsChecking(false);
      }
    }

    checkAuth();
  }, [setIsAuthenticated, setEmail]);

  // מציג טוען בזמן בדיקת אימות
  if (isChecking) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        minHeight: "100vh" 
      }}>
        <p>Loading...</p>
      </div>
    );
  }

  // אם לא מאומת, הפנה להתחברות
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
