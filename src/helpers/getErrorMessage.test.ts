import { describe, expect, it } from "vitest";
import { getErrorMessage } from "./getErrorMessage";

describe("getErrorMessage", () => {
  it("returns error message when error is an Error instance", () => {
    const error = new Error("Something went wrong");
    const result = getErrorMessage(error);
    expect(result).toBe("Something went wrong");
  });

  it("converts error to string when error is not an Error instance", () => {
    const error = "String error";
    const result = getErrorMessage(error);
    expect(result).toBe("String error");
  });

  it("converts number to string when error is a number", () => {
    const error = 404;
    const result = getErrorMessage(error);
    expect(result).toBe("404");
  });

  it("converts null to 'Unknown Error' string", () => {
    const error = null;
    const result = getErrorMessage(error);
    expect(result).toBe("Unknown Error");
  });

  it("converts undefined to 'Unknown Error' string", () => {
    const error = undefined;
    const result = getErrorMessage(error);
    expect(result).toBe("Unknown Error");
  });
});
