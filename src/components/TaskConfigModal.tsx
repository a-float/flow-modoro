import React from "react";
import {
  Modal,
  Button,
  Header,
  Icon,
  ModalContent,
  ModalActions,
  Input,
} from "semantic-ui-react";
import { Task } from "../App";
import { ColorResult, SketchPicker } from "react-color";
import styled from "styled-components";

type TaskConfigModalProps = {
  open: boolean;
  closeModel: () => void;
  onSave: (config?: Task) => void;
  task: Task;
};

const TaskConfigModal: React.FC<TaskConfigModalProps> = (
  props: TaskConfigModalProps
) => {
  const [config, setConfig] = React.useState<Task>({ ...props.task });

  React.useEffect(() => {
    props.open && setConfig({ ...props.task });
    console.log(config);
  }, [props.open]);

  if (!config) return null;

  const handleColorChange = (colorResult: ColorResult) => {
    const c = colorResult.rgb;
    const color = `rgba(${c.r}, ${c.g}, ${c.b}, ${c.a})`;
    setConfig((prev) => ({ ...prev, color }));
  };

  return (
    <Modal onClose={() => props.closeModel()} open={props.open} size="small">
      <Header>
        <Icon name="edit" />
        Edit task
      </Header>
      <ModalContent>
        <Column>
          <Input
            label="Task name"
            value={config.name}
            onChange={(e) => setConfig((p) => ({ ...p, name: e.target.value }))}
          />
          <Button
            color="red"
            onClick={() => {
              props.onSave(undefined);
              props.closeModel();
            }}
          >
            <Icon name="trash" />
            Delete
          </Button>
          <SketchPicker
            disableAlpha={false}
            color={config.color}
            onChange={handleColorChange}
            onChangeComplete={handleColorChange}
          />
        </Column>
      </ModalContent>
      <ModalActions>
        <Button color="red" inverted onClick={() => props.closeModel()}>
          <Icon name="remove" /> Cancel
        </Button>
        <Button
          color="green"
          inverted
          onClick={() => {
            props.onSave(config);
            props.closeModel();
          }}
        >
          <Icon name="checkmark" /> Save
        </Button>
      </ModalActions>
    </Modal>
  );
};

const Column = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
`;

export default TaskConfigModal;
