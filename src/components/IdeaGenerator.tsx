import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Cloud, Sparkles, FlaskConical, Rocket, Layers, Zap, Terminal, Bot,
  Link, Database, Flame, Heart, MousePointer, GitBranch, Globe, Grip,
  Bird, Smartphone, Code, Eye, Mic, LayoutDashboard, Radio, Workflow,
  Brain, BarChart3, Building2, ChevronLeft, ChevronRight, Shuffle,
  Loader2, ImageIcon, Apple, Pencil, FileImage, Send, Check, User, Mail, Phone, Building, FileText,
  Download, FolderDown, FileCode2, Copy, CheckCheck,
} from "lucide-react";
import JSZip from "jszip";
import {
  ideaTiles, platformTiles, audienceTiles, featureTiles, designStyleTiles,
} from "@/data/skills";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const iconMap: Record<string, React.ElementType> = {
  Cloud, Sparkles, FlaskConical, Rocket, Layers, Zap, Terminal, Bot,
  Link, Database, Flame, Heart, MousePointer, GitBranch, Globe, Grip,
  Bird, Smartphone, Code, Eye, Mic, LayoutDashboard, Radio, Workflow,
  Brain, BarChart3, Building2, Apple,
};

interface ProjectConcept {
  name: string;
  tagline: string;
  description: string;
  keyFeatures: string[];
  techStack: string[];
  uniqueValue: string;
}

interface PageMockup {
  pageName: string;
  imageUrl: string;
}

interface CodeFile {
  filename: string;
  content: string;
}

const STEPS = [
  { num: 1, title: "Project Type", subtitle: "What are you building?" },
  { num: 2, title: "Tech Stack", subtitle: "Which platforms to leverage?" },
  { num: 3, title: "Audience", subtitle: "Who is this for?" },
  { num: 4, title: "Features", subtitle: "Core capabilities needed?" },
  { num: 5, title: "Design Style", subtitle: "Visual direction?" },
];

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
};

const getInitialState = () => {
  try {
    const saved = localStorage.getItem('ideaGeneratorState');
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error("Failed to parse saved IdeaGenerator state", e);
  }
  return {};
};

