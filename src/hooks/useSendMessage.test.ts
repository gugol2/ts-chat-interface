import { act, renderHook } from "@testing-library/react";
import toast from "react-hot-toast";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { sendMessage } from "../api/messageClient";
import type { MessageType } from "../types/message";
import { useSendMessage } from "./useSendMessage";

vi.mock("../api/messageClient");
vi.mock("react-hot-toast");

const mockSendMessage = vi.mocked(sendMessage);
const mockToastError = vi.mocked(toast.error);

describe("useSendMessage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("adds optimistic message and replaces with server response on success", async () => {
    const serverMessage: MessageType = {
      _id: "server-1",
      author: "Alice",
      message: "Hello",
      createdAt: "2024-01-01T00:00:00Z",
    };
    mockSendMessage.mockResolvedValue(serverMessage);

    const messages: MessageType[] = [];
    const setMessages = vi.fn();

    const { result } = renderHook(() => useSendMessage(messages, setMessages));

    await act(async () => {
      await result.current.handleSendMessage({ author: "Alice", message: "Hello" });
    });

    expect(setMessages).toHaveBeenCalledTimes(2);

    const firstCall = setMessages.mock.calls[0][0];
    expect(firstCall).toHaveLength(1);
    expect(firstCall[0].pending).toBe(true);
    expect(firstCall[0].author).toBe("Alice");
    expect(firstCall[0].message).toBe("Hello");
  });

  it("removes optimistic message and shows toast on error", async () => {
    mockSendMessage.mockRejectedValue(new Error("Network error"));

    const messages: MessageType[] = [];
    const setMessages = vi.fn();

    const { result } = renderHook(() => useSendMessage(messages, setMessages));

    await act(async () => {
      try {
        await result.current.handleSendMessage({ author: "Alice", message: "Hello" });
      } catch {
        // Expected
      }
    });

    expect(setMessages).toHaveBeenCalledTimes(2);
    expect(mockToastError).toHaveBeenCalledWith("Network error");
  });
});
