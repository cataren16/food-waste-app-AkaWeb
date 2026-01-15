import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Plus, Loader, Quote, X, Camera, Pencil, Check } from 'lucide-react';
import ProductCard from '../components/ProductCard';

const API_URL = "https://food-waste-akaweb-dwcdcearcweeeret.canadacentral-01.azurewebsites.net";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nrPrieteni, setNrPrieteni] = useState(0);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editDesc, setEditDesc] = useState('');

  const [newItem, setNewItem] = useState({
    denumire_produs: '',
    categorie: 'Altele',
    cantitate: 1,
    data_expirare: ''
  });

  const { triggerRefresh, isAddModalOpen, setIsAddModalOpen } = useOutletContext() || { 
    triggerRefresh: () => {},
    isAddModalOpen: false,
    setIsAddModalOpen: () => {}
  };

  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const storedUserStr = localStorage.getItem('user');
    if (!storedUserStr) {
      navigate('/login');
      return;
    }

    let localUserData;
    try {
      localUserData = JSON.parse(storedUserStr);
      if (!localUserData || !localUserData.id_utilizator) {
         throw new Error("Date incomplete");
      }
    } catch (e) {
      localStorage.removeItem('user');
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const userId = localUserData.id_utilizator;

        const userRes = await fetch(`${API_URL}/api/users/${userId}`);
        
        if (userRes.ok) {
            const freshUserData = await userRes.json();
            setUser(freshUserData); 
            setEditDesc(freshUserData.descriere || ""); 
            localStorage.setItem('user', JSON.stringify(freshUserData)); 
        } else {
            setUser(localUserData);
            setEditDesc(localUserData.descriere || "");
        }

        const prodRes = await fetch(`${API_URL}/api/products`);
        if (prodRes.ok) {
          const allProducts = await prodRes.json();
          const myProducts = allProducts.filter(p => String(p.id_utilizator) === String(userId));
          setProducts(myProducts);
        }

        const friendsRes = await fetch(`${API_URL}/api/friends/list/${userId}`);
        if (friendsRes.ok) {
            const data = await friendsRes.json();
            setNrPrieteni(data.prietenii ? data.prietenii.length : 0);
        }

      } catch (err) {
        console.error(err);
        setUser(localUserData);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleUpdateDescription = async () => {
    try {
        const response = await fetch(`${API_URL}/api/users/update/${user.id_utilizator}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ descriere: editDesc })
        });

        if (response.ok) {
            const updatedUser = { ...user, descriere: editDesc };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setIsEditing(false); 
            alert("Descriere actualizată!");
        } else {
            alert("Nu s-a putut actualiza descrierea.");
        }
    } catch (error) {
        console.error(error);
        alert("Eroare la server.");
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newItem.denumire_produs || !newItem.data_expirare) {
        alert("Te rugăm să completezi numele și data expirării!");
        return;
    }

    const formData = new FormData();
    formData.append('denumire_produs', newItem.denumire_produs);
    formData.append('categorie', newItem.categorie);
    formData.append('cantitate', newItem.cantitate);
    formData.append('data_expirare', newItem.data_expirare);
    formData.append('id_utilizator', user.id_utilizator);

    if (selectedFile) {
        formData.append('imagine', selectedFile);
    }

    try {
        const response = await fetch(`${API_URL}/api/products/add`, {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            const result = await response.json();
            setProducts([...products, result.product]);
            setIsAddModalOpen(false);
            setNewItem({ denumire_produs: '', categorie: 'Altele', cantitate: 1, data_expirare: '' });
            triggerRefresh();
            setSelectedFile(null);
        } else {
            const errorData = await response.json();
        }
    } catch (error) {
        console.error(error);
        alert("Eroare server.");
    }
  };

  const handleDeleteProduct = async (id) => {
      if(!confirm("Sigur vrei să ștergi acest produs?")) return;

      try {
          const response = await fetch(`${API_URL}/api/products/delete/${id}`, {
              method: 'DELETE'
          });

          if(response.ok) {
              setProducts(products.filter(p => p.id_produs !== id));
              triggerRefresh();
          } else {
              alert("Nu s-a putut șterge produsul.");
          }
      } catch (error) {
          console.error(error);
      }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-emerald-600">
        <Loader className="animate-spin mr-2" /> Se încarcă profilul...
      </div>
    );
  }

  const avatarUrl = user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.nume}${user?.prenume}`;

  return (
    <div className="w-full max-w-5xl mx-auto font-sans relative">
      
      {isAddModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
              <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 relative animate-in fade-in zoom-in duration-200">
                  <button 
                      onClick={() => setIsAddModalOpen(false)}
                      className="absolute top-5 right-5 text-gray-400 hover:text-red-500 transition-colors bg-gray-50 p-2 rounded-full"
                  >
                      <X size={20} />
                  </button>
                  
                  <h2 className="text-2xl font-extrabold text-gray-800 mb-6 flex items-center gap-2">
                      <span className="bg-orange-100 p-2 rounded-xl text-orange-500"><Plus size={24}/></span>
                      Adaugă Produs
                  </h2>
                  
                  <form onSubmit={handleAddProduct} className="space-y-5">
                      <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Denumire Produs</label>
                          <input 
                              type="text" 
                              className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all"
                              placeholder="ex: Iaurt Grecesc"
                              value={newItem.denumire_produs}
                              onChange={(e) => setNewItem({...newItem, denumire_produs: e.target.value})}
                          />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Categorie</label>
                              <select 
                                  className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                                  value={newItem.categorie}
                                  onChange={(e) => setNewItem({...newItem, categorie: e.target.value})}
                              >
                                  <option>Legume</option>
                                  <option>Fructe</option>
                                  <option>Lactate</option>
                                  <option>Panificație</option>
                                  <option>Carne</option>
                                  <option>Altele</option>
                              </select>
                          </div>
                          <div>
                              <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Cantitate</label>
                              <input 
                                  type="number" 
                                  min="1"
                                  className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                                  value={newItem.cantitate}
                                  onChange={(e) => setNewItem({...newItem, cantitate: e.target.value})}
                              />
                          </div>
                      </div>

                      <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Data Expirării</label>
                          <input 
                              type="date" 
                              className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                              value={newItem.data_expirare}
                              onChange={(e) => setNewItem({...newItem, data_expirare: e.target.value})}
                          />
                      </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-700 ml-1">Poza Produsului</label>
                        <div 
                            onClick={() => fileInputRef.current.click()}
                            className="w-full p-4 border-2 border-dashed border-emerald-100 rounded-xl bg-emerald-50/30 hover:bg-emerald-50 hover:border-emerald-300 transition-all cursor-pointer flex flex-col items-center justify-center gap-2"
                        >
                            <input 
                            type="file" 
                            ref={fileInputRef} 
                            className="hidden" 
                            accept="image/*" 
                            onChange={(e) => setSelectedFile(e.target.files[0])} 
                            />
                            
                            {selectedFile ? (
                            <div className="flex items-center gap-2 text-emerald-700">
                                <div className="bg-emerald-100 p-2 rounded-lg">
                                <Camera size={18} />
                                </div>
                                <span className="text-sm font-medium truncate max-w-[200px]">{selectedFile.name}</span>
                            </div>
                            ) : (
                            <>
                                <Camera className="text-emerald-400" size={24} />
                                <p className="text-xs text-emerald-600/70 font-medium">Apasă aici pentru a încărca o imagine</p>
                            </>
                            )}
                        </div>
                    </div>

                      <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-200 transition-transform active:scale-95 mt-4 text-lg">
                          Salvează în Frigider
                      </button>
                  </form>
              </div>
          </div>
      )}

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">PROFIL</h1>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 flex flex-col md:flex-row items-center gap-8 mb-10 relative overflow-hidden group">
        <div className="relative">
            <img 
              src={avatarUrl} 
              alt="Profile" 
              className="w-36 h-36 rounded-full bg-emerald-50 object-cover border-[6px] border-white shadow-lg" 
            />
        </div>

        <div className="flex-1 text-center md:text-left space-y-4 z-10">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">{user?.nume} {user?.prenume}</h2>
                <span className="bg-emerald-100 text-emerald-700 text-xs px-3 py-1.5 rounded-full font-bold uppercase tracking-wider shadow-sm">
                     Membru
                </span>
            </div>
            
            <div className="relative p-4 bg-emerald-50/50 rounded-2xl max-w-xl mx-auto md:mx-0 border border-emerald-100/50">
                <Quote size={24} className="absolute -top-2 -left-2 text-emerald-300 fill-emerald-100 rotate-180" />
                
                {isEditing ? (
                    <div className="relative z-10 flex gap-2 items-start">
                        <textarea 
                            className="w-full p-2 rounded-lg border border-emerald-300 focus:ring-2 focus:ring-emerald-500 outline-none text-gray-700 bg-white"
                            rows="3"
                            value={editDesc}
                            onChange={(e) => setEditDesc(e.target.value)}
                        />
                        <div className="flex flex-col gap-2">
                            <button 
                                onClick={handleUpdateDescription}
                                className="p-1.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 shadow-sm"
                                title="Salvează"
                            >
                                <Check size={18} />
                            </button>
                            <button 
                                onClick={() => {
                                    setIsEditing(false);
                                    setEditDesc(user.descriere || "");
                                }}
                                className="p-1.5 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 shadow-sm"
                                title="Anulează"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="relative z-10 group/desc">
                         <p className="text-gray-600 italic leading-relaxed pl-6 font-medium pr-8 min-h-[3rem]">
                            "{user?.descriere || "Nu există o descriere."}"
                        </p>
                        <button 
                            onClick={() => setIsEditing(true)}
                            className="absolute top-0 right-0 p-1.5 text-emerald-400 hover:text-emerald-600 hover:bg-emerald-100 rounded-lg transition-all opacity-0 group-hover/desc:opacity-100"
                            title="Editează descrierea"
                        >
                            <Pencil size={16} />
                        </button>
                    </div>
                )}
            </div>

            <div className="flex justify-center md:justify-start gap-12 mt-8">
                <div className="text-center border-r border-gray-100 pr-12">
                <p className="text-3xl font-black text-emerald-600">{products.length}</p>
                <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase mt-1">Produse</p>
                </div>

                <div className="text-center">
                <p className="text-3xl font-black text-orange-500">{nrPrieteni}</p>
                <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase mt-1">Prieteni</p>
                </div>
            </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <span className="text-emerald-500 text-3xl inline-block transform -rotate-12"></span>Frigiderul Meu
        </h2>
        <button 
            onClick={() => setIsAddModalOpen(true)}
            className="hidden md:flex bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-orange-200 items-center gap-2 transition-transform transform hover:-translate-y-0.5 active:scale-95"
        >
            <Plus size={20} /> Adaugă în Listă
        </button>
      </div>

      {products.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-4">
              <div className="text-6xl">🍃</div>
              <p className="text-gray-500 font-medium text-lg">Frigiderul tău este gol!</p>
              <p className="text-sm text-gray-400">Apasă pe butonul portocaliu pentru a adăuga primul produs.</p>
          </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-8">
            {products.map((produs) => (
                <ProductCard 
                    key={produs.id_produs} 
                    product={produs} 
                    isProfile={true} 
                    onDelete={handleDeleteProduct} 
                />
            ))}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;