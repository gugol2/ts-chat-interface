import { useState } from "react";
import type { CreateMessageRequestType } from "../types/message";

interface MessageInputProps {
  onSend: (data: CreateMessageRequestType) => void;
}

export function MessageInput({ onSend }: MessageInputProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSend({ author: "You", message });
      setMessage("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="message-input">
      <textarea
        placeholder="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button type="submit">Send</button>
    </form>
  );
}
