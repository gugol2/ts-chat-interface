import { useEffect, useState } from "react";
import { fetchMessages, sendMessage } from "../api/messageClient";
import type { CreateMessageRequestType, MessageType } from "../types/message";
import { MessageInput } from "./MessageInput";
import { MessageList } from "./MessageList";
import "./Chat.css";
import { MessageListLoading } from "./MessageListLoading";

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
      {loading ? <MessageListLoading /> : <MessageList messages={messages} />}
      <MessageInput onSend={handleSendMessage} />
    </div>
  );
}
