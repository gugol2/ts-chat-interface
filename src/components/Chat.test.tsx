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

  const mockMessages = [
    { _id: "::_id::", author: "Alice", message: "Hi!", createdAt: "2024-01-01T10:00:00.000Z" },
  ];

  const mockNewMessage = {
    _id: "::_id-2::",
    author: "You",
    message: "Hello!",
    createdAt: "2024-01-01T10:01:00.000Z",
  };

  it("shows loading state initially then displays messages", async () => {
    vi.mocked(messageClient.fetchMessages).mockResolvedValue(mockMessages);

    const { container } = render(<Chat />);

    // initially show the skeleton messages
    const skeletons = container.querySelectorAll(".message-skeleton");
    expect(skeletons.length).toBeGreaterThan(0);

    // after fetching the info show the messages
    await waitFor(() => {
      const skeletonsAfter = container.querySelectorAll(".message-skeleton");
      expect(skeletonsAfter.length).toBe(0);
      expect(screen.getByText("Alice")).toBeInTheDocument();
      expect(screen.getByText("Hi!")).toBeInTheDocument();
    });
  });

  it("fetches and displays messages on mount", async () => {
    vi.mocked(messageClient.fetchMessages).mockResolvedValue(mockMessages);

    render(<Chat />);

    await waitFor(() => {
      expect(messageClient.fetchMessages).toHaveBeenCalledWith(
        expect.objectContaining({
          before: expect.any(String),
          limit: 25,
        }),
      );
      expect(screen.getByText("Alice")).toBeInTheDocument();
      expect(screen.getByText("Hi!")).toBeInTheDocument();
    });
  });

  it("sends a new message and adds it to the list", async () => {
    const user = userEvent.setup();

    vi.mocked(messageClient.fetchMessages).mockResolvedValue(mockMessages);
    vi.mocked(messageClient.sendMessage).mockResolvedValue(mockNewMessage);

    render(<Chat />);

    await waitFor(() => expect(messageClient.fetchMessages).toHaveBeenCalled());

    const messageInput = screen.getByPlaceholderText(/message/i);
    const sendButton = screen.getByRole("button", { name: /send/i });

    await user.type(messageInput, "Hello!");
    await user.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText("Alice")).toBeInTheDocument();
      expect(screen.getByText("Hi!")).toBeInTheDocument();
      expect(screen.getByText("You")).toBeInTheDocument();
      expect(screen.getByText("Hello!")).toBeInTheDocument();
    });
  });

  it("scrolls to the bottom of the Chat component when a new message arrives", async () => {
    const user = userEvent.setup();

    vi.mocked(messageClient.fetchMessages).mockResolvedValue(mockMessages);
    vi.mocked(messageClient.sendMessage).mockResolvedValue(mockNewMessage);

    const { container } = render(<Chat />);

    await waitFor(() => expect(messageClient.fetchMessages).toHaveBeenCalled());

    const chatElement = container.querySelector(".chat") as HTMLElement;

    Object.defineProperty(chatElement, "scrollHeight", {
      writable: true,
      configurable: true,
      value: 1000,
    });

    const scrollTopSetter = vi.fn();
    Object.defineProperty(chatElement, "scrollTop", {
      set: scrollTopSetter,
      get: () => 0,
    });

    const messageInput = screen.getByPlaceholderText(/message/i);
    const sendButton = screen.getByRole("button", { name: /send/i });

    await user.type(messageInput, "Hello!");
    await user.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText("You")).toBeInTheDocument();
      expect(screen.getByText("Hello!")).toBeInTheDocument();
      expect(scrollTopSetter).toHaveBeenCalledWith(1000);
    });
  });

  it("displays error message when fetching messages fails", async () => {
    vi.mocked(messageClient.fetchMessages).mockRejectedValue(
      new Error("Failed to fetch messages: Network request failed"),
    );

    render(<Chat />);

    await waitFor(() => {
      expect(screen.getByText(/failed to fetch messages/i)).toBeInTheDocument();
    });
  });

  it("displays error message when sending message fails", async () => {
    const user = userEvent.setup();

    vi.mocked(messageClient.fetchMessages).mockResolvedValue(mockMessages);
    vi.mocked(messageClient.sendMessage).mockRejectedValue(
      new Error("Failed to send message: Network request failed"),
    );

    render(<Chat />);

    await waitFor(() => expect(messageClient.fetchMessages).toHaveBeenCalled());

    const messageInput = screen.getByPlaceholderText(/message/i);
    const sendButton = screen.getByRole("button", { name: /send/i });

    await user.type(messageInput, "Hello!");
    await user.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText(/failed to send message/i)).toBeInTheDocument();
    });
  });
});
