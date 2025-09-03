import { Fragment, useEffect, useMemo, useState } from "react";
import {
  ActionIcon,
  Button,
  Group,
  Menu,
  Paper,
  Popover,
  Text,
} from "@mantine/core";
import { DatePicker, MonthPicker, YearPicker, Calendar } from "@mantine/dates";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faAngleDown,
  faAngleLeft,
  faAngleRight,
} from "@fortawesome/free-solid-svg-icons";
import dayjs, { Dayjs } from "dayjs";

import isoWeek from "dayjs/plugin/isoWeek";
import weekOfYear from "dayjs/plugin/weekOfYear";
import advancedFormat from "dayjs/plugin/advancedFormat";
import localizedFormat from "dayjs/plugin/localizedFormat";

import { COLORS, MODE_ICON, SIZE_BY_MODE } from "../util/theme";
import { DATE_RANGE_OPTIONS } from "../util/options";
import type { Range, RangeTuple } from "../interfaces/general";
import { Mode } from "../interfaces/general";
import { isCurrent } from "../util/date";
import { centerLabel, noChromeButtonStyles } from "../util/style";
import { modeLabel } from "../util/strings";

dayjs.extend(isoWeek);
dayjs.extend(weekOfYear);
dayjs.extend(advancedFormat);
dayjs.extend(localizedFormat);

type Props = {
  onChange?: (start: Date, end: Date) => void;
  defaultMode?: Mode;
};

const startEnd = (
  d: Dayjs,
  unit: "day" | "week" | "month" | "year"
): Range => ({
  start: d.startOf(unit),
  end: d.endOf(unit),
});

const rangeForModeFromAnchor = (mode: Mode, anchor: Dayjs): Range => {
  switch (mode) {
    case "day":
      return startEnd(anchor, "day");
    case "week":
      return { start: anchor.startOf("week"), end: anchor.endOf("week") };
    case "month":
      return startEnd(anchor, "month");
    case "year":
      return startEnd(anchor, "year");
    case "custom":
    default:
      return {
        start: anchor.startOf("day"),
        end: anchor.endOf("day"),
      };
  }
};

const shift = (r: Range, mode: Mode, dir: -1 | 1): Range => {
  switch (mode) {
    case "day":
      return {
        start: r.start.add(dir, "day").startOf("day"),
        end: r.end.add(dir, "day").endOf("day"),
      };
    case "week":
      return {
        start: r.start.add(dir, "week").startOf("week"),
        end: r.end.add(dir, "week").endOf("week"),
      };
    case "month":
      return {
        start: r.start.add(dir, "month").startOf("month"),
        end: r.end.add(dir, "month").endOf("month"),
      };
    case "year":
      return {
        start: r.start.add(dir, "year").startOf("year"),
        end: r.end.add(dir, "year").endOf("year"),
      };
    case "custom":
    default:
      return r;
  }
};

