import { useEffect, useState, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";

export const useSocket = (token: string | null, threadId?: string | null) => {
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Globally requires a token, but threadId is now optional
    if (!token) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      setTimeout(() => setConnected(false), 0);
      return;
    }

    const socketInstance = io("https://apexforensics-api.onrender.com/chat", {
      transports: ["websocket"],
      forceNew: true,
      auth: {
        // Pass the raw token directly so your split('.')[1] statement works perfectly
        token: token,
      },
      query: {
        token: token,
      },
    });

    socketInstance.on("connect", () => {
      setConnected(true);
      // Only join a specific room tunnel if it is provided
      if (threadId) {
        socketInstance.emit("joinThread", { threadId });
      }
    });

    socketInstance.on("disconnect", () => setConnected(false));

    socketRef.current = socketInstance;

    return () => {
      socketInstance.off("connect");
      socketInstance.off("disconnect");
      socketInstance.disconnect();
      socketRef.current = null;
    };
  }, [token, threadId]); // Listens for shifts in either token or active room threads

  const getSocket = useCallback(() => socketRef.current, []);

  return { getSocket, connected };
};
