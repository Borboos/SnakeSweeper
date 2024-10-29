import React from "react";
import "../App.css";
import { router } from "../Routes/Routes";
import { RouterProvider } from "react-router-dom";
import NavBar from "./NavBar";

function App() {
  return (
    <div
      style={{ display: "flex", alignItems: "center", flexDirection: "column" }}
    >
      <NavBar loggedIn={false} />
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
