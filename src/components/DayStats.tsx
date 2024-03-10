import React from "react";
import { Stretch, Task } from "../App";
import {
  StatisticGroup,
  Statistic,
  StatisticValue,
  StatisticLabel,
} from "semantic-ui-react";
import styled from "styled-components";
import { parseTime, getBreakTime } from "../utils";
import dayjs from "dayjs";

type DayStats = {
  tasks: Task[];
};

const DayStats: React.FC<DayStats> = (props) => {
  const stretches = props.tasks
    .reduce((acc, t) => acc.concat(t.stretches), [] as Stretch[])
    .filter((s) => dayjs(s.focusBeginTime).isSame(dayjs(), "day"));

  return (
    <StyledStatisticGroup size="tiny" horizontal>
      <Statistic>
        <StatisticValue>
          {parseTime(
            stretches.reduce((acc, s) => acc + s.focusDuration, 0) / 1000
          )}
        </StatisticValue>
        <StatisticLabel>Today's focus</StatisticLabel>
      </Statistic>
      <Statistic>
        <StatisticValue>
          {parseTime(stretches.reduce((acc, s) => acc + getBreakTime(s), 0))}
        </StatisticValue>
        <StatisticLabel>Today's break</StatisticLabel>
      </Statistic>
      <Statistic>
        <StatisticValue>
          {parseTime(
            stretches.reduce((acc, s) => acc + (s?.breakDelay ?? 0), 0) / 1000
          )}
        </StatisticValue>
        <StatisticLabel>Today's delay</StatisticLabel>
      </Statistic>
    </StyledStatisticGroup>
  );
};

const StyledStatisticGroup = styled(StatisticGroup)`
  && .ui.statistic {
    flex-direction: row-reverse;
    gap: 1rem;
    align-items: center;

    .label {
      margin: 0;
    }
  }
`;

export default DayStats;
