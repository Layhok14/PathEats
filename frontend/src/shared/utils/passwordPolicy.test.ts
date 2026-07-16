import { describe, expect, it } from "vitest";
import { evaluatePassword, isStrongPassword, passwordCreationReady } from "./passwordPolicy";

describe("frontend password policy", () => {
  it("mirrors all backend requirements", () => {
    expect(evaluatePassword("weak password")).toMatchObject({
      uppercase: false,
      number: false,
      special: false,
      noWhitespace: false,
    });
    expect(isStrongPassword("StrongPass1!")).toBe(true);
  });

  it("only enables creation when confirmation matches", () => {
    expect(passwordCreationReady("StrongPass1!", "Different1!")).toBe(false);
    expect(passwordCreationReady("StrongPass1!", "StrongPass1!")).toBe(true);
  });
});
