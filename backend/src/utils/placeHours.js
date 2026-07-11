import AppError from "./AppError.js";

const TIME_24H = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
const TIME_12H = /^(0?[1-9]|1[0-2]):([0-5]\d)\s*(AM|PM)$/i;

export function normalizeTime(value) {
  const input = String(value ?? "").trim();
  if (TIME_24H.test(input)) return input;

  const match = input.match(TIME_12H);
  if (!match) throw new AppError(`Invalid operating time "${input}"`, 400);

  let hour = Number(match[1]) % 12;
  if (match[3].toUpperCase() === "PM") hour += 12;
  return `${String(hour).padStart(2, "0")}:${match[2]}`;
}

export function normalizeOperatingSchedule(payload) {
  const schedule = payload?.operatingHours ?? payload?.operating_hours;
  if (!schedule) return null;

  if (Array.isArray(schedule)) {
    if (schedule.length !== 7) throw new AppError("Operating hours must define all seven days", 400);
    return schedule.map((entry) => ({
      dayOfWeek: Number(entry.dayOfWeek ?? entry.day_of_week),
      opensAt: normalizeTime(entry.opensAt ?? entry.opens_at),
      closesAt: normalizeTime(entry.closesAt ?? entry.closes_at),
      isClosed: Boolean(entry.isClosed ?? entry.is_closed),
    }));
  }

  const weekdays = schedule.weekdays;
  const weekends = schedule.weekends;
  if (!weekdays?.open || !weekdays?.close || !weekends?.open || !weekends?.close) {
    throw new AppError("Operating hours must include weekday and weekend open/close times", 400);
  }

  return [0, 1, 2, 3, 4, 5, 6].map((dayOfWeek) => {
    const period = dayOfWeek === 0 || dayOfWeek === 6 ? weekends : weekdays;
    return {
      dayOfWeek,
      opensAt: normalizeTime(period.open),
      closesAt: normalizeTime(period.close),
      isClosed: Boolean(period.isClosed),
    };
  });
}

export async function replacePlaceHours(client, placeId, schedule) {
  if (!schedule) return;
  await client.query("DELETE FROM place_hours WHERE place_id = $1", [placeId]);
  for (const day of schedule) {
    if (!Number.isInteger(day.dayOfWeek) || day.dayOfWeek < 0 || day.dayOfWeek > 6) {
      throw new AppError("Operating day must be between 0 and 6", 400);
    }
    await client.query(
      `INSERT INTO place_hours (place_id, day_of_week, opens_at, closes_at, is_closed)
       VALUES ($1, $2, $3, $4, $5)`,
      [placeId, day.dayOfWeek, day.opensAt, day.closesAt, day.isClosed]
    );
  }
}

function to12Hour(value, fallback) {
  if (!value) return fallback;
  const [hourText, minute = "00"] = String(value).slice(0, 5).split(":");
  const hour24 = Number(hourText);
  const suffix = hour24 >= 12 ? "PM" : "AM";
  const hour12 = hour24 % 12 || 12;
  return `${String(hour12).padStart(2, "0")}:${minute} ${suffix}`;
}

export function scheduleToResponse(rows) {
  const entries = Array.isArray(rows) ? rows : [];
  const byDay = new Map(entries.map((row) => [Number(row.dayOfWeek ?? row.day_of_week), row]));
  const period = (days, defaults) => {
    const available = days.map((day) => byDay.get(day)).filter(Boolean);
    const firstOpen = available.find((entry) => !(entry.isClosed ?? entry.is_closed));
    return {
      open: to12Hour(firstOpen?.opensAt ?? firstOpen?.opens_at, defaults.open),
      close: to12Hour(firstOpen?.closesAt ?? firstOpen?.closes_at, defaults.close),
    };
  };

  return {
    weekdays: period([1, 2, 3, 4, 5], { open: "07:00 AM", close: "09:00 PM" }),
    weekends: period([0, 6], { open: "08:00 AM", close: "08:00 PM" }),
  };
}

export const PLACE_HOURS_JSON_SELECT = `COALESCE((
  SELECT jsonb_agg(jsonb_build_object(
    'dayOfWeek', ph.day_of_week,
    'opensAt', ph.opens_at,
    'closesAt', ph.closes_at,
    'isClosed', ph.is_closed
  ) ORDER BY ph.day_of_week)
  FROM place_hours ph
  WHERE ph.place_id = p.id
), '[]'::jsonb) AS operating_hours`;

export const OPEN_NOW_SQL = `(p.status = 'active' AND p.is_open = TRUE AND (
  NOT EXISTS (SELECT 1 FROM place_hours ph_any WHERE ph_any.place_id = p.id)
  OR EXISTS (
    SELECT 1
    FROM place_hours ph
    WHERE ph.place_id = p.id
      AND ph.day_of_week = EXTRACT(DOW FROM NOW() AT TIME ZONE 'Asia/Phnom_Penh')::int
      AND ph.is_closed = FALSE
      AND (
        (ph.opens_at <= ph.closes_at AND (NOW() AT TIME ZONE 'Asia/Phnom_Penh')::time >= ph.opens_at AND (NOW() AT TIME ZONE 'Asia/Phnom_Penh')::time < ph.closes_at)
        OR
        (ph.opens_at > ph.closes_at AND ((NOW() AT TIME ZONE 'Asia/Phnom_Penh')::time >= ph.opens_at OR (NOW() AT TIME ZONE 'Asia/Phnom_Penh')::time < ph.closes_at))
      )
  )
))`;
