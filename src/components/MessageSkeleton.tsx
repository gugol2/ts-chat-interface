import "./Message.css";
import "./MessageSkeleton.css";

export function MessageSkeleton() {
  const messageClass = Math.random() >= 0.5 ? "message message--user" : "message";

  return (
    <div className={`${messageClass} message-skeleton`}>
      <div className="message-skeleton__author"></div>
      <div className="message-skeleton__content"></div>
      <div className="message-skeleton__timestamp"></div>
    </div>
  );
}