export const DateRangeSelector = ({
  onChange,
  defaultMode = Mode.DAY,
}: Props) => {
  const [mode, setMode] = useState<Mode>(defaultMode);

  const size = SIZE_BY_MODE[mode];

  const [anchor, setAnchor] = useState<Dayjs>(dayjs());

  const [customRange, setCustomRange] = useState<Range>({
    start: dayjs().startOf("day"),
    end: dayjs().endOf("day"),
  });

  const [rangeDraft, setRangeDraft] = useState<RangeTuple>([
    customRange.start.toDate(),
    customRange.end.toDate(),
  ]);

  const openPicker = () => {
    setRangeDraft([customRange.start.toDate(), customRange.end.toDate()]);
    setOpened(true);
  };

  const [opened, setOpened] = useState(false);

  const currentRange: Range = useMemo(() => {
    if (mode === Mode.CUSTOM) return customRange;
    return rangeForModeFromAnchor(mode, anchor);
  }, [mode, anchor, customRange]);

  useEffect(() => {
    if (!onChange) return;
    onChange(currentRange.start.toDate(), currentRange.end.toDate());
  }, [currentRange.start, currentRange.end, onChange]);

  const setModeAndReset = (m: Mode) => {
    setMode(m);
    if (m === Mode.CUSTOM) {
      setOpened(true);
    } else {
      setAnchor(dayjs());
    }
  };

  const canGoNext = mode !== Mode.CUSTOM && !isCurrent(mode, currentRange);
  const canGoPrev = mode !== Mode.CUSTOM;

  const renderPicker = () => {
    switch (mode) {
      case "day":
        return (
          <DatePicker
            value={currentRange.start.toDate()}
            onChange={(d) => {
              if (!d) return;
              const dd = dayjs(d);
              setAnchor(dd);
              setOpened(false);
            }}
          />
        );
      case "week":
        return (
          <Calendar
            getDayProps={(date) => {
              const d = dayjs(date);
              return {
                selected: d.isSame(currentRange.start, "week"),
                onClick: () => {
                  setAnchor(d);
                  setOpened(false);
                },
              };
            }}
          />
        );
      case "month":
        return (
          <MonthPicker
            value={currentRange.start.toDate()}
            onChange={(date) => {
              if (!date) return;
              setAnchor(dayjs(date));
              setOpened(false);
            }}
          />
        );
      case "year":
        const currentYear = dayjs().endOf("year").toDate();
        return (
          <YearPicker
            value={currentYear}
            onChange={(d) => {
              if (!d) return;
              setAnchor(dayjs(d));
              setOpened(false);
            }}
            maxDate={currentYear}
          />
        );
      case "custom":
        return (
          <DatePicker
            type="range"
            value={rangeDraft}
            onChange={(val) => {
              const next = (val ?? [null, null]) as RangeTuple;
              setRangeDraft(next);
              const [startDate, endDate] = next;

              if (startDate && endDate) {
                const start = dayjs(startDate).startOf("day");
                const end = dayjs(endDate).endOf("day");
                setCustomRange({ start, end });
                setOpened(false);
              }
            }}
            allowSingleDateInRange
          />
        );
    }
  };

  return (
    <Paper withBorder p="3px" radius="8px">
      <Group gap={0} wrap="nowrap">
        {/* Period menu (Day / Week / Month / Year / Custom) */}
        <Menu shadow="md" width={220}>
          <Menu.Target>
            <Button
              c={COLORS.black}
              variant="transparent"
              h={54}
              px="sm"
              leftSection={<FontAwesomeIcon icon={MODE_ICON[mode]} />}
              bg={COLORS.lightGrey}
              rightSection={<FontAwesomeIcon icon={faAngleDown} />}
              styles={noChromeButtonStyles}
            >
              <Text fw={600} fz={18}>
                {modeLabel(mode)}
              </Text>
            </Button>
          </Menu.Target>
          <Menu.Dropdown>
            {DATE_RANGE_OPTIONS.map((opt) => (
              <Fragment key={opt.key}>
                {opt.isLast && <Menu.Divider />}
                <Menu.Item
                  leftSection={<FontAwesomeIcon icon={opt.icon} />}
                  onClick={() => setModeAndReset(opt.key)}
                >
                  {opt.label}
                </Menu.Item>
              </Fragment>
            ))}
          </Menu.Dropdown>
        </Menu>

        {/* Prev */}
        <ActionIcon
          c={COLORS.black}
          variant="transparent"
          size={56}
          h={48}
          onClick={() => {
            if (canGoPrev) {
              const range = rangeForModeFromAnchor(mode, anchor);
              setAnchor(shift(range, mode, -1).start);
            }
          }}
          disabled={!canGoPrev}
          styles={noChromeButtonStyles}
        >
          <FontAwesomeIcon icon={faAngleLeft} />
        </ActionIcon>

        {/* Center label + calendar */}
        <Popover
          opened={opened}
          onChange={setOpened}
          position="bottom-start"
          shadow="md"
          withinPortal
        >
          <Popover.Target>
            <Button
              {...size}
              styles={{
                ...noChromeButtonStyles,
              }}
              c={COLORS.black}
              variant="transparent"
              px="md"
              bg="#FFFFFF"
              onClick={openPicker}
              rightSection={<FontAwesomeIcon icon={faAngleDown} />}
            >
              <Text fw={600}>{centerLabel(mode, currentRange)}</Text>
            </Button>
          </Popover.Target>
          <Popover.Dropdown>{renderPicker()}</Popover.Dropdown>
        </Popover>

        {/* Next */}
        <ActionIcon
          c={COLORS.black}
          variant="transparent"
          size={56}
          h={48}
          onClick={() => {
            if (canGoNext) {
              const range = rangeForModeFromAnchor(mode, anchor);
              setAnchor(shift(range, mode, 1).start);
            }
          }}
          disabled={!canGoNext}
          styles={noChromeButtonStyles}
        >
          <FontAwesomeIcon icon={faAngleRight} />
        </ActionIcon>
      </Group>
    </Paper>
  );
};
