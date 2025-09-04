import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Menu, Text } from "@mantine/core";
import { ICON_STYLE_BY_MODE } from "../util/componentStyles";
import type { DateRangeOption, Mode } from "../interfaces/general";

type Props = {
  option: DateRangeOption;
  setModeAndReset: (mode: Mode) => void;
};

export const DateRangeSelectorOption = ({ option, setModeAndReset }: Props) => {
  const handleOnClick = () => {
    setModeAndReset(option.key);
  };

  return (
    <>
      {option.isLast && <Menu.Divider h={1} m={8} w={244} />}
      <Menu.Item
        leftSection={
          <FontAwesomeIcon
            icon={option.icon}
            style={ICON_STYLE_BY_MODE[option.key]}
          />
        }
        onClick={handleOnClick}
        display="flex"
        w={244}
        h={40}
        px={8}
      >
        <Text fw={600} fz={16} ml={8}>
          {option.label}
        </Text>
      </Menu.Item>
    </>
  );
};
