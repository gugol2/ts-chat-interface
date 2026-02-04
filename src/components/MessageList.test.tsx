import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MessageList } from "./MessageList";

describe("MessageList", () => {
  it("renders a list of skeleton messages when loading is true", async () => {
    const messages = [
      { _id: "::_id-1::", author: "Alice", message: "Hi!", createdAt: "2024-01-01T10:00:00.000Z" },
      { _id: "::_id-2::", author: "Bob", message: "Hello!", createdAt: "2024-01-01T10:01:00.000Z" },
    ];

    const { container } = render(<MessageList messages={messages} loading={true} />);
    expect(container.querySelectorAll(".message-skeleton").length).toBe(15);

    expect(screen.queryByText("Alice")).not.toBeInTheDocument();
    expect(screen.queryByText("Hi!")).not.toBeInTheDocument();
    expect(screen.queryByText("Bob")).not.toBeInTheDocument();
    expect(screen.queryByText("Hello!")).not.toBeInTheDocument();
  });

  it("renders a list of actual messages when loading is false", () => {
    const messages = [
      { _id: "::_id-1::", author: "Alice", message: "Hi!", createdAt: "2024-01-01T10:00:00.000Z" },
      { _id: "::_id-2::", author: "Bob", message: "Hello!", createdAt: "2024-01-01T10:01:00.000Z" },
    ];

    render(<MessageList messages={messages} loading={false} />);

    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Hi!")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.getByText("Hello!")).toBeInTheDocument();
  });
});
