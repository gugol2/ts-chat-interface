import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MessageList } from "./MessageList";

describe("MessageList", () => {
  const messages = [
    { _id: "::_id-1::", author: "Alice", message: "Hi!", createdAt: "2024-01-01T10:00:00.000Z" },
    { _id: "::_id-2::", author: "Bob", message: "Hello!", createdAt: "2024-01-01T10:01:00.000Z" },
  ];

  it("renders a list of skeleton messages when loading is true", async () => {
    const { container } = render(<MessageList messages={messages} loading={true} />);
    expect(container.querySelectorAll(".message-skeleton").length).toBe(15);

    expect(screen.queryByText("Alice")).not.toBeInTheDocument();
    expect(screen.queryByText("Hi!")).not.toBeInTheDocument();
    expect(screen.queryByText("Bob")).not.toBeInTheDocument();
    expect(screen.queryByText("Hello!")).not.toBeInTheDocument();
  });

  it("renders a list of actual messages when loading is false", () => {
    render(<MessageList messages={messages} loading={false} />);

    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Hi!")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.getByText("Hello!")).toBeInTheDocument();
  });

  it("scrolls to bottom when a new message arrives", () => {
    const initialMessages = [
      { _id: "::_id-1::", author: "Alice", message: "Hi!", createdAt: "2024-01-01T10:00:00.000Z" },
    ];

    const { container, rerender } = render(
      <MessageList messages={initialMessages} loading={false} />,
    );

    const messageListElement = container.querySelector(".message-list");
    const parentElement = messageListElement?.parentElement as HTMLElement;

    Object.defineProperty(parentElement, "scrollHeight", {
      writable: true,
      configurable: true,
      value: 1000,
    });

    const scrollTopSetter = vi.fn();
    Object.defineProperty(parentElement, "scrollTop", {
      set: scrollTopSetter,
      get: () => 0,
    });

    const newMessages = [
      ...initialMessages,
      {
        _id: "::_id-3::",
        author: "Charlie",
        message: "Hey!",
        createdAt: "2024-01-01T10:02:00.000Z",
      },
    ];

    rerender(<MessageList messages={newMessages} loading={false} />);

    expect(scrollTopSetter).toHaveBeenCalledWith(1000);
  });

  it("NOT scrolls to bottom when messages finish loading", () => {
    const initialMessages = [
      { _id: "::_id-1::", author: "Alice", message: "Hi!", createdAt: "2024-01-01T10:00:00.000Z" },
    ];

    const { container } = render(<MessageList messages={initialMessages} loading={false} />);

    const messageListElement = container.querySelector(".message-list");
    const parentElement = messageListElement?.parentElement as HTMLElement;

    Object.defineProperty(parentElement, "scrollHeight", {
      writable: true,
      configurable: true,
      value: 1000,
    });

    const scrollTopSetter = vi.fn();
    Object.defineProperty(parentElement, "scrollTop", {
      set: scrollTopSetter,
      get: () => 0,
    });

    expect(scrollTopSetter).not.toHaveBeenCalled();
  });
});
