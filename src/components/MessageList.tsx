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
  const previousMessageCountRef = useRef(0);

  useEffect(() => {
    if (!loading && messageListRef.current) {
      const currentCount = messages.length;
      const previousCount = previousMessageCountRef.current;

      if (currentCount > previousCount && previousCount > 0) {
        const scrollableParent = messageListRef.current.parentElement;
        if (scrollableParent) {
          scrollableParent.scrollTop = scrollableParent.scrollHeight;
        }
      }

      previousMessageCountRef.current = currentCount;
    }
  }, [messages, loading]);

  return (
    <div className="message-list" ref={messageListRef}>
      {loading ? LoadingSkeleton : messages.map((msg) => <Message key={msg._id} {...msg} />)}
    </div>
  );
}
