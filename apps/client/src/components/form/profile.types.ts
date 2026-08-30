// --- Enums / Unions ---

export type Gender = "male" | "female" | "other";

export type ActivityLevel = "low" | "moderate" | "high";

export type SleepQuality = "poor" | "average" | "good";

export type AlcoholConsumption = "none" | "moderate" | "high";

export type HealthGoal =
  | "energy"
  | "focus"
  | "longevity"
  | "burnout_prevention"
  | "fitness";

// --- Main Form Data ---

export type ProfileFormData = {
  // Section A – Basic Info
  heightCm: number | "";
  weightKg: number | "";
  age: number | "";
  gender: Gender | "";

  // Section B – Lifestyle
  activityLevel: ActivityLevel | "";
  sleepQuality: SleepQuality | "";
  stressLevel: number; // 1–5
  smoking: boolean;
  alcohol: AlcoholConsumption | "";

  // Section C – Goals
  goals: HealthGoal[];
};
