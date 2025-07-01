// src/popup/components/onboarding/OnboardingAssessment.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAccessibilityStore } from "../../../shared/store";
import { ExtensionLayout } from "../layout/ExtensionLayout";

export function OnboardingAssessment() {
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
