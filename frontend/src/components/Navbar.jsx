import React, { useState, useEffect, useRef} from 'react';
import {Search,Bell,Dot,Leaf} from 'lucide-react';
import Searchbar from './Searchbar';
import MobileSearchOverlay from './MobileSearchOverlay';
import ResultList from './ResultsList';


const Navbar = ()=>{

    const [isMobileOverlayOpen, setisMobileOverlayOpen] = useState(false);
    const [showDesktopResults, setShowDesktopResults] = useState(false);
    const desktopSearchRef = useRef(null);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [receivedRequests, setReceivedRequests] = useState([]);
    const [loadingRequests, setLoadingRequests] = useState(false);
    const [myId, setMyId] = useState(null);
    const [sentRequests, setSentRequests] = useState([]);
    const [loadingSentRequests, setLoadingSentRequests] = useState(false);
    const [friends, setFriends] = useState([]);
    const [loadingFriends, setLoadingFriends] = useState(false);
    const [productNotifications, setProductNotifications] = useState([]);
    const [isNotifyOpen, setIsNotifyOpen] = useState(false);
    const notifyRef = useRef(null);
    const [systemNotifications, setSystemNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);


    const handleMobileOverlay = ()=>{
        setisMobileOverlayOpen(true);
    }

    const closeMobileOverlay = ()=>{
        setisMobileOverlayOpen(false);
    }

   const handleSendRequest = async (id_prieten) => {
  try {
    const res = await fetch("http://localhost:3000/api/friends/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_eu: myId, id_prieten }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Eroare la acceptare");
      return;
    }


   setSentRequests((prev) => [
  ...prev,
  { UtilizatorSecundar: { id_utilizator: id_prieten } }
]);
  } catch (err) {
    console.error(err);
    alert("Eroare de rețea la acceptare");
  }
};

    const handleAccept = async (id_prieten) => {
  try {
    const res = await fetch("http://localhost:3000/api/friends/accept", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_eu: myId, id_prieten }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Eroare la acceptare");
      return;
    }
    const resFriends = await fetch(`http://localhost:3000/api/friends/list/${myId}`);
    const dataFriends = await resFriends.json();
    if (resFriends.ok) setFriends(dataFriends.prietenii || []);



    setReceivedRequests((prev) =>
      prev.filter((req) => req.UtilizatorPrincipal?.id_utilizator !== id_prieten)
    );
  } catch (err) {
    console.error(err);
    alert("Eroare de rețea la acceptare");
  }
};


    const handleDecline = async (id_prieten) => {
  try {
    const res = await fetch("http://localhost:3000/api/friends/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_eu: myId, id_prieten }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Eroare la refuz");
      return;
    }

   

    setReceivedRequests((prev) =>
      prev.filter((req) => req.UtilizatorPrincipal?.id_utilizator !== id_prieten)
    );
  } catch (err) {
    console.error(err);
    alert("Eroare de rețea la refuz");
  }
};

const handleCancelRequest = async (id_prieten) => {
  try {
    const res = await fetch("http://localhost:3000/api/friends/request/cancel", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_eu: myId, id_prieten }),
    });

   let data = {};
