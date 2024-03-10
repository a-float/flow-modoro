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
import TaskConfigModal from "./components/TaskConfigModal";
import { generateId } from "./utils";
dayjs.extend(customParseFormat);

const DEFAULT_COLOR = "white";

export type AppOptions = { breakDivisor: number };

export type Stretch = {
  focusBeginTime: number;
  focusDuration: number;
  breakEndTime?: number;
  breakDelay?: number;
};

export type Task = {
  id: ReturnType<typeof generateId>;
  name: string;
  color: string;
  stretches: Stretch[];
};

function App() {
  const [mode, setMode] = React.useState<"focus" | "break">("focus");
  const [openId, setOpenId] = React.useState(-1);
  const [taskName, setTaskName] = React.useState("");
  const [options, setOptions] = useLocalStorage<AppOptions>("options", {
    breakDivisor: 5,
  });
  const [tasks, setTasks] = useLocalStorage<Record<number, Task>>("tasks", {});
  const [activeId, setActiveId] = React.useState(-1);
  const [editedTaskId, setEditedTaskId] = React.useState(-1);
  console.log(editedTaskId);

  const handleToggle = (taskId: number) => () => {
    setOpenId((p) => (p === taskId ? -1 : taskId));
    setActiveId(taskId);
  };

  return (
    <>
      <TaskConfigModal
        open={editedTaskId >= 0}
        closeModel={() => setEditedTaskId(-1)}
        task={tasks[editedTaskId]}
        onSave={(config) => {
          if (!config) {
            setActiveId(-1);
            setOpenId(-1);
            setEditedTaskId(-1);
          }
          setTasks((prev) => {
            const old = { ...prev };
            if (config) return { ...old, [editedTaskId]: config };
            delete old[editedTaskId];
            return old;
          });
        }}
      />
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
            canStart={!!tasks[activeId]}
            mode={mode}
            options={options}
            setMode={setMode}
            onFocusEnd={(item) =>
              tasks[activeId] &&
              setTasks((prev) => ({
                ...prev,
                [activeId]: {
                  ...prev[activeId],
                  stretches: [...prev[activeId].stretches, { ...item }],
                },
              }))
            }
            onBreakEnd={(item) =>
              tasks[activeId] &&
              setTasks((prev) => {
                const last = prev[activeId].stretches.at(-1);
                if (!last) return prev;
                return {
                  ...prev,
                  [activeId]: {
                    ...prev[activeId],
                    stretches: [
                      ...prev[activeId].stretches.slice(0, -1),
                      { ...last, ...item },
                    ],
                  },
                };
              })
            }
          />
          <Row
            as="form"
            onSubmit={(e) => {
              e.preventDefault();
              if (!taskName) return;
              setTasks((prev) => {
                const id = generateId();
                return {
                  [id]: {
                    id,
                    name: taskName,
                    color: DEFAULT_COLOR,
                    stretches: [],
                  },
                  ...prev,
                };
              });
              setTaskName("");
            }}
          >
            <StyledInput
              label="Task"
              onChange={(e) => setTaskName(e.target.value)}
              value={taskName}
            />
            <Button compact>+</Button>
          </Row>
          {Object.keys(tasks).length > 0 && (
            <StyledAccordion styled fluid>
              {Object.values(tasks).map((task, idx) => (
                <TimeAccordionContent
                  key={task.id}
                  index={idx}
                  onToggle={handleToggle(task.id)}
                  taskName={task.name}
                  open={openId === task.id}
                  active={activeId === task.id}
                  task={task}
                  updateTask={(task) =>
                    setTasks((prev) => ({ ...prev, [task.id]: task }))
                  }
                  onEditTask={() => setEditedTaskId(task.id)}
                />
              ))}
            </StyledAccordion>
          )}
        </Column>
      </StyledContainer>
    </>
  );
}

const StyledInput: typeof Input = styled(Input)`
  flex-grow: 1;
  margin-right: 1rem;
`;

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
