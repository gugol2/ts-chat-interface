import { useEffect, useRef, useState } from "react";
import { fetchMessages, sendMessage } from "../api/messageClient";
import type { CreateMessageRequestType, MessageType } from "../types/message";
import "./Chat.css";
import { MessageInput } from "./MessageInput";
import { MessageList } from "./MessageList";

export function Chat() {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    async function loadMessages() {
      const data = await fetchMessages({
        before: new Date().toISOString(),
        limit: 25,
      });
      setMessages(data);
      setLoading(false);
    }

    loadMessages();
  }, []);

  const chatRef = useRef<HTMLDivElement>(null);

  async function handleSendMessage(data: CreateMessageRequestType) {
    setSending(true);
    const newMessage = await sendMessage(data);
    setMessages([...messages, newMessage]);
    setSending(false);

    // Wait for React to render
    setTimeout(() => {
      if (chatRef.current) {
        chatRef.current.scrollTop = chatRef.current.scrollHeight;
      }
    }, 10);
  }

  return (
    <div className="chat" ref={chatRef}>
      <MessageList messages={messages} loading={loading} />
      <MessageInput onSend={handleSendMessage} disabled={sending} />
    </div>
  );
}
