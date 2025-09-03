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

import {
  COLORS,
  MODE_ICON,
  LEFT_BUTTON_SIZE_BY_MODE,
  CENTAR_BUTTON_SIZE_BY_MODE,
} from "../util/theme";
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
  onChange: (start: Date, end: Date) => void;
  defaultMode?: Mode;
};

const startEnd = (
  d: Dayjs,
  unit: "day" | "week" | "month" | "year"
): Range => ({
  start: d.startOf(unit),
  end: d.endOf(unit),
});

export const DateRangeSelector = ({
  onChange,
  defaultMode = Mode.DAY,
}: Props) => {
  const [mode, setMode] = useState<Mode>(defaultMode);
  const [opened, setOpened] = useState(false);
  const [anchor, setAnchor] = useState<Dayjs>(dayjs());

  const [customRange, setCustomRange] = useState<Range>({
    start: dayjs().startOf("day"),
    end: dayjs().endOf("day"),
  });

  const [rangeDraft, setRangeDraft] = useState<RangeTuple>([
    customRange.start.toDate(),
    customRange.end.toDate(),
  ]);

  const size = CENTAR_BUTTON_SIZE_BY_MODE[mode];
  const leftButtonSize = LEFT_BUTTON_SIZE_BY_MODE[mode];

  const openPicker = () => {
    setRangeDraft([customRange.start.toDate(), customRange.end.toDate()]);
    setOpened(true);
  };

  const rangeForModeFromAnchor = (mode: Mode, anchor: Dayjs): Range => {
    switch (mode) {
      case Mode.DAY:
        return startEnd(anchor, "day");
      case Mode.WEEK:
        return {
          start: anchor.startOf("isoWeek"),
          end: anchor.endOf("isoWeek"),
        };
      case Mode.MONTH:
        return startEnd(anchor, "month");
      case Mode.YEAR:
        return startEnd(anchor, "year");
      case Mode.CUSTOM:
      default:
        return {
          start: anchor.startOf("day"),
          end: anchor.endOf("day"),
        };
    }
  };

  const shift = (range: Range, mode: Mode, direction: -1 | 1): Range => {
    switch (mode) {
      case Mode.DAY:
        return {
          start: range.start.add(direction, "day").startOf("day"),
          end: range.end.add(direction, "day").endOf("day"),
        };
      case Mode.WEEK:
        return {
          start: range.start.add(direction, "week").startOf("isoWeek"),
          end: range.end.add(direction, "week").endOf("isoWeek"),
        };
      case Mode.MONTH:
        return {
          start: range.start.add(direction, "month").startOf("month"),
          end: range.end.add(direction, "month").endOf("month"),
        };
      case Mode.YEAR:
        return {
          start: range.start.add(direction, "year").startOf("year"),
          end: range.end.add(direction, "year").endOf("year"),
        };
      case Mode.CUSTOM:
      default:
        return range;
    }
  };

  const currentRange: Range = useMemo(() => {
    if (mode === Mode.CUSTOM) return customRange;
    return rangeForModeFromAnchor(mode, anchor);
  }, [mode, anchor, customRange]);

  const setModeAndReset = (mode: Mode) => {
    setMode(mode);
    if (mode === Mode.CUSTOM) {
      setOpened(true);
    } else {
      setAnchor(dayjs());
    }
  };

  const canGoNext = mode !== Mode.CUSTOM && !isCurrent(mode, currentRange);
  const canGoPrev = mode !== Mode.CUSTOM;

  const renderPicker = () => {
    switch (mode) {
      case Mode.DAY:
        return (
          <DatePicker
            value={currentRange.start.toDate()}
            onChange={(date) => {
              if (!date) return;
              const formatedDate = dayjs(date);
              setAnchor(formatedDate);
              setOpened(false);

              onChange(currentRange.start.toDate(), currentRange.end.toDate());
            }}
          />
        );
      case Mode.WEEK:
        return (
          <Calendar
            withCellSpacing={false}
            getDayProps={(date) => {
              const day = dayjs(date);
              const selStart = currentRange.start.startOf("day");
              const selEnd = currentRange.end.endOf("day");

              const inRange =
                day.isSame(selStart, "day") ||
                day.isSame(selEnd, "day") ||
                (day.isAfter(selStart, "day") && day.isBefore(selEnd, "day"));

              return {
                inRange,
                firstInRange: day.isSame(selStart, "day"),
                lastInRange: day.isSame(selEnd, "day"),
                selected: inRange,
                onClick: () => {
                  setAnchor(day);
                  setOpened(false);
                },
              };
            }}
          />
        );
      case Mode.MONTH:
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
      case Mode.YEAR:
        const currentYear = dayjs().endOf("year").toDate();
        return (
          <YearPicker
            value={currentYear}
            onChange={(date) => {
              if (!date) return;
              setAnchor(dayjs(date));
              setOpened(false);
            }}
            maxDate={currentYear}
          />
        );
      case Mode.CUSTOM:
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

              onChange(currentRange.start.toDate(), currentRange.end.toDate());
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
              {...leftButtonSize}
              c={COLORS.black}
              variant="transparent"
              h={54}
              px="sm"
              leftSection={<FontAwesomeIcon icon={MODE_ICON[mode]} size="xl" />}
              bg={COLORS.lightGrey}
              rightSection={<FontAwesomeIcon icon={faAngleDown} />}
              styles={{
                ...noChromeButtonStyles,
                section: { marginRight: 4 },
                label: { fontWeight: 600, fontSize: 18 },
              }}
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
