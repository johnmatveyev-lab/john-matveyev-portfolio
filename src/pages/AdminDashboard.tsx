import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getProjects, deleteProject, updateProject, addProject } from "@/data/projects";
import { Project, PLATFORMS, TAG_OPTIONS, GRADIENT_OPTIONS } from "@/types/project";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  LogOut, Plus, Pencil, Trash2, Star, StarOff, ExternalLink, Github,
  LayoutDashboard, FolderOpen, X, Inbox, ChevronDown, ChevronUp, Eye,
  MessageSquare, Quote, Settings, Search, Archive, MailOpen, Mail,
  RefreshCw, Loader2, ToggleLeft, ToggleRight, Save, AlertTriangle, Calendar,
} from "lucide-react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";

// ─── Helper ──────────────────────────────────────────────────────────────────
const adminFetch = async (resource: string, method: string, body?: unknown) => {
  const pw = sessionStorage.getItem("jm_admin_pw") || "";
  const opts: any = { method, headers: { "x-admin-password": pw } };
  if (body) opts.body = body;
  const { data, error } = await supabase.functions.invoke(
    `admin-submissions?resource=${resource}`, opts,
  );
  if (error) throw error;
  if (data?.error) throw new Error(data.error);
  return data;
};

// ─── Project Form (Enhanced) ─────────────────────────────────────────────────
function ProjectForm({
  initial, onSave, onCancel,
}: { initial?: Project; onSave: (data: Omit<Project, "id">) => void; onCancel: () => void }) {
  const [form, setForm] = useState({
    title: initial?.title || "",
    description: initial?.description || "",
    tags: initial?.tags || [] as string[],
    repoUrl: initial?.repoUrl || "",
    liveUrl: initial?.liveUrl || "",
    platform: initial?.platform || PLATFORMS[0],
    thumbnailUrl: initial?.thumbnailUrl || "",
    createdAt: initial?.createdAt || new Date().toISOString().split("T")[0],
    featured: initial?.featured || false,
    role: initial?.role || "",
    tech: initial?.tech || [] as string[],
    gradient: initial?.gradient || "blue" as "blue" | "violet" | "emerald" | "pink",
    category: initial?.category || "",
    iconName: initial?.iconName || "",
  });
  const [techInput, setTechInput] = useState("");
  const toggleTag = (tag: string) => setForm((f) => ({ ...f, tags: f.tags.includes(tag) ? f.tags.filter((t) => t !== tag) : [...f.tags, tag] }));
  const addTech = () => {
    if (techInput.trim() && !form.tech.includes(techInput.trim())) {
      setForm({ ...form, tech: [...form.tech, techInput.trim()] });
      setTechInput("");
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">{initial ? "Edit Project" : "New Project"}</h3>
        <button onClick={onCancel} className="text-muted-foreground hover:text-foreground p-2" aria-label="Cancel"><X size={18} /></button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="mono text-[10px] text-muted-foreground mb-1 block">Title *</label>
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/50" />
        </div>
        <div>
          <label className="mono text-[10px] text-muted-foreground mb-1 block">Role</label>
          <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="e.g. Full-Stack Developer"
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/50" />
        </div>
      </div>

      <div>
        <label className="mono text-[10px] text-muted-foreground mb-1 block">Description</label>
        <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/50 resize-none" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mono text-[10px] text-muted-foreground mb-1 block">GitHub URL</label>
          <input value={form.repoUrl} onChange={(e) => setForm({ ...form, repoUrl: e.target.value })}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/50" />
        </div>
        <div>
          <label className="mono text-[10px] text-muted-foreground mb-1 block">Live URL</label>
          <input value={form.liveUrl} onChange={(e) => setForm({ ...form, liveUrl: e.target.value })}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/50" />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label className="mono text-[10px] text-muted-foreground mb-1 block">Platform</label>
          <select value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/50">
            {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div>
          <label className="mono text-[10px] text-muted-foreground mb-1 block">Date</label>
          <input type="date" value={form.createdAt} onChange={(e) => setForm({ ...form, createdAt: e.target.value })}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/50" />
        </div>
        <div>
          <label className="mono text-[10px] text-muted-foreground mb-1 block">Gradient</label>
          <select value={form.gradient} onChange={(e) => setForm({ ...form, gradient: e.target.value as any })}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/50">
            {GRADIENT_OPTIONS.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
        <div>
          <label className="mono text-[10px] text-muted-foreground mb-1 block">Icon Name</label>
          <input value={form.iconName} onChange={(e) => setForm({ ...form, iconName: e.target.value })} placeholder="e.g. Brain"
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/50" />
        </div>
      </div>

      <div>
        <label className="mono text-[10px] text-muted-foreground mb-1 block">Thumbnail URL</label>
        <input value={form.thumbnailUrl} onChange={(e) => setForm({ ...form, thumbnailUrl: e.target.value })} placeholder="https://..."
          className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/50" />
      </div>

      <div>
        <label className="mono text-[10px] text-muted-foreground mb-1 block">Category</label>
        <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="e.g. AI/ML, Web App"
          className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/50" />
      </div>

      {/* Tech stack */}
      <div>
        <label className="mono text-[10px] text-muted-foreground mb-1 block">Tech Stack</label>
        <div className="flex gap-2 mb-2">
          <input value={techInput} onChange={(e) => setTechInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTech())}
            placeholder="Add technology..."
            className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/50" />
          <button type="button" onClick={addTech} className="px-3 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm hover:opacity-80">Add</button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {form.tech.map((t) => (
            <span key={t} className="mono text-[10px] px-2 py-1 rounded bg-primary/10 text-primary flex items-center gap-1">
              {t}
              <button onClick={() => setForm({ ...form, tech: form.tech.filter((x) => x !== t) })} className="hover:text-destructive p-1" aria-label={`Remove tech ${t}`}><X size={10} /></button>
            </span>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="mono text-[10px] text-muted-foreground mb-2 block">Tags</label>
        <div className="flex flex-wrap gap-2">
          {TAG_OPTIONS.map((tag) => (
            <button key={tag} type="button" onClick={() => toggleTag(tag)}
              className={`mono text-[10px] px-2 py-1 rounded border transition-colors ${form.tags.includes(tag) ? "bg-primary/20 border-primary/40 text-primary" : "border-border text-muted-foreground hover:border-primary/30"}`}>{tag}</button>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
        <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="accent-primary" />
        Featured project
      </label>

      <button onClick={() => onSave(form)} disabled={!form.title.trim()}
        className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40">
        {initial ? "Save Changes" : "Create Project"}
      </button>
    </div>
  );
}

// ─── Submission Card ─────────────────────────────────────────────────────────
interface Submission {
  id: string; created_at: string; status: string;
  user_name: string; user_email: string; user_phone?: string; user_company?: string; user_notes?: string;
  project_name: string; project_tagline?: string; project_description?: string;
  project_category?: string; project_audience?: string; project_design_style?: string;
  project_platforms?: string[]; project_features?: string[]; project_tech_stack?: string[]; project_key_features?: string[];
  mockup_landing_page?: string; mockup_pages?: { pageName: string; imageUrl: string }[];
  edit_instructions?: string[];
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400",
  reviewed: "bg-blue-500/20 text-blue-400",
  accepted: "bg-emerald-500/20 text-emerald-400",
  rejected: "bg-red-500/20 text-red-400",
};

function SubmissionCard({ sub, onStatusChange, onDelete }: {
  sub: Submission; onStatusChange: (id: string, status: string) => void; onDelete: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="px-5 py-4 flex items-center justify-between gap-4 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-sm font-medium truncate">{sub.project_name}</p>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${STATUS_COLORS[sub.status] || STATUS_COLORS.pending}`}>{sub.status}</span>
          </div>
          <p className="mono text-xs text-muted-foreground">{sub.user_name} · {sub.user_email} · {new Date(sub.created_at).toLocaleDateString()}</p>
        </div>
        {expanded ? <ChevronUp size={14} className="text-muted-foreground" /> : <ChevronDown size={14} className="text-muted-foreground" />}
      </div>
      {expanded && (
        <div className="px-5 pb-5 border-t border-border pt-4 space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div><p className="mono text-[10px] text-muted-foreground mb-1">Name</p><p className="text-sm">{sub.user_name}</p></div>
            <div><p className="mono text-[10px] text-muted-foreground mb-1">Email</p><p className="text-sm">{sub.user_email}</p></div>
            {sub.user_phone && <div><p className="mono text-[10px] text-muted-foreground mb-1">Phone</p><p className="text-sm">{sub.user_phone}</p></div>}
            {sub.user_company && <div><p className="mono text-[10px] text-muted-foreground mb-1">Company</p><p className="text-sm">{sub.user_company}</p></div>}
          </div>
          {sub.user_notes && <div><p className="mono text-[10px] text-muted-foreground mb-1">Notes</p><p className="text-sm text-muted-foreground">{sub.user_notes}</p></div>}
          <div className="space-y-2">
            <p className="mono text-[10px] text-muted-foreground">Project Concept</p>
            {sub.project_tagline && <p className="text-sm text-primary font-medium">{sub.project_tagline}</p>}
            {sub.project_description && <p className="text-sm text-muted-foreground">{sub.project_description}</p>}
            <div className="flex flex-wrap gap-1">
              {sub.project_category && <span className="text-[10px] px-2 py-0.5 rounded bg-muted text-muted-foreground">{sub.project_category}</span>}
              {sub.project_audience && <span className="text-[10px] px-2 py-0.5 rounded bg-muted text-muted-foreground">{sub.project_audience}</span>}
              {sub.project_design_style && <span className="text-[10px] px-2 py-0.5 rounded bg-muted text-muted-foreground">{sub.project_design_style}</span>}
            </div>
            {sub.project_key_features && sub.project_key_features.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {sub.project_key_features.map((f, i) => <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-primary/10 text-primary">{f}</span>)}
              </div>
            )}
          </div>
          {sub.mockup_landing_page && (
            <div>
              <p className="mono text-[10px] text-muted-foreground mb-2">Landing Page Mockup</p>
              <img src={sub.mockup_landing_page} alt="Landing page" className="w-full max-w-lg rounded-lg border border-border" />
            </div>
          )}
          {sub.mockup_pages && sub.mockup_pages.length > 0 && (
            <div>
              <p className="mono text-[10px] text-muted-foreground mb-2">Inner Pages</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {sub.mockup_pages.map((page, i) => (
                  <div key={i} className="rounded-lg overflow-hidden border border-border">
                    <div className="px-2 py-1 bg-muted/50 border-b border-border"><p className="text-[10px] font-bold">{page.pageName}</p></div>
                    {page.imageUrl ? <img src={page.imageUrl} alt={page.pageName} className="w-full h-auto" /> : <div className="h-20 flex items-center justify-center text-[10px] text-muted-foreground">N/A</div>}
                  </div>
                ))}
              </div>
            </div>
          )}
          {sub.edit_instructions && sub.edit_instructions.length > 0 && (
            <div>
              <p className="mono text-[10px] text-muted-foreground mb-1">Edit History</p>
              <div className="flex flex-wrap gap-1">
                {sub.edit_instructions.map((e, i) => <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-muted text-muted-foreground">{e}</span>)}
              </div>
            </div>
          )}
          <div className="flex items-center gap-2 pt-2 border-t border-border">
            <select value={sub.status} onChange={(e) => onStatusChange(sub.id, e.target.value)}
              className="px-3 py-1.5 bg-background border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary/50">
              <option value="pending">Pending</option><option value="reviewed">Reviewed</option>
              <option value="accepted">Accepted</option><option value="rejected">Rejected</option>
            </select>
            <button onClick={() => onDelete(sub.id)}
              className="text-muted-foreground hover:text-destructive transition-colors ml-auto"><Trash2 size={14} /></button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Message Card ────────────────────────────────────────────────────────────
interface ContactMessage {
  id: string; created_at: string; name: string; email: string;
  message: string; is_read: boolean; is_archived: boolean;
}

function MessageCard({ msg, onToggleRead, onArchive, onDelete }: {
  msg: ContactMessage;
  onToggleRead: (id: string, read: boolean) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className={`bg-card border rounded-xl px-5 py-4 transition-colors ${msg.is_read ? "border-border" : "border-primary/30 bg-primary/[0.03]"}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            {!msg.is_read && <div className="w-2 h-2 rounded-full bg-primary shrink-0" />}
            <p className="text-sm font-medium truncate">{msg.name}</p>
            <span className="mono text-[10px] text-muted-foreground">{msg.email}</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{msg.message}</p>
          <p className="mono text-[10px] text-muted-foreground mt-2">{new Date(msg.created_at).toLocaleString()}</p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button onClick={() => onToggleRead(msg.id, !msg.is_read)} title={msg.is_read ? "Mark unread" : "Mark read"}
            className="text-muted-foreground hover:text-foreground transition-colors p-1">
            {msg.is_read ? <Mail size={14} /> : <MailOpen size={14} />}
          </button>
          <a href={`mailto:${msg.email}`} className="text-muted-foreground hover:text-primary transition-colors p-1"><ExternalLink size={14} /></a>
          <button onClick={() => onArchive(msg.id)} aria-label="Archive message" title="Archive" className="text-muted-foreground hover:text-foreground transition-colors p-2"><Archive size={14} /></button>
          <button onClick={() => onDelete(msg.id)} aria-label="Delete message" className="text-muted-foreground hover:text-destructive transition-colors p-2"><Trash2 size={14} /></button>
        </div>
      </div>
    </div>
  );
}

// ─── Booking Card ────────────────────────────────────────────────────────────
export interface Booking {
  id: string; created_at: string; name: string; email: string;
  date: string; time: string; notes: string; is_archived: boolean;
}

function BookingCard({ booking, onArchive, onDelete }: {
  booking: Booking;
  onArchive: (id: string, archive: boolean) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className={`bg-card border rounded-xl px-5 py-4 transition-colors border-border`}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-sm font-medium truncate">{booking.name}</p>
            <span className="mono text-[10px] text-muted-foreground">{booking.email}</span>
          </div>
          <div className="flex items-center gap-3 text-sm mt-2">
            <div className="flex items-center gap-1.5 text-primary">
              <Calendar size={14} />
              <span className="font-medium">{booking.date} at {booking.time}</span>
            </div>
          </div>
          {booking.notes && <p className="text-sm text-muted-foreground mt-2">{booking.notes}</p>}
          <p className="mono text-[10px] text-muted-foreground mt-3">Booked on: {new Date(booking.created_at).toLocaleString()}</p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <a href={`mailto:${booking.email}`} className="text-muted-foreground hover:text-primary transition-colors p-1"><ExternalLink size={14} /></a>
          <button onClick={() => onArchive(booking.id, !booking.is_archived)} aria-label={booking.is_archived ? "Unarchive booking" : "Archive booking"} title={booking.is_archived ? "Unarchive" : "Archive"} className="text-muted-foreground hover:text-foreground transition-colors p-2"><Archive size={14} /></button>
          <button onClick={() => onDelete(booking.id)} aria-label="Delete booking" className="text-muted-foreground hover:text-destructive transition-colors p-2"><Trash2 size={14} /></button>
        </div>
      </div>
    </div>
  );
}

// ─── Testimonial Form ────────────────────────────────────────────────────────
interface TestimonialData {
  id?: string; name: string; role: string; avatar_url: string;
  quote: string; rating: number; visible: boolean; sort_order: number;
}

function TestimonialForm({ initial, onSave, onCancel }: {
  initial?: TestimonialData; onSave: (data: TestimonialData) => void; onCancel: () => void;
}) {
  const [form, setForm] = useState<TestimonialData>(initial || {
    name: "", role: "", avatar_url: "", quote: "", rating: 5, visible: true, sort_order: 0,
  });
  return (
    <div className="bg-card border border-border rounded-xl p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-sm">{initial?.id ? "Edit Testimonial" : "New Testimonial"}</h3>
        <button onClick={onCancel} aria-label="Cancel" className="text-muted-foreground hover:text-foreground p-2"><X size={18} /></button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mono text-[10px] text-muted-foreground mb-1 block">Name *</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/50" />
        </div>
        <div>
          <label className="mono text-[10px] text-muted-foreground mb-1 block">Role *</label>
          <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="e.g. CTO, Acme Inc"
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/50" />
        </div>
      </div>
      <div>
        <label className="mono text-[10px] text-muted-foreground mb-1 block">Quote *</label>
        <textarea rows={3} value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })}
          className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/50 resize-none" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="mono text-[10px] text-muted-foreground mb-1 block">Rating</label>
          <select value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/50">
            {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} ★</option>)}
          </select>
        </div>
        <div>
          <label className="mono text-[10px] text-muted-foreground mb-1 block">Sort Order</label>
          <input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/50" />
        </div>
        <div className="flex items-end pb-1">
          <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
            <input type="checkbox" checked={form.visible} onChange={(e) => setForm({ ...form, visible: e.target.checked })} className="accent-primary" />
            Visible
          </label>
        </div>
      </div>
      <div>
        <label className="mono text-[10px] text-muted-foreground mb-1 block">Avatar URL</label>
        <input value={form.avatar_url} onChange={(e) => setForm({ ...form, avatar_url: e.target.value })} placeholder="https://..."
          className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/50" />
      </div>
      <button onClick={() => onSave(form)} disabled={!form.name.trim() || !form.quote.trim()}
        className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40">
        {initial?.id ? "Save Changes" : "Create Testimonial"}
      </button>
    </div>
  );
}

// ─── Chart Colors ────────────────────────────────────────────────────────────
const CHART_COLORS = ["hsl(187, 90%, 48%)", "hsl(40, 85%, 55%)", "hsl(142, 71%, 45%)", "hsl(262, 83%, 58%)", "hsl(0, 72%, 51%)", "hsl(200, 80%, 50%)"];

// ─── Admin Dashboard ─────────────────────────────────────────────────────────
type ViewType = "overview" | "projects" | "submissions" | "messages" | "appointments" | "testimonials" | "settings";

export default function AdminDashboard() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [view, setView] = useState<ViewType>("overview");

  // Submissions
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loadingSubs, setLoadingSubs] = useState(false);
  const [subSearch, setSubSearch] = useState("");
  const [subStatusFilter, setSubStatusFilter] = useState("");

  // Messages
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [showArchived, setShowArchived] = useState(false);

  // Bookings
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [showArchivedBookings, setShowArchivedBookings] = useState(false);

  // Testimonials
  const [testimonials, setTestimonials] = useState<TestimonialData[]>([]);
  const [loadingTestimonials, setLoadingTestimonials] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<TestimonialData | null>(null);
  const [showNewTestimonial, setShowNewTestimonial] = useState(false);

  // Settings
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loadingSettings, setLoadingSettings] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);

  // Search
  const [projectSearch, setProjectSearch] = useState("");

  // Delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: string; id: string; label: string } | null>(null);

  // ── Auth gate ──
  useEffect(() => {
    if (!isAuthenticated) { navigate("/admin"); return; }
    const bootstrap = async () => {
      const data = await getProjects();
      setProjects(data);
      await fetchSubmissions();
      await fetchMessages();
      await fetchBookings();
    };
    bootstrap();

    const messageSub = supabase
      .channel("public:messages")
      .on("postgres_changes", { event: "*", schema: "public", table: "messages" }, (payload) => {
        if (payload.eventType === "INSERT") {
          toast.info("New message received!");
        }
        fetchMessages();
      })
      .subscribe();

    const submissionsSub = supabase
      .channel("public:submissions")
      .on("postgres_changes", { event: "*", schema: "public", table: "submissions" }, (payload) => {
        if (payload.eventType === "INSERT") {
          toast.info("New submission received!");
        }
        fetchSubmissions();
      })
      .subscribe();

    const projectsSub = supabase
      .channel("public:projects")
      .on("postgres_changes", { event: "*", schema: "public", table: "projects" }, () => {
        refresh();
      })
      .subscribe();

    const bookingsSub = supabase
      .channel("public:bookings")
      .on("postgres_changes", { event: "*", schema: "public", table: "bookings" }, (payload) => {
        if (payload.eventType === "INSERT") {
          toast.info("New booking received!");
        }
        fetchBookings();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(messageSub);
      supabase.removeChannel(submissionsSub);
      supabase.removeChannel(projectsSub);
      supabase.removeChannel(bookingsSub);
    };
  }, [isAuthenticated, navigate]);

  // ── Data fetching ──
  const fetchSubmissions = async () => {
    setLoadingSubs(true);
    try {
      const data = await adminFetch("submissions", "GET");
      setSubmissions(Array.isArray(data) ? data : []);
    } catch (e: any) { console.error(e); }
    finally { setLoadingSubs(false); }
  };

  const fetchMessages = async () => {
    setLoadingMsgs(true);
    try {
      const data = await adminFetch("messages", "GET");
      setMessages(Array.isArray(data) ? data : []);
    } catch (e: any) { console.error(e); }
    finally { setLoadingMsgs(false); }
  };

  const fetchBookings = async () => {
    setLoadingBookings(true);
    try {
      const data = await adminFetch(`bookings?archived=${showArchivedBookings}`, "GET");
      setBookings(Array.isArray(data) ? data : []);
    } catch (e: any) { console.error(e); }
    finally { setLoadingBookings(false); }
  };

  const fetchTestimonials = async () => {
    setLoadingTestimonials(true);
    try {
      const data = await adminFetch("testimonials", "GET");
      setTestimonials(Array.isArray(data) ? data : []);
    } catch (e: any) { console.error(e); }
    finally { setLoadingTestimonials(false); }
  };

  const fetchSettings = async () => {
    setLoadingSettings(true);
    try {
      const data = await adminFetch("settings", "GET");
      const map: Record<string, string> = {};
      if (Array.isArray(data)) data.forEach((s: any) => { map[s.key] = s.value; });
      setSettings(map);
    } catch (e: any) { console.error(e); }
    finally { setLoadingSettings(false); }
  };

  useEffect(() => {
    if (view === "testimonials" && testimonials.length === 0) fetchTestimonials();
    if (view === "settings" && Object.keys(settings).length === 0) fetchSettings();
  }, [view]);

  // ── Project CRUD ──
  const refresh = async () => {
    const data = await getProjects();
    setProjects(data);
  };
  const handleDelete = async (id: string) => {
    try {
      await deleteProject(id);
      await refresh();
      toast.success("Project deleted");
    } catch {
      toast.error("Failed to delete project");
    }
  };
  const handleToggleFeatured = async (id: string, current: boolean) => {
    try {
      await updateProject(id, { featured: !current });
      await refresh();
      toast.success(current ? "Removed from featured" : "Added to featured");
    } catch {
      toast.error("Failed to update project");
    }
  };
  const handleSaveNew = async (data: Omit<Project, "id">) => {
    try {
      await addProject(data as any);
      setShowNew(false);
      await refresh();
      toast.success("Project created");
    } catch {
      toast.error("Failed to create project");
    }
  };
  const handleSaveEdit = async (id: string, data: Omit<Project, "id">) => {
    try {
      await updateProject(id, data as any);
      setEditingId(null);
      await refresh();
      toast.success("Project updated");
    } catch {
      toast.error("Failed to update project");
    }
  };

  // ── Submission actions ──
  const updateSubStatus = async (id: string, status: string) => {
    try {
      await adminFetch("submissions", "PATCH", { id, status });
      setSubmissions((s) => s.map((sub) => sub.id === id ? { ...sub, status } : sub));
      toast.success(`Status updated to ${status}`);
    } catch { toast.error("Failed to update status"); }
  };
  const deleteSub = async (id: string) => {
    try {
      await adminFetch("submissions", "DELETE", { id });
      setSubmissions((s) => s.filter((sub) => sub.id !== id));
      toast.success("Submission deleted");
    } catch { toast.error("Failed to delete"); }
  };

  // ── Message actions ──
  const toggleMsgRead = async (id: string, read: boolean) => {
    try {
      await adminFetch("messages", "PATCH", { id, is_read: read });
      setMessages((m) => m.map((msg) => msg.id === id ? { ...msg, is_read: read } : msg));
    } catch { toast.error("Failed to update"); }
  };
  const archiveMsg = async (id: string) => {
    try {
      await adminFetch("messages", "PATCH", { id, is_archived: true, is_read: true });
      setMessages((m) => m.filter((msg) => msg.id !== id));
      toast.success("Message archived");
    } catch { toast.error("Failed to archive"); }
  };
  const deleteMsg = async (id: string) => {
    try {
      await adminFetch("messages", "DELETE", { id });
      setMessages((m) => m.filter((msg) => msg.id !== id));
      toast.success("Message deleted");
    } catch { toast.error("Failed to delete"); }
  };

  // ── Booking actions ──
  const toggleBookingArchive = async (id: string, archive: boolean) => {
    try {
      await adminFetch("bookings", "PATCH", { id, is_archived: archive });
      setBookings((b) => b.filter((booking) => booking.id !== id)); // Remove from current view upon toggling archive
      toast.success(archive ? "Booking archived" : "Booking unarchived");
      // Optionally refetch based on current `showArchivedBookings` state if we want to keep them in the list
    } catch { toast.error("Failed to update booking status"); }
  };

  const deleteBooking = async (id: string) => {
    try {
      await adminFetch("bookings", "DELETE", { id });
      setBookings((b) => b.filter((booking) => booking.id !== id));
      toast.success("Booking deleted");
    } catch { toast.error("Failed to delete booking"); }
  };

  // ── Testimonial actions ──
  const saveTestimonial = async (data: TestimonialData) => {
    try {
      if (data.id) {
        const { id, ...updates } = data;
        await adminFetch("testimonials", "PATCH", { id, ...updates });
        toast.success("Testimonial updated");
      } else {
        await adminFetch("testimonials", "POST", data);
        toast.success("Testimonial created");
      }
      setEditingTestimonial(null);
      setShowNewTestimonial(false);
      fetchTestimonials();
    } catch { toast.error("Failed to save testimonial"); }
  };
  const deleteTestimonial = async (id: string) => {
    try {
      await adminFetch("testimonials", "DELETE", { id });
      setTestimonials((t) => t.filter((x) => x.id !== id));
      toast.success("Testimonial deleted");
    } catch { toast.error("Failed to delete"); }
  };

  // ── Settings save ──
  const saveSetting = async (key: string, value: string) => {
    setSavingSettings(true);
    try {
      await adminFetch("settings", "PATCH", { key, value });
      setSettings((s) => ({ ...s, [key]: value }));
      toast.success("Setting saved");
    } catch { toast.error("Failed to save"); }
    finally { setSavingSettings(false); }
  };

  // ── Computed ──
  const featuredCount = projects.filter((p) => p.featured).length;
  const pendingCount = submissions.filter((s) => s.status === "pending").length;
  const unreadCount = messages.filter((m) => !m.is_read && !m.is_archived).length;
  const activeBookingsCount = bookings.filter((b) => !b.is_archived).length;

  const filteredProjects = useMemo(() => {
    if (!projectSearch) return projects;
    const q = projectSearch.toLowerCase();
    return projects.filter((p) => p.title.toLowerCase().includes(q) || p.platform.toLowerCase().includes(q) || p.tags.some((t) => t.toLowerCase().includes(q)));
  }, [projects, projectSearch]);

  const filteredSubs = useMemo(() => {
    let result = submissions;
    if (subStatusFilter) result = result.filter((s) => s.status === subStatusFilter);
    if (subSearch) {
      const q = subSearch.toLowerCase();
      result = result.filter((s) => s.project_name.toLowerCase().includes(q) || s.user_name.toLowerCase().includes(q) || s.user_email.toLowerCase().includes(q));
    }
    return result;
  }, [submissions, subSearch, subStatusFilter]);

  const activeMessages = useMemo(() => messages.filter((m) => !m.is_archived), [messages]);
  // Fetch ensures we show archived if requested, but we can do a local filter too if we want.
  const activeBookings = useMemo(() => bookings, [bookings]);

  // ── Charts data ──
  const platformData = useMemo(() => {
    const counts: Record<string, number> = {};
    projects.forEach((p) => { counts[p.platform] = (counts[p.platform] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [projects]);

  const submissionsByMonth = useMemo(() => {
    const counts: Record<string, number> = {};
    submissions.forEach((s) => {
      const d = new Date(s.created_at);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      counts[key] = (counts[key] || 0) + 1;
    });
    return Object.entries(counts).sort().slice(-6).map(([month, count]) => ({ month, count }));
  }, [submissions]);

  const navItems: { key: ViewType; icon: any; label: string; badge?: number }[] = [
    { key: "overview", icon: LayoutDashboard, label: "Overview" },
    { key: "projects", icon: FolderOpen, label: "Projects" },
    { key: "appointments", icon: Calendar, label: "Appointments", badge: activeBookingsCount },
    { key: "submissions", icon: Inbox, label: "Submissions", badge: pendingCount },
    { key: "messages", icon: MessageSquare, label: "Messages", badge: unreadCount },
    { key: "testimonials", icon: Quote, label: "Testimonials" },
    { key: "settings", icon: Settings, label: "Settings" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border px-6 md:px-12 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <a href="/" className="font-mono text-sm tracking-widest text-foreground">JM<span className="text-primary">.</span></a>
          <span className="mono text-muted-foreground text-xs">Admin</span>
        </div>
        <button onClick={() => { logout(); navigate("/"); }} className="flex items-center gap-2 mono text-xs text-muted-foreground hover:text-destructive transition-colors">
          <LogOut size={14} /> Sign Out
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden md:block w-56 border-r border-border min-h-[calc(100vh-57px)] p-4">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <button key={item.key} onClick={() => setView(item.key)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${view === item.key ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                <item.icon size={16} />
                {item.label}
                {item.badge ? <span className="ml-auto bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full">{item.badge}</span> : null}
              </button>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 p-6 md:p-10 max-w-5xl">
          {/* Mobile nav */}
          <div className="flex md:hidden gap-1.5 mb-6 flex-wrap">
            {navItems.map((v) => (
              <button key={v.key} onClick={() => setView(v.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${view === v.key ? "bg-secondary text-foreground" : "text-muted-foreground"}`}>
                {v.label}
                {v.badge ? <span className="ml-1 bg-primary text-primary-foreground text-[9px] px-1 rounded-full">{v.badge}</span> : null}
              </button>
            ))}
          </div>

          {/* ══════════ OVERVIEW ══════════ */}
          {view === "overview" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h1 className="text-2xl font-bold mb-8">Dashboard</h1>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
                <div className="bg-card border border-border rounded-xl p-5 cursor-pointer hover:border-primary/30 transition-colors" onClick={() => setView("projects")}>
                  <p className="mono text-xs text-muted-foreground mb-1">Total Projects</p>
                  <p className="text-3xl font-bold">{projects.length}</p>
                </div>
                <div className="bg-card border border-border rounded-xl p-5">
                  <p className="mono text-xs text-muted-foreground mb-1">Featured</p>
                  <p className="text-3xl font-bold text-primary">{featuredCount}</p>
                </div>
                <div className="bg-card border border-border rounded-xl p-5 cursor-pointer hover:border-primary/30 transition-colors" onClick={() => setView("submissions")}>
                  <p className="mono text-xs text-muted-foreground mb-1">Pending Subs</p>
                  <p className="text-3xl font-bold text-primary">{pendingCount}</p>
                </div>
                <div className="bg-card border border-border rounded-xl p-5 cursor-pointer hover:border-primary/30 transition-colors" onClick={() => setView("messages")}>
                  <p className="mono text-xs text-muted-foreground mb-1">Unread Messages</p>
                  <p className="text-3xl font-bold text-primary">{unreadCount}</p>
                </div>
              </div>

              {/* Charts */}
              <div className="grid md:grid-cols-2 gap-6 mb-10">
                {platformData.length > 0 && (
                  <div className="bg-card border border-border rounded-xl p-5">
                    <p className="mono text-xs text-muted-foreground mb-4">Projects by Platform</p>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={platformData}>
                        <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(220, 15%, 55%)" }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 10, fill: "hsl(220, 15%, 55%)" }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ background: "hsl(228, 22%, 10%)", border: "1px solid hsl(225, 18%, 18%)", borderRadius: 8, fontSize: 12 }} />
                        <Bar dataKey="value" fill="hsl(187, 90%, 48%)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
                {submissionsByMonth.length > 0 && (
                  <div className="bg-card border border-border rounded-xl p-5">
                    <p className="mono text-xs text-muted-foreground mb-4">Submissions Over Time</p>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={submissionsByMonth}>
                        <XAxis dataKey="month" tick={{ fontSize: 10, fill: "hsl(220, 15%, 55%)" }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 10, fill: "hsl(220, 15%, 55%)" }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ background: "hsl(228, 22%, 10%)", border: "1px solid hsl(225, 18%, 18%)", borderRadius: 8, fontSize: 12 }} />
                        <Bar dataKey="count" fill="hsl(40, 85%, 55%)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>

              {/* Recent projects + submissions */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-lg font-semibold mb-4">Recent Projects</h2>
                  <div className="space-y-2">
                    {projects.slice(0, 5).map((p) => (
                      <div key={p.id} className="bg-card border border-border rounded-xl px-5 py-3 flex items-center justify-between">
                        <div><p className="text-sm font-medium">{p.title}</p><p className="mono text-xs text-muted-foreground">{p.platform} · {p.createdAt}</p></div>
                        {p.featured && <Star size={14} className="text-primary" />}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h2 className="text-lg font-semibold mb-4">Recent Submissions</h2>
                  <div className="space-y-2">
                    {submissions.slice(0, 5).map((s) => (
                      <div key={s.id} className="bg-card border border-border rounded-xl px-5 py-3 flex items-center justify-between">
                        <div><p className="text-sm font-medium">{s.project_name}</p><p className="mono text-xs text-muted-foreground">{s.user_name} · {new Date(s.created_at).toLocaleDateString()}</p></div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${STATUS_COLORS[s.status] || STATUS_COLORS.pending}`}>{s.status}</span>
                      </div>
                    ))}
                    {submissions.length === 0 && <p className="text-sm text-muted-foreground">No submissions yet</p>}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ══════════ PROJECTS ══════════ */}
          {view === "projects" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Projects</h1>
                <button onClick={() => { setShowNew(true); setEditingId(null); }}
                  className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
                  <Plus size={16} /> New Project
                </button>
              </div>
              <div className="relative mb-4">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input value={projectSearch} onChange={(e) => setProjectSearch(e.target.value)} placeholder="Search projects..."
                  className="w-full pl-9 pr-3 py-2 bg-card border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/50" />
              </div>
              {showNew && <div className="mb-6"><ProjectForm onSave={handleSaveNew} onCancel={() => setShowNew(false)} /></div>}
              <div className="space-y-3">
                {filteredProjects.map((p) =>
                  editingId === p.id ? (
                    <div key={p.id}><ProjectForm initial={p} onSave={(data) => handleSaveEdit(p.id, data)} onCancel={() => setEditingId(null)} /></div>
                  ) : (
                    <div key={p.id} className="bg-card border border-border rounded-xl px-5 py-4 flex items-center justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2"><p className="text-sm font-medium truncate">{p.title}</p>{p.featured && <Star size={12} className="text-primary shrink-0" />}</div>
                        <p className="mono text-xs text-muted-foreground">{p.platform} · {p.createdAt}</p>
                        {p.tags.length > 0 && <div className="flex flex-wrap gap-1 mt-1">{p.tags.slice(0, 4).map((t) => <span key={t} className="mono text-[9px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{t}</span>)}</div>}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {p.repoUrl && <a href={p.repoUrl} aria-label="GitHub Repository" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground p-2"><Github size={14} /></a>}
                        {p.liveUrl && <a href={p.liveUrl} aria-label="Live Project" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary p-2"><ExternalLink size={14} /></a>}
                        <button onClick={() => handleToggleFeatured(p.id, p.featured)} aria-label={p.featured ? "Unfeature project" : "Feature project"} className="text-muted-foreground hover:text-primary transition-colors p-2">
                          {p.featured ? <StarOff size={14} /> : <Star size={14} />}
                        </button>
                        <button onClick={() => { setEditingId(p.id); setShowNew(false); }} aria-label="Edit project" className="text-muted-foreground hover:text-foreground transition-colors p-2"><Pencil size={14} /></button>
                        <button onClick={() => setDeleteConfirm({ type: "project", id: p.id, label: p.title })} aria-label="Delete project" className="text-muted-foreground hover:text-destructive transition-colors p-2"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  )
                )}
              </div>
            </motion.div>
          )}

          {/* ══════════ SUBMISSIONS ══════════ */}
          {view === "submissions" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Submissions</h1>
                <button onClick={fetchSubmissions} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <RefreshCw size={14} /> Refresh
                </button>
              </div>
              <div className="flex gap-3 mb-4">
                <div className="relative flex-1">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input value={subSearch} onChange={(e) => setSubSearch(e.target.value)} placeholder="Search submissions..."
                    className="w-full pl-9 pr-3 py-2 bg-card border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/50" />
                </div>
                <select value={subStatusFilter} onChange={(e) => setSubStatusFilter(e.target.value)}
                  className="px-3 py-2 bg-card border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/50">
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              {loadingSubs ? (
                <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
              ) : filteredSubs.length === 0 ? (
                <div className="text-center py-20"><Inbox size={32} className="text-muted-foreground mx-auto mb-3" /><p className="text-sm text-muted-foreground">No submissions found</p></div>
              ) : (
                <div className="space-y-3">
                  {filteredSubs.map((sub) => (
                    <SubmissionCard key={sub.id} sub={sub} onStatusChange={updateSubStatus}
                      onDelete={(id) => setDeleteConfirm({ type: "submission", id, label: sub.project_name })} />
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* ══════════ MESSAGES ══════════ */}
          {view === "messages" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Messages</h1>
                <button onClick={fetchMessages} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <RefreshCw size={14} /> Refresh
                </button>
              </div>
              {loadingMsgs ? (
                <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
              ) : activeMessages.length === 0 ? (
                <div className="text-center py-20"><MessageSquare size={32} className="text-muted-foreground mx-auto mb-3" /><p className="text-sm text-muted-foreground">No messages yet</p></div>
              ) : (
                <div className="space-y-3">
                  {activeMessages.map((msg) => (
                    <MessageCard key={msg.id} msg={msg} onToggleRead={toggleMsgRead} onArchive={archiveMsg}
                      onDelete={(id) => setDeleteConfirm({ type: "message", id, label: `message from ${msg.name}` })} />
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* ══════════ APPOINTMENTS ══════════ */}
          {view === "appointments" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <h1 className="text-2xl font-bold">Appointments</h1>
                  <button onClick={() => { setShowArchivedBookings(!showArchivedBookings); }}
                    className={`text-sm px-3 py-1 rounded-full border transition-colors ${showArchivedBookings ? "bg-primary/10 border-primary text-primary" : "bg-muted text-muted-foreground border-transparent hover:border-border"}`}>
                    {showArchivedBookings ? "Showing Archived" : "Show Archived"}
                  </button>
                </div>
                <button onClick={fetchBookings} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <RefreshCw size={14} className={loadingBookings ? "animate-spin" : ""} /> Refresh
                </button>
              </div>
              
              {loadingBookings ? (
                <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
              ) : bookings.length === 0 ? (
                <div className="text-center py-20">
                  <Calendar size={32} className="text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    {showArchivedBookings ? "No archived appointments found" : "No active appointments yet"}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {bookings.map((booking) => (
                    <BookingCard key={booking.id} booking={booking} onArchive={toggleBookingArchive}
                      onDelete={(id) => setDeleteConfirm({ type: "booking", id, label: `appointment with ${booking.name}` })} />
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* ══════════ TESTIMONIALS ══════════ */}
          {view === "testimonials" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Testimonials</h1>
                <div className="flex gap-2">
                  <button onClick={fetchTestimonials} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <RefreshCw size={14} />
                  </button>
                  <button onClick={() => { setShowNewTestimonial(true); setEditingTestimonial(null); }}
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
                    <Plus size={16} /> Add
                  </button>
                </div>
              </div>
              {showNewTestimonial && <div className="mb-6"><TestimonialForm onSave={saveTestimonial} onCancel={() => setShowNewTestimonial(false)} /></div>}
              {editingTestimonial && <div className="mb-6"><TestimonialForm initial={editingTestimonial} onSave={saveTestimonial} onCancel={() => setEditingTestimonial(null)} /></div>}
              {loadingTestimonials ? (
                <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
              ) : testimonials.length === 0 ? (
                <div className="text-center py-20"><Quote size={32} className="text-muted-foreground mx-auto mb-3" /><p className="text-sm text-muted-foreground">No testimonials yet</p></div>
              ) : (
                <div className="space-y-3">
                  {testimonials.map((t) => (
                    <div key={t.id} className="bg-card border border-border rounded-xl px-5 py-4 flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-medium">{t.name}</p>
                          <span className="mono text-[10px] text-muted-foreground">{t.role}</span>
                          {!t.visible && <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">Hidden</span>}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">"{t.quote}"</p>
                        <div className="flex items-center gap-1 mt-2">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`h-3 w-3 ${i < t.rating ? "text-gold fill-gold" : "text-muted-foreground/30"}`} />
                          ))}
                          <span className="mono text-[10px] text-muted-foreground ml-2">Order: {t.sort_order}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button onClick={() => { setEditingTestimonial(t); setShowNewTestimonial(false); }}
                          className="text-muted-foreground hover:text-foreground transition-colors"><Pencil size={14} /></button>
                        <button onClick={() => setDeleteConfirm({ type: "testimonial", id: t.id!, label: t.name })}
                          className="text-muted-foreground hover:text-destructive transition-colors"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* ══════════ SETTINGS ══════════ */}
          {view === "settings" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h1 className="text-2xl font-bold mb-8">Site Settings</h1>
              {loadingSettings ? (
                <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
              ) : (
                <div className="space-y-6">
                  {[
                    { key: "hero_title", label: "Hero Title", multiline: false },
                    { key: "hero_subtitle", label: "Hero Subtitle", multiline: false },
                    { key: "about_text", label: "About Text", multiline: true },
                    { key: "linkedin_url", label: "LinkedIn URL", multiline: false },
                    { key: "facebook_url", label: "Facebook URL", multiline: false },
                    { key: "email", label: "Contact Email", multiline: false },
                    { key: "phone", label: "Phone", multiline: false },
                    { key: "company_name", label: "Company/Name", multiline: false },
                  ].map(({ key, label, multiline }) => (
                    <SettingField key={key} settingKey={key} label={label} value={settings[key] || ""} multiline={multiline} onSave={saveSetting} saving={savingSettings} />
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </main>
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2"><AlertTriangle size={18} className="text-destructive" /> Confirm Delete</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteConfirm?.label}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => {
              if (!deleteConfirm) return;
              const { type, id } = deleteConfirm;
              if (type === "project") handleDelete(id);
              else if (type === "submission") deleteSub(id);
              else if (type === "message") deleteMsg(id);
              else if (type === "testimonial") deleteTestimonial(id);
              else if (type === "booking") deleteBooking(id);
              setDeleteConfirm(null);
            }}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ─── Setting Field Component ─────────────────────────────────────────────────
function SettingField({ settingKey, label, value: initialValue, multiline, onSave, saving }: {
  settingKey: string; label: string; value: string; multiline: boolean;
  onSave: (key: string, value: string) => void; saving: boolean;
}) {
  const [val, setVal] = useState(initialValue);
  const changed = val !== initialValue;

  useEffect(() => { setVal(initialValue); }, [initialValue]);

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <label className="mono text-xs text-muted-foreground mb-2 block">{label}</label>
      {multiline ? (
        <textarea value={val} onChange={(e) => setVal(e.target.value)} rows={3}
          className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/50 resize-none" />
      ) : (
        <input value={val} onChange={(e) => setVal(e.target.value)}
          className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/50" />
      )}
      {changed && (
        <button onClick={() => onSave(settingKey, val)} disabled={saving}
          className="mt-2 flex items-center gap-1.5 bg-primary text-primary-foreground px-3 py-1.5 rounded-lg text-xs font-medium hover:opacity-90 transition-opacity disabled:opacity-50">
          <Save size={12} /> Save
        </button>
      )}
    </div>
  );
}
