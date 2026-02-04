import { useState } from "react";
import type { CreateMessageRequestType } from "../types/message";
import "./MessageInput.css";

interface MessageInputProps {
  onSend: (data: CreateMessageRequestType) => Promise<void>;
}

export function MessageInput({ onSend }: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message.trim() && !sending) {
      setSending(true);
      await onSend({ author: "You", message });
      setMessage("");
      setSending(false);
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
          disabled={sending}
        />
        <button type="submit" className="message-input__button" disabled={sending}>
          Send
        </button>
      </div>
    </form>
  );
}
