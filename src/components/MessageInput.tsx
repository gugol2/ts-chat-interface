import { useState } from "react";
import type { CreateMessageRequestType } from "../types/message";
import "./MessageInput.css";

interface MessageInputProps {
  onSend: (data: CreateMessageRequestType) => void;
  disabled?: boolean;
}

export function MessageInput({ onSend, disabled = false }: MessageInputProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message.trim()) {
      onSend({ author: "You", message });
      setMessage("");
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
          disabled={disabled}
        />
        <button type="submit" className="message-input__button" disabled={disabled}>
          Send
        </button>
      </div>
    </form>
  );
}
