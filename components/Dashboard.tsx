import React, { useState, useEffect } from 'react';
import { KENYAN_COUNTIES } from '../constants';
import { MatchProfile, Gender, UserProfile } from '../types';
import { generateMatches } from '../services/geminiService';

interface DashboardProps {
  user: UserProfile;
  onChatStart: (match: MatchProfile) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onChatStart }) => {
  const [selectedCounty, setSelectedCounty] = useState(user.county);
  const [matches, setMatches] = useState<MatchProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    const fetchMatches = async () => {
      setLoading(true);
      setMatches([]); // Clear prev matches
      const results = await generateMatches(selectedCounty, user.interestedIn.length > 0 ? user.interestedIn : [Gender.Female]);
      if (isMounted) {
        setMatches(results);
        setLoading(false);
      }
    };

    fetchMatches();
    return () => { isMounted = false; };
  }, [selectedCounty, user.interestedIn]);

  return (
    <div className="h-full flex flex-col">
        {/* Filter Bar */}
      <div className="p-4 bg-white shadow-sm z-10 sticky top-0">
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
            Browsing in
        </label>
        <select 
            className="w-full border-slate-300 border-b-2 bg-transparent py-1 focus:outline-none focus:border-rose-500 font-bold text-lg text-slate-800"
            value={selectedCounty}
            onChange={(e) => setSelectedCounty(e.target.value)}
        >
            {KENYAN_COUNTIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
           <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <div className="w-12 h-12 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin"></div>
                <p className="text-slate-500 text-sm">Finding verified singles in {selectedCounty}...</p>
           </div> 
        ) : (
            <>
                {matches.map(match => (
                    <div key={match.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden relative">
                         {/* Badge */}
                         <div className="absolute top-3 left-3 bg-white/90 backdrop-blur text-rose-600 text-[10px] font-bold px-2 py-1 rounded-full flex items-center shadow-sm z-10">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 mr-1">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                            </svg>
                            VERIFIED
                         </div>

                        <img src={match.imageUrl} alt={match.name} className="w-full h-64 object-cover" />
                        
                        <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900">{match.name}, {match.age}</h3>
                                    <p className="text-sm text-slate-500">{match.town}, {match.county}</p>
                                </div>
                                {match.isOnline && (
                                    <span className="flex items-center text-[10px] text-green-600 font-bold bg-green-50 px-2 py-1 rounded-full">
                                        <span className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></span>
                                        ONLINE
                                    </span>
                                )}
                            </div>
                            
                            <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                                {match.bio}
                            </p>

                            <button 
                                onClick={() => onChatStart(match)}
                                className="w-full py-3 bg-slate-900 text-white rounded-xl font-semibold shadow-lg hover:bg-slate-800 transition flex justify-center items-center"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                                </svg>
                                Message
                            </button>
                        </div>
                    </div>
                ))}
            </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;