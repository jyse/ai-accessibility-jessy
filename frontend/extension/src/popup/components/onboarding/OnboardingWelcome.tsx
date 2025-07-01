// src/popup/components/onboarding/OnboardingWelcome.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAccessibilityStore } from "../../../shared/store";
import { ExtensionLayout } from "../layout/ExtensionLayout";

export function OnboardingWelcome() {
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
