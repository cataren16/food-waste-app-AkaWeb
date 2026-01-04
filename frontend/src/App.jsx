import React, { useState } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Sidebar from './components/Sidebar';
import ProfilePage from './pages/ProfilePage';
import Navbar from './components/Navbar';

const Feed = () => <div className="text-2xl font-bold p-8">Aici este Feed-ul</div>;
const Groups = () => <div className="text-2xl font-bold p-8">Aici sunt Grupurile</div>;

const DashboardLayout = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const triggerRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

 return (
    // Container Principal: Flex orizontal (Stânga Sidebar | Dreapta Content)
    <div className="min-h-screen bg-gray-50 flex"> 
      
      {/* 1. Sidebar - Stă fix în stânga */}
      <Sidebar refreshTrigger={refreshTrigger} />

      {/* 2. Content Wrapper - Ocupă tot spațiul rămas în dreapta */}
      {/* md:ml-64 este necesar DOAR dacă Sidebar-ul tău are position: fixed. 
          Dacă Sidebar-ul e static în flex, scoate md:ml-64 */}
      <div className="flex-1 flex flex-col md:ml-64 transition-all duration-300">
        
        {/* A. Navbar - Stă sus în wrapper */}
        <Navbar />

        {/* B. Main Content - Stă sub Navbar și conține paginile */}
        <main className="flex-1 p-4 md:p-8 bg-gray-50">
          <Outlet context={{ triggerRefresh }} />
        </main>
      </div>

    </div>
  );
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<DashboardLayout />}>
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/groups" element={<Groups />} />
      </Route>
      
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;