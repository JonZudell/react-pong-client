import React from "react";
import Modal from "./components/Modal";
import Paddle from "./components/Paddle";
import Ball from "./components/Ball";

function App() {
  const [start, setStart] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [win, setWin] = React.useState<boolean>(false);
  const [lose, setLose] = React.useState<boolean>(false);
  const [modalOpen, setModalOpen] = React.useState<boolean>(true);
  const [name, setName] = React.useState<string>("Anonymous");
  const [socket, setSocket] = React.useState<WebSocket | null>(null);
  const [started, setStarted] = React.useState<boolean>(false);

  const [playerAName, setPlayerAName] = React.useState<string | null>(null);
  const [playerBName, setPlayerBName] = React.useState<string | null>(null);

  const [paddleA, setPaddleA] = React.useState<Paddle | null>(null);
  const [paddleB, setPaddleB] = React.useState<Paddle | null>(null);

  const [scoreA, setScoreA] = React.useState<number | null>(null);
  const [scoreB, setScoreB] = React.useState<number | null>(null);

  const [ball, setBall] = React.useState<Ball | null>(null);

  const canvas = React.useRef<HTMLCanvasElement>(null);
  React.useEffect(() => {
    draw();
  }, [paddleA, paddleB, ball, scoreA, scoreB, win, lose, playerAName, playerBName, loading, started]);
  React.useEffect(() => {
    document.addEventListener("keyup", function (event) {
      if (event.key === "w") {
        if (socket) {
          socket.send(
            '{"type" : "input", "input" : "up", "status" : "released"}'
          );
        }
      }
      if (event.key === "s") {
        if (socket) {
          socket.send(
            '{"type" : "input", "input" : "down", "status" : "released"}'
          );
        }
      }
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "w") {
        if (socket) {
          socket.send('{"type" : "input", "input" : "up", "status" : "down"}');
        }
      }
      if (event.key === "s") {
        if (socket) {
          socket.send(
            '{"type" : "input", "input" : "down", "status" : "down"}'
          );
        }
      }
    });
  });
  const draw = () => {
    if (canvas.current) {
      const ctx = canvas.current.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.current.width, canvas.current.height);
        if (loading) {
          const loadingText = "Loading...";
          const loadingTextWidth = ctx.measureText(loadingText).width;
          ctx.font = "30px Arial";
          ctx.fillStyle = "white";
          ctx.fillText(
            loadingText,
            canvas.current.width / 2 - loadingTextWidth / 2,
            canvas.current.height / 2
          );
        }
        if (started) {
          if (paddleA) {
            paddleA.draw(ctx);
          }
          if (paddleB) {
            paddleB.draw(ctx);
          }
          if (ball) {
            ball.draw(ctx);
          }
          if (scoreA !== null && scoreB !== null) {
            ctx.font = "30px Arial";
            ctx.fillStyle = "white";
            ctx.fillText(scoreA.toString(), canvas.current.width / 2 - 50, 50);
            ctx.fillText(scoreB.toString(), canvas.current.width / 2 + 25, 50);
          }
          if (playerAName && playerBName) {
            ctx.font = "20px Arial";
            ctx.fillStyle = "white";
            ctx.fillText(playerAName, 20, 50);
            const playerBNameWidth = ctx.measureText(playerBName).width;
            ctx.fillText(
              playerBName,
              canvas.current.width - playerBNameWidth - 20,
              50
            );
          }
        }
        if (win) {
          ctx.font = "50px Arial";
          ctx.fillStyle = "white";
          const winText = "You Win!";
          const winTextWidth = ctx.measureText(winText).width;
          ctx.fillText(
            winText,
            canvas.current.width / 2 - winTextWidth / 2,
            canvas.current.height / 2
          );
        }
        if (lose) {
          ctx.font = "50px Arial";
          ctx.fillStyle = "white";
          const loseText = "You Lose!";
          const loseTextWidth = ctx.measureText(loseText).width;
          ctx.fillText(
            loseText,
            canvas.current.width / 2 - loseTextWidth / 2,
            canvas.current.height / 2
          );
        }
      }
    }
  };
  const onmessage = function (evt: MessageEvent) {
    var messages = evt.data.split("\n");
    for (var i = 0; i < messages.length; i++) {
      var item = document.createElement("div");
      item.innerText = messages[i];
      var message = JSON.parse(messages[i]);
      if (message["type"] === "gamestate") {
        setPaddleA(
          new Paddle(
            message.game.PlayerA.width,
            message.game.PlayerA.height,
            message.game.PlayerA.x,
            message.game.PlayerA.y
          )
        );
        setPaddleB(
          new Paddle(
            message.game.PlayerB.width,
            message.game.PlayerB.height,
            message.game.PlayerB.x,
            message.game.PlayerB.y
          )
        );
        setBall(
          new Ball(
            message.game.Ball.radius,
            message.game.Ball.x,
            message.game.Ball.y
          )
        );
        setScoreA(message.game.scoreA);
        setScoreB(message.game.scoreB);
      } else if (message["type"] === "begin") {
        setPlayerAName(message.playerAName);
        setPlayerBName(message.playerBName);
        setLoading(false);
        setStarted(true);
      } else if (message["type"] === "win") {
        setStarted(false);
        setWin(true);
      } else if (message["type"] === "lose") {
        setStarted(false);
        setLose(true);
      } else if (message["type"] === "reset") {
        setTimeout(() => {
          setLoading(true);
          setWin(false);
          setLose(false);
          setStart(false);
          setModalOpen(true);
        }, 3000);
      }
    }
  };

  React.useEffect(() => {
    if (start) {
      setLoading(true);
      // Code to execute when start is true
      let socket = new WebSocket("ws://localhost:3000/upgrade");

      socket.onmessage = onmessage;
      socket.onopen = function () {
        const message = {
          type: "ready",
          player: name,
        };
        socket.send(JSON.stringify(message));
        // const paddleA = new Paddle(25, 100, 937.5, 325);
        // const paddleB = new Paddle(25, 100, 37.5, 325);
        // const ball = new Ball(10, 500, 375);
        // setPaddleA(paddleA);
        // setPaddleB(paddleB);
        // setBall(ball);
      };
      setSocket(socket);
      setLoading(true);
      setModalOpen(false);
    }
  }, [start]);

  return (
    <div className="App">
      <Modal open={modalOpen} onClose={() => {setModalOpen(false); setLoading(true)}}>
        <h1 className="text-3xl font-bold mb-4">Welcome to Pong Roulette!</h1>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-gray-300 rounded-md px-4 py-2 mb-4"
        />
        <button
          onClick={() => setStart(true)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Start
        </button>
      </Modal>
      <canvas className="Game" ref={canvas} width={1000} height={750}></canvas>
    </div>
  );
}

export default App;
