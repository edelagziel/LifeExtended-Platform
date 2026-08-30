// src/pages/Home/HomePage.tsx
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { useContext } from "react";

import { UserContext } from "../../context/UserContext";

import HomeIntro from "./HomeIntro";
import HomeMetrics from "./HomeMetrics";
import HomeCTA from "./HomeCTA";

import "./home.css";

function HomePage() {
  const mode = useSelector((state: RootState) => state.theme.mode);
  const user = useContext(UserContext);

  if (!user) throw new Error("UserContext missing");

  return (
    <div className={`home-page ${mode}`}>
      <HomeIntro />

      <HomeMetrics />

      <HomeCTA
        isProfileFilled={user.isProfileFilled}
      />
    </div>
  );
}

export default HomePage;
