import React from "react";
import ReactDOM from "react-dom";

import { Slide } from "@material-ui/core";
import "./sideDrawer.css";

function SideDrawer(props) {
  let x = (
    <Slide
      timeout={500}
      direction="right"
      in={props.status}
      mountOnEnter
      unmountOnExit
    >
      <aside className="side-drawer">{props.children}</aside>
    </Slide>
  );
  return ReactDOM.createPortal(x, document.getElementById("drawer"));
}
export default SideDrawer;
