import { useState } from "react";
import { signIn } from "aws-amplify/auth";

/**
 * LoginForm Component
 * 
 * Handles user sign-in with AWS Cognito
 * Integrates with Amplify Auth API
 */
function LoginForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Validates email format
   */
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  /**
   * Validates the form
   */
  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    return newErrors;
  };

  /**
   * Handles input changes
   */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  /**
   * Handles form submission with Cognito
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Sign in with AWS Cognito
      const { isSignedIn, nextStep } = await signIn({
        username: formData.email.toLowerCase().trim(),
        password: formData.password,
      });

      if (isSignedIn) {
        // Success - call callback
        if (onSuccess) {
          onSuccess({
            email: formData.email,
          });
        }

        // Reset form
        setFormData({
          email: "",
          password: "",
        });
        setErrors({});
      } else {
        // Handle additional steps (MFA, etc.)
        console.log("Next step:", nextStep);
        setErrors({
          submit: "Additional verification required. Please check your email.",
        });
      }
    } catch (error) {
      console.error("Login error:", error);

      // Handle specific Cognito errors
      let errorMessage = "Login failed. Please try again.";

      if (error.name === "UserNotFoundException") {
        errorMessage = "No account found with this email.";
      } else if (error.name === "NotAuthorizedException") {
        errorMessage = "Incorrect email or password.";
      } else if (error.name === "UserNotConfirmedException") {
        errorMessage = "Please verify your email before logging in.";
      }

      setErrors({
        submit: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit} noValidate>
      {/* Global error message */}
      {errors.submit && (
        <div className="error-banner" role="alert">
          {errors.submit}
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
          name="email"
          className={`form-input ${errors.email ? "input-error" : ""}`}
          value={formData.email}
          onChange={handleChange}
          placeholder="you@example.com"
          disabled={isSubmitting}
          aria-invalid={errors.email ? "true" : "false"}
          aria-describedby={errors.email ? "email-error" : undefined}
        />
        {errors.email && (
          <span className="error-message" id="email-error" role="alert">
            {errors.email}
          </span>
        )}
      </div>

      {/* Password Field */}
      <div className="form-group">
        <label htmlFor="password" className="form-label">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          className={`form-input ${errors.password ? "input-error" : ""}`}
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
          disabled={isSubmitting}
          aria-invalid={errors.password ? "true" : "false"}
          aria-describedby={errors.password ? "password-error" : undefined}
        />
        {errors.password && (
          <span className="error-message" id="password-error" role="alert">
            {errors.password}
          </span>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="submit-button"
        disabled={isSubmitting}
        aria-busy={isSubmitting}
      >
        {isSubmitting ? "Signing in..." : "Sign In"}
      </button>

      {/* Helper Text */}
      <p className="form-helper-text">
        Forgot your password?{" "}
        <span className="link-text">Reset it here</span>
      </p>
    </form>
  );
}

export default LoginForm;
