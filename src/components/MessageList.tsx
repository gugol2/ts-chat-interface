import { useEffect, useRef } from "react";
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
  const messageListRef = useRef<HTMLDivElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!loading && messageListRef.current) {
      const scrollableParent = messageListRef.current.parentElement;
      if (scrollableParent) {
        scrollableParent.scrollTop = scrollableParent.scrollHeight;
      }
    }
  }, [loading, messages]);

  return (
    <div className="message-list" ref={messageListRef}>
      {loading ? LoadingSkeleton : messages.map((msg) => <Message key={msg._id} {...msg} />)}
    </div>
  );
}
