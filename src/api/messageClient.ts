import { appConfig } from "../config/app";
import { getErrorMessage } from "../helpers/getErrorMessage";
import type {
  ApiMessageType,
  CreateMessageRequestType,
  GetMessagesParamsType,
} from "../types/message";

const API_BASE_URL = appConfig.baseUrl;
const AUTH_TOKEN = appConfig.authToken;

async function handleRequest<T>(
  fetchPromise: Promise<Response>,
  customErrorMessage: string,
): Promise<T> {
  let response: Response;
  try {
    response = await fetchPromise;
  } catch (error) {
    const originalMessage = getErrorMessage(error);
    throw new Error(customErrorMessage, { cause: originalMessage });
  }

  if (!response.ok) {
    const errorData = await response.json();
    let apiErrorMessage: string;

    if (typeof errorData.error === "string") {
      apiErrorMessage = errorData.error;
    } else if (Array.isArray(errorData.error.message)) {
      apiErrorMessage = errorData.error.message[0].message;
    } else {
      apiErrorMessage = errorData.error.message;
    }

    throw new Error(apiErrorMessage);
  }

  return response.json();
}

export async function fetchMessages(params?: GetMessagesParamsType): Promise<ApiMessageType[]> {
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

  return handleRequest<ApiMessageType[]>(
    fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
    }),
    "Failed to fetch messages",
  );
}

export async function sendMessage(data: CreateMessageRequestType): Promise<ApiMessageType> {
  return handleRequest<ApiMessageType>(
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
