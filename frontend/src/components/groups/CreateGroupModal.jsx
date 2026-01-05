import React, { useEffect, useMemo, useState } from "react";
import { X, Save } from "lucide-react";

export default function CreateGroupModal({ isOpen, onClose, onSave }) {
  const dietOptions = useMemo(
    () => [
      { value: "", label: "Omnivor (Toate)" },
      { value: "Vegetarian", label: "Vegetarian" },
      { value: "Vegan", label: "Vegan" },
      { value: "Pescatarian", label: "Pescatarian" },
      { value: "Keto", label: "Keto" },
      { value: "Low Carb", label: "Low Carb" },
      { value: "Fără gluten", label: "Fără gluten" },
      { value: "Fără lactoză", label: "Fără lactoză" },
    ],
    []
  );

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [diet, setDiet] = useState("");
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setName("");
      setDescription("");
      setDiet("");
      setTouched(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const nameError = touched && !name.trim();

  const handleSave = () => {
    setTouched(true);
    if (!name.trim()) return;

    onSave?.({
      nume_grup: name.trim(),
      descriere: description.trim() || null,
      status_dieta: diet || "Omnivor",
    });

    onClose?.();
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 px-4" onMouseDown={onClose}>
      <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl overflow-hidden" onMouseDown={(e) => e.stopPropagation()}>
        <div className="bg-emerald-50 px-6 py-5 flex items-center justify-between">
          <h2 className="text-xl md:text-2xl font-extrabold text-emerald-800">Creează Grup Nou</h2>
          <button type="button" className="p-2 rounded-xl hover:bg-emerald-100 text-emerald-700" aria-label="Închide" onClick={onClose}>
            <X />
          </button>
        </div>

        <div className="px-6 py-6">
          <label className="block text-sm font-extrabold text-gray-500 mb-2">NUME GRUP</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => setTouched(true)}
            placeholder="Ex: Vecinii Scara B"
            className={`w-full rounded-2xl border px-4 py-3 outline-none transition ${
              nameError ? "border-red-300 focus:border-red-400" : "border-gray-200 focus:border-emerald-400"
            }`}
          />
          {nameError && <p className="mt-2 text-sm font-semibold text-red-500">Numele grupului este obligatoriu.</p>}

          <label className="block text-sm font-extrabold text-gray-500 mb-2 mt-6">DESCRIERE</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Câteva cuvinte despre scopul grupului..."
            rows={4}
            className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-emerald-400 transition resize-none"
          />

          <label className="block text-sm font-extrabold text-gray-500 mb-2 mt-6">TIP DIETĂ (OPTIONAL)</label>
          <select
            value={diet}
            onChange={(e) => setDiet(e.target.value)}
            className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-emerald-400 transition bg-white"
          >
            {dietOptions.map((opt) => (
              <option key={opt.value || "all"} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <div className="mt-8 flex items-center justify-between gap-4">
            <button type="button" className="flex-1 rounded-2xl py-3 font-extrabold text-gray-500 hover:bg-gray-50 transition" onClick={onClose}>
              Anulează
            </button>

            <button
              type="button"
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3 shadow-lg shadow-emerald-200 transition"
              onClick={handleSave}
            >
              <Save size={18} />
              Salvează
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
