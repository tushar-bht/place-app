import React from "react";
import "./button.css";
function Button(props) {
  return (
    <button
      type={props.type}
      style={{
        backgroundColor: [props.backgroundColor],
        color: [props.color],
        margin: [props.margin],
      }}
      onClick={props.onClick}
      className={`button ${props.className}`}
    >
      {props.children}
    </button>
  );
}
export default Button;
