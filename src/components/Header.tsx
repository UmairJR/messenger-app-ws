import { useEffect, useState } from "react";

const Header = () => {
  const [time, setTime] = useState(new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }));
    }, 1000);

    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  return (
    <header className="flex top-0 fixed items-center justify-between bg-gradient-to-r from-indigo-600/70 via-blue-500/50 to-indigo-400/50 text-white px-6 py-3 shadow-lg w-full">
      {/* Title */}
      <h1 className="text-2xl sm:text-3xl font-extrabold tracking-wide drop-shadow-lg">
        ChatShat
      </h1>

      {/* Clock */}
      <div className="flex items-center gap-2 text-lg sm:text-xl font-medium bg-white/50 text-indigo-700 px-3 py-1 rounded-md shadow-md">
        
        <span>{time}</span>
      </div>
    </header>
  );
};

export default Header;
