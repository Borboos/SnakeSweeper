import React from "react";
import { ScoreListItem } from "../Types";

interface ScoreListProps {
  game: string;
  scores: ScoreListItem[];
}

function ScoreList({ game, scores }: ScoreListProps) {
  return (
    <div>
      <h1>{game} High Scores</h1>
      <table>
        <tr>
          <th>User</th>
          <th>Score</th>
        </tr>
        {scores.map((s) => (
          <tr>
            <th>{s.username}</th>
            <th>{s.score}</th>
          </tr>
        ))}
      </table>
    </div>
  );
}

export default ScoreList;
