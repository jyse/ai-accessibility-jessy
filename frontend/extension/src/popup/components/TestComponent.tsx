// src/popup/components/TestComponent.tsx
import React from "react";

export function TestComponent() {
  return (
    <div className="bg-red-500 text-white p-4 rounded-lg border-2 border-yellow-400 m-4">
      <h1 className="text-xl font-bold mb-2">🧪 CSS Test Component</h1>
      <p className="text-sm mb-4">
        If you see red background and yellow border, basic Tailwind is working!
      </p>

      <div className="space-y-2">
        <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white font-medium">
          Test Button 1
        </button>
        <button className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white font-medium block">
          Test Button 2
        </button>
        <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded text-white font-medium block">
          Test Button 3
        </button>
      </div>

      <div className="mt-4 p-2 bg-slate-800 rounded">
        <p className="text-xs text-slate-300">Dark theme test area</p>
      </div>

      {/* Test if shadcn/ui components work if they exist */}
      <div className="mt-4 p-3 border border-gray-300 rounded">
        <p className="text-black font-semibold">shadcn/ui Test Area</p>
        <p className="text-xs text-gray-600">
          This should have a border if basic styling works
        </p>
      </div>
    </div>
  );
}
