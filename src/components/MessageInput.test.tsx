import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MessageInput } from "./MessageInput";

describe("MessageInput", () => {
  const onSend = vi.fn();

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("calls onSend with 'You' as author when form is submitted", async () => {
    const user = userEvent.setup();

    render(<MessageInput onSend={onSend} />);

    const messageInput = screen.getByPlaceholderText(/message/i);
    const sendButton = screen.getByRole("button", { name: /send/i });

    await user.type(messageInput, "Hello World");
    await user.click(sendButton);

    expect(onSend).toHaveBeenCalledWith({ author: "You", message: "Hello World" });
  });

  it("NOT call onSend if message is empty", async () => {
    const user = userEvent.setup();

    render(<MessageInput onSend={onSend} />);

    const messageInput = screen.getByPlaceholderText(/message/i);
    const sendButton = screen.getByRole("button", { name: /send/i });

    await user.type(messageInput, " ");
    await user.click(sendButton);

    expect(onSend).not.toHaveBeenCalled();
  });

  it("disables send button when message is empty", async () => {
    const user = userEvent.setup();

    render(<MessageInput onSend={onSend} />);

    const messageInput = screen.getByPlaceholderText(/message/i);
    const sendButton = screen.getByRole("button", { name: /send/i });

    expect(sendButton).toBeDisabled();

    await user.type(messageInput, "Hello");
    expect(sendButton).not.toBeDisabled();

    await user.clear(messageInput);
    expect(sendButton).toBeDisabled();
  });

  it("disables input and button while sending a message", async () => {
    const user = userEvent.setup();

    onSend.mockImplementation(() => new Promise((resolve) => setTimeout(() => resolve(""), 100)));

    render(<MessageInput onSend={onSend} />);

    const messageInput = screen.getByPlaceholderText(/message/i);
    const sendButton = screen.getByRole("button", { name: /send/i });

    expect(messageInput).not.toBeDisabled();
    expect(sendButton).toBeDisabled();

    // user types and the button is enabled
    await user.type(messageInput, "Hello!");
    expect(sendButton).not.toBeDisabled();
    await user.click(sendButton);

    // during the API call
    await waitFor(() => {
      expect(messageInput).toBeDisabled();
      expect(sendButton).toBeDisabled();
    });

    // when the API responds the button is disabled
    await waitFor(() => {
      expect(messageInput).not.toBeDisabled();
      expect(sendButton).toBeDisabled();
    });
  });
});
