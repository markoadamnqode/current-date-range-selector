import {
  faCalendar,
  faCalendarCheck,
  faCalendarDay,
  faCalendarDays,
  faCalendarWeek,
} from "@fortawesome/free-solid-svg-icons";
import { Mode, type DateRangeOption } from "../interfaces/general";

export const DATE_RANGE_OPTIONS: DateRangeOption[] = [
  { key: Mode.DAY, icon: faCalendarDay, label: "Day", isLast: false },
  { key: Mode.WEEK, icon: faCalendarWeek, label: "Week", isLast: false },
  { key: Mode.MONTH, icon: faCalendarDays, label: "Month", isLast: false },
  { key: Mode.YEAR, icon: faCalendar, label: "Year", isLast: false },
  {
    key: Mode.CUSTOM,
    icon: faCalendarCheck,
    label: "Custom date range",
    isLast: true,
  },
];
