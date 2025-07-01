// src/popup/components/onboarding/OnboardingLivePreview.tsx
import React from "react";
import { ExtensionLayout } from "../layout/ExtensionLayout";

export function OnboardingLivePreview() {
  return (
    <ExtensionLayout
      header={
        <div className="flex items-center gap-3">
          <span className="text-xl">✨</span>
          <span className="font-semibold text-blue-400">Live Preview</span>
        </div>
      }
    >
      <div className="flex-1 flex flex-col items-center justify-center p-3">
        <div className="w-10 h-10 border-3 border-slate-600 border-t-blue-400 rounded-full animate-spin mb-4"></div>
        <div className="text-base text-blue-400 mb-2 text-center">
          Applying your settings
        </div>
        <div className="text-sm text-slate-400 text-center">
          Testing improvements on this page...
        </div>
      </div>
    </ExtensionLayout>
  );
}
