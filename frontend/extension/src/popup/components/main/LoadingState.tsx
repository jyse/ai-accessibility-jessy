// src/popup/components/main/LoadingState.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { useAccessibilityStore } from "../../../shared/store";
import { ExtensionLayout } from "../layout/ExtensionLayout";

export function LoadingState() {
  const { setIsProcessing, setAppState } = useAccessibilityStore();

  const handleCancel = () => {
    setIsProcessing(false);
    setAppState("issues-detected");
  };

  return (
    <ExtensionLayout
      header={
        <div className="flex items-center gap-3">
          <span className="text-xl">🧠</span>
          <span className="font-semibold text-blue-400">AI is thinking...</span>
        </div>
      }
    >
      <div className="flex-1 flex flex-col items-center justify-center p-3">
        {/* Loading Spinner */}
        <div className="relative mb-6">
          <div className="w-16 h-16 border-4 border-slate-600 border-t-blue-400 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl">🤖</span>
          </div>
        </div>

        {/* Loading Steps */}
        <div className="text-center space-y-3 mb-8">
          <div className="text-base text-blue-400 font-medium">
            Analyzing this page
          </div>
          <div className="text-sm text-slate-400 max-w-sm">
            Finding accessibility issues and generating custom fixes based on
            your preferences...
          </div>
        </div>

        {/* Progress Steps */}
        <div className="w-full max-w-sm space-y-3 mb-8">
          <div className="flex items-center gap-3 text-sm">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <span className="text-slate-300">Scanning page structure</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="w-2 h-2 bg-slate-600 rounded-full"></div>
            <span className="text-slate-500">
              Analyzing accessibility issues
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="w-2 h-2 bg-slate-600 rounded-full"></div>
            <span className="text-slate-500">Generating CSS fixes</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="w-2 h-2 bg-slate-600 rounded-full"></div>
            <span className="text-slate-500">Creating ARIA labels</span>
          </div>
        </div>

        {/* Info Message */}
        <div className="bg-blue-900/50 border border-blue-800 rounded-lg p-4 text-blue-400 text-sm text-center max-w-sm">
          💡 Our AI is examining the page structure, your preferences, and
          generating custom CSS fixes that won't break the website.
        </div>
      </div>

      <div className="p-5">
        <Button
          onClick={handleCancel}
          variant="outline"
          className="w-full border-slate-600 text-slate-400 hover:text-white hover:bg-slate-700"
        >
          Cancel
        </Button>
      </div>
    </ExtensionLayout>
  );
}
