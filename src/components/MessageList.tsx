import type { MessageType } from "../types/message";
import { LoadingSkeleton } from "./LoadingSkeleton";
import { Message } from "./Message";
import "./MessageList.css";

interface MessageListProps {
  messages: MessageType[];
  loading: boolean;
}

export function MessageList({ messages, loading }: MessageListProps) {
  return (
    <div className="message-list" role="log" aria-live="polite" aria-label="Chat messages">
      {loading ? <LoadingSkeleton /> : messages.map((msg) => <Message key={msg._id} {...msg} />)}
    </div>
  );
}
