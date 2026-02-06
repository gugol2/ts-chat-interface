import type { MessageType } from "../types/message";
import "./Message.css";

export function Message({ author, message, createdAt, pending }: MessageType) {
  const formattedDate = new Date(createdAt).toLocaleString();
  const isOwnMessage = author === "You";
  const messageClass = pending
    ? "message message--user shimmer"
    : isOwnMessage
      ? "message message--user"
      : "message";

  return (
    <div className={messageClass}>
      <div className="message__author">{author}</div>
      <div className="message__content">{message}</div>
      <div className="message__timestamp">{formattedDate}</div>
    </div>
  );
}
