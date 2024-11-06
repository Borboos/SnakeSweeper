import React, { useState } from "react";
import { LoginValues } from "../Types";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [values, setValues] = useState<LoginValues>({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    axios
      .post(
        "/login",
        {
          email: values.email,
          password: values.password,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )
      .then(function (response) {
        navigate("/");
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  return (
    <div>
      <form onSubmit={e => handleSubmit(e)}>
        <input
          onChange={handleChange}
          name="email"
          placeholder="Enter E-mail"
        />
        <input
          onChange={handleChange}
          name="password"
          placeholder="Enter Password"
          type="password"
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default Login;
