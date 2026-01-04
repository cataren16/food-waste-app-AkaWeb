    import {CircleCheck,CircleX,UserPlus} from 'lucide-react';
    const ResultList = ({results, loading,searchText,receivedRequests,loadingRequests,myId,onSendRequest,onAccept,onDecline,sentRequests,loadingSentRequests,onCancel,friends, loadingFriends
    }) =>{

        const sentIds = new Set(
        (sentRequests || []).map((r) => r.UtilizatorSecundar?.id_utilizator)
        );
        const friendIds = new Set(
  (friends || []).map((f) => {
    const a = f.id_utilizator_1;
    const b = f.id_utilizator_2;
    return a === myId ? b : a;
  })
);

    

    if(!searchText){
        return (

            <div className="flex flex-col gap-5 ">
                <p className="text-gray-400 font-bold">CERERI ÎN AȘTEPTARE</p>
            {loadingRequests ?  (
                    <p className="text-gray-500 font-bold">Se încarcă cererile...</p>
                    ): receivedRequests.length === 0 ? (
                <p className="text-gray-400 font-bold">Nu ai cereri primite.</p>
                ) : (
            <div className='flex flex-col gap-2'>
                {receivedRequests.map((req)=>(
                <div key={`${req.id_utilizator_1}-${req.id_utilizator_2}`} className="flex bg-white rounded-xl justify-between py-3 px-4 shadow-md items-center">
                    <div className="flex gap-2">
                        <img 
                            src={`https://ui-avatars.com/api/?name=${req.UtilizatorPrincipal?.nume || "User"}+${req.UtilizatorPrincipal?.prenume || ""}&background=E6E9FC&color=3F51B5&bold=true&size=120`}
                            alt="Avatar"
                            className="w-10 h-10 rounded-full"
                        />
                        <div className="flex flex-col">
                            <p className='font-bold'>{req.UtilizatorPrincipal?.nume} {req.UtilizatorPrincipal?.prenume}</p>
                            <p className='font-light text-xs text-gray-500 '>vrea să fie prietenul tău</p>
                        </div>
                    </div>

                    <div className='flex gap-2'>
                    <button className='bg-[#D2FBD0] rounded-3xl py-1 px-1' onClick={()=>onAccept(req.UtilizatorPrincipal.id_utilizator)}><CircleCheck size={25} className='text-[#0D904F]' /></button> 
                        <button className='bg-[#FFD6D6] rounded-3xl py-1 px-1' onClick={()=>onDecline(req.UtilizatorPrincipal.id_utilizator)}><CircleX size={25} className='text-[#D32F2F]' /></button> 
                    </div>

                </div>))}
            </div>)}
            </div>

        )}

        if (loading) {
        return <p className="text-gray-500 font-bold">Se caută...</p>;
        }

        if (!results || results.length === 0) {
        return <p className="text-gray-400 font-bold">Niciun utilizator găsit.</p>;
        }



        return(
            
            <div className="flex flex-col gap-5 ">
                <p className="text-gray-400 font-bold">UTILIZATORI GĂSIȚI</p>
                <div className='flex flex-col gap-2'>
                    {results.map((u) => {
                        const isMe = u.id_utilizator === myId;
                        const isPending = sentIds.has(u.id_utilizator);
                        const isFriend = friendIds.has(u.id_utilizator);


                        return (
                <div  key={u.id_utilizator} className="flex bg-white rounded-xl justify-between py-3 px-4 shadow-md items-center">
                    <div className="flex gap-2">
                        <img 
                            src={`https://ui-avatars.com/api/?name=${u.nume}+${u.prenume}&background=E6E9FC&color=3F51B5&bold=true&size=120`}
                            alt="Avatar"
                            className="w-10 h-10 rounded-full"
                        />
                        <div className="flex flex-col">
                            <p className='font-bold'>{u.nume} {u.prenume}</p>
                            <p className='font-light text-xs text-gray-500 '>Adaugă-l la lista ta de prieteni</p>
                        </div>
                    </div>

                    
                   {isMe ? (
  <button
    disabled
    className="rounded-xl flex items-center gap-1 py-1 px-2 text-xs font-bold bg-gray-200 text-gray-500 cursor-not-allowed"
  >
    <UserPlus size={20} />
    <span>Tu</span>
  </button>
) : isFriend ? (
  <button
    disabled
    className="rounded-xl flex items-center gap-1 py-1 px-2 text-xs font-bold bg-emerald-100 text-emerald-700 cursor-not-allowed"
  >
    <span>Prieteni</span>
  </button>
) : isPending ? (
  <button
    className="rounded-xl flex items-center gap-1 py-1 px-2 text-xs font-bold bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
    onClick={() => onCancel(u.id_utilizator)}
  >
    <span>Anulează</span>
  </button>
) : (
  <button
    className="rounded-xl flex items-center gap-1 py-1 px-2 text-xs font-bold bg-[#D2FBD0] text-[#0D904F] hover:bg-[#bbfeb8]"
    onClick={() => onSendRequest(u.id_utilizator)}
  >
    <UserPlus size={20} />
    <span>Adaugă</span>
  </button>
)}


                                                </div>)})}
            </div>
            </div>
        )
    }

    export default ResultList;