import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as messageClient from "../api/messageClient";
import { Chat } from "./Chat";

vi.mock("../api/messageClient");

describe("Chat", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches and displays messages on mount", async () => {
    const mockMessages = [
      { _id: "::_id::", author: "Alice", message: "Hi!", createdAt: "2024-01-01T10:00:00.000Z" },
    ];
    vi.mocked(messageClient.fetchMessages).mockResolvedValue(mockMessages);

    render(<Chat />);

    await waitFor(() => {
      expect(screen.getByText("Alice")).toBeInTheDocument();
      expect(screen.getByText("Hi!")).toBeInTheDocument();
    });
  });

  it("sends a new message and adds it to the list", async () => {
    const user = userEvent.setup();
    const mockNewMessage = {
      _id: "::_id::",
      author: "You",
      message: "Hello!",
      createdAt: "2024-01-01T10:01:00.000Z",
    };
    vi.mocked(messageClient.fetchMessages).mockResolvedValue([]);
    vi.mocked(messageClient.sendMessage).mockResolvedValue(mockNewMessage);

    render(<Chat />);

    await waitFor(() => expect(messageClient.fetchMessages).toHaveBeenCalled());

    const messageInput = screen.getByPlaceholderText(/message/i);
    const sendButton = screen.getByRole("button", { name: /send/i });

    await user.type(messageInput, "Hello!");
    await user.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText("You")).toBeInTheDocument();
      expect(screen.getByText("Hello!")).toBeInTheDocument();
    });
  });
});
