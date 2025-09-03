import dayjs from "dayjs";
import { Mode, type Range } from "../interfaces/general";
import { isCurrent } from "./date";

export const centerLabel = (mode: Mode, range: Range): string => {
  if (mode === "day") {
    if (range.start.isSame(dayjs(), "day")) return "Today";
    if (range.start.isSame(dayjs().subtract(1, "day"), "day"))
      return "Yesterday";
    return range.start.format("DD MMM YYYY");
  }

  if (mode !== "custom" && isCurrent(mode, range)) {
    return mode === "week"
      ? "This week"
      : mode === "month"
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
    case "custom":
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
