// src/popup/components/main/SettingsPanel.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { useAccessibilityStore } from "../../../shared/store";
import { ExtensionLayout } from "../layout/ExtensionLayout";

export function SettingsPanel() {
  const { userProfile, setUserProfile, setAppState } = useAccessibilityStore();
  const [autoApply, setAutoApply] = React.useState(
    userProfile?.autoApply ?? true
  );
  const [aiLearning, setAiLearning] = React.useState(
    userProfile?.aiLearning ?? true
  );
  const [fontSize, setFontSize] = React.useState([
    userProfile?.fontSize === "xl"
      ? 8
      : userProfile?.fontSize === "large"
      ? 4
      : 0
  ]);
  const [motionSensitive, setMotionSensitive] = React.useState(
    userProfile?.motionSensitive ?? false
  );
  const [screenReader, setScreenReader] = React.useState(
    userProfile?.screenReader ?? false
  );

  const handleSave = () => {
    if (userProfile) {
      const updatedProfile = {
        ...userProfile,
        autoApply,
        aiLearning,
        motionSensitive,
        screenReader,
        fontSize: fontSize[0] > 6 ? "xl" : fontSize[0] > 2 ? "large" : "normal"
      };
      setUserProfile(updatedProfile);
      chrome.storage.local.set({ userProfile: updatedProfile });
      setAppState("default");
    }
  };

  const handleReset = () => {
    setAutoApply(true);
    setAiLearning(true);
    setFontSize([0]);
    setMotionSensitive(false);
    setScreenReader(false);
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
        {/* Accessibility Profile */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-4">
            Your Accessibility Profile
          </h3>

          {/* Font Size */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium">Default Text Size</span>
              <Badge variant="secondary" className="bg-slate-700 text-blue-400">
                {fontSize[0] === 0 ? "Normal" : `+${fontSize[0]}px`}
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

          {/* Settings Toggles */}
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
                  Let AI learn from your feedback to improve suggestions
                </div>
              </div>
              <Switch checked={aiLearning} onCheckedChange={setAiLearning} />
            </div>

            <div className="flex items-center justify-between py-3 border-b border-slate-700">
              <div>
                <div className="font-medium text-sm">Screen reader support</div>
                <div className="text-xs text-slate-400">
                  Add ARIA labels to unlabeled elements
                </div>
              </div>
              <Switch
                checked={screenReader}
                onCheckedChange={setScreenReader}
              />
            </div>

            <div className="flex items-center justify-between py-3 border-b border-slate-700">
              <div>
                <div className="font-medium text-sm">Reduce motion</div>
                <div className="text-xs text-slate-400">
                  Minimize animations and transitions
                </div>
              </div>
              <Switch
                checked={motionSensitive}
                onCheckedChange={setMotionSensitive}
              />
            </div>
          </div>
        </div>

        {/* Data & Privacy */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3">
            Data & Privacy
          </h3>
          <div className="bg-slate-800 border border-slate-600 rounded-lg p-4 text-sm text-slate-300">
            <div className="flex items-start gap-3">
              <span className="text-blue-400 mt-0.5">🔒</span>
              <div>
                <div className="font-medium mb-1">Your data stays private</div>
                <div className="text-xs text-slate-400">
                  All settings are stored locally. AI feedback is anonymized and
                  used only to improve the extension.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Usage Stats */}
        {userProfile && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3">
              Usage Stats
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-800 rounded-lg p-3 text-center">
                <div className="text-base font-semibold text-blue-400">42</div>
                <div className="text-xs text-slate-400">Pages Improved</div>
              </div>
              <div className="bg-slate-800 rounded-lg p-3 text-center">
                <div className="text-base font-semibold text-green-400">
                  156
                </div>
                <div className="text-xs text-slate-400">Issues Fixed</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-5 mt-auto space-y-2">
        <Button
          onClick={handleSave}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
        >
          Save Changes
        </Button>
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={handleReset}
            variant="outline"
            className="border-slate-600 text-slate-400 hover:text-white hover:bg-slate-700"
          >
            Reset Profile
          </Button>
          <Button
            onClick={() => setAppState("onboarding-welcome")}
            variant="outline"
            className="border-slate-600 text-slate-400 hover:text-white hover:bg-slate-700"
          >
            Re-setup
          </Button>
        </div>
      </div>
    </ExtensionLayout>
  );
}
