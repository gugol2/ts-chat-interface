import type { MessageType } from "../types/message";
import { Message } from "./Message";

interface MessageListProps {
  messages: MessageType[];
}

export function MessageList({ messages }: MessageListProps) {
  return (
    <>
      {messages.map((msg) => (
        <Message key={msg._id} {...msg} />
      ))}
    </>
  );
}
