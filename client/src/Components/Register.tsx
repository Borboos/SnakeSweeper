import React, { useState } from "react";
import { RegisterValues } from "../Types";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { validate } from "email-validator";

function Register() {
  const [values, setValues] = useState<RegisterValues>({
    email: "",
    username: "",
    password: "",
    passwordConfirm: "",
  });
  const [submissionError, setSubmissionError] = useState("");
  const navigate = useNavigate();
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (values.password === values.passwordConfirm && validate(values.email)) {
      axios
        .post("/register", values, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        })
        .then((res) => {
          console.log(res);
          navigate("/login");
        })
        .catch((e) => {
          console.log(e.response.data.error);
          setSubmissionError(e.response.data.error);
        });
    }
  };
  return (
    <div>
      <form onSubmit={(e) => handleSubmit(e)}>
        <input
          onChange={handleChange}
          name="email"
          placeholder="Enter E-mail"
        />
        <input
          onChange={handleChange}
          name="username"
          placeholder="Enter Username"
        />
        <input
          onChange={handleChange}
          name="password"
          placeholder="Enter Password"
          type="password"
        />
        <input
          onChange={handleChange}
          name="passwordConfirm"
          placeholder="Re-Enter Password"
          type="password"
        />
        <button type="submit">Submit</button>
      </form>
      {values.password &&
      values.passwordConfirm &&
      values.password !== values.passwordConfirm ? (
        <p>Entered Passwords do not match</p>
      ) : (
        <div></div>
      )}
      {values.email && !validate(values.email) ? (
        <p>Entered E-mail is not valid</p>
      ) : (
        <div></div>
      )}
      {submissionError ? <p>{submissionError}</p> : <div></div>}
    </div>
  );
}

export default Register;
