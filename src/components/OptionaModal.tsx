import React from "react";
import {
  Button,
  Icon,
  Input,
  Modal,
  ModalActions,
  ModalContent,
  ModalHeader,
} from "semantic-ui-react";
import styled from "styled-components";
import { AppOptions } from "../App";

type OptionsModalType = {
  options: AppOptions;
  setOptions: React.Dispatch<React.SetStateAction<AppOptions>>;
};

const OptionsModal = (props: OptionsModalType) => {
  const [open, setOpen] = React.useState(false);
  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={
        <Button>
          <Icon name="options" fitted />
        </Button>
      }
    >
      <ModalHeader>Options</ModalHeader>
      <ModalContent>
        <StyledInput
          label="Break divisor"
          type="number"
          value={props.options.breakDivisor}
          onChange={(e) =>
            props.setOptions((prev) => ({
              ...prev,
              breakDivisor: parseInt(e.target.value),
            }))
          }
        />
      </ModalContent>
      <ModalActions>
        <Button
          content="Save"
          labelPosition="right"
          icon="checkmark"
          onClick={() => setOpen(false)}
          positive
        />
      </ModalActions>
    </Modal>
  );
};

const StyledInput: typeof Input = styled(Input)`
  width: 100%;
`;

export default OptionsModal;
