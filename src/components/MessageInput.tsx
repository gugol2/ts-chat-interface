import { useState } from "react";
import type { CreateMessageRequestType } from "../types/message";
import "./MessageInput.css";

interface MessageInputProps {
  onSend: (data: CreateMessageRequestType) => Promise<void>;
  disabled: boolean;
}

export function MessageInput({ onSend, disabled }: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const isDisabled = disabled || sending;

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message.trim() && !isDisabled) {
      setSending(true);
      try {
        await onSend({ author: "You", message });
        setMessage("");
      } catch (_error) {
        // Error is handled by parent component (Chat)
      } finally {
        setSending(false);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.SubmitEvent<HTMLFormElement>);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="message-input">
      <div className="message-input__container">
        <textarea
          id="message"
          name="message"
          className="message-input__field"
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isDisabled}
        />
        <button
          type="submit"
          className="message-input__button"
          disabled={isDisabled || !message.trim()}
        >
          Send
        </button>
      </div>
    </form>
  );
}
