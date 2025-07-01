// src/popup/components/onboarding/OnboardingSuccess.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { useAccessibilityStore } from "../../../shared/store";
import { ExtensionLayout } from "../layout/ExtensionLayout";

export function OnboardingSuccess() {
  const { setAppState, scanForIssues } = useAccessibilityStore();

  const handleComplete = () => {
    scanForIssues();
    setAppState("default");
  };

  return (
    <ExtensionLayout
      header={
        <div className="flex items-center gap-3">
          <span className="text-xl">🎉</span>
          <span className="font-semibold text-green-400">All Set!</span>
        </div>
      }
    >
      <div className="flex flex-col h-full">
        <div className="flex-1 flex flex-col items-center justify-center p-3 text-center">
          <div className="text-6xl mb-5">🚀</div>
          <h1 className="text-2xl font-bold mb-3 text-white">
            You're all set!
          </h1>
          <p className="text-slate-400 text-base mb-10 leading-relaxed">
            Your settings will now apply to every website automatically.
          </p>

          <div className="bg-green-900/30 border border-green-600 rounded-lg p-4 text-green-400 text-sm text-center mb-10 font-medium">
            🎉 Great! I've applied your preferences to this page. Notice the
            difference?
          </div>

          <div className="bg-slate-800 border-slate-600 rounded-lg p-5 w-full text-left">
            <div className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3">
              When you need help:
            </div>
            <div className="space-y-2 text-sm text-slate-300">
              <div className="flex items-center gap-3">
                <span className="text-base">🔍</span>
                <span>Click this extension icon anytime</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-base">⚡</span>
                <span>Use "Fix All Issues" for quick solutions</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-base">💬</span>
                <span>Describe problems in your own words</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-base">🔄</span>
                <span>Settings sync across all your devices</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-5">
          <Button
            onClick={handleComplete}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4"
          >
            Start Browsing
          </Button>
        </div>
      </div>
    </ExtensionLayout>
  );
}
