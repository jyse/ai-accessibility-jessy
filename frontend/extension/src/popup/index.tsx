// src/popup/index.tsx - Clean main app logic
import React from "react";
import { createRoot } from "react-dom/client";
import { useAccessibilityStore } from "../shared/store";
import "../styles/globals.css";
import { TestComponent } from "./components/TestComponent";

// Import all components
import { OnboardingWelcome } from "./components/onboarding/OnboardingWelcome";
import { OnboardingAssessment } from "./components/onboarding/OnboardingAssessment";
import { OnboardingFineTuning } from "./components/onboarding/OnboardingFineTuning";
import { OnboardingLivePreview } from "./components/onboarding/OnboardingLivePreview";
import { OnboardingSuccess } from "./components/onboarding/OnboardingSuccess";
import { DefaultState } from "./components/main/DefaultState";
import { IssuesDetected } from "./components/main/IssuesDetected";
import { CustomInput } from "./components/main/CustomInput";
import { LoadingState } from "./components/main/LoadingState";
import { ChangesApplied } from "./components/main/ChangesApplied";
import { SettingsPanel } from "./components/main/SettingsPanel";

function App() {
  const { appState, initializeApp } = useAccessibilityStore();

  React.useEffect(() => {
    initializeApp();
  }, [initializeApp]);

  return <TestComponent />;
  // Simple state routing - much cleaner!
  // switch (appState) {
  //   case "onboarding-welcome":
  //     return <OnboardingWelcome />;
  //   case "onboarding-assessment":
  //     return <OnboardingAssessment />;
  //   case "onboarding-fine-tuning":
  //     return <OnboardingFineTuning />;
  //   case "onboarding-live-preview":
  //     return <OnboardingLivePreview />;
  //   case "onboarding-success":
  //     return <OnboardingSuccess />;
  //   case "default":
  //     return <DefaultState />;
  //   case "issues-detected":
  //     return <IssuesDetected />;
  //   case "custom-input":
  //     return <CustomInput />;
  //   case "loading":
  //     return <LoadingState />;
  //   case "changes-applied":
  //     return <ChangesApplied />;
  //   case "settings":
  //     return <SettingsPanel />;
  //   default:
  //     return <DefaultState />;
}

// Initialize the app
const container = document.getElementById("popup-root");
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
