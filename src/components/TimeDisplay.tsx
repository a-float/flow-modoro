import React from "react";
import styled from "styled-components";
import { pad, parseTime } from "../utils";

type TimeDisplayProps = {
  time: number;
};

const TimeDisplay: React.FC<TimeDisplayProps> = (props: TimeDisplayProps) => {
  const ms = Math.abs(props.time) % 1000;
  return (
    <Time $overdue={props.time < 0}>
      {props.time < 0 && "-"}
      {parseTime(Math.floor(Math.abs(props.time) / 1000))}
      <Milis>:{pad(ms, 3)}</Milis>
    </Time>
  );
};

const Milis = styled.span`
  font-size: 1.1rem;
  color: #666;
`;

const Time = styled.div<{ $overdue: boolean }>`
  font-size: 2rem;
  line-height: 2rem;
  margin-bottom: 1rem;
  &,
  * {
    ${(props) => props.$overdue && "color: #ea2929 !important;"}
  }
`;

export default TimeDisplay;
