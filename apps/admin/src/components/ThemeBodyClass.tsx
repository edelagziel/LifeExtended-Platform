import { useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";

export default function ThemeBodyClass() {
  const mode = useSelector((state: RootState) => state.theme.mode);

  useEffect(() => {
    document.body.classList.remove("light", "dark");
    document.body.classList.add(mode);
  }, [mode]);

  return null;
}
