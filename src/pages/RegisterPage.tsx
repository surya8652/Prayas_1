import React, { useState } from "react";
import { Network, UserPlus, Lock, Mail, Building2, UserCheck, Eye, EyeOff, GraduationCap } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Select } from "../components/ui/select";
import { Alert } from "../components/ui/alert";
import { registerUser } from "../services/api";

interface Props {
  onSuccessRegister: (user: any) => void;
  onGoLogin: () => void;
  onGoHome: () => void;
}

export const RegisterPage: React.FC<Props> = ({ onSuccessRegister, onGoLogin, onGoHome }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [department, setDepartment] = useState("Computer Science & Engineering");
  const [role, setRole] = useState("Faculty");
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!fullName.trim() || fullName.trim().length < 2) {
      newErrors.fullName = "Full name is required (minimum 2 characters).";
    }

    if (!email.trim() || !email.includes("@") || !email.includes(".")) {
      newErrors.email = "Please provide a valid institutional email address.";
    }

    if (!password || password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long.";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    if (!department.trim()) {
      newErrors.department = "Department is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const res = await registerUser({
        full_name: fullName.trim(),
        email: email.trim(),
        password,
        confirm_password: confirmPassword,
        department: department.trim(),
        role: role.toLowerCase(),
      });

      setAlert({
        type: "success",
        message: `Account created successfully! Welcome, ${res.user?.full_name || fullName}.`,
      });

      setTimeout(() => {
        onSuccessRegister(res.user);
      }, 700);
    } catch (err: any) {
      setAlert({
        type: "error",
        message: err.message || "Registration failed. Please review your details and try again.",
      });
    } finally {
      setIsLoading(false);
    }
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

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onGoLogin} className="text-xs">
              Existing Account? Sign In
            </Button>
            <Button variant="ghost" size="sm" onClick={onGoHome} className="text-xs">
              ← Home
            </Button>
          </div>
        </div>
      </header>

      {/* Registration Container */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 my-4">
        <div className="w-full max-w-lg space-y-4">
          {alert && (
            <Alert type={alert.type} title={alert.type === "success" ? "Success" : "Registration Error"}>
              {alert.message}
            </Alert>
          )}

          <Card className="shadow-card border-slate-200 bg-white">
            <CardHeader className="text-left pb-3">
              <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2">
                <UserPlus className="h-5 w-5" />
              </div>
              <CardTitle className="text-xl font-bold font-heading">Register Institutional Account</CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Join PRAYAS to discover cross-departmental research synergies, form grant teams, and access AI-assisted collaborator matching.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-3.5 text-left">
                {/* Full Name */}
                <Input
                  id="fullName"
                  label="Full Name & Title"
                  placeholder="e.g. Dr. Maya Patel or Maya Patel"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (errors.fullName) setErrors({ ...errors, fullName: "" });
                  }}
                  error={errors.fullName}
                  icon={<UserCheck className="h-4 w-4" />}
                />

                {/* Institutional Email */}
                <Input
                  id="email"
                  label="Institutional Email"
                  type="email"
                  placeholder="name@university.edu"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: "" });
                  }}
                  error={errors.email}
                  helperText="Must be an institutional campus address."
                  icon={<Mail className="h-4 w-4" />}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Department */}
                  <Select
                    id="department"
                    label="Academic Department"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    options={[
                      { value: "Computer Science & Engineering", label: "Computer Science & Eng." },
                      { value: "Biotechnology & Biomedical Engineering", label: "Biotechnology & Biomed" },
                      { value: "Data Science & AI", label: "Data Science & AI" },
                      { value: "Electronics & Communication", label: "Electronics & Comm." },
                      { value: "Mechanical & Aerospace Engineering", label: "Mechanical & Aerospace" },
                      { value: "Physics & Astronomy", label: "Physics & Astronomy" },
                      { value: "Chemical Sciences", label: "Chemical Sciences" },
                      { value: "Humanities & Social Sciences", label: "Humanities & Social Sci." },
                    ]}
                  />

                  {/* Academic Role */}
                  <Select
                    id="role"
                    label="Academic Role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    options={[
                      { value: "Faculty", label: "Faculty / Principal Investigator" },
                      { value: "Student", label: "Graduate / Student Scholar" },
                    ]}
                    helperText="Public registration is available for Student & Faculty."
                  />
                </div>

                {/* Password */}
                <Input
                  id="password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: "" });
                  }}
                  error={errors.password}
                  helperText="Minimum 6 characters. Protected by Werkzeug hashing."
                  icon={<Lock className="h-4 w-4" />}
                  rightElement={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-slate-400 hover:text-slate-600 p-1 focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  }
                />

                {/* Confirm Password */}
                <Input
                  id="confirmPassword"
                  label="Confirm Password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: "" });
                  }}
                  error={errors.confirmPassword}
                  icon={<Lock className="h-4 w-4" />}
                  rightElement={
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="text-slate-400 hover:text-slate-600 p-1 focus:outline-none"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  }
                />

                <div className="pt-2">
                  <Button type="submit" className="w-full font-semibold" loading={isLoading}>
                    Complete Registration
                  </Button>
                </div>
              </form>
            </CardContent>

            <CardFooter className="flex flex-col gap-2 text-xs text-slate-500 border-t border-slate-100 py-3">
              <div className="text-center">
                Already registered with campus credentials?{" "}
                <button
                  type="button"
                  onClick={onGoLogin}
                  className="font-bold text-indigo-600 hover:text-indigo-800 hover:underline"
                >
                  Sign in here
                </button>
              </div>
              <div className="text-[11px] text-slate-400">
                PRAYAS Academic Authentication Service • Privacy & Ethics Compliant
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};
