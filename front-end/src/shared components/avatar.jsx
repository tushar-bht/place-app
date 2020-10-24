import React from "react";
import "./avatar.css";
function Avatar(props) {
  return <img className="avatar-image" src={props.src} alt={props.alt} />;
}
export default Avatar;
