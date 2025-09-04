import type { CSSProperties } from "react";
import type { Mode } from "../interfaces/general";
import type { FontAwesomeIconProps } from "@fortawesome/react-fontawesome";

type IconStyle = NonNullable<FontAwesomeIconProps["style"]>;

export const DATE_RANGE_PAPER_STYLES: CSSProperties = {
  border: "1px solid #E3E3E3",
  display: "flex",
  alignItems: "center",
  padding: 3,
  gap: 2,
  background: "#FFFFFF",
};

export const ICON_STYLE_BY_MODE: Record<Mode, IconStyle> = {
  day: {
    width: 16,
    height: 18,
  },
  week: {
    width: 16,
    height: 18,
  },
  month: {
    width: 16,
    height: 18,
  },
  year: {
    width: 16,
    height: 18,
  },
  custom: {
    width: 18,
    height: 19,
  },
};
