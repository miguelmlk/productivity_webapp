import "../App.css";
import React from "react";

interface Props {
  setShowAlert: React.Dispatch<React.SetStateAction<boolean>>;
}

const Alert: React.FC<Props> = ({ setShowAlert }) => {
  return (
    <div
      className="alert alert-success alert-dismissible fade show mt-3"
      role="alert"
    >
      <p className="alert-text">You sure to delete the button</p>
      <button className="btn btn-danger alert-delete-button">Delete</button>
      <button
        type="button"
        className="alert-close-button"
        onClick={() => setShowAlert(false)}
      >
        ✕
      </button>
    </div>
  );
};

export default Alert;
