import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { CheckCircle2, XCircle, Clock, History, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

const HistoryPage = () => {
  const [activeTab, setActiveTab] = useState('incoming');
  const [data, setData] = useState({ incoming: [], outgoing: [], history: [] });
  const [loading, setLoading] = useState(true);
  
  const { triggerRefresh } = useOutletContext() || { triggerRefresh: () => {} };
  const user = JSON.parse(localStorage.getItem('user'));

  const fetchData = async () => {
    try {
      setLoading(false);
      // Aici vei face fetch-ul tău real către API
      // Momentan simulăm structura pentru design
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // Helper pentru culori status
  const getStatusStyle = (status) => {
    if (status === 'Pending') return 'bg-orange-100 text-orange-600';
    if (status === 'Approved') return 'bg-emerald-100 text-emerald-600';
    return 'bg-red-100 text-red-600';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header Secțiune */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <History className="text-emerald-500" /> Istoric & Cereri
        </h1>
        <p className="text-gray-500 text-sm">Gestionează rezervările și urmărește activitatea ta.</p>
      </div>

      {/* Selector de Tab-uri - Responsive (Scroll pe mobil) */}
      <div className="flex bg-gray-100 p-1.5 rounded-2xl w-full sm:w-max overflow-x-auto no-scrollbar">
        {[
          { id: 'incoming', label: 'Cereri Primite', icon: ArrowDownLeft },
          { id: 'outgoing', label: 'Cereri Trimise', icon: ArrowUpRight },
          { id: 'history', label: 'Arhivă Tranzacții', icon: Clock },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === tab.id 
                ? 'bg-white text-emerald-600 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Zona de conținut principal */}
      <div className="grid grid-cols-1 gap-6">
        
        {/* Secțiunea: Cereri în așteptare (Incoming) */}
        {activeTab === 'incoming' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-700 flex items-center gap-2">
              <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></span>
              Cereri de la alți utilizatori
            </h2>
            
            {/* Grid de Carduri - 1 col pe mobil, 2 pe tableta, 3 pe desktop */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2].map((item) => (
                <div key={item} className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg">Lapte Soia</h3>
                      <p className="text-gray-500 text-sm">Solicitat de <span className="text-emerald-600 font-semibold">Cătălina R.</span></p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-50 text-orange-500 border border-orange-100">
                      Așteptare
                    </span>
                  </div>
                  
                  <div className="flex gap-3 mt-6">
                    <button className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95">
                      <CheckCircle2 size={18} /> Acceptă
                    </button>
                    <button className="flex-1 bg-gray-50 hover:bg-red-50 text-gray-500 hover:text-red-500 py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 border border-gray-100">
                      <XCircle size={18} /> Refuză
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Secțiunea: Arhivă (Listă simplificată) */}
        {activeTab === 'history' && (
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-50">
              <h2 className="font-bold text-gray-800">Activitate Recentă</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
                      <ArrowUpRight size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">01 Nov 2023</p>
                      <p className="text-gray-800 font-semibold">Ai donat <span className="text-emerald-600">Pâine</span> către Anca R.</p>
                    </div>
                  </div>
                  <span className="self-start sm:self-center px-4 py-1.5 rounded-xl bg-emerald-50 text-emerald-600 text-xs font-bold">
                    Finalizat
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default HistoryPage;