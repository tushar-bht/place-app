import React from "react";
import PlaceItem from "./PlaceItem";
import Card from "../../shared components/Card";
import "./PlaceList.css";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";

function PlaceList(props) {
  return (
    <ul className="place-list ">
      {props.list.length !== 0 ? (
        props.list.map((place) => (
          <Card className="place-card" key={place.id}>
            <PlaceItem
              key={place.id}
              id={place.id}
              image={`${process.env.REACT_APP_ASSET_URL}/${place.image}`}
              title={place.title}
              description={place.description}
              address={place.address}
              location={place.location}
              creatorId={place.creator}
              onDelete={(placeId) => props.onDeletePlace(placeId)}
            />
          </Card>
        ))
      ) : (
        <Card>
          <h1>SORRY NO PLACES FOUND FOUND !</h1>
          <h1>WANNA ADD ONE?</h1>
          <Link to="/addNewPlace" style={{ color: "white" }} exact="true">
            <Button
              style={{ marginTop: "15px" }}
              variant="contained"
              color="secondary"
            >
              ADD PLACE
            </Button>
          </Link>
        </Card>
      )}
    </ul>
  );
}
export default PlaceList;
