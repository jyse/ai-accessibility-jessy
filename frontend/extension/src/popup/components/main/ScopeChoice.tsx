// src/popup/components/main/ScopeChoice.tsx
import React from "react";
import { useAccessibilityStore } from "../../../shared/store";
import { Globe, Monitor } from "lucide-react";

export function ScopeChoice() {
  const { pendingChange, currentDomain, handleScopeChoice, setAppState } =
    useAccessibilityStore();

  if (!pendingChange) {
    return null;
  }

  const handleGlobalChoice = () => {
    handleScopeChoice("global", pendingChange);
  };

  const handleSiteChoice = () => {
    handleScopeChoice("site", pendingChange);
  };

  const handleCancel = () => {
    useAccessibilityStore.setState({
      pendingChange: null,
      appState: "default"
    });
  };

  // Clean domain name for display
  const displayDomain = currentDomain.replace("www.", "");

  return (
    <div className="w-[420px] h-[600px] bg-white flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Globe className="w-6 h-6 text-blue-600" />
          </div>
        </div>

        <h1 className="text-xl font-bold text-center text-gray-900 mb-2">
          Apply Changes Where?
        </h1>

        <p className="text-sm text-gray-600 text-center">
          Choose where you'd like to apply this accessibility fix
        </p>
      </div>

      {/* Applied Change Preview */}
      <div className="p-6 bg-gray-50 border-b border-gray-200">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <h3 className="font-medium text-gray-900 mb-1">
                {pendingChange.description}
              </h3>
              <p className="text-sm text-gray-600">
                Applied at{" "}
                {new Date(pendingChange.appliedAt).toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Choice Options */}
      <div className="flex-1 p-6 space-y-4">
        {/* All Websites Option */}
        <button
          onClick={handleGlobalChoice}
          className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group"
        >
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
              <Globe className="w-5 h-5 text-purple-600" />
            </div>

            <div className="flex-1 text-left">
              <h3 className="font-semibold text-gray-900 mb-1">All Websites</h3>
              <p className="text-sm text-gray-600 mb-2">
                Apply this fix to every website you visit
              </p>
              <div className="flex items-center text-xs text-purple-600">
                <span className="bg-purple-100 px-2 py-1 rounded">
                  Global Setting
                </span>
              </div>
            </div>
          </div>
        </button>

        {/* This Website Only Option */}
        <button
          onClick={handleSiteChoice}
          className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all group"
        >
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
              <Monitor className="w-5 h-5 text-green-600" />
            </div>

            <div className="flex-1 text-left">
              <h3 className="font-semibold text-gray-900 mb-1">
                Only {displayDomain}
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                Apply this fix only to this specific website
              </p>
              <div className="flex items-center text-xs text-green-600">
                <span className="bg-green-100 px-2 py-1 rounded">
                  Site-Specific
                </span>
              </div>
            </div>
          </div>
        </button>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2 text-sm">
            💡 How this works
          </h4>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>
              • <strong>All Websites:</strong> Changes your global profile
              settings
            </li>
            <li>
              • <strong>This Website Only:</strong> Creates a custom rule for{" "}
              {displayDomain}
            </li>
            <li>• You can always adjust these later in Settings</li>
          </ul>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="border-t border-gray-200 p-6">
        <div className="flex space-x-3">
          <button
            onClick={handleCancel}
            className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-3">
          This choice helps personalize your accessibility experience
        </p>
      </div>
    </div>
  );
}
