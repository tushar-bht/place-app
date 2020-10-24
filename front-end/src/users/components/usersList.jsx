import React from "react";
import "./usersList.css";
import UserItems from "./usersItems";
function usersList(props) {
  if (props.items.length === 0) return <h2>Soory No user Found</h2>;
  else {
    return (
      <div className="userList">
        <div className="list-box">
          {props.items.map((user) => (
            <UserItems
              key={user.id}
              name={user.name}
              id={user.id}
              image={user.image}
              placeCount={user.places.length}
            />
          ))}
        </div>
      </div>
    );
  }
}
export default usersList;
