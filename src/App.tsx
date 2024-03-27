import React from "react";
import Modal from "./components/Modal";

function App() {
  const [start, setStart] = React.useState<boolean>(false);
  const [modalOpen, setModalOpen] = React.useState<boolean>(true);
  const [name, setName] = React.useState<string>("Anonymous");
  const [socket, setSocket] = React.useState<WebSocket | null>(null);
  const canvas = React.useRef<HTMLCanvasElement>(null);
  const onmessage = function (evt: MessageEvent) {
    // Code to handle incoming message
    console.log(evt);
  };
  React.useEffect(() => {
    if (start) {
      // Code to execute when start is true
      let socket = new WebSocket("ws://localhost:3000/upgrade");
      socket.onmessage = onmessage;
      setSocket(socket);
    }
  }, [start]);
  return (
    <div className="App">
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        Chimldren
      </Modal>
      <canvas className="Game" ref={canvas} width={1000} height={750}></canvas>
    </div>
  );
}

export default App;
