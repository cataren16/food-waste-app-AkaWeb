import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { CheckCircle2, XCircle, Clock, History, ArrowUpRight, ArrowDownLeft, Inbox } from 'lucide-react';

const HistoryPage = () => {
  const [activeTab, setActiveTab] = useState('incoming');
  const [data, setData] = useState({ incoming: [], outgoing: [], history: [] });
  const [loading, setLoading] = useState(true);
  
  const { triggerRefresh } = useOutletContext() || { triggerRefresh: () => {} };
  const user = JSON.parse(localStorage.getItem('user'));

  const fetchData = async () => {
    setLoading(true);
    try {
      const [incRes, outRes, histRes] = await Promise.all([
        fetch(`http://localhost:3000/api/marketplace/incoming-claims?userId=${user.id_utilizator}`),
        fetch(`http://localhost:3000/api/marketplace/my-claims?userId=${user.id_utilizator}`),
        fetch(`http://localhost:3000/api/marketplace/transactions-history?userId=${user.id_utilizator}`)
      ]);

      const incoming = await incRes.json();
      const outgoing = await outRes.json();
      const history = await histRes.json();

      setData({
        incoming: Array.isArray(incoming) ? incoming : [],
        outgoing: Array.isArray(outgoing) ? outgoing : [],
        history: Array.isArray(history) ? history : []
      });
    } catch (err) {
      console.error("Eroare la încărcarea datelor:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAction = async (claimId, action) => {
    try {
      const response = await fetch(`http://localhost:3000/api/marketplace/handle-claim`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_solicitare: claimId,
          action: action, 
          userId: user.id_utilizator
        })
      });

      if (response.ok) {
        triggerRefresh(); 
        fetchData(); 
      } else {
        const error = await response.json();
        alert(error.message);
      }
    } catch (err) {
      console.error("Eroare la procesarea solicitării:", err);
    }
  };

  const getStatusLabel = (status) => {
    if (status === 0) return { text: 'Așteptare', style: 'bg-orange-50 text-orange-500 border-orange-100' };
    if (status === 1) return { text: 'Acceptat', style: 'bg-emerald-50 text-emerald-500 border-emerald-100' };
    return { text: 'Respins', style: 'bg-red-50 text-red-500 border-red-100' };
  };

  if (loading) return <div className="p-20 text-center text-emerald-600 font-bold animate-pulse text-xl">Se încarcă istoricul...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <History className="text-emerald-500" /> Istoric & Cereri
        </h1>
        <p className="text-gray-500 text-sm">Gestionează rezervările și urmărește activitatea ta.</p>
      </div>

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
              activeTab === tab.id ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <tab.icon size={18} /> {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6">
        
        {activeTab === 'incoming' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-700 flex items-center gap-2">
              <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></span>
              Solicitări pentru produsele tale
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.incoming.length > 0 ? data.incoming.map((claim) => (
                <div key={claim.id_solicitare} className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg">{claim.ProdusSolicitat?.denumire_produs}</h3>
                      <p className="text-gray-500 text-sm">
                        De la: <span className="text-emerald-600 font-semibold">{claim.Solicitant?.prenume} {claim.Solicitant?.nume}</span>
                      </p>
                      <p className="text-xs text-gray-400 mt-1">Cantitate: {claim.nr_bucati} buc.</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusLabel(claim.status_solicitare).style}`}>
                      {getStatusLabel(claim.status_solicitare).text}
                    </span>
                  </div>
                  
                  {claim.status_solicitare === 0 && (
                    <div className="flex gap-3 mt-6">
                      <button 
                        onClick={() => handleAction(claim.id_solicitare, 'Approve')}
                        className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95"
                      >
                        <CheckCircle2 size={18} /> Acceptă
                      </button>
                      <button 
                        onClick={() => handleAction(claim.id_solicitare, 'Reject')}
                        className="flex-1 bg-gray-50 hover:bg-red-50 text-gray-500 hover:text-red-500 py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 border border-gray-100"
                      >
                        <XCircle size={18} /> Refuză
                      </button>
                    </div>
                  )}
                </div>
              )) : <EmptyState message="Nu ai nicio solicitare primită momentan." />}
            </div>
          </div>
        )}

        {activeTab === 'outgoing' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.outgoing.length > 0 ? data.outgoing.map((claim) => (
              <div key={claim.id_solicitare} className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-800">{claim.ProdusSolicitat?.denumire_produs}</h3>
                    <p className="text-xs text-gray-500">Proprietar: {claim.ProdusSolicitat?.owner?.prenume}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${getStatusLabel(claim.status_solicitare).style}`}>
                    {getStatusLabel(claim.status_solicitare).text}
                  </span>
                </div>
              </div>
            )) : <EmptyState message="Nu ai trimis nicio solicitare încă." />}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
            <div className="divide-y divide-gray-50">
              {data.history.length > 0 ? data.history.map((t) => (
                <div key={t.id_tranzactie} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${t.id_proprietar === user.id_utilizator ? 'bg-orange-50 text-orange-500' : 'bg-emerald-50 text-emerald-500'}`}>
                      {t.id_proprietar === user.id_utilizator ? <ArrowUpRight size={20} /> : <ArrowDownLeft size={20} />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-400">{new Date(t.data_finalizare).toLocaleDateString('ro-RO')}</p>
                      <p className="text-gray-800 font-semibold">
                        {t.id_proprietar === user.id_utilizator ? 
                          `Ai oferit ${t.nr_bucati} buc. de ${t.product?.denumire_produs} către ${t.beneficiary?.prenume}` : 
                          `Ai primit ${t.nr_bucati} buc. de ${t.product?.denumire_produs} de la ${t.owner?.prenume}`}
                      </p>
                    </div>
                  </div>
                  <span className="px-4 py-1.5 rounded-xl bg-gray-50 text-gray-500 text-xs font-bold border border-gray-100">Finalizat</span>
                </div>
              )) : <EmptyState message="Nu există tranzacții finalizate." />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const EmptyState = ({ message }) => (
  <div className="col-span-full py-10 text-center bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200">
    <Inbox className="mx-auto text-gray-300 mb-2" size={40} />
    <p className="text-gray-400 font-medium">{message}</p>
  </div>
);

export default HistoryPage;