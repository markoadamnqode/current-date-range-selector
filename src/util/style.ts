import dayjs from "dayjs";
import type { Mode, Range } from "../interfaces/general";
import { isCurrent } from "./date";

export const centerLabel = (mode: Mode, r: Range): string => {
  if (mode === "day") {
    if (r.start.isSame(dayjs(), "day")) return "Today";
    if (r.start.isSame(dayjs().subtract(1, "day"), "day")) return "Yesterday";
    return r.start.format("DD MMM YYYY");
  }

  if (mode !== "custom" && isCurrent(mode, r)) {
    return mode === "week"
      ? "This week"
      : mode === "month"
        ? "This month"
        : "This year";
  }

  switch (mode) {
    case "week": {
      const wk = r.start.week();
      return `Week ${wk} ${r.start.format("YYYY")}`;
    }
    case "month":
      return r.start.format("MMMM YYYY");
    case "year":
      return r.start.format("YYYY");
    case "custom":
      return `${r.start.format("DD-MM-YYYY")} | ${r.end.format("DD-MM-YYYY")}`;

    default:
      return "";
  }
};

export const noChromeButtonStyles = {
  root: {
    background: "transparent",
    border: 0,
    boxShadow: "none",
  },
} as const;
