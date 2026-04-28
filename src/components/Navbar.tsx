import { useLocation } from "react-router-dom";
import { PrefetchLink } from "./PrefetchLink";
import { motion, useScroll, useSpring } from "framer-motion";
import { Menu, X, Terminal, Sun, Moon } from "lucide-react";
import { useState } from "react";
import { useTheme } from "./ThemeProvider";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const location = useLocation();
  const isHome = location.pathname === "/";
  const { theme, setTheme } = useTheme();

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });

  const links = [
    { label: "Featured Work", href: isHome ? "#featured" : "/#featured" },
    { label: "Expertise", href: "/skills" },
    { label: "Contact", href: isHome ? "#contact" : "/#contact" },
  ];

  return (
    <header>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-2 focus:left-2 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground rounded-md"
      >
        Skip to main content
      </a>
      <motion.nav
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 glass"
      >
      {/* Scroll progress bar */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-primary via-gold to-primary origin-left"
        style={{ scaleX }}
      />
      <div className="container-narrow flex items-center justify-between h-16 px-6 md:px-12 lg:px-24">
        <PrefetchLink to="/" className="flex items-center gap-2 font-display font-bold text-sm tracking-widest text-foreground hover:text-primary transition-colors">
          <Terminal className="w-5 h-5 text-gold" />
          MATVEYEV<span className="text-gold">.AI</span>
        </PrefetchLink>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <div 
              key={l.label} 
              className="relative"
              onMouseEnter={() => setHoveredLink(l.label)}
              onMouseLeave={() => setHoveredLink(null)}
            >
              {hoveredLink === l.label && (
                <motion.div
                  layoutId="navbar-hover"
                  className="absolute inset-0 -inset-x-3 -inset-y-2 bg-secondary/80 rounded-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
              )}
              {l.href.startsWith("/") && !l.href.startsWith("/#") ? (
                <PrefetchLink
                  to={l.href}
                  className="mono text-muted-foreground hover:text-foreground transition-colors relative z-10"
                >
                  {l.label}
                </PrefetchLink>
              ) : (
                <a
                  href={l.href}
                  className="mono text-muted-foreground hover:text-foreground transition-colors relative z-10"
                >
                  {l.label}
                </a>
              )}
            </div>
          ))}
          <div
            className="relative"
            onMouseEnter={() => setHoveredLink("Admin")}
            onMouseLeave={() => setHoveredLink(null)}
          >
            {hoveredLink === "Admin" && (
              <motion.div
                layoutId="navbar-hover"
                className="absolute inset-0 -inset-x-3 -inset-y-2 bg-secondary/80 rounded-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              />
            )}
            <PrefetchLink
              to="/admin"
              className="mono text-muted-foreground hover:text-primary transition-colors relative z-10"
            >
              Admin
            </PrefetchLink>
          </div>
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-full hover:bg-muted"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-foreground p-2 -mr-2"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="md:hidden glass border-t border-border px-6 pb-6 overflow-hidden"
        >
          <motion.div
            initial="closed"
            animate="open"
            variants={{
              open: { transition: { staggerChildren: 0.1 } },
              closed: { transition: { staggerChildren: 0.05, staggerDirection: -1 } }
            }}
          >
            {links.map((l) => (
              <motion.div key={l.label} variants={{ open: { opacity: 1, y: 0 }, closed: { opacity: 0, y: 10 } }}>
                {l.href.startsWith("/") && !l.href.startsWith("/#") ? (
                  <PrefetchLink
                    to={l.href}
                    onClick={() => setOpen(false)}
                    className="block py-3 mono text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {l.label}
                  </PrefetchLink>
                ) : (
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block py-3 mono text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {l.label}
                  </a>
                )}
              </motion.div>
            ))}
            <motion.div variants={{ open: { opacity: 1, y: 0 }, closed: { opacity: 0, y: 10 } }}>
              <PrefetchLink
                to="/admin"
                onClick={() => setOpen(false)}
                className="block py-3 mono text-muted-foreground hover:text-primary transition-colors"
              >
                Admin
              </PrefetchLink>
            </motion.div>
            <motion.div variants={{ open: { opacity: 1, y: 0 }, closed: { opacity: 0, y: 10 } }}>
              <button
                onClick={() => {
                  setTheme(theme === 'dark' ? 'light' : 'dark');
                  setOpen(false);
                }}
                className="flex w-full items-center justify-between py-3 mono text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Toggle theme"
              >
                Switch Theme
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
      </motion.nav>
    </header>
  );
}
