import { renderHook, waitFor } from "@testing-library/react";
import toast from "react-hot-toast";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fetchMessages } from "../api/messageClient";
import type { MessageType } from "../types/message";
import { useMessages } from "./useMessages";

vi.mock("../api/messageClient");
vi.mock("react-hot-toast");

const mockFetchMessages = vi.mocked(fetchMessages);
const mockToastError = vi.mocked(toast.error);

describe("useMessages", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("initializes with loading true and empty messages", async () => {
    mockFetchMessages.mockResolvedValue([]);
    const { result, unmount } = renderHook(() => useMessages());

    expect(result.current.loading).toBe(true);
    expect(result.current.messages).toEqual([]);
    expect(result.current.error).toBe(false);

    unmount();
  });

  it("fetches messages on mount and sets loading to false", async () => {
    const mockMessages: MessageType[] = [
      { _id: "1", author: "Alice", message: "Hello", createdAt: "2024-01-01T00:00:00Z" },
    ];
    mockFetchMessages.mockResolvedValue(mockMessages);

    const { result } = renderHook(() => useMessages());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.messages).toEqual(mockMessages);
    expect(result.current.error).toBe(false);
    expect(mockFetchMessages).toHaveBeenCalledTimes(1);
  });

  it("sets error to true and shows toast when fetch fails", async () => {
    mockFetchMessages.mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() => useMessages());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe(true);
    expect(result.current.messages).toEqual([]);
    expect(mockToastError).toHaveBeenCalledWith("Network error");
  });
});
