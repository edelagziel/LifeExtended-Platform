import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "./LoginForm";
import "./login.css";
import { UserContext } from "../../context/UserContext";

/**
 * LoginPage Component
 * 
 * Handles user authentication with AWS Cognito
 * Updates global user state after successful login
 */
function LoginPage() {
  const navigate = useNavigate();
  const user = useContext(UserContext);

  if (!user) {
    throw new Error("LoginPage must be used within UserProvider");
  }

  /**
   * Called when LoginForm completes successfully
   * @param userData - data returned from Cognito (includes email)
   */
  const handleLoginSuccess = (userData) => {
    console.log("Login successful:", userData);

    // Mark user as authenticated
    user.setIsAuthenticated(true);

    // Save email globally
    user.setEmail(userData.email.toLowerCase().trim());

    // Navigate to home
    navigate("/home");
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Header */}
        <div className="login-header">
          <h1>Welcome Back</h1>
          <p className="login-subtitle">
            Sign in to continue your journey
          </p>
        </div>

        {/* Form */}
        <LoginForm onSuccess={handleLoginSuccess} />

        {/* Footer */}
        <div className="login-footer">
          <p>
            Don't have an account?{" "}
            <span
              className="register-link"
              onClick={() => navigate("/register")}
            >
              Create one
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
