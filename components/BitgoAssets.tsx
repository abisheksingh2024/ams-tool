'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import AssetModal from './AssetModal';

export type Asset = {
  id: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
  name: string;
  symbol: string;
  type: 'Coin' | 'Token';
  protocol: string;
  contract: string;
  environment: string;
  tokenType: string;
  decimals: number;
  bitgoSymbol: string;
  gatekeep: 'Gated' | 'Ungated';
  tokenStatus: string;
  custodyTrustEntities: string[];
  goAccountTrustEntities: string[];
  auditLog: Array<{ date: string; user: string; action: string; changes: string }>;
};

const SAMPLE_ASSETS: Asset[] = [
  {
    id: '1', createdBy: 'manasladha035@bitgo.com', createdAt: '17 Mar 26 @15:33:24',
    updatedBy: 'manasladha035@bitgo.com', updatedAt: '17 Mar 26 @15:33:24',
    name: 'Testnet AMS v2', symbol: 'testamsv2', type: 'Token', protocol: 'eth',
    contract: '0x2d8e3bd91678a7777ef2f2388dc126b973a43ce5', environment: 'Testnet',
    tokenType: 'ERC-20', decimals: 18, bitgoSymbol: 'hteth:testamsv2', gatekeep: 'Gated',
    tokenStatus: 'COMPLETED',
    custodyTrustEntities: ['BitGo Trust', 'BitGo New York', 'BitGo Germany', 'BitGo Singapore'],
    goAccountTrustEntities: ['BitGo Trust', 'BitGo New York', 'BitGo Germany', 'Frankfurt DE Trust', 'BitGo Singapore', 'BitGo Korea', 'BitGo Custody MENA FZE', 'BitGo India'],
    auditLog: [{ date: '17 Mar 26 @15:33:24', user: 'manasladha035@bitgo.com', action: 'Created', changes: 'Token onboarded to AMS' }],
  },
  {
    id: '2', createdBy: 'statics-migration', createdAt: '25 Mar 26 @22:01:22',
    updatedBy: 'statics-migration', updatedAt: '25 Mar 26 @22:01:22',
    name: 'Testnet Lightning Bitcoin', symbol: 'tlnbtc', type: 'Coin', protocol: 'lnbtc',
    contract: '—', environment: 'Testnet', tokenType: 'Native', decimals: 8,
    bitgoSymbol: 'tlnbtc', gatekeep: 'Ungated', tokenStatus: 'COMPLETED',
    custodyTrustEntities: ['BitGo Trust', 'BitGo New York'],
    goAccountTrustEntities: ['BitGo Trust'],
    auditLog: [{ date: '25 Mar 26 @22:01:22', user: 'statics-migration', action: 'Created', changes: 'Migrated from statics' }],
  },
  {
    id: '3', createdBy: 'statics-migration', createdAt: '25 Mar 26 @22:01:22',
    updatedBy: 'abisheksingh@bitgo.com', updatedAt: '01 Apr 26 @10:15:00',
    name: 'Testnet Bitcoin Cash', symbol: 'tbch', type: 'Coin', protocol: 'bch',
    contract: '—', environment: 'Testnet', tokenType: 'Native', decimals: 8,
    bitgoSymbol: 'tbch', gatekeep: 'Ungated', tokenStatus: 'COMPLETED',
    custodyTrustEntities: ['BitGo Trust', 'BitGo Germany'],
    goAccountTrustEntities: ['BitGo Trust', 'BitGo Germany'],
    auditLog: [
      { date: '25 Mar 26 @22:01:22', user: 'statics-migration', action: 'Created', changes: 'Migrated from statics' },
      { date: '01 Apr 26 @10:15:00', user: 'abisheksingh@bitgo.com', action: 'Modified', changes: 'Custody Trust Entity updated: added BitGo Germany' },
    ],
  },
  {
    id: '4', createdBy: 'statics-migration', createdAt: '25 Mar 26 @22:01:22',
    updatedBy: 'statics-migration', updatedAt: '25 Mar 26 @22:01:22',
    name: 'Testnet Dash', symbol: 'tdash', type: 'Coin', protocol: 'dash',
    contract: '—', environment: 'Testnet', tokenType: 'Native', decimals: 8,
    bitgoSymbol: 'tdash', gatekeep: 'Ungated', tokenStatus: 'COMPLETED',
    custodyTrustEntities: [], goAccountTrustEntities: [],
    auditLog: [{ date: '25 Mar 26 @22:01:22', user: 'statics-migration', action: 'Created', changes: 'Migrated from statics' }],
  },
  {
    id: '5', createdBy: 'statics-migration', createdAt: '25 Mar 26 @22:01:22',
    updatedBy: 'statics-migration', updatedAt: '25 Mar 26 @22:01:22',
    name: 'Test ERC Token on Hoodi', symbol: 'bgerch', type: 'Token', protocol: 'eth',
    contract: '0xe011...062f', environment: 'Testnet', tokenType: 'ERC-20', decimals: 18,
    bitgoSymbol: 'eth:bgerch', gatekeep: 'Ungated', tokenStatus: 'COMPLETED',
    custodyTrustEntities: ['BitGo Trust'],
    goAccountTrustEntities: ['BitGo Trust', 'BitGo New York'],
    auditLog: [{ date: '25 Mar 26 @22:01:22', user: 'statics-migration', action: 'Created', changes: 'Migrated from statics' }],
  },
  {
    id: '6', createdBy: 'statics-migration', createdAt: '25 Mar 26 @22:01:22',
    updatedBy: 'statics-migration', updatedAt: '25 Mar 26 @22:01:22',
    name: 'AMS test token', symbol: 'amstest', type: 'Token', protocol: 'eth',
    contract: '0x6cab...4ae3', environment: 'Testnet', tokenType: 'ERC-20', decimals: 18,
    bitgoSymbol: 'hteth:amstest', gatekeep: 'Ungated', tokenStatus: 'COMPLETED',
    custodyTrustEntities: ['BitGo Trust', 'BitGo New York', 'BitGo Singapore'],
    goAccountTrustEntities: ['BitGo Trust', 'BitGo New York'],
    auditLog: [{ date: '25 Mar 26 @22:01:22', user: 'statics-migration', action: 'Created', changes: 'Migrated from statics' }],
  },
  {
    id: '7', createdBy: 'statics-migration', createdAt: '25 Mar 26 @22:01:22',
    updatedBy: 'statics-migration', updatedAt: '25 Mar 26 @22:01:22',
    name: 'Testnet EigenCloud', symbol: 'testeigen', type: 'Token', protocol: 'eth',
    contract: '0x8ae2...45bf', environment: 'Testnet', tokenType: 'ERC-20', decimals: 18,
    bitgoSymbol: 'hteth:testeigen', gatekeep: 'Ungated', tokenStatus: 'COMPLETED',
    custodyTrustEntities: [], goAccountTrustEntities: [],
    auditLog: [{ date: '25 Mar 26 @22:01:22', user: 'statics-migration', action: 'Created', changes: 'Migrated from statics' }],
  },
  {
    id: '8', createdBy: 'statics-migration', createdAt: '25 Mar 26 @22:01:22',
    updatedBy: 'abisheksingh@bitgo.com', updatedAt: '10 Apr 26 @09:00:00',
    name: 'GRTXP', symbol: 'grtxp', type: 'Token', protocol: 'eth',
    contract: '0x1bfe...15c6', environment: 'Production', tokenType: 'ERC-20', decimals: 18,
    bitgoSymbol: 'eth:grtxp', gatekeep: 'Gated', tokenStatus: 'COMPLETED',
    custodyTrustEntities: ['BitGo Trust', 'BitGo New York', 'BitGo Germany', 'BitGo Singapore', 'BitGo Korea'],
    goAccountTrustEntities: ['BitGo Trust', 'BitGo New York', 'BitGo Germany'],
    auditLog: [
      { date: '25 Mar 26 @22:01:22', user: 'statics-migration', action: 'Created', changes: 'Migrated from statics' },
      { date: '10 Apr 26 @09:00:00', user: 'abisheksingh@bitgo.com', action: 'Modified', changes: 'Gatekeep changed: Ungated → Gated' },
    ],
  },
  {
    id: '9', createdBy: 'statics-migration', createdAt: '25 Mar 26 @22:01:22',
    updatedBy: 'statics-migration', updatedAt: '25 Mar 26 @22:01:22',
    name: 'Test Chainlink', symbol: 'link', type: 'Token', protocol: 'avaxc',
    contract: '0x0b9d...7846', environment: 'Testnet', tokenType: 'ARC-20', decimals: 18,
    bitgoSymbol: 'tavaxc:link', gatekeep: 'Ungated', tokenStatus: 'COMPLETED',
    custodyTrustEntities: ['BitGo Trust'], goAccountTrustEntities: [],
    auditLog: [{ date: '25 Mar 26 @22:01:22', user: 'statics-migration', action: 'Created', changes: 'Migrated from statics' }],
  },
  {
    id: '10', createdBy: 'abisheksingh@bitgo.com', createdAt: '15 Apr 26 @11:20:00',
    updatedBy: 'abisheksingh@bitgo.com', updatedAt: '18 Apr 26 @14:30:00',
    name: 'USD Coin', symbol: 'usdc', type: 'Token', protocol: 'eth',
    contract: '0xa0b8...ec48', environment: 'Production', tokenType: 'ERC-20', decimals: 6,
    bitgoSymbol: 'eth:usdc', gatekeep: 'Gated', tokenStatus: 'COMPLETED',
    custodyTrustEntities: ['BitGo Trust', 'BitGo New York', 'BitGo Germany', 'Frankfurt DE Trust', 'BitGo Singapore'],
    goAccountTrustEntities: ['BitGo Trust', 'BitGo New York', 'BitGo Germany', 'Frankfurt DE Trust', 'BitGo Singapore', 'BitGo Korea', 'BitGo Custody MENA FZE', 'BitGo India'],
    auditLog: [
      { date: '15 Apr 26 @11:20:00', user: 'abisheksingh@bitgo.com', action: 'Created', changes: 'Token onboarded to AMS' },
      { date: '18 Apr 26 @14:30:00', user: 'abisheksingh@bitgo.com', action: 'Modified', changes: 'Go Account Trust Entity updated: added BitGo India, BitGo Custody MENA FZE' },
    ],
  },
];

