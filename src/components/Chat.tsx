import { useEffect, useRef, useState } from "react";
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

  const chatRef = useRef<HTMLDivElement>(null);
  const previousMessageCountRef = useRef(0);

  useEffect(() => {
    if (!loading && chatRef.current) {
      const currentCount = messages.length;
      const previousCount = previousMessageCountRef.current;

      if (currentCount > previousCount && previousCount > 0) {
        const scrollableChat = chatRef.current;
        if (scrollableChat) {
          scrollableChat.scrollTop = scrollableChat.scrollHeight;
        }
      }

      previousMessageCountRef.current = currentCount;
    }
  }, [messages, loading]);

  return (
    <div className="chat" ref={chatRef}>
      <MessageList messages={messages} loading={loading} />
      <MessageInput onSend={handleSendMessage} />
    </div>
  );
}
