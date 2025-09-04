import { useMemo, useState } from "react";
import {
  ActionIcon,
  Button,
  Group,
  Menu,
  Paper,
  Popover,
  Text,
} from "@mantine/core";
import {
  DatePicker,
  MonthPicker,
  YearPicker,
  Calendar,
  type DatesRangeValue,
} from "@mantine/dates";
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
import { Mode, type Range, type RangeTuple } from "../interfaces/general";
import { isCurrent, rangeForModeFromAnchor } from "../util/date";
import { centerLabel } from "../util/style";
import { modeLabel } from "../util/strings";
import {
  DATE_RANGE_PAPER_STYLES,
  ICON_STYLE_BY_MODE,
} from "../util/componentStyles";
import { shift } from "../util/direction";
import { DateRangeSelectorOption } from "./DateRangeSelectorOption";

dayjs.extend(isoWeek);
dayjs.extend(weekOfYear);
dayjs.extend(advancedFormat);
dayjs.extend(localizedFormat);

type Props = {
  onChange: (start: Date, end: Date) => void;
};

export const DateRangeSelector = ({ onChange }: Props) => {
  const [mode, setMode] = useState<Mode>(Mode.DAY);
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
  const currentRange: Range = useMemo(() => {
    if (mode === Mode.CUSTOM) return customRange;
    return rangeForModeFromAnchor(mode, anchor);
  }, [mode, anchor, customRange]);
  const canGoNext = mode !== Mode.CUSTOM && !isCurrent(mode, currentRange);
  const canGoPrev = mode !== Mode.CUSTOM;

  const togglePicker = () => {
    if (opened) {
      setOpened(false);
    } else {
      setRangeDraft([customRange.start.toDate(), customRange.end.toDate()]);
      setOpened(true);
    }
  };

  const handleNext = () => {
    if (canGoNext) {
      const range = rangeForModeFromAnchor(mode, anchor);
      setAnchor(shift(range, mode, 1).start);
    }
  };

  const handlePrev = () => {
    if (canGoPrev) {
      const range = rangeForModeFromAnchor(mode, anchor);
      setAnchor(shift(range, mode, -1).start);
    }
  };

  const setModeAndReset = (mode: Mode) => {
    setMode(mode);

    if (mode === Mode.CUSTOM) {
      setOpened(true);
    } else {
      setAnchor(dayjs());
    }
  };

  const handleOnChangeDay = (date: string | null) => {
    if (!date) return;

    const nextAnchor = dayjs(date);
    const nextRange = rangeForModeFromAnchor(Mode.DAY, nextAnchor);
    setAnchor(nextAnchor);
    setOpened(false);

    onChange(nextRange.start.toDate(), nextRange.end.toDate());
  };

  const handleOnSelectWeek = (date: string) => {
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
        const nextRange = rangeForModeFromAnchor(Mode.WEEK, day);

        setAnchor(day);
        setOpened(false);
        onChange(nextRange.start.toDate(), nextRange.end.toDate());
      },
    };
  };

  const handleOnSelectMonth = (date: string | null) => {
    if (!date) return;

    const nextAnchor = dayjs(date);
    const nextRange = rangeForModeFromAnchor(Mode.MONTH, nextAnchor);

    setAnchor(nextAnchor);
    setOpened(false);
    onChange(nextRange.start.toDate(), nextRange.end.toDate());
  };

  const handleOnSelectYear = (date: string | null) => {
    if (!date) return;

    const nextAnchor = dayjs(date);
    const nextRange = rangeForModeFromAnchor(Mode.YEAR, nextAnchor);

    setAnchor(nextAnchor);
    setOpened(false);
    onChange(nextRange.start.toDate(), nextRange.end.toDate());
  };

  const handleOnSelectCustomDate = (val: DatesRangeValue<string>) => {
    const next = (val ?? [null, null]) as RangeTuple;
    setRangeDraft(next);
    const [startDate, endDate] = next;

    if (startDate && endDate) {
      const start = dayjs(startDate).startOf("day");
      const end = dayjs(endDate).endOf("day");
      setCustomRange({ start, end });
      setOpened(false);
      onChange(start.toDate(), end.toDate());
    }
  };

  const renderPicker = () => {
    switch (mode) {
      case Mode.DAY:
        return (
          <DatePicker
            value={currentRange.start.toDate()}
            onChange={handleOnChangeDay}
          />
        );
      case Mode.WEEK:
        return (
          <Calendar withCellSpacing={false} getDayProps={handleOnSelectWeek} />
        );
      case Mode.MONTH:
        return (
          <MonthPicker
            value={currentRange.start.toDate()}
            onChange={handleOnSelectMonth}
          />
        );
      case Mode.YEAR:
        const currentYear = dayjs().endOf("year").toDate();

        return (
          <YearPicker
            value={currentYear}
            onChange={handleOnSelectYear}
            maxDate={currentYear}
          />
        );
      case Mode.CUSTOM:
        return (
          <DatePicker
            type="range"
            value={rangeDraft}
            onChange={handleOnSelectCustomDate}
            allowSingleDateInRange
          />
        );
    }
  };

  return (
    <Paper radius="8px" style={DATE_RANGE_PAPER_STYLES}>
      <Group gap={0} wrap="nowrap">
        <Menu
          position="bottom-start"
          offset={0}
          shadow="md"
          width={260}
          radius={8}
        >
          <Menu.Target>
            <Button
              {...leftButtonSize}
              variant="transparent"
              px="sm"
              c={COLORS.black}
              leftSection={
                <FontAwesomeIcon
                  icon={MODE_ICON[mode]}
                  style={ICON_STYLE_BY_MODE[mode]}
                />
              }
              bg={COLORS.lightGrey}
              rightSection={<FontAwesomeIcon icon={faAngleDown} />}
            >
              <Text fw={600} fz={18}>
                {modeLabel(mode)}
              </Text>
            </Button>
          </Menu.Target>
          <Menu.Dropdown w={260} h={232} bdrs={8} bd={1} p={8} bg="#FFFFFF">
            {DATE_RANGE_OPTIONS.map((opt) => (
              <DateRangeSelectorOption
                key={opt.key}
                opt={opt}
                setModeAndReset={setModeAndReset}
              />
            ))}
          </Menu.Dropdown>
        </Menu>
        {/* Prev */}
        <ActionIcon
          c={COLORS.black}
          bg="transparent"
          h={48}
          w={56}
          px={16}
          py={10}
          opacity={canGoPrev ? 1 : 0.4}
          onClick={handlePrev}
          disabled={!canGoPrev}
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
              c={COLORS.black}
              variant="transparent"
              h={48}
              px={16}
              py={10}
              onClick={togglePicker}
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
          bg="transparent"
          h={48}
          w={56}
          px={16}
          py={10}
          opacity={canGoNext ? 1 : 0.4}
          onClick={handleNext}
          disabled={!canGoNext}
        >
          <FontAwesomeIcon icon={faAngleRight} />
        </ActionIcon>
      </Group>
    </Paper>
  );
};
