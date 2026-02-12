import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useScrollToBottom } from "./useScrollToBottom";

describe("useScrollToBottom", () => {
  it("returns a ref object", () => {
    const { result } = renderHook(() => useScrollToBottom());

    expect(result.current.ref).toBeDefined();
    expect(result.current.ref.current).toBeNull();
  });

  it("returns a scrollToBottom function", () => {
    const { result } = renderHook(() => useScrollToBottom());

    expect(typeof result.current.scrollToBottom).toBe("function");
  });
});
