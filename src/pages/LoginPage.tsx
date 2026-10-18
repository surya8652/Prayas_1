import React, { useState } from "react";
import { Network, Lock, Mail, Eye, EyeOff, KeyRound, HelpCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Alert } from "../components/ui/alert";
import { loginUser } from "../services/api";

interface Props {
  onSuccessLogin: (user: any) => void;
  onGoHome: () => void;
  onGoRegister?: () => void;
}

export const LoginPage: React.FC<Props> = ({ onSuccessLogin, onGoHome, onGoRegister }) => {
  const [email, setEmail] = useState("aris.thorne@prayas.edu");
  const [password, setPassword] = useState("password");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loginAlert, setLoginAlert] = useState<{ type: "success" | "error" | "info"; message: string } | null>(null);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");
    setPasswordError("");
    setLoginAlert(null);

    let hasError = false;
    if (!email || !email.includes("@")) {
      setEmailError("Please enter a valid institutional email address");
      hasError = true;
    }
    if (!password) {
      setPasswordError("Password is required");
      hasError = true;
    }
    if (hasError) return;

    setIsLoading(true);

    try {
      const res = await loginUser(email, password);
      setLoginAlert({ type: "success", message: `Welcome back, ${res.user?.full_name || res.user?.name || "Researcher"}!` });
      setTimeout(() => {
        onSuccessLogin(res.user);
      }, 500);
    } catch (err: any) {
      setLoginAlert({
        type: "error",
        message: err.message || "Invalid institutional credentials. Please verify your email and password."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("password");
    setEmailError("");
    setPasswordError("");
    setLoginAlert(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Public Top Nav */}
      <header className="w-full border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
          <div onClick={onGoHome} className="flex items-center gap-2.5 cursor-pointer">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <Network className="h-5 w-5" />
            </div>
            <span className="text-lg font-extrabold text-slate-900 font-heading">PRAYAS</span>
          </div>

          <div className="flex items-center gap-2">
            {onGoRegister && (
              <Button variant="ghost" size="sm" onClick={onGoRegister} className="text-xs">
                Create Account
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={onGoHome} className="text-xs">
              ← Back to Public Portal
            </Button>
          </div>
        </div>
      </header>

      {/* Login Card Container */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md space-y-4">
          {loginAlert && (
            <Alert type={loginAlert.type} title={loginAlert.type === "success" ? "Success" : "Authentication Notice"}>
              {loginAlert.message}
            </Alert>
          )}

          <Card className="shadow-card border-slate-200 bg-white">
            <CardHeader className="text-left pb-4">
              <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2">
                <Lock className="h-5 w-5" />
              </div>
              <CardTitle className="text-xl font-bold font-heading">University Single Sign-On</CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Sign in with your institutional credentials to access research grants, AI matching, and proposals.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4 text-left">
                <Input
                  id="email"
                  label="Institutional Email"
                  type="email"
                  placeholder="faculty@prayas.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={emailError}
                  helperText="Use your assigned campus email address."
                  icon={<Mail className="h-4 w-4" />}
                />

                <Input
                  id="password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={passwordError}
                  icon={<Lock className="h-4 w-4" />}
                  rightElement={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-slate-400 hover:text-slate-600 p-1 focus:outline-none"
                      title={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  }
                />

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Protected by Werkzeug security</span>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="font-medium text-indigo-600 hover:text-indigo-700 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>

                <div className="pt-2">
                  <Button type="submit" className="w-full font-semibold" loading={isLoading}>
                    Sign In to PRAYAS
                  </Button>
                </div>
              </form>

              {/* Link to Registration */}
              {onGoRegister && (
                <div className="pt-3 text-center border-t border-slate-100">
                  <p className="text-xs text-slate-600">
                    New to the collaboration platform?{" "}
                    <button
                      type="button"
                      onClick={onGoRegister}
                      className="font-bold text-indigo-600 hover:text-indigo-800 hover:underline"
                    >
                      Register your institutional account
                    </button>
                  </p>
                </div>
              )}

              {/* Demo Quick Accounts */}
              <div className="mt-4 pt-3 border-t border-slate-100 text-left">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Quick Seeded Test Accounts (Password: password)
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => handleQuickLogin("aris.thorne@prayas.edu")}
                    className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-left transition-colors"
                  >
                    <div className="font-semibold text-slate-800 truncate">Dr. Aris Thorne</div>
                    <div className="text-[10px] text-slate-500">CS • Faculty</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickLogin("kavita.raman@prayas.edu")}
                    className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-left transition-colors"
                  >
                    <div className="font-semibold text-slate-800 truncate">Dr. Kavita Raman</div>
                    <div className="text-[10px] text-slate-500">Biotech • Faculty</div>
                  </button>
                </div>
              </div>
            </CardContent>

            <CardFooter className="text-xs text-slate-400 text-center justify-center border-t border-slate-100 py-3">
              PRAYAS Academic Authentication Service • ISO/IEC 27001
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <Card className="w-full max-w-sm shadow-modal">
            <CardHeader className="text-left">
              <div className="h-9 w-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-1">
                <KeyRound className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg">Institutional Password Recovery</CardTitle>
              <CardDescription className="text-xs">
                To reset institutional credentials, contact your university identity directory coordinator or IT service desk.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-xs text-slate-600 text-left space-y-2">
              <p>For sandbox and evaluation accounts, default password is: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-indigo-700 font-mono">password</code></p>
              <p className="text-slate-400">Security inquiries: identity@prayas.edu</p>
            </CardContent>
            <CardFooter className="justify-end">
              <Button size="sm" onClick={() => setShowForgotModal(false)}>
                Close
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
};
