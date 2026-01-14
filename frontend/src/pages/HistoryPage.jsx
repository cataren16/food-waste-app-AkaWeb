import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { CheckCircle2, XCircle, Clock, History, ArrowUpRight, ArrowDownLeft, Inbox, User } from 'lucide-react';

const API_URL = "https://food-waste-akaweb-dwcdcearcweeeret.canadacentral-01.azurewebsites.net";

const HistoryPage = () => {
  const [activeTab, setActiveTab] = useState('incoming'); 
  const [data, setData] = useState({ incoming: [], outgoing: [], history: [] });
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const { triggerRefresh } = useOutletContext() || { triggerRefresh: () => {} };
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile && (activeTab === 'incoming' || activeTab === 'outgoing')) {
        setActiveTab('claims');
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [incRes, outRes, histRes] = await Promise.all([
        fetch(`${API_URL}/api/marketplace/incoming-claims?userId=${user.id_utilizator}`),
        fetch(`${API_URL}/api/marketplace/my-claims?userId=${user.id_utilizator}`),
        fetch(`${API_URL}/api/marketplace/transactions-history?userId=${user.id_utilizator}`)
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
      const response = await fetch(`${API_URL}/api/marketplace/handle-claim`, {
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
    if (status === 0) return { text: 'AȘTEPTARE', style: 'bg-orange-50 text-orange-500 border-orange-100' };
    if (status === 1) return { text: 'ACCEPTAT', style: 'bg-emerald-50 text-emerald-500 border-emerald-100' };
    return { text: 'RESPINS', style: 'bg-red-50 text-red-500 border-red-100' };
  };

  if (loading) return <div className="p-20 text-center text-emerald-600 font-bold animate-pulse text-xl">Se încarcă...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <History className="text-emerald-500" /> Istoric & Cereri
        </h1>
        <p className="text-gray-500 text-sm">Gestionează rezervările și urmărește activitatea ta.</p>
      </div>

      <div className="flex bg-gray-100 p-1.5 rounded-2xl w-full md:w-max">
        {!isMobile ? (
          <>
            {[
              { id: 'incoming', label: 'Cereri Primite', icon: ArrowDownLeft },
              { id: 'outgoing', label: 'Cereri Trimise', icon: ArrowUpRight },
              { id: 'history', label: 'Arhivă Tranzacții', icon: Clock },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  activeTab === tab.id ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon size={18} /> {tab.label}
              </button>
            ))}
          </>
        ) : (
          <>
            <button
              onClick={() => setActiveTab('claims')}
              className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${
                activeTab === 'claims' || activeTab === 'incoming' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500'
              }`}
            >
              Cereri Produse
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${
                activeTab === 'history' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500'
              }`}
            >
              Istoric
            </button>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6">
        
        {!isMobile && (
          <>
            {activeTab === 'incoming' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.incoming.length > 0 ? data.incoming.map(claim => <ClaimCard key={claim.id_solicitare} claim={claim} onAction={handleAction} getStatus={getStatusLabel} type="incoming" />) : <EmptyState message="Fără cereri primite." />}
              </div>
            )}
            {activeTab === 'outgoing' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.outgoing.length > 0 ? data.outgoing.map(claim => <ClaimCard key={claim.id_solicitare} claim={claim} getStatus={getStatusLabel} type="outgoing" />) : <EmptyState message="Fără cereri trimise." />}
              </div>
            )}
          </>
        )}

        {isMobile && activeTab !== 'history' && (
          <div className="space-y-6">
            <div className="space-y-3">
              <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Cereri Primite</h2>
              {data.incoming.length > 0 ? data.incoming.map(claim => <ClaimCard key={claim.id_solicitare} claim={claim} onAction={handleAction} getStatus={getStatusLabel} type="incoming" isMobile />) : <p className="text-gray-400 text-sm ml-1">Nicio cerere primită.</p>}
            </div>
            <div className="space-y-3">
              <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Cereri Trimise de tine</h2>
              {data.outgoing.length > 0 ? data.outgoing.map(claim => <ClaimCard key={claim.id_solicitare} claim={claim} getStatus={getStatusLabel} type="outgoing" isMobile />) : <p className="text-gray-400 text-sm ml-1">Nicio cerere trimisă.</p>}
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
            {data.history.length > 0 ? data.history.map((t) => (
              <div key={t.id_tranzactie} className="p-5 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${t.id_proprietar === user.id_utilizator ? 'bg-orange-50 text-orange-500' : 'bg-emerald-50 text-emerald-500'}`}>
                  {t.id_proprietar === user.id_utilizator ? <ArrowUpRight size={20} /> : <ArrowDownLeft size={20} />}
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{new Date(t.data_finalizare).toLocaleDateString('ro-RO')}</p>
                  <p className="text-gray-800 font-semibold text-sm">
                    {t.id_proprietar === user.id_utilizator ? 
                      `Ai oferit ${t.nr_bucati} buc. de ${t.product?.denumire_produs} către ${t.beneficiary?.prenume}` : 
                      `Ai primit ${t.nr_bucati} buc. de ${t.product?.denumire_produs} de la ${t.owner?.prenume}`}
                  </p>
                </div>
              </div>
            )) : <EmptyState message="Nu există tranzacții finalizate." />}
          </div>
        )}
      </div>
    </div>
  );
};

const ClaimCard = ({ claim, onAction, getStatus, type, isMobile }) => {
  const status = getStatus(claim.status_solicitare);
  
  return (
    <div className={`bg-white border border-gray-100 shadow-sm transition-all ${isMobile ? 'p-4 rounded-3xl' : 'p-5 rounded-[2rem] hover:shadow-md'}`}>
      <div className="flex justify-between items-start mb-3 gap-2">
        <div className="flex gap-3 min-w-0">
          {type === 'incoming' && (
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
              <User size={18} className="text-emerald-500" />
            </div>
          )}
          <div className="min-w-0">
            <h3 className={`font-bold text-gray-800 truncate ${isMobile ? 'text-sm' : 'text-lg'}`}>
              {claim.ProdusSolicitat?.denumire_produs}
            </h3>
            <div className="flex flex-col gap-0.5">
              <p className="text-gray-500 text-xs">
                {type === 'incoming' ? `De la: ${claim.Solicitant?.prenume}` : `Proprietar: ${claim.ProdusSolicitat?.owner?.prenume}`}
              </p>
              <p className="text-[11px] text-emerald-600 font-bold uppercase tracking-tight">
                Cantitate: {claim.nr_bucati} buc.
              </p>
            </div>
          </div>
        </div>
        <span className={`shrink-0 px-2 py-1 rounded-lg text-[9px] font-black border ${status.style}`}>
          {status.text}
        </span>
      </div>

      {type === 'incoming' && claim.status_solicitare === 0 && (
        <div className={`flex gap-2 ${isMobile ? 'mt-3' : 'mt-5'}`}>
          <button 
            onClick={() => onAction(claim.id_solicitare, 'Approve')}
            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <CheckCircle2 size={16} /> Acceptă
          </button>
          <button 
            onClick={() => onAction(claim.id_solicitare, 'Reject')}
            className="flex-1 bg-gray-50 hover:bg-red-50 text-gray-500 hover:text-red-500 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all border border-gray-100 active:scale-95"
          >
            <XCircle size={16} /> Refuză
          </button>
        </div>
      )}
    </div>
  );
};

const EmptyState = ({ message }) => (
  <div className="col-span-full py-10 text-center bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200">
    <Inbox className="mx-auto text-gray-300 mb-2" size={40} />
    <p className="text-gray-400 font-medium text-sm">{message}</p>
  </div>
);

export default HistoryPage;