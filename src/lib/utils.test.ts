import { describe, it, expect } from "vitest";
import { cn } from "./utils";

describe("utils cn()", () => {
  it("should merge classes correctly", () => {
    expect(cn("p-4", "m-4")).toBe("p-4 m-4");
  });

  it("should handle conditional classes", () => {
    expect(cn("p-4", true && "text-red-500", false && "text-blue-500")).toBe(
      "p-4 text-red-500"
    );
  });

  it("should handle tailwind class conflicts using tailwind-merge", () => {
    expect(cn("px-2 py-1", "p-4")).toBe("p-4");
    expect(cn("text-red-500 text-sm", "text-blue-500")).toBe("text-sm text-blue-500");
  });
});
