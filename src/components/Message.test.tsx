import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Message } from "./Message";

describe("Message", () => {
  it("renders author, message content, and timestamp", () => {
    const messageData = {
      _id: "::_id::",
      author: "John Doe",
      message: "Hello World",
      createdAt: "2024-01-01T10:30:00.000Z",
    };

    render(<Message {...messageData} />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Hello World")).toBeInTheDocument();
    expect(screen.getByText(/2024/)).toBeInTheDocument();
  });

  it("applies 'message--user' class when author is 'You'", () => {
    const messageData = {
      _id: "::_id::",
      author: "You",
      message: "My message",
      createdAt: "2024-01-01T10:30:00.000Z",
    };

    const { container } = render(<Message {...messageData} />);
    const messageElement = container.querySelector(".message");

    expect(messageElement).toHaveClass("message--user");
  });
});
