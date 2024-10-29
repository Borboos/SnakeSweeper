import React, { useEffect, useState } from "react";
import { Direction, SnakeSquareType } from "../../Types";
import SnakeGameOver from "./SnakeGameOver";
import SnakeSquare from "./SnakeSquare";

function getSquare(list: SnakeSquareType[], x: number, y: number) {
  return list.filter((s) => s.x === x && s.y === y)[0];
}

function updateFruit(list: SnakeSquareType[]) {
  let prevFruit = list.filter((s) => s.fruit)[0];
  let prevHead = list.filter((s) => s.head)[0];
  let prevBody = list.filter((s) => s.bodyPos > 0);
  let nextFruit = getSquare(
    list,
    Math.floor(Math.random() * 16),
    Math.floor(Math.random() * 16)
  );
  while (
    nextFruit === prevFruit ||
    nextFruit === prevHead ||
    prevBody.includes(nextFruit)
  ) {
    nextFruit = getSquare(
      list,
      Math.floor(Math.random() * 16),
      Math.floor(Math.random() * 16)
    );
  }
  prevFruit.fruit = false;
  nextFruit.fruit = true;
  const biteSound = new Audio(`./sounds/bite.mp3`);
  biteSound.play();
  return Math.ceil(Math.random() * 3);
}

function findTail(list: SnakeSquareType[]) {
  let tail: SnakeSquareType = {} as SnakeSquareType;
  let maxTail = 0;
  list.forEach((s) => {
    if (s.bodyPos > maxTail) {
      tail = s;
      maxTail = s.bodyPos;
    }
  });
  return tail;
}

function getNextSquare(
  tempSquareList: SnakeSquareType[],
  prevHead: SnakeSquareType,
  tempDirection: Direction
) {
  switch (tempDirection) {
    case Direction.Left:
      return tempSquareList.filter(
        (s) => s.x === prevHead.x && s.y === prevHead.y - 1
      )[0];
    case Direction.Right:
      return tempSquareList.filter(
        (s) => s.x === prevHead.x && s.y === prevHead.y + 1
      )[0];
    case Direction.Up:
      return tempSquareList.filter(
        (s) => s.x === prevHead.x - 1 && s.y === prevHead.y
      )[0];
    case Direction.Down:
      return tempSquareList.filter(
        (s) => s.x === prevHead.x + 1 && s.y === prevHead.y
      )[0];
  }
}

function SnakeGrid() {
  const [squareList, setSquareList] = useState(() => getInitGrid(16));
  const [gamePaused, setGamePaused] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [headDirection, setHeadDirection] = useState<Direction>(Direction.Left);
  const [tempDirection, setTempDirection] = useState<Direction>(Direction.Left);
  const [fruitNum, setFruitNum] = useState(Math.ceil(Math.random() * 3));
  const [lastTimestamp, setLastTimestamp] = useState(0);
  const [frameTime, setFrameTime] = React.useState(performance.now());

  function updateHeadDirection(key: string) {
    switch (key) {
      case "ArrowLeft":
        if (headDirection !== Direction.Right) {
          setTempDirection(Direction.Left);
        }
        break;
      case "ArrowRight":
        if (headDirection !== Direction.Left) {
          setTempDirection(Direction.Right);
        }
        break;
      case "ArrowDown":
        if (headDirection !== Direction.Up) {
          setTempDirection(Direction.Down);
        }
        break;
      case "ArrowUp":
        if (headDirection !== Direction.Down) {
          setTempDirection(Direction.Up);
        }
        break;
      case " ":
        setGamePaused(!gamePaused);
        break;
      default:
        break;
    }
  }

  useEffect(() => {
    let frameId: number;
    const frame = (time: number) => {
      setFrameTime(time);
      frameId = requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
    return () => cancelAnimationFrame(frameId);
  }, []);

  useEffect(() => {
    function gameLoop() {
      if (!gamePaused && !gameOver) {
        let tempSquareList = structuredClone(squareList);
        let prevHead = tempSquareList.filter((s) => s.head)[0];
        let prevBody = tempSquareList.filter((s) => s.bodyPos > 0);
        prevHead.head = false;
        setHeadDirection(tempDirection);
        const nextHead = getNextSquare(tempSquareList, prevHead, tempDirection);
        if (nextHead === undefined || prevBody.includes(nextHead)) {
          setGameOver(true);
          const bounceSound = new Audio(`./sounds/bounce.mp3`);
          bounceSound.play();
        } else {
          nextHead.head = true;
          prevHead.bodyPos = 1;
          prevBody.forEach((s) => s.bodyPos++);
          if (nextHead.fruit) {
            setFruitNum(updateFruit(tempSquareList));
            setScore(score + 1);
          } else {
            let tail = findTail(tempSquareList);
            if (tail) {
              tail.bodyPos = 0;
            }
          }
          setSquareList(tempSquareList);
        }
      }
    }
    if (frameTime - lastTimestamp >= 75) {
      setLastTimestamp(frameTime);
      gameLoop();
    }
  }, [
    frameTime,
    lastTimestamp,
    gameOver,
    gamePaused,
    score,
    squareList,
    tempDirection,
  ]);

  function getInitGrid(size: number) {
    let initialSquareList: SnakeSquareType[] = [];
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        initialSquareList.push({
          x: i,
          y: j,
          bodyPos: 0,
          head: false,
          fruit: false,
        });
      }
    }
    const head = initialSquareList.filter((s) => s.x === 8 && s.y === 8)[0];
    let firstFruit = getSquare(
      initialSquareList,
      Math.floor(Math.random() * 16),
      Math.floor(Math.random() * 16)
    );
    while (firstFruit === head) {
      firstFruit = getSquare(
        initialSquareList,
        Math.floor(Math.random() * 16),
        Math.floor(Math.random() * 16)
      );
    }
    head.head = true;
    firstFruit.fruit = true;
    return initialSquareList;
  }

  return (
    <div>
      <h1>SNAKE</h1>
      {!gameOver && score > 0 ? <h2>FRUITS EATEN: {score}</h2> : <div></div>}
      <div
        className="Grid"
        onKeyDown={(event) => {
          event.preventDefault();
          updateHeadDirection(event.key);
        }}
        tabIndex={0}
      >
        {squareList.map((square, index) => (
          <SnakeSquare
            key={index}
            square={square}
            fruitNum={fruitNum}
            headDirection={headDirection}
          />
        ))}
      </div>
      {gameOver ? <SnakeGameOver score={score} /> : <div></div>}
    </div>
  );
}

export default SnakeGrid;
