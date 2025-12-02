import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [parola, setParola] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    // ... logica de login ramane la fel ...
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, parola }),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Login reușit!");
      } else {
        setError(data.message || 'Date incorecte');
      }
    } catch (err) {
      setError('Eroare server');
    }
  };

  return (
    <div className="flex h-screen w-full font-sans">
      {/* PARTEA STÂNGĂ (VERDE) - Ascunsă pe mobil (hidden), vizibilă pe desktop (md:flex) */}
      <div className="hidden md:flex w-1/2 bg-emerald-600 flex-col justify-center items-center text-white p-12 relative overflow-hidden">
        
        {/* Decor fundal (cercuri subtile) */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-emerald-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>

        <div className="z-10 text-center space-y-8">
          <div className="flex items-center justify-center gap-3">
            {/* Logo Frunză */}
            <div className="bg-white p-3 rounded-full shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h1 className="text-5xl font-bold tracking-tight">AkaWeb</h1>
          </div>
          
          <div className="space-y-4 max-w-md mx-auto">
            <p className="text-xl font-medium leading-relaxed">
              Combate risipa alimentară împreună cu comunitatea ta.
            </p>
            <p className="text-emerald-100">
              Salvează mâncarea, salvează planeta! 🌍
            </p>
          </div>
          
          <p className="absolute bottom-8 text-xs text-emerald-200">© 2023 Echipa AkaWeb</p>
        </div>
      </div>

      {/* PARTEA DREAPTĂ (ALBĂ) - Formularul */}
      <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Autentificare</h2>
            <p className="text-gray-500">Introdu datele pentru a continua.</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <input 
                type="email" 
                placeholder="nume@exemplu.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:border-transparent transition-all duration-200"
                required 
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Parolă</label>
              <input 
                type="password" 
                placeholder="••••••••"
                value={parola}
                onChange={(e) => setParola(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:border-transparent transition-all duration-200"
                required 
              />
              <div className="flex justify-end mt-2">
                <a href="#" className="text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors">
                  Ai uitat parola?
                </a>
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-emerald-500/30 transform transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
            >
              Intră în cont
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600">
            Nu ai cont? 
            <Link to="/register" className="ml-1 font-bold text-emerald-600 hover:text-emerald-700 hover:underline transition-colors">
              Înregistrează-te
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;