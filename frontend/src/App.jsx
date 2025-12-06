import React, { useEffect , useState} from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';

import Login from './components/auth/Login';
import Register from './components/auth/Register';

import Sidebar from './components/Sidebar';

const Feed = () => <div className="text-2xl font-bold">Aici este Feed-ul (Cu Meniu!) </div>;
const Groups = () => <div className="text-2xl font-bold">Aici sunt Grupurile (Cu Meniu!) </div>;


const DashboardLayout = () => {
  const [refreshTrigger, setRefreshTrigger]=useState(0);
const triggerRefresh=()=>{
  setRefreshTrigger(prev=>prev+1);
};
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {}
      <Sidebar />

      {}
      {}
      {}
      <main className="flex-1 p-8 mb-16 md:mb-0 md:ml-64 transition-all duration-300">
        <Outlet />
      </main>
    </div>
  );
};

function App() {
  
  return (
    <Routes>
      {}
      {}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {}
      {}
      <Route element={<DashboardLayout />}>
        
        {}
        <Route path="/feed" element={<Feed />} />
        <Route path="/groups" element={<Groups />} />

      </Route>
    </Routes>
  );
}

export default App;