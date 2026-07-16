import { describe, expect, it } from "vitest";
import { assertStrongPassword, evaluatePassword, isStrongPassword } from "./passwordPolicy.js";

describe("password policy", () => {
  it.each([
    ["Short1!", "minLength"],
    ["lowercase1!", "uppercase"],
    ["UPPERCASE1!", "lowercase"],
    ["NoNumber!", "number"],
    ["NoSpecial1", "special"],
    ["Has Space1!", "noWhitespace"],
  ])("rejects %s when %s is missing", (password, failedRule) => {
    expect(evaluatePassword(password)[failedRule]).toBe(false);
    expect(isStrongPassword(password)).toBe(false);
  });

  it("reports multiple failures and accepts non-ASCII special characters", () => {
    const result = evaluatePassword("abc");
    expect(result).toMatchObject({ minLength: false, uppercase: false, number: false, special: false });
    expect(isStrongPassword("ValidPass1€")).toBe(true);
  });

  it("throws the global weak-password error contract", () => {
    expect(() => assertStrongPassword("password")).toThrowError(expect.objectContaining({
      statusCode: 400,
      code: "WEAK_PASSWORD",
      fieldErrors: { password: expect.any(String) },
    }));
  });
});
