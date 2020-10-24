import React, { useEffect, useState } from "react";

import UserList from "../components/usersList";
import ErrorModal from "../../shared components/util/ErrorModal";
import LoadingSpinner from "../../shared components/util/LoadingSpinner";
import { useHttpClient } from "../../shared components/hooks/http-hook";

function Users() {
  const [loadedUsers, setLoadedUsers] = useState();
  const { sendRequest, isLoading, error, clearError } = useHttpClient();
  useEffect(() => {
    async function getUsers() {
      console.log("ghkd");
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/users"
        );
        console.log(responseData + "ghkd");
        setLoadedUsers(responseData.users);
      } catch (err) {
        console.log(err);
      }
    }
    getUsers();
  }, [sendRequest]);

  return (
    <React.Fragment>
      {isLoading && (
        <div style={{ textAlign: "center" }}>
          <LoadingSpinner asOverlay />
        </div>
      )}
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && loadedUsers && (
        <div style={{ textAlign: "center", width: "90%", margin: "0 auto" }}>
          <UserList items={loadedUsers} />
        </div>
      )}
    </React.Fragment>
  );
}
export default Users;
