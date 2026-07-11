import { describe, expect, it } from "vitest";
import {
  normalizeOperatingSchedule,
  normalizeTime,
  scheduleToResponse,
} from "./placeHours.js";

describe("place hours", () => {
  it("normalizes 12-hour times and expands weekday/weekend schedules", () => {
    const rows = normalizeOperatingSchedule({
      operatingHours: {
        weekdays: { open: "09:15 AM", close: "09:30 PM" },
        weekends: { open: "10:00 AM", close: "08:00 PM" },
      },
    });

    expect(rows).toHaveLength(7);
    expect(rows[1]).toMatchObject({ dayOfWeek: 1, opensAt: "09:15", closesAt: "21:30" });
    expect(rows[0]).toMatchObject({ dayOfWeek: 0, opensAt: "10:00", closesAt: "20:00" });
  });

  it("round-trips persisted rows into the vendor response shape", () => {
    expect(scheduleToResponse([
      { dayOfWeek: 1, opensAt: "07:00:00", closesAt: "21:00:00", isClosed: false },
      { dayOfWeek: 6, opensAt: "08:30:00", closesAt: "20:15:00", isClosed: false },
    ])).toEqual({
      weekdays: { open: "07:00 AM", close: "09:00 PM" },
      weekends: { open: "08:30 AM", close: "08:15 PM" },
    });
  });

  it("rejects malformed times", () => {
    expect(() => normalizeTime("25:00")).toThrow("Invalid operating time");
  });
});
