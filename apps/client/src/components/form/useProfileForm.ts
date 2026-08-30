import { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { useLocalStorage } from "../../customHooks/useLocalStorage";
import type {
  ProfileFormData,
  HealthGoal,
} from "./profile.types";

// --- initial state ---
const initialProfileData: ProfileFormData = {
  // Section A – Basic Info
  heightCm: "",
  weightKg: "",
  age: "",
  gender: "",

  // Section B – Lifestyle
  activityLevel: "",
  sleepQuality: "",
  stressLevel: 3,
  smoking: false,
  alcohol: "",

  // Section C – Goals
  goals: [],
};

export function useProfileForm() {
  // --- Context ---
  const user = useContext(UserContext);
  if (!user) {
    throw new Error("useProfileForm must be used within UserProvider");
  }

  const { setIsProfileFilled } = user;

  // --- Form State (persisted) ---
  const [formData, setFormData] = useLocalStorage<ProfileFormData>(
    "profileForm",
    initialProfileData
  );

  // --- Generic field update ---
  function updateField<K extends keyof ProfileFormData>(
    field: K,
    value: ProfileFormData[K]
  ) {
    setFormData({
      ...formData,
      [field]: value,
    });
  }

  // --- Goals (checkbox logic) ---
  function toggleGoal(goal: HealthGoal) {
    const exists = formData.goals.includes(goal);

    const updatedGoals = exists
      ? formData.goals.filter((g) => g !== goal)
      : [...formData.goals, goal];

    setFormData({
      ...formData,
      goals: updatedGoals,
    });
  }

  // --- Submit ---
  function submitProfile() {
    //  Validation בסיסי בלבד (אפשר להרחיב)
    if (
      formData.heightCm === "" ||
      formData.weightKg === "" ||
      formData.age === "" ||
      formData.gender === ""
    ) {
      return {
        success: false,
        message: "Please fill all required fields",
      };
    }

    // ✔ סימון פרופיל כמולא
    setIsProfileFilled(true);

    return {
      success: true,
      message: "Profile saved successfully",
    };
  }

  return {
    formData,
    updateField,
    toggleGoal,
    submitProfile,
  };
}
