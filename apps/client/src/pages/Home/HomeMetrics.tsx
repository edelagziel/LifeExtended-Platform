// src/pages/Home/HomeMetrics.tsx
import StatCard from "../../components/StatCard";
import { useLocalStorage } from "../../customHooks/useLocalStorage";
import { useHealthMetrics } from "../../customHooks/useHealthMetrics";
import type { ProfileFormData } from "../../components/form/profile.types";

const initialProfileData: ProfileFormData = {
  heightCm: "",
  weightKg: "",
  age: "",
  gender: "",
  activityLevel: "",
  sleepQuality: "",
  stressLevel: 3,
  smoking: false,
  alcohol: "",
  goals: [],
};

function HomeMetrics() {
  // Load profile from localStorage
  const [profileData] = useLocalStorage<ProfileFormData>(
    "profileForm",
    initialProfileData
  );

  // Calculate metrics based on profile
  const metrics = useHealthMetrics(profileData);

  return (
    <section className="home-metrics">
      {metrics.map((metric) => (
        <StatCard
          key={metric.title}
          title={metric.title}
          value={metric.value}
          description={metric.description}
          helpText={metric.helpText}
        />
      ))}
    </section>
  );
}

export default HomeMetrics;
