import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./confirmSignUp.css";

/**
 * ConfirmSignUpPage Component
 * דף אימות קוד שנשלח למייל לאחר הרשמה
 */
function ConfirmSignUpPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // קבלת email מה-navigation state
  const email = location.state?.email;

  const [confirmationCode, setConfirmationCode] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  useEffect(() => {
    // אם אין email, חזרה לדף הרשמה
    if (!email) {
      navigate("/register", { replace: true });
    }
  }, [email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!confirmationCode.trim()) {
      setError("Please enter the confirmation code");
      return;
    }

    setIsSubmitting(true);

    try {
      const { authConfirmSignUp } = await import("../../services/authService");
      
      await authConfirmSignUp({
        email,
        confirmationCode: confirmationCode.trim(),
      });

      // הצלחה! מעבר למסך התחברות
      navigate("/login", {
        state: {
          email,
          message: "Account confirmed! Please sign in.",
        },
      });
    } catch (error) {
      console.error("Confirmation error:", error);
      setError(error.message || "Invalid confirmation code. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    setResendMessage("");
    setError("");

    try {
      const { resendSignUpCode } = await import("aws-amplify/auth");
      
      await resendSignUpCode({
        username: email,
      });

      setResendMessage("Code sent! Check your email.");
    } catch (error) {
      console.error("Resend code error:", error);
      setError(error.message || "Failed to resend code. Please try again.");
    }
  };

  if (!email) {
    return null; // מציג כלום בזמן ה-redirect
  }

  return (
    <div className="confirm-page">
      <div className="confirm-container">
        {/* Header */}
        <div className="confirm-header">
          <h1>Verify Your Email</h1>
          <p className="confirm-subtitle">
            We sent a verification code to <strong>{email}</strong>
          </p>
        </div>

        {/* Form */}
        <form className="confirm-form" onSubmit={handleSubmit}>
          {/* Error message */}
          {error && (
            <div className="error-banner" role="alert">
              {error}
            </div>
          )}

          {/* Success message (resend) */}
          {resendMessage && (
            <div className="success-banner" role="alert">
              {resendMessage}
            </div>
          )}

          {/* Confirmation Code Field */}
          <div className="form-group">
            <label htmlFor="confirmationCode" className="form-label">
              Verification Code *
            </label>
            <input
              type="text"
              id="confirmationCode"
              name="confirmationCode"
              className="form-input"
              value={confirmationCode}
              onChange={(e) => setConfirmationCode(e.target.value)}
              placeholder="Enter 6-digit code"
              disabled={isSubmitting}
              maxLength={6}
              autoFocus
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Verifying..." : "Verify Email"}
          </button>

          {/* Resend Code */}
          <div className="resend-section">
            <p>
              Didn't receive the code?{" "}
              <button
                type="button"
                className="resend-link"
                onClick={handleResendCode}
              >
                Resend Code
              </button>
            </p>
          </div>
        </form>

        {/* Footer */}
        <div className="confirm-footer">
          <button
            className="back-link"
            onClick={() => navigate("/register")}
          >
            ← Back to Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmSignUpPage;
