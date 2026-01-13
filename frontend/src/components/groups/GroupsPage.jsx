import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Plus, Settings, ChevronRight, Users, LogOut } from "lucide-react";

import CreateGroupModal from "./CreateGroupModal";
import GroupSettingsModal from "./GroupSettingsModal";
import GroupProductsModal from "./GroupProductsModal";
import SelectFromFridgeModal from "./SelectFromFridgeModal";

const API_BASE = "http://localhost:3000/api";

async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  let data = null;
  try {
    data = await res.json();
  } catch (e) {}

  if (!res.ok) {
    const msg = data?.message || `Eroare ${res.status}`;
    throw new Error(msg);
  }
  return data;
}

function getMyId() {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return 1;
    const u = JSON.parse(raw);
    return u?.id_utilizator || 1;
  } catch {
    return 1;
  }
}

function GroupCardDesktop({ group, membersCount, onOpenSettings, onOpenProducts, onLeave }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <div className="flex items-start justify-between">
        <div className="flex gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
            <Users className="text-emerald-700" />
          </div>

          <div className="flex flex-col">
            <p className="text-lg font-extrabold text-gray-900">{group.nume_grup}</p>
            <p className="text-sm text-gray-400 font-semibold">{membersCount} Membri</p>
          </div>
        </div>

        <button
          className="p-2 rounded-xl hover:bg-gray-50 text-gray-400 hover:text-gray-600"
          type="button"
          aria-label="Setări grup"
          onClick={() => onOpenSettings(group)}
        >
          <Settings size={18} />
        </button>
      </div>

      <div className="mt-5 flex items-center gap-3">
        <button
          type="button"
          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl py-3 text-sm shadow-sm transition"
          onClick={() => onOpenProducts(group)}
        >
          Vezi Produse
        </button>

        <button
          type="button"
          className="w-12 h-12 rounded-xl border border-gray-100 bg-white hover:bg-red-50 flex items-center justify-center transition"
          aria-label="Părăsește grup"
          onClick={() => onLeave(group.id_grup)}
        >
          <LogOut className="text-red-400" />
        </button>
      </div>
    </div>
  );
}

function GroupRowMobile({ group, membersCount, onOpenProducts, onOpenSettings, onLeave }) {
  return (
    <button
      type="button"
      className="w-full bg-white border border-gray-100 rounded-2xl px-4 py-4 shadow-sm flex items-center justify-between active:scale-[0.99] transition"
      onClick={() => onOpenProducts(group)}
    >
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center">
          <Users className="text-orange-500" size={20} />
        </div>
        <div className="flex flex-col items-start">
          <p className="font-extrabold text-gray-900 leading-tight">{group.nume_grup}</p>
          <p className="text-xs text-gray-400 font-semibold">
            {membersCount} membri • produse active
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          className="p-2 rounded-xl hover:bg-gray-50 text-gray-400 hover:text-gray-600"
          aria-label="Setări grup"
          onClick={(e) => {
            e.stopPropagation();
            onOpenSettings(group);
          }}
        >
          <Settings size={18} />
        </button>

        <button
          type="button"
          className="p-2 rounded-xl hover:bg-red-50 text-red-300 hover:text-red-400"
          aria-label="Părăsește grup"
          onClick={(e) => {
            e.stopPropagation();
            onLeave(group.id_grup);
          }}
        >
          <LogOut size={18} />
        </button>

        <ChevronRight className="text-gray-300" />
      </div>
    </button>
  );
}

