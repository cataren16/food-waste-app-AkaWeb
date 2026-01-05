import { useState, useEffect } from "react";
import { data } from "react-router-dom";
import ProductCard from "../components/ProductCard";

const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
};

const FeedPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading]=useState(true);
    const [error, setError]=useState(null);

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [claimQuantity, setClaimQuantity] = useState(1);

    const user = JSON.parse(localStorage.getItem("user")) || {};

    useEffect(() => {
        const fetchFeedProducts = async () => {
            try{
                setLoading(true);
                const storedUser = JSON.parse(localStorage.getItem("user"));
                if(!storedUser || !storedUser.id_utilizator){
                    setError("Utilizatorul nu e logat.");
                    setLoading(false);
                    return;
                }

                const response = await fetch(`http://localhost:3000/api/marketplace/feed?userId=${storedUser.id_utilizator}`);
                if(!response.ok){
                    throw new Error("Eroare la preluarea produselor.");
                }

                const data = await response.json();
                setProducts(data);
            }catch(err){
                setError(err.message);
                console.error("Eroare la fetch", err);
            }
            finally{
                setLoading(false);
            }
        };
        fetchFeedProducts();
    }, []);

      const handleOpenClaimModal = (product)=>{
        setSelectedProduct(product);
        setClaimQuantity(1);
        setShowModal(true);
    }

    const handleConfirmClaim = async () => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        try{
            const response = await fetch(`http://localhost:3000/api/marketplace/claim`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id_produs: selectedProduct.id_produs,
                    id_solicitant: storedUser.id_utilizator,
                    nr_bucati: claimQuantity
                })
            });

            const result = await response.json();
            if(response.ok){
                alert("Solicitare trimisa cu succes!Proprietarul va fi notificat.");
                setProducts(prev=>prev.filter(p=>p.id_produs!==selectedProduct.id_produs));
                setShowModal(false);
            }else{
                alert(result.message || "Eroare la claim produs.");
            }
        }catch(err){
            console.error("Eroare la claim produs", err);
            alert("Eroare de conexiune cu serverul.");
    }
};

    if(loading){
        return (
            <div className="flex h-screen items-center justify-center text-emerald-600 font-bold">
                <div className="animate-spin mr-2">⏳</div> Se încarcă bunătățile...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="mb-8">
                <h1 className="text-4xl font-black text-gray-900 flex items-center gap-2">
                    Salut, {user.prenume}!
                </h1>
                <p className="text-gray-500 font-medium text-lg">
                    Vezi ce alimente au nevoie de o nouă casă astăzi.
                </p>
            </div>

            {error && (
                <div className="max-w-7xl mx-auto bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 mb-6 text-center">
                    {error}
                </div>
            )}

            <div className="max-w-7xl mx-auto">
                {products.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-[2rem] shadow-sm border border-dashed border-gray-300">
                        <div className="text-6xl mb-4">🥗</div>
                        <h3 className="text-xl font-bold text-gray-700">Feed-ul este gol</h3>
                        <p className="text-gray-400">Prietenii tăi nu au postat nimic momentan. Revino mai târziu!</p>
                    </div>
                ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8">
            {products.map((p) => (
                <ProductCard 
                    key={p.id_produs} 
                    product={p} 
                    onClaim={handleOpenClaimModal} 
                />
            ))}
            </div>
            )}
    </div>

    {showModal && selectedProduct && (
        
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div 
                        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" 
                        onClick={() => setShowModal(false)}
                    ></div>

                    <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-2xl font-black text-gray-800">{selectedProduct.denumire_produs}</h2>
                                <span className="text-xs font-bold uppercase tracking-widest text-emerald-500 bg-emerald-50 px-2 py-1 rounded-md">
                                    {selectedProduct.categorie}
                                </span>
                            </div>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between items-center bg-orange-50 p-3 rounded-2xl">
                                <span className="text-sm font-bold text-orange-700">Expira la:</span>
                                <span className="text-sm font-black text-orange-700">{formatDate(selectedProduct.data_expirare)}</span>
                            </div>

                            <div className="p-4 bg-gray-50 rounded-2xl">
                                <label className="block text-xs font-black text-gray-400 uppercase mb-2">
                                    Câte bucăți dorești?
                                </label>
                                <select 
                                    className="w-full bg-white border-2 border-gray-100 rounded-xl p-3 font-bold text-gray-700 outline-none focus:border-emerald-500 transition-all"
                                    value={claimQuantity}
                                    onChange={(e) => setClaimQuantity(parseInt(e.target.value))}
                                >
                                    {[...Array(selectedProduct.cantitate)].map((_, i) => (
                                        <option key={i + 1} value={i + 1}>
                                            {i + 1} {i + 1 === 1 ? 'bucată' : 'bucăți'}
                                        </option>
                                    ))}
                                </select>
                                <p className="mt-2 text-[10px] text-gray-400 font-medium italic">
                                    Stoc disponibil: {selectedProduct.cantitate} bucăți
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <button 
                                onClick={handleConfirmClaim}
                                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black py-4 rounded-2xl shadow-lg shadow-emerald-100 transition-all active:scale-95"
                            >
                                Trimitere Solicitare
                            </button>
                            <button 
                                onClick={() => setShowModal(false)}
                                className="w-full py-3 text-gray-400 font-bold text-sm hover:text-gray-600 transition-colors"
                            >
                                Mai târziu
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};


export default FeedPage;