const PROTOCOLS = ['All', 'eth', 'lnbtc', 'bch', 'dash', 'avaxc', 'polygon', 'sol'];
const TRUST_ENTITIES = ['BitGo Trust', 'BitGo New York', 'BitGo Germany', 'Frankfurt DE Trust', 'BitGo Singapore', 'BitGo Korea', 'BitGo Custody MENA FZE', 'BitGo India'];
const TOKEN_STATUSES = ['All', 'COMPLETED', 'IN_REVIEW', 'REJECTED'];

type Filters = {
  protocol: string;
  gatekeep: string;
  tokenStatus: string;
  createdBy: string;
  custodyTrust: string;
  goAccountTrust: string;
};

const DEFAULT_FILTERS: Filters = {
  protocol: 'All', gatekeep: 'All', tokenStatus: 'All',
  createdBy: '', custodyTrust: 'All', goAccountTrust: 'All',
};

function avatarColor(name: string) {
  const c = name.charAt(0);
  if (c === 'T') return 'bg-slate-500';
  if (c === 'G') return 'bg-violet-500';
  if (c === 'A') return 'bg-amber-500';
  if (c === 'U') return 'bg-blue-500';
  return 'bg-gray-400';
}

export default function BitgoAssets() {
  const [search, setSearch] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [assets, setAssets] = useState<Asset[]>(SAMPLE_ASSETS);
  const [showFilters, setShowFilters] = useState(false);
  const [draftFilters, setDraftFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState<Filters>(DEFAULT_FILTERS);
  // Quick filters
  const [quickGatekeep, setQuickGatekeep] = useState<'All' | 'Gated' | 'Ungated'>('All');
  const [quickCreatedBy, setQuickCreatedBy] = useState('');
  const [toast, setToast] = useState<string | null>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  // Close filter panel on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) setShowFilters(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) { const t = setTimeout(() => setToast(null), 4000); return () => clearTimeout(t); }
  }, [toast]);

  const activeFilterCount = Object.entries(appliedFilters).filter(([k, v]) =>
    k === 'createdBy' ? v !== '' : v !== 'All'
  ).length;

  const filtered = useMemo(() => {
    return assets.filter(a => {
      const q = search.toLowerCase();
      if (q && !a.name.toLowerCase().includes(q) && !a.symbol.toLowerCase().includes(q) && !a.contract.toLowerCase().includes(q) && !a.protocol.toLowerCase().includes(q)) return false;
      if (quickGatekeep !== 'All' && a.gatekeep !== quickGatekeep) return false;
      if (quickCreatedBy && !a.createdBy.toLowerCase().includes(quickCreatedBy.toLowerCase())) return false;
      if (appliedFilters.protocol !== 'All' && a.protocol !== appliedFilters.protocol) return false;
      if (appliedFilters.gatekeep !== 'All' && a.gatekeep !== appliedFilters.gatekeep) return false;
      if (appliedFilters.tokenStatus !== 'All' && a.tokenStatus !== appliedFilters.tokenStatus) return false;
      if (appliedFilters.createdBy && !a.createdBy.toLowerCase().includes(appliedFilters.createdBy.toLowerCase())) return false;
      if (appliedFilters.custodyTrust !== 'All' && !a.custodyTrustEntities.includes(appliedFilters.custodyTrust)) return false;
      if (appliedFilters.goAccountTrust !== 'All' && !a.goAccountTrustEntities.includes(appliedFilters.goAccountTrust)) return false;
      return true;
    });
  }, [search, assets, quickGatekeep, quickCreatedBy, appliedFilters]);

  const stats = useMemo(() => {
    const total = assets.length;
    const recent = assets.filter(a => {
      try {
        const d = new Date(a.createdAt.replace('@', '').replace(/(\d{2}) (\w+) (\d{2})/, '20$3-$2-$1'));
        return (Date.now() - d.getTime()) < 30 * 24 * 60 * 60 * 1000;
      } catch { return false; }
    }).length;
    const gated = assets.filter(a => a.gatekeep === 'Gated').length;
    return { total, recent, gated };
  }, [assets]);

  const handleSave = (updated: Asset) => {
    setAssets(prev => prev.map(a => a.id === updated.id ? updated : a));
    setSelectedAsset(updated);
    setToast(`Changes to "${updated.name}" saved successfully.`);
  };

  return (
    <div className="min-h-full">
      {/* Toast */}
      {toast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 bg-[#0D1B2A] text-white px-5 py-3 rounded-xl shadow-xl text-sm font-medium animate-fade-in">
          <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
              <path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          {toast}
          <button onClick={() => setToast(null)} className="ml-1 text-white/50 hover:text-white">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 2l8 8M10 2L2 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-5">
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
          <span>Admin Tools</span><span>/</span>
          <span className="text-gray-600">Asset Management</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[22px] font-semibold text-[#0D1B2A] tracking-tight">Asset Management</h1>
            <p className="text-sm text-gray-500 mt-0.5">BitGo-supported assets and their onboarding status</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-1.5 text-sm text-gray-600">
              <div className="w-2 h-2 rounded-full bg-[#FF6B00]"></div>BitGo Trust
            </div>
            <button className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1.5">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 2H3a1 1 0 00-1 1v10a1 1 0 001 1h10a1 1 0 001-1V9M14 2l-6 6M10 2h4v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="px-8 py-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <StatCard label="Total assets" value={stats.total} icon="total" />
          <StatCard label="Onboarded last 30 days" value={stats.recent} icon="recent" />
          <StatCard label="Total gated assets" value={stats.gated} icon="gated" />
        </div>

        {/* Search + Filters row */}
        <div className="flex items-center gap-3 mb-3">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.4"/>
              <path d="M10 10l2.5 2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by symbol, name, or contract"
              className="w-full pl-8 pr-4 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-[#2B3CE8] focus:ring-2 focus:ring-[#2B3CE8]/10 bg-white"
            />
          </div>
          {/* Filters button */}
          <div className="relative" ref={filterRef}>
            <button
              onClick={() => { setDraftFilters(appliedFilters); setShowFilters(v => !v); }}
              className={`flex items-center gap-1.5 px-3 py-2 text-sm border rounded-lg transition-colors bg-white ${
                showFilters || activeFilterCount > 0 ? 'border-[#2B3CE8] text-[#2B3CE8]' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 3h12M3 7h8M5 11h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
              Filters
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#2B3CE8] text-white text-[10px] font-bold flex items-center justify-center">{activeFilterCount}</span>
              )}
            </button>

            {/* Filter dropdown panel */}
            {showFilters && (
              <div className="absolute right-0 top-10 w-72 bg-white border border-gray-200 rounded-xl shadow-xl z-30 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                  <span className="text-sm font-semibold text-[#0D1B2A]">Filters</span>
                  {activeFilterCount > 0 && (
                    <button onClick={() => { setDraftFilters(DEFAULT_FILTERS); setAppliedFilters(DEFAULT_FILTERS); }} className="text-xs text-gray-400 hover:text-gray-600">Clear all</button>
                  )}
                </div>
                <div className="max-h-[420px] overflow-y-auto px-4 py-3 space-y-5">
                  <FilterSection label="Protocol">
                    {PROTOCOLS.map(p => (
                      <RadioOption key={p} label={p} checked={draftFilters.protocol === p} onChange={() => setDraftFilters(f => ({ ...f, protocol: p }))} />
                    ))}
                  </FilterSection>
                  <FilterSection label="Gatekeep status">
                    {['All', 'Gated', 'Ungated'].map(g => (
                      <RadioOption key={g} label={g} checked={draftFilters.gatekeep === g} onChange={() => setDraftFilters(f => ({ ...f, gatekeep: g }))} />
                    ))}
                  </FilterSection>
                  <FilterSection label="Token status">
                    {TOKEN_STATUSES.map(s => (
                      <RadioOption key={s} label={s} checked={draftFilters.tokenStatus === s} onChange={() => setDraftFilters(f => ({ ...f, tokenStatus: s }))} />
                    ))}
                  </FilterSection>
                  <FilterSection label="Custody Trust Entity">
                    <RadioOption label="All" checked={draftFilters.custodyTrust === 'All'} onChange={() => setDraftFilters(f => ({ ...f, custodyTrust: 'All' }))} />
                    {TRUST_ENTITIES.map(e => (
                      <RadioOption key={e} label={e} checked={draftFilters.custodyTrust === e} onChange={() => setDraftFilters(f => ({ ...f, custodyTrust: e }))} />
                    ))}
                  </FilterSection>
                  <FilterSection label="Go Account Trust Entity">
                    <RadioOption label="All" checked={draftFilters.goAccountTrust === 'All'} onChange={() => setDraftFilters(f => ({ ...f, goAccountTrust: 'All' }))} />
                    {TRUST_ENTITIES.map(e => (
                      <RadioOption key={e} label={e} checked={draftFilters.goAccountTrust === e} onChange={() => setDraftFilters(f => ({ ...f, goAccountTrust: e }))} />
                    ))}
                  </FilterSection>
                  <FilterSection label="Created by">
                    <input
                      value={draftFilters.createdBy}
                      onChange={e => setDraftFilters(f => ({ ...f, createdBy: e.target.value }))}
                      placeholder="e.g. user@bitgo.com"
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-[#2B3CE8] mt-1"
                    />
                    <p className="text-[11px] text-gray-400 mt-1">Exact match on creator email or service ID.</p>
                  </FilterSection>
                </div>
                <div className="px-4 py-3 border-t border-gray-100 flex justify-end gap-2">
                  <button onClick={() => setShowFilters(false)} className="px-4 py-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                  <button
                    onClick={() => { setAppliedFilters(draftFilters); setShowFilters(false); }}
                    className="px-4 py-1.5 text-sm bg-[#2B3CE8] text-white rounded-lg hover:bg-[#2232CC] font-medium"
                  >Apply</button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick filter pills */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs text-gray-400 font-medium">Quick filters:</span>
          {/* Gatekeep quick filter */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
            {(['All', 'Gated', 'Ungated'] as const).map(opt => (
              <button
                key={opt}
                onClick={() => setQuickGatekeep(opt)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                  quickGatekeep === opt ? 'bg-white shadow-sm text-[#0D1B2A]' : 'text-gray-500 hover:text-gray-700'
                }`}
              >{opt === 'All' ? 'All gatekeep' : opt}</button>
            ))}
          </div>
          {/* Created by quick filter */}
          <div className="relative">
            <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" width="12" height="12" viewBox="0 0 12 12" fill="none">
              <circle cx="5" cy="4" r="2.5" stroke="currentColor" strokeWidth="1.2"/>
              <path d="M1 11c0-2.21 1.79-3 4-3s4 .79 4 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            <input
              value={quickCreatedBy}
              onChange={e => setQuickCreatedBy(e.target.value)}
              placeholder="Filter by creator..."
              className="pl-7 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg outline-none focus:border-[#2B3CE8] bg-white w-48"
            />
            {quickCreatedBy && (
              <button onClick={() => setQuickCreatedBy('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 2l6 6M8 2L2 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
              </button>
            )}
          </div>
          {/* Active filter chips */}
          {activeFilterCount > 0 && (
            <button onClick={() => setAppliedFilters(DEFAULT_FILTERS)} className="text-xs text-gray-400 hover:text-red-500 flex items-center gap-1 ml-1">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 2l6 6M8 2L2 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
              Clear panel filters
            </button>
          )}
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/80">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-52">Created</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Asset</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-20">Type</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-24">Protocol</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-36">Contract</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-52">Last Updated</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-24">Gatekeep</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((asset) => (
                <tr key={asset.id} onClick={() => setSelectedAsset(asset)} className="hover:bg-blue-50/40 cursor-pointer transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="text-xs text-gray-600 font-medium truncate max-w-[180px]">{asset.createdBy}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{asset.createdAt}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${avatarColor(asset.name)}`}>
                        {asset.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-[#0D1B2A]">{asset.name}</p>
                        <p className="text-xs text-gray-400 font-mono">{asset.bitgoSymbol}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      asset.type === 'Token' ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'
                    }`}>{asset.type}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-sm text-gray-600 font-mono">{asset.protocol}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-xs text-gray-500 font-mono">
                      {asset.contract === '—' ? '—' : `${asset.contract.slice(0, 8)}...${asset.contract.slice(-4)}`}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="text-xs text-gray-600 font-medium truncate max-w-[180px]">{asset.updatedBy}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{asset.updatedAt}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                      asset.gatekeep === 'Gated' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-500'
                    }`}>{asset.gatekeep}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-12 text-center text-gray-400 text-sm">No assets match your filters.</div>
          )}
          <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/50">
            <p className="text-xs text-gray-400">{filtered.length} of {assets.length} assets</p>
          </div>
        </div>
      </div>

      {selectedAsset && (
        <AssetModal asset={selectedAsset} onClose={() => setSelectedAsset(null)} onSave={handleSave} />
      )}
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: number; icon: string }) {
  const configs: Record<string, { iconBg: string; svg: React.ReactNode }> = {
    total: { iconBg: 'bg-[#EEF2FF]', svg: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 9h14M2 5h14M2 13h14" stroke="#2B3CE8" strokeWidth="1.5" strokeLinecap="round"/></svg> },
    recent: { iconBg: 'bg-[#F0FDF4]', svg: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="6.5" stroke="#16A34A" strokeWidth="1.5"/><path d="M9 5.5V9l2.5 2.5" stroke="#16A34A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg> },
    gated: { iconBg: 'bg-orange-50', svg: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="3" y="8" width="12" height="8" rx="1.5" stroke="#EA580C" strokeWidth="1.5"/><path d="M6 8V6a3 3 0 016 0v2" stroke="#EA580C" strokeWidth="1.5" strokeLinecap="round"/></svg> },
  };
  const c = configs[icon];
  return (
    <div className="bg-white rounded-xl border border-gray-200 px-5 py-4 flex items-center gap-4 shadow-sm">
      <div className={`w-10 h-10 ${c.iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}>{c.svg}</div>
      <div>
        <p className="text-2xl font-bold text-[#0D1B2A]">{value}</p>
        <p className="text-xs text-gray-500 mt-0.5">{label}</p>
      </div>
    </div>
  );
}

function FilterSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{label}</p>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function RadioOption({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group">
      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${checked ? 'border-[#2B3CE8]' : 'border-gray-300 group-hover:border-gray-400'}`}>
        {checked && <div className="w-2 h-2 rounded-full bg-[#2B3CE8]" />}
      </div>
      <span className={`text-sm ${checked ? 'text-[#0D1B2A] font-medium' : 'text-gray-600'}`}>{label}</span>
      <input type="radio" checked={checked} onChange={onChange} className="sr-only" />
    </label>
  );
}
