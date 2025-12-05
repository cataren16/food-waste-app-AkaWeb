import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';

// 1. IMPORTĂM COMPONENTELE TALE REALE (care merg deja)
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// 2. IMPORTĂM SIDEBAR-UL NOU
import Sidebar from './components/Sidebar';

// --- 3. COMPONENTE TEMPORARE PENTRU FEED SI GRUPURI ---
// Le scriu aici doar ca să nu îți dea eroare că lipsesc fișierele.
// Când creezi fișierele reale (ex: pages/Groups.jsx), le vei importa sus în loc de astea.
const Feed = () => <div className="text-2xl font-bold">Aici este Feed-ul (Cu Meniu!) 🏠</div>;
const Groups = () => <div className="text-2xl font-bold">Aici sunt Grupurile (Cu Meniu!) 👥</div>;


// --- 4. DEFINIM "RAMA" (LAYOUT-UL PRIVAT) ---
const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar-ul stă fix */}
      <Sidebar />

      {/* Conținutul se schimbă în dreapta */}
      {/* md:ml-64 face loc pentru sidebar pe desktop */}
      {/* mb-16 face loc pentru meniu jos pe mobil */}
      <main className="flex-1 p-8 mb-16 md:mb-0 md:ml-64 transition-all duration-300">
        <Outlet />
      </main>
    </div>
  );
};

function App() {
  return (
    <Routes>
      {/* --- ZONA 1: PUBLICĂ (Fără Sidebar) --- */}
      {/* Aici folosim componentele tale reale care merg deja */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* --- ZONA 2: PRIVATĂ (Cu Sidebar) --- */}
      {/* Orice rută pusă aici va avea automat Sidebar-ul lipit */}
      <Route element={<DashboardLayout />}>
        
        {/* Aici pui paginile tale noi */}
        <Route path="/feed" element={<Feed />} />
        <Route path="/groups" element={<Groups />} />

      </Route>
    </Routes>
  );
}

export default App;