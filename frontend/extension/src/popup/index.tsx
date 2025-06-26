// src/popup/index.tsx - Proper TailwindCSS + Zustand Version
import React from "react";
import { createRoot } from "react-dom/client";
import { useAccessibilityStore } from "../shared/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import "../styles/globals.css";

// Types
interface UserProfile {
  id: string;
  fontSize: "normal" | "large" | "xl";
  contrast: "normal" | "high" | "very_high";
  motionSensitive: boolean;
  screenReader: boolean;
  autoApply: boolean;
  aiLearning: boolean;
  createdAt: string;
}

interface AccessibilityIssue {
  type: "font-size" | "contrast" | "click-targets" | "aria-labels";
  severity: "low" | "medium" | "high";
  description: string;
  count: number;
}

interface AppliedChange {
  id: string;
  type: string;
  description: string;
  cssRule?: string;
  ariaFix?: any;
  appliedAt: string;
}

function App() {
  const {
    appState,
    userProfile,
    detectedIssues,
    appliedChanges,
    customFeedback,
    isProcessing,
    setAppState,
    setUserProfile,
    setDetectedIssues,
    setAppliedChanges,
    setCustomFeedback,
    setIsProcessing,
    initializeApp,
    scanForIssues,
    handleCompleteOnboarding,
    handleQuickFix,
    handleCustomFeedback
  } = useAccessibilityStore();

  React.useEffect(() => {
    initializeApp();
  }, [initializeApp]);

  // Render different states
  switch (appState) {
    case "onboarding-welcome":
      return <OnboardingWelcome />;
    case "onboarding-assessment":
      return <OnboardingAssessment />;
    case "onboarding-fine-tuning":
      return <OnboardingFineTuning />;
    case "onboarding-live-preview":
      return <OnboardingLivePreview />;
    case "onboarding-success":
      return <OnboardingSuccess />;
    case "default":
      return <DefaultState />;
    case "issues-detected":
      return <IssuesDetected />;
    case "custom-input":
      return <CustomInput />;
    case "loading":
      return <LoadingState />;
    case "changes-applied":
      return <ChangesApplied />;
    case "settings":
      return <SettingsPanel />;
    default:
      return <DefaultState />;
  }
}

// Base Layout Component
function ExtensionLayout({
  children,
  header,
  onClose
}: {
  children: React.ReactNode;
  header: React.ReactNode;
  onClose?: () => void;
}) {
  return (
    <div className="w-[420px] h-[600px] bg-slate-900 text-white flex flex-col rounded-xl border-2 border-slate-700 overflow-hidden">
      <div className="flex justify-between items-center p-5 border-b border-slate-700 bg-slate-900">
        {header}
        {onClose && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-7 w-7 p-0 text-slate-400 hover:text-white hover:bg-slate-700"
          >
            ×
          </Button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}

// Individual Components with TailwindCSS

function OnboardingWelcome() {
  const { setAppState } = useAccessibilityStore();

  return (
    <ExtensionLayout
      header={
        <div className="flex items-center gap-3">
          <span className="text-2xl">🎯</span>
          <span className="text-lg font-semibold text-blue-400">
            AI Accessibility
          </span>
        </div>
      }
    >
      <div className="flex flex-col h-full">
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="text-6xl mb-5">🎯</div>
          <h1 className="text-2xl font-bold mb-3 text-white">
            AI Accessibility
          </h1>
          <p className="text-slate-400 text-base mb-10 leading-relaxed">
            Make every website easier to use with AI-powered fixes
          </p>

          <Card className="bg-slate-800 border-slate-600 mb-10 w-full">
            <CardContent className="p-5">
              <div className="space-y-3 text-left">
                {[
                  {
                    emoji: "⚡",
                    text: "Automatically adjusts text size & contrast"
                  },
                  { emoji: "🎯", text: "Makes buttons easier to click" },
                  { emoji: "🤖", text: "Fixes accessibility issues with AI" },
                  { emoji: "🌐", text: "Works on every website you visit" }
                ].map((prop, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 text-sm text-slate-300"
                  >
                    <span className="text-lg">{prop.emoji}</span>
                    <span>{prop.text}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="bg-blue-900/50 border border-blue-800 rounded-lg p-4 text-blue-400 text-sm mb-10">
            💡 Setup takes 60 seconds and makes browsing much easier!
          </div>
        </div>

        <div className="p-5 space-y-2">
          <Button
            onClick={() => setAppState("onboarding-assessment")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4"
          >
            Let's Set It Up
          </Button>
          <Button
            variant="outline"
            className="w-full border-slate-600 text-slate-400 hover:text-white hover:bg-slate-700"
          >
            Skip - Try Basic Mode
          </Button>
        </div>
      </div>
    </ExtensionLayout>
  );
}

function OnboardingAssessment() {
  const { setAppState } = useAccessibilityStore();
  const [selectedNeeds, setSelectedNeeds] = React.useState<string[]>([
    "bigger-text",
    "better-contrast"
  ]);

  const needs = [
    { id: "bigger-text", emoji: "👁", label: "Bigger text" },
    { id: "better-contrast", emoji: "🎨", label: "Better contrast" },
    { id: "larger-buttons", emoji: "🖱", label: "Larger buttons" },
    { id: "screen-reader", emoji: "🔊", label: "Screen reader" },
    { id: "less-animation", emoji: "🎭", label: "Less animation" },
    { id: "keyboard-only", emoji: "⌨️", label: "Keyboard only" }
  ];

  const toggleNeed = (needId: string) => {
    setSelectedNeeds((prev) =>
      prev.includes(needId)
        ? prev.filter((id) => id !== needId)
        : [...prev, needId]
    );
  };

  return (
    <ExtensionLayout
      header={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <span className="text-xl">🎯</span>
            <span className="font-semibold text-blue-400">Quick Setup</span>
          </div>
          <div className="flex gap-1.5">
            <div className="w-2 h-2 rounded-full bg-blue-400"></div>
            <div className="w-2 h-2 rounded-full bg-slate-600"></div>
            <div className="w-2 h-2 rounded-full bg-slate-600"></div>
          </div>
        </div>
      }
    >
      <div className="p-5">
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wide text-center mb-4">
            Which of these do you usually need?
          </h2>
          <div className="grid grid-cols-2 gap-2.5">
            {needs.map((need) => (
              <Card
                key={need.id}
                className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                  selectedNeeds.includes(need.id)
                    ? "bg-blue-900 border-blue-400 text-blue-400"
                    : "bg-slate-700 border-slate-600 hover:border-blue-400"
                }`}
                onClick={() => toggleNeed(need.id)}
              >
                <CardContent className="p-4 flex flex-col items-center justify-center text-center min-h-[90px]">
                  <div className="text-2xl mb-2">{need.emoji}</div>
                  <div className="text-sm font-medium">{need.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="bg-blue-900/50 border border-blue-800 rounded-lg p-4 text-blue-400 text-sm text-center mt-4">
            Select all that apply • You can change these later
          </div>
        </div>
      </div>

      <div className="p-5 space-y-2 mt-auto">
        <Button
          onClick={() => setAppState("onboarding-fine-tuning")}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
        >
          Continue
        </Button>
        <Button
          onClick={() => setAppState("onboarding-welcome")}
          variant="outline"
          className="w-full border-slate-600 text-slate-400 hover:text-white hover:bg-slate-700"
        >
          ← Back
        </Button>
      </div>
    </ExtensionLayout>
  );
}

function OnboardingFineTuning() {
  const { setAppState, handleCompleteOnboarding } = useAccessibilityStore();
  const [fontSize, setFontSize] = React.useState([4]);
  const [contrast, setContrast] = React.useState([80]);

  const handleComplete = () => {
    const profile: UserProfile = {
      id: crypto.randomUUID(),
      fontSize: fontSize[0] > 6 ? "xl" : fontSize[0] > 2 ? "large" : "normal",
      contrast: contrast[0] > 60 ? "high" : "normal",
      motionSensitive: false,
      screenReader: false,
      autoApply: true,
      aiLearning: true,
      createdAt: new Date().toISOString()
    };
    handleCompleteOnboarding(profile);
  };

  return (
    <ExtensionLayout
      header={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <span className="text-xl">🎛</span>
            <span className="font-semibold text-blue-400">Adjust Settings</span>
          </div>
          <div className="flex gap-1.5">
            <div className="w-2 h-2 rounded-full bg-blue-400"></div>
            <div className="w-2 h-2 rounded-full bg-blue-400"></div>
            <div className="w-2 h-2 rounded-full bg-slate-600"></div>
          </div>
        </div>
      }
    >
      <div className="p-5">
        <div className="space-y-6">
          {/* Font Size Slider */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium">Text Size</span>
              <Badge variant="secondary" className="bg-slate-700 text-blue-400">
                +{fontSize[0]}px
              </Badge>
            </div>
            <Slider
              value={fontSize}
              onValueChange={setFontSize}
              max={12}
              step={1}
              className="w-full"
            />
          </div>

          {/* Contrast Slider */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium">Contrast Level</span>
              <Badge variant="secondary" className="bg-slate-700 text-blue-400">
                {contrast[0] > 60 ? "High" : "Normal"}
              </Badge>
            </div>
            <Slider
              value={contrast}
              onValueChange={setContrast}
              max={100}
              step={10}
              className="w-full"
            />
          </div>

          {/* Live Preview */}
          <Card className="bg-slate-800 border-slate-600">
            <CardContent className="p-4">
              <div className="text-xs text-slate-400 uppercase tracking-wide mb-2">
                Live Preview
              </div>
              <div className="text-xs text-slate-400 opacity-60 mb-3">
                Before: This text might be hard to read for some users
              </div>
              <div
                className="text-white font-semibold"
                style={{ fontSize: `${14 + fontSize[0]}px` }}
              >
                After: This text is much clearer and easier to see!
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="p-5 space-y-2 mt-auto">
        <Button
          onClick={handleComplete}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
        >
          Perfect!
        </Button>
        <Button
          onClick={() => setAppState("onboarding-assessment")}
          variant="outline"
          className="w-full border-slate-600 text-slate-400 hover:text-white hover:bg-slate-700"
        >
          ← Back to Selection
        </Button>
      </div>
    </ExtensionLayout>
  );
}

function IssuesDetected() {
  const { detectedIssues, handleQuickFix, setAppState } =
    useAccessibilityStore();

  return (
    <ExtensionLayout
      header={
        <div className="flex items-center gap-3">
          <span className="text-xl">⚠️</span>
          <span className="font-semibold text-orange-400">Issues Found</span>
        </div>
      }
      onClose={() => setAppState("default")}
    >
      <div className="p-5">
        {/* Page Status */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3">
            Page Status
          </h3>
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-3 bg-green-900/30 border-l-4 border-green-500 rounded text-green-400 text-sm">
              <span>✓</span>
              <span>Your profile applied</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-orange-900/30 border-l-4 border-orange-500 rounded text-orange-400 text-sm">
              <span>⚠</span>
              <span>{detectedIssues.length} accessibility issues detected</span>
            </div>
          </div>
        </div>

        {/* Quick Fixes */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3">
            Quick Fixes
          </h3>
          <div className="space-y-2.5">
            <Button
              onClick={() => handleQuickFix("all")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold justify-start gap-3 h-14"
            >
              <span className="text-lg">⚡</span>
              <span>Fix All Issues Now</span>
            </Button>

            <Button
              onClick={() => handleQuickFix("font-size")}
              variant="outline"
              className="w-full border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700 justify-start gap-3 h-12"
            >
              <span className="text-base">👁</span>
              <span>Make Text Bigger</span>
            </Button>

            <Button
              onClick={() => handleQuickFix("contrast")}
              variant="outline"
              className="w-full border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700 justify-start gap-3 h-12"
            >
              <span className="text-base">🎨</span>
              <span>Improve Contrast</span>
            </Button>

            <Button
              onClick={() => handleQuickFix("click-targets")}
              variant="outline"
              className="w-full border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700 justify-start gap-3 h-12"
            >
              <span className="text-base">🖱</span>
              <span>Bigger Click Targets</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="p-5 mt-auto">
        <Button
          onClick={() => setAppState("custom-input")}
          variant="outline"
          className="w-full border-slate-600 text-slate-400 hover:text-white hover:bg-slate-700"
        >
          Custom Fix
        </Button>
      </div>
    </ExtensionLayout>
  );
}

function CustomInput() {
  const {
    customFeedback,
    setCustomFeedback,
    handleCustomFeedback,
    setAppState,
    isProcessing
  } = useAccessibilityStore();

  return (
    <ExtensionLayout
      header={
        <div className="flex items-center gap-3">
          <span className="text-xl">💬</span>
          <span className="font-semibold text-blue-400">
            Describe the Problem
          </span>
        </div>
      }
      onClose={() => setAppState("issues-detected")}
    >
      <div className="p-5">
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3">
            What's bothering you?
          </h3>
          <Textarea
            value={customFeedback}
            onChange={(e) => setCustomFeedback(e.target.value)}
            placeholder="Example: 'The checkout button is almost invisible' or 'Menu text is too small' or 'This page hurts my eyes'"
            className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400 min-h-[100px] resize-none"
            disabled={isProcessing}
          />
        </div>
      </div>

      <div className="p-5 mt-auto">
        <Button
          onClick={handleCustomFeedback}
          disabled={!customFeedback.trim() || isProcessing}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold disabled:opacity-50"
        >
          Generate Fix
        </Button>
      </div>
    </ExtensionLayout>
  );
}

function LoadingState() {
  return (
    <ExtensionLayout
      header={
        <div className="flex items-center gap-3">
          <span className="text-xl">🧠</span>
          <span className="font-semibold text-blue-400">AI is thinking...</span>
        </div>
      }
    >
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-10 h-10 border-3 border-slate-600 border-t-blue-400 rounded-full animate-spin mb-4"></div>
        <div className="text-base text-blue-400 mb-2 text-center">
          Analyzing this page
        </div>
        <div className="text-sm text-slate-400 text-center">
          Finding accessibility issues and generating fixes...
        </div>

        <div className="bg-blue-900/50 border border-blue-800 rounded-lg p-4 text-blue-400 text-sm text-center mt-5">
          💡 Our AI is examining the page structure, your preferences, and
          generating custom CSS fixes.
        </div>
      </div>
    </ExtensionLayout>
  );
}

function ChangesApplied() {
  const { appliedChanges, setAppState, setAppliedChanges } =
    useAccessibilityStore();

  const handleUndoAll = () => {
    setAppliedChanges([]);
    setAppState("issues-detected");
  };

  return (
    <ExtensionLayout
      header={
        <div className="flex items-center gap-3">
          <span className="text-xl">✨</span>
          <span className="font-semibold text-green-400">Changes Applied</span>
        </div>
      }
      onClose={() => setAppState("default")}
    >
      <div className="p-5">
        <div className="bg-green-900/30 border border-green-600 rounded-lg p-4 text-green-400 text-sm text-center mb-6 font-medium">
          🎉 Great! I've made {appliedChanges.length} improvements to this page.
        </div>

        {/* What Changed */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3">
            What Changed
          </h3>
          <div className="space-y-2">
            {appliedChanges.map((change) => (
              <div
                key={change.id}
                className="flex items-center justify-between p-3 bg-slate-800 rounded-lg"
              >
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-green-400">✓</span>
                  <span>{change.description}</span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-slate-600 text-slate-400 hover:text-white hover:bg-slate-700 text-xs px-3 py-1"
                >
                  Undo
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Save Changes */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3">
            Save These Changes?
          </h3>
          <div className="space-y-2.5">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold justify-start gap-3 h-12">
              <span className="text-base">🌐</span>
              <span>Use on All Websites</span>
            </Button>
            <Button
              variant="outline"
              className="w-full border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700 justify-start gap-3 h-12"
            >
              <span className="text-base">🏠</span>
              <span>Only This Website</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="p-5 mt-auto">
        <Button
          onClick={handleUndoAll}
          variant="destructive"
          className="w-full bg-red-600 hover:bg-red-700"
        >
          Undo All
        </Button>
      </div>
    </ExtensionLayout>
  );
}

function SettingsPanel() {
  const { userProfile, setUserProfile, setAppState } = useAccessibilityStore();
  const [autoApply, setAutoApply] = React.useState(
    userProfile?.autoApply ?? true
  );
  const [aiLearning, setAiLearning] = React.useState(
    userProfile?.aiLearning ?? true
  );

  const handleSave = () => {
    if (userProfile) {
      const updatedProfile = { ...userProfile, autoApply, aiLearning };
      setUserProfile(updatedProfile);
      chrome.storage.local.set({ userProfile: updatedProfile });
      setAppState("default");
    }
  };

  return (
    <ExtensionLayout
      header={
        <div className="flex items-center gap-3">
          <span className="text-xl">⚙️</span>
          <span className="font-semibold text-blue-400">Settings</span>
        </div>
      }
      onClose={() => setAppState("default")}
    >
      <div className="p-5">
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-4">
            Your Accessibility Profile
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-slate-700">
              <div>
                <div className="font-medium text-sm">
                  Auto-apply on all websites
                </div>
                <div className="text-xs text-slate-400">
                  Automatically improve every page you visit
                </div>
              </div>
              <Switch checked={autoApply} onCheckedChange={setAutoApply} />
            </div>

            <div className="flex items-center justify-between py-3 border-b border-slate-700">
              <div>
                <div className="font-medium text-sm">AI learning mode</div>
                <div className="text-xs text-slate-400">
                  Let AI learn from your feedback
                </div>
              </div>
              <Switch checked={aiLearning} onCheckedChange={setAiLearning} />
            </div>
          </div>
        </div>
      </div>

      <div className="p-5 mt-auto space-y-2">
        <Button
          onClick={handleSave}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
        >
          Save Changes
        </Button>
        <Button
          variant="outline"
          className="w-full border-slate-600 text-slate-400 hover:text-white hover:bg-slate-700"
        >
          Reset Profile
        </Button>
      </div>
    </ExtensionLayout>
  );
}

// Default and other states (simplified for brevity)
function DefaultState() {
  const { userProfile, setAppState } = useAccessibilityStore();

  return (
    <ExtensionLayout
      header={
        <div className="flex items-center gap-3">
          <span className="text-xl">🤖</span>
          <span className="font-semibold text-blue-400">AI Accessibility</span>
        </div>
      }
      onClose={() => setAppState("settings")}
    >
      <div className="p-5">
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3">
            Page Status
          </h3>
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-3 bg-green-900/30 border-l-4 border-green-500 rounded text-green-400 text-sm">
              <span>✓</span>
              <span>Your profile applied automatically</span>
            </div>
          </div>
        </div>

        <div className="space-y-2.5">
          <Button
            onClick={() => setAppState("issues-detected")}
            variant="outline"
            className="w-full border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700 justify-start gap-3 h-12"
          >
            <span className="text-base">🔍</span>
            <span>Scan for More Issues</span>
          </Button>

          <Button
            onClick={() => setAppState("custom-input")}
            variant="outline"
            className="w-full border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700 justify-start gap-3 h-12"
          >
            <span className="text-base">💬</span>
            <span>Something Still Bothering You?</span>
          </Button>
        </div>
      </div>
    </ExtensionLayout>
  );
}

// Placeholder components for other states
function OnboardingLivePreview() {
  return <div className="text-center p-8">Loading preview...</div>;
}

function OnboardingSuccess() {
  return <div className="text-center p-8">Success!</div>;
}

// Initialize the app
const container = document.getElementById("popup-root");
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
