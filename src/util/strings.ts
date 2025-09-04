import dayjs from "dayjs";
import { Mode, type Range } from "../interfaces/general";
import { isCurrent } from "./date";

export const centerLabel = (mode: Mode, range: Range): string => {
  if (mode === Mode.DAY) {
    if (range.start.isSame(dayjs(), "day")) return "Today";
    if (range.start.isSame(dayjs().subtract(1, "day"), "day"))
      return "Yesterday";
    return range.start.format("DD MMM YYYY");
  }

  if (mode !== Mode.CUSTOM && isCurrent(mode, range)) {
    return mode === Mode.WEEK
      ? "This week"
      : mode === Mode.MONTH
        ? "This month"
        : "This year";
  }

  switch (mode) {
    case Mode.WEEK: {
      const week = range.start.week();
      return `Week ${week} ${range.start.format("YYYY")}`;
    }
    case Mode.MONTH:
      return range.start.format("MMMM YYYY");
    case Mode.YEAR:
      return range.start.format("YYYY");
    case Mode.CUSTOM:
      return `${range.start.format("DD-MM-YYYY")} | ${range.end.format("DD-MM-YYYY")}`;

    default:
      return "";
  }
};

export const modeLabel = (mode: Mode) => {
  switch (mode) {
    case Mode.DAY:
      return "Day";
    case Mode.WEEK:
      return "Week";
    case Mode.MONTH:
      return "Month";
    case Mode.YEAR:
      return "Year";
    case Mode.CUSTOM:
      return "Custom";
  }
};