try { data = await res.json(); } catch {}
   if (!res.ok) {
  alert(data.message || `Eroare la anulare (${res.status})`);
  return;
}


    setSentRequests((prev) =>
      prev.filter((r) => (r.UtilizatorSecundar?.id_utilizator) !== id_prieten)
    );
  } catch (err) {
    console.error(err);
    alert("Eroare de rețea la anulare");
  }
};




    const [userData, setUserData] = useState({
        name: "Vizitator",
        email: "",
        avatarUrl: null
    });

   
    useEffect(()=>{
        if(!searchText.trim())
        {
            setResults([]);
            return;
        }

        const timer = setTimeout(async () =>{
            try{
                setLoading(true)

                const res= await fetch(`http://localhost:3000/api/friends/search?q=${encodeURIComponent(searchText)}`);
                const data = await res.json();

                if(res.ok)
                {
                    setResults(data.users || []);
                  

                }
                else
                {
                    setResults([]);
                }
            }
            catch(err)
            {
                console.error(err);
                setResults([]);
            }
            finally{
                setLoading(false);
            }
        },300);

        return () => clearTimeout(timer);
    },[searchText]);

    useEffect(() => {
        const handleClickOutsideNotify = (event) => {
            if (notifyRef.current && !notifyRef.current.contains(event.target)) {
                setIsNotifyOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutsideNotify);
        return () => document.removeEventListener('mousedown', handleClickOutsideNotify);
    }, []);

    useEffect(()=>{

        const handleClickOutside = (event) =>{

            if(desktopSearchRef.current && !desktopSearchRef.current.contains(event.target))
            {
                setShowDesktopResults(false);
            }

        };

        document.addEventListener('mousedown',handleClickOutside);

        return () =>{
            document.removeEventListener('mousedown',handleClickOutside);
        };
        
    },[]);

    const handleToggleNotify = async () => {
        const newState = !isNotifyOpen;
        setIsNotifyOpen(newState);

        if (newState && unreadCount > 0) {
            try {
                await fetch(`http://localhost:3000/api/notifications/mark-read`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: myId })
                });
                setUnreadCount(0); 
            } catch (err) {
                console.error("Eroare la marcarea ca citit:", err);
            }
        }
    };

      const handleDeleteSingleNotification = async (idNotificare) => {
      try {
          const res = await fetch(`http://localhost:3000/api/notifications/${idNotificare}`, {
              method: 'DELETE',
          });

          if (res.ok) {
              setSystemNotifications(prev => 
                  prev.filter(n => n.id_notificare !== idNotificare)
              );
              
              const notificationToDelete = systemNotifications.find(n => n.id_notificare === idNotificare);
              if (notificationToDelete && !notificationToDelete.citita) {
                  setUnreadCount(prev => Math.max(0, prev - 1));
              }
          } else {
              console.error("Eroare la ștergerea de pe server.");
          }
      } catch (err) {
          console.error("Eroare la ștergere:", err);
      }
  };

    const handleDeleteAllNotifications = async () => {
        if (!window.confirm("Ești sigur că vrei să ștergi toate notificările de sistem?")) return;

        try {
            const res = await fetch(`http://localhost:3000/api/notifications/all/${myId}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                setSystemNotifications([]); 
                setUnreadCount(0);  
            } else {
                alert("Eroare la ștergerea notificărilor.");
            }
        } catch (err) {
            console.error("Eroare la ștergere:", err);
        }
    };

    useEffect(()=>{
        
        const UserStr=localStorage.getItem('user');
        if(UserStr)
        {
            const userObj= JSON.parse(UserStr);
            const generatedAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${userObj.nume}${userObj.prenume}`;

            setUserData({
                name:userObj.nume+' '+userObj.prenume,
                email:userObj.email,
                avatarUrl:generatedAvatar
            });
            setMyId(userObj.id_utilizator);
            const id_eu =userObj.id_utilizator;

            const fetchCereriPrimite = async () =>{
                try{
                    setLoadingRequests(true);
                    const res = await fetch(`http://localhost:3000/api/friends/requests/received/${id_eu}`);
                    const data= await res.json();

                    if(res.ok)
                    {
                        setReceivedRequests(data.requests || []);
                    }
                    else
                    {
                        setReceivedRequests([]);
                    }
                }
                catch(err)
                {
                    console.error(err);
                    setReceivedRequests([]);
                }
                finally {
                    setLoadingRequests(false);  
                }
            }

            const fetchCereriTrimise = async () => {
  try {
    setLoadingSentRequests(true);
    const res = await fetch(`http://localhost:3000/api/friends/requests/sent/${id_eu}`);
    const data = await res.json();

    if (res.ok) {
      setSentRequests(data.requests || []);
    } else {
      setSentRequests([]);
    }
  } catch (err) {
    console.error(err);
    setSentRequests([]);
  } finally {
    setLoadingSentRequests(false);
  }
};
  const fetchFriends = async () => {
  try {
    setLoadingFriends(true);
    const res = await fetch(`http://localhost:3000/api/friends/list/${id_eu}`);
    const data = await res.json();

    if (res.ok) {
      setFriends(data.prietenii || []);
    } else {
      setFriends([]);
    }
  } catch (err) {
    console.error(err);
    setFriends([]);
  } finally {
    setLoadingFriends(false);
  }
};

const fetchSystemNotifications = async () => {
        try {
            const res = await fetch(`http://localhost:3000/api/notifications?userId=${id_eu}`);
            const data = await res.json();
            if (res.ok) setSystemNotifications(data);

            const resUnread = await fetch(`http://localhost:3000/api/notifications/unread?userId=${id_eu}`);
            const dataUnread = await resUnread.json();
            if (resUnread.ok) setUnreadCount(dataUnread.unread);
        } catch (err) {
            console.error("Eroare notificări sistem:", err);
        }
    };

    const fetchProductNotifications = async () => {
        try {
            const res = await fetch(`http://localhost:3000/api/marketplace/incoming-claims?userId=${id_eu}`);
            const data = await res.json();
            if (res.ok) {
                setProductNotifications(data.filter(req => req.status_solicitare === 0));
            }
        } catch (err) {
            console.error("Eroare notificări:", err);
        }
    };

            fetchProductNotifications();
            fetchCereriPrimite();
            fetchCereriTrimise();
            fetchFriends();
            fetchSystemNotifications();

        }
    },[]);

    return (
            <div className='flex h-20 bg-white rounded-2xl justify-between md:px-10 md:py-2 md:gap-4 px-2'>

                {isMobileOverlayOpen && (<MobileSearchOverlay onClose={closeMobileOverlay} searchText={searchText} setSearchText={setSearchText} results={results} loading={loading} receivedRequests={receivedRequests} loadingRequests={loadingRequests}
                myId={myId} onSendRequest={handleSendRequest} onAccept={handleAccept} onDecline={handleDecline} sentRequests={sentRequests} loadingSentRequests={loadingSentRequests} onCancel={handleCancelRequest}friends={friends}
loadingFriends={loadingFriends}></MobileSearchOverlay> )}
                
                <div className='md:hidden flex gap-1 text-emerald-600 py-5'>
                    <Leaf size={28} />
                    <p className='text-2xl font-extrabold'>AkaWeb</p>
                </div>
                
                <div ref={desktopSearchRef} className="hidden md:block relative" onClick={()=> setShowDesktopResults(true)}>
                <Searchbar className={"md:flex hidden w-[300px] py-3"} rounded={"rounded-3xl"} backgroundInp={"bg-gray-100"} value={searchText} onChange={setSearchText}></Searchbar>
               
                {showDesktopResults && (
                    <div className='absolute top-full mt-4 left-1/2 -translate-x-1/2 w-[350px] bg-slate-50 border border-gray-100 shadow-2xl rounded-2xl p-4 z-50 max-h-[500px] overflow-y-auto'>
                    <ResultList results={results} loading={loading} searchText={searchText}  receivedRequests={receivedRequests} loadingRequests={loadingRequests} myId={myId} onSendRequest={handleSendRequest} 
                    onAccept={handleAccept} onDecline={handleDecline} sentRequests={sentRequests} loadingSentRequests={loadingSentRequests} onCancel={handleCancelRequest} friends={friends}
loadingFriends={loadingFriends}></ResultList>
                    </div>
                    )}
                     </div>
                <div className='flex md:gap-9 items-center gap-3 '>
                     <Search className='md:hidden text-gray-500 hover:text-emerald-600' onClick={handleMobileOverlay}/>
                <div className='relative' ref={notifyRef}>
                  <button 
                      onClick={handleToggleNotify}
                      className="relative group p-1 focus:outline-none flex items-center"
                  >
                      <Bell className={`transition-colors ${isNotifyOpen ? 'text-emerald-600' : 'text-gray-500 group-hover:text-emerald-600'}`} />
                      
                      {(productNotifications.length > 0 || unreadCount > 0) && (
                          <span className="absolute -top-1 -right-1 flex h-4 w-4">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[10px] text-white items-center justify-center font-bold">
                                  {productNotifications.length + unreadCount}
                              </span>
                          </span>
                      )}
                  </button>

                  {isNotifyOpen && (
                      <div className="absolute top-full mt-4 right-0 w-80 bg-white border border-gray-100 shadow-2xl rounded-2xl z-50 overflow-hidden animate-in fade-in zoom-in duration-200">
                         <div className="p-4 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
                          <h3 className="font-bold text-gray-800 text-sm">Notificări</h3>
                          
                          {systemNotifications.length > 0 && (
                              <button 
                                  onClick={handleDeleteAllNotifications}
                                  className="text-[10px] font-bold text-red-500 hover:text-red-700 uppercase tracking-wider transition-colors"
                              >
                                  Șterge
                              </button>
                          )}
                      </div>
                          
                          <div className="max-h-80 overflow-y-auto">
                              {productNotifications.length > 0 && (
                                  <div className="bg-amber-50/50 p-2 text-[10px] font-bold text-amber-700 uppercase tracking-wider">
                                      Cineva vrea produsele tale
                                  </div>
                              )}
                              {productNotifications.map((n) => (
                                  <div key={n.id_solicitare} className="p-4 border-b border-gray-50 hover:bg-emerald-50/30 transition-colors">
                                      <p className="text-sm font-bold text-gray-800">{n.Solicitant?.prenume} {n.Solicitant?.nume}</p>
                                      <p className="text-xs text-gray-500">vrea <span className="text-emerald-600 font-semibold">{n.ProdusSolicitat?.denumire_produs}</span></p>
                                  </div>
                              ))}

                              {systemNotifications.length > 0 && (
                                  <div className="bg-gray-50 p-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                                      Activitate Recentă
                                  </div>
                              )}
                              {systemNotifications.map((sn) => (
                                <div 
                                    key={sn.id_notificare} 
                                    className={`group p-4 border-b border-gray-50 flex justify-between items-center transition-colors ${!sn.citita ? 'bg-blue-50/40' : 'hover:bg-gray-50'}`}
                                >
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-700">{sn.mesaj}</p>
                                        <p className="text-[9px] text-gray-400 mt-1">
                                            {new Date(sn.data_notificare).toLocaleDateString('ro-RO')}
                                        </p>
                                    </div>

                                    <button 
                                        onClick={() => handleDeleteSingleNotification(sn.id_notificare)}
                                        className="ml-2 p-1 text-gray-300 hover:text-red-500 transition-colors"
                                        title="Șterge notificarea"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="18" y1="6" x2="6" y2="18"></line>
                                            <line x1="6" y1="6" x2="18" y2="18"></line>
                                        </svg>
                                    </button>
                                </div>
                            ))}
                              {productNotifications.length === 0 && systemNotifications.length === 0 && (
                                  <p className="p-6 text-center text-gray-400 text-xs">Nicio notificare nouă.</p>
                              )}
                    </div>

                    <button 
                        onClick={() => { window.location.href = '/history'; setIsNotifyOpen(false); }}
                        className="w-full p-3 bg-gray-50 text-xs font-bold text-emerald-600 hover:bg-emerald-100 transition-colors"
                    >
                        Vezi tot istoricul
                    </button>
                </div>
            )}
        </div>
                     <div className='flex gap-2'>
                     <div className='hidden md:block flex flex-col items-end '>
                        <p className='text-sm font-bold'>{userData.name}</p>
                        <p className='text-xs text-emerald-700 font-bold'>{userData.email}</p>
                     </div>
                     <img src={userData.avatarUrl} alt="Profile" className='w-10 h-10 rounded-full bg-emerald-100 border-2 border-white shadow-sm'/>
                     </div>
                </div>
            </div>
    )
}
export default Navbar;