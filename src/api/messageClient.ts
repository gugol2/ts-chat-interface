import type {
  CreateMessageRequestType,
  GetMessagesParamsType,
  MessageType,
} from "../types/message";

const API_BASE_URL = "http://localhost:3000/api/v1";
const AUTH_TOKEN = "super-secret-doodle-token";

export async function fetchMessages(params?: GetMessagesParamsType): Promise<MessageType[]> {
  const url = new URL(`${API_BASE_URL}/messages`);
  if (params?.after) {
    url.searchParams.append("after", params.after);
  }
  if (params?.limit) {
    url.searchParams.append("limit", params.limit.toString());
  }
  if (params?.before) {
    url.searchParams.append("before", params.before);
  }

  let response: Response;
  try {
    response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
    });
  } catch (_error) {
    throw new Error("Failed to fetch messages");
  }

  if (!response.ok) {
    const errorData = await response.json();
    const errorMessage =
      typeof errorData.error === "string" ? errorData.error : errorData.error.message;
    throw new Error(errorMessage);
  }

  return response.json();
}

export async function sendMessage(data: CreateMessageRequestType): Promise<MessageType> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  } catch (_error) {
    throw new Error("Failed to send message");
  }

  if (!response.ok) {
    const errorData = await response.json();
    const errorMessage =
      typeof errorData.error === "string" ? errorData.error : errorData.error.message;
    throw new Error(errorMessage);
  }

  return response.json();
}
