import React from "react";
import ReactDOM from "react-dom";
import "./BackDrop.css";

function BackDrop(props) {
  return ReactDOM.createPortal(
    <div className="back-drop" onClick={props.onClick}></div>,
    document.getElementById("back-drop")
  );
}

export default BackDrop;
