import React from "react";
import "./Button.scss";

const Button = ({ children, onClick, disabled, isSecondary }) => (
  <button
    className={isSecondary ? "btn btnSecondary" : "btn"}
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
);

export default Button;
