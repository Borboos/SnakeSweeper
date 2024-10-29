import React from "react";

interface ScoreListProps {
  game: string;
  scores: number[];
}

function ScoreList({ game, scores }: ScoreListProps) {
  return (
    <div>
      <h1>{game} High Scores</h1>
      <table>
        <tr>
          <th>Score</th>
        </tr>
        {scores.map((s) => (
          <tr>
            <th>{s}</th>
          </tr>
        ))}
      </table>
    </div>
  );
}

export default ScoreList;
