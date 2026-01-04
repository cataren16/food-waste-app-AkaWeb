import Searchbar from "./Searchbar";
import ResultList from "./ResultsList";
import {ArrowLeft} from 'lucide-react';
const MobileSearchOverlay = ({onClose,searchText,setSearchText,results,loading,receivedRequests,loadingRequests,myId,onSendRequest,onAccept,onDecline,sentRequests,loadingSentRequests,onCancel,friends, loadingFriends}) =>{

    
    return (
        <div className="fixed inset-0 z-50 bg-slate-50 px-5 py-5 ">
            <div className="flex flex-col gap-7">
                <div className="flex gap-3 ">
                    <button className="bg-gray-100 rounded-2xl py-1 px-1" onClick={onClose}><ArrowLeft size={30} className="text-gray-500"/></button>
                    <p className="font-bold text-2xl">Găsește Prieteni</p>
                </div>
                
            <Searchbar className={"flex w-full h-10"} rounded={"rounded-xl"} backgroundInp={"bg-white"} value={searchText} onChange={setSearchText}></Searchbar>
            <ResultList results={results}
  loading={loading}
  searchText={searchText}
  receivedRequests={receivedRequests}
  loadingRequests={loadingRequests}
  myId={myId}
  onSendRequest={onSendRequest}
  onAccept={onAccept}
  onDecline={onDecline}
  sentRequests={sentRequests}
  loadingSentRequests={loadingSentRequests}
  onCancel={onCancel}friends={friends}
loadingFriends={loadingFriends}></ResultList>
            </div>
        </div>
    )
}

export default MobileSearchOverlay;