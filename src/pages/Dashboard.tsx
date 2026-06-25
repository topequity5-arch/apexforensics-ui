import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Modal } from "../components/Modal";
import { Loader } from "../components/Loader";
import { ChatRoom } from "../components/ChatRoom";
import { apiService } from "../services/api";
import { Plus, MessageSquare } from "lucide-react";
import { AppShell } from "../components/layouts/AppShell";

interface Claim {
  id: string;
  amount: number;
  status: string;
  description: string;
  dateCreated: string;
}

interface ChatThread {
  id: string;
  claim_id: string;
  complaint_title: string;
  complaint_description: string;
  status: string;
}

export const Dashboard = () => {
  const { token } = useAuth();
  const [claims, setClaims] = useState<Claim[]>([]);
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [activeContext, setActiveContext] = useState<{
    threadId: string;
    claimId: string;
  } | null>(null);

  
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
  const [loading, setLoading] = useState(true);

  // Modals
  const [claimModal, setClaimModal] = useState(false);

  // Forms
  const [amount, setAmount] = useState("");
  const [details, setDetails] = useState("");

  const syncDashboard = async () => {
    try {
      const claimsPayload = await apiService.getClaims(token!);
      const threadsPayload = await apiService.getThreads(token!);
      setClaims(claimsPayload);
      setThreads(threadsPayload);
    } catch (e) {
      console.error("Dashboard synchronization error:", e);
    }
  };

  useEffect(() => {
    if (!token) return;

    let isMounted = true;

    const runSync = async () => {
      try {
        const claimsPayload = await apiService.getClaims(token);
        const threadsPayload = await apiService.getThreads(token);

        if (isMounted) {
          setClaims(claimsPayload);
          setThreads(threadsPayload);
        }
      } catch (e) {
        console.error("Error running initial dashboard sync:", e);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    runSync();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const dispatchClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await apiService.createClaim(token!, Number(amount), details);
      setClaimModal(false);
      setAmount("");
      setDetails("");
      await syncDashboard();
      showToast("Settlement claim created successfully.", "success");
    } catch (err) {
      showToast(`An error occured when filing your settlement claim.`, "error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenClaimChat = (claimId: string) => {
    // Locate the matching 1:1 chat thread generated automatically for this claim
    const matchingThread = threads.find((th) => th.claim_id === claimId);
    if (matchingThread) {
      setActiveContext({
        threadId: matchingThread.id,
        claimId: claimId,
      });
    } else {
      console.warn(
        "No active chat channel found matching this claim reference yet.",
      );
    }
  };

  if (loading) {
    return (
      <AppShell>
        <Loader />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Claims Listing */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 flex justify-between items-center shadow-sm">
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Active Recovery Portfolios
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Sovereign settlement metrics configuration
              </p>
            </div>
            <button
              onClick={() => setClaimModal(true)}
              className="bg-slate-950 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-slate-800 transition-colors"
            >
              <Plus size={14} /> File Settlement
            </button>
          </div>

          <div className="space-y-4">
            {claims.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-2xl border border-dashed border-slate-200 text-slate-400 text-sm">
                No active asset claims filed yet. Click "File Settlement" to
                begin.
              </div>
            ) : (
              claims.map((claim) => {
                const linkedThread = threads.find(
                  (t) => t.claim_id === claim.id,
                );
                const isChatActive = activeContext?.claimId === claim.id;

                return (
                  <div
                    key={claim.id}
                    className={`bg-white p-6 rounded-2xl border shadow-sm space-y-4 transition-all ${
                      isChatActive
                        ? "border-slate-950 ring-1 ring-slate-950"
                        : "border-slate-200"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[9px] font-black tracking-widest text-slate-400 uppercase">
                          Registry Token: {claim.id.slice(0, 8)}
                        </span>
                        <h3 className="text-2xl font-black text-slate-900 mt-0.5">
                          ${claim.amount.toLocaleString()}
                        </h3>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                        {claim.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {claim.description}
                    </p>
                    <div className="border-t border-slate-100 pt-3 flex justify-between items-center text-[11px] text-slate-400">
                      <span>
                        Log Date:{" "}
                        {new Date(claim.dateCreated).toLocaleDateString()}
                      </span>
                      {linkedThread && (
                        <button
                          onClick={() => handleOpenClaimChat(claim.id)}
                          className={`flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
                            isChatActive
                              ? "bg-slate-950 text-white"
                              : "text-slate-900 bg-slate-50 hover:bg-slate-100"
                          }`}
                        >
                          <MessageSquare size={13} />
                          {isChatActive
                            ? "Active Chat Session"
                            : "Open Claim Chat"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: Contextual Live Chat Window */}
        <div className="space-y-6">
          {activeContext ? (
            <ChatRoom
              threadId={activeContext.threadId}
              claimId={activeContext.claimId}
            />
          ) : (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center shadow-sm text-slate-400 text-xs py-24">
              <MessageSquare className="mx-auto mb-2 opacity-40" size={24} />
              Select a claim's chat session to view ongoing communications logs.
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={claimModal}
        onClose={() => setClaimModal(false)}
        title="File Asset Portfolio"
      >
        <form onSubmit={dispatchClaim} className="space-y-4">
          <input
            type="number"
            placeholder="Recovery Estimate ($)"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full text-sm p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-400"
          />
          <textarea
            placeholder="Provide asset location details or origin parameters..."
            required
            rows={4}
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            className="w-full text-sm p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-400"
          />
          <button
            type="submit"
            className="w-full bg-slate-950 text-white py-3 rounded-xl text-xs font-bold uppercase hover:bg-slate-800 transition-colors"
          >
            Commit Record & Open Thread
          </button>
        </form>
      </Modal>
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
