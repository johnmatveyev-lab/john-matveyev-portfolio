import { useEffect, useRef } from "react";
import { track } from "@/lib/analytics";

/**
 * Uses IntersectionObserver to track which named sections the user
 * actually sees. Fires a `section_visible` event when a section enters
 * the viewport (at least 40% visible). Each section fires at most once.
 */
export function useSectionVisibility() {
  const firedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    firedRef.current = new Set();

    const sections = document.querySelectorAll("section[id]");
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id;
          if (entry.isIntersecting && !firedRef.current.has(id)) {
            firedRef.current.add(id);
            track("section_visible", {
              section: id,
              page: window.location.pathname,
            });
          }
        }
      },
      { threshold: 0.4 }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);
}
