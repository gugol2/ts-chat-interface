import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { fetchMessages } from "../api/messageClient";
import { appConfig } from "../config/app";
import { getErrorMessage } from "../helpers/getErrorMessage";
import type { MessageType } from "../types/message";

export function useMessages() {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadMessages() {
      try {
        const data = await fetchMessages({
          before: new Date().toISOString(),
          limit: appConfig.messagesPerRequest,
        });
        setMessages(data);
        setError(false);
      } catch (err) {
        toast.error(getErrorMessage(err));
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    loadMessages();
  }, []);

  return { messages, loading, error, setMessages };
}
