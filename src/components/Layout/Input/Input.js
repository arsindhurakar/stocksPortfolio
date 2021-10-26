import React from "react";
import "./Input.scss";

const Input = ({ label, type, name, value, onChange, required, autoFocus }) => {
  return (
    <div className="inputField">
      {label && <p>{label}</p>}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        autoFocus={autoFocus}
      />
    </div>
  );
};

export default Input;
