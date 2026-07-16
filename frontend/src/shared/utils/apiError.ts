export function getApiErrorMessage(error: unknown, fallback = "Something went wrong. Please try again.") {
  if (error && typeof error === "object") {
    const response = (error as { response?: { data?: { message?: string; safeMessage?: string } } }).response;
    const serverMessage = response?.data?.safeMessage || response?.data?.message;
    if (serverMessage) return serverMessage;

    const message = (error as { message?: string }).message;
    if (message) return message;
  }

  return fallback;
}

export function getApiFieldErrors(error: unknown): Record<string, string> {
  if (!error || typeof error !== "object") return {};
  const response = (error as { response?: { data?: { fieldErrors?: Record<string, string> } } }).response;
  return response?.data?.fieldErrors ?? {};
}
