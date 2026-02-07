import { Toaster } from "react-hot-toast";
import { Chat } from "./components/Chat";
import "./App.css";

function App() {
  return (
    <div className="app">
      <Toaster position="top-center" reverseOrder={false} />
      <h1>Let's Chat</h1>
      <Chat />
    </div>
  );
}

export default App;
