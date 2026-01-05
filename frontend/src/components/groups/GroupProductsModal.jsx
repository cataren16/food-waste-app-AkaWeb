import React, { useEffect } from "react";
import { X, Plus, Users } from "lucide-react";

function TopBadge({ label }) {
  return (
    <span className="px-4 py-1 rounded-xl bg-white/15 text-sm font-extrabold text-white/90">
      {label}
    </span>
  );
}

function ProductCard({ product, myId }) {
  const isMine = typeof product.ownerId !== "undefined" && String(product.ownerId) === String(myId);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center">
          <span className="text-gray-400 font-extrabold">{product.emoji || "🥕"}</span>
        </div>
        <div />
      </div>

      <div>
        <p className="text-xl font-extrabold text-gray-900">{product.name}</p>

        <div className="mt-1 flex items-center gap-2 text-gray-400 font-semibold">
          <Users size={16} />
          <span>{product.by}</span>
        </div>
      </div>

      <button
        type="button"
        disabled
        className={`mt-auto w-full rounded-xl font-extrabold py-3 transition ${
          isMine ? "bg-gray-100 text-gray-300 cursor-not-allowed" : "bg-gray-100 text-gray-300 cursor-not-allowed"
        }`}
      >
        {isMine ? "Produsul tău" : "Claim (dezactivat)"}
      </button>
    </div>
  );
}

function AddProductCard({ onOpen }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="bg-emerald-50/40 rounded-2xl border-2 border-dashed border-emerald-200 p-6 flex flex-col items-center justify-center gap-2 hover:bg-emerald-50 transition"
    >
      <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center">
        <Plus className="text-emerald-700" />
      </div>
      <p className="text-lg font-extrabold text-emerald-800">Adaugă Produs</p>
      <p className="text-sm font-semibold text-emerald-600">Donează ceva grupului</p>
    </button>
  );
}

export default function GroupProductsModal({
  isOpen,
  onClose,
  group,
  products = [],
  myId,
  onOpenAddProduct,
}) {
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !group) return null;

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 px-2 md:px-6"
      onMouseDown={onClose}
    >
      <div
        className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="relative bg-gradient-to-r from-emerald-700 to-emerald-500 px-6 md:px-10 py-8 md:py-10">
          <button
            type="button"
            className="absolute right-4 top-4 md:right-6 md:top-6 w-12 h-12 rounded-full bg-white/15 hover:bg-white/20 flex items-center justify-center text-white transition"
            aria-label="Închide"
            onClick={onClose}
          >
            <X />
          </button>

          <div className="flex items-center gap-4">
            <TopBadge label={(group.dietLabel || "OMNIVOR").toUpperCase()} />
            <span className="text-sm font-semibold text-white/80">
              {products.length} produse active
            </span>
          </div>

          <h2 className="mt-3 text-4xl md:text-5xl font-extrabold text-white">
            {group.name}
          </h2>
        </div>

        <div className="max-h-[70vh] overflow-y-auto p-4 md:p-8 bg-gray-50">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            <AddProductCard onOpen={onOpenAddProduct} />
            {products.map((p) => (
              <ProductCard key={p.id} product={p} myId={myId} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
