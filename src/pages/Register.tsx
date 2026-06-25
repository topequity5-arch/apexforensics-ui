import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react"; // Make sure to install lucide-react

export const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false); // 1. Added loading state
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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); // 2. Start loading

    try {
      const res = await fetch("https://apexforensics-api.onrender.com/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, fullName, phone }),
      });

      if (!res.ok) throw new Error("Registration failed.");

      showToast("Account initialized successfully.", "success");

      // Delay navigation slightly so user sees the success toast
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      showToast(`Registration requirements rejected. ${err}`, "error");
      setIsLoading(false); // Stop loading on error
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-100">
      <form
        onSubmit={handleRegister}
        className="bg-white p-8 border border-slate-200 rounded-2xl max-w-sm w-full space-y-4 shadow-sm"
      >
        <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">
          Create Identity
        </h3>

        <input
          type="text"
          placeholder="Full Identity Name"
          required
          disabled={isLoading}
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full text-sm p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-950 disabled:opacity-50"
        />

        <input
          type="email"
          placeholder="Email Address"
          required
          disabled={isLoading}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full text-sm p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-950 disabled:opacity-50"
        />

        <input
          type="tel"
          placeholder="Phone Number (e.g. +234...)"
          required
          disabled={isLoading}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full text-sm p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-950 disabled:opacity-50"
        />

        <input
          type="password"
          placeholder="Secure Password"
          required
          disabled={isLoading}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full text-sm p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-950 disabled:opacity-50"
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-slate-950 text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 disabled:bg-slate-500"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" size={16} />
              Initializing...
            </>
          ) : (
            "Register Profile"
          )}
        </button>

        <p className="text-center text-[11px] text-slate-500 font-medium">
          Already have an identity?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            disabled={isLoading}
            className="text-slate-900 font-bold hover:underline"
          >
            Sign In
          </button>
        </p>
      </form>

      {/* Toast Notification System */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full bg-white border border-slate-200/80 rounded-xl p-4 shadow-xl flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2">
          <div
            className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${toast.type === "success" ? "bg-emerald-500" : "bg-rose-500"}`}
          />
          <div className="flex-1">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
              {toast.type === "success" ? "System Success" : "Execution Halted"}
            </p>
            <p className="text-xs font-medium text-slate-700">
              {toast.message}
            </p>
          </div>
          <button
            onClick={() => setToast(null)}
            className="text-slate-400 hover:text-slate-600"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};
