import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MessageInput } from "./MessageInput";

describe("MessageInput", () => {
  it("calls onSend with 'You' as author when form is submitted", async () => {
    const onSend = vi.fn();
    const user = userEvent.setup();

    render(<MessageInput onSend={onSend} />);

    const messageInput = screen.getByPlaceholderText(/message/i);
    const sendButton = screen.getByRole("button", { name: /send/i });

    await user.type(messageInput, "Hello World");
    await user.click(sendButton);

    expect(onSend).toHaveBeenCalledWith({ author: "You", message: "Hello World" });
  });
});
