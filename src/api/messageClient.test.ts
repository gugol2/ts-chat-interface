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

    it("throws error when network fails", async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValue(
        new Error("Network request failed"),
      );

      await expect(fetchMessages()).rejects.toThrow(
        /^Failed to fetch messages: Network request failed$/,
      );
    });

    it("throws error when API returns 400", async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({
          error: "Invalid query parameters",
          details: [{ msg: "Invalid timestamp format", param: "after", location: "query" }],
        }),
      });

      await expect(fetchMessages()).rejects.toThrow("Invalid query parameters");
    });

    it("throws error when API returns 500", async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({
          error: {
            message: "Internal Server Error",
            createdAt: "2024-01-12T10:30:00Z",
          },
        }),
      });

      await expect(fetchMessages()).rejects.toThrow("Internal Server Error");
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

    it("throws error when network fails", async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValue(
        new Error("Network request failed"),
      );

      await expect(sendMessage({ author: "Alice", message: "Hi" })).rejects.toThrow(
        /^Failed to send message: Network request failed$/,
      );
    });

    it("throws error when API returns 400", async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({
          error: "Invalid message format",
          details: [{ msg: "Message cannot exceed 500 characters", param: "message" }],
        }),
      });

      await expect(sendMessage({ author: "Alice", message: "Hi" })).rejects.toThrow(
        "Invalid message format",
      );
    });

    it("throws error when API returns 500", async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({
          error: {
            message: "Internal Server Error",
            createdAt: "2024-01-12T10:30:00Z",
          },
        }),
      });

      await expect(sendMessage({ author: "Alice", message: "Hi" })).rejects.toThrow(
        "Internal Server Error",
      );
    });
  });
});
