import { useDispatch, useSelector } from "react-redux";
import { useContext } from "react";
import type { RootState } from "../../store/store";
import { toggleTheme } from "../../store/themeSlice";
import { UserContext } from "../../context/UserContext";

export function useNavbar() {
  const dispatch = useDispatch();
  const mode = useSelector((state: RootState) => state.theme.mode);

  const user = useContext(UserContext);
  if (!user) {
    throw new Error("useNavbar must be used within UserProvider");
  }


  const { isAuthenticated, isProfileFilled } = user;

  function onToggleTheme() {
    dispatch(toggleTheme());
  }

  return {
    mode,
    isAuthenticated,   
    isProfileFilled,
    onToggleTheme,
  };
}
