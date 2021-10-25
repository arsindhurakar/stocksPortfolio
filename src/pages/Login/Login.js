import React, { useState } from "react";
import "./Login.scss";
import { Input, Button } from "../../components/Layout";
import { useAuth } from "../../contexts/AuthContext";
import { useHistory } from "react-router-dom";
import { db } from "../../firebase";

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const { login, register } = useAuth();
  const history = useHistory();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setErrorMsg("");
      setIsLoading(true);
      await login(e.target.email.value, e.target.password.value);
      history.push("/dashboard");
    } catch {
      setErrorMsg("Failed to login");
    }
    setIsLoading(false);
  };

  const handleRegistration = async (e) => {
    const { fname, lname, password, confirmPassword, email } = e.target;

    e.preventDefault();
    if (password.value !== confirmPassword.value) {
      setErrorMsg("Passwords do not match");
    } else {
      try {
        setErrorMsg("");
        setSuccessMsg("");
        setIsLoading(true);
        await register(fname.value, email.value, password.value);

        await db
          .collection("users")
          .doc()
          .set({
            name: `${fname.value} ${lname.value}`,
            email: email.value,
          });

        setSuccessMsg("Registered successfully");
        setTimeout(() => history.push("/dashboard"), 1000);
      } catch {
        setErrorMsg("Email already registered");
      }
    }

    setIsLoading(false);
  };

  const handleRegister = () => {
    setIsRegister(!isRegister);
  };

  return (
    <>
      {errorMsg && <p>{errorMsg}</p>}
      {successMsg && <p>{successMsg}</p>}
      <div className="login">
        <form onSubmit={!isRegister ? handleLogin : handleRegistration}>
          {isRegister && (
            <div className="login__nameContainer">
              <div className="login__name">
                <Input
                  label="First Name"
                  type="text"
                  name="fname"
                  required
                  autoFocus
                />
              </div>
              <div className="login__name">
                <Input label="Last Name" type="text" name="lname" required />
              </div>
            </div>
          )}
          <Input label="Email" type="email" name="email" required />
          <Input label="Password" type="password" name="password" required />
          {isRegister && (
            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              required
            />
          )}
          <div className="login__submitBtn">
            <Button>{!isRegister ? "Login" : "Register"}</Button>
          </div>
        </form>
        <div className="login__newAccount">
          <p>
            {!isRegister ? "Not Registered?" : "Already Registered?"}{" "}
            <span onClick={handleRegister}>
              {!isRegister ? "Register" : "Login"}
            </span>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
