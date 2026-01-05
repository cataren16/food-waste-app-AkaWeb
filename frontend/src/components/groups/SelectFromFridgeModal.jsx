import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Search } from "lucide-react";

function FridgeItem({ item, onAdd }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center">
          <span className="text-gray-400 font-extrabold">{item.emoji || "🍽️"}</span>
        </div>

        <div className="flex flex-col">
          <p className="text-lg font-extrabold text-gray-900 leading-tight">{item.name}</p>
          <p className="text-sm text-gray-400 font-semibold">Cantitate: {item.qty}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onAdd(item)}
        className="w-12 h-12 rounded-full border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center text-gray-300 text-2xl leading-none"
        aria-label="Adaugă produs"
      >
        +
      </button>
    </div>
  );
}

export default function SelectFromFridgeModal({ isOpen, onClose, onAddFromFridge, items = [] }) {
  const [q, setQ] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) setQ("");
  }, [isOpen]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return items;
    return items.filter((x) => x.name.toLowerCase().includes(query));
  }, [items, q]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 px-3 md:px-6" onMouseDown={onClose}>
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden" onMouseDown={(e) => e.stopPropagation()}>
        <div className="bg-emerald-50 px-6 md:px-10 py-6 flex items-start justify-between">
          <div className="flex items-start gap-4">
            <button type="button" onClick={onClose} className="mt-1 p-2 rounded-xl hover:bg-emerald-100 text-emerald-700" aria-label="Înapoi">
              <ArrowLeft />
            </button>

            <div>
              <div className="flex items-center gap-3">
                <p className="text-2xl font-extrabold text-emerald-800">Frigiderul Tău</p>
                <span className="px-4 py-1 rounded-2xl bg-emerald-100 text-emerald-700 font-extrabold text-sm">{items.length} disponibile</span>
              </div>
              <p className="text-sm font-semibold text-emerald-700/70">Selectează produsele pe care vrei să le donezi grupului</p>
            </div>
          </div>
        </div>

        <div className="px-6 md:px-10 py-6">
          <div className="relative">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Caută în frigider..."
              className="w-full rounded-2xl bg-gray-50 border border-gray-100 px-12 py-4 outline-none focus:border-emerald-300 transition"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
          </div>
        </div>

        <div className="px-6 md:px-10 pb-10 max-h-[65vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((item) => (
              <FridgeItem key={item.id} item={item} onAdd={onAddFromFridge} />
            ))}

            {filtered.length === 0 && <p className="text-gray-400 font-semibold">Nu am găsit produse în frigider pentru căutarea ta.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
