import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { ArrowLeft, User, MessageSquare, CheckCircle2, Loader2, Inbox } from "lucide-react";

const GigBids = () => {
  const { gigId } = useParams();

  const [bids, setBids] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [hireLoading, setHireLoading] = useState(null);
  const navigate = useNavigate();

  const fetchBids = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/bids/${gigId}`);
      setBids(res.data?.data || []);
    } catch (err) {
      setError("Unable to fetch bids");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBids();
  }, [gigId]);

  const handleHire = async (bidId) => {
    try {
      setHireLoading(bidId);
      await api.patch(`/bids/${bidId}/hire`);
      fetchBids();
    } catch (err) {
      alert(err.response?.data?.message || "Unable to hire freelancer");
    } finally {
      setHireLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Loading applicant bids...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto mt-10 p-6 bg-red-50 rounded-xl text-center">
        <p className="text-red-600 font-medium">{error}</p>
        <button onClick={fetchBids} className="mt-2 text-red-700 underline text-sm">Try again</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 py-12">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors text-sm font-medium mb-2"
            >
              <ArrowLeft size={16} /> Back to Details
            </button>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Manage Bids 
              <span className="ml-3 text-lg font-normal text-slate-400">({bids.length})</span>
            </h1>
          </div>
        </div>

        {bids.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-16 text-center">
            <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            </div>
            <h3 className="text-lg font-semibold text-slate-900">No bids yet</h3>
            <p className="text-slate-500 max-w-xs mx-auto mt-1">
              Once freelancers apply to your gig, their proposals will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {bids.map((bid) => (
              <div
                key={bid._id}
                className={`bg-white border transition-all duration-200 rounded-2xl p-6 ${
                  bid.status === "hired" 
                  ? "border-green-200 bg-green-50/30 shadow-sm" 
                  : "border-slate-200 hover:shadow-md hover:border-indigo-100"
                }`}
              >
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                        <User className="text-slate-500" size={20} />
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Freelancer Application</p>
                        <div className="flex items-center gap-2">
                           {bid.status === "hired" ? (
                             <span className="flex items-center gap-1 text-xs font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full uppercase">
                               <CheckCircle2 size={12} /> Hired
                             </span>
                           ) : (
                             <span className="text-xs font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full uppercase">
                               Pending
                             </span>
                           )}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <MessageSquare className="text-slate-300 shrink-0 mt-1" size={18} />
                      <p className="text-slate-700 leading-relaxed italic">
                        "{bid.message}"
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col justify-center items-end border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-8 min-w-[140px]">
                    {bid.status === "pending" && (
                      <button
                        onClick={() => handleHire(bid._id)}
                        disabled={hireLoading === bid._id}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-lg shadow-indigo-100 active:scale-[0.98] disabled:bg-slate-300 disabled:shadow-none flex items-center justify-center gap-2"
                      >
                        {hireLoading === bid._id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : "Hire Now"}
                      </button>
                    )}

                    {bid.status === "hired" && (
                      <div className="flex flex-col items-center text-green-600 bg-white border border-green-200 px-4 py-2 rounded-xl">
                        <CheckCircle2 size={24} className="mb-1" />
                        <span className="text-xs font-bold uppercase">Selection Confirmed</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GigBids;