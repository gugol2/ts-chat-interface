import type { MessageType } from "../types/message";
import "./Message.css";

export function Message({ author, message, createdAt }: MessageType) {
  const formattedDate = new Date(createdAt).toLocaleString();
  const isOwnMessage = author === "You";
  const messageClass = isOwnMessage ? "message message--user" : "message";

  return (
    <div className={messageClass}>
      <div className="message__author">{author}</div>
      <div className="message__content">{message}</div>
      <div className="message__timestamp">{formattedDate}</div>
    </div>
  );
}
