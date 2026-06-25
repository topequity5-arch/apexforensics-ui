/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../hooks/useSocket";
import { apiService } from "../services/api";
import { Send, Terminal, ArrowDown } from "lucide-react";

export const ChatRoom = ({
  threadId,
  claimId,
}: {
  threadId: string;
  claimId: string;
}) => {
  const { token, user } = useAuth();
  const { getSocket, connected } = useSocket(token, threadId);

  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [hasUnread, setHasUnread] = useState(false);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Native Web Audio API Sound Generator (No external dependencies, files, or strings)
  const playNotificationSound = () => {
    try {
      const audioCtx = new (
        window.AudioContext || (window as any).webkitAudioContext
      )();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5 note

      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        audioCtx.currentTime + 0.15,
      ); // Quick decay

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.15);
    } catch (err) {
      console.warn("Web Audio engine playback dropped:", err);
    }
  };

  const checkIfScrolledToBottom = () => {
    if (!containerRef.current) return true;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    // Returns true if user is within 100px of the bottom floor
    return scrollHeight - scrollTop - clientHeight < 100;
  };

  useEffect(() => {
    if (token) {
      apiService
        .getMessages(token, threadId)
        .then((data) => {
          setMessages(data);
          setHasUnread(false);
        })
        .catch((err) => console.error(err));
    }
  }, [threadId, token]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    socket.on("messageReceived", (newMsg) => {
      const isAtBottom = checkIfScrolledToBottom();

      // Strict fallback lookups parsing every possible ID key configuration format
      const incomingSenderId =
        newMsg.sender_id ||
        newMsg.senderId ||
        newMsg.userId ||
        newMsg.sender?.id ||
        newMsg.user?.id;

      const isOwn = String(incomingSenderId) === String(user?.id);

      setMessages((prev) => [...prev, newMsg]);

      // Only trigger notification effects if the message came from an external participant
      if (!isOwn) {
        playNotificationSound();

        if (!isAtBottom) {
          setHasUnread(true);
        }
      }
    });

    return () => {
      socket.off("messageReceived");
    };
  }, [getSocket, threadId, user]);

  useEffect(() => {
    // Force view down instantly if we are actively tracking the bottom line
    if (!hasUnread) {
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, hasUnread]);

  const handleManualScrollToBottom = () => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    setHasUnread(false);
  };

  const dispatchMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const socket = getSocket();
    if (!text.trim() || !socket) return;

    socket.emit("sendMessage", {
      claimId,
      threadId,
      message: text,
    });
    setText("");
    setHasUnread(false);
  };

  return (
    <div className="flex flex-col h-[550px] bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm relative">
      <div className="bg-slate-50 border-b border-slate-200 px-5 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2 text-slate-700">
          <Terminal size={16} />
          <span className="text-xs font-bold uppercase tracking-wider">
            WebSocket Session Tunnel
          </span>
        </div>
        <span
          className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1.5 ${
            connected
              ? "bg-emerald-50 text-emerald-700"
              : "bg-amber-50 text-amber-700"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${connected ? "bg-emerald-500" : "bg-amber-500"}`}
          />
          {connected ? "Sync Active" : "Connecting"}
        </span>
      </div>

      <div
        ref={containerRef}
        onScroll={() => {
          if (checkIfScrolledToBottom()) {
            setHasUnread(false);
          }
        }}
        className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/20"
      >
        {messages.map((msg, index) => {
          const senderId =
            msg.sender_id ||
            msg.senderId ||
            msg.userId ||
            msg.sender?.id ||
            msg.user?.id;
          const isOwn = String(senderId) === String(user?.id);

          const senderRole =
            msg.sender_role || msg.role || (isOwn ? user?.role : null);
          const isAdminMsg = senderRole === "admin" || senderRole === "ADMIN";

          return (
            <div
              key={msg.id || index}
              className={`flex flex-col ${isOwn ? "items-end" : "items-start"}`}
            >
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1 px-1">
                {isOwn
                  ? "You"
                  : isAdminMsg
                    ? "Support Agent (Admin)"
                    : "Client"}
              </span>

              <div
                className={`max-w-[75%] rounded-xl px-4 py-2.5 text-sm ${
                  isOwn
                    ? "bg-slate-950 text-white rounded-br-none"
                    : isAdminMsg
                      ? "bg-slate-100 border border-slate-200 text-slate-900 rounded-bl-none"
                      : "bg-blue-50 border border-blue-100 text-slate-900 rounded-bl-none"
                }`}
              >
                <p className="leading-relaxed whitespace-pre-wrap">
                  {msg.message || msg.text}
                </p>
                <span className="block text-[9px] mt-1 text-right text-slate-400">
                  {msg.created_at || msg.createdAt
                    ? new Date(
                        msg.created_at || msg.createdAt,
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ""}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={scrollRef} />
      </div>

      {/* Floating Notification HUD Banner Overlay */}
      {hasUnread && (
        <button
          onClick={handleManualScrollToBottom}
          className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-full shadow-lg flex items-center gap-1.5 transition-all animate-bounce z-50"
        >
          <ArrowDown size={12} />
          New message received below
        </button>
      )}

      <form
        onSubmit={dispatchMessage}
        className="p-3 border-t border-slate-200 bg-white flex gap-2"
      >
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type message response..."
          className="flex-1 text-sm px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900 transition-colors"
        />
        <button
          type="submit"
          className="bg-slate-950 hover:bg-slate-800 text-white px-4 rounded-xl flex items-center justify-center transition-colors"
        >
          <Send size={14} />
        </button>
      </form>
    </div>
  );
};
