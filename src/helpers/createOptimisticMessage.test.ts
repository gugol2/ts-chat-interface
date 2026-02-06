import { beforeEach, describe, expect, it, vi } from "vitest";
import { createOptimisticMessage } from "./createOptimisticMessage";

describe("createOptimisticMessage", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("creates optimistic message with correct properties", () => {
    const now = new Date("2026-02-06T19:00:00.000Z");
    vi.setSystemTime(now);

    const data = { author: "You", message: "Hello World" };
    const result = createOptimisticMessage(data);

    expect(result).toMatchObject({
      author: "You",
      message: "Hello World",
      createdAt: "2026-02-06T19:00:00.000Z",
      pending: true,
    });
    expect(result._id).toMatch(/^temp-\d+$/);
  });

  it("generates unique IDs for different calls", () => {
    const data = { author: "You", message: "Test" };

    const message1 = createOptimisticMessage(data);
    vi.advanceTimersByTime(1);
    const message2 = createOptimisticMessage(data);

    expect(message1._id).not.toBe(message2._id);
  });
});
