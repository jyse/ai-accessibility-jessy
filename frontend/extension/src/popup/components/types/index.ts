// src/popup/components/types/index.ts
export interface UserProfile {
  id: string;
  fontSize: "normal" | "large" | "xl";
  contrast: "normal" | "high" | "very_high";
  motionSensitive: boolean;
  screenReader: boolean;
  autoApply: boolean;
  aiLearning: boolean;
  createdAt: string;
}

export interface AccessibilityIssue {
  type: "font-size" | "contrast" | "click-targets" | "aria-labels";
  severity: "low" | "medium" | "high";
  description: string;
  count: number;
}

export interface AppliedChange {
  id: string;
  type: string;
  description: string;
  cssRule?: string;
  ariaFix?: any;
  appliedAt: string;
}

export type AppState =
  | "onboarding-welcome"
  | "onboarding-assessment"
  | "onboarding-fine-tuning"
  | "onboarding-live-preview"
  | "onboarding-success"
  | "default"
  | "issues-detected"
  | "custom-input"
  | "loading"
  | "changes-applied"
  | "settings";
