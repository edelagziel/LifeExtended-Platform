import { useState } from "react";

/**
 * RegisterForm Component
 * 
 * Responsibility: Form logic, validation, and user interaction
 * This component handles all form-related business logic including:
 * - Form state management
 * - Input validation
 * - Error handling
 * - Form submission
 */
function RegisterForm({ onSuccess }) {
  // Form state - using controlled components pattern
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Error state - separate from form data (Single Responsibility)
  const [errors, setErrors] = useState({});

  // Submission state - for UX feedback
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Validates email format using regex
   * @param {string} email - Email to validate
   * @returns {boolean} - True if valid
   */
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  /**
   * Validates the entire form
   * Returns an object with field names as keys and error messages as values
   * @returns {Object} - Errors object
   */
  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    return newErrors;
  };

  /**
   * Handles input changes
   * Updates form state and clears field-specific errors
   * @param {Event} e - Input change event
   */
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update form data
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  /**
   * Handles form submission
   * Validates form and calls onSuccess callback if valid
   * @param {Event} e - Form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const newErrors = validateForm();

    // If there are errors, update error state and stop
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Cognito sign up
    setIsSubmitting(true);

    try {
      const { authSignUp } = await import("../../services/authService");
      
      // הרשמה ב-Cognito
      await authSignUp({
        email: formData.email,
        password: formData.password,
      });

      // On success, call the callback with email
      if (onSuccess) {
        onSuccess({
          email: formData.email,
        });
      }

      // Reset form
      setFormData({
        email: "",
        password: "",
        confirmPassword: "",
      });
      setErrors({});
    } catch (error) {
      // Handle registration error
      console.error("Registration error:", error);
      setErrors({
        submit: error.message || "Registration failed. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="register-form" onSubmit={handleSubmit} noValidate>
      {/* Global error message */}
      {errors.submit && (
        <div className="error-banner" role="alert">
          {errors.submit}
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
          Password *
        </label>
        <input
          type="password"
          id="password"
          name="password"
          className={`form-input ${errors.password ? "input-error" : ""}`}
          value={formData.password}
          onChange={handleChange}
          placeholder="At least 6 characters"
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

      {/* Confirm Password Field */}
      <div className="form-group">
        <label htmlFor="confirmPassword" className="form-label">
          Confirm Password *
        </label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          className={`form-input ${
            errors.confirmPassword ? "input-error" : ""
          }`}
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Re-enter your password"
          disabled={isSubmitting}
          aria-invalid={errors.confirmPassword ? "true" : "false"}
          aria-describedby={
            errors.confirmPassword ? "confirmPassword-error" : undefined
          }
        />
        {errors.confirmPassword && (
          <span
            className="error-message"
            id="confirmPassword-error"
            role="alert"
          >
            {errors.confirmPassword}
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
        {isSubmitting ? "Creating Account..." : "Create Account"}
      </button>

      {/* Helper Text */}
      <p className="form-helper-text">
        By creating an account, you agree to our Terms of Service and Privacy
        Policy.
      </p>
    </form>
  );
}

export default RegisterForm;
