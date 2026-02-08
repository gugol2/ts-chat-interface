import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MessageList } from "./MessageList";

describe("MessageList", () => {
  const messages = [
    { _id: "::_id-1::", author: "Alice", message: "Hi!", createdAt: "2024-01-01T10:00:00.000Z" },
    { _id: "::_id-2::", author: "Bob", message: "Hello!", createdAt: "2024-01-01T10:01:00.000Z" },
  ];

  it("renders a list of actual messages", () => {
    render(<MessageList messages={messages} />);

    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Hi!")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.getByText("Hello!")).toBeInTheDocument();
  });
});
