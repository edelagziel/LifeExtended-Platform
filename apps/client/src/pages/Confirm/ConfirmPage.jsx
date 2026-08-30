import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { confirmSignUp, resendSignUpCode } from "aws-amplify/auth";
import "./confirm.css";

/**
 * ConfirmPage Component
 * 
 * Handles email verification with confirmation code
 */
function ConfirmPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get email from navigation state (passed from RegisterPage)
  const emailFromState = location.state?.email || "";
  
  const [email, setEmail] = useState(emailFromState);
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /**
   * Handle code confirmation
   */
  const handleConfirm = async (e) => {
    e.preventDefault();
    
    if (!email || !code) {
      setError("Please enter both email and confirmation code");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await confirmSignUp({
        username: email.toLowerCase().trim(),
        confirmationCode: code.trim(),
      });

      setSuccess("Email verified successfully! Redirecting to login...");
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
      
    } catch (err) {
      console.error("Confirmation error:", err);
      
      let errorMessage = "Verification failed. Please try again.";
      
      if (err.name === "CodeMismatchException") {
        errorMessage = "Invalid verification code. Please check and try again.";
      } else if (err.name === "ExpiredCodeException") {
        errorMessage = "Code expired. Please request a new one.";
      } else if (err.name === "UserNotFoundException") {
        errorMessage = "User not found. Please check your email.";
      }
      
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Resend confirmation code
   */
  const handleResend = async () => {
    if (!email) {
      setError("Please enter your email first");
      return;
    }

    setIsSubmitting(true);
    setError("");
    
    try {
      await resendSignUpCode({
        username: email.toLowerCase().trim(),
      });
      
      setSuccess("New code sent to your email!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Resend error:", err);
      setError("Failed to resend code. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="confirm-page">
      <div className="confirm-container">
        {/* Header */}
        <div className="confirm-header">
          <h1>Verify Your Email</h1>
          <p className="confirm-subtitle">
            Enter the verification code sent to your email
          </p>
        </div>

        {/* Form */}
        <form className="confirm-form" onSubmit={handleConfirm}>
          {/* Success Message */}
          {success && (
            <div className="success-banner" role="alert">
              {success}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="error-banner" role="alert">
              {error}
            </div>
          )}

          {/* Email Field */}
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              disabled={isSubmitting}
              required
            />
          </div>

          {/* Code Field */}
          <div className="form-group">
            <label htmlFor="code" className="form-label">
              Verification Code
            </label>
            <input
              type="text"
              id="code"
              className="form-input"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter 6-digit code"
              maxLength={6}
              disabled={isSubmitting}
              required
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
          <div className="form-actions">
            <p>
              Didn't receive the code?{" "}
              <button
                type="button"
                className="link-button"
                onClick={handleResend}
                disabled={isSubmitting}
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
            onClick={() => navigate("/login")}
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmPage;
