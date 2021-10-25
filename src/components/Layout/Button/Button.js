import React from "react";
import "./Button.scss";

const Button = ({ children, onClick, isSecondary }) => (
  <button
    className={isSecondary ? "btn btnSecondary" : "btn"}
    onClick={onClick}
  >
    {children}
  </button>
);

export default Button;
