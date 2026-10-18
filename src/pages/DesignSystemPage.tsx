import React, { useState } from "react";
import {
  Palette,
  Sparkles,
  Search,
  CheckCircle2,
  AlertTriangle,
  FolderSearch,
  Layers,
  Sliders,
  Type,
  MousePointerClick,
  FileText,
  LayoutGrid,
  ShieldCheck,
  Building2,
  ArrowRight,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Select } from "../components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { Modal } from "../components/ui/modal";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../components/ui/table";
import { EmptyState } from "../components/ui/empty-state";
import { Alert } from "../components/ui/alert";
import { StatCard } from "../components/ui/stat-card";
import { DepartmentBadge } from "../components/common/DepartmentBadge";
import { StatusPill } from "../components/common/StatusPill";

export const DesignSystemPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("components");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const [demoInput, setDemoInput] = useState("");
  const [demoInputError, setDemoInputError] = useState("");

  const handleTestValidate = () => {
    if (!demoInput || demoInput.trim().length < 5) {
      setDemoInputError("Title must be at least 5 characters in length.");
    } else {
      setDemoInputError("");
      alert("Validation passed!");
    }
  };

  return (
    <div className="space-y-10 text-left">
      {/* Header Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-md bg-indigo-50 border border-indigo-100 px-2.5 py-1 text-xs font-bold text-indigo-700">
              <Sparkles className="h-3.5 w-3.5" /> Design System Specification
            </div>
            <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
              PRAYAS Shared UI/UX Design System
            </h1>
            <p className="mt-1 text-sm text-slate-600 max-w-2xl leading-relaxed">
              Standardized academic technology components built for university research coordination.
              All components use consistent tokens, deep navy typography, neutral gray borders, and subtle synergy teal accents.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(true)}
              className="gap-1.5"
            >
              <Layers className="h-4 w-4 text-indigo-600" />
              Preview Modal
            </Button>
            <Button
              variant="synergy"
              size="sm"
              onClick={() => {
                setIsLoadingButton(true);
                setTimeout(() => setIsLoadingButton(false), 1500);
              }}
              loading={isLoadingButton}
            >
              Test Loading State
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs for Navigation across Design System Showcase */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="components" badge={<Layers className="h-3.5 w-3.5 ml-1" />}>
            Components Gallery
          </TabsTrigger>
          <TabsTrigger value="tokens" badge={<Palette className="h-3.5 w-3.5 ml-1" />}>
            Theme & Color Tokens
          </TabsTrigger>
          <TabsTrigger value="typography" badge={<Type className="h-3.5 w-3.5 ml-1" />}>
            Typography Scale
          </TabsTrigger>
          <TabsTrigger value="forms" badge={<FileText className="h-3.5 w-3.5 ml-1" />}>
            Forms & Validation
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Components Showcase */}
        <TabsContent value="components" className="space-y-10 pt-4">
          {/* Section: Buttons */}
          <section className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">1. Buttons & Actions</h2>
              <p className="text-xs text-slate-500">Accessible focus indicators, subtle elevation, and semantic variants.</p>
            </div>

            <Card>
              <CardContent className="pt-6 space-y-6">
                <div>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-3">
                    Button Variants
                  </span>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button variant="default">Primary (Indigo)</Button>
                    <Button variant="secondary">Secondary (Slate)</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="synergy">Synergy (Teal)</Button>
                    <Button variant="navy">Deep Navy</Button>
                    <Button variant="destructive">Destructive</Button>
                    <Button variant="ghost">Ghost Button</Button>
                    <Button variant="link">Inline Link</Button>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-3">
                    Sizes & States
                  </span>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button size="sm">Small (h-8)</Button>
                    <Button size="default">Default (h-9)</Button>
                    <Button size="lg">Large (h-10)</Button>
                    <Button size="icon" aria-label="Icon only">
                      <Search className="h-4 w-4" />
                    </Button>
                    <Button disabled>Disabled</Button>
                    <Button loading>Loading...</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Section: Badges & Status */}
          <section className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">2. Badges & Collaboration Status</h2>
              <p className="text-xs text-slate-500">Clean indicators for roles, departments, project states, and match quality.</p>
            </div>

            <Card>
              <CardContent className="pt-6 space-y-6">
                <div>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-3">
                    Semantic Badges
                  </span>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <Badge variant="default">Primary Indigo</Badge>
                    <Badge variant="secondary">Secondary Slate</Badge>
                    <Badge variant="teal">Synergy Teal</Badge>
                    <Badge variant="success">Success</Badge>
                    <Badge variant="warning">Under Review</Badge>
                    <Badge variant="destructive">Rejected</Badge>
                    <Badge variant="outline">Outline</Badge>
                    <Badge variant="navy">Institutional Navy</Badge>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-3">
                    Department & Status Components
                  </span>
                  <div className="flex flex-wrap items-center gap-3">
                    <DepartmentBadge department="Computer Science & Engineering" />
                    <DepartmentBadge department="Biotechnology & Biomedical" />
                    <DepartmentBadge department="Mechanical & Aerospace" />
                    <StatusPill status="Recruiting" />
                    <StatusPill status="In Progress" />
                    <StatusPill status="Completed" />
                    <StatusPill status="Rejected" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Section: Stat Cards & Metrics */}
          <section className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">3. Academic Metric Cards</h2>
              <p className="text-xs text-slate-500">Reusable stat components with trends, icons, and subtle elevation.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Active Researchers"
                value="148"
                subtitle="Across 6 faculties"
                trend={{ value: "12% vs last term", isPositive: true }}
                variant="brand"
              />
              <StatCard
                title="Synergy Rate"
                value="82.4%"
                subtitle="Interdisciplinary index"
                trend={{ value: "+5.1%", isPositive: true }}
                variant="synergy"
              />
              <StatCard
                title="Funded Projects"
                value="36"
                subtitle="Active cross-dept grants"
                variant="default"
              />
              <StatCard
                title="Open Positions"
                value="14"
                subtitle="Seeking collaboration"
                trend={{ value: "3 filled this week", isPositive: true }}
                variant="default"
              />
            </div>
          </section>

          {/* Section: Alerts & Feedback */}
          <section className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">4. Feedback & Alerts</h2>
              <p className="text-xs text-slate-500">Subtle border colors and plain English messages for all system states.</p>
            </div>

            <div className="space-y-3">
              <Alert type="info" title="Academic Year 2026-27 Enrollment Open">
                Faculty members can submit interdisciplinary project proposals for university seed grants until the end of this month.
              </Alert>
              <Alert type="success" title="Explainable Match Found (92% Score)">
                Your profile matches Dr. Kavita Raman's Genomic Pattern Mining initiative in Biomedical Engineering.
              </Alert>
              <Alert type="warning" title="Verification Pending">
                Your departmental affiliation is awaiting institutional ethics review. Some grant features are temporarily restricted.
              </Alert>
              <Alert type="error" title="Submission Error">
                Unable to save collaboration note. Please ensure all required fields are filled.
              </Alert>
            </div>
          </section>

          {/* Section: Data Table */}
          <section className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">5. Academic Data Table</h2>
              <p className="text-xs text-slate-500">Structured tables with accessible headers and responsive overflow.</p>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Researcher</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Active Projects</TableHead>
                  <TableHead>Synergy Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-semibold text-slate-900">Dr. Aris Thorne</TableCell>
                  <TableCell><DepartmentBadge department="Computer Science & Engineering" /></TableCell>
                  <TableCell><Badge variant="secondary">Faculty</Badge></TableCell>
                  <TableCell>2 Initiatives</TableCell>
                  <TableCell><StatusPill status="Recruiting" /></TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="text-xs text-indigo-600">View Profile</Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold text-slate-900">Dr. Kavita Raman</TableCell>
                  <TableCell><DepartmentBadge department="Biotechnology & Biomedical" /></TableCell>
                  <TableCell><Badge variant="secondary">Faculty Chair</Badge></TableCell>
                  <TableCell>3 Initiatives</TableCell>
                  <TableCell><StatusPill status="Recruiting" /></TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="text-xs text-indigo-600">View Profile</Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold text-slate-900">Devansh Mehta</TableCell>
                  <TableCell><DepartmentBadge department="Data Science & AI" /></TableCell>
                  <TableCell><Badge variant="outline">Lead Fellow</Badge></TableCell>
                  <TableCell>1 Initiative</TableCell>
                  <TableCell><StatusPill status="In Progress" /></TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="text-xs text-indigo-600">View Profile</Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </section>

          {/* Section: Empty State */}
          <section className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">6. Empty State</h2>
              <p className="text-xs text-slate-500">Clear guidance and actionable CTA when no data is found.</p>
            </div>

            <EmptyState
              title="No collaboration requests in this filter"
              description="You have reviewed all incoming proposals. New interdisciplinary inquiries will appear here automatically."
              actionLabel="Explore Active Projects"
              onAction={() => alert("Navigate to projects")}
              secondaryActionLabel="Refresh Feed"
              onSecondaryAction={() => alert("Refreshed")}
            />
          </section>
        </TabsContent>

        {/* Tab 2: Theme Tokens */}
        <TabsContent value="tokens" className="space-y-6 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Theme Tokens & Color Palette</CardTitle>
              <CardDescription>
                Accredited palette designed for academic trust, reading comfort, and high contrast.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="rounded-xl border border-slate-200 p-4 space-y-2">
                  <div className="h-14 rounded-lg bg-slate-900 shadow-xs" />
                  <div className="font-bold text-sm text-slate-900">Deep Navy (#0F172A)</div>
                  <p className="text-xs text-slate-500">Primary typography, navigation bar items, and key headings.</p>
                </div>

                <div className="rounded-xl border border-slate-200 p-4 space-y-2">
                  <div className="h-14 rounded-lg bg-indigo-600 shadow-xs" />
                  <div className="font-bold text-sm text-slate-900">Academic Indigo (#4F46E5)</div>
                  <p className="text-xs text-slate-500">Main brand accent, primary CTA buttons, active state indicators.</p>
                </div>

                <div className="rounded-xl border border-slate-200 p-4 space-y-2">
                  <div className="h-14 rounded-lg bg-teal-600 shadow-xs" />
                  <div className="font-bold text-sm text-slate-900">Synergy Teal (#0D9488)</div>
                  <p className="text-xs text-slate-500">Subtle accents for collaboration success, matching, and positive status.</p>
                </div>

                <div className="rounded-xl border border-slate-200 p-4 space-y-2">
                  <div className="h-14 rounded-lg bg-white border border-slate-200 shadow-xs" />
                  <div className="font-bold text-sm text-slate-900">Pure White Surface (#FFFFFF)</div>
                  <p className="text-xs text-slate-500">Clean cards, panels, modals, dropdowns, and readable surfaces.</p>
                </div>

                <div className="rounded-xl border border-slate-200 p-4 space-y-2">
                  <div className="h-14 rounded-lg bg-slate-50 border border-slate-200 shadow-xs" />
                  <div className="font-bold text-sm text-slate-900">Light Canvas (#F8FAFC)</div>
                  <p className="text-xs text-slate-500">Page background providing high contrast and calm readability.</p>
                </div>

                <div className="rounded-xl border border-slate-200 p-4 space-y-2">
                  <div className="h-14 rounded-lg bg-slate-200 shadow-xs" />
                  <div className="font-bold text-sm text-slate-900">Neutral Gray Border (#E2E8F0)</div>
                  <p className="text-xs text-slate-500">Restrained borders and dividers replacing heavy shadows.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Typography Scale */}
        <TabsContent value="typography" className="space-y-6 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Typography System (Inter & Plus Jakarta Sans)</CardTitle>
              <CardDescription>
                Engineered for crisp readability across research papers, abstracts, and metadata tables.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 divide-y divide-slate-100">
              <div className="pt-2">
                <span className="text-xs font-semibold text-slate-400">Display Hero (36px / Extrabold)</span>
                <div className="text-3xl font-extrabold text-slate-900 tracking-tight font-heading mt-1">
                  Empowering Interdisciplinary Academic Discovery
                </div>
              </div>

              <div className="pt-4">
                <span className="text-xs font-semibold text-slate-400">Section Heading 1 (24px / Bold)</span>
                <div className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
                  Explainable AI Research Matching
                </div>
              </div>

              <div className="pt-4">
                <span className="text-xs font-semibold text-slate-400">Card Title (16px / Semibold)</span>
                <div className="text-base font-semibold text-slate-900 mt-1">
                  Genomic Pattern Mining using Multimodal Graph Networks
                </div>
              </div>

              <div className="pt-4">
                <span className="text-xs font-semibold text-slate-400">Body Text (14px / Regular / 1.6 Line Height)</span>
                <p className="text-sm text-slate-600 leading-relaxed max-w-3xl mt-1">
                  PRAYAS connects departmental silos to foster cross-disciplinary synergy between Engineering, Medicine, Science, and Humanities. By coupling structured skill profiles with transparent matching rationale, faculty and students can collaborate seamlessly.
                </p>
              </div>

              <div className="pt-4">
                <span className="text-xs font-semibold text-slate-400">Metadata & Captions (12px / Medium)</span>
                <div className="text-xs text-slate-500 mt-1">
                  Published 2 hours ago • Biotechnology & Biomedical Engineering • 2 Open Positions
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Forms & Validation */}
        <TabsContent value="forms" className="space-y-6 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Form Fields & Accessible Validation</CardTitle>
              <CardDescription>
                Every form field requires explicit labels, accessible focus rings, and clear error states.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 max-w-xl">
              <Input
                label="Research Initiative Title"
                placeholder="e.g. Federated Edge Inference in Clinical Protocols"
                value={demoInput}
                onChange={(e) => setDemoInput(e.target.value)}
                error={demoInputError}
                helperText="Enter a descriptive title in plain language."
              />

              <Select
                label="Primary Department"
                options={[
                  { value: "cs", label: "Computer Science & Engineering" },
                  { value: "biotech", label: "Biotechnology & Biomedical" },
                  { value: "ece", label: "Electronics & Communication" },
                  { value: "mech", label: "Mechanical & Aerospace Engineering" },
                ]}
                helperText="Select the institutional unit hosting this initiative."
              />

              <Textarea
                label="Project Abstract & Collaboration Scope"
                placeholder="Describe your research goals, methodologies, and specific skills needed from collaborating departments..."
                rows={3}
                helperText="Provide sufficient detail so potential collaborators understand your goals."
              />

              <div className="pt-2 flex items-center gap-3">
                <Button onClick={handleTestValidate}>
                  Validate & Submit Form
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setDemoInput("");
                    setDemoInputError("");
                  }}
                >
                  Reset Form
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Demonstration Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Interactive Component Modal"
        description="Accessible modal dialog featuring clean borders, escape key support, and responsive actions."
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={() => {
                alert("Confirmed!");
                setIsModalOpen(false);
              }}
            >
              Confirm Action
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <p className="text-sm text-slate-600 leading-relaxed">
            This modal is built with standard accessible markup, trap-free keyboard dismissal,
            and clean visual tokens matching the PRAYAS design language.
          </p>
          <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 text-xs text-slate-600">
            <strong>Accessibility Notice:</strong> Focus is automatically managed, and pressing the <code>Escape</code> key closes the modal immediately.
          </div>
        </div>
      </Modal>
    </div>
  );
};
