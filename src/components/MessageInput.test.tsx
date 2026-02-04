import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { MessageInput } from "./MessageInput";

describe("MessageInput", () => {
  const onSend = vi.fn();

  it("calls onSend with 'You' as author when form is submitted", async () => {
    const user = userEvent.setup();

    render(<MessageInput onSend={onSend} />);

    const messageInput = screen.getByPlaceholderText(/message/i);
    const sendButton = screen.getByRole("button", { name: /send/i });

    await user.type(messageInput, "Hello World");
    await user.click(sendButton);

    expect(onSend).toHaveBeenCalledWith({ author: "You", message: "Hello World" });
  });

  it("disables input and button while sending a message", async () => {
    const user = userEvent.setup();

    onSend.mockImplementation(() => new Promise((resolve) => setTimeout(() => resolve(""), 100)));

    render(<MessageInput onSend={onSend} />);

    const messageInput = screen.getByPlaceholderText(/message/i);
    const sendButton = screen.getByRole("button", { name: /send/i });

    expect(messageInput).not.toBeDisabled();
    expect(sendButton).not.toBeDisabled();

    await user.type(messageInput, "Hello!");
    await user.click(sendButton);

    expect(messageInput).toBeDisabled();
    expect(sendButton).toBeDisabled();

    await waitFor(() => {
      expect(messageInput).not.toBeDisabled();
      expect(sendButton).not.toBeDisabled();
    });
  });
});
