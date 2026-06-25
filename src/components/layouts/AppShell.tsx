import { useNavigate } from "react-router-dom";
import { LogOut, Shield } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export const AppShell = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 px-8 h-16 flex justify-between items-center">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <div className="bg-slate-950 text-white p-1.5 rounded-lg">
            <Shield size={18} />
          </div>
          <span className="font-black text-lg text-slate-900 tracking-tight">
            ApexForensics
          </span>
        </div>

        <div className="flex items-center gap-6">
          <span className="text-xs bg-slate-100 px-3 py-1.5 rounded-lg text-slate-600 font-semibold uppercase tracking-wider">
            {user?.role === "admin" ? "🛡️ Admin Context" : "👤 Client Session"}
          </span>
          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="text-slate-400 hover:text-slate-900 transition-colors"
          >
            <LogOut size={18} />
          </button>
        </div>
      </nav>
      <main className="flex-1 max-w-7xl w-full mx-auto p-8">{children}</main>
    </div>
  );
};
