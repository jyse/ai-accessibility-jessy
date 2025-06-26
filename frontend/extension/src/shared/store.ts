// src/shared/store.ts
import { create } from "zustand";

// Types
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

interface AccessibilityStore {
  // State
  appState: AppState;
  userProfile: UserProfile | null;
  detectedIssues: AccessibilityIssue[];
  appliedChanges: AppliedChange[];
  customFeedback: string;
  isProcessing: boolean;
  onboardingData: {
    selectedNeeds: string[];
    fontSize: number;
    contrast: number;
  };

  // Actions
  setAppState: (state: AppState) => void;
  setUserProfile: (profile: UserProfile | null) => void;
  setDetectedIssues: (issues: AccessibilityIssue[]) => void;
  setAppliedChanges: (changes: AppliedChange[]) => void;
  setCustomFeedback: (feedback: string) => void;
  setIsProcessing: (processing: boolean) => void;
  setOnboardingData: (
    data: Partial<AccessibilityStore["onboardingData"]>
  ) => void;

  // Complex Actions
  initializeApp: () => Promise<void>;
  scanForIssues: () => Promise<void>;
  handleCompleteOnboarding: (profile: UserProfile) => Promise<void>;
  handleQuickFix: (type: string) => Promise<void>;
  handleCustomFeedback: () => Promise<void>;
  resetApp: () => void;
}

export const useAccessibilityStore = create<AccessibilityStore>((set, get) => ({
  // Initial State
  appState: "onboarding-welcome",
  userProfile: null,
  detectedIssues: [],
  appliedChanges: [],
  customFeedback: "",
  isProcessing: false,
  onboardingData: {
    selectedNeeds: [],
    fontSize: 4,
    contrast: 80
  },

  // Simple State Setters
  setAppState: (state) => set({ appState: state }),
  setUserProfile: (profile) => set({ userProfile: profile }),
  setDetectedIssues: (issues) => set({ detectedIssues: issues }),
  setAppliedChanges: (changes) => set({ appliedChanges: changes }),
  setCustomFeedback: (feedback) => set({ customFeedback: feedback }),
  setIsProcessing: (processing) => set({ isProcessing: processing }),
  setOnboardingData: (data) =>
    set((state) => ({
      onboardingData: { ...state.onboardingData, ...data }
    })),

  // Initialize App - Check if user has completed onboarding
  initializeApp: async () => {
    try {
      const result = await chrome.storage.local.get(["userProfile"]);
      if (result.userProfile) {
        set({
          userProfile: result.userProfile,
          appState: "default"
        });
        // Automatically scan for issues
        get().scanForIssues();
      } else {
        set({ appState: "onboarding-welcome" });
      }
    } catch (error) {
      console.error("Failed to initialize app:", error);
      set({ appState: "onboarding-welcome" });
    }
  },

  // Scan current page for accessibility issues
  scanForIssues: async () => {
    try {
      // Get current tab
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true
      });

      if (!tab.id) return;

      // Send message to content script to analyze page
      const pageData = await chrome.tabs.sendMessage(tab.id, {
        action: "scanPage"
      });

      // Mock issues for now - replace with real analysis
      const mockIssues: AccessibilityIssue[] = [
        {
          type: "font-size",
          severity: "medium",
          description: "Small text detected",
          count: 3
        },
        {
          type: "contrast",
          severity: "high",
          description: "Low contrast buttons",
          count: 2
        },
        {
          type: "aria-labels",
          severity: "medium",
          description: "Missing button labels",
          count: 5
        }
      ];

      set({ detectedIssues: mockIssues });

      if (mockIssues.length > 0) {
        set({ appState: "issues-detected" });
      }
    } catch (error) {
      console.error("Failed to scan for issues:", error);
    }
  },

  // Complete onboarding process
  handleCompleteOnboarding: async (profile: UserProfile) => {
    try {
      await chrome.storage.local.set({ userProfile: profile });
      set({
        userProfile: profile,
        appState: "onboarding-live-preview"
      });

      // Simulate applying changes
      setTimeout(() => {
        set({ appState: "onboarding-success" });
      }, 2000);
    } catch (error) {
      console.error("Failed to complete onboarding:", error);
    }
  },

  // Handle quick fix actions
  handleQuickFix: async (type: string) => {
    set({ isProcessing: true, appState: "loading" });

    try {
      // Get current tab
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true
      });

      if (!tab.id) return;

      // Send to AI API for processing (placeholder for now)
      const response = await fetch(
        "http://localhost:3000/api/accessibility/generate-fix",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userProfile: get().userProfile,
            fixType: type,
            pageContext: "placeholder-html-context"
          })
        }
      );

      // Mock response for now
      const mockChanges: AppliedChange[] = [
        {
          id: crypto.randomUUID(),
          type: "font-size",
          description: "Font size increased (+6px)",
          cssRule: "body { font-size: 18px !important; }",
          appliedAt: new Date().toISOString()
        },
        {
          id: crypto.randomUUID(),
          type: "contrast",
          description: "Button contrast improved",
          cssRule:
            "button { background: #000000 !important; color: #ffffff !important; }",
          appliedAt: new Date().toISOString()
        }
      ];

      // Apply CSS changes to page
      await chrome.tabs.sendMessage(tab.id, {
        action: "applyChanges",
        changes: mockChanges
      });

      set({
        appliedChanges: mockChanges,
        isProcessing: false,
        appState: "changes-applied"
      });
    } catch (error) {
      console.error("Failed to apply quick fix:", error);
      set({ isProcessing: false });
    }
  },

  // Handle custom feedback
  handleCustomFeedback: async () => {
    const { customFeedback } = get();
    if (!customFeedback.trim()) return;

    set({ isProcessing: true, appState: "loading" });

    try {
      // Get current tab
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true
      });

      if (!tab.id) return;

      // Send to AI API for processing (placeholder)
      const mockChanges: AppliedChange[] = [
        {
          id: crypto.randomUUID(),
          type: "custom",
          description: "Applied custom accessibility fixes",
          cssRule: "/* Custom CSS based on feedback */",
          appliedAt: new Date().toISOString()
        }
      ];

      // Apply changes
      await chrome.tabs.sendMessage(tab.id, {
        action: "applyChanges",
        changes: mockChanges
      });

      set({
        appliedChanges: mockChanges,
        customFeedback: "",
        isProcessing: false,
        appState: "changes-applied"
      });
    } catch (error) {
      console.error("Failed to process custom feedback:", error);
      set({ isProcessing: false });
    }
  },

  // Reset app to initial state
  resetApp: () => {
    set({
      appState: "onboarding-welcome",
      userProfile: null,
      detectedIssues: [],
      appliedChanges: [],
      customFeedback: "",
      isProcessing: false,
      onboardingData: {
        selectedNeeds: [],
        fontSize: 4,
        contrast: 80
      }
    });
  }
}));
