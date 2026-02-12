export const appConfig = {
  messagesPerRequest: Number(import.meta.env.VITE_MESSAGES_PER_REQUEST) || 50,
  baseUrl: import.meta.env.VITE_API_URL ?? "http://localhost:3000/api/v1",
  authToken: import.meta.env.VITE_AUTH_TOKEN ?? "",
} as const;
