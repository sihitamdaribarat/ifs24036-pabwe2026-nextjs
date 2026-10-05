"use client";

import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { asyncSetUsers } from "@/features/users/states/action";
import { formatDate } from "@/helpers/toolsHelper";
import { IconSearch, IconUser, IconMail, IconCalendar } from "@tabler/icons-react";

export function UsersPage() {
  const dispatch = useAppDispatch();
  const users = useAppSelector((state) => state.users);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    dispatch(asyncSetUsers()).finally(() => setLoading(false));
  }, [dispatch]);

  const filteredUsers = users.filter((u) => {
    const term = searchTerm.toLowerCase();
    return (
      u.name.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Direktori Pengguna
          </h1>
          <p className="text-sm text-slate-400">
            Temukan dan terhubung dengan seluruh pengguna di platform Delcom.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <IconSearch className="w-4 h-4" />
          </div>
          <input
            type="text"
            role="searchbox"
            placeholder="Cari nama atau email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          />
        </div>
      </div>

      {loading && users.length === 0 ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-500 border-t-transparent"></div>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-16 bg-slate-800/40 border border-slate-800 rounded-2xl">
          <div className="w-12 h-12 mx-auto rounded-full bg-slate-700/50 flex items-center justify-center text-slate-400 mb-3">
            <IconUser className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-300">
            Tidak ada pengguna ditemukan
          </h3>
          <p className="text-sm text-slate-400 mt-1">
            {searchTerm
              ? `Tidak ada hasil pencarian untuk "${searchTerm}"`
              : "Belum ada pengguna terdaftar"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="bg-slate-800/60 border border-slate-700/70 hover:border-indigo-500/50 transition-all rounded-2xl p-5 shadow-sm hover:shadow-indigo-500/10 flex flex-col justify-between"
            >
              <div className="flex items-start gap-4">
                {user.photo ? (
                  <img
                    src={user.photo}
                    alt={user.name}
                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-indigo-500/30"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-semibold text-white truncate">
                    {user.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1 truncate">
                    <IconMail className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{user.email}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-700/50 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <IconCalendar className="w-3.5 h-3.5" />
                  Bergabung {formatDate(user.created_at)}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 font-medium">
                  ID: #{user.id}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UsersPage;
