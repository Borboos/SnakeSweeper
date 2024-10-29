import React from "react";

interface GameOverProps {
  score: number;
}

function SnakeGameOver({ score }: GameOverProps) {
  return (
    <div className="gameOver">
      <h1>GAME OVER</h1>
      <h1>FRUITS EATEN: {score}</h1>
      <button onClick={() => window.location.reload()}>
        Click Here to Restart
      </button>
    </div>
  );
}

export default SnakeGameOver;
