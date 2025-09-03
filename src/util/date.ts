import dayjs from "dayjs";
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
