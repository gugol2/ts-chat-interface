import { describe, expect, it } from "vitest";
import { formatMessageDate } from "./formatMessageDate";

describe("formatMessageDate", () => {
  it("formats date in 'D MMM YYYY HH:mm' format", () => {
    const result = formatMessageDate("2024-01-01T10:30:00.000Z");
    expect(result).toBe("1 Jan 2024 10:30");
  });

  it("formats date with double-digit day", () => {
    const result = formatMessageDate("2018-03-10T10:22:00.000Z");
    expect(result).toBe("10 Mar 2018 10:22");
  });

  it("pads hours with leading zero", () => {
    const result = formatMessageDate("2024-05-15T05:30:00.000Z");
    expect(result).toBe("15 May 2024 05:30");
  });

  it("pads minutes with leading zero", () => {
    const result = formatMessageDate("2024-12-25T14:05:00.000Z");
    expect(result).toBe("25 Dec 2024 14:05");
  });

  it("formats midnight correctly", () => {
    const result = formatMessageDate("2024-06-15T00:00:00.000Z");
    expect(result).toBe("15 Jun 2024 00:00");
  });

  it("formats end of day correctly", () => {
    const result = formatMessageDate("2024-08-20T23:59:00.000Z");
    expect(result).toBe("20 Aug 2024 23:59");
  });
});
