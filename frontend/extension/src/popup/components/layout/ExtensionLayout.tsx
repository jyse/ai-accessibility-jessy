// src/popup/components/layout/ExtensionLayout.tsx
import React from "react";
import { Button } from "@/components/ui/button";

interface ExtensionLayoutProps {
  children: React.ReactNode;
  header: React.ReactNode;
  onClose?: () => void;
}

export function ExtensionLayout({
  children,
  header,
  onClose
}: ExtensionLayoutProps) {
  return (
    <div className="w-[420px] max-h-[600px] flex flex-col overflow-hidden bg-[#111827] text-white rounded-2xl border border-zinc-800 shadow-xl font-sans">
      <div className="flex justify-between items-center px-4 py-3 border-b border-zinc-700 bg-[#111827]">
        {header}
        {onClose && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-7 w-7 p-0 text-zinc-400 hover:text-white hover:bg-zinc-700"
          >
            ×
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 text-sm leading-relaxed">
        {children}
      </div>
    </div>
  );
}
