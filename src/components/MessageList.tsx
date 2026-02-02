import type { MessageType } from "../types/message";
import { Message } from "./Message";
import "./MessageList.css";

interface MessageListProps {
  messages: MessageType[];
}

export function MessageList({ messages }: MessageListProps) {
  return (
    <div className="message-list">
      {messages.map((msg) => (
        <Message key={msg._id} {...msg} />
      ))}
    </div>
  );
}
