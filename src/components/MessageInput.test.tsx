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

    render(<MessageInput onSend={onSend} disabled={false} />);

    const messageInput = screen.getByPlaceholderText(/message/i);
    const sendButton = screen.getByRole("button", { name: /send/i });

    const messageText = "::messageText::";

    await user.type(messageInput, messageText);
    await user.click(sendButton);

    expect(onSend).toHaveBeenCalledWith({ author: "You", message: messageText });
  });

  it("NOT call onSend if message is empty", async () => {
    const user = userEvent.setup();

    render(<MessageInput onSend={onSend} disabled={false} />);

    const messageInput = screen.getByPlaceholderText(/message/i);
    const sendButton = screen.getByRole("button", { name: /send/i });

    await user.type(messageInput, " ");
    await user.click(sendButton);

    expect(onSend).not.toHaveBeenCalled();
  });

  describe("enabled/disabled the input and the button", () => {
    it("BOTH input and button are disabled if the MessageInput prop disabled is true", async () => {
      userEvent.setup();

      render(<MessageInput onSend={onSend} disabled={true} />);

      const messageInput = screen.getByPlaceholderText(/message/i);
      const sendButton = screen.getByRole("button", { name: /send/i });

      expect(messageInput).toBeDisabled();
      expect(sendButton).toBeDisabled();
    });

    it("ONLY the input is enabled if the MessageInput prop disabled is false", async () => {
      userEvent.setup();

      render(<MessageInput onSend={onSend} disabled={false} />);

      const messageInput = screen.getByPlaceholderText(/message/i);
      const sendButton = screen.getByRole("button", { name: /send/i });

      expect(messageInput).not.toBeDisabled();
      expect(sendButton).toBeDisabled();
    });

    it("disables send button when message is empty and enable it when the user types", async () => {
      const user = userEvent.setup();

      render(<MessageInput onSend={onSend} disabled={false} />);

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

      render(<MessageInput onSend={onSend} disabled={false} />);

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

      // when the API responds the button is disabled cause the value of the input is cleared
      await waitFor(() => {
        expect(messageInput).not.toBeDisabled();
        expect(sendButton).toBeDisabled();
      });
    });

    it("re-enables input when sending fails", async () => {
      const user = userEvent.setup();

      onSend.mockRejectedValue(new Error("Failed to send"));

      render(<MessageInput onSend={onSend} disabled={false} />);

      const messageInput = screen.getByPlaceholderText(/message/i);
      const sendButton = screen.getByRole("button", { name: /send/i });

      const messageText = "::messageText::";
      await user.type(messageInput, messageText);
      await user.click(sendButton);

      await waitFor(() => {
        expect(onSend).toHaveBeenCalledWith({ message: messageText, author: "You" });
      });

      // the input text is not cleared on error
      expect(messageInput).toHaveValue(messageText);
      expect(messageInput).not.toBeDisabled();
      expect(sendButton).not.toBeDisabled();
    });
  });
});
