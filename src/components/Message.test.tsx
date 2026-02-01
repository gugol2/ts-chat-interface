import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Message } from "./Message";

describe("Message", () => {
  it("renders author, message content, and timestamp", () => {
    const messageData = {
      author: "John Doe",
      message: "Hello World",
      createdAt: "2024-01-01T10:30:00.000Z",
    };

    render(<Message {...messageData} />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Hello World")).toBeInTheDocument();
    expect(screen.getByText(/2024/)).toBeInTheDocument();
  });
});
