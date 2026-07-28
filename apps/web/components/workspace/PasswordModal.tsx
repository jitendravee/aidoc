import { useState } from "react";
import Text from "../ui/Text";
import Button from "../ui/Button";
import { Lock, X } from "lucide-react";

interface PasswordModalProps {
  tool: "protect_pdf" | "unlock_pdf";
  onSubmit: (password: string) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  error?: string;
}

export default function PasswordModal({ tool, onSubmit, onCancel, isSubmitting, error }: PasswordModalProps) {
  const [password, setPassword] = useState("");
  const isProtect = tool === "protect_pdf";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-xl border border-border bg-surface p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="size-4 text-primary" />
            <Text size="base" weight="semibold">
              {isProtect ? "Set a password" : "Enter the password"}
            </Text>
          </div>
          <button onClick={onCancel} className="text-text-secondary hover:text-text" aria-label="Cancel">
            <X className="size-4" />
          </button>
        </div>

        <Text size="sm" color="text-secondary" className="mb-3">
          {isProtect
            ? "This will be required to open the PDF. Choose something you'll remember."
            : "This document is password-protected. Enter the current password to remove it."}
        </Text>

        <input
          type="password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && password && onSubmit(password)}
          placeholder="Password"
          className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          disabled={isSubmitting}
        />
        {error && (
          <Text size="xs" color="error" className="mt-1.5">
            {error}
          </Text>
        )}

        <div className="mt-4 flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button size="sm" onClick={() => onSubmit(password)} disabled={!password || isSubmitting}>
            {isSubmitting ? "Working…" : isProtect ? "Protect" : "Unlock"}
          </Button>
        </div>
      </div>
    </div>
  );
}