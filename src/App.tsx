import { useEffect, useRef, useState } from "react";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import "./App.css";
import Footer from "./components/Footer";
import Header from "./components/Header";

function App() {
  const [messages, setMessages] = useState<
    { sender: string; message: string }[]
  >([]);
  const [isJoined, setIsJoined] = useState<boolean>(false);
  const [userCount, setUserCount] = useState<number>(0);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const chatInputRef = useRef<HTMLInputElement | null>(null);
  const joinInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // Connect to WebSocket server
    socketRef.current = new WebSocket("wss://messenger-websocket-server.glitch.me");
    if (socketRef.current == null) {
      alert("WebSocket connection failed.");
      return;
    }
    // Handle incoming messages
    socketRef.current.onmessage = (e) => {
      const message = JSON.parse(e.data);
      if (message.type === "chat") {
        setMessages((prev) => [...prev, message.payload]);
      } else if (message.type === "userCount") {
        setUserCount(message.payload.count);
      }
    };

    // Cleanup WebSocket connection
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  const handleSend = () => {
    console.log(chatInputRef.current?.value);
    const chatMessage = chatInputRef.current?.value as string;
    try {
      if (chatMessage.trim() && socketRef.current != null) {
        socketRef.current.send(
          JSON.stringify({
            type: "chat",
            payload: {
              message: chatMessage,
            },
          })
        );
        if (chatInputRef.current != null) {
          chatInputRef.current.value = "";
        }
      }
    } catch (e) {
      alert("Error while sending message in room");
      console.log(e);
    }
  };

  const handleJoin = () => {
    console.log(joinInputRef.current?.value);
    const roomId = joinInputRef.current?.value as string;
    try {
      if (roomId.trim() && socketRef.current != null) {
        socketRef.current.send(
          JSON.stringify({
            type: "join",
            payload: {
              roomId: roomId,
            },
          })
        );
        setIsJoined(true);
      }
    } catch (e) {
      alert("Error while joining room");
      console.log(e);
    }
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    if (chatInputRef.current) {
      chatInputRef.current.value += emojiData.emoji; // Append emoji to the input
    }
    setShowEmojiPicker(!showEmojiPicker);
  };

  return (
    <>
    
    <div className="min-h-screen bg-blue-100 flex flex-col items-center justify-center">
    <Header />
      <div className="w-11/12 max-w-md flex flex-col bg-white shadow-lg rounded-lg">
        <div className="flex items-center justify-between bg-gradient-to-r from-indigo-500 via-purple-500 to-rose-500 text-white rounded-ee-2xl px-4 py-2">
          <h1 className="text-lg font-bold">Messenger App</h1>
          {isJoined && (
            <span>
              {userCount}/{userCount}
            </span>
          )}
        </div>
        {!isJoined && (
          <div className="flex items-center p-2 border-t-white border-gray-300">
            <input
              type="text"
              className="flex-1 px-4 py-2 border bg-gradient-to-r from-blue-50 to-rose-100 border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-rose-300"
              placeholder="Enter Room Id..."
              ref={joinInputRef}
            />
            <button
              className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300"
              onClick={handleJoin}
            >
              Join
            </button>
          </div>
        )}
        {isJoined && (
          <>
            <div
              className="flex-1 p-4 max-h-[60vh] overflow-y-auto bg-gradient-to-r from-blue-50 to-white mt-1"
            >
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.sender === "ME" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`px-4 py-2 my-1 ${
                      msg.sender === "ME"
                        ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-s-xl rounded-se-xl"
                        : "bg-gradient-to-r from-indigo-400 to-purple-500 text-gray-800 rounded-e-xl rounded-es-xl"
                    }`}
                  >
                    {msg.sender === "ME"
                      ? `${msg.message}`
                      : `${msg.sender}: ${msg.message}`}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center p-2 border-t border-gray-300 relative">
              {/* Emoji Picker Toggle Button */}
              <button
                className="sm:block hidden px-4 py-2 mr-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                >
                😀
              </button>
              {/* Emoji Picker */}
              {showEmojiPicker && (
                <div className="absolute left-10 bottom-14">
                  <EmojiPicker
                    onEmojiClick={handleEmojiClick}
                    width={300}
                    height={400}
                  />
                </div>
              )}
              <div className="flex-1 flex items-center">
                <input
                  type="text"
                  className="min-w-0 flex-1 px-4 py-2 border bg-gradient-to-r from-blue-50 to-rose-100 border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                  placeholder="Type a message..."
                  ref={chatInputRef}
                />
                <button
                  className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300"
                  onClick={handleSend}
                >
                  Send
                </button>
              </div>
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
    </>
  );
}

export default App;
