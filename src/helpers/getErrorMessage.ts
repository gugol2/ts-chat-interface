export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (error === null || error === undefined) {
    return "Unknown Error";
  }
  return String(error);
}
