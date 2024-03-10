import dayjs from "dayjs";
import React from "react";
import {
  AccordionContent,
  AccordionTitle,
  Button,
  Icon,
  Statistic,
  StatisticGroup,
  StatisticLabel,
  StatisticValue,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "semantic-ui-react";
import { parseTime } from "../utils";
import styled from "styled-components";
import { Stretch, Task } from "../App";

type TimeAccordionItemProps = {
  open: boolean;
  active: boolean;
  index: number;
  onToggle: () => void;
  taskName: string;
  task: Task;
  updateTask: (task: Task) => void;
  actions?: React.ReactNode;
  onEditTask: () => void;
};

const TimeAccordionItem: React.FC<TimeAccordionItemProps> = (props) => {
  const getBreakTime = (s: Stretch) =>
    !s.breakEndTime
      ? 0
      : (s.breakEndTime -
          s.focusBeginTime -
          s.focusDuration -
          (s.breakDelay ?? 0)) /
        1000;

  return (
    <>
      <StyledAccordionTitle
        $taskColor={props.task.color}
        $active={props.active}
        index={props.index}
        onClick={props.onToggle}
        active={props.open}
      >
        <span>
          {props.active && <Icon name="arrow right" />}
          {props.taskName}
        </span>
        <div>
          <StyledButton
            basic
            compact
            icon="cog"
            size="mini"
            onClick={(e) => {
              e.stopPropagation();
              props.onEditTask();
            }}
          />
          <Icon name="dropdown" />
        </div>
      </StyledAccordionTitle>
      <StyledAccordionContent
        active={props.open}
        $color={props.active ? props.task.color : ""}
      >
        {!props.task.stretches?.length ? (
          "No records"
        ) : (
          <StyledTable celled striped>
            <TableHeader>
              <TableRow>
                <th>Index</th>
                <th>Focus time</th>
                <th>Break time</th>
                <th>Break delay</th>
                <th>Focus start</th>
                <th>Focus end</th>
                <th>Date</th>
                <th>Actions</th>
              </TableRow>
            </TableHeader>
            <TableBody>
              {props.task.stretches.map((s, i) => (
                <TableRow key={i}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>{parseTime(s.focusDuration / 1000)}</TableCell>
                  <TableCell>
                    {!s.breakEndTime
                      ? "in progress"
                      : parseTime(
                          (s.breakEndTime -
                            s.focusBeginTime -
                            s.focusDuration -
                            (s.breakDelay ?? 0)) /
                            1000
                        )}
                  </TableCell>
                  <TableCell>
                    {!s.breakDelay
                      ? "in progress"
                      : parseTime(s.breakDelay / 1000)}
                  </TableCell>
                  <TableCell>
                    {dayjs(s.focusBeginTime).format("HH:mm:ss")}
                  </TableCell>
                  <TableCell>
                    {dayjs(s.focusBeginTime)
                      .add(s.focusDuration, "milliseconds")
                      .format("HH:mm:ss")}
                  </TableCell>
                  <TableCell>
                    {dayjs(s.focusBeginTime).format("DD/MM/YYYY")}
                  </TableCell>
                  <TableCell>
                    <Button
                      color="red"
                      size="mini"
                      icon="delete"
                      compact
                      onClick={() => {
                        const s = props.task.stretches;
                        props.updateTask({
                          ...props.task,
                          stretches: [...s.slice(0, i), ...s.slice(i + 1)],
                        });
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </StyledTable>
        )}
        {props.task.stretches.length > 0 && (
          <StyledStatisticGroup size="mini">
            <Statistic>
              <StatisticValue>
                {parseTime(
                  props.task.stretches.reduce(
                    (acc, s) => acc + s.focusDuration,
                    0
                  ) / 1000
                )}
              </StatisticValue>
              <StatisticLabel>Total focus</StatisticLabel>
            </Statistic>
            <Statistic>
              <StatisticValue>
                {" "}
                {parseTime(
                  props.task.stretches.reduce(
                    (acc, s) => acc + getBreakTime(s),
                    0
                  )
                )}
              </StatisticValue>
              <StatisticLabel>Total break</StatisticLabel>
            </Statistic>
            <Statistic>
              <StatisticValue>
                {parseTime(
                  props.task.stretches.reduce(
                    (acc, s) => acc + (s?.breakDelay ?? 0),
                    0
                  ) / 1000
                )}
              </StatisticValue>
              <StatisticLabel>Total delay</StatisticLabel>
            </Statistic>
          </StyledStatisticGroup>
        )}
      </StyledAccordionContent>
    </>
  );
};

const StyledStatisticGroup = styled(StatisticGroup)`
  && {
    margin: 1.5rem 0 0;
  }
  && .ui.statistic {
    margin: 0 1rem;
  }
`;

const StyledButton: typeof Button = styled(Button)`
  && {
    margin-right: 1rem;
  }
`;

const StyledAccordionContent = styled(AccordionContent)<{ $color: string }>`
  ${(props) => props.$color && `border: 2px solid ${props.$color};`}
`;

const StyledAccordionTitle = styled(AccordionTitle)<{
  $active: boolean;
  $taskColor: string;
}>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  &&&&& {
    color: black;
    transition: background-color 250ms;
    background-color: ${(props) => props.$taskColor};
  }
`;

const StyledTable = styled(Table)`
  && {
    width: 100%;
  }
`;

export default TimeAccordionItem;
