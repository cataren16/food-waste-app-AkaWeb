import React from "react";
import { Trash2 } from "lucide-react";

const ProductCard = ({ product, onClaim, onDelete, isProfile = false }) => {
    
    const imageUrl = product.imagine 
        ? `http://localhost:3000/${product.imagine}` 
        : "https://placehold.co/400x300?text=Fara+Imagine";

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
        <div className="bg-white p-4 md:p-5 rounded-3xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group relative 
                        flex flex-row md:flex-col gap-4 md:gap-0">
            
            <div className="absolute top-2 left-2 md:top-4 md:left-4 bg-emerald-100 text-emerald-700 text-[9px] md:text-[10px] px-2 py-1 rounded-lg font-bold uppercase tracking-wider z-10">
                {product.categorie}
            </div>

            {isProfile && (
                <button 
                    onClick={() => onDelete(product.id_produs)}
                    className="absolute top-2 right-2 md:top-4 md:right-4 text-gray-400 hover:text-red-600 transition-all p-1.5 md:p-2 bg-white rounded-full shadow-sm z-10 border border-transparent hover:border-red-100"
                >
                    <Trash2 size={16} />
                </button>
            )}

            <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-full md:h-48 bg-gray-100 rounded-2xl overflow-hidden shrink-0 md:mb-5">
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

            <div className="flex-1 flex flex-col justify-between space-y-1">
                <div>
                    <h3 className="text-sm md:text-lg font-bold text-gray-800 line-clamp-1">{product.denumire_produs}</h3>
                    
                    {!isProfile && (
                        <p className="text-[10px] md:text-xs text-gray-500 font-medium italic">
                            {product.owner ? `${product.owner.nume}` : `Utilizator #${product.id_utilizator}`}
                        </p>
                    )}

                    <p className="text-xs md:text-sm text-gray-500 font-medium mt-1 md:mt-2 flex items-center gap-1">
                        ⏳ <span className={getDaysLeft(product.data_expirare) === "Expirat" ? "text-red-500 font-bold" : "text-emerald-600 font-semibold"}>
                            {getDaysLeft(product.data_expirare)}
                        </span>
                    </p>

                    <div className="hidden sm:block w-full bg-emerald-100/50 rounded-full h-1.5 md:h-2 overflow-hidden mt-2">
                        <div 
                            className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                            style={{ width: `${getProgress(product.data_expirare)}%` }}
                        ></div>
                    </div>
                </div>

                {!isProfile && (
                    <button className="w-full mt-2 md:mt-5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 md:py-3 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-md shadow-emerald-100 text-xs md:text-base" 
                        onClick={() => onClaim(product)}>
                        <span>Claim</span>
                    </button>
                )}
            </div>
        </div>
    );
};

export default ProductCard;