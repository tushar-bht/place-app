import React from "react";
import ReactDOM from "react-dom";
import "./Modal.css";
import Fade from "@material-ui/core/Fade";
import BackDrop from "./BackDrop";
function ModalOverLay(props) {
  const content = (
    <div className={`modal ${props.className}`} style={props.style}>
      <header className={`modal__header ${props.headerClass}`}>
        <h2>{props.header}</h2>
      </header>
      <form
        onSubmit={
          props.onSumbit ? props.onSubmit : (event) => event.preventDefault()
        }
      >
        <div className={`modal__content ${props.contentClass}`}>
          {props.children}
        </div>
        <footer className={`modal__footer ${props.footerClass}`}>
          {props.footer}
        </footer>
      </form>
    </div>
  );

  return ReactDOM.createPortal(content, document.getElementById("modal"));
}

function Modal(props) {
  return (
    <React.Fragment>
      {props.show && <BackDrop onClick={props.onCancel} />}
      <Fade timeout={500} in={props.show} mountOnEnter unmountOnExit>
        <ModalOverLay {...props} />
      </Fade>
    </React.Fragment>
  );
}
export default Modal;
