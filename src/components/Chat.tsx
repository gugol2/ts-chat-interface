import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { fetchMessages, sendMessage } from "../api/messageClient";
import type { CreateMessageRequestType, MessageType } from "../types/message";
import "./Chat.css";
import { createOptimisticMessage } from "../helpers/createOptimisticMessage";
import { getErrorMessage } from "../helpers/getErrorMessage";
import { LoadingSkeleton } from "./LoadingSkeleton";
import { MessageInput } from "./MessageInput";
import { MessageList } from "./MessageList";

const messagesPerRequest = 50;

export function Chat() {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadMessages() {
      try {
        const data = await fetchMessages({
          before: new Date().toISOString(),
          limit: messagesPerRequest,
        });
        setMessages(data);
        setError(false);
      } catch (err) {
        toast.error(getErrorMessage(err));
        setError(true);
      } finally {
        setLoadingMessages(false);
      }
    }

    loadMessages();
  }, []);

  const chatRef = useRef<HTMLDivElement>(null);

  async function handleSendMessage(data: CreateMessageRequestType) {
    const optimisticMessage = createOptimisticMessage(data);

    setMessages([...messages, optimisticMessage]);

    setTimeout(() => {
      if (chatRef.current) {
        chatRef.current.scrollTop = chatRef.current.scrollHeight;
      }
    }, 10);

    try {
      const newMessage = await sendMessage(data);
      setMessages((prev) =>
        prev.map((msg) => (msg._id === optimisticMessage._id ? newMessage : msg)),
      );
    } catch (err) {
      setMessages((prev) => prev.filter((msg) => msg._id !== optimisticMessage._id));
      toast.error(getErrorMessage(err));
      throw err;
    }
  }

  const loadingNotFinishedOrErrors = loadingMessages || error;

  return (
    <div className="chat" ref={chatRef}>
      <div className="chat-message-list" role="log" aria-live="polite" aria-label="Chat messages">
        {loadingNotFinishedOrErrors ? (
          <LoadingSkeleton skeletonCount={messagesPerRequest} />
        ) : (
          <MessageList messages={messages} />
        )}
      </div>
      <MessageInput onSend={handleSendMessage} disabled={loadingNotFinishedOrErrors} />
    </div>
  );
}