export default function GroupsPage() {
  const MY_ID = useMemo(() => getMyId(), []);

  const [myGroups, setMyGroups] = useState([]);
  const [membersCountByGroupId, setMembersCountByGroupId] = useState({});
  const [allUsers, setAllUsers] = useState([]);

  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedGroupMembers, setSelectedGroupMembers] = useState([]);
  const [selectedGroupProducts, setSelectedGroupProducts] = useState([]);
  const [fridgeItems, setFridgeItems] = useState([]);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isFridgeOpen, setIsFridgeOpen] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");

  const isAdminSelected = useMemo(() => {
    if (!selectedGroup) return false;
    return String(selectedGroup.id_admin) === String(MY_ID);
  }, [selectedGroup, MY_ID]);

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        setErrorMsg("");

        const [groupsRes, usersRes] = await Promise.all([
          apiFetch(`/groups/user/${MY_ID}`),
          apiFetch(`/users/`),
        ]);

        if (!alive) return;

        const groups = groupsRes?.grupuri || [];
        setMyGroups(groups);

        const counts = {};
        await Promise.all(
          groups.map(async (g) => {
            try {
              const memRes = await apiFetch(`/groups/${g.id_grup}/members`);
              const membri = memRes?.membri || [];
              counts[g.id_grup] = membri.length;
            } catch {
              counts[g.id_grup] = 0;
            }
          })
        );

        if (!alive) return;
        setMembersCountByGroupId(counts);

        setAllUsers(Array.isArray(usersRes) ? usersRes : []);
      } catch (e) {
        if (!alive) return;
        setErrorMsg(e.message || "Eroare la încărcare");
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, [MY_ID]);

  const openSettings = useCallback(async (group) => {
    try {
      setErrorMsg("");
      setSelectedGroup(group);

      const memRes = await apiFetch(`/groups/${group.id_grup}/members`);
      setSelectedGroupMembers(memRes?.membri || []);
      setIsSettingsOpen(true);
    } catch (e) {
      setErrorMsg(e.message || "Eroare");
    }
  }, []);

  const openProducts = useCallback(async (group) => {
    try {
      setErrorMsg("");
      setSelectedGroup(group);

      const prodRes = await apiFetch(`/groups/${group.id_grup}/products`);
      const produse = prodRes?.produse || [];

      const mapped = produse.map((p) => {
        const owner = p.owner;
        const by = owner ? `${owner.nume} ${owner.prenume || ""}`.trim() : "Utilizator";
        return {
          id: String(p.id_produs),
          id_produs: p.id_produs,
          name: p.denumire_produs,
          by,
          ownerId: p.id_utilizator,
          emoji: p.emoji || "🍽️",
        };
      });

      setSelectedGroupProducts(mapped);
      setIsProductsOpen(true);
    } catch (e) {
      setErrorMsg(e.message || "Eroare");
    }
  }, []);

  const openFridge = useCallback(async () => {
    try {
      setErrorMsg("");
      const res = await apiFetch(`/products/fridge/${MY_ID}`);
      const produse = res?.produse || [];

      const items = produse.map((p) => ({
        id: String(p.id_produs),
        id_produs: p.id_produs,
        name: p.denumire_produs,
        qty: p.cantitate ? `${p.cantitate} buc` : "-",
        emoji: p.emoji || "🍽️",
      }));

      setFridgeItems(items);
      setIsFridgeOpen(true);
    } catch (e) {
      setErrorMsg(e.message || "Eroare");
    }
  }, [MY_ID]);

  const refreshGroups = useCallback(async () => {
    const groupsRes = await apiFetch(`/groups/user/${MY_ID}`);
    const groups = groupsRes?.grupuri || [];
    setMyGroups(groups);

    const counts = {};
    await Promise.all(
      groups.map(async (g) => {
        try {
          const memRes = await apiFetch(`/groups/${g.id_grup}/members`);
          const membri = memRes?.membri || [];
          counts[g.id_grup] = membri.length;
        } catch {
          counts[g.id_grup] = 0;
        }
      })
    );
    setMembersCountByGroupId(counts);
  }, [MY_ID]);

  const handleCreateGroup = async (payload) => {
    try {
      setErrorMsg("");
      await apiFetch(`/groups/create`, {
        method: "POST",
        body: JSON.stringify({
          nume_grup: payload.nume_grup,
          id_admin: MY_ID,
          descriere: payload.descriere || null,
          status_dieta: payload.status_dieta || "Omnivor",
        }),
      });

      setIsCreateOpen(false);
      await refreshGroups();
    } catch (e) {
      setErrorMsg(e.message || "Eroare la creare grup");
    }
  };

  const handleLeaveGroup = async (id_grup) => {
    try {
      setErrorMsg("");
      await apiFetch(`/groups/${id_grup}/leave`, {
        method: "POST",
        body: JSON.stringify({ id_utilizator: MY_ID }),
      });

      if (selectedGroup?.id_grup === id_grup) {
        setIsSettingsOpen(false);
        setIsProductsOpen(false);
        setIsFridgeOpen(false);
        setSelectedGroup(null);
        setSelectedGroupMembers([]);
        setSelectedGroupProducts([]);
      }

      await refreshGroups();
    } catch (e) {
      setErrorMsg(e.message || "Eroare la părăsire grup");
    }
  };

  const handleDeleteGroup = async () => {
    if (!selectedGroup) return;
    try {
      setErrorMsg("");
      await apiFetch(`/groups/${selectedGroup.id_grup}`, {
        method: "DELETE",
        body: JSON.stringify({ id_utilizator: MY_ID }),
      });

      setIsSettingsOpen(false);
      setSelectedGroup(null);
      setSelectedGroupMembers([]);

      await refreshGroups();
    } catch (e) {
      setErrorMsg(e.message || "Eroare la ștergere grup");
    }
  };

  const handleAddMember = async (userId) => {
    if (!selectedGroup) return;
    try {
      setErrorMsg("");

      await apiFetch(`/groups/add-member`, {
        method: "POST",
        body: JSON.stringify({
          id_grup: selectedGroup.id_grup,
          id_utilizator: userId,
        }),
      });

      const memRes = await apiFetch(`/groups/${selectedGroup.id_grup}/members`);
      const membri = memRes?.membri || [];
      setSelectedGroupMembers(membri);

      setMembersCountByGroupId((prev) => ({
        ...prev,
        [selectedGroup.id_grup]: membri.length,
      }));
    } catch (e) {
      setErrorMsg(e.message || "Eroare la adăugare membru");
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!selectedGroup) return;
    try {
      setErrorMsg("");

      await apiFetch(`/groups/remove-member`, {
        method: "DELETE",
        body: JSON.stringify({
          id_grup: selectedGroup.id_grup,
          id_utilizator: userId,
        }),
      });

      const memRes = await apiFetch(`/groups/${selectedGroup.id_grup}/members`);
      const membri = memRes?.membri || [];
      setSelectedGroupMembers(membri);

      setMembersCountByGroupId((prev) => ({
        ...prev,
        [selectedGroup.id_grup]: membri.length,
      }));
    } catch (e) {
      setErrorMsg(e.message || "Eroare la ștergere membru");
    }
  };

  const handleAddFromFridge = async (item) => {
    if (!selectedGroup) return;

    try {
      setErrorMsg("");

      await apiFetch(`/groups/${selectedGroup.id_grup}/products/add-from-fridge`, {
        method: "POST",
        body: JSON.stringify({
          id_produs: item.id_produs,
          id_utilizator: MY_ID,
        }),
      });

      const prodRes = await apiFetch(`/groups/${selectedGroup.id_grup}/products`);
      const produse = prodRes?.produse || [];

      const mapped = produse.map((p) => {
        const owner = p.owner;
        const by = owner ? `${owner.nume} ${owner.prenume || ""}`.trim() : "Utilizator";
        return {
          id: String(p.id_produs),
          id_produs: p.id_produs,
          name: p.denumire_produs,
          by,
          ownerId: p.id_utilizator,
          emoji: p.emoji || "🍽️",
        };
      });
      setSelectedGroupProducts(mapped);

      const fridgeRes = await apiFetch(`/products/fridge/${MY_ID}`);
      const fp = fridgeRes?.produse || [];
      setFridgeItems(
        fp.map((p) => ({
          id: String(p.id_produs),
          id_produs: p.id_produs,
          name: p.denumire_produs,
          qty: p.cantitate ? `${p.cantitate} buc` : "-",
          emoji: p.emoji || "🍽️",
        }))
      );

      setIsFridgeOpen(false);
    } catch (e) {
      setErrorMsg(e.message || "Eroare la adăugare produs în grup");
    }
  };

  return (
    <div className="w-full">
      {errorMsg ? (
        <div className="mb-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-red-700 font-semibold">
          {errorMsg}
        </div>
      ) : null}

      <CreateGroupModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSave={handleCreateGroup}
      />

      <GroupSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        group={selectedGroup}
        isAdmin={isAdminSelected}
        members={selectedGroupMembers}
        myId={MY_ID}
        onLeave={() => selectedGroup && handleLeaveGroup(selectedGroup.id_grup)}
        onDeleteGroup={handleDeleteGroup}
        onAddMember={handleAddMember}
        onRemoveMember={handleRemoveMember}
        allUsers={allUsers}
      />

      <GroupProductsModal
        isOpen={isProductsOpen}
        onClose={() => setIsProductsOpen(false)}
        group={
          selectedGroup
        }
        products={selectedGroupProducts}
        myId={MY_ID}
        onOpenAddProduct={openFridge}
      />

      <SelectFromFridgeModal
        isOpen={isFridgeOpen}
        onClose={() => setIsFridgeOpen(false)}
        items={fridgeItems}
        onAddFromFridge={handleAddFromFridge}
      />

      {/* DESKTOP */}
      <div className="hidden md:block">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-extrabold text-gray-900">Grupurile Mele</h1>

          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-emerald-200 text-emerald-700 font-extrabold hover:bg-emerald-50 transition"
          >
            <Plus size={18} />
            Grup Nou
          </button>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
          {myGroups.map((g) => (
            <GroupCardDesktop
              key={g.id_grup}
              group={g}
              membersCount={membersCountByGroupId[g.id_grup] || 0}
              onOpenSettings={openSettings}
              onOpenProducts={openProducts}
              onLeave={handleLeaveGroup}
            />
          ))}
        </div>
      </div>

      {/* MOBILE */}
      <div className="block md:hidden">
        <h1 className="text-2xl font-extrabold text-gray-900">Comunitățile Tale</h1>

        <button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className="mt-4 w-full border-2 border-dashed border-emerald-200 rounded-2xl py-4 flex items-center justify-center gap-2 text-emerald-700 font-extrabold bg-emerald-50/40"
        >
          <Plus size={18} />
          Creează Grup Nou
        </button>

        <div className="mt-4 flex flex-col gap-3">
          {myGroups.map((g) => (
            <GroupRowMobile
              key={g.id_grup}
              group={g}
              membersCount={membersCountByGroupId[g.id_grup] || 0}
              onOpenProducts={openProducts}
              onOpenSettings={openSettings}
              onLeave={handleLeaveGroup}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
