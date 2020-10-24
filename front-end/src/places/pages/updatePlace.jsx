import React, { useState, useEffect, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";

import { AuthContext } from "../../shared components/context/auth-context";
import { useHttpClient } from "../../shared components/hooks/http-hook";
import LoadingSpinner from "../../shared components/util/LoadingSpinner";
import ErrorModal from "../../shared components/util/ErrorModal";
import "./updatePlace.css";
import Input from "../../shared components/Input";
import Button from "@material-ui/core/Button";
import { useForm } from "../../shared components/hooks/form-hook";

import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared components/util/validators";
import Card from "../../shared components/Card";

const UpdatePlace = () => {
  const { placeId } = useParams();
  const [loadedPlace, setLoadedPlace] = useState();
  const { sendRequest, error, clearError, isLoading } = useHttpClient();
  const history = useHistory();
  const user = useContext(AuthContext);

  const [formState, InputHandler, setFormData] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`
        );
        setLoadedPlace(responseData.place);
        setFormData(
          {
            title: { value: responseData.place.title, isValid: true },
            description: {
              value: responseData.place.description,
              isValid: true,
            },
          },
          true
        );
      } catch (err) {}
    };
    fetchPlace();
  }, [sendRequest, placeId, setFormData]);

  async function placeUpdateSubmitHandler(event) {
    event.preventDefault();
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`,
        "PATCH",
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
        }),
        {
          "content-type": "application/json",
          Authorization: "Bearer " + user.token,
        }
      );
      history.push(`/${user.userId}/places`);
    } catch (err) {}
  }

  if (!loadedPlace && !isLoading)
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <Card className="empty-place-card">
          <h2>Could not find the place!</h2>
        </Card>
      </div>
    );
  return (
    <React.Fragment>
      {isLoading && <LoadingSpinner asOverlay />}
      {!isLoading && <ErrorModal error={error} onClear={clearError} />}
      {!isLoading && loadedPlace && (
        <form onSubmit={placeUpdateSubmitHandler}>
          <Input
            id="title"
            element="input"
            type="text"
            label="Title"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid text"
            value={loadedPlace.title}
            onInput={InputHandler}
            isValid={true}
          />
          <Input
            id="description"
            element="textarea"
            type="text"
            label="Description"
            validators={[VALIDATOR_MINLENGTH(5)]}
            value={loadedPlace.description}
            errorText="Please enter a valid description (min 5 length)"
            onInput={InputHandler}
            isValid={true}
          />
          <Button
            color="primary"
            type="submit"
            style={{ margin: "0 10%" }}
            variant="contained"
            disabled={!formState.isValid}
          >
            UPDATE PLACE
          </Button>
        </form>
      )}
    </React.Fragment>
  );
};

export default UpdatePlace;
