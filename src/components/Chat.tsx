import { useEffect, useRef, useState } from "react";
import { fetchMessages, sendMessage } from "../api/messageClient";
import type { CreateMessageRequestType, MessageType } from "../types/message";
import "./Chat.css";
import { MessageInput } from "./MessageInput";
import { MessageList } from "./MessageList";

export function Chat() {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadMessages() {
      try {
        const data = await fetchMessages({
          before: new Date().toISOString(),
          limit: 25,
        });
        setMessages(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }

    loadMessages();
  }, []);

  const chatRef = useRef<HTMLDivElement>(null);

  async function handleSendMessage(data: CreateMessageRequestType) {
    try {
      const newMessage = await sendMessage(data);
      setMessages([...messages, newMessage]);

      // Wait for React to render
      setTimeout(() => {
        if (chatRef.current) {
          chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
      }, 10);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
    }
  }

  return (
    <div className="chat" ref={chatRef}>
      {error && <div className="chat__error-message">{error}</div>}
      <MessageList messages={messages} loading={loading} />
      <MessageInput onSend={handleSendMessage} />
    </div>
  );
}
