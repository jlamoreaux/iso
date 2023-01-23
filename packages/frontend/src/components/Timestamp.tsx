import React from "react";
import * as dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Text, Tooltip } from "@mantine/core";
import theme from "../styles/theme";

type TimestampProps = {
  dateTime: Date;
};

const Timestamp: React.FC<TimestampProps> = ({ dateTime }) => {
  dayjs.extend(relativeTime);

  const label = <Text size="xs">{dayjs(dateTime).format("MMMM D, YYYY h:mm A")}</Text>;
  return (
    <Tooltip label={label} sx={{ borderRadius: 8 }}>
      <Text color={theme!.colors!.gold![4]} size="xs">
        {dayjs(dateTime).fromNow()}
      </Text>
    </Tooltip>
  );
};

export default Timestamp;
