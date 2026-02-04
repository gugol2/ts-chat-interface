import { beforeEach, describe, expect, it, vi } from "vitest";
import { fetchMessages, sendMessage } from "./messageClient";

describe("messageClient", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  describe("fetchMessages", () => {
    it("fetches messages from the API with auth token", async () => {
      const mockMessages = [{ author: "John", message: "Hello", createdAt: "2024-01-01" }];
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
        json: async () => mockMessages,
      });

      const result = await fetchMessages();

      expect(global.fetch).toHaveBeenCalledWith("http://localhost:3000/api/v1/messages", {
        headers: { Authorization: "Bearer super-secret-doodle-token" },
      });
      expect(result).toEqual(mockMessages);
    });

    it("fetches messages from the API with auth token and params if there", async () => {
      const mockMessages = [
        { author: "John", message: "Hello", createdAt: "2024-01-01" },
        { author: "Mary", message: "Bye", createdAt: "2024-01-02" },
      ];
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
        json: async () => mockMessages,
      });

      const limitValue = 1;
      const beforeValue = "::beforeValue::";
      const afterValue = "::afterValue::";

      const searchParams = { limit: limitValue, before: beforeValue, after: afterValue };
      const result = await fetchMessages(searchParams);

      const searchParamsUrl = new URLSearchParams(
        `after=${afterValue}&limit=${limitValue}&before=${beforeValue}`,
      );

      expect(global.fetch).toHaveBeenCalledWith(
        `http://localhost:3000/api/v1/messages?${searchParamsUrl}`,
        {
          headers: { Authorization: "Bearer super-secret-doodle-token" },
        },
      );
      expect(result).toEqual(mockMessages);
    });
  });

  describe("sendMessage", () => {
    it("posts a new message to the API with auth token", async () => {
      const newMessage = { author: "Alice", message: "Hi there!" };
      const mockResponse = { ...newMessage, createdAt: "2024-01-02" };
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await sendMessage(newMessage);

      expect(global.fetch).toHaveBeenCalledWith("http://localhost:3000/api/v1/messages", {
        method: "POST",
        headers: {
          Authorization: "Bearer super-secret-doodle-token",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMessage),
      });
      expect(result).toEqual(mockResponse);
    });
  });
});
