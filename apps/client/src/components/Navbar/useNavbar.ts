import { useDispatch, useSelector } from "react-redux";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../../store/store";
import { toggleTheme } from "../../store/themeSlice";
import { UserContext } from "../../context/UserContext";
import { signOut } from "aws-amplify/auth";

export function useNavbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const mode = useSelector((state: RootState) => state.theme.mode);

  const user = useContext(UserContext);
  if (!user) {
    throw new Error("useNavbar must be used within UserProvider");
  }

  const { isAuthenticated, isProfileFilled, setIsAuthenticated, setEmail, setIsProfileFilled } = user;

  function onToggleTheme() {
    dispatch(toggleTheme());
  }

  async function handleLogout() {
    try {
      await signOut();
      
      // Clear user state
      setIsAuthenticated(false);
      setEmail(null);
      setIsProfileFilled(false);
      
      // Clear any other local storage if needed
      localStorage.removeItem("surveyVoted");
      localStorage.removeItem("surveyEmail");
      
      // Navigate to login
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  return {
    mode,
    isAuthenticated,   
    isProfileFilled,
    onToggleTheme,
    handleLogout,
  };
}
