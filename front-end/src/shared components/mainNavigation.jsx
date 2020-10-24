import React, { useState } from "react";
import { Link } from "react-router-dom";

import SideDrawer from "./sideDrawer";
import MainHeader from "./mainHeader";
import ClearAllIcon from "@material-ui/icons/ClearAll";

import NavLinks from "./navLinks";
import BackDrop from "./BackDrop";
import "./mainNavigation.css";

function MainNavigation(props) {
  const [drawerIsOpen, setDrawer] = useState(false);

  function setDrawerOpen() {
    setDrawer(true);
  }
  function setDrawerClose() {
    setDrawer(false);
  }

  return (
    <div className="main-navigation">
      {drawerIsOpen && <BackDrop onClick={setDrawerClose} />}
      <SideDrawer status={drawerIsOpen}>
        <nav className="main-navigation__sideDrawer">
          <NavLinks display="block" zIndex="2" onClick={setDrawerClose} />
        </nav>
      </SideDrawer>

      <MainHeader>
        <button onClick={setDrawerOpen}>
          <ClearAllIcon />
        </button>
        <h1 className="main-navigation__title">
          <Link to="/" exact="true">
            <span role="img" desc="image">
              📍
            </span>{" "}
            PLACIFY
          </Link>
        </h1>
        <nav className="allNavLinks">
          <NavLinks display="flex" />
        </nav>
      </MainHeader>
    </div>
  );
}
export default MainNavigation;
