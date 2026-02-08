export const appConfig = {
  messagesPerRequest: Number(import.meta.env.VITE_MESSAGES_PER_REQUEST) || 50,
} as const;
