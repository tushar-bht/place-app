import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";

import { useHttpClient } from "../../shared components/hooks/http-hook";
import LoadingSpinner from "../../shared components/util/LoadingSpinner";
import ErrorModal from "../../shared components/util/ErrorModal";
import "./PlaceItem.css";
import Button from "../../shared components/button";
import Modal from "../../shared components/Modal";
import Map from "./map";
import { AuthContext } from "../../shared components/context/auth-context";
function PlaceItem(props) {
  const [showMap, setShowMap] = React.useState(false);
  const [showConfirmModel, setShowConfirmModel] = useState(false);
  const { isLoading, sendRequest, error, clearError } = useHttpClient();

  const auth = useContext(AuthContext);

  const showPlaceMap = () => setShowMap(true);
  const hidePlaceMap = () => setShowMap(false);

  const showDeleteWarningHandler = () => setShowConfirmModel(true);
  const cancelDeleteHandler = () => setShowConfirmModel(false);

  const confirmDeleteHandler = async () => {
    setShowConfirmModel(false);
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/places/${props.id}`,
        "DELETE",
        {},
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      console.log("done");
      props.onDelete(props.id);
    } catch (err) {}
  };

  return (
    <React.Fragment>
      {isLoading && <LoadingSpinner asOverlay />}

      {!isLoading && <ErrorModal error={error} onClear={clearError} />}

      <Modal
        show={showMap}
        onCancel={hidePlaceMap}
        header={props.address}
        headerClass="header-class"
        footer={
          <Button
            onClick={hidePlaceMap}
            margin={"20px 0 0 0"}
            color="white"
            backgroundColor="#43658b"
          >
            Close
          </Button>
        }
      >
        <div id="map_" className="modal__map-container">
          <Map location={props.location} />
        </div>
      </Modal>

      <Modal
        show={showConfirmModel}
        onCancel={cancelDeleteHandler}
        header="Are you sure ? "
        footer={
          <React.Fragment>
            <Button backgroundColor="grey" onClick={cancelDeleteHandler}>
              Cancel
            </Button>
            <Button
              backgroundColor="#f40552"
              color="white"
              onClick={confirmDeleteHandler}
            >
              Delete
            </Button>
          </React.Fragment>
        }
      ></Modal>
      {isLoading && <LoadingSpinner asOverlay={true} />}
      {!isLoading && (
        <li className="place-item">
          <div className="place-item__image">
            <img src={props.image} alt={props.title} />
          </div>
          <div className="place-item__info">
            <h2>{props.title}</h2>

            <h5>{props.address}</h5>
            <p>{props.description}</p>
          </div>
          <div className="place-item__actions">
            <Button
              backgroundColor={"#145374"}
              color={"white"}
              onClick={showPlaceMap}
            >
              View On Map
            </Button>

            {auth.userId === props.creatorId && (
              <React.Fragment>
                <Link
                  style={{ color: "black", width: "100%" }}
                  to={`/places/${props.id}`}
                >
                  <Button
                    backgroundColor={"#ad9d9d"}
                    style={{ margin: "4px", display: "unset" }}
                  >
                    Edit
                  </Button>
                </Link>

                <Button
                  backgroundColor="#e7305b"
                  color="white"
                  style={{ margin: "4px" }}
                  onClick={showDeleteWarningHandler}
                >
                  Delete
                </Button>
              </React.Fragment>
            )}
          </div>
        </li>
      )}
    </React.Fragment>
  );
}
export default PlaceItem;
