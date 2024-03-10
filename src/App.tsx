import dayjs from "dayjs";
import React from "react";
import "semantic-ui-css/semantic.min.css";
import { Accordion, Button, Container, Header, Input } from "semantic-ui-react";
import styled from "styled-components";
import customParseFormat from "dayjs/plugin/customParseFormat";
import Navbar from "./components/Navbar";
import useLocalStorage from "./hooks/useLocalStorage";
import TimeAccordionContent from "./components/TimeAccordionItem";
import TimeControl from "./components/TimeControl";
dayjs.extend(customParseFormat);

export type AppOptions = { breakDivisor: number };

export type PrevItem = {
  task: string;
  focusBeginTime: number;
  focusDuration: number;
  breakEndTime?: number;
  breakDelay?: number;
};

function App() {
  const [mode, setMode] = React.useState<"focus" | "break">("focus");
  const [activeIdx, setActiveIdx] = React.useState(-1);
  const [history, setHistory] = useLocalStorage<PrevItem[]>("records", []);
  const [task, setTask] = React.useState("");
  const [options, setOptions] = useLocalStorage<AppOptions>("options", {
    breakDivisor: 5,
  });
  const [tasks, setTasks] = useLocalStorage<string[]>("tasks", []);

  const groupedHistory = history.reduce(
    (acc, item) => ({
      ...acc,
      [item.task]: [...(acc[item.task] ?? []), item],
    }),
    {} as Record<string, PrevItem[]>
  );

  return (
    <>
      <Navbar />
      <StyledContainer>
        <Column>
          <RightRow>
            <Input
              label="Break divisor"
              type="number"
              value={options.breakDivisor}
              onChange={(e) =>
                setOptions((prev) => ({
                  ...prev,
                  breakDivisor: parseInt(e.target.value),
                }))
              }
            />
          </RightRow>
          <Header as="h1">🌊Flowmodoro🍅</Header>
          <TimeControl
            canStart={!!(tasks.length && activeIdx >= 0)}
            mode={mode}
            options={options}
            setMode={setMode}
            onFocusEnd={(item) =>
              setHistory((prev) => [
                ...prev,
                {
                  task: tasks[activeIdx],
                  ...item,
                },
              ])
            }
            onBreakEnd={(item) =>
              setHistory((prev) => {
                if (prev.length === 0) return prev;
                const old = prev.slice(0, -1);
                const last = prev[prev.length - 1];
                return [...old, { ...last, ...item }];
              })
            }
          />

          <Row>
            <Input
              label="Task"
              onChange={(e) => setTask(e.target.value)}
              value={task}
            />
            <Button
              compact
              onClick={() => {
                if (!task) return;
                setActiveIdx((prev) => prev + 1);
                setTasks((prev) => [task, ...prev]);
                setTask("");
              }}
            >
              +
            </Button>
          </Row>
          {tasks.length > 0 && (
            <StyledAccordion styled fluid>
              {tasks.map((task, idx) => (
                <TimeAccordionContent
                  index={idx}
                  onToggle={() => setActiveIdx(idx)}
                  setHistory={setHistory}
                  taskName={task}
                  active={activeIdx === idx}
                  tasks={groupedHistory[task] ?? []}
                />
              ))}
            </StyledAccordion>
          )}
        </Column>
      </StyledContainer>
    </>
  );
}

const StyledAccordion = styled(Accordion)`
  width: 100%;
  margin-top: 2rem;
`;

const Row = styled.div`
  width: 100%;
  margin-top: 1rem;
  display: flex;
`;

const RightRow = styled(Row)`
  justify-content: flex-end;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledContainer = styled(Container)`
  && {
    display: flex;
    flex-direction: column;
  }
`;

export default App;
