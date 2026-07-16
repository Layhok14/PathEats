import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { PasswordRequirementChecklist } from "./PasswordRequirementChecklist";

afterEach(cleanup);

describe("PasswordRequirementChecklist", () => {
  it("changes from weak to strong as every rule becomes valid", () => {
    const { rerender, container } = render(<PasswordRequirementChecklist password="weak" />);
    expect(screen.getByTestId("password-strength").textContent).toBe("Weak");
    expect(container.querySelector('[data-requirement="uppercase"]')?.getAttribute("data-met")).toBe("false");

    rerender(<PasswordRequirementChecklist password="StrongPass1!" />);
    expect(screen.getByTestId("password-strength").textContent).toBe("Strong");
    expect(container.querySelectorAll('[data-met="true"]')).toHaveLength(6);
  });
});
