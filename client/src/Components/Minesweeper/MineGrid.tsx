import React, { useState, useEffect } from "react";
import MineSquare from "./MineSquare";
import { MineSquareType } from "../../Types";
import MineGameOver from "./MineGameOver";

function getFlagsLeft(squareList: MineSquareType[]) {
  return 40 - squareList.filter((s) => s.flagged).length;
}

function getSquare(x: number, y: number, list: MineSquareType[]) {
  return list.filter((s) => s.x === x && s.y === y)[0];
}

function getTime(timer: number) {
  const minutes = Math.floor(timer / 60);
  const minutesStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
  const seconds = timer % 60;
  const secondsStr = seconds < 10 ? `0${seconds}` : `${seconds}`;
  return `${minutesStr}:${secondsStr}`;
}

function getInitGrid(size: number) {
  let initialSquareList: MineSquareType[] = [];
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      initialSquareList.push({
        x: i,
        y: j,
        adjacentBombs: 0,
        flipped: false,
        flagged: false,
        bomb: false,
        hovered: false,
      });
    }
  }
  for (let i = 0; i < 40; i++) {
    let randX = Math.floor(Math.random() * size);
    let randY = Math.floor(Math.random() * size);
    let randSquare = getSquare(randX, randY, initialSquareList);
    while (randSquare.bomb) {
      randX = Math.floor(Math.random() * size);
      randY = Math.floor(Math.random() * size);
      randSquare = getSquare(randX, randY, initialSquareList);
    }
    randSquare.bomb = true;
  }
  initialSquareList.forEach((ps) => {
    const adjacentSquares = initialSquareList.filter(
      (ss) =>
        Math.abs(ps.x - ss.x) <= 1 &&
        Math.abs(ps.y - ss.y) <= 1 &&
        !(ps.x === ss.x && ps.y === ss.y)
    );
    adjacentSquares.forEach((ss) => {
      if (ss.bomb) ps.adjacentBombs++;
    });
  });
  return initialSquareList;
}

function gridRightClickUpdate(
  gameOver: boolean,
  firstSquareClicked: boolean,
  squareList: MineSquareType[],
  x: number,
  y: number
) {
  if (!gameOver && firstSquareClicked) {
    const clickedSquare = getSquare(x, y, squareList);
    if (clickedSquare.flagged) {
      clickedSquare.flagged = false;
    } else {
      if (getFlagsLeft(squareList) > 0) {
        clickedSquare.flagged = true;
      }
    }
  }
  return squareList;
}

function getAdjacentSquaresToFlip(
  squareList: MineSquareType[],
  x: number,
  y: number
) {
  let toFlip: MineSquareType[] = [];
  const pivotSquare = getSquare(x, y, squareList);
  if (!pivotSquare.bomb) {
    toFlip.push(pivotSquare);
    pivotSquare.flipped = true;
    if (pivotSquare.adjacentBombs === 0) {
      const adjacentSquares = squareList.filter(
        (s) =>
          !s.flipped &&
          Math.abs(pivotSquare.x - s.x) <= 1 &&
          Math.abs(pivotSquare.y - s.y) <= 1 &&
          !(pivotSquare.x === s.x && pivotSquare.y === s.y)
      );
      adjacentSquares.forEach((s) => {
        toFlip = [...toFlip, ...getAdjacentSquaresToFlip(squareList, s.x, s.y)];
      });
    }
  }
  return toFlip;
}

function MineGrid() {
  const [squareList, setSquareList] = useState(() => getInitGrid(16));
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [firstSquareClicked, setFirstSquareClicked] = useState(false);
  const [timer, setTimer] = useState(0);
  const [finalTime, setFinalTime] = useState("");

  const flagsLeft = getFlagsLeft(squareList);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(timer + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  function endGame(gameWon: boolean) {
    if (gameWon) {
      setGameOver(true);
      setGameWon(true);
      const victorySound = new Audio(`./sounds/victory.mp3`);
      victorySound.play();
    } else {
      setGameOver(true);
    }
    setFinalTime(getTime(timer));
  }

  if (gameOver === false && gameWon === false) {
    if (squareList.filter((s) => !s.bomb && !s.flipped).length === 0) {
      endGame(true);
    }

    if (squareList.filter((s) => s.bomb && s.flipped).length > 0) {
      endGame(false);
    }
  }

  return (
    <div>
      <h1>MINESWEEPER</h1>
      <h2>{flagsLeft} BOMBS UNMARKED</h2>
      <div className="Grid">
        {squareList.map((square, index) => (
          <MineSquare
            key={index}
            square={square}
            leftClick={(x: number, y: number) => {
              if (!gameOver) {
                let tempList = [...squareList];
                let clickedSquare = getSquare(x, y, tempList);
                if (clickedSquare.flagged) {
                  return;
                }
                if (!firstSquareClicked) {
                  while (clickedSquare.bomb) {
                    tempList = getInitGrid(16);
                    clickedSquare = getSquare(x, y, tempList);
                  }
                  setFirstSquareClicked(true);
                  setTimer(0);
                }
                clickedSquare.flipped = true;
                if (clickedSquare.bomb) {
                  const bombSound = new Audio(`./sounds/explosion.mp3`);
                  bombSound.play();
                } else {
                  getAdjacentSquaresToFlip(tempList, x, y).forEach(
                    (s) => (getSquare(s.x, s.y, tempList).flipped = true)
                  );
                }
                setSquareList([...tempList]);
              }
            }}
            rightClick={(x: number, y: number) =>
              setSquareList([
                ...gridRightClickUpdate(
                  gameOver,
                  firstSquareClicked,
                  squareList,
                  x,
                  y
                ),
              ])
            }
          />
        ))}{" "}
      </div>
      {firstSquareClicked && !gameOver ? (
        <h2>TIME ELAPSED: {getTime(timer)}</h2>
      ) : (
        <div></div>
      )}
      {gameOver ? (
        <MineGameOver gameWon={gameWon} finalTime={finalTime} />
      ) : (
        <div></div>
      )}
    </div>
  );
}

export default MineGrid;
