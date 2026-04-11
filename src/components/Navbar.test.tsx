import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Navbar from "./Navbar";

vi.mock("framer-motion", () => ({
  motion: {
    nav: ({ children, className }: any) => <nav className={className}>{children}</nav>,
    div: ({ children, className }: any) => <div className={className}>{children}</div>,
  },
  useScroll: () => ({ scrollYProgress: { get: () => 0 } }),
  useSpring: () => ({ get: () => 0 }),
}));

describe("Navbar", () => {
  it("renders the primary brand link", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
    expect(screen.getByText(/MATVEYEV/i)).toBeInTheDocument();
  });

  it("renders desktop navigation links", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
    expect(screen.getByText("Featured Work")).toBeVisible();
    expect(screen.getByText("Expertise")).toBeVisible();
    expect(screen.getByText("Contact")).toBeVisible();
  });

  it("opens mobile menu when toggle is clicked", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    // Get the mobile menu button by its accessible label
    const toggleButton = screen.getByLabelText("Open menu");
    fireEvent.click(toggleButton);

    // The mobile menu renders another set of links. We verify there are multiple now or they are in the DOM structure
    const featuredLinks = screen.getAllByText("Featured Work");
    expect(featuredLinks.length).toBeGreaterThan(1);
  });
});
