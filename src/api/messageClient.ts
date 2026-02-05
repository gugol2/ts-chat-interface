import type {
  CreateMessageRequestType,
  GetMessagesParamsType,
  MessageType,
} from "../types/message";

const API_BASE_URL = "http://localhost:3000/api/v1";
const AUTH_TOKEN = "super-secret-doodle-token";

async function handleRequest<T>(fetchPromise: Promise<Response>, errorMessage: string): Promise<T> {
  let response: Response;
  try {
    response = await fetchPromise;
  } catch (_error) {
    throw new Error(errorMessage);
  }

  if (!response.ok) {
    const errorData = await response.json();
    const apiErrorMessage =
      typeof errorData.error === "string" ? errorData.error : errorData.error.message;
    throw new Error(apiErrorMessage);
  }

  return response.json();
}

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

  return handleRequest<MessageType[]>(
    fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
    }),
    "Failed to fetch messages",
  );
}

export async function sendMessage(data: CreateMessageRequestType): Promise<MessageType> {
  return handleRequest<MessageType>(
    fetch(`${API_BASE_URL}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }),
    "Failed to send message",
  );
}
