import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import type { Dayjs } from "dayjs";

export enum Mode {
  DAY = "day",
  WEEK = "week",
  MONTH = "month",
  YEAR = "year",
  CUSTOM = "custom",
}

export type RangeTuple = [Date | null, Date | null];

export type Range = { start: Dayjs; end: Dayjs };

export interface DateRangeOption {
  key: Mode;
  label: string;
  icon: IconDefinition;
  isLast: boolean;
}
