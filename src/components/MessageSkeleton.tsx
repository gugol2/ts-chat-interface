import "./Message.css";
import "./MessageSkeleton.css";

export function MessageSkeleton() {
  const messageClass = Math.random() >= 0.5 ? "message message--user" : "message";

  return (
    <div className={`${messageClass} message-skeleton`}>
      <div className="message-skeleton__author shimmer"></div>
      <div className="message-skeleton__content shimmer"></div>
      <div className="message-skeleton__timestamp shimmer"></div>
    </div>
  );
}
