import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faCalendarCheck, faCalendarDays } from "@fortawesome/free-regular-svg-icons";
import { faAngleLeft, faAngleRight, faCalendarDay, faCalendarWeek } from "@fortawesome/free-solid-svg-icons";
import {
    ActionIcon,
    Button,
    Group,
    Menu,
    Text,
    Tooltip
} from "@mantine/core";
import { useState } from "react";

type Mode = "day" | "week" | "month" | "year" | "custom";

export const DateRangeSelector = () => {
    const [mode, setMode] = useState<Mode>("day");

    // menu handlers
    const setModeAndReset = (m: Mode) => {
        setMode(m);
        if (m !== "custom") {
        } else {

        }
    };

    return (
        <>
            <Group gap="xs" wrap="nowrap">
                {/* Period menu (Day / Week / Month / Year / Custom) */}
                <Menu shadow="md" width={220}>
                    <Menu.Target>
                        <Button
                            variant="default"
                            h={54}
                            px="sm"
                            leftSection={<FontAwesomeIcon icon={faCalendarDays} />}
                            bg="#EFF0F0"
                            styles={{ label: { fontWeight: 600 } }}
                        >
                            DAY
                        </Button>
                    </Menu.Target>
                    <Menu.Dropdown>
                        <Menu.Item
                            leftSection={<FontAwesomeIcon icon={faCalendarDay} />}
                            onClick={() => setModeAndReset("day")}
                        >
                            Day
                        </Menu.Item>
                        <Menu.Item
                            leftSection={<FontAwesomeIcon icon={faCalendarWeek} />}
                            onClick={() => setModeAndReset("week")}
                        >
                            Week
                        </Menu.Item>
                        <Menu.Item
                            leftSection={<FontAwesomeIcon icon={faCalendarDays} />}
                            onClick={() => setModeAndReset("month")}
                        >
                            Month
                        </Menu.Item>
                        <Menu.Item
                            leftSection={<FontAwesomeIcon icon={faCalendar} />}
                            onClick={() => setModeAndReset("year")}
                        >
                            Year
                        </Menu.Item>
                        <Menu.Divider />
                        <Menu.Item
                            leftSection={<FontAwesomeIcon icon={faCalendarCheck} />}
                            onClick={() => setModeAndReset("custom")}
                        >
                            Custom date range
                        </Menu.Item>
                    </Menu.Dropdown>

                    {/* Prev */}
                    <Tooltip label="Previous">
                        <ActionIcon
                            variant="default"
                            size="lg"
                            h={54}
                            onClick={() => null}
                            disabled={false}
                        >
                            <FontAwesomeIcon icon={faAngleLeft} />
                        </ActionIcon>
                    </Tooltip>

                    {/* Center label with quick “Today/This…” menu */}
                    <Menu shadow="md" width={220}>
                        <Menu.Target>
                            <Button variant="default" h={54} px="md" bg="#EFF0F0">
                                <Text fw={600}>LABEL DODATI</Text>
                            </Button>
                        </Menu.Target>
                        <Menu.Dropdown>
                            <Menu.Label>Jump to current</Menu.Label>
                            <Menu.Item onClick={() => null}>Today</Menu.Item>
                            <Menu.Item onClick={() => null}>This week</Menu.Item>
                            <Menu.Item onClick={() => null}>This month</Menu.Item>
                            <Menu.Item onClick={() => null}>This year</Menu.Item>
                        </Menu.Dropdown>
                    </Menu>

                    {/* Next */}
                    <Tooltip label={false ? "Already at latest period" : "Next"}>
                        <ActionIcon
                            variant="default"
                            size="lg"
                            h={54}
                            onClick={() => null}
                            disabled={false}
                        >
                            <FontAwesomeIcon icon={faAngleRight} />
                        </ActionIcon>
                    </Tooltip>
                </Menu>

            </Group>
        </>
    );
};