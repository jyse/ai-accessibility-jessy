import React from "react";
import { createRoot } from "react-dom/client";

function App() {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">AI Accessibility Assistant</h1>
      <p className="text-gray-600">Extension is working!</p>
    </div>
  );
}

const container = document.getElementById("popup-root");
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
