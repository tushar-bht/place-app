import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../shared components/context/auth-context";
import "./navlinks.css";
function NavLinks(props) {
  const auth = useContext(AuthContext);
  return (
    <ul
      className="navLinks"
      style={{ display: props.display, zIndex: props.zIndex }}
    >
      <li onClick={props.onClick}>
        <NavLink className="link" activeClassName="is-active" to="/" exact>
          All Users
        </NavLink>
      </li>

      {auth.isLoggedIn && (
        <li onClick={props.onClick}>
          <NavLink
            className="link"
            activeClassName="is-active"
            to={`/${auth.userId}/places`}
            exact
          >
            My Places
          </NavLink>
        </li>
      )}

      {auth.isLoggedIn && (
        <li onClick={props.onClick}>
          <NavLink
            className="link"
            activeClassName="is-active"
            to="/addNewPlace"
            exact
          >
            Add Places
          </NavLink>
        </li>
      )}
      {!auth.isLoggedIn && (
        <li onClick={props.onClick}>
          <NavLink
            className="link"
            activeClassName="is-active"
            to="/authenticate"
            exact
          >
            Authenticate
          </NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li
          onClick={() => {
            if (props.onClick) props.onClick();
            auth.logout();
          }}
        >
          <NavLink to="/authenticate" className="link" exact>
            Logout
          </NavLink>
        </li>
      )}
    </ul>
  );
}
export default NavLinks;
