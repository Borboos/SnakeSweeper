import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Home from "../Components/Home";
import SnakeGrid from "../Components/Snake/SnakeGrid";
import MineGrid from "../Components/Minesweeper/MineGrid";
import Leaderboard from "../Components/Leaderboard";
import Login from "../Components/Login";
import Register from "../Components/Register";
import Account from "../Components/Account";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/snake",
    element: <SnakeGrid />,
  },
  {
    path: "/minesweeper",
    element: <MineGrid />,
  },
  {
    path: "/leaderboard",
    element: <Leaderboard />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/accounts",
    element: <Account />,
  },
]);
