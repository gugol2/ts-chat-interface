import type { MessageType } from "../types/message";

export function Message({ author, message, createdAt }: MessageType) {
  const formattedDate = new Date(createdAt).toLocaleString();
  const isOwnMessage = author === "You";
  const messageClass = isOwnMessage ? "message message-own" : "message";

  return (
    <div className={messageClass}>
      <div className="message-author">{author}</div>
      <div className="message-content">{message}</div>
      <div className="message-timestamp">{formattedDate}</div>
    </div>
  );
}
