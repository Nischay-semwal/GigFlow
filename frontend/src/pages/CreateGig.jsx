import { useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { PlusCircle, ArrowLeft, DollarSign, AlignLeft, Briefcase } from "lucide-react";

const CreateGig = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      await api.post("/gigs", {
        ...formData,
        budget: Number(formData.budget),
      });
      navigate("/gigs");
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to create gig"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link 
              to="/gigs" 
              className="text-slate-500 hover:text-indigo-600 flex items-center gap-2 text-sm font-medium transition-colors mb-2"
            >
              <ArrowLeft size={16} /> Back to Gigs
            </Link>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Post a New Gig</h1>
            <p className="text-slate-500 mt-1">Describe what you need and find the right talent.</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
                <p className="font-semibold">Error</p>
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <Briefcase size={18} className="text-slate-400" />
                  Gig Title
                </label>
                <input
                  type="text"
                  name="title"
                  placeholder="e.g. Build a React Dashboard"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 transition-all outline-none text-slate-900 placeholder:text-slate-400"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
                <p className="mt-2 text-xs text-slate-400">Keep it short and descriptive.</p>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <AlignLeft size={18} className="text-slate-400" />
                  Description
                </label>
                <textarea
                  name="description"
                  placeholder="Detail the requirements, tech stack, and deliverables..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 transition-all outline-none text-slate-900 placeholder:text-slate-400 min-h-[160px]"
                  rows="4"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <DollarSign size={18} className="text-slate-400" />
                  Total Budget ($)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
                  <input
                    type="number"
                    name="budget"
                    placeholder="0.00"
                    className="w-full pl-8 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 transition-all outline-none text-slate-900 placeholder:text-slate-400"
                    value={formData.budget}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 mt-8">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-white transition-all shadow-lg shadow-indigo-100 ${
                    loading 
                    ? "bg-slate-400 cursor-not-allowed" 
                    : "bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98]"
                  }`}
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating Gig...
                    </>
                  ) : (
                    <>
                      <PlusCircle size={20} />
                      Publish Gig
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateGig;