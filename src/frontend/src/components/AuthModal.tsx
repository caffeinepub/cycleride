import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useQueryClient } from "@tanstack/react-query";
import { Bike, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultMode?: "login" | "signup";
}

export default function AuthModal({
  open,
  onOpenChange,
  defaultMode = "login",
}: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "signup">(defaultMode);
  const { login, loginStatus } = useInternetIdentity();
  const queryClient = useQueryClient();
  const isLoggingIn = loginStatus === "logging-in";

  const handleLogin = async () => {
    try {
      await login();
      toast.success("Welcome to CycleRIDE!");
      queryClient.invalidateQueries();
      onOpenChange(false);
    } catch {
      toast.error("Login failed. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" data-ocid="auth.dialog">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Bike className="w-4 h-4 text-white" />
            </div>
            <DialogTitle className="font-heading font-bold text-lg">
              {mode === "login" ? "Welcome Back" : "Join CycleRIDE"}
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <p className="text-sm text-muted-foreground">
            {mode === "login"
              ? "Sign in securely with Internet Identity — no passwords needed."
              : "Create your account and start riding in minutes."}
          </p>

          <Button
            onClick={handleLogin}
            disabled={isLoggingIn}
            className="w-full bg-primary text-white hover:bg-green-deep/90 h-11 font-semibold"
            data-ocid="auth.submit_button"
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Connecting...
              </>
            ) : mode === "login" ? (
              "Log In with Internet Identity"
            ) : (
              "Sign Up with Internet Identity"
            )}
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
              className="text-xs text-muted-foreground hover:text-primary transition-colors"
              data-ocid="auth.toggle_button"
            >
              {mode === "login"
                ? "Don't have an account? Sign Up"
                : "Already have an account? Log In"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
