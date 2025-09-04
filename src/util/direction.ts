import { Mode, type Range } from "../interfaces/general";

export const shift = (range: Range, mode: Mode, direction: -1 | 1): Range => {
  switch (mode) {
    case Mode.DAY:
      return {
        start: range.start.add(direction, "day").startOf("day"),
        end: range.end.add(direction, "day").endOf("day"),
      };
    case Mode.WEEK:
      return {
        start: range.start.add(direction, "week").startOf("isoWeek"),
        end: range.end.add(direction, "week").endOf("isoWeek"),
      };
    case Mode.MONTH:
      return {
        start: range.start.add(direction, "month").startOf("month"),
        end: range.end.add(direction, "month").endOf("month"),
      };
    case Mode.YEAR:
      return {
        start: range.start.add(direction, "year").startOf("year"),
        end: range.end.add(direction, "year").endOf("year"),
      };
    case Mode.CUSTOM:
    default:
      return range;
  }
};
