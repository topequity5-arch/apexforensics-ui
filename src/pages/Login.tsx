/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Loader2, ArrowLeft } from "lucide-react"; // Import ArrowLeft

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const showToast = (
    message: string,
    type: "success" | "error" = "success",
  ) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("https://apexforensics-api.onrender.com/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error("Invalid authorization credentials.");

      const data = await res.json();
      login(data);

      const role = data?.user?.app_metadata?.role || "client";
      navigate(role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      setIsLoading(false);
      showToast(
        `Authorization failed. Please check your credentials.`,
        "error",
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-100">
      {/* Back to Home Link */}
      <button
        onClick={() => navigate("/")}
        className="mb-8 flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors text-xs font-bold uppercase tracking-widest"
      >
        <ArrowLeft size={16} />
        Back to Landing Page
      </button>

      <form
        onSubmit={handleAuth}
        className="bg-white p-8 border border-slate-200 rounded-2xl max-w-sm w-full space-y-4 shadow-sm"
      >
        <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">
          System Login
        </h3>
        <input
          type="email"
          placeholder="Email Address"
          required
          disabled={isLoading}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full text-sm p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-950 disabled:bg-slate-50 disabled:opacity-50"
        />
        <input
          type="password"
          placeholder="Password Hash"
          required
          disabled={isLoading}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full text-sm p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-950 disabled:bg-slate-50 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-slate-950 text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 disabled:bg-slate-600"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" size={16} />
              Authorizing...
            </>
          ) : (
            "Access Console"
          )}
        </button>

        <p className="text-center text-[11px] text-slate-500 font-medium">
          New to the system?{" "}
          <button
            type="button"
            onClick={() => navigate("/register")}
            disabled={isLoading}
            className="text-slate-900 font-bold hover:underline"
          >
            Create Account
          </button>
        </p>
      </form>

      {/* Toast Notification System */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full bg-white border border-slate-200/80 rounded-xl p-4 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-300 flex items-start gap-3">
          <div
            className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${toast.type === "success" ? "bg-emerald-500" : "bg-rose-500"}`}
          />
          <div className="flex-1">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
              {toast.type === "success" ? "System Success" : "Execution Halted"}
            </p>
            <p className="text-xs font-medium text-slate-700 leading-relaxed">
              {toast.message}
            </p>
          </div>
          <button
            onClick={() => setToast(null)}
            className="text-slate-400 hover:text-slate-600 font-mono text-[10px] px-1 rounded hover:bg-slate-50 transition-colors"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};
