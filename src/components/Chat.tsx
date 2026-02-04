import { useEffect, useState } from "react";
import { fetchMessages, sendMessage } from "../api/messageClient";
import type { CreateMessageRequestType, MessageType } from "../types/message";
import "./Chat.css";
import { MessageInput } from "./MessageInput";
import { MessageList } from "./MessageList";

export function Chat() {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMessages() {
      const data = await fetchMessages();
      setMessages(data);
      setLoading(false);
    }

    loadMessages();
  }, []);

  async function handleSendMessage(data: CreateMessageRequestType) {
    const newMessage = await sendMessage(data);
    setMessages([...messages, newMessage]);
  }

  return (
    <div className="chat">
      <MessageList messages={messages} loading={loading} />
      <MessageInput onSend={handleSendMessage} />
    </div>
  );
}
