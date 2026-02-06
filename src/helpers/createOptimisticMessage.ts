import type { CreateMessageRequestType, MessageType } from "../types/message";

export const createOptimisticMessage = (data: CreateMessageRequestType): MessageType => {
  const optimisticId = `temp-${Date.now()}`;
  const optimisticMessage: MessageType = {
    _id: optimisticId,
    author: data.author,
    message: data.message,
    createdAt: new Date().toISOString(),
    pending: true,
  };

  return optimisticMessage;
};
