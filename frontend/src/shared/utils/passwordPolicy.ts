export const passwordRequirements = [
  { key: "minLength", label: "At least 8 characters" },
  { key: "uppercase", label: "One uppercase letter (A-Z)" },
  { key: "lowercase", label: "One lowercase letter (a-z)" },
  { key: "number", label: "One number (0-9)" },
  { key: "special", label: "One special character" },
  { key: "noWhitespace", label: "No spaces or whitespace" },
] as const;

export type PasswordRequirementKey = (typeof passwordRequirements)[number]["key"];

export function evaluatePassword(password: string): Record<PasswordRequirementKey, boolean> {
  return {
    minLength: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9\s]/.test(password),
    noWhitespace: !/\s/.test(password),
  };
}

export function isStrongPassword(password: string) {
  return Object.values(evaluatePassword(password)).every(Boolean);
}

export function passwordCreationReady(password: string, confirmation: string) {
  return isStrongPassword(password) && password === confirmation;
}
