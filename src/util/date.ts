import dayjs, { Dayjs } from "dayjs";
import { Mode, type Range } from "../interfaces/general";

export const isCurrent = (mode: Mode, r: Range): boolean => {
  const now = dayjs();

  switch (mode) {
    case Mode.DAY:
      return r.start.isSame(now, "day");
    case Mode.WEEK:
      return r.start.isSame(now, "week");
    case Mode.MONTH:
      return r.start.isSame(now, "month");
    case Mode.YEAR:
      return r.start.isSame(now, "year");
    case Mode.CUSTOM:
    default:
      return false;
  }
};

const startEnd = (
  day: Dayjs,
  unit: "day" | "week" | "month" | "year"
): Range => ({
  start: day.startOf(unit),
  end: day.endOf(unit),
});

export const rangeForModeFromAnchor = (mode: Mode, anchor: Dayjs): Range => {
  switch (mode) {
    case Mode.DAY:
      return startEnd(anchor, "day");
    case Mode.WEEK:
      return {
        start: anchor.startOf("isoWeek"),
        end: anchor.endOf("isoWeek"),
      };
    case Mode.MONTH:
      return startEnd(anchor, "month");
    case Mode.YEAR:
      return startEnd(anchor, "year");
    case Mode.CUSTOM:
    default:
      return {
        start: anchor.startOf("day"),
        end: anchor.endOf("day"),
      };
  }
};
