import React from "react";

import Button from "@material-ui/core/Button";
import Modal from "../Modal";

const ErrorModal = (props) => {
  return (
    <Modal
      onCancel={props.onClear}
      header="An Error Occurred!"
      show={!!props.error}
      footer={
        <Button variant="contained" color="secondary" onClick={props.onClear}>
          Okay
        </Button>
      }
    >
      <p>{props.error}</p>
    </Modal>
  );
};

export default ErrorModal;
