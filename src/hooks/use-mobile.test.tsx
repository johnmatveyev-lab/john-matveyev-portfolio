import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useIsMobile } from "./use-mobile";

describe("useIsMobile", () => {
  let addEventListenerMock: any;
  let removeEventListenerMock: any;

  beforeEach(() => {
    addEventListenerMock = vi.fn();
    removeEventListenerMock = vi.fn();

    // Mock matchMedia
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: addEventListenerMock,
        removeEventListener: removeEventListenerMock,
        dispatchEvent: vi.fn(),
      })),
    });

    vi.spyOn(window, "innerWidth", "get").mockReturnValue(1024);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should return false when window width is greater than or equal to 768", () => {
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });

  it("should return true when window width is less than 768", () => {
    vi.spyOn(window, "innerWidth", "get").mockReturnValue(500);
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });

  it("should update when window resizes and change event is triggered", () => {
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);

    // Change window width
    vi.spyOn(window, "innerWidth", "get").mockReturnValue(500);

    // Call the registered event listener
    act(() => {
      const listener = addEventListenerMock.mock.calls[0][1];
      listener();
    });

    expect(result.current).toBe(true);
  });
});
