export interface Message {
  author: string;
  message: string;
  createdAt: string;
}

export interface CreateMessageRequest {
  author: string;
  message: string;
}

export interface GetMessagesParams {
  after?: string;
  limit?: number;
}
