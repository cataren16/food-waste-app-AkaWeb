import React, { useEffect, useMemo, useState } from "react";
import { X, Users, Search, UserPlus, LogOut, Trash2 } from "lucide-react";

function initialsFor(user) {
  const a = (user.nume || "").trim()[0] || "";
  const b = (user.prenume || "").trim()[0] || "";
  return (a + b || "U").toUpperCase();
}

function colorClassFor(id) {
  const arr = ["bg-purple-700", "bg-pink-900", "bg-fuchsia-400", "bg-blue-500", "bg-emerald-600", "bg-orange-500"];
  return arr[id % arr.length];
}

function AvatarCircle({ initials, bgClass }) {
  return (
    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-extrabold ${bgClass}`}>
      {initials}
    </div>
  );
}

function MemberRow({ member, isAdminView, isMe, onRemove }) {
  return (
    <div className="bg-gray-50 rounded-2xl px-4 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <AvatarCircle initials={initialsFor(member)} bgClass={colorClassFor(member.id_utilizator)} />
        <div className="flex flex-col">
          <p className="font-extrabold text-gray-800 leading-tight">
            {member.nume} {member.prenume} {isMe ? "(Tu)" : ""}
          </p>
          <p className="text-sm text-gray-400 font-semibold">{member.email}</p>
        </div>
      </div>

      {isAdminView ? (
        <button
          type="button"
          className="p-2 rounded-xl hover:bg-red-50 text-red-300 hover:text-red-400"
          aria-label="Elimină membru"
          onClick={() => onRemove?.(member.id_utilizator)}
          disabled={isMe}
        >
          <X />
        </button>
      ) : (
        <span className="text-sm italic text-gray-300 font-semibold">Membru</span>
      )}
    </div>
  );
}

export default function GroupSettingsModal({
  isOpen,
  onClose,
  group,
  isAdmin,
  members = [],
  myId,
  onLeave,
  onDeleteGroup,
  onAddMember,
  onRemoveMember,
  allUsers = [],
}) {
  const [memberFilter, setMemberFilter] = useState("");
  const [friendQuery, setFriendQuery] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    setMemberFilter("");
    setFriendQuery("");
  }, [isOpen, group?.id_grup]);

  const filteredMembers = useMemo(() => {
    const q = memberFilter.trim().toLowerCase();
    if (!q) return members;
    return members.filter(
      (m) =>
        `${m.nume} ${m.prenume}`.toLowerCase().includes(q) ||
        (m.email || "").toLowerCase().includes(q)
    );
  }, [members, memberFilter]);

  const candidatesToAdd = useMemo(() => {
    if (!isAdmin) return [];
    const q = friendQuery.trim().toLowerCase();
    if (!q) return [];
    const memberIds = new Set(members.map((m) => m.id_utilizator));
    return allUsers
      .filter((u) => !memberIds.has(u.id_utilizator))
      .filter((u) => (`${u.nume} ${u.prenume}`.toLowerCase().includes(q) || (u.email || "").toLowerCase().includes(q)))
      .slice(0, 5);
  }, [friendQuery, allUsers, members, isAdmin]);

  if (!isOpen || !group) return null;

  const viewLabel = isAdmin ? "ADMIN VIEW (DREPTURI DEPLINE)" : "MEMBER VIEW (VIZUALIZARE)";

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 px-4" onMouseDown={onClose}>
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden" onMouseDown={(e) => e.stopPropagation()}>
        <div className="px-6 py-5 flex items-start justify-between border-b border-gray-100">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900">Setări: {group.nume_grup}</h2>
            <p className="text-sm tracking-wide font-extrabold text-gray-400 mt-1">{viewLabel}</p>
          </div>

          <button type="button" className="p-2 rounded-xl hover:bg-gray-50 text-gray-400" aria-label="Închide" onClick={onClose}>
            <X />
          </button>
        </div>

        <div className="max-h-[72vh] overflow-y-auto px-6 py-6">
          <div className="flex items-center gap-3 text-emerald-700 mb-4">
            <Users />
            <h3 className="text-xl font-extrabold">Membrii Grupului</h3>
          </div>

          <div className="mb-4">
            <div className="relative">
              <input
                value={memberFilter}
                onChange={(e) => setMemberFilter(e.target.value)}
                placeholder="Caută membri..."
                className="w-full rounded-2xl border border-gray-200 bg-white px-12 py-4 outline-none focus:border-emerald-400 transition"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {filteredMembers.map((m) => (
              <MemberRow
                key={m.id_utilizator}
                member={m}
                isAdminView={isAdmin}
                isMe={m.id_utilizator === myId}
                onRemove={onRemoveMember}
              />
            ))}
          </div>

          {isAdmin && (
            <div className="mt-8">
              <p className="text-lg font-extrabold text-gray-500 tracking-wide">ADAUGĂ UN PRIETEN</p>

              <div className="mt-3 flex items-center gap-4">
                <div className="relative flex-1">
                  <input
                    value={friendQuery}
                    onChange={(e) => setFriendQuery(e.target.value)}
                    placeholder="Caută prieteni..."
                    className="w-full rounded-2xl border border-gray-200 bg-white px-12 py-4 outline-none focus:border-emerald-400 transition"
                  />
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                </div>

                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold shadow-lg shadow-emerald-200 transition"
                  onClick={() => {
                    if (candidatesToAdd[0]) onAddMember?.(candidatesToAdd[0].id_utilizator);
                    setFriendQuery("");
                  }}
                  disabled={!candidatesToAdd[0]}
                >
                  <UserPlus size={18} />
                  Adaugă
                </button>
              </div>

              {candidatesToAdd.length > 0 && (
                <div className="mt-3 flex flex-col gap-2">
                  {candidatesToAdd.map((u) => (
                    <button
                      key={u.id_utilizator}
                      type="button"
                      className="text-left rounded-2xl border border-gray-100 bg-white hover:bg-gray-50 px-4 py-3"
                      onClick={() => {
                        onAddMember?.(u.id_utilizator);
                        setFriendQuery("");
                      }}
                    >
                      <p className="font-extrabold text-gray-800">{u.nume} {u.prenume}</p>
                      <p className="text-sm text-gray-400 font-semibold">{u.email}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="px-6 py-5 border-t border-gray-100">
          {!isAdmin ? (
            <button
              type="button"
              className="w-full rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 py-4 font-extrabold text-gray-600 inline-flex items-center justify-center gap-3"
              onClick={onLeave}
            >
              <LogOut className="text-gray-400" />
              Părăsește Grupul
            </button>
          ) : (
            <button
              type="button"
              className="w-full rounded-2xl border border-red-100 bg-red-50 hover:bg-red-100/60 py-4 font-extrabold text-red-600 inline-flex items-center justify-center gap-3"
              onClick={onDeleteGroup}
            >
              <Trash2 className="text-red-500" />
              Șterge Grupul Definitiv
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
