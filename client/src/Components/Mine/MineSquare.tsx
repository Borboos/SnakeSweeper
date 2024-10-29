import React from "react";
import { MineSquareType } from "../../Types";
import Bomb from "../Icons/Bomb";
import Flag from "../Icons/Flag";

interface MineSquareProps {
  square: MineSquareType;
  leftClick: (x: number, y: number) => void;
  rightClick: (x: number, y: number) => void;
}

function MineSquare({ square, leftClick, rightClick }: MineSquareProps) {
  return (
    <div
      onClick={() => leftClick(square.x, square.y)}
      onContextMenu={(event) => {
        event.preventDefault();
        rightClick(square.x, square.y);
      }}
      className={
        (square.flipped ? "Flipped" : "Square") +
        (square.adjacentBombs === 1 ? " OneClose" : "") +
        (square.adjacentBombs === 2 ? " TwoClose" : "") +
        (square.adjacentBombs > 2 ? " ThreePlusClose" : "")
      }
    >
      {!square.flipped && square.flagged && <Flag />}
      {square.flipped && square.bomb && <Bomb />}
      {square.flipped &&
        !square.bomb &&
        square.adjacentBombs > 0 &&
        square.adjacentBombs.toString()}
      {square.flipped && !square.bomb && square.adjacentBombs === 0 && "/"}
    </div>
  );
}

export default MineSquare;
