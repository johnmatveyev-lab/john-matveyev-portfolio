import { useEffect, useRef } from "react";
import { track } from "@/lib/analytics";

const DEPTH_MILESTONES = [25, 50, 75, 90, 100];

/**
 * Tracks how far down the page a user scrolls.
 * Fires analytics events at 25%, 50%, 75%, 90%, and 100% milestones.
 * Each milestone fires at most once per page view.
 */
export function useScrollDepth() {
  const firedRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    firedRef.current = new Set();

    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;

      const pct = Math.round((scrollTop / docHeight) * 100);

      for (const milestone of DEPTH_MILESTONES) {
        if (pct >= milestone && !firedRef.current.has(milestone)) {
          firedRef.current.add(milestone);
          track("scroll_depth", {
            depth: milestone,
            page: window.location.pathname,
          });
        }
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
}
