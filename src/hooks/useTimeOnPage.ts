import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { track } from "@/lib/analytics";

/**
 * Tracks time spent on each page (route). When the user navigates away
 * or closes the tab, fires a `time_on_page` event with the duration in
 * seconds. Uses the Page Visibility API so hidden-tab time is excluded.
 */
export function useTimeOnPage() {
  const location = useLocation();
  const startRef = useRef(Date.now());
  const hiddenAccumRef = useRef(0);
  const hiddenAtRef = useRef<number | null>(null);

  useEffect(() => {
    startRef.current = Date.now();
    hiddenAccumRef.current = 0;
    hiddenAtRef.current = null;

    const onVisibility = () => {
      if (document.hidden) {
        hiddenAtRef.current = Date.now();
      } else if (hiddenAtRef.current !== null) {
        hiddenAccumRef.current += Date.now() - hiddenAtRef.current;
        hiddenAtRef.current = null;
      }
    };

    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      const elapsed = Date.now() - startRef.current - hiddenAccumRef.current;
      const seconds = Math.round(elapsed / 1000);
      if (seconds > 1) {
        track("time_on_page", {
          page: location.pathname,
          seconds,
        });
      }
    };
  }, [location.pathname]);
}
