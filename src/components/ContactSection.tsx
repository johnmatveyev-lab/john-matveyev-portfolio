import { useState } from "react";
import { motion } from "framer-motion";
import { Linkedin, Mail, Send, Loader2, CheckCircle, CalendarDays, Github } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";
import { track } from "@/lib/analytics";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  message: z.string().trim().min(1, "Message is required").max(2000),
});

const bookingLink = import.meta.env.VITE_BOOKING_LINK || "https://cal.com/your-handle/intro";
const slackWebhook = import.meta.env.VITE_SLACK_WEBHOOK_URL;
const linkedinUrl = import.meta.env.VITE_LINKEDIN_URL || "https://www.linkedin.com/in/john-matveyev";
const githubUrl = import.meta.env.VITE_GITHUB_URL || "https://github.com";
const emailAddress = "contact@matveyev.ai";

export default function ContactSection() {
  const [activeTab, setActiveTab] = useState<"message" | "booking">("message");
  const [form, setForm] = useState({ name: "", email: "", message: "", date: "", time: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const notifySlack = async (payload: { name: string; email: string; message: string; date?: string; time?: string }) => {
    if (!slackWebhook) return;
    try {
      const text = activeTab === "booking" 
        ? `New booking request\nName: ${payload.name}\nEmail: ${payload.email}\nDate: ${payload.date}\nTime: ${payload.time}\nNotes: ${payload.message}`
        : `New portfolio lead\nName: ${payload.name}\nEmail: ${payload.email}\nMessage: ${payload.message}`;

      await fetch(slackWebhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
    } catch (e) {
      console.error("Slack webhook failed", e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    
    try {
      if (activeTab === "message") {
        const result = contactSchema.safeParse(form);
        if (!result.success) {
          toast.error(result.error.errors[0].message);
          setSending(false);
          return;
        }

        const { error } = await supabase.from("contact_messages").insert({
          name: result.data.name,
          email: result.data.email,
          message: result.data.message,
        });
        if (error) throw error;
        
        notifySlack({
          name: result.data.name || "Unknown",
          email: result.data.email || "Unknown",
          message: result.data.message || ""
        });
        toast.success("Message sent! I'll get back to you soon.");
        track("contact:submitted", { source: "contact_section", type: "message" });
      } else {
        // Basic booking validation
        if (!form.name || !form.email || !form.date || !form.time) {
          toast.error("Please fill out all required booking fields.");
          setSending(false);
          return;
        }

        const { error } = await supabase.from("bookings").insert({
          name: form.name,
          email: form.email,
          date: form.date,
          time: form.time,
          notes: form.message,
        });

        if (error) throw error;

        notifySlack({
          name: form.name,
          email: form.email,
          message: form.message,
          date: form.date,
          time: form.time
        });
        toast.success("Booking requested! I will confirm it shortly.");
        track("contact:submitted", { source: "contact_section", type: "booking" });
      }

      setSent(true);
      setForm({ name: "", email: "", message: "", date: "", time: "" });
    } catch {
      toast.error("Failed to submit. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="section-padding border-t border-border">
      <div className="container-narrow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="mono text-primary mb-4">Contact</p>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Let's build something
            <span className="text-gradient"> together.</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed mb-10 max-w-2xl">
            I'm always open to interesting collaborations, AI consulting, or just
            talking about what's next in the space. Reach out and let's connect.
          </p>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form OR Booking Form */}
            <div>
              {/* Tabs */}
              <div className="flex gap-4 mb-6">
                <button
                  onClick={() => setActiveTab("message")}
                  className={`text-sm font-medium pb-1.5 border-b-2 transition-colors ${activeTab === "message" ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
                >
                  Message
                </button>
                <button
                  onClick={() => setActiveTab("booking")}
                  className={`text-sm font-medium pb-1.5 border-b-2 transition-colors ${activeTab === "booking" ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
                >
                  Book a slot
                </button>
              </div>

              {sent ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-card border border-border rounded-2xl p-8 text-center"
                >
                  <CheckCircle className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    {activeTab === "booking" ? "Booking Requested!" : "Message Sent!"}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-6">
                    {activeTab === "booking" 
                      ? "Thanks for requesting a slot. I'll get back to you soon with a confirmation."
                      : "Thanks for reaching out. I'll get back to you as soon as possible."}
                  </p>
                  <button
                    onClick={() => setSent(false)}
                    className="mono text-sm text-primary hover:underline"
                  >
                    Send another {activeTab === "booking" ? "request" : "message"}
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {activeTab === "booking" && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="mono text-xs text-muted-foreground mb-1.5 block">Date</label>
                        <input
                          type="date"
                          value={form.date}
                          onChange={(e) => setForm({ ...form, date: e.target.value })}
                          className="w-full px-4 py-3 bg-card border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors"
                          required
                        />
                      </div>
                      <div>
                        <label className="mono text-xs text-muted-foreground mb-1.5 block">Time</label>
                        <input
                          type="time"
                          value={form.time}
                          onChange={(e) => setForm({ ...form, time: e.target.value })}
                          className="w-full px-4 py-3 bg-card border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors"
                          required
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="mono text-xs text-muted-foreground mb-1.5 block">Name</label>
                    <input
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Your name"
                      className="w-full px-4 py-3 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="mono text-xs text-muted-foreground mb-1.5 block">Email</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="mono text-xs text-muted-foreground mb-1.5 block">
                      {activeTab === "booking" ? "Notes (optional)" : "Message"}
                    </label>
                    <textarea
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder={activeTab === "booking" ? "Any details to prepare for our call?" : "Tell me about your project..."}
                      rows={4}
                      className="w-full px-4 py-3 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors resize-none"
                      required={activeTab === "message"}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {sending ? (
                      <><Loader2 size={16} className="animate-spin" /> {activeTab === "booking" ? "Requesting..." : "Sending..."}</>
                    ) : (
                      <>
                        {activeTab === "booking" ? <CalendarDays size={16} /> : <Send size={16} />} 
                        {activeTab === "booking" ? "Request Booking" : "Send Message"}
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Social links */}
            <div className="flex flex-col justify-center gap-6">
              <p className="mono text-xs text-muted-foreground">Or connect directly</p>
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors group"
                onClick={() => track("cta:linkedin", { location: "contact_section" })}
              >
                <div className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center group-hover:border-primary/40 transition-colors">
                  <Linkedin size={18} />
                </div>
                <span className="mono text-sm">LinkedIn</span>
              </a>
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors group"
                onClick={() => track("cta:github", { location: "contact_section" })}
              >
                <div className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center group-hover:border-primary/40 transition-colors">
                  <Github size={18} />
                </div>
                <span className="mono text-sm">GitHub</span>
              </a>
              <button
                onClick={() => {
                  setActiveTab("booking");
                  track("cta:book_call", { location: "contact_section" });
                }}
                className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors group text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center group-hover:border-primary/40 transition-colors">
                  <CalendarDays size={18} />
                </div>
                <span className="mono text-sm">Book a slot</span>
              </button>
              <a
                href={`mailto:johnmatveyev@gmail.com`}
                className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors group"
                onClick={() => track("cta:email", { location: "contact_section" })}
              >
                <div className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center group-hover:border-primary/40 transition-colors">
                  <Mail size={18} />
                </div>
                <span className="mono text-sm">Email</span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
