import React, { useContext } from "react";
import { useHistory } from "react-router-dom";

import { AuthContext } from "../../shared components/context/auth-context";
import { useForm } from "../../shared components/hooks/form-hook";
import "./newPlace.css";
import Input from "../../shared components/Input";
import Button from "@material-ui/core/Button";
import { useHttpClient } from "../../shared components/hooks/http-hook";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared components/util/validators";
import ErrorModal from "../../shared components/util/ErrorModal";
import LoadingSpinner from "../../shared components/util/LoadingSpinner";
import ImageUpload from "../../shared components/imageUpload";

function NewPlace(props) {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  const history = useHistory();

  const [formState, InputHandler] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
      address: {
        value: "",
        isValid: false,
      },
      image: {
        value: null,
        isValid: false,
      },
    },
    false
  );

  const formSubmit = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", formState.inputs.title.value);
      formData.append("description", formState.inputs.description.value);
      formData.append("address", formState.inputs.address.value);
      formData.append("creator", auth.userId);
      formData.append("image", formState.inputs.image.value);
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + "/places",
        "POST",
        formData,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      history.push("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <LoadingSpinner asOverlay={true} />}
      <form className="place-form" onSubmit={formSubmit}>
        <Input
          id="title"
          type="text"
          element="input"
          label="Title"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid title"
          onInput={InputHandler}
        />
        <Input
          id="description"
          type="text"
          element="textarea"
          label="Description"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter a valid description (atleast 5 characters)"
          onInput={InputHandler}
        />
        <Input
          id="address"
          type="text"
          element="input"
          label="Address"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid address"
          onInput={InputHandler}
        />

        <ImageUpload id="image" onInput={InputHandler}>
          choose Image
        </ImageUpload>

        <Button
          type="submit"
          style={{ position: "absolute", right: "150px", margin: "15px 0" }}
          variant="contained"
          color="primary"
          disabled={!formState.isValid}
        >
          ADD PLACE
        </Button>
      </form>
    </React.Fragment>
  );
}

export default NewPlace;
