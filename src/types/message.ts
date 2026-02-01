export interface MessageType {
  _id: string;
  author: string;
  message: string;
  createdAt: string;
}

export interface CreateMessageRequestType {
  author: string;
  message: string;
}

export interface GetMessagesParamsType {
  after?: string;
  limit?: number;
}
