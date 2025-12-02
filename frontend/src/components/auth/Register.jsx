import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    nume: '', prenume: '', email: '', parola: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (response.ok) {
        alert("Cont creat! Te rugăm să te loghezi.");
        navigate('/login');
      } else {
        setError(data.message || 'Eroare la înregistrare');
      }
    } catch (err) {
      setError('Eroare de server.');
    }
  };

  return (
    <div className="flex h-screen w-full">
      {/* STANGA VERDE */}
      <div className="hidden md:flex w-1/2 bg-emerald-600 flex-col justify-center items-center text-white p-12">
        <h1 className="text-4xl font-bold mb-4">Bine ai venit!</h1>
        <p className="text-lg text-center max-w-sm">Alătură-te comunității noastre și începe să salvezi mâncarea chiar azi.</p>
      </div>

      {/* DREAPTA FORMULAR */}
      <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-md space-y-6">
          <h2 className="text-3xl font-bold text-gray-900">Înregistrare</h2>
          {error && <div className="text-red-600 text-sm bg-red-50 p-2 rounded">{error}</div>}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input name="nume" placeholder="Nume" onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" required />
              <input name="prenume" placeholder="Prenume" onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" required />
            </div>
            <input type="email" name="email" placeholder="Email" onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" required />
            <input type="password" name="parola" placeholder="Parola" onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" required />
            
            <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-3 rounded-lg hover:bg-emerald-700 transition">Creează Cont</button>
          </form>
          
          <p className="text-center text-sm text-gray-600">
            Ai deja cont? <Link to="/login" className="text-emerald-600 font-bold hover:underline">Loghează-te</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;