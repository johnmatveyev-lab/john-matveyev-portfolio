import { Link, LinkProps } from "react-router-dom";
import { useCallback } from "react";

const prefetchMap: Record<string, () => Promise<any>> = {
  "/projects": () => import("@/pages/ProjectsPage"),
  "/skills": () => import("@/pages/SkillsPage"),
  "/admin": () => import("@/pages/AdminLogin"),
};

export function PrefetchLink(props: LinkProps & { prefetch?: boolean; className?: string }) {
  const { to, prefetch = true, onMouseEnter, ...rest } = props;
  
  const handleMouseEnter = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    if (prefetch && typeof to === 'string') {
      const path = to.split('?')[0]; // simple split
      if (path.startsWith('/projects/')) {
        import("@/pages/ProjectDetailPage").catch(() => {});
      } else {
        const fetcher = prefetchMap[path];
        if (fetcher) fetcher().catch(() => {});
      }
    }
    onMouseEnter?.(e);
  }, [prefetch, to, onMouseEnter]);

  return <Link to={to} onMouseEnter={handleMouseEnter} {...rest} />;
}
