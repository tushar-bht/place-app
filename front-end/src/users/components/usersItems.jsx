import React from "react";
import { Link } from "react-router-dom";
import Avatar from "../../shared components/avatar";
import "./usersItem.css";

function usersItem(props) {
  return (
    <div style={{ display: "inline-block", margin: "20px" }}>
      <Link to={`/${props.id}/places`}>
        <div className="user-item">
          <div className="user-item__content">
            <div className="user-item__image">
              <Avatar
                src={`${process.env.REACT_APP_ASSET_URL}/${props.image}`}
                alt={props.name}
              />
            </div>
            <div className="user-item__info">
              <strong>
                <span className="user-name">{props.name}</span>
              </strong>
              <br />
              <span>
                {props.placeCount} {props.placeCount === 1 ? "Place" : "Places"}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
export default usersItem;
