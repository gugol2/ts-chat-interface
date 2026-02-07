import { formatMessageDate } from "../helpers/formatMessageDate";
import type { MessageType } from "../types/message";
import "./Message.css";

export function Message({ author, message, createdAt, pending }: MessageType) {
  const formattedDate = formatMessageDate(createdAt);
  const isOwnMessage = author === "You";

  let messageClass = "message";

  if (isOwnMessage) {
    messageClass += " message--user";
  }
  if (pending) {
    messageClass += " shimmer";
  }

  return (
    <div className={messageClass}>
      <div className="message__author">{author}</div>
      <div className="message__content">{message}</div>
      <div className={`message__timestamp ${pending ? "shimmer-reversed" : ""}`}>
        {formattedDate}
      </div>
    </div>
  );
}
