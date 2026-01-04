import React, {useState,useEffect} from "react";
import dummyImage from "../assets/kitten.jpg";

const ProductCard = ({product, onClaim})=>{

    const getDaysLeft = (dateString) => {
        if(!dateString) return null;
        const today = new Date();
        const expirationDate = new Date(dateString);
        const timeDiff = expirationDate - today;
        const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        return daysLeft<0?"Expirat":`${daysLeft} zile`;
    };

    return (
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group relative">
            <div className="absolute top-4 left-4 bg-emerald-100 text-emerald-700 text-[10px] px-2 py-1 rounded-lg font-bold uppercase tracking-wider z-10">{product.categorie}</div>
            <div className="h-28 bg-gray-50 rounded-2xl flex items-center justify-center text-6xl mb-5 group-hover:scale-110 transition-transform duration-300">
                <img src={dummyImage} alt="{product.denumire_produs}" />
            </div>
            <div className="space-y-1">
                <h3 className="text-lg font-bold text-gray-800 line-clamp-1">{product.denumire_produs}</h3>
                <p className="text-xs text-gray-500 font-medium italic">{product.owner ? `${product.owner.nume}` : `Utilizator #${product.id_utilizator}`}</p>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-xs font-bold mt-2">
                    <span>Exp: {getDaysLeft(product.data_expirare)}</span>
                </div>
                <button className="w-full mt-5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-md shadow-emerald-100" 
                    onClick={()=>onClaim(product.id_produs)}>
                    <span>Claim</span>
                </button>
            </div>
        </div>
    );
};

export default ProductCard;