import dayjs from "dayjs";
import type { Mode, Range } from "../interfaces/general";

export const isCurrent = (mode: Mode, r: Range): boolean => {
  const now = dayjs();

  switch (mode) {
    case "day":
      return r.start.isSame(now, "day");
    case "week":
      return r.start.isSame(now, "week");
    case "month":
      return r.start.isSame(now, "month");
    case "year":
      return r.start.isSame(now, "year");
    case "custom":
    default:
      return false;
  }
};
