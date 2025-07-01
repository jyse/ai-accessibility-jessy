// src/shared/store.ts - Enhanced with site-specific rules
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
  element?: string; // CSS selector
  currentValue?: string;
  suggestedValue?: string;
}

export interface AppliedChange {
  id: string;
  type: string;
  description: string;
  cssRule?: string;
  ariaFix?: any;
  appliedAt: string;
}

// 🆕 NEW: Site-specific rule interface
export interface SiteRule {
  domain: string;
  css: string;
  description: string;
  createdAt: string;
  lastModified: string;
  userGenerated: boolean; // true if user customized, false if AI generated
}

// 🆕 NEW: Enhanced user data structure
export interface UserData {
  profile: UserProfile;
  siteRules: Record<string, SiteRule>; // domain -> rule mapping
  globalCSS: string; // CSS that applies to all sites
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
  | "settings"
  | "scope-choice"; // 🆕 NEW: For "all sites vs this site" choice

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

  // 🆕 NEW: Site-specific state
  currentDomain: string;
  siteRules: Record<string, SiteRule>;
  globalCSS: string;
  pendingChange: AppliedChange | null; // For scope choice dialog

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

  // 🆕 NEW: Site-specific actions
  setCurrentDomain: (domain: string) => void;
  setSiteRules: (rules: Record<string, SiteRule>) => void;
  setGlobalCSS: (css: string) => void;
  setPendingChange: (change: AppliedChange | null) => void;

  // Complex Actions
  initializeApp: () => Promise<void>;
  scanForIssues: () => Promise<void>;
  handleCompleteOnboarding: (profile: UserProfile) => Promise<void>;
  handleQuickFix: (type: string) => Promise<void>;
  handleCustomFeedback: () => Promise<void>;
  resetApp: () => void;

  // 🆕 NEW: Site-specific complex actions
  loadUserData: () => Promise<void>;
  saveUserData: () => Promise<void>;
  applySiteRule: (
    domain: string,
    css: string,
    description: string,
    isGlobal?: boolean
  ) => Promise<void>;
  handleScopeChoice: (
    scope: "global" | "site",
    change: AppliedChange
  ) => Promise<void>;
  getCurrentDomainCSS: () => string;
  generateProfileBasedCSS: () => string;
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

  // 🆕 NEW: Site-specific initial state
  currentDomain: "",
  siteRules: {},
  globalCSS: "",
  pendingChange: null,

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

  // 🆕 NEW: Site-specific setters
  setCurrentDomain: (domain) => set({ currentDomain: domain }),
  setSiteRules: (rules) => set({ siteRules: rules }),
  setGlobalCSS: (css) => set({ globalCSS: css }),
  setPendingChange: (change) => set({ pendingChange: change }),

  // 🆕 NEW: Load all user data from Chrome storage
  loadUserData: async () => {
    try {
      const result = await chrome.storage.local.get(["userData"]);
      if (result.userData) {
        const userData: UserData = result.userData;
        set({
          userProfile: userData.profile,
          siteRules: userData.siteRules || {},
          globalCSS: userData.globalCSS || ""
        });
      }
    } catch (error) {
      console.error("Failed to load user data:", error);
    }
  },

  // 🆕 NEW: Save all user data to Chrome storage
  saveUserData: async () => {
    try {
      const { userProfile, siteRules, globalCSS } = get();
      if (userProfile) {
        const userData: UserData = {
          profile: userProfile,
          siteRules,
          globalCSS
        };
        await chrome.storage.local.set({ userData });
      }
    } catch (error) {
      console.error("Failed to save user data:", error);
    }
  },

