import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MessageList } from "./MessageList";

describe("MessageList", () => {
  it("renders a list of messages", () => {
    const messages = [
      { author: "Alice", message: "Hi!", createdAt: "2024-01-01T10:00:00.000Z" },
      { author: "Bob", message: "Hello!", createdAt: "2024-01-01T10:01:00.000Z" },
    ];

    render(<MessageList messages={messages} />);

    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Hi!")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.getByText("Hello!")).toBeInTheDocument();
  });
});
