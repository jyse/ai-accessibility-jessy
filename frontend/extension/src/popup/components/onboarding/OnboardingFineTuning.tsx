// src/popup/components/onboarding/OnboardingFineTuning.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { useAccessibilityStore } from "../../../shared/store";
import { ExtensionLayout } from "../layout/ExtensionLayout";
import { UserProfile } from "../types";

export function OnboardingFineTuning() {
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
        <div className="space-y-3">
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
