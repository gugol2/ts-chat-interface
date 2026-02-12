import { appConfig } from "../config/app";
import { useMessages } from "../hooks/useMessages";
import { useScrollToBottom } from "../hooks/useScrollToBottom";
import { useSendMessage } from "../hooks/useSendMessage";
import type { CreateMessageRequestType } from "../types/message";
import "./Chat.css";
import { MessageInput } from "./MessageInput";
import { MessageList } from "./MessageList";

export function Chat() {
  const { messages, loading, error, setMessages } = useMessages();
  const { ref, scrollToBottom } = useScrollToBottom();
  const { handleSendMessage: sendMessage } = useSendMessage(messages, setMessages);

  async function handleSendMessage(data: CreateMessageRequestType) {
    scrollToBottom();
    await sendMessage(data);
  }

  const loadingNotFinishedOrErrors = loading || error;

  return (
    <div className="chat" ref={ref}>
      <MessageList
        messages={messages}
        loading={loadingNotFinishedOrErrors}
        skeletonCount={appConfig.messagesPerRequest}
      />
      <MessageInput onSend={handleSendMessage} disabled={loadingNotFinishedOrErrors} />
    </div>
  );
}
