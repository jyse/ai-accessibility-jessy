// src/popup/components/main/IssuesDetected.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { useAccessibilityStore } from "../../../shared/store";
import { ExtensionLayout } from "../layout/ExtensionLayout";

export function IssuesDetected() {
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

        {/* Detected Issues List */}
        {detectedIssues.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3">
              Issues Found
            </h3>
            <div className="space-y-2">
              {detectedIssues.map((issue, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-slate-800 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        issue.severity === "high"
                          ? "bg-red-400"
                          : issue.severity === "medium"
                          ? "bg-orange-400"
                          : "bg-yellow-400"
                      }`}
                    ></div>
                    <span className="text-sm">{issue.description}</span>
                  </div>
                  <div className="text-xs text-slate-400">
                    {issue.count} found
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

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
