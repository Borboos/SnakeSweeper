import React, { useState } from "react";
import { router } from "../Routes/Routes";
import { RouterProvider } from "react-router-dom";
import "../App.css";
import axios from "axios";
import NavBar from "./NavBar";

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
