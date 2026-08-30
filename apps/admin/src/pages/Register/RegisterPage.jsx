import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import RegisterForm from "./RegisterForm";
import "./register.css";

import { UserContext } from "../../context/UserContext";

/**
 * RegisterPage Component
 *
 * Responsibility:
 * - Page-level layout
 * - Handles navigation after successful registration
 * - Updates global user state (auth + email)
 */
function RegisterPage() {
  const navigate = useNavigate();
  const user = useContext(UserContext);

  if (!user) {
    throw new Error("RegisterPage must be used within UserProvider");
  }

  /**
   * Called when RegisterForm completes successfully
   * @param formData - data returned from RegisterForm (must include email)
   */
  const handleRegisterSuccess = (formData) => {
    console.log("Registration successful:", formData);

    // 📧 שמירת אימייל זמנית (עדיין לא מאומת)
    user.setEmail(formData.email.toLowerCase().trim());

    // 🚀 מעבר לדף אימות קוד
    navigate("/confirm-signup", {
      state: {
        email: formData.email.toLowerCase().trim(),
      },
    });
  };

  return (
    <div className="register-page">
      <div className="register-container">
        {/* Header */}
        <div className="register-header">
          <h1>Create Account</h1>
          <p className="register-subtitle">
            Join us today and start your journey
          </p>
        </div>

        {/* Form */}
        <RegisterForm onSuccess={handleRegisterSuccess} />

        {/* Footer */}
        <div className="register-footer">
          <p>
            Already have an account?{" "}
            <span
              className="login-link"
              onClick={() => navigate("/login")}
            >
              Sign in
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
