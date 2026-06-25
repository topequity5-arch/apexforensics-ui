import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Loader } from "../components/Loader";
import { ChatRoom } from "../components/ChatRoom";
import { apiService, type GetUsersParams } from "../services/api";
import {
  ShieldCheck,
  Activity,
  MessageSquare,
  Users,
  Search,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  X,
  User,
} from "lucide-react";
import { AppShell } from "../components/layouts/AppShell";

interface ClaimCreatorProfile {
  id: string;
  full_name?: string;
  email: string;
}

interface Claim {
  id: string;
  amount: number;
  status: string;
  description: string;
  dateCreated: string;
  client_id: string;
  profiles?: ClaimCreatorProfile; // 💎 The joined creator profile mapping
}

interface ChatThread {
  id: string;
  claim_id: string;
  complaint_title: string;
  complaint_description: string;
  status: string;
}

interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  role?: string;
  created_at: string;
}

export const AdminDashboard = () => {
  const { token } = useAuth();
  const [claims, setClaims] = useState<Claim[]>([]);
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadClaims, setUnreadClaims] = useState<Record<string, boolean>>({});

  // 💬 Modal Overlay Context Management
  const [activeContext, setActiveContext] = useState<{
    threadId: string;
    claimId: string;
    claimAmount: number;
  } | null>(null);

  // 👥 User List State Parameters
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [usersTotal, setUsersTotal] = useState(0);
  const [usersLoading, setUsersLoading] = useState(false);
  const [userFilters, setUserFilters] = useState<GetUsersParams>({
    page: 1,
    limit: 6,
    search: "",
    sortBy: "created_at",
    sortOrder: "desc",
  });

  const loadAdminMatrix = async () => {
    try {
      const claimsData = await apiService.getClaims(token!);
      const threadsData = await apiService.getThreads(token!);
      setClaims(claimsData);
      setThreads(threadsData);
    } catch (e) {
      console.error("Error synchronizing admin matrices:", e);
    }
  };

  // Base Data Synchronization Pipeline
  useEffect(() => {
    if (!token) return;
    let isMounted = true;
    const runSync = async () => {
      try {
        const claimsData = await apiService.getClaims(token);
        const threadsData = await apiService.getThreads(token);
        if (isMounted) {
          setClaims(claimsData);
          setThreads(threadsData);
        }
      } catch (e) {
        console.error("Failed running initial matrix loader:", e);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    runSync();
    return () => {
      isMounted = false;
    };
  }, [token]);

  // Consolidated Search and Filter Pipeline for Profiles Registry
  useEffect(() => {
    if (!token) return;
    let isMounted = true;

    const executeFetch = async () => {
      setUsersLoading(true);
      try {
        const usersData = await apiService.getUsers(token, userFilters);
        if (isMounted) {
          setUsers(usersData.data);
          setUsersTotal(usersData.total);
        }
      } catch (e) {
        console.error("Error synchronizing users map:", e);
      } finally {
        if (isMounted) setUsersLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(
      () => {
        executeFetch();
      },
      userFilters.search ? 400 : 0,
    );

    return () => {
      isMounted = false;
      clearTimeout(delayDebounceFn);
    };
  }, [
    token,
    userFilters.page,
    userFilters.sortBy,
    userFilters.sortOrder,
    userFilters.search,
    userFilters,
  ]);

  // Listen for incoming dynamic notifications
  useEffect(() => {
    const handleIncomingNotification = (e: Event) => {
      const { claimId } = (e as CustomEvent).detail;
      if (claimId !== activeContext?.claimId) {
        setUnreadClaims((prev) => ({ ...prev, [claimId]: true }));
      }
    };
    window.addEventListener("claimMessageReceived", handleIncomingNotification);
    return () => {
      window.removeEventListener(
        "claimMessageReceived",
        handleIncomingNotification,
      );
    };
  }, [activeContext?.claimId]);

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const showToast = (
    message: string,
    type: "success" | "error" = "success",
  ) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000); // Auto-dismiss after 4 seconds
  };

  const handleStatusShift = async (claimId: string, status: string) => {
    try {
      await apiService.updateClaim(token!, claimId, status);
      await loadAdminMatrix();
      showToast("Claim classification updated.", "success");
    } catch (err) {
      showToast(`Failed to modify claim classification rules: ${err}`, "error");
    }
  };

  const handleMountChatContext = (claim: Claim) => {
    const matchedThread = threads.find((t) => t.claim_id === claim.id);
    if (matchedThread) {
      setActiveContext({
        threadId: matchedThread.id,
        claimId: claim.id,
        claimAmount: claim.amount,
      });
      setUnreadClaims((prev) => ({ ...prev, [claim.id]: false }));
      window.dispatchEvent(new CustomEvent("resetUnreadCounter"));
    } else {
      showToast("No messaging context is bound to this ledger asset.", "error");
    }
  };

  const toggleSortOrder = (field: string) => {
    setUserFilters((prev) => ({
      ...prev,
      sortBy: field,
      sortOrder:
        prev.sortBy === field && prev.sortOrder === "asc" ? "desc" : "asc",
      page: 1,
    }));
  };

  const totalPages = Math.ceil(usersTotal / (userFilters.limit || 6));

  if (loading)
    return (
      <AppShell>
        <Loader />
      </AppShell>
    );

  return (
    <AppShell>
      {/* Upper Status Banner Section */}
      <div className="bg-slate-950 text-white p-6 rounded-2xl mb-8 flex items-center gap-3 shadow-sm">
        <div className="bg-white/10 p-2 rounded-xl">
          <ShieldCheck size={20} />
        </div>
        <div>
          <h2 className="text-base font-bold tracking-tight">
            System Administration Control Hub
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Unified overview tracking claims transactions and user registrations
            side by side.
          </p>
        </div>
      </div>

      {/* Main Split Interface View (2-Column Unified Screen) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LEFT COMPARTMENT: Claims Registry Column */}
        <div className="space-y-4">
          <div className="bg-white p-4 border border-slate-200 rounded-2xl flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider shadow-sm">
            <Activity size={14} /> Global Claims Ledger Portfolio (
            {claims.length})
          </div>

          <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2">
            {claims.map((claim) => {
              const hasUnread = unreadClaims[claim.id];
              return (
                <div
                  key={claim.id}
                  className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 transition-all relative hover:border-slate-300"
                >
                  {hasUnread && (
                    <span className="absolute top-6 right-6 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600"></span>
                    </span>
                  )}

                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[9px] font-black tracking-widest text-slate-400 uppercase">
                        CLAIM REFERENCE ID: {claim.id.slice(0, 8)}
                      </span>
                      <h3 className="text-2xl font-black text-slate-900 mt-0.5">
                        ${claim.amount.toLocaleString()}
                      </h3>
                    </div>
                    <select
                      value={claim.status}
                      onChange={(e) =>
                        handleStatusShift(claim.id, e.target.value)
                      }
                      className="bg-slate-50 border border-slate-200 rounded-xl p-1.5 px-3 text-[11px] font-bold text-slate-700 focus:outline-none"
                    >
                      <option value="pending">Pending</option>
                      <option value="under_review">Under Review</option>
                      <option value="recovered">Recovered</option>
                      <option value="failed">Failed</option>
                    </select>
                  </div>

                  {/* 👤 Embedded User Profile Attribution Block */}
                  <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl flex items-center gap-2.5">
                    <div className="bg-white p-1.5 rounded-lg border border-slate-200 text-slate-500">
                      <User size={14} />
                    </div>
                    <div className="truncate text-xs">
                      <p className="font-bold text-slate-800 truncate">
                        {claim.profiles?.full_name || "Anonymous User"}
                      </p>
                      <p className="text-[11px] font-mono text-slate-400 truncate">
                        {claim.profiles?.email || "No email profile metadata"}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                    {claim.description}
                  </p>

                  <div className="border-t border-slate-100 pt-3 flex justify-between items-center text-[11px] text-slate-400">
                    <span>
                      Registered:{" "}
                      {new Date(claim.dateCreated).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => handleMountChatContext(claim)}
                      className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
                        hasUnread
                          ? "bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100"
                          : "text-slate-900 bg-slate-50 hover:bg-slate-100"
                      }`}
                    >
                      <MessageSquare size={13} />
                      {hasUnread
                        ? "Open Alerts Workspace"
                        : "Launch Communication Modal"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COMPARTMENT: Profile Registries System Column */}
        <div className="space-y-4">
          <div className="bg-white p-4 border border-slate-200 rounded-2xl flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider shadow-sm">
            <Users size={14} /> Registered User Directories ({usersTotal})
          </div>

          <div className="bg-white p-5 border border-slate-200 rounded-2xl space-y-4 shadow-sm">
            <div className="relative flex items-center">
              <Search className="absolute left-3.5 text-slate-400" size={14} />
              <input
                type="text"
                placeholder="Query profiles list tracking criteria..."
                value={userFilters.search}
                onChange={(e) =>
                  setUserFilters((prev) => ({
                    ...prev,
                    search: e.target.value,
                    page: 1,
                  }))
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-xs focus:outline-none"
              />
            </div>

            <div className="flex gap-2 border-b border-slate-100 pb-2">
              <button
                onClick={() => toggleSortOrder("full_name")}
                className={`text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 ${userFilters.sortBy === "full_name" ? "bg-slate-100 text-slate-900" : "text-slate-400"}`}
              >
                Name <ArrowUpDown size={10} />
              </button>
              <button
                onClick={() => toggleSortOrder("created_at")}
                className={`text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 ${userFilters.sortBy === "created_at" ? "bg-slate-100 text-slate-900" : "text-slate-400"}`}
              >
                Date <ArrowUpDown size={10} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 min-h-[350px] content-start">
              {usersLoading ? (
                <div className="col-span-2 flex items-center justify-center h-48">
                  <Loader />
                </div>
              ) : (
                users.map((profile) => (
                  <div
                    key={profile.id}
                    className="p-3.5 border border-slate-100 bg-slate-50/50 rounded-xl space-y-1 hover:border-slate-200 transition-all"
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-bold text-slate-900 truncate max-w-[120px]">
                        {profile.full_name || "Anonymous"}
                      </h4>
                      <span
                        className={`text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded ${profile.role === "admin" ? "bg-purple-50 text-purple-700" : "bg-slate-100 text-slate-600"}`}
                      >
                        {profile.role || "Client"}
                      </span>
                    </div>
                    <p className="text-[11px] font-mono text-slate-500 truncate">
                      {profile.email}
                    </p>
                    <p className="text-[9px] text-slate-400 tracking-tight">
                      ID: {profile.id.slice(0, 12)}...
                    </p>
                  </div>
                ))
              )}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-between items-center border-t border-slate-100 pt-3 text-[11px] text-slate-500 font-semibold">
                <span>
                  Page {userFilters.page} of {totalPages}
                </span>
                <div className="flex gap-1.5">
                  <button
                    disabled={userFilters.page === 1}
                    onClick={() =>
                      setUserFilters((prev) => ({
                        ...prev,
                        page: (prev.page || 1) - 1,
                      }))
                    }
                    className="p-1 border border-slate-200 rounded-lg disabled:opacity-30"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <button
                    disabled={userFilters.page === totalPages}
                    onClick={() =>
                      setUserFilters((prev) => ({
                        ...prev,
                        page: (prev.page || 1) + 1,
                      }))
                    }
                    className="p-1 border border-slate-200 rounded-lg disabled:opacity-30"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 💬 CHAT WORKSPACE DIALOG MODAL VIEW LAYER */}
      {activeContext && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-xl w-full h-[550px] flex flex-col shadow-2xl overflow-hidden border border-slate-100">
            {/* Modal Header Controls */}
            <div className="p-4 bg-slate-950 text-white flex justify-between items-center">
              <div>
                <span className="text-[9px] uppercase font-black text-slate-400 tracking-wider">
                  Secure Room Pipeline tunnel
                </span>
                <h3 className="text-sm font-bold">
                  Active Claim Context: $
                  {activeContext.claimAmount.toLocaleString()}
                </h3>
              </div>
              <button
                onClick={() => setActiveContext(null)}
                className="text-slate-400 hover:text-white bg-white/10 p-1.5 rounded-lg transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Chat Surface Body Container */}
            <div className="flex-1 overflow-hidden bg-slate-50 p-4">
              <ChatRoom
                threadId={activeContext.threadId}
                claimId={activeContext.claimId}
              />
            </div>
          </div>
        </div>
      )}
      {/* Toast System Portal Notification */}
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
    </AppShell>
  );
};
