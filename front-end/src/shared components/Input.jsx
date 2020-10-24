import React, { useReducer, useEffect } from "react";
import { validate } from "./util/validators";
import "./Input.css";

function inputReducer(state, action) {
  switch (action.type) {
    case "change":
      return {
        ...state,
        value: action.val,
        isValid: validate(action.val, action.validators),
      };
    default:
      return state;
  }
}

function Input(props) {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.value || "",
    isValid: props.isValid || false,
  });
  const { id, onInput } = props;
  const { value, isValid } = inputState;

  useEffect(() => {
    onInput(id, value, isValid);
  }, [id, value, onInput, isValid]);

  function changeHandler(event) {
    dispatch({
      type: "change",
      val: event.target.value,
      validators: props.validators,
    });
  }

  const element =
    props.element === "input" ? (
      <input
        id={props.id}
        type={props.type}
        value={inputState.value}
        onChange={changeHandler}
        placeholder={props.placeholder}
      />
    ) : (
      <textarea
        id={props.id}
        onChange={changeHandler}
        value={inputState.value}
        rows={props.rows || 3}
      />
    );

  return (
    <div
      className={`form-control ${props.formClass} ${
        !inputState.isValid && "form-control--invalid"
      }`}
    >
      <label htmlFor={props.id}> {props.label} </label> {element}
      {!inputState.isValid && <p> {props.errorText} </p>}
    </div>
  );
}
export default Input;
