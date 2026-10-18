import React, { useState } from "react";
import {
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  User,
  Building,
  Wrench,
  BookOpen,
  Clock,
  Send,
  X,
  Plus,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Select } from "../components/ui/select";
import { Badge } from "../components/ui/badge";
import { Alert } from "../components/ui/alert";
import { updateUserProfile } from "../services/api";

interface Props {
  currentUser?: any;
  onFinishOnboarding: (updatedUser: any) => void;
  onSkip?: () => void;
}

const POPULAR_SKILLS = [
  "Python",
  "PyTorch",
  "Transformers",
  "Bioinformatics",
  "ROS2",
  "Embedded C",
  "C++",
  "Docker",
  "R",
  "Statistical Genomics",
  "Optimization",
  "Sensor Fusion",
];

const POPULAR_INTERESTS = [
  "Deep Learning",
  "Healthcare AI",
  "Genomics",
  "Distributed Systems",
  "Autonomous Robotics",
  "Edge Computing",
  "Smart Agriculture",
  "IoT Sensors",
];

export const OnboardingPage: React.FC<Props> = ({ currentUser, onFinishOnboarding, onSkip }) => {
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [fullName, setFullName] = useState(currentUser?.full_name || currentUser?.name || "");
  const [designation, setDesignation] = useState(currentUser?.designation || "Assistant Professor / Researcher");
  const [bio, setBio] = useState(currentUser?.bio || "");
  
  const [department, setDepartment] = useState(currentUser?.department || "Computer Science & Engineering");
  const [researchDomain, setResearchDomain] = useState(currentUser?.profile?.research_domain || "Artificial Intelligence & Multimodal Systems");

  const [skills, setSkills] = useState<string[]>(
    currentUser?.skills && currentUser.skills.length > 0
      ? currentUser.skills
      : ["Python", "PyTorch"]
  );
  const [newSkillInput, setNewSkillInput] = useState("");

  const [interests, setInterests] = useState<string[]>(
    currentUser?.interests && currentUser.interests.length > 0
      ? currentUser.interests
      : ["Deep Learning", "Healthcare AI"]
  );
  const [newInterestInput, setNewInterestInput] = useState("");

  const [availability, setAvailability] = useState(
    currentUser?.profile?.availability || "Available for joint grants & co-mentoring (15 hrs/week)"
  );
  const [ongoingProjectsNote, setOngoingProjectsNote] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitAlert, setSubmitAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Skill management
  const handleAddSkill = (skillToAdd: string) => {
    const trimmed = skillToAdd.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
    }
    setNewSkillInput("");
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  // Interest management
  const handleAddInterest = (interestToAdd: string) => {
    const trimmed = interestToAdd.trim();
    if (trimmed && !interests.includes(trimmed)) {
      setInterests([...interests, trimmed]);
    }
    setNewInterestInput("");
  };

  const handleRemoveInterest = (interestToRemove: string) => {
    setInterests(interests.filter((i) => i !== interestToRemove));
  };

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    setSubmitAlert(null);

    try {
      const payload = {
        full_name: fullName.trim(),
        department: department.trim(),
        designation: designation.trim(),
        bio: bio.trim(),
        research_domain: researchDomain.trim(),
        skills,
        research_interests: interests,
        availability: availability.trim(),
        profile_completed: true,
      };

      const res = await updateUserProfile(payload);
      setSubmitAlert({
        type: "success",
        message: "Academic profile successfully onboarded and activated!",
      });

      setTimeout(() => {
        onFinishOnboarding(res.user);
      }, 700);
    } catch (err: any) {
      setSubmitAlert({
        type: "error",
        message: err.message || "Failed to save profile. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepsList = [
    { num: 1, label: "Basic Info", icon: User },
    { num: 2, label: "Domain", icon: Building },
    { num: 3, label: "Skills", icon: Wrench },
    { num: 4, label: "Interests", icon: BookOpen },
    { num: 5, label: "Availability", icon: Clock },
    { num: 6, label: "Review", icon: CheckCircle2 },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Header */}
      <header className="w-full border-b border-slate-200 bg-white">
        <div className="max-w-4xl mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold text-sm">
              P
            </div>
            <span className="font-bold text-slate-900 font-heading">PRAYAS Onboarding</span>
          </div>
          {onSkip && (
            <Button variant="ghost" size="sm" onClick={onSkip} className="text-xs text-slate-500">
              Skip for now →
            </Button>
          )}
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Stepper Progress Bar */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            {stepsList.map((step, idx) => {
              const Icon = step.icon;
              const isActive = currentStep === step.num;
              const isPast = currentStep > step.num;
              return (
                <div key={step.num} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(step.num)}
                      className={`h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isActive
                          ? "bg-indigo-600 text-white ring-4 ring-indigo-100"
                          : isPast
                          ? "bg-teal-50 text-teal-700 border border-teal-200"
                          : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      {isPast ? <CheckCircle2 className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                    </button>
                    <span
                      className={`text-[11px] mt-1.5 font-medium hidden sm:block ${
                        isActive ? "text-indigo-600 font-bold" : isPast ? "text-slate-700" : "text-slate-400"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {idx < stepsList.length - 1 && (
                    <div
                      className={`h-0.5 w-full -mt-4 sm:-mt-6 ${
                        currentStep > step.num ? "bg-teal-400" : "bg-slate-200"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {submitAlert && (
          <Alert type={submitAlert.type} title={submitAlert.type === "success" ? "Success" : "Error"}>
            {submitAlert.message}
          </Alert>
        )}

        {/* Step Card Content */}
        <Card className="shadow-card border-slate-200 bg-white">
          {/* STEP 1: Basic Information */}
          {currentStep === 1 && (
            <>
              <CardHeader className="text-left">
                <CardTitle className="text-lg">Step 1: Basic Information</CardTitle>
                <CardDescription>
                  Enter your academic credentials and brief background for discovery by other researchers.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-left">
                <Input
                  id="fullName"
                  label="Full Name & Academic Title"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Dr. Jane Smith"
                  helperText="Displayed across research publications and proposal listings."
                />
                <Input
                  id="designation"
                  label="Academic Designation / Position"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  placeholder="e.g. Associate Professor, Postdoc Fellow, Graduate Scholar"
                />
                <div className="space-y-1.5">
                  <label htmlFor="bio" className="block text-xs font-semibold text-slate-800">
                    Research Bio & Narrative
                  </label>
                  <textarea
                    id="bio"
                    rows={4}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Describe your research focus, methodology, and ongoing lines of inquiry..."
                    className="w-full rounded-lg border border-slate-200 p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                  <p className="text-[11px] text-slate-400">Used by AI matching algorithms to identify contextual synergies.</p>
                </div>
              </CardContent>
            </>
          )}

          {/* STEP 2: Department and Research Domain */}
          {currentStep === 2 && (
            <>
              <CardHeader className="text-left">
                <CardTitle className="text-lg">Step 2: Department & Primary Domain</CardTitle>
                <CardDescription>
                  Identify your institutional home and broad multidisciplinary research domain.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-left">
                <Select
                  id="department"
                  label="Department Affiliation"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  options={[
                    { value: "Computer Science & Engineering", label: "Computer Science & Engineering" },
                    { value: "Biotechnology & Biomedical Engineering", label: "Biotechnology & Biomedical Engineering" },
                    { value: "Data Science & AI", label: "Data Science & AI" },
                    { value: "Electronics & Communication", label: "Electronics & Communication" },
                    { value: "Mechanical & Aerospace Engineering", label: "Mechanical & Aerospace Engineering" },
                    { value: "Physics & Astronomy", label: "Physics & Astronomy" },
                    { value: "Chemical Sciences", label: "Chemical Sciences" },
                    { value: "Civil & Environmental Engineering", label: "Civil & Environmental Engineering" },
                  ]}
                />
                <Input
                  id="domain"
                  label="Primary Research Domain"
                  value={researchDomain}
                  onChange={(e) => setResearchDomain(e.target.value)}
                  placeholder="e.g. Computational Biology, Autonomous Systems, Quantum Algorithms"
                  helperText="Your core specialization for interdisciplinary matching."
                />
              </CardContent>
            </>
          )}

          {/* STEP 3: Skills and Expertise */}
          {currentStep === 3 && (
            <>
              <CardHeader className="text-left">
                <CardTitle className="text-lg">Step 3: Skills & Methodologies</CardTitle>
                <CardDescription>
                  List technical skills, laboratory techniques, and computational frameworks you bring to collaboration.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-left">
                <div className="flex gap-2">
                  <Input
                    id="newSkill"
                    placeholder="Add a skill (e.g. PyTorch, CRISPR, ROS2, Docker)"
                    value={newSkillInput}
                    onChange={(e) => setNewSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddSkill(newSkillInput);
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={() => handleAddSkill(newSkillInput)}
                    className="shrink-0 gap-1 text-xs"
                  >
                    <Plus className="h-4 w-4" /> Add
                  </Button>
                </div>

                {/* Selected Skills Chips */}
                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-slate-700">Selected Skills ({skills.length}):</span>
                  <div className="flex flex-wrap gap-1.5 min-h-[40px] p-2 bg-slate-50 rounded-lg border border-slate-200">
                    {skills.length === 0 ? (
                      <span className="text-xs text-slate-400">No skills added yet. Choose from below or type above.</span>
                    ) : (
                      skills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center gap-1 rounded-md bg-indigo-50 border border-indigo-200 px-2.5 py-1 text-xs font-medium text-indigo-700"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(skill)}
                            className="hover:text-indigo-900 focus:outline-none"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </span>
                      ))
                    )}
                  </div>
                </div>

                {/* Popular Skill Suggestions */}
                <div className="space-y-1.5 pt-2">
                  <span className="text-xs text-slate-500 font-medium">Popular across campus:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {POPULAR_SKILLS.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => handleAddSkill(item)}
                        className={`text-xs px-2.5 py-1 rounded-md border transition-colors ${
                          skills.includes(item)
                            ? "bg-slate-200 text-slate-400 border-slate-200 cursor-default"
                            : "bg-white text-slate-700 border-slate-200 hover:border-indigo-300 hover:text-indigo-600"
                        }`}
                        disabled={skills.includes(item)}
                      >
                        + {item}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </>
          )}

          {/* STEP 4: Research Interests */}
          {currentStep === 4 && (
            <>
              <CardHeader className="text-left">
                <CardTitle className="text-lg">Step 4: Research Interests & Keywords</CardTitle>
                <CardDescription>
                  Specify topics you want to explore, even if you are looking for external collaborators to provide expertise.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-left">
                <div className="flex gap-2">
                  <Input
                    id="newInterest"
                    placeholder="Add an interest (e.g. Healthcare AI, Smart Grids, Drug Discovery)"
                    value={newInterestInput}
                    onChange={(e) => setNewInterestInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddInterest(newInterestInput);
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={() => handleAddInterest(newInterestInput)}
                    className="shrink-0 gap-1 text-xs"
                  >
                    <Plus className="h-4 w-4" /> Add
                  </Button>
                </div>

                {/* Selected Interests Chips */}
                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-slate-700">
                    Selected Interests ({interests.length}):
                  </span>
                  <div className="flex flex-wrap gap-1.5 min-h-[40px] p-2 bg-slate-50 rounded-lg border border-slate-200">
                    {interests.length === 0 ? (
                      <span className="text-xs text-slate-400">No interests added yet.</span>
                    ) : (
                      interests.map((interest) => (
                        <span
                          key={interest}
                          className="inline-flex items-center gap-1 rounded-md bg-teal-50 border border-teal-200 px-2.5 py-1 text-xs font-medium text-teal-800"
                        >
                          {interest}
                          <button
                            type="button"
                            onClick={() => handleRemoveInterest(interest)}
                            className="hover:text-teal-900 focus:outline-none"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </span>
                      ))
                    )}
                  </div>
                </div>

                {/* Popular Interest Suggestions */}
                <div className="space-y-1.5 pt-2">
                  <span className="text-xs text-slate-500 font-medium">Interdisciplinary focus areas:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {POPULAR_INTERESTS.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => handleAddInterest(item)}
                        className={`text-xs px-2.5 py-1 rounded-md border transition-colors ${
                          interests.includes(item)
                            ? "bg-slate-200 text-slate-400 border-slate-200 cursor-default"
                            : "bg-white text-slate-700 border-slate-200 hover:border-teal-300 hover:text-teal-700"
                        }`}
                        disabled={interests.includes(item)}
                      >
                        + {item}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </>
          )}

          {/* STEP 5: Ongoing Projects and Availability */}
          {currentStep === 5 && (
            <>
              <CardHeader className="text-left">
                <CardTitle className="text-lg">Step 5: Ongoing Projects & Collaboration Availability</CardTitle>
                <CardDescription>
                  Indicate your bandwidth and how open you are to accepting proposal requests.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-left">
                <Select
                  id="availabilitySelect"
                  label="Collaboration Availability"
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  options={[
                    { value: "Open to joint grants & co-mentoring (15 hrs/week)", label: "Open to joint grants & co-mentoring (15 hrs/week)" },
                    { value: "Actively seeking interdisciplinary lead investigator", label: "Actively seeking interdisciplinary lead investigator" },
                    { value: "Available for technical consultation (5-10 hrs/week)", label: "Available for technical consultation (5-10 hrs/week)" },
                    { value: "Full-time project lead with open lab positions", label: "Full-time project lead with open lab positions" },
                    { value: "Limited availability this semester", label: "Limited availability this semester" },
                  ]}
                />

                <div className="space-y-1.5">
                  <label htmlFor="ongoingNotes" className="block text-xs font-semibold text-slate-800">
                    Current Active Grants & Project Highlights (Optional)
                  </label>
                  <textarea
                    id="ongoingNotes"
                    rows={3}
                    value={ongoingProjectsNote}
                    onChange={(e) => setOngoingProjectsNote(e.target.value)}
                    placeholder="e.g. NSF Cyber-Physical systems award #20412; working on wireless sensor arrays..."
                    className="w-full rounded-lg border border-slate-200 p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                  <p className="text-[11px] text-slate-400">Helps colleagues see ongoing grant alignment.</p>
                </div>
              </CardContent>
            </>
          )}

          {/* STEP 6: Review and Save */}
          {currentStep === 6 && (
            <>
              <CardHeader className="text-left">
                <CardTitle className="text-lg">Step 6: Review & Finalize Profile</CardTitle>
                <CardDescription>
                  Review your onboarding profile before activating your researcher discovery badge.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-left">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-xl border border-slate-200 p-3.5 space-y-1.5 bg-slate-50/50">
                    <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Identity & Dept</span>
                    <div className="font-bold text-slate-900">{fullName || "Not provided"}</div>
                    <div className="text-xs text-indigo-700 font-medium">{designation}</div>
                    <div className="text-xs text-slate-600">{department}</div>
                  </div>

                  <div className="rounded-xl border border-slate-200 p-3.5 space-y-1.5 bg-slate-50/50">
                    <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Research Domain</span>
                    <div className="font-bold text-slate-900">{researchDomain}</div>
                    <div className="text-xs text-teal-700 font-medium mt-1">Status: {availability}</div>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 p-3.5 space-y-2">
                  <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Expertise Skills ({skills.length})</span>
                  <div className="flex flex-wrap gap-1.5">
                    {skills.map((s) => (
                      <span key={s} className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-xs font-medium border border-indigo-100">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 p-3.5 space-y-2">
                  <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Research Interests ({interests.length})</span>
                  <div className="flex flex-wrap gap-1.5">
                    {interests.map((i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 text-xs font-medium border border-teal-100">
                        {i}
                      </span>
                    ))}
                  </div>
                </div>

                {bio && (
                  <div className="rounded-xl border border-slate-200 p-3.5 space-y-1">
                    <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Bio</span>
                    <p className="text-xs text-slate-600 leading-relaxed">{bio}</p>
                  </div>
                )}
              </CardContent>
            </>
          )}

          {/* Stepper Navigation Footer */}
          <CardFooter className="flex items-center justify-between border-t border-slate-100 py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrev}
              disabled={currentStep === 1 || isSubmitting}
              className="gap-1 text-xs"
            >
              <ChevronLeft className="h-4 w-4" /> Previous
            </Button>

            <div className="text-xs text-slate-400">
              Step {currentStep} of 6
            </div>

            {currentStep < 6 ? (
              <Button
                variant="default"
                size="sm"
                onClick={handleNext}
                className="gap-1 text-xs font-semibold"
              >
                Next Step <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                variant="default"
                size="sm"
                onClick={handleFinalSubmit}
                loading={isSubmitting}
                className="gap-1 text-xs font-semibold bg-teal-600 hover:bg-teal-700"
              >
                <Sparkles className="h-4 w-4" /> Save & Activate Profile
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
