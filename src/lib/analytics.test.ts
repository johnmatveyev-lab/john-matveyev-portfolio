import { describe, it, expect, vi, beforeEach } from "vitest";
import { track } from "./analytics";

describe("analytics.ts", () => {
  beforeEach(() => {
    // Reset window objects
    delete (window as any).posthog;
    delete (window as any).gtag;
    vi.clearAllMocks();
  });

  it("should not crash if no analytics provider is present", () => {
    expect(() => track("test_event")).not.toThrow();
  });

  it("should call posthog.capture if window.posthog exists", () => {
    const mockCapture = vi.fn();
    (window as any).posthog = { capture: mockCapture };
    
    // Default path relies on window.location
    track("my_event", { foo: "bar" });
    
    expect(mockCapture).toHaveBeenCalledWith("my_event", {
      foo: "bar",
      path: window.location.pathname,
    });
  });

  it("should call gtag if window.gtag exists", () => {
    const mockGtag = vi.fn();
    (window as any).gtag = mockGtag;
    
    track("another_event", { test: 123 });
    
    expect(mockGtag).toHaveBeenCalledWith("event", "another_event", {
      test: 123,
      path: window.location.pathname,
    });
  });
});
