import dayjs from "dayjs";
import React from "react";
import {
  AccordionContent,
  AccordionTitle,
  Button,
  Icon,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "semantic-ui-react";
import { parseTime } from "../utils";
import styled from "styled-components";
import { PrevItem } from "../App";

type TimeAccordionItemProps = {
  active: boolean;
  index: number;
  onToggle: () => void;
  taskName: string;
  tasks: PrevItem[];
  setHistory: React.Dispatch<React.SetStateAction<PrevItem[]>>;
  actions?: React.ReactNode;
};

const TimeAccordionItem: React.FC<TimeAccordionItemProps> = (props) => {
  return (
    <>
      <StyledAccordionTitle
        index={props.index}
        onClick={props.onToggle}
        active={props.active}
      >
        <span>{props.taskName}</span>
        <Icon name="dropdown" />
      </StyledAccordionTitle>
      <AccordionContent active={props.active}>
        {!props.tasks.length ? (
          "No records"
        ) : (
          <StyledTable>
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
              {props.tasks.map((item, i) => (
                <TableRow key={i}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>{parseTime(item.focusDuration / 1000)}</TableCell>
                  <TableCell>
                    {!item.breakEndTime
                      ? "in progress"
                      : parseTime(
                          (item.breakEndTime -
                            item.focusBeginTime -
                            item.focusDuration -
                            (item.breakDelay ?? 0)) /
                            1000
                        )}
                  </TableCell>
                  <TableCell>
                    {!item.breakDelay
                      ? "in progress"
                      : parseTime(item.breakDelay / 1000)}
                  </TableCell>
                  <TableCell>
                    {dayjs(item.focusBeginTime).format("HH:mm:ss")}
                  </TableCell>
                  <TableCell>
                    {dayjs(item.focusBeginTime)
                      .add(item.focusDuration, "seconds")
                      .format("HH:mm:ss")}
                  </TableCell>
                  <TableCell>
                    {dayjs(item.focusBeginTime).format("DD/MM/YYYY")}
                  </TableCell>
                  <TableCell>
                    {" "}
                    <Button
                      color="red"
                      size="mini"
                      icon="delete"
                      compact
                      onClick={() =>
                        props.setHistory((prev) => {
                          const newItems: PrevItem[] = [];
                          let c = 0;
                          prev.forEach((t) => {
                            if (c !== i) newItems.push(t);
                            if (t.task === props.taskName) c++;
                          });
                          return newItems;
                        })
                      }
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </StyledTable>
        )}
      </AccordionContent>
    </>
  );
};

const StyledAccordionTitle: typeof AccordionTitle = styled(AccordionTitle)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StyledTable = styled(Table)`
  && {
    width: 100%;
  }
`;

export default TimeAccordionItem;
