'use client';

import React from 'react';

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: GridIcon },
  { id: 'analytics', label: 'Analytics', icon: BarChartIcon },
  { id: 'users', label: 'Users', icon: UserIcon },
  { id: 'documents', label: 'Documents', icon: DocumentIcon },
];

const assetItems = [
  { id: 'onboard', label: 'Onboard token' },
  { id: 'assets', label: 'BitGo Assets' },
  { id: 'top1000', label: 'Top 1000 by market cap' },
];

export default function Sidebar({ activePage, setActivePage }: SidebarProps) {
  return (
    <aside className="w-[200px] min-w-[200px] bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[#FF6B00] rounded flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 4h10v2H3zM3 7h7v2H3zM3 10h10v2H3z" fill="white"/>
            </svg>
          </div>
          <span className="font-bold text-[#0D1B2A] text-[15px] tracking-tight">BitGo</span>
        </div>
      </div>

      {/* Main nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActivePage(id)}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors ${
              activePage === id
                ? 'bg-[#EEF2FF] text-[#2B3CE8] font-medium'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <Icon size={16} active={activePage === id} />
            {label}
          </button>
        ))}

        {/* Asset Management section */}
        <div className="pt-4">
          <button
            onClick={() => setActivePage('asset-management')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors ${
              ['onboard','assets','top1000'].includes(activePage)
                ? 'text-[#0D1B2A] font-medium'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <LayersIcon size={16} active={['onboard','assets','top1000'].includes(activePage)} />
            Asset Management
          </button>

          {/* Sub-items */}
          <div className="ml-6 mt-0.5 space-y-0.5">
            {assetItems.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setActivePage(id)}
                className={`w-full text-left px-3 py-1.5 rounded-md text-[13px] transition-colors ${
                  activePage === id
                    ? 'bg-[#EEF2FF] text-[#2B3CE8] font-medium'
                    : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Settings */}
      <div className="px-3 pb-4 border-t border-gray-100 pt-3">
        <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-gray-600 hover:bg-gray-50">
          <SettingsIcon size={16} active={false} />
          Settings
        </button>
      </div>
    </aside>
  );
}

function GridIcon({ size, active }: { size: number; active: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <rect x="1" y="1" width="6" height="6" rx="1" fill={active ? '#2B3CE8' : '#9CA3AF'}/>
      <rect x="9" y="1" width="6" height="6" rx="1" fill={active ? '#2B3CE8' : '#9CA3AF'}/>
      <rect x="1" y="9" width="6" height="6" rx="1" fill={active ? '#2B3CE8' : '#9CA3AF'}/>
      <rect x="9" y="9" width="6" height="6" rx="1" fill={active ? '#2B3CE8' : '#9CA3AF'}/>
    </svg>
  );
}

function BarChartIcon({ size, active }: { size: number; active: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <rect x="1" y="9" width="3" height="6" rx="0.5" fill={active ? '#2B3CE8' : '#9CA3AF'}/>
      <rect x="6" y="5" width="3" height="10" rx="0.5" fill={active ? '#2B3CE8' : '#9CA3AF'}/>
      <rect x="11" y="2" width="3" height="13" rx="0.5" fill={active ? '#2B3CE8' : '#9CA3AF'}/>
    </svg>
  );
}

function UserIcon({ size, active }: { size: number; active: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="5" r="3" fill={active ? '#2B3CE8' : '#9CA3AF'}/>
      <path d="M2 14c0-3.314 2.686-5 6-5s6 1.686 6 5" stroke={active ? '#2B3CE8' : '#9CA3AF'} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function DocumentIcon({ size, active }: { size: number; active: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <rect x="2" y="1" width="9" height="13" rx="1" stroke={active ? '#2B3CE8' : '#9CA3AF'} strokeWidth="1.5"/>
      <path d="M5 5h5M5 8h5M5 11h3" stroke={active ? '#2B3CE8' : '#9CA3AF'} strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M11 1l3 3-3 0V1z" fill={active ? '#2B3CE8' : '#9CA3AF'}/>
    </svg>
  );
}

function LayersIcon({ size, active }: { size: number; active: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M8 1L15 5L8 9L1 5L8 1Z" fill={active ? '#2B3CE8' : '#9CA3AF'}/>
      <path d="M1 8L8 12L15 8" stroke={active ? '#2B3CE8' : '#9CA3AF'} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M1 11L8 15L15 11" stroke={active ? '#2B3CE8' : '#9CA3AF'} strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
    </svg>
  );
}

function SettingsIcon({ size, active }: { size: number; active: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="2.5" stroke={active ? '#2B3CE8' : '#9CA3AF'} strokeWidth="1.5"/>
      <path d="M8 1v2M8 13v2M1 8h2M13 8h2M2.93 2.93l1.41 1.41M11.66 11.66l1.41 1.41M2.93 13.07l1.41-1.41M11.66 4.34l1.41-1.41" stroke={active ? '#2B3CE8' : '#9CA3AF'} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}