export default function IdeaGenerator() {
  const savedState = getInitialState();

  const [step, setStep] = useState(savedState.step || 1);
  const [direction, setDirection] = useState(1);
  const [category, setCategory] = useState<string | null>(savedState.category || null);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(savedState.selectedPlatforms || []);
  const [audience, setAudience] = useState<string | null>(savedState.audience || null);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(savedState.selectedFeatures || []);
  const [designStyle, setDesignStyle] = useState<string | null>(savedState.designStyle || null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingMockup, setIsGeneratingMockup] = useState(false);
  const [concept, setConcept] = useState<ProjectConcept | null>(savedState.concept || null);
  const [mockupImage, setMockupImage] = useState<string | null>(savedState.mockupImage || null);

  // New state for edit/pages/submit flow
  const [editInput, setEditInput] = useState("");
  const [editHistory, setEditHistory] = useState<string[]>(savedState.editHistory || []);
  const [isApplyingEdit, setIsApplyingEdit] = useState(false);
  const [pageMockups, setPageMockups] = useState<PageMockup[]>(savedState.pageMockups || []);
  const [isGeneratingPages, setIsGeneratingPages] = useState(false);
  const [pagesGenerated, setPagesGenerated] = useState(savedState.pagesGenerated || false);
  const [showSubmitForm, setShowSubmitForm] = useState(savedState.showSubmitForm || false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitForm, setSubmitForm] = useState(savedState.submitForm || {
    name: "", email: "", phone: "", company: "", notes: "",
  });

  // Code generation & download state
  const [generatedCode, setGeneratedCode] = useState<CodeFile[] | null>(savedState.generatedCode || null);
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);
  const [activeCodeTab, setActiveCodeTab] = useState(0);
  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (submitted) {
      localStorage.removeItem('ideaGeneratorState');
      return;
    }
    const stateToSave = {
      step, category, selectedPlatforms, audience, selectedFeatures, designStyle,
      concept, mockupImage, editHistory, pageMockups, pagesGenerated, showSubmitForm, submitForm, generatedCode
    };
    localStorage.setItem('ideaGeneratorState', JSON.stringify(stateToSave));
  }, [step, category, selectedPlatforms, audience, selectedFeatures, designStyle, concept, mockupImage, editHistory, pageMockups, pagesGenerated, showSubmitForm, submitForm, submitted, generatedCode]);


  const toggleMulti = (
    val: string, list: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setter(list.includes(val) ? list.filter((v) => v !== val) : [...list, val]);
  };

  const canProceed = () => {
    switch (step) {
      case 1: return !!category;
      case 2: return selectedPlatforms.length > 0;
      case 3: return !!audience;
      case 4: return selectedFeatures.length > 0;
      case 5: return !!designStyle;
      default: return false;
    }
  };

  const goNext = () => { if (step < 5) { setDirection(1); setStep(step + 1); } };
  const goBack = () => { if (step > 1) { setDirection(-1); setStep(step - 1); } };

  const generateConcept = async () => {
    setIsGenerating(true);
    setConcept(null);
    setMockupImage(null);
    setPageMockups([]);
    setPagesGenerated(false);
    setSubmitted(false);
    setShowSubmitForm(false);
    try {
      const { data, error } = await supabase.functions.invoke("generate-idea", {
        body: { category, platforms: selectedPlatforms, audience, features: selectedFeatures, designStyle },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setConcept(data as ProjectConcept);
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || "Failed to generate concept.");
    } finally {
      setIsGenerating(false);
    }
  };

  const generateMockup = async (instructions?: string) => {
    if (!concept) return;
    setIsGeneratingMockup(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-mockup", {
        body: {
          name: concept.name, tagline: concept.tagline, description: concept.description,
          designStyle, keyFeatures: concept.keyFeatures,
          editInstructions: instructions || undefined,
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setMockupImage(data.imageUrl);
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || "Failed to generate mockup.");
    } finally {
      setIsGeneratingMockup(false);
    }
  };

  const applyEdit = async () => {
    if (!editInput.trim()) return;
    setIsApplyingEdit(true);
    const allEdits = [...editHistory, editInput.trim()];
    setEditHistory(allEdits);
    await generateMockup(allEdits.join("\n"));
    setEditInput("");
    setIsApplyingEdit(false);
  };

  const generatePages = async () => {
    if (!concept) return;
    setIsGeneratingPages(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-pages", {
        body: {
          name: concept.name, tagline: concept.tagline, description: concept.description,
          designStyle, keyFeatures: concept.keyFeatures,
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setPageMockups(data.pages || []);
      setPagesGenerated(true);
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || "Failed to generate pages.");
    } finally {
      setIsGeneratingPages(false);
    }
  };

  const handleSubmit = async () => {
    if (!submitForm.name.trim() || !submitForm.email.trim()) {
      toast.error("Name and email are required.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(submitForm.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("project_submissions").insert({
        user_name: submitForm.name.trim(),
        user_email: submitForm.email.trim(),
        user_phone: submitForm.phone.trim() || null,
        user_company: submitForm.company.trim() || null,
        user_notes: submitForm.notes.trim() || null,
        project_name: concept!.name,
        project_tagline: concept!.tagline,
        project_description: concept!.description,
        project_category: category,
        project_audience: audience,
        project_design_style: designStyle,
        project_platforms: selectedPlatforms,
        project_features: selectedFeatures,
        project_tech_stack: concept!.techStack,
        project_key_features: concept!.keyFeatures,
        mockup_landing_page: mockupImage,
        mockup_pages: pageMockups,
        edit_instructions: editHistory,
      } as any);
      if (error) throw error;
      setSubmitted(true);
      setShowSubmitForm(false);
      toast.success("Project submitted! We'll be in touch soon.");
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || "Failed to submit project.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate code from concept + mockups
  const generateCode = async () => {
    if (!concept) return;
    setIsGeneratingCode(true);
    setGeneratedCode(null);
    try {
      const { data, error } = await supabase.functions.invoke("generate-code", {
        body: {
          name: concept.name,
          tagline: concept.tagline,
          description: concept.description,
          designStyle,
          keyFeatures: concept.keyFeatures,
          techStack: concept.techStack,
          mockupImageUrl: mockupImage,
          pageMockups,
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      if (!data?.files || data.files.length === 0) throw new Error("No files generated");
      setGeneratedCode(data.files);
      setActiveCodeTab(0);
      toast.success(`Generated ${data.files.length} files!`);
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || "Failed to generate code.");
    } finally {
      setIsGeneratingCode(false);
    }
  };

  // Download project as ZIP
  const downloadProject = async () => {
    if (!concept) return;
    setIsDownloading(true);
    try {
      const zip = new JSZip();
      const projectSlug = concept.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "");
      const folder = zip.folder(projectSlug)!;

      // Add README
      const readme = `# ${concept.name}\n\n> ${concept.tagline}\n\n${concept.description}\n\n## Key Features\n${concept.keyFeatures.map((f: string) => `- ${f}`).join("\n")}\n\n## Tech Stack\n${concept.techStack.map((t: string) => `- ${t}`).join("\n")}\n\n## Getting Started\n\n1. Open \`index.html\` in your browser\n2. Or serve with any static file server:\n   \`\`\`bash\n   npx serve .\n   \`\`\`\n\n## Design Style\n${designStyle}\n\n---\n*Generated by [matveyev.ai](https://matveyev.ai) AI Project Generator*\n`;
      folder.file("README.md", readme);

      // Add generated code files
      if (generatedCode) {
        for (const file of generatedCode) {
          folder.file(file.filename, file.content);
        }
      }

      // Add screenshots
      const screenshotsFolder = folder.folder("screenshots")!;
      if (mockupImage) {
        const imgData = mockupImage.split(",")[1];
        if (imgData) {
          screenshotsFolder.file("landing-page.png", imgData, { base64: true });
        }
      }
      if (pageMockups.length > 0) {
        for (const page of pageMockups) {
          const pageData = page.imageUrl.split(",")[1];
          if (pageData) {
            screenshotsFolder.file(`${page.pageName.toLowerCase().replace(/\s+/g, "-")}.png`, pageData, { base64: true });
          }
        }
      }

      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${projectSlug}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Project downloaded!");
    } catch (e: any) {
      console.error(e);
      toast.error("Failed to create download.");
    } finally {
      setIsDownloading(false);
    }
  };

  // Copy file content to clipboard
  const copyToClipboard = async (filename: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedFile(filename);
      setTimeout(() => setCopiedFile(null), 2000);
    } catch {
      toast.error("Failed to copy to clipboard");
    }
  };

  const resetFunnel = () => {
    localStorage.removeItem('ideaGeneratorState');
    setStep(1); setDirection(-1); setCategory(null); setSelectedPlatforms([]);
    setAudience(null); setSelectedFeatures([]); setDesignStyle(null);
    setConcept(null); setMockupImage(null); setEditInput(""); setEditHistory([]);
    setPageMockups([]); setPagesGenerated(false); setShowSubmitForm(false);
    setSubmitted(false); setSubmitForm({ name: "", email: "", phone: "", company: "", notes: "" });
    setGeneratedCode(null); setActiveCodeTab(0); setCopiedFile(null);
  };

  const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.04 } } };
  const fadeUp = {
    hidden: { opacity: 0, y: 16, scale: 0.97 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: [0.25, 0.4, 0.25, 1] as [number, number, number, number] } },
  };

  return (
    <section className="section-padding relative z-10">
      <div className="container-narrow">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={stagger}>
          <motion.p variants={fadeUp} className="font-mono text-[11px] tracking-[0.2em] uppercase text-primary mb-4">
            // ai_project.generator
          </motion.p>
          <motion.h2 variants={fadeUp} className="font-display text-3xl md:text-5xl font-black tracking-tight mb-3">
            AI Project <span className="text-gradient">Idea Generator</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-muted-foreground text-lg mb-10 max-w-xl leading-relaxed">
            Walk through 5 steps to define your dream project — then let AI generate a full concept and landing page mockup.
          </motion.p>

          {/* Progress indicator */}
          <motion.div variants={fadeUp} className="flex items-center gap-2 mb-10">
            {STEPS.map((s, i) => (
              <div key={s.num} className="flex items-center gap-2">
                <button
                  onClick={() => { if (s.num < step) { setDirection(-1); setStep(s.num); } }}
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    s.num === step
                      ? "bg-primary text-primary-foreground shadow-[0_0_20px_hsl(var(--primary)/0.4)]"
                      : s.num < step
                        ? "bg-primary/20 text-primary cursor-pointer hover:bg-primary/30"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {s.num}
                </button>
                {i < STEPS.length - 1 && (
                  <div className={`w-8 h-0.5 rounded-full transition-colors duration-300 ${s.num < step ? "bg-primary/40" : "bg-muted"}`} />
                )}
              </div>
            ))}
            <span className="ml-4 font-mono text-[11px] tracking-[0.15em] uppercase text-muted-foreground hidden sm:block">
              {STEPS[step - 1].title}
            </span>
          </motion.div>

          {/* Step content */}
          {!concept && (
            <div className="relative min-h-[280px]">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div key={step} custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.35, ease: [0.25, 0.4, 0.25, 1] }}>
                  <div className="liquid-glass glass-shine rounded-2xl p-6 md:p-8">
                    <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-primary mb-2">Step {step} — {STEPS[step - 1].subtitle}</p>
                    <h3 className="font-display text-xl font-bold mb-6 text-foreground">{STEPS[step - 1].title}</h3>

                    {step === 1 && (
                      <div className="flex flex-wrap gap-3">
                        {ideaTiles.map((tile) => {
                          const Icon = iconMap[tile.icon] || Code;
                          const active = category === tile.label;
                          return (
                            <button key={tile.label} onClick={() => setCategory(tile.label)}
                              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${active ? "liquid-glass border-primary/40 bg-primary/10 text-primary ring-1 ring-primary/20 shadow-[0_0_20px_hsl(var(--primary)/0.15)]" : "liquid-glass text-muted-foreground hover:text-foreground hover:border-primary/30"}`}>
                              <Icon className="w-4 h-4" />{tile.label}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {step === 2 && (
                      <div className="flex flex-wrap gap-3">
                        {platformTiles.map((tile) => {
                          const Icon = iconMap[tile.icon] || Code;
                          const active = selectedPlatforms.includes(tile.label);
                          return (
                            <button key={tile.label} onClick={() => toggleMulti(tile.label, selectedPlatforms, setSelectedPlatforms)}
                              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${active ? "liquid-glass border-primary/40 bg-primary/10 text-primary ring-1 ring-primary/20 shadow-[0_0_20px_hsl(var(--primary)/0.15)]" : "liquid-glass text-muted-foreground hover:text-foreground hover:border-primary/30"}`}>
                              <Icon className="w-4 h-4" />{tile.label}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {step === 3 && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {audienceTiles.map((tile) => {
                          const Icon = iconMap[tile.icon] || Code;
                          const active = audience === tile.label;
                          return (
                            <button key={tile.label} onClick={() => setAudience(tile.label)}
                              className={`flex flex-col items-center gap-2 px-4 py-4 rounded-xl text-sm font-medium transition-all duration-200 ${active ? "liquid-glass border-primary/40 bg-primary/10 text-primary ring-1 ring-primary/20 shadow-[0_0_20px_hsl(var(--primary)/0.15)]" : "liquid-glass text-muted-foreground hover:text-foreground hover:border-primary/30"}`}>
                              <Icon className="w-5 h-5" />
                              <span className="font-bold">{tile.label}</span>
                              <span className="text-[11px] text-muted-foreground">{tile.description}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {step === 4 && (
                      <div className="flex flex-wrap gap-3">
                        {featureTiles.map((tile) => {
                          const Icon = iconMap[tile.icon] || Code;
                          const active = selectedFeatures.includes(tile.label);
                          return (
                            <button key={tile.label} onClick={() => toggleMulti(tile.label, selectedFeatures, setSelectedFeatures)}
                              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${active ? "liquid-glass border-primary/40 bg-primary/10 text-primary ring-1 ring-primary/20 shadow-[0_0_20px_hsl(var(--primary)/0.15)]" : "liquid-glass text-muted-foreground hover:text-foreground hover:border-primary/30"}`}>
                              <Icon className="w-4 h-4" />{tile.label}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {step === 5 && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {designStyleTiles.map((tile) => {
                          const Icon = iconMap[tile.icon] || Code;
                          const active = designStyle === tile.label;
                          return (
                            <button key={tile.label} onClick={() => setDesignStyle(tile.label)}
                              className={`flex flex-col items-center gap-2 px-4 py-5 rounded-xl text-sm font-medium transition-all duration-200 ${active ? "liquid-glass border-primary/40 bg-primary/10 text-primary ring-1 ring-primary/20 shadow-[0_0_20px_hsl(var(--primary)/0.15)]" : "liquid-glass text-muted-foreground hover:text-foreground hover:border-primary/30"}`}>
                              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${tile.preview} mb-1`} />
                              <Icon className="w-4 h-4" />
                              <span className="font-bold">{tile.label}</span>
                              <span className="text-[11px] text-muted-foreground">{tile.description}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-8">
                      <button onClick={goBack} disabled={step === 1}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                        <ChevronLeft className="w-4 h-4" /> Back
                      </button>
                      <div className="flex items-center gap-3">
                        {step < 5 ? (
                          <button onClick={goNext} disabled={!canProceed()}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold text-sm transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg">
                            Next <ChevronRight className="w-4 h-4" />
                          </button>
                        ) : (
                          <button onClick={generateConcept} disabled={!canProceed() || isGenerating}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold text-sm transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg">
                            {isGenerating ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</> : <><Shuffle className="w-4 h-4" /> Generate Concept</>}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          )}

          {/* Results */}
          {concept && !submitted && (
            <motion.div initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }} className="space-y-6">
              {/* Concept card */}
              <div className="liquid-glass glass-shine rounded-2xl p-6 md:p-8 border-primary/20">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-primary mb-2">// generated_concept</p>
                    <h3 className="font-display text-2xl md:text-3xl font-black text-foreground tracking-tight">{concept.name}</h3>
                    <p className="text-primary font-medium mt-1">{concept.tagline}</p>
                  </div>
                  <button onClick={resetFunnel} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground liquid-glass transition-colors">
                    <Shuffle className="w-3 h-3" /> Start Over
                  </button>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-6">{concept.description}</p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="font-mono text-[11px] tracking-[0.15em] uppercase text-primary mb-3">Key Features</p>
                    <ul className="space-y-2">
                      {concept.keyFeatures.map((f, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />{f}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="font-mono text-[11px] tracking-[0.15em] uppercase text-primary mb-3">Tech Stack</p>
                    <div className="flex flex-wrap gap-2">
                      {concept.techStack.map((t, i) => (
                        <span key={i} className="px-3 py-1 rounded-lg text-xs font-medium liquid-glass text-foreground">{t}</span>
                      ))}
                    </div>
                    <p className="font-mono text-[11px] tracking-[0.15em] uppercase text-primary mt-6 mb-2">Unique Value</p>
                    <p className="text-sm text-muted-foreground">{concept.uniqueValue}</p>
                  </div>
                </div>
              </div>

              {/* Landing Page Mockup section */}
              <div className="liquid-glass glass-shine rounded-2xl p-6 md:p-8">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-primary mb-1">// landing_page_mockup</p>
                    <h4 className="font-display text-lg font-bold text-foreground">AI-Generated Landing Page</h4>
                  </div>
                  {!mockupImage && !isGeneratingMockup && (
                    <button onClick={() => generateMockup()} disabled={isGeneratingMockup}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold text-sm transition-all hover:opacity-90 disabled:opacity-40 shadow-lg">
                      <ImageIcon className="w-4 h-4" /> Generate Mockup
                    </button>
                  )}
                </div>

                {isGeneratingMockup && !mockupImage && (
                  <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <div className="w-16 h-16 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
                    <p className="text-sm text-muted-foreground">AI is designing your landing page...</p>
                    <p className="text-[11px] text-muted-foreground/60">This usually takes 10-15 seconds</p>
                  </div>
                )}

                {mockupImage && (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="mt-4">
                    <div className="rounded-xl overflow-hidden border border-border shadow-2xl">
                      <img src={mockupImage} alt={`Landing page mockup for ${concept.name}`} className="w-full h-auto" />
                    </div>

                    {/* Controls: Regenerate + Edit */}
                    <div className="mt-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-[11px] text-muted-foreground">Generated with Nano Banana Pro • {designStyle} style</p>
                        <button onClick={() => generateMockup(editHistory.length > 0 ? editHistory.join("\n") : undefined)} disabled={isGeneratingMockup}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground liquid-glass transition-colors disabled:opacity-40">
                          {isGeneratingMockup ? <Loader2 className="w-3 h-3 animate-spin" /> : <Shuffle className="w-3 h-3" />} Regenerate
                        </button>
                      </div>

                      {/* Edit instructions input */}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={editInput}
                          onChange={(e) => setEditInput(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && !isApplyingEdit && applyEdit()}
                          placeholder="Describe changes (fonts, colors, copy, layout...)"
                          className="flex-1 px-4 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
                        />
                        <button onClick={applyEdit} disabled={!editInput.trim() || isApplyingEdit}
                          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                          {isApplyingEdit ? <Loader2 className="w-4 h-4 animate-spin" /> : <Pencil className="w-4 h-4" />} Apply
                        </button>
                      </div>

                      {editHistory.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {editHistory.map((edit, i) => (
                            <span key={i} className="px-2 py-1 rounded-lg text-[10px] font-mono bg-muted text-muted-foreground">{edit}</span>
                          ))}
                        </div>
                      )}

                      {/* Action buttons row */}
                      <div className="flex flex-col sm:flex-row gap-3 mt-4">
                        {!pagesGenerated && !isGeneratingPages && (
                          <button onClick={generatePages} disabled={isGeneratingPages}
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold text-sm transition-all hover:opacity-90 shadow-lg">
                            <FileImage className="w-4 h-4" /> Generate 5 Main Pages
                          </button>
                        )}
                        {!generatedCode && !isGeneratingCode && (
                          <button onClick={generateCode} disabled={isGeneratingCode}
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold text-sm transition-all hover:opacity-90 shadow-lg">
                            <FileCode2 className="w-4 h-4" /> Generate Code
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Generating pages loading */}
              {isGeneratingPages && (
                <div className="liquid-glass glass-shine rounded-2xl p-6 md:p-8">
                  <div className="flex flex-col items-center justify-center py-16 gap-4">
                    <div className="w-16 h-16 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
                    <p className="text-sm text-muted-foreground">Generating 5 pages: About, Features, Pricing, Dashboard, Contact...</p>
                    <p className="text-[11px] text-muted-foreground/60">This may take up to a minute</p>
                  </div>
                </div>
              )}

              {/* Code generation loading */}
              {isGeneratingCode && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="liquid-glass glass-shine rounded-2xl p-6 md:p-8">
                  <div className="flex flex-col items-center justify-center py-16 gap-4">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin" />
                      <FileCode2 className="w-6 h-6 text-emerald-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <p className="text-sm text-muted-foreground font-medium">AI is writing your code...</p>
                    <p className="text-[11px] text-muted-foreground/60">Generating HTML, CSS, and JavaScript files</p>
                    <div className="flex gap-1 mt-2">
                      {[0, 1, 2].map((i) => (
                        <motion.div key={i} className="w-2 h-2 rounded-full bg-emerald-500" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }} />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Generated Code Preview */}
              {generatedCode && generatedCode.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="liquid-glass glass-shine rounded-2xl overflow-hidden">
                  <div className="px-6 pt-6 pb-3">
                    <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-emerald-400 mb-1">// generated_code</p>
                    <div className="flex items-center justify-between">
                      <h4 className="font-display text-lg font-bold text-foreground">{generatedCode.length} Files Generated</h4>
                      <button onClick={() => { setGeneratedCode(null); generateCode(); }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-mono text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
                        <Shuffle className="w-3 h-3" /> Regenerate
                      </button>
                    </div>
                  </div>

                  {/* File tabs */}
                  <div className="flex overflow-x-auto border-b border-border bg-muted/30 px-2">
                    {generatedCode.map((file, i) => (
                      <button key={file.filename} onClick={() => setActiveCodeTab(i)}
                        className={`flex items-center gap-1.5 px-3 py-2 text-xs font-mono whitespace-nowrap border-b-2 transition-colors ${
                          activeCodeTab === i ? 'border-emerald-500 text-emerald-400 bg-background/50' : 'border-transparent text-muted-foreground hover:text-foreground'
                        }`}>
                        <FileCode2 className="w-3 h-3" />
                        {file.filename}
                      </button>
                    ))}
                  </div>

                  {/* Code content */}
                  <div className="relative">
                    <button onClick={() => copyToClipboard(generatedCode[activeCodeTab].filename, generatedCode[activeCodeTab].content)}
                      className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-muted/80 backdrop-blur-sm text-[11px] font-mono text-muted-foreground hover:text-foreground transition-colors z-10">
                      {copiedFile === generatedCode[activeCodeTab].filename ? (
                        <><CheckCheck className="w-3 h-3 text-emerald-500" /> Copied!</>
                      ) : (
                        <><Copy className="w-3 h-3" /> Copy</>
                      )}
                    </button>
                    <pre className="p-4 overflow-x-auto max-h-[400px] overflow-y-auto text-xs leading-relaxed font-mono text-foreground/80 bg-[#0a0a0a]">
                      <code>{generatedCode[activeCodeTab].content}</code>
                    </pre>
                  </div>

                  {/* Download button inside code panel */}
                  <div className="px-6 py-4 border-t border-border bg-muted/20">
                    <button onClick={downloadProject} disabled={isDownloading}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-bold text-sm transition-all hover:opacity-90 disabled:opacity-40 shadow-lg">
                      {isDownloading ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Creating ZIP...</>
                      ) : (
                        <><Download className="w-4 h-4" /> Download Project (.zip)</>
                      )}
                    </button>
                    <p className="text-[11px] text-muted-foreground/60 text-center mt-2">
                      Includes {generatedCode.length} code files{mockupImage ? ', screenshots' : ''}, and README
                    </p>
                  </div>
                </motion.div>
              )}

              {/* 5 Pages grid */}
              {pagesGenerated && pageMockups.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="liquid-glass glass-shine rounded-2xl p-6 md:p-8">
                  <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-primary mb-2">// inner_pages</p>
                  <h4 className="font-display text-lg font-bold text-foreground mb-6">5 Main Pages</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {pageMockups.map((page, i) => (
                      <div key={i} className="rounded-xl overflow-hidden border border-border">
                        <div className="px-3 py-2 bg-muted/50 border-b border-border">
                          <p className="text-xs font-bold text-foreground">{page.pageName}</p>
                        </div>
                        {page.imageUrl ? (
                          <img src={page.imageUrl} alt={`${page.pageName} page`} className="w-full h-auto" />
                        ) : (
                          <div className="flex items-center justify-center h-40 text-muted-foreground text-xs">Failed to generate</div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Action buttons below pages */}
                  <div className="flex flex-col sm:flex-row gap-3 mt-6">
                    {/* Download button (if code exists, or screenshots-only download) */}
                    {!generatedCode && !isGeneratingCode && (
                      <button onClick={generateCode}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold text-sm transition-all hover:opacity-90 shadow-lg">
                        <FileCode2 className="w-4 h-4" /> Generate Code
                      </button>
                    )}
                    <button onClick={downloadProject} disabled={isDownloading}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-bold text-sm transition-all hover:opacity-90 disabled:opacity-40 shadow-lg">
                      {isDownloading ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Creating ZIP...</>
                      ) : (
                        <><Download className="w-4 h-4" /> Download {generatedCode ? 'Project' : 'Screenshots'} (.zip)</>
                      )}
                    </button>
                  </div>

                  {/* Move Forward button */}
                  {!showSubmitForm && (
                    <button onClick={() => setShowSubmitForm(true)}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold text-sm transition-all hover:opacity-90 shadow-lg mt-4">
                      <Rocket className="w-4 h-4" /> Move Forward with This Project
                    </button>
                  )}
                </motion.div>
              )}

              {/* Submission form */}
              {showSubmitForm && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="liquid-glass glass-shine rounded-2xl p-6 md:p-8 border-primary/20">
                  <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-primary mb-2">// submit_project</p>
                  <h4 className="font-display text-lg font-bold text-foreground mb-1">Let's Build This Together</h4>
                  <p className="text-sm text-muted-foreground mb-6">Fill out your info and I'll review your project and get back to you.</p>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input type="text" placeholder="Your Name *" value={submitForm.name} onChange={(e) => setSubmitForm({ ...submitForm, name: e.target.value })}
                          className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50" />
                      </div>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input type="email" placeholder="Email Address *" value={submitForm.email} onChange={(e) => setSubmitForm({ ...submitForm, email: e.target.value })}
                          className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50" />
                      </div>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input type="tel" placeholder="Phone (optional)" value={submitForm.phone} onChange={(e) => setSubmitForm({ ...submitForm, phone: e.target.value })}
                          className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50" />
                      </div>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input type="text" placeholder="Company (optional)" value={submitForm.company} onChange={(e) => setSubmitForm({ ...submitForm, company: e.target.value })}
                          className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50" />
                      </div>
                    </div>
                    <div className="relative">
                      <FileText className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <textarea placeholder="Additional notes or requirements (optional)" rows={3} value={submitForm.notes} onChange={(e) => setSubmitForm({ ...submitForm, notes: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 resize-none" />
                    </div>
                    <button onClick={handleSubmit} disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold text-sm transition-all hover:opacity-90 disabled:opacity-40 shadow-lg">
                      {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</> : <><Send className="w-4 h-4" /> Submit Project</>}
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Success screen */}
          {submitted && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
              className="liquid-glass glass-shine rounded-2xl p-8 md:p-12 text-center border-primary/20">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
                <Check className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-display text-2xl font-black text-foreground mb-2">Project Submitted!</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Your project "{concept?.name}" has been submitted successfully. I'll review it and get back to you soon.
              </p>
              <button onClick={resetFunnel}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground liquid-glass transition-colors mx-auto">
                <Shuffle className="w-3 h-3" /> Generate Another Project
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
