import { useQuery } from "@tanstack/react-query";
import { getFeaturedProjects, getProjectByIdOrSlug, getProjects } from "@/data/projects";

export const useProjects = () =>
  useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
    staleTime: 1000 * 60 * 5,
  });

export const useFeaturedProjects = () =>
  useQuery({
    queryKey: ["projects", "featured"],
    queryFn: getFeaturedProjects,
    staleTime: 1000 * 60 * 5,
  });

export const useProject = (idOrSlug?: string) =>
  useQuery({
    queryKey: ["projects", idOrSlug],
    queryFn: () => getProjectByIdOrSlug(idOrSlug || ""),
    enabled: !!idOrSlug,
    staleTime: 1000 * 60 * 5,
  });
