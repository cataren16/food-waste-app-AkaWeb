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

             
           fetchCereriPrimite();
fetchCereriTrimise();
fetchFriends();

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
                   <div className='relative group'>
                     <Bell className=' text-gray-500 group-hover:text-emerald-600'/>
                     <Dot size={45} strokeWidth={3} className='absolute fill-red-500 text-red-500 -top-5 -right-4'/>
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