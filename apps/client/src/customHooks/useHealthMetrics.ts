import { useMemo } from "react";
import type { ProfileFormData } from "../components/form/profile.types";

/**
 * Health Metrics Calculation Hook
 * 
 * Computes real-time health indicators based on user profile data:
 * - Load: Daily metabolic and mental load
 * - Fatigue: Energy depletion level
 * - Crash Risk: Burnout risk (future: 7-day moving average)
 * - Stability: System consistency
 * 
 * Returns null if profile is incomplete.
 */

type HealthMetrics = {
  load: number;        // 0-5
  fatigue: number;     // 0-5
  crashRisk: number;   // 0-5
  stability: number;   // 0-5
} | null;

type MetricDetails = {
  title: string;
  value: number | "?";
  description: string;
  helpText: string;
};

// Helper: clamp value between min and max
function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

// Helper: round to nearest integer
function round(value: number): number {
  return Math.round(value);
}

/**
 * Check if profile has minimum required fields
 */
function isProfileComplete(profile: Partial<ProfileFormData> | null): boolean {
  if (!profile) return false;
  
  const required = [
    profile.heightCm,
    profile.weightKg,
    profile.age,
    profile.sleepQuality,
    profile.activityLevel,
  ];
  
  return required.every((field) => field !== "" && field !== undefined && field !== null);
}

/**
 * Calculate BMI score (0-1, higher is better)
 */
function calculateBMIScore(heightCm: number, weightKg: number): number {
  const bmi = weightKg / Math.pow(heightCm / 100, 2);
  // Optimal BMI ~22, score decreases as we deviate
  const score = clamp(1 - Math.abs(bmi - 22) / 10, 0, 1);
  return score;
}

/**
 * Convert sleep quality to score (0-1)
 */
function getSleepScore(sleepQuality: string): number {
  const map: Record<string, number> = {
    poor: 0.2,
    average: 0.6,
    good: 1.0,
  };
  return map[sleepQuality] || 0.6;
}

/**
 * Convert activity level to score (0-1)
 */
function getActivityScore(activityLevel: string): number {
  const map: Record<string, number> = {
    low: 0.3,
    moderate: 0.7,
    high: 1.0,
  };
  return map[activityLevel] || 0.7;
}

/**
 * Convert stress level to score (0-1, inverted)
 * stressLevel is 1-5, we normalize to 0-1 and invert
 */
function getStressScore(stressLevel: number): number {
  // Convert 1-5 to 0-100 then invert
  const normalized = ((stressLevel - 1) / 4) * 100;
  return 1 - normalized / 100;
}

/**
 * Get smoking penalty (0 = smoker, 1 = non-smoker)
 */
function getSmokingScore(smoking: boolean): number {
  return smoking ? 0 : 1;
}

/**
 * Age adjustment factor
 */
function getAgeFactor(age: number): number {
  if (age < 25) return 1;
  if (age < 40) return 0.95;
  if (age < 55) return 0.9;
  return 0.85;
}

/**
 * Main calculation function
 */
export function calculateHealthMetrics(profile: Partial<ProfileFormData> | null): HealthMetrics {
  if (!isProfileComplete(profile)) {
    return null;
  }

  // Type assertion after validation
  const p = profile as ProfileFormData;

  // Calculate component scores
  const bmiScore = calculateBMIScore(p.heightCm as number, p.weightKg as number);
  const sleepScore = getSleepScore(p.sleepQuality as string);
  const activityScore = getActivityScore(p.activityLevel as string);
  const stressScore = getStressScore(p.stressLevel);
  const smokingScore = getSmokingScore(p.smoking);
  const ageFactor = getAgeFactor(p.age as number);

  // 1. LOAD (daily metabolic and mental load)
  const loadRaw =
    (1 - sleepScore) * 0.35 +
    (1 - stressScore) * 0.35 +
    activityScore * 0.2 +
    (1 - bmiScore) * 0.1;
  const load = round(loadRaw * 5);

  // 2. FATIGUE (energy depletion)
  const fatigueRaw =
    (1 - sleepScore) * 0.5 +
    (1 - stressScore) * 0.3 +
    loadRaw * 0.2;
  const fatigue = round(fatigueRaw * 5);

  // 3. CRASH RISK (burnout risk)
  // For now, without historical data, use current state + age factor
  // Future: use 7-day moving average
  const crashRaw =
    loadRaw * 0.4 +
    fatigueRaw * 0.4 +
    (1 - smokingScore) * 0.2;
  const crashRisk = round(crashRaw * 5 * ageFactor);

  // 4. STABILITY (system consistency)
  // Without historical data, base on current balance
  // Future: calculate from standard deviation of 7-day metrics
  const stabilityRaw =
    sleepScore * 0.3 +
    stressScore * 0.3 +
    bmiScore * 0.2 +
    smokingScore * 0.2;
  const stability = round(stabilityRaw * 5);

  return {
    load: clamp(load, 0, 5),
    fatigue: clamp(fatigue, 0, 5),
    crashRisk: clamp(crashRisk, 0, 5),
    stability: clamp(stability, 0, 5),
  };
}

/**
 * Generate metric descriptions based on values
 */
function getMetricDescription(metric: string, value: number): string {
  const descriptions: Record<string, Record<string, string>> = {
    load: {
      low: "Your metabolic and mental load is low. Good balance maintained.",
      moderate: "Your metabolic and mental load today is moderate. Sustained high load over time may increase risk.",
      high: "Your load is elevated. Consider rest and recovery strategies.",
    },
    fatigue: {
      low: "Energy levels are strong. Keep up your current routine.",
      moderate: "Energy levels are slightly reduced. Pay attention to sleep and recovery.",
      high: "Significant fatigue detected. Prioritize rest and stress management.",
    },
    crashRisk: {
      low: "Low immediate burnout risk. Maintain current balance.",
      moderate: "Moderate burnout risk. Monitor stress and recovery patterns.",
      high: "Elevated burnout risk. Consider lifestyle adjustments and seek support.",
    },
    stability: {
      low: "System stability needs attention. Focus on consistency in sleep and routine.",
      moderate: "Moderate stability. Small improvements can make a big difference.",
      high: "Overall system stability is strong. Consistency is working in your favor.",
    },
  };

  const level = value <= 1 ? "low" : value <= 3 ? "moderate" : "high";
  return descriptions[metric]?.[level] || "";
}

/**
 * Main hook
 */
export function useHealthMetrics(profile: Partial<ProfileFormData> | null): MetricDetails[] {
  const metrics = useMemo(() => calculateHealthMetrics(profile), [profile]);

  return useMemo(() => {
    if (!metrics) {
      // Profile incomplete - show placeholders
      return [
        {
          title: "Load",
          value: "?" as const,
          description: "Complete your profile to see your daily metabolic and mental load.",
          helpText: "Based on sleep, stress, activity, and BMI",
        },
        {
          title: "Fatigue",
          value: "?" as const,
          description: "Complete your profile to see your energy depletion level.",
          helpText: "Based on sleep quality and stress levels",
        },
        {
          title: "Crash Risk",
          value: "?" as const,
          description: "Complete your profile to see your burnout risk assessment.",
          helpText: "Based on load, fatigue, and lifestyle factors",
        },
        {
          title: "Stability",
          value: "?" as const,
          description: "Complete your profile to see your system consistency score.",
          helpText: "Based on overall balance and healthy habits",
        },
      ];
    }

    // Profile complete - calculate real metrics
    return [
      {
        title: "Load",
        value: metrics.load,
        description: getMetricDescription("load", metrics.load),
        helpText: "Based on sleep, stress, activity, and BMI",
      },
      {
        title: "Fatigue",
        value: metrics.fatigue,
        description: getMetricDescription("fatigue", metrics.fatigue),
        helpText: "Based on sleep quality and stress levels",
      },
      {
        title: "Crash Risk",
        value: metrics.crashRisk,
        description: getMetricDescription("crashRisk", metrics.crashRisk),
        helpText: "Based on load, fatigue, and lifestyle factors",
      },
      {
        title: "Stability",
        value: metrics.stability,
        description: getMetricDescription("stability", metrics.stability),
        helpText: "Based on overall balance and healthy habits",
      },
    ];
  }, [metrics]);
}
