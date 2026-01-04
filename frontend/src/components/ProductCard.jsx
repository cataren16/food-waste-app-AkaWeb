import React from "react";
import { Trash2 } from "lucide-react";

const ProductCard = ({ product, onClaim, onDelete, isProfile = false }) => {
    
    const imageUrl = `http://localhost:3000/uploads/produs_${product.id_produs}.jpg`;

    const getDaysLeft = (dateString) => {
        if (!dateString) return "N/A";
        const today = new Date();
        const expirationDate = new Date(dateString);
        const timeDiff = expirationDate - today;
        const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        return daysLeft < 0 ? "Expirat" : `${daysLeft} zile`;
    };

    const getProgress = (dateString) => {
        const daysLeftStr = getDaysLeft(dateString);
        if (daysLeftStr === "Expirat") return 0;
        const days = parseInt(daysLeftStr);
        if (isNaN(days)) return 0;
        if (days > 30) return 100;
        return (days / 30) * 100;
    };

    return (
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group relative">
            <div className="absolute top-4 left-4 bg-emerald-100 text-emerald-700 text-[10px] px-2 py-1 rounded-lg font-bold uppercase tracking-wider z-10">
                {product.categorie}
            </div>

            {isProfile && (
                <button 
                    onClick={() => onDelete(product.id_produs)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-red-600 transition-all p-2 bg-white rounded-full shadow-sm z-10 border border-transparent hover:border-red-100"
                >
                    <Trash2 size={18} />
                </button>
            )}

            <div className="h-48 bg-gray-100 rounded-2xl overflow-hidden mb-5">
                <img 
                    src={imageUrl} 
                    alt={product.denumire_produs}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://placehold.co/400x300?text=Fara+Imagine";
                    }}
                />
            </div>

            <div className="space-y-1">
                <h3 className="text-lg font-bold text-gray-800 line-clamp-1">{product.denumire_produs}</h3>
                
                {!isProfile && (
                    <p className="text-xs text-gray-500 font-medium italic">
                        {product.owner ? `${product.owner.nume}` : `Utilizator #${product.id_utilizator}`}
                    </p>
                )}

                <p className="text-sm text-gray-500 font-medium mt-2 flex items-center gap-1">
                    ⏳ Exp: <span className={getDaysLeft(product.data_expirare) === "Expirat" ? "text-red-500 font-bold" : "text-emerald-600"}>
                        {getDaysLeft(product.data_expirare)}
                    </span>
                </p>

                <div className="w-full bg-emerald-100/50 rounded-full h-2 overflow-hidden mt-2">
                    <div 
                        className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                        style={{ width: `${getProgress(product.data_expirare)}%` }}
                    ></div>
                </div>

                {!isProfile && (
                    <button className="w-full mt-5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-md shadow-emerald-100" 
                        onClick={() => onClaim(product)}>
                        <span>Claim</span>
                    </button>
                )}
            </div>
        </div>
    );
};

export default ProductCard;