import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { ArrowLeft, IndianRupee, Briefcase, FileText, Send, CheckCircle2, Loader2 } from "lucide-react";

const GigDetails = () => {
  const { gigId } = useParams();

  const [gig, setGig] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [fetchLoading, setFetchLoading] = useState(true);
  const [bidLoading, setBidLoading] = useState(false);

  const navigate = useNavigate();
  const fetchGig = async () => {
    try {
      setFetchLoading(true);
      setError("");
      const res = await api.get(`/gigs/${gigId}`);
      setGig(res.data?.data || null);
    } catch (err) {
      setError("Unable to load gig");
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchGig();
  }, [gigId]);

  const handleBid = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setBidLoading(true);
      await api.post(`/bids/${gigId}`, { message });
      setMessage("");
      alert("Bid placed successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to place bid");
    } finally {
      setBidLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
        <p className="text-slate-500 font-medium tracking-wide">Fetching project details...</p>
      </div>
    );
  }

  if (!gig) {
    return (
      <div className="max-w-2xl mx-auto mt-20 p-8 bg-white rounded-3xl border border-slate-200 text-center shadow-sm">
        <p className="text-red-500 font-medium mb-4">{error || "Gig not found"}</p>
        <button onClick={() => navigate(-1)} className="text-indigo-600 font-bold hover:underline">
          Return to Marketplace
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-medium mb-8 group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
          Back to Marketplace
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-extrabold text-slate-900 leading-tight mb-2">
                    {gig.title}
                  </h1>
                  <div className="flex items-center gap-2 text-indigo-600 font-bold text-lg">
                    <IndianRupee size={20} />
                    <span>{gig.budget.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-slate-900 font-bold uppercase text-xs tracking-widest">
                  <FileText size={16} className="text-slate-400" />
                  Project Description
                </div>
                <p className="text-slate-600 leading-relaxed whitespace-pre-line text-lg">
                  {gig.description}
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-8 bg-white rounded-3xl p-6 border border-slate-200 shadow-xl shadow-slate-200/50">
              {gig.status === "assigned" ? (
                <div className="text-center py-4 px-2">
                  <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="text-green-600" size={32} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">Gig Assigned</h3>
                  <p className="text-slate-500 text-sm">
                    This project has already found its partner and is no longer accepting bids.
                  </p>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Send size={20} className="text-indigo-600" />
                    Apply for Gig
                  </h2>

                  {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleBid} className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Your Proposal</label>
                      <textarea
                        placeholder="Explain why you're the best fit for this project..."
                        className="w-full border border-slate-200 p-4 rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 transition-all outline-none resize-none text-slate-700 placeholder:text-slate-400"
                        rows="6"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={bidLoading}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 active:scale-[0.98]"
                    >
                      {bidLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Submit Your Bid"
                      )}
                    </button>
                    <p className="text-[11px] text-center text-slate-400 px-4">
                      By submitting, you agree to the marketplace terms of service.
                    </p>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GigDetails;