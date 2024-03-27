import React from "react";
import Modal from "./components/Modal";
import Paddle from "./components/Paddle";
import Ball from "./components/Ball";

function App() {
  const [start, setStart] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [modalOpen, setModalOpen] = React.useState<boolean>(true);
  const [name, setName] = React.useState<string>("Anonymous");
  const [socket, setSocket] = React.useState<WebSocket | null>(null);

  const [paddleA, setPaddleA] = React.useState<Paddle | null>(null);
  const [paddleB, setPaddleB] = React.useState<Paddle | null>(null);
  const [ball, setBall] = React.useState<Ball | null>(null);

  const canvas = React.useRef<HTMLCanvasElement>(null);
  React.useEffect(() => {
    draw();
  }, [paddleA, paddleB, ball]);
  const draw = () => {
    if (canvas.current) {
      const ctx = canvas.current.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.current.width, canvas.current.height);
        if (paddleA) {
          paddleA.draw(ctx);
        }
        if (paddleB) {
          paddleB.draw(ctx);
        }
        if (ball) {
          ball.draw(ctx);
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
        console.log(message.game.PlayerA);
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
        };
        socket.send(JSON.stringify(message));
        const paddleA = new Paddle(25, 100, 937.5, 325);
        const paddleB = new Paddle(25, 100, 37.5, 325);
        const ball = new Ball(10, 500, 375);
        setPaddleA(paddleA);
        setPaddleB(paddleB);
        setBall(ball);
      };
      setSocket(socket);
      setLoading(false);
      setModalOpen(false);
    }
  }, [start]);

  return (
    <div className="App">
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
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
        {loading && <div className="spinner">SPIN BABY</div>}
      </Modal>
      <canvas className="Game" ref={canvas} width={1000} height={750}></canvas>
    </div>
  );
}

export default App;
