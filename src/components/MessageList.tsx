import type { MessageType } from "../types/message";
import { Message } from "./Message";
import { MessageSkeleton } from "./MessageSkeleton";
import "./MessageList.css";

interface MessageListProps {
  messages: MessageType[];
  loading: boolean;
}

const LoadingSkeleton = (
  <>
    <MessageSkeleton />
    <MessageSkeleton />
    <MessageSkeleton />
    <MessageSkeleton />
    <MessageSkeleton />
    <MessageSkeleton />
    <MessageSkeleton />
    <MessageSkeleton />
    <MessageSkeleton />
    <MessageSkeleton />
    <MessageSkeleton />
    <MessageSkeleton />
    <MessageSkeleton />
    <MessageSkeleton />
    <MessageSkeleton />
  </>
);

export function MessageList({ messages, loading }: MessageListProps) {
  return (
    <div className="message-list">
      {loading ? LoadingSkeleton : messages.map((msg) => <Message key={msg._id} {...msg} />)}
    </div>
  );
}
