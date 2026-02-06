export interface ApiMessageType {
  _id: string;
  author: string;
  message: string;
  createdAt: string;
}

export interface MessageType extends ApiMessageType {
  pending?: boolean;
}

export interface CreateMessageRequestType {
  author: string;
  message: string;
}

export interface GetMessagesParamsType {
  after?: string;
  before?: string;
  limit?: number;
}
