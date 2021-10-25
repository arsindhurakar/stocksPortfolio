import React from "react";
import "./Input.scss";

const Input = ({ label, type, name, required, autoFocus }) => {
  return (
    <div className="inputField">
      {label && <p>{label}</p>}
      <input
        type={type}
        name={name}
        required={required}
        autoFocus={autoFocus}
      />
    </div>
  );
};

export default Input;
