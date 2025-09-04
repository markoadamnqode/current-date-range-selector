import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import { faCalendar } from "@fortawesome/free-solid-svg-icons/faCalendar";
import { faCalendarCheck } from "@fortawesome/free-solid-svg-icons/faCalendarCheck";
import { faCalendarDay } from "@fortawesome/free-solid-svg-icons/faCalendarDay";
import { faCalendarWeek } from "@fortawesome/free-solid-svg-icons/faCalendarWeek";

export const COLORS = {
  black: "#003243",
  lightGrey: "#EFF0F0",
  yellow: "#FEFE2D",
};

export const CENTRAL_BUTTON_SIZE_BY_MODE = {
  day: { w: 170, h: 48, radius: 6 },
  week: { w: 174, h: 48, radius: 6 },
  month: { w: 200, h: 48, radius: 6 },
  year: { w: 140, h: 48, radius: 6 },
  custom: { w: 283, h: 48, radius: 6 },
};

export const LEFT_BUTTON_SIZE_BY_MODE = {
  day: { w: 121, h: 48, radius: 6 },
  week: { w: 135, h: 48, radius: 6 },
  month: { w: 144, h: 48, radius: 6 },
  year: { w: 125, h: 48, radius: 6 },
  custom: { w: 155, h: 48, radius: 6 },
};

export const MODE_ICON = {
  day: faCalendarDay,
  week: faCalendarWeek,
  month: faCalendarDays,
  year: faCalendar,
  custom: faCalendarCheck,
};
