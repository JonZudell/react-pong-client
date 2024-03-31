import React from "react";
function App() {
  const [socket, setSocket] = React.useState<WebSocket | null>(null);
 
  const onmessage = function (evt: MessageEvent) {
    console.log(evt.data);
    console.log(evt.type)
  };

  const canvas = React.useRef<HTMLCanvasElement>(null);
  React.useEffect(() => {
    // Code to execute when start is true
    let socket = new WebSocket("ws://0.0.0.0:3000/upgrade");

    socket.onmessage = onmessage;
    socket.onopen = function () {};
    socket.onclose = function () {
      console.log("socket closed");
    };
    socket.onerror = function () {
      console.log("socket error");
    };
    setSocket(socket);

    return () => {
      // Code to execute when the component is unmounted
      socket.close();
    };
  }, []);

  return (
    <div className="App">
      {/* <Modal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
        }}
      >
        <h1 className="text-3xl font-bold mb-4">Welcome to Pong Roulette!</h1>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-gray-300 rounded-md px-4 py-2 mb-4"
        />
        <button
          onClick={() => setReady(true)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Start
        </button>
      </Modal> 
      <canvas className="Game" ref={canvas} width={1000} height={750}></canvas>*/}
    </div>
  );
}

export default App;
