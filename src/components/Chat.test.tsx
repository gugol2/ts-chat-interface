import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import toast from "react-hot-toast";
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as messageClient from "../api/messageClient";
import { Chat } from "./Chat";

vi.mock("../api/messageClient");
vi.mock("react-hot-toast");

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

  const defaultMessagesPerRequest = 50;

  describe("Message list skeleton", () => {
    it("shows loading state initially then displays messages", async () => {
      vi.mocked(messageClient.fetchMessages).mockResolvedValue(mockMessages);

      const { container } = render(<Chat />);

      // initially show the skeleton messages
      const skeletons = container.querySelectorAll(".message-skeleton");
      expect(skeletons.length).toBe(defaultMessagesPerRequest);
      expect(screen.queryByText("Alice")).not.toBeInTheDocument();
      expect(screen.queryByText("Hi!")).not.toBeInTheDocument();

      // after fetching the info show the messages
      await waitFor(() => {
        const skeletonsAfter = container.querySelectorAll(".message-skeleton");
        expect(skeletonsAfter.length).toBe(0);
        expect(screen.getByText("Alice")).toBeInTheDocument();
        expect(screen.getByText("Hi!")).toBeInTheDocument();
      });
    });

    it("keep showing the skeleton if fetching the messages fails", async () => {
      const errorMessage = "::errorMessage::";
      vi.mocked(messageClient.fetchMessages).mockRejectedValue(new Error(errorMessage));

      const { container } = render(<Chat />);

      // initially show the skeleton messages
      const skeletons = container.querySelectorAll(".message-skeleton");
      expect(skeletons.length).toBeGreaterThan(0);

      // after fetching the info show the messages
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(errorMessage);
      });

      const skeletonsAfter = container.querySelectorAll(".message-skeleton");
      expect(skeletonsAfter.length).toBeGreaterThan(0);
    });
  });

  describe("Message list", () => {
    it("fetches and displays messages on mount", async () => {
      vi.mocked(messageClient.fetchMessages).mockResolvedValue(mockMessages);

      render(<Chat />);

      await waitFor(() => {
        expect(messageClient.fetchMessages).toHaveBeenCalledWith(
          expect.objectContaining({
            before: expect.any(String),
          }),
        );
        expect(screen.getByText("Alice")).toBeInTheDocument();
        expect(screen.getByText("Hi!")).toBeInTheDocument();
      });
    });
  });

  describe("Message input", () => {
    it("shows the Message input component enabled if no errors and no pending messages", async () => {
      vi.mocked(messageClient.fetchMessages).mockResolvedValue([]);

      render(<Chat />);

      await waitFor(() => {
        expect(messageClient.fetchMessages).toHaveBeenCalledWith(
          expect.objectContaining({
            before: expect.any(String),
            limit: 50,
          }),
        );
      });

      const messageInput = screen.getByPlaceholderText(/message/i);

      expect(messageInput).not.toBeDisabled();
    });

    it("shows the Message input component disabled if API error", async () => {
      vi.mocked(messageClient.fetchMessages).mockRejectedValue("::error::");

      render(<Chat />);

      await waitFor(() => {
        expect(messageClient.fetchMessages).toHaveBeenCalledWith(
          expect.objectContaining({
            before: expect.any(String),
          }),
        );
      });

      const messageInput = screen.getByPlaceholderText(/message/i);

      expect(messageInput).toBeDisabled();
    });

    it("shows the Message input component disabled if API fetch is not finished", async () => {
      vi.mocked(messageClient.fetchMessages).mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve([]), 1000)),
      );

      render(<Chat />);

      const messageInput = screen.getByPlaceholderText(/message/i);

      expect(messageInput).toBeDisabled();
    });
  });

  describe("Send message", () => {
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

    it("shows optimistic message immediately when sending", async () => {
      const user = userEvent.setup();

      vi.mocked(messageClient.fetchMessages).mockResolvedValue(mockMessages);
      vi.mocked(messageClient.sendMessage).mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve(mockNewMessage), 100)),
      );

      const { container } = render(<Chat />);

      await waitFor(() => expect(messageClient.fetchMessages).toHaveBeenCalled());

      const messageInput = screen.getByPlaceholderText(/message/i);
      const sendButton = screen.getByRole("button", { name: /send/i });

      await user.type(messageInput, "Hello!");
      await user.click(sendButton);

      const pendingMessage = container.querySelector(".shimmer");
      expect(pendingMessage).toBeInTheDocument();
      expect(pendingMessage?.textContent).toContain("You");
      expect(pendingMessage?.textContent).toContain("Hello!");

      await waitFor(() => {
        expect(messageClient.sendMessage).toHaveBeenCalled();
      });
    });

    it("removes optimistic message when sending fails and keeps text in input", async () => {
      const user = userEvent.setup();

      vi.mocked(messageClient.fetchMessages).mockResolvedValue(mockMessages);
      vi.mocked(messageClient.sendMessage).mockImplementation(
        () =>
          new Promise((_, reject) =>
            setTimeout(
              () => reject(new Error("Failed to send message: Network request failed")),
              50,
            ),
          ),
      );

      const { container } = render(<Chat />);

      await waitFor(() => expect(messageClient.fetchMessages).toHaveBeenCalled());

      const messageInput = screen.getByPlaceholderText(/message/i);
      const sendButton = screen.getByRole("button", { name: /send/i });

      await user.type(messageInput, "Test message");
      await user.click(sendButton);

      await waitFor(() => {
        const pendingMessage = container.querySelector(".shimmer");
        expect(pendingMessage).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalled();
        const pendingAfter = container.querySelector(".shimmer");
        expect(pendingAfter).not.toBeInTheDocument();
      });

      expect(messageInput).toHaveValue("Test message");
    });

    it("scrolls to the bottom of the Chat component when a new message is sent", async () => {
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
  });

  describe("On API error", () => {
    it("displays error toast when fetching messages fails", async () => {
      vi.mocked(messageClient.fetchMessages).mockRejectedValue(
        new Error("Failed to fetch messages: Network request failed"),
      );

      render(<Chat />);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          "Failed to fetch messages: Network request failed",
        );
      });
    });

    it("displays error toast when sending message fails", async () => {
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
        expect(toast.error).toHaveBeenCalledWith("Failed to send message: Network request failed");
      });
    });
  });
});
