import { useState, useEffect } from "react";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { fetchMessages, sendMessage } from "../api/messageClient";
import type { MessageType, CreateMessageRequestType } from "../types/message";

export function Chat() {
  const [messages, setMessages] = useState<MessageType[]>([]);

  useEffect(() => {
    async function loadMessages() {
      const data = await fetchMessages();
      setMessages(data);
    }
    loadMessages();
  }, []);

  async function handleSendMessage(data: CreateMessageRequestType) {
    const newMessage = await sendMessage(data);
    setMessages([...messages, newMessage]);
  }

  return (
    <div className="chat">
      <MessageList messages={messages} />
      <MessageInput onSend={handleSendMessage} />
    </div>
  );
}
