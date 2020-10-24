import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import ErrorModal from "../../shared components/util/ErrorModal";
import LoadingSpinner from "../../shared components/util/LoadingSpinner";
import { useHttpClient } from "../../shared components/hooks/http-hook";
import PlaceList from "../components/PlaceList";
export const All_PLACES = [];
function UserPlaces(props) {
  const { sendRequest, isLoading, error, clearError } = useHttpClient();
  let userId = useParams().id;
  const [loadedPlaces, setLoadedPlaces] = useState([]);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/places/user/${userId}`
        );
        setLoadedPlaces(responseData.places);
      } catch (err) {}
    };
    fetchPlaces();
  }, [sendRequest, userId]);

  const placeDeletedHandler = (placeId) => {
    setLoadedPlaces((prevPlaces) =>
      prevPlaces.filter((place) => place.id !== placeId)
    );
  };
  return (
    <React.Fragment>
      {isLoading && <LoadingSpinner asOverlay />}

      {!isLoading && (
        <ErrorModal error={error} overlay={true} onClear={clearError} />
      )}
      {!isLoading && loadedPlaces && (
        <PlaceList
          list={loadedPlaces}
          onDeletePlace={(placeId) => placeDeletedHandler(placeId)}
        />
      )}
    </React.Fragment>
  );
}
export default UserPlaces;
