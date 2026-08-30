import { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import "./login.css";

/**
 * LoginPage Component
 * דף התחברות עם AWS Cognito
 */
function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useContext(UserContext);

  if (!user) {
    throw new Error("LoginPage must be used within UserProvider");
  }

  const [formData, setFormData] = useState({
    email: location.state?.email || "",
    password: "",
  });

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(
    location.state?.message || ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // נקה הודעת הצלחה לאחר 5 שניות
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // נקה שגיאות בזמן הקלדה
    if (error) {
      setError("");
    }
  };

  const validateForm = () => {
    if (!formData.email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!formData.password) {
      setError("Password is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const { authSignIn } = await import("../../services/authService");

      await authSignIn({
        email: formData.email,
        password: formData.password,
      });

      // 🔐 סימון משתמש כמחובר
      user.setIsAuthenticated(true);

      // 📧 שמירת אימייל
      user.setEmail(formData.email.toLowerCase().trim());

      // 🚀 מעבר ל-Dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      
      // הצגת הודעת שגיאה ידידותית
      if (error.message.includes("not confirmed")) {
        setError("Please verify your email first. Check your inbox for the verification code.");
        // אופציונלי: ניתן לנווט לדף אימות
        setTimeout(() => {
          navigate("/confirm-signup", { state: { email: formData.email } });
        }, 2000);
      } else if (error.message.includes("Incorrect")) {
        setError("Incorrect email or password");
      } else {
        setError(error.message || "Failed to sign in. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Header */}
        <div className="login-header">
          <h1>Welcome Back</h1>
          <p className="login-subtitle">Sign in to your account</p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="success-banner" role="alert">
            {successMessage}
          </div>
        )}

        {/* Form */}
        <form className="login-form" onSubmit={handleSubmit}>
          {/* Error message */}
          {error && (
            <div className="error-banner" role="alert">
              {error}
            </div>
          )}

          {/* Email Field */}
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-input"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              disabled={isSubmitting}
              autoFocus={!formData.email}
            />
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password *
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-input"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              disabled={isSubmitting}
              autoFocus={!!formData.email}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Footer */}
        <div className="login-footer">
          <p>
            Don't have an account?{" "}
            <span
              className="signup-link"
              onClick={() => navigate("/register")}
            >
              Sign up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
