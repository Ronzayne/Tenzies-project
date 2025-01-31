import { useState, useRef, useEffect } from "react";
import Die from "./Die";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
function App() {
  const [dice, setDice] = useState(() => generateAllNewDice());
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(null);
  const [rolls, setRolls] = useState(20);

  const buttonRef = useRef(null);

  function time() {
    setIsRunning(true);
  }
  function resetTimerAndRolls() {
    setTimer(0);
    setRolls(20);
  }
  function generateAllNewDice() {
    const newDice = [];
    for (let i = 0; i < 10; i++) {
      const randomNumber = Math.floor(Math.random() * 6) + 1;

      newDice.push({
        value: randomNumber,
        isHeld: false,
        id: nanoid(),
      });
    }
    return newDice;
  }

  function hold(id) {
    setDice((oldDice) =>
      oldDice.map((die) => {
        return id === die.id ? { ...die, isHeld: !die.isHeld } : die;
      })
    );
  }

  const gameWon =
    dice.every((die) => die.isHeld) &&
    dice.every((die) => die.value === dice[0].value);

  const notWonYet = !gameWon && dice.every((die) => die.isHeld);

  useEffect(() => {
    if (!isRunning) return;

    const intervalId = setInterval(() => {
      setTimer((prevVal) => prevVal + 1);
    }, 1000);
    console.log("Effect run ");
    return () => clearInterval(intervalId);
  }, [isRunning]);

  const gameOver = !rolls;

  useEffect(() => {
    if (gameWon || gameOver) {
      buttonRef.current.focus();
      setIsRunning(false);
    }
    console.log("gamewon effect rendered");
  }, [gameWon, isRunning, gameOver]);

  function rollDice() {
    if (!gameWon && !gameOver) {
      setDice((prevVal) =>
        prevVal.map((el) =>
          el.isHeld ? el : { ...el, value: Math.floor(Math.random() * 6) + 1 }
        )
      );
    } else {
      setDice(generateAllNewDice());
    }
    setRolls((prevVal) => prevVal - 1);
  }

  const diceElement = dice.map((dieObj) => (
    <Die
      key={dieObj.id}
      number={dieObj.value}
      isHeld={dieObj.isHeld}
      heldValue={() => hold(dieObj.id)}
      timer={time}
      gameWon={gameWon}
      gameOver={gameOver}
    />
  ));
  const { width, height } = useWindowSize();
  return (
    <>
      <main>
        {gameWon ? (
          <Confetti
            width={width}
            height={height}
            numberOfPieces={1500}
            recycle={false}
          />
        ) : null}
        <div className="sr-only">
          {gameWon && (
            <p>Congratulations! You wan Press "New Game" to start again.</p>
          )}
        </div>
        <h1 className="title">Tenzies</h1>

        {gameOver ? (
          <p className="game-over">
            <b>Game Over !</b> <br />
            <i>No rolls left</i>
          </p>
        ) : notWonYet ? (
          <p className="instructions">
            All held dice must be the same value to win❗
          </p>
        ) : gameWon ? (
          <div className="you-won">
            <h3>
              Congratulations
              <br />
              You won!
            </h3>
          </div>
        ) : (
          <p className="instructions">
            Roll until all dice are the same. Click each die to hold it at its
            current value.
          </p>
        )}
        <div className="die-container">{diceElement}</div>
        <div className="roll-timer">
          <p className="timer">Time:{timer}s</p>
          <p className="rolls">Rolls left:{rolls}</p>
        </div>
        {gameWon || gameOver ? (
          <button
            ref={buttonRef}
            className="roll-dice"
            onClick={() => {
              rollDice();
              resetTimerAndRolls();
            }}
          >
            New Game
          </button>
        ) : (
          <button
            onClick={() => {
              rollDice();
              time();
            }}
            className="roll-dice"
          >
            Roll
          </button>
        )}
      </main>
    </>
  );
}

export default App;
