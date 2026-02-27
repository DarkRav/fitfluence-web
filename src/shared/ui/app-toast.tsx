"use client";

import * as React from "react";
import * as Toast from "@radix-ui/react-toast";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastKind = "info" | "success" | "warning" | "error";

type ToastItem = {
  id: string;
  title: string;
  description?: string;
  kind: ToastKind;
};

type ToastContextValue = {
  pushToast: (toast: Omit<ToastItem, "id">) => void;
};

const ToastContext = React.createContext<ToastContextValue | null>(null);

const kindClasses: Record<ToastKind, string> = {
  info: "border-info/30",
  success: "border-success/30",
  warning: "border-warning/30",
  error: "border-destructive/30",
};

export function AppToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<ToastItem[]>([]);

  const pushToast = React.useCallback((toast: Omit<ToastItem, "id">) => {
    const id = crypto.randomUUID();
    setItems((prev) => [...prev, { ...toast, id }]);
  }, []);

  return (
    <ToastContext.Provider value={{ pushToast }}>
      <Toast.Provider swipeDirection="right">
        {children}
        {items.map((item) => (
          <Toast.Root
            key={item.id}
            duration={3500}
            onOpenChange={(open) => {
              if (!open) {
                setItems((prev) => prev.filter((candidate) => candidate.id !== item.id));
              }
            }}
            className={cn(
              "mb-2 w-80 rounded-md border bg-card p-4 text-card-foreground shadow-card",
              kindClasses[item.kind],
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <Toast.Title className="text-sm font-semibold">{item.title}</Toast.Title>
                {item.description ? (
                  <Toast.Description className="mt-1 text-xs text-muted-foreground">
                    {item.description}
                  </Toast.Description>
                ) : null}
              </div>
              <Toast.Close className="rounded p-1 text-muted-foreground hover:bg-card">
                <X className="h-4 w-4" />
              </Toast.Close>
            </div>
          </Toast.Root>
        ))}
        <Toast.Viewport className="fixed bottom-4 right-4 z-[100]" />
      </Toast.Provider>
    </ToastContext.Provider>
  );
}

export function useAppToast(): ToastContextValue {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useAppToast must be used within AppToastProvider");
  }
  return context;
}
