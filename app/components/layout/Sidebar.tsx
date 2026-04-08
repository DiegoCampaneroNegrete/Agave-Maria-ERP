'use client';

import { menu } from "../sidebar/menu";
import { SidebarItem } from "../sidebar/SidebarItem";

// import { menu } from './menu';
// import { SidebarItem } from './SidebarItem';

export const Sidebar = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static
          top-0 left-0
          h-full
          w-64
          bg-zinc-900 text-white p-4
          transform transition-transform duration-200 z-50

          ${open ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}
      >
        {/* Header */}
        <div className="text-xl font-bold mb-6 flex justify-between items-center">
          🍹 Agave POS

          {/* Close button mobile */}
          <button
            className="md:hidden"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* Menu */}
        <nav className="flex flex-col gap-2">
          {menu.map(item => (
            <SidebarItem key={item.href} item={item} />
          ))}
        </nav>
      </aside>
    </>
  );
};