import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import { Search, IndianRupee, Eye, Users, Loader2, Plus } from "lucide-react";

const Gigs = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [gigs, setGigs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchGigs = async (query = "") => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get(`/gigs${query}`);
      setGigs(res.data?.data || []);
    } catch (err) {
      setError("Unable to fetch gigs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGigs();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim() === "") {
      fetchGigs();
    } else {
      fetchGigs(`?search=${encodeURIComponent(search.trim())}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50/50">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
        <p className="text-slate-500 font-medium tracking-wide">Finding available opportunities...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <div className="bg-white border-b border-slate-200 mb-8 pt-12 pb-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Explore Gigs
              </h1>
              <p className="text-slate-500 mt-1">Discover the best projects from top clients.</p>
            </div>
            <Link
              to="/create-gig"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-100 active:scale-95"
            >
              <Plus size={20} /> Post a Gig
            </Link>
          </div>

          <form onSubmit={handleSearch} className="relative max-w-2xl group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
            <input
              type="text"
              placeholder="Search by title, skills, or keywords..."
              className="w-full pl-12 pr-32 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all outline-none shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="absolute right-2 top-2 bottom-2 bg-slate-900 hover:bg-black text-white px-6 rounded-xl text-sm font-bold transition-colors">
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl mb-6">
            {error}
          </div>
        )}

        {gigs.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
            <h3 className="text-xl font-bold text-slate-900 mb-2">No gigs found</h3>
            <p className="text-slate-500">Try adjusting your search terms or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {gigs.map((gig) => (
              <div
                key={gig._id}
                className="group bg-white border border-slate-200 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 hover:border-indigo-100 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${
                      gig.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {gig.status}
                    </span>
                    <div className="flex items-center gap-1 text-slate-900 font-bold text-lg">
                      <IndianRupee size={16} />
                      {gig.budget.toLocaleString('en-IN')}
                    </div>
                  </div>

                  <h2 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-2">
                    {gig.title}
                  </h2>

                  <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-2">
                    {gig.description}
                  </p>
                </div>

                <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/gigs/${gig._id}`)}
                      className="inline-flex items-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-700 px-4 py-2 rounded-lg text-sm font-bold transition-colors border border-slate-200"
                    >
                      <Eye size={16} /> View Details
                    </button>
                    
                    {user?._id === gig.ownerId && (
                      <Link
                        to={`/gigs/${gig._id}/bids`}
                        className="inline-flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg text-sm font-bold transition-colors border border-indigo-100"
                      >
                        <Users size={16} /> Bids
                      </Link>
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

export default Gigs;