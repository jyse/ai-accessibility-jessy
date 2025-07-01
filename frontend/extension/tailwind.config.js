/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{html,js,ts,jsx,tsx}",
    // Make sure it scans ALL component files
    "./src/popup/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {}
  },
  plugins: [],
  // Add safelist to force include test classes
  safelist: [
    "bg-red-500",
    "bg-blue-600",
    "bg-green-600",
    "bg-purple-600",
    "bg-slate-800",
    "text-white",
    "text-slate-300",
    "border-yellow-400",
    "border-2",
    "p-4",
    "m-4",
    "rounded-lg",
    "space-y-2",
    "hover:bg-blue-700",
    "hover:bg-green-700",
    "hover:bg-purple-700"
  ]
};
