import React, { useRef, useState, useEffect } from "react";

import "./imageUpload.css";
import Button from "./button";
function ImageUpload(props) {
  const filePickerRef = useRef();
  const [file, setFile] = useState();
  const [isValid, setIsValid] = useState();
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (!file) return;
    const fileReader = new FileReader();

    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };
  }, [file]);

  const pickHandler = (event) => {
    let pickedFile;
    let fileIsValid = isValid;
    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];
      setFile(pickedFile);
      setIsValid(true);
      fileIsValid = true;
    } else {
      setIsValid(false);
      fileIsValid = false;
    }
    props.onInput(props.id, pickedFile, fileIsValid);
  };

  const pickImageHandler = () => {
    filePickerRef.current.click();
  };
  return (
    <div className={`image-upload ${props.className}`}>
      <input
        onChange={pickHandler}
        ref={filePickerRef}
        id={props.id}
        style={{ display: "none" }}
        type="file"
        accept=".jpg,.png,.jpeg"
      />
      <div className="image-preview">
        {previewUrl && (
          <img style={{ height: "100px" }} src={previewUrl} alt="Preview" />
        )}
        {!previewUrl && <p>please pick image</p>}
      </div>

      <br />
      <Button color="white" backgroundColor="#407088" type="button" onClick={pickImageHandler}>
        {props.children}
      </Button>
    </div>
  );
}
export default ImageUpload;
