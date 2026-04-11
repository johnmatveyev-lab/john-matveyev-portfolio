import { Linkedin, Facebook, Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border py-12 px-6 md:px-12 lg:px-24 relative z-10">
      <div className="container-narrow flex flex-col md:flex-row items-center justify-between gap-6">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} MATVEYEV.AI — All rights reserved.
        </p>
        <div className="flex items-center gap-6">
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn Profile"
            className="text-muted-foreground hover:text-primary transition-colors p-3 -m-3"
          >
            <Linkedin className="w-5 h-5" aria-hidden="true" />
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Profile"
            className="text-muted-foreground hover:text-foreground transition-colors p-3 -m-3"
          >
            <Github className="w-5 h-5" aria-hidden="true" />
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook Profile"
            className="text-muted-foreground hover:text-foreground transition-colors p-3 -m-3"
          >
            <Facebook className="w-5 h-5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}
