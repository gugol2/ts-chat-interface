import type { Message, GetMessagesParams, CreateMessageRequest } from "../types/message";

const API_BASE_URL = "http://localhost:3000/api/v1";
const AUTH_TOKEN = "super-secret-doodle-token";

export async function fetchMessages(params?: GetMessagesParams): Promise<Message[]> {
  const url = new URL(`${API_BASE_URL}/messages`);
  if (params?.after) {
    url.searchParams.append("after", params.after);
  }
  if (params?.limit) {
    url.searchParams.append("limit", params.limit.toString());
  }

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${AUTH_TOKEN}`,
    },
  });

  return response.json();
}

export async function sendMessage(data: CreateMessageRequest): Promise<Message> {
  const response = await fetch(`${API_BASE_URL}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${AUTH_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return response.json();
}
