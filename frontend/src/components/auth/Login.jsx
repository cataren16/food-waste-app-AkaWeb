import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [parola, setParola] = useState('');
  
  // 1. STAREA PENTRU OCHIȘOR
  const [showPassword, setShowPassword] = useState(false);
  
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, parola }),
      });
      const data = await response.json();
      if (response.ok) {
        if (data.token) {
            
            localStorage.setItem('token', data.token);
            
            if (data.user) {
                localStorage.setItem('user', JSON.stringify(data.user));
            }

            alert("Autentificare reușită! 🌿");
            navigate('/feed'); 
        } else {
            console.error("4. [Eroare] Login reușit dar lipsește token-ul din răspuns!");
            setError('Eroare internă: Serverul nu a trimis token-ul.');
        }

      } else {
        // Aici ajungem dacă parola e greșită sau userul nu există
        setError(data.message || 'Date incorecte');
      }
    } catch (err) {
      console.error("5. [Eroare Rețea]", err);
      setError('Nu s-a putut conecta la server. Verifică dacă serverul (port 3000) este pornit.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-emerald-50 px-4 font-sans">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md">
        
        {}
        <div className="flex justify-center mb-4">
          <div className="bg-emerald-100 p-3 rounded-2xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
        </div>
        <h2 className="text-2xl font-extrabold text-center text-gray-800 mb-1">Bine ai venit!</h2>
        <p className="text-center text-gray-500 text-sm mb-8">Salvează mâncare, împarte cu prietenii.</p>

        {error && <div className="mb-4 p-2 bg-red-50 text-red-600 text-sm rounded border border-red-100 text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 pl-1">Adresa de email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-colors"
              required 
            />
          </div>

          {}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1 pl-1">Parola</label>
            <input 
              type={showPassword ? "text" : "password"} 
              value={parola}
              onChange={(e) => setParola(e.target.value)}
              className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-colors"
              required 
            />
            
            {/* Butonul cu Ochisor */}
            <button
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-[38px] text-gray-400 hover:text-emerald-600 transition-colors"
            >
              {showPassword ? (
                // Icoana Ochi Deschis
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              ) : (
                // Icoana Ochi Inchis
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.059 10.059 0 011.591-3.077" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.101 6.101a10.059 10.059 0 015.899-1.101c4.478 0 8.268 2.943 9.542 7a10.057 10.057 0 01-1.591 3.077" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M9.88 9.88a3 3 0 104.24 4.24" />
                </svg>
              )}
            </button>
          </div>

          <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-emerald-500/30 transition duration-300 transform hover:-translate-y-0.5">
            Autentificare
          </button>
        </form>

        <div className="mt-6 text-center space-y-2">
          <p className="text-sm font-bold text-emerald-700">
            Nu ai cont? <Link to="/register" className="hover:underline">Creează unul</Link>
          </p>
          <a href="#" className="block text-xs text-gray-400 hover:text-gray-600">Am uitat parola</a>
        </div>
      </div>
    </div>
  );
};

export default Login;