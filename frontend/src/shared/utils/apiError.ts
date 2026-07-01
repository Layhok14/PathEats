export function getApiErrorMessage(error: unknown, fallback = "Something went wrong. Please try again.") {
  if (error && typeof error === "object") {
    const response = (error as { response?: { data?: { message?: string; safeMessage?: string } } }).response;
    const serverMessage = response?.data?.message || response?.data?.safeMessage;
    if (serverMessage) return serverMessage;

    const message = (error as { message?: string }).message;
    if (message) return message;
  }

  return fallback;
}
