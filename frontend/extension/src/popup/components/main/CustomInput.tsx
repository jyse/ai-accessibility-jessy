// src/popup/components/main/CustomInput.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAccessibilityStore } from "../../../shared/store";
import { ExtensionLayout } from "../layout/ExtensionLayout";

export function CustomInput() {
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

          <div className="mt-3 text-xs text-slate-400">
            💡 Tip: Be specific about what's hard to see, read, or click. The
            more details you give, the better I can help!
          </div>
        </div>

        {/* Quick Examples */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3">
            Quick Examples
          </h3>
          <div className="space-y-2">
            {[
              "The menu text is too small to read",
              "Submit button has poor contrast",
              "Links are hard to distinguish from text",
              "Page has too much visual clutter"
            ].map((example, index) => (
              <button
                key={index}
                onClick={() => setCustomFeedback(example)}
                className="w-full text-left p-3 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-slate-300 transition-colors"
                disabled={isProcessing}
              >
                "{example}"
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-5 mt-auto space-y-2">
        <Button
          onClick={handleCustomFeedback}
          disabled={!customFeedback.trim() || isProcessing}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold disabled:opacity-50"
        >
          {isProcessing ? "Generating Fix..." : "Generate Fix"}
        </Button>
        <Button
          onClick={() => setAppState("issues-detected")}
          variant="outline"
          className="w-full border-slate-600 text-slate-400 hover:text-white hover:bg-slate-700"
          disabled={isProcessing}
        >
          ← Back to Quick Fixes
        </Button>
      </div>
    </ExtensionLayout>
  );
}
