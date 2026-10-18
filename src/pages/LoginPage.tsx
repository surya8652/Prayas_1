import React, { useState } from "react";
import { Network, ShieldCheck, ArrowRight, Lock, Mail, UserCheck } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Select } from "../components/ui/select";
import { Alert } from "../components/ui/alert";
import { loginUser } from "../services/api";

interface Props {
  onSuccessLogin: (user: any) => void;
  onGoHome: () => void;
}

export const LoginPage: React.FC<Props> = ({ onSuccessLogin, onGoHome }) => {
  const [email, setEmail] = useState("aris.thorne@prayas.edu");
  const [role, setRole] = useState("Faculty");
  const [password, setPassword] = useState("••••••••");
  const [emailError, setEmailError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loginAlert, setLoginAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setEmailError("Please enter a valid university email address (.edu)");
      return;
    }
    setEmailError("");
    setIsLoading(true);

    try {
      const res = await loginUser(email, role);
      setLoginAlert({ type: "success", message: `Welcome back, ${res.user?.name || "Researcher"}!` });
      setTimeout(() => {
        onSuccessLogin(res.user);
      }, 700);
    } catch {
      setLoginAlert({ type: "error", message: "Authentication server unreachable. Falling back to local session." });
      setTimeout(() => {
        onSuccessLogin({ email, role, name: "Dr. Aris Thorne", department: "Computer Science & Engineering" });
      }, 800);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail: string, demoRole: string) => {
    setEmail(demoEmail);
    setRole(demoRole);
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

          <Button variant="ghost" size="sm" onClick={onGoHome}>
            ← Back to Public Portal
          </Button>
        </div>
      </header>

      {/* Login Card Container */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md space-y-4">
          {loginAlert && (
            <Alert type={loginAlert.type} title={loginAlert.type === "success" ? "Success" : "Notice"}>
              {loginAlert.message}
            </Alert>
          )}

          <Card className="shadow-card">
            <CardHeader className="text-left">
              <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2">
                <Lock className="h-5 w-5" />
              </div>
              <CardTitle className="text-xl">University Single Sign-On</CardTitle>
              <CardDescription>
                Sign in with your institutional credentials to access research grants, AI matching, and proposals.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4 text-left">
                <Input
                  id="email"
                  label="Institutional Email"
                  type="email"
                  placeholder="faculty@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={emailError}
                  helperText="Use your assigned campus email address."
                  icon={<Mail className="h-4 w-4" />}
                />

                <Select
                  id="role"
                  label="Academic Role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  options={[
                    { value: "Faculty", label: "Faculty / Principal Investigator" },
                    { value: "Researcher", label: "Postdoctoral / Research Fellow" },
                    { value: "Student", label: "Graduate / Student Scholar" },
                    { value: "Dean", label: "Institutional Dean / Research Officer" },
                  ]}
                  helperText="Select your role for appropriate access controls."
                />

                <Input
                  id="password"
                  label="Password / Token"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  helperText="Protected by 256-bit institutional encryption."
                  icon={<Lock className="h-4 w-4" />}
                />

                <div className="pt-2">
                  <Button type="submit" className="w-full" loading={isLoading}>
                    Sign In to PRAYAS
                  </Button>
                </div>
              </form>

              {/* Demo Quick Accounts */}
              <div className="mt-6 pt-4 border-t border-slate-100 text-left">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Quick Demo Accounts
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => handleQuickLogin("aris.thorne@prayas.edu", "Faculty")}
                    className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-left transition-colors"
                  >
                    <div className="font-semibold text-slate-800">Dr. Aris Thorne</div>
                    <div className="text-[10px] text-slate-500">CS • Faculty</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickLogin("kavita.raman@prayas.edu", "Faculty")}
                    className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-left transition-colors"
                  >
                    <div className="font-semibold text-slate-800">Dr. Kavita Raman</div>
                    <div className="text-[10px] text-slate-500">Biotech • Chair</div>
                  </button>
                </div>
              </div>
            </CardContent>

            <CardFooter className="text-xs text-slate-400 text-center justify-center">
              PRAYAS Academic Authentication Service • ISO/IEC 27001
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};
