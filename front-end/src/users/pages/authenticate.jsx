import React, { useContext } from "react";

import ImageUpload from "../../shared components/imageUpload";
import Input from "../../shared components/Input";
import { useHttpClient } from "../../shared components/hooks/http-hook";
import { useForm } from "../../shared components/hooks/form-hook";
import Button from "@material-ui/core/Button";
import { AuthContext } from "../../shared components/context/auth-context";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared components/util/validators";
import ErrorModal from "../../shared components/util/ErrorModal";
import LoadingSpinner from "../../shared components/util/LoadingSpinner";

function Authenticate() {
  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = React.useState(true);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [formState, InputHandler, setFormData] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  function switchModeHandler() {
    if (!isLoginMode) {
      setFormData(
        { ...formState.inputs, name: undefined, image: undefined },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: "",
            isValid: false,
          },
          image: { value: null, isValid: false },
        },
        false
      );
    }
    setIsLoginMode((prevMode) => !prevMode);
  }

  async function authSubmitHandler(e) {
    e.preventDefault();
    if (isLoginMode) {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/users/signin",
          "POST",
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          { "content-type": "application/json" }
        );

        auth.login(responseData.userId, responseData.token);
      } catch (err) {}
    } else {
      try {
        const formData = new FormData();
        formData.append("name", formState.inputs.name.value);
        formData.append("email", formState.inputs.email.value);
        formData.append("password", formState.inputs.password.value);
        formData.append("image", formState.inputs.image.value);
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/users/signup",
          "POST",
          formData
        );

        auth.login(responseData.userId, responseData.token);
      } catch (err) {}
    }
  }

  return (
    <div>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <LoadingSpinner asOverlay={true} />}
      <h2
        style={{
          textAlign: "center",
          color: "rgb(39,44,52)",
          margin: "50px 0 0 0",
        }}
      >
        {isLoginMode ? "SIGN IN" : "SIGN UP"}
      </h2>
      <form onSubmit={authSubmitHandler}>
        {!isLoginMode && (
          <React.Fragment>
            <Input
              type="text"
              label="Your Name"
              element="input"
              id="name"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a Name"
              onInput={InputHandler}
            />
          </React.Fragment>
        )}
        {!isLoginMode && (
          <ImageUpload id="image" onInput={InputHandler}>
            Choose Image
          </ImageUpload>
        )}
        <Input
          type="email"
          element="input"
          id="email"
          value={formState.inputs.email.value}
          label="Email"
          isValid={formState.inputs.email.isValid}
          validators={[VALIDATOR_REQUIRE()]}
          onInput={InputHandler}
          errorText="Please enter a valid email"
        />
        <Input
          type="password"
          value={formState.inputs.password.value}
          element="input"
          id="password"
          label="Password"
          isValid={formState.inputs.password.isValid}
          onInput={InputHandler}
          validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(8)]}
          errorText="Please enter a valid password"
        />
        <Button
          type="submit"
          disabled={!formState.isValid}
          style={{ margin: "0 10%" }}
          variant="contained"
          color="primary"
        >
          {isLoginMode ? "Sign In" : "Sign Up"}
        </Button>
      </form>
      <Button
        style={{ margin: "10px 10%" }}
        variant="outlined"
        onClick={switchModeHandler}
        color="primary"
      >
        {isLoginMode ? "Switch To Sign Up" : "Switch To Sign In"}
      </Button>
    </div>
  );
}
export default Authenticate;
