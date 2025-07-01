// src/popup/components/main/DefaultState.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { useAccessibilityStore } from "../../../shared/store";
import { ExtensionLayout } from "../layout/ExtensionLayout";

export function DefaultState() {
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
            {userProfile && (
              <div className="flex items-center gap-3 p-3 bg-blue-900/30 border-l-4 border-blue-400 rounded text-blue-400 text-sm">
                <span>👁</span>
                <span>
                  Text size:{" "}
                  {userProfile.fontSize === "xl"
                    ? "Extra Large"
                    : userProfile.fontSize === "large"
                    ? "Large"
                    : "Normal"}
                </span>
              </div>
            )}
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
