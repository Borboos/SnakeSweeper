import React from "react";
import AcctScoreList from "./AcctScoreList";

const snakeScores = [5, 10, 15];

const minesweeperScores = [5, 10, 15];

function Account() {
  return (
    <div>
      <h1>User Leaderboard</h1>
      <AcctScoreList game="Snake" scores={snakeScores} />
      <AcctScoreList game="Minesweeper" scores={minesweeperScores} />
    </div>
  );
}

export default Account;
