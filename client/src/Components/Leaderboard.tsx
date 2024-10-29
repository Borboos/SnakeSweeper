import React, { useState, useEffect } from "react";
import ScoreList from "./ScoreList";
import { Scores } from "../Types";
import axios from "axios";

function Leaderboard() {
  const [scores, setScores] = useState<Scores>();
  useEffect(() => {
    axios
      .get("/leaderboard")
      .then((res) => {
        console.log(res);
        setScores(res.data);
      })
      .catch((e) => console.log(e));
  }, []);
  return (
    <div>
      <h1>User Leaderboard</h1>
      {scores ? (
        <div>
          <ScoreList game="Snake" scores={scores.snakeScores} />
          <ScoreList game="Minesweeper" scores={scores.minesweeperScores} />
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}

export default Leaderboard;
