import type { MessageType } from "../types/message";

export function Message({ author, message, createdAt }: MessageType) {
  const formattedDate = new Date(createdAt).toLocaleString();

  return (
    <div className="message">
      <div className="message-author">{author}</div>
      <div className="message-content">{message}</div>
      <div className="message-timestamp">{formattedDate}</div>
    </div>
  );
}
