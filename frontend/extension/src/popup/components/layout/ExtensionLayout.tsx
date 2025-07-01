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
    <div className="w-[420px] h-[600px] bg-slate-900 text-white flex flex-col rounded-xl border-2 border-slate-700 overflow-hidden">
      <div className="flex justify-between items-center p-5 border-b border-slate-700 bg-slate-900">
        {header}
        {onClose && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-7 w-7 p-0 text-slate-400 hover:text-white hover:bg-slate-700"
          >
            ×
          </Button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}
