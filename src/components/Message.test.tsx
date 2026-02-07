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

  it("applies 'message--user' and 'shimmer' class when pending is true", () => {
    const messageData = {
      _id: "::_id::",
      author: "You",
      message: "My message",
      createdAt: "2024-01-01T10:30:00.000Z",
      pending: true,
    };

    const { container } = render(<Message {...messageData} />);
    const messageElement = container.querySelector(".message");

    expect(messageElement).toHaveClass("message message--user shimmer");
  });

  describe("class message__timestamp", () => {
    it("applies 'message__timestamp' and 'shimmer-reversed' class to the date when pending is true", () => {
      const messageData = {
        _id: "::_id::",
        author: "You",
        message: "My message",
        createdAt: "2024-01-01T10:30:00.000Z",
        pending: true,
      };

      const { container } = render(<Message {...messageData} />);
      const messageElement = container.querySelector(".message__timestamp");

      expect(messageElement).toHaveClass("message__timestamp shimmer-reversed");
    });

    it("applies ONLY 'message__timestamp' class to the date when pending is NOT true", () => {
      const messageData = {
        _id: "::_id::",
        author: "You",
        message: "My message",
        createdAt: "2024-01-01T10:30:00.000Z",
      };

      const { container } = render(<Message {...messageData} />);
      const messageElement = container.querySelector(".message__timestamp");

      expect(messageElement).toHaveClass("message__timestamp");
      expect(messageElement).not.toHaveClass("shimmer-reversed");
    });
  });
});
