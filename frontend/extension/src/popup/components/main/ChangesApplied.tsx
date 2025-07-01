// src/popup/components/main/ChangesApplied.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { useAccessibilityStore } from "../../../shared/store";
import { ExtensionLayout } from "../layout/ExtensionLayout";

export function ChangesApplied() {
  const { appliedChanges, setAppState, setAppliedChanges } =
    useAccessibilityStore();

  const handleUndoAll = () => {
    setAppliedChanges([]);
    setAppState("issues-detected");
  };

  const handleUndoSingle = (changeId: string) => {
    const updatedChanges = appliedChanges.filter(
      (change) => change.id !== changeId
    );
    setAppliedChanges(updatedChanges);
  };

  return (
    <ExtensionLayout
      header={
        <div className="flex items-center gap-3">
          <span className="text-xl">✨</span>
          <span className="font-semibold text-green-400">Changes Applied</span>
        </div>
      }
      onClose={() => setAppState("default")}
    >
      <div className="p-5">
        {/* Success Message */}
        <div className="bg-green-900/30 border border-green-600 rounded-lg p-4 text-green-400 text-sm text-center mb-6 font-medium">
          🎉 Great! I've made {appliedChanges.length} improvements to this page.
        </div>

        {/* What Changed */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3">
            What Changed
          </h3>
          <div className="space-y-2">
            {appliedChanges.map((change) => (
              <div
                key={change.id}
                className="flex items-center justify-between p-3 bg-slate-800 rounded-lg"
              >
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-green-400">✓</span>
                  <span>{change.description}</span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleUndoSingle(change.id)}
                  className="border-slate-600 text-slate-400 hover:text-white hover:bg-slate-700 text-xs px-3 py-1"
                >
                  Undo
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* User Feedback */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3">
            How does it look?
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              className="border-green-600 text-green-400 hover:bg-green-900/30 justify-center gap-2 h-12"
            >
              <span className="text-base">👍</span>
              <span>Much Better!</span>
            </Button>
            <Button
              variant="outline"
              className="border-orange-600 text-orange-400 hover:bg-orange-900/30 justify-center gap-2 h-12"
            >
              <span className="text-base">🔧</span>
              <span>Needs Work</span>
            </Button>
          </div>
        </div>

        {/* Save Changes */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3">
            Save These Changes?
          </h3>
          <div className="space-y-2.5">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold justify-start gap-3 h-12">
              <span className="text-base">🌐</span>
              <span>Use on All Websites</span>
            </Button>
            <Button
              variant="outline"
              className="w-full border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700 justify-start gap-3 h-12"
            >
              <span className="text-base">🏠</span>
              <span>Only This Website</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="p-5 mt-auto space-y-2">
        <Button
          onClick={() => setAppState("custom-input")}
          variant="outline"
          className="w-full border-slate-600 text-slate-400 hover:text-white hover:bg-slate-700"
        >
          Make More Changes
        </Button>
        <Button
          onClick={handleUndoAll}
          variant="destructive"
          className="w-full bg-red-600 hover:bg-red-700"
        >
          Undo All Changes
        </Button>
      </div>
    </ExtensionLayout>
  );
}
