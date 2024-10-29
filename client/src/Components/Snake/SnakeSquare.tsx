import React from "react";
import { Direction, SnakeSquareType } from "../../Types";
import Apple from "../Icons/Apple";
import Orange from "../Icons/Orange";
import Banana from "../Icons/Banana";
import ArrowLeft from "../Icons/ArrowLeft";
import ArrowRight from "../Icons/ArrowRight";
import ArrowUp from "../Icons/ArrowUp";
import ArrowDown from "../Icons/ArrowDown";
import Circle from "../Icons/Circle";

interface SnakeSquareProps {
  square: SnakeSquareType;
  fruitNum: number;
  headDirection: Direction;
}

function SnakeSquare({ square, fruitNum, headDirection }: SnakeSquareProps) {
  return (
    <div className="SnakeSquare">
      {square.fruit && fruitNum === 1 ? <Apple /> : <div></div>}
      {square.fruit && fruitNum === 2 ? <Orange /> : <div></div>}
      {square.fruit && fruitNum === 3 ? <Banana /> : <div></div>}
      {square.head && headDirection === Direction.Left ? (
        <ArrowLeft />
      ) : (
        <div></div>
      )}
      {square.head && headDirection === Direction.Right ? (
        <ArrowRight />
      ) : (
        <div></div>
      )}
      {square.head && headDirection === Direction.Up ? (
        <ArrowUp />
      ) : (
        <div></div>
      )}
      {square.head && headDirection === Direction.Down ? (
        <ArrowDown />
      ) : (
        <div></div>
      )}
      {square.bodyPos > 0 ? <Circle /> : <div></div>}
    </div>
  );
}

export default SnakeSquare;
