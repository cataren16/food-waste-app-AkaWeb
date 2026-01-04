import { useState, useEffect } from "react";
import { data } from "react-router-dom";
import ProductCard from "../components/ProductCard";

const FeedPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading]=useState(true);
    const [error, setError]=useState(null);

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

    const handleClaim = async (productId) => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if(!confirm("Ești sigur că vrei să claim acest produs?")) return;

        try{
            const response = await fetch(`http://localhost:3000/api/marketplace/claim`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id_produs: productId,
                    id_solicitant: storedUser.id_utilizator
                })
            });

            const result = await response.json();
            if(response.ok){
                alert("Solicitare trimisa cu succes!Proprietarul va fi notificat.");
                setProducts(prev=>prev.filter(p=>p.id_produs!==productId));
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
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8">
                        {products.map((p) => (
                            <ProductCard 
                                key={p.id_produs} 
                                product={p} 
                                onClaim={handleClaim} 
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FeedPage;

