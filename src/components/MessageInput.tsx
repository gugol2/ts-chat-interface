import { useState } from "react";
import type { CreateMessageRequestType } from "../types/message";

interface MessageInputProps {
  onSend: (data: CreateMessageRequestType) => void;
}

export function MessageInput({ onSend }: MessageInputProps) {
  const [author, setAuthor] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (author.trim() && message.trim()) {
      onSend({ author, message });
      setAuthor("");
      setMessage("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="message-input">
      <input
        type="text"
        placeholder="Author"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
      />
      <textarea
        placeholder="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button type="submit">Send</button>
    </form>
  );
}
