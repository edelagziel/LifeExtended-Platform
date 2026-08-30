import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useContext } from "react";
import { toggleTheme } from "../../store/themeSlice";
import type { RootState } from "../../store/store";
import { UserContext } from "../../context/UserContext";
import "./AdminNavbar.css";

export default function AdminNavbar() {
  const mode = useSelector((state: RootState) => state.theme.mode);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useContext(UserContext);

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  const handleLogout = async () => {
    try {
      const { authSignOut } = await import("../../services/authService");
      await authSignOut();

      // נקה את ה-UserContext
      if (user) {
        user.setIsAuthenticated(false);
        user.setEmail(null);
        user.setIsProfileFilled(false);
      }

      // חזרה למסך התחברות
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <header className="admin-navbar">
      <div className="admin-navbar-container">
        <div className="admin-logo">
          <span className="logo-icon"></span>
          <span className="logo-text">LifeExtended</span>
          <span className="logo-badge">Admin</span>
        </div>

        <div className="navbar-right">
          <nav className="admin-nav-links">
            <NavLink to="/dashboard" className="nav-link" end>
              <span className="nav-icon"></span>
              Dashboard
            </NavLink>
            <NavLink to="/dashboard/create" className="nav-link">
              <span className="nav-icon"></span>
              Create Poll
            </NavLink>
            <NavLink to="/dashboard/live" className="nav-link">
              <span className="nav-icon"></span>
              Live
            </NavLink>
          </nav>

          <button className="theme-toggle" onClick={handleToggleTheme}>
            {mode === "light" ? "🌙" : "☀️"}
          </button>

          <button className="logout-button" onClick={handleLogout} title="Logout">
            🚪 Logout
          </button>
        </div>
      </div>
    </header>
  );
}
