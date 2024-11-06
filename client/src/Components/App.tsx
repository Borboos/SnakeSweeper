import React, { useState } from "react";
import "../App.css";
import { router } from "../Routes/Routes";
import { RouterProvider } from "react-router-dom";
import NavBar from "./NavBar";
import axios from "axios";

function App() {
  const val = axios.get("/refresh");
  console.log(val);
  const [loggedIn, setLoggedIn] = useState(false);
  return (
    <div
      style={{ display: "flex", alignItems: "center", flexDirection: "column" }}
    >
      <NavBar loggedIn={loggedIn} />
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
