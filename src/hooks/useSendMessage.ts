import toast from "react-hot-toast";
import { sendMessage } from "../api/messageClient";
import { createOptimisticMessage } from "../helpers/createOptimisticMessage";
import { getErrorMessage } from "../helpers/getErrorMessage";
import type { CreateMessageRequestType, MessageType } from "../types/message";

type SetMessagesType = React.Dispatch<React.SetStateAction<MessageType[]>>;

export function useSendMessage(messages: MessageType[], setMessages: SetMessagesType) {
  async function handleSendMessage(data: CreateMessageRequestType) {
    const optimisticMessage = createOptimisticMessage(data);

    setMessages([...messages, optimisticMessage]);

    try {
      const newMessage = await sendMessage(data);
      setMessages((prev) =>
        prev.map((msg) => (msg._id === optimisticMessage._id ? newMessage : msg)),
      );
    } catch (err) {
      setMessages((prev) => prev.filter((msg) => msg._id !== optimisticMessage._id));
      toast.error(getErrorMessage(err));
      throw err;
    }
  }

  return { handleSendMessage };
}