  // 🆕 NEW: Apply a site-specific or global rule
  applySiteRule: async (
    domain: string,
    css: string,
    description: string,
    isGlobal = false
  ) => {
    try {
      const { siteRules, globalCSS } = get();

      if (isGlobal) {
        // Add to global CSS
        const newGlobalCSS = globalCSS + "\n" + css;
        set({ globalCSS: newGlobalCSS });
      } else {
        // Add site-specific rule
        const newRule: SiteRule = {
          domain,
          css,
          description,
          createdAt: new Date().toISOString(),
          lastModified: new Date().toISOString(),
          userGenerated: true
        };

        set({
          siteRules: {
            ...siteRules,
            [domain]: newRule
          }
        });
      }

      // Save to storage
      await get().saveUserData();

      // Apply to current page
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true
      });
      if (tab.id) {
        await chrome.tabs.sendMessage(tab.id, {
          action: "applyFixes",
          css: get().getCurrentDomainCSS()
        });
      }
    } catch (error) {
      console.error("Failed to apply site rule:", error);
    }
  },

  // 🆕 NEW: Handle user's choice of scope (all sites vs this site)
  handleScopeChoice: async (
    scope: "global" | "site",
    change: AppliedChange
  ) => {
    try {
      const { currentDomain } = get();
      const isGlobal = scope === "global";

      if (change.cssRule) {
        await get().applySiteRule(
          currentDomain,
          change.cssRule,
          change.description,
          isGlobal
        );
      }

      set({
        pendingChange: null,
        appState: "changes-applied",
        appliedChanges: [change]
      });
    } catch (error) {
      console.error("Failed to handle scope choice:", error);
    }
  },

  // 🆕 NEW: Get all CSS that should apply to current domain
  getCurrentDomainCSS: () => {
    const { globalCSS, siteRules, currentDomain, userProfile } = get();

    let combinedCSS = "";

    // 1. Add profile-based global CSS
    combinedCSS += get().generateProfileBasedCSS();

    // 2. Add user's global CSS
    if (globalCSS) {
      combinedCSS += "\n" + globalCSS;
    }

    // 3. Add site-specific CSS
    if (currentDomain && siteRules[currentDomain]) {
      combinedCSS += "\n" + siteRules[currentDomain].css;
    }

    return combinedCSS;
  },

  // 🆕 NEW: Generate CSS based on user profile
  generateProfileBasedCSS: () => {
    const { userProfile } = get();
    if (!userProfile) return "";

    let css = "";

    // Font size adjustments
    switch (userProfile.fontSize) {
      case "large":
        css +=
          "body, p, span, div, a, button { font-size: 18px !important; line-height: 1.5 !important; }";
        break;
      case "xl":
        css +=
          "body, p, span, div, a, button { font-size: 22px !important; line-height: 1.6 !important; }";
        break;
    }

    // Contrast adjustments
    if (userProfile.contrast === "high") {
      css +=
        "\n* { background-color: white !important; color: black !important; }";
      css +=
        "\na, button { background-color: black !important; color: white !important; }";
    } else if (userProfile.contrast === "very_high") {
      css +=
        "\n* { background-color: white !important; color: black !important; border: 1px solid black !important; }";
      css +=
        "\na, button { background-color: black !important; color: white !important; border: 2px solid white !important; }";
    }

    // Motion sensitivity
    if (userProfile.motionSensitive) {
      css += "\n* { animation: none !important; transition: none !important; }";
    }

    return css;
  },

  // Enhanced Initialize App
  initializeApp: async () => {
    try {
      // Get current domain
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true
      });
      if (tab.url) {
        const domain = new URL(tab.url).hostname;
        set({ currentDomain: domain });
      }

      // Load user data
      await get().loadUserData();

      const { userProfile } = get();
      if (userProfile) {
        set({ appState: "default" });

        // Apply existing CSS rules to current page
        const currentCSS = get().getCurrentDomainCSS();
        if (currentCSS && tab.id) {
          await chrome.tabs.sendMessage(tab.id, {
            action: "applyFixes",
            css: currentCSS
          });
        }

        // Scan for issues
        get().scanForIssues();
      } else {
        set({ appState: "onboarding-welcome" });
      }
    } catch (error) {
      console.error("Failed to initialize app:", error);
      set({ appState: "onboarding-welcome" });
    }
  },

  // Enhanced Scan for Issues - now uses real content script
  scanForIssues: async () => {
    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true
      });

      if (!tab.id) return;

      // Send message to content script to analyze page
      const response = await chrome.tabs.sendMessage(tab.id, {
        action: "scanPage"
      });

      if (response && response.success) {
        // Convert content script issues to store format
        const issues: AccessibilityIssue[] = response.issues.map(
          (issue: any) => ({
            type: issue.type,
            severity: issue.severity,
            description: issue.description,
            count: 1,
            element: issue.element,
            currentValue: issue.currentValue,
            suggestedValue: issue.suggestedValue
          })
        );

        set({ detectedIssues: issues });

        if (issues.length > 0) {
          set({ appState: "issues-detected" });
        }
      }
    } catch (error) {
      console.error("Failed to scan for issues:", error);
      // Fallback to mock data if content script fails
      const mockIssues: AccessibilityIssue[] = [
        {
          type: "font-size",
          severity: "medium",
          description: "Small text detected",
          count: 3
        }
      ];
      set({ detectedIssues: mockIssues });
    }
  },

  // Enhanced Complete Onboarding
  handleCompleteOnboarding: async (profile: UserProfile) => {
    try {
      set({ userProfile: profile });

      // Generate initial global CSS based on profile
      const initialCSS = get().generateProfileBasedCSS();
      set({ globalCSS: initialCSS });

      // Save to storage
      await get().saveUserData();

      set({ appState: "onboarding-live-preview" });

      // Apply initial styling to current page
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true
      });
      if (tab.id && initialCSS) {
        await chrome.tabs.sendMessage(tab.id, {
          action: "applyFixes",
          css: initialCSS
        });
      }

      setTimeout(() => {
        set({ appState: "onboarding-success" });
      }, 2000);
    } catch (error) {
      console.error("Failed to complete onboarding:", error);
    }
  },

  // Enhanced Quick Fix - now shows scope choice
  handleQuickFix: async (type: string) => {
    set({ isProcessing: true, appState: "loading" });

    try {
      const { userProfile, detectedIssues } = get();

      // Generate smart CSS based on detected issues and user profile
      const mockCSS = get().generateMockFix(type, detectedIssues, userProfile);

      const change: AppliedChange = {
        id: crypto.randomUUID(),
        type,
        description: `Applied ${type} fix`,
        cssRule: mockCSS,
        appliedAt: new Date().toISOString()
      };

      // Show scope choice dialog
      set({
        pendingChange: change,
        isProcessing: false,
        appState: "scope-choice"
      });
    } catch (error) {
      console.error("Failed to apply quick fix:", error);
      set({ isProcessing: false });
    }
  },

  // 🆕 NEW: Generate mock AI fix based on issue type and user profile
  generateMockFix: (
    fixType: string,
    issues: AccessibilityIssue[],
    profile: UserProfile | null
  ) => {
    let css = "";

    // Find relevant issues
    const relevantIssues = issues.filter((issue) => issue.type === fixType);

    switch (fixType) {
      case "font-size":
        const fontSize =
          profile?.fontSize === "xl"
            ? "22px"
            : profile?.fontSize === "large"
            ? "18px"
            : "16px";
        css = `p, span, div, a, button, h1, h2, h3, h4, h5, h6 { font-size: ${fontSize} !important; line-height: 1.5 !important; }`;
        break;

      case "contrast":
        if (profile?.contrast === "very_high") {
          css = `* { background-color: white !important; color: black !important; border: 1px solid black !important; }
                 a, button { background-color: black !important; color: white !important; }`;
        } else {
          css = `* { background-color: white !important; color: #333333 !important; }
                 a, button { background-color: #000000 !important; color: white !important; }`;
        }
        break;

      case "click-targets":
        css = `button, a, input[type="button"], input[type="submit"], [onclick] { 
                 min-height: 44px !important; 
                 min-width: 44px !important; 
                 padding: 12px 16px !important; 
               }`;
        break;

      case "aria-labels":
        // For ARIA labels, we'd need to inject attributes, not just CSS
        css = `/* ARIA fixes require JavaScript injection */`;
        break;
    }

    return css;
  },

  // Enhanced Custom Feedback
  handleCustomFeedback: async () => {
    const { customFeedback, userProfile } = get();
    if (!customFeedback.trim()) return;

    set({ isProcessing: true, appState: "loading" });

    try {
      // Generate CSS based on feedback and profile
      const mockCSS = get().generateCustomFeedbackCSS(
        customFeedback,
        userProfile
      );

      const change: AppliedChange = {
        id: crypto.randomUUID(),
        type: "custom",
        description: `Applied custom fix: "${customFeedback}"`,
        cssRule: mockCSS,
        appliedAt: new Date().toISOString()
      };

      // Show scope choice
      set({
        pendingChange: change,
        customFeedback: "",
        isProcessing: false,
        appState: "scope-choice"
      });
    } catch (error) {
      console.error("Failed to process custom feedback:", error);
      set({ isProcessing: false });
    }
  },

  // 🆕 NEW: Generate CSS from custom feedback
  generateCustomFeedbackCSS: (
    feedback: string,
    profile: UserProfile | null
  ) => {
    const lowerFeedback = feedback.toLowerCase();
    let css = "";

    if (lowerFeedback.includes("button") && lowerFeedback.includes("small")) {
      css +=
        "button { min-height: 44px !important; min-width: 44px !important; padding: 12px 16px !important; }";
    }

    if (
      lowerFeedback.includes("text") &&
      (lowerFeedback.includes("small") || lowerFeedback.includes("tiny"))
    ) {
      const fontSize = profile?.fontSize === "xl" ? "22px" : "18px";
      css += `p, span, div, a { font-size: ${fontSize} !important; }`;
    }

    if (
      lowerFeedback.includes("contrast") ||
      lowerFeedback.includes("can't see") ||
      lowerFeedback.includes("hard to read")
    ) {
      css +=
        "* { background-color: white !important; color: black !important; }";
    }

    if (lowerFeedback.includes("click") && lowerFeedback.includes("hard")) {
      css +=
        "a, button, [onclick] { min-height: 44px !important; padding: 12px !important; }";
    }

    return css || "/* Unable to generate specific fix from feedback */";
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
      },
      currentDomain: "",
      siteRules: {},
      globalCSS: "",
      pendingChange: null
    });
  }
}));
