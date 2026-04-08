"use client";

import { useState } from "react";
import ToastContainer from "./common/ToastContainer";
import { Sidebar } from "./layout/Sidebar";
// import Sidebar from "./layout/Sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
const [open, setOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar open={open} onClose={() => setOpen(false)} />

      {/* Content */}
      <div className="flex-1 flex flex-col">
        
        {/* 🔥 MOBILE HEADER */}
        <div className="md:hidden flex items-center gap-4 p-4 bg-zinc-900 text-white">
          
          {/* Hamburguesa */}
          <button onClick={() => setOpen(true)}>
            ☰
          </button>

          <span className="font-bold">Agave POS</span>
        </div>

        {/* Content */}
        <main className="flex-1 overflow-auto p-4 bg-zinc-100">
          <ToastContainer />
          {children}
        </main>
      </div>
    </div>
  );
};