import { describe, it, expect, vi, beforeAll } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ProjectCard from "./ProjectCard";
import type { Project } from "@/types/project";

const mockProject: Project = {
  id: "1",
  title: "Test Project",
  slug: "test-project",
  description: "A description of the test project that is quite compelling.",
  tags: ["React", "TypeScript", "Tailwind"],
  platform: "Web",
  category: "Fullstack",
  repoUrl: "https://github.com/test/test",
  liveUrl: "https://test.com",
  createdAt: "2024-01-01T00:00:00Z",
  featured: false
};

describe("ProjectCard", () => {
  beforeAll(() => {
    // Mock IntersectionObserver for framer-motion whileInView
    const mockIntersectionObserver = vi.fn();
    mockIntersectionObserver.mockReturnValue({
      observe: () => null,
      unobserve: () => null,
      disconnect: () => null
    });
    window.IntersectionObserver = mockIntersectionObserver;
  });

  it("renders project information correctly", () => {
    render(
      <MemoryRouter>
        <ProjectCard project={mockProject} />
      </MemoryRouter>
    );

    // Title and description
    expect(screen.getByText("Test Project")).toBeInTheDocument();
    expect(screen.getByText("A description of the test project that is quite compelling.")).toBeInTheDocument();
    expect(screen.getByText("Web")).toBeInTheDocument();

    // Tags
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByText("Tailwind")).toBeInTheDocument();
  });

  it("renders repository and live links correctly", () => {
    const { container } = render(
      <MemoryRouter>
        <ProjectCard project={mockProject} />
      </MemoryRouter>
    );

    const repoLink = container.querySelector('a[href="https://github.com/test/test"]');
    const liveLink = container.querySelector('a[href="https://test.com"]');

    expect(repoLink).toBeInTheDocument();
    expect(liveLink).toBeInTheDocument();
  });

  it("does not render links if they are not provided", () => {
    const noLinksProject = { ...mockProject, repoUrl: undefined, liveUrl: undefined };
    const { container } = render(
      <MemoryRouter>
        <ProjectCard project={noLinksProject} />
      </MemoryRouter>
    );

    const repoLink = container.querySelector('a[target="_blank"]');
    expect(repoLink).not.toBeInTheDocument();
  });
});
