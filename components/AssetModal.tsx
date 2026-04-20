'use client';

import React, { useState, useEffect } from 'react';
import { Asset } from './BitgoAssets';
import { JURISDICTIONS } from './OnboardTokenWizard';

interface Props {
  asset: Asset;
  onClose: () => void;
  onSave: (updated: Asset) => void;
}

type Tab = 'details' | 'audit';

type ChangeItem = {
  field: string;
  before: string;
  after: string;
};

function computeChanges(original: Asset, updated: Asset): ChangeItem[] {
  const items: ChangeItem[] = [];
  if (updated.gatekeep !== original.gatekeep) {
    items.push({ field: 'Gatekeep', before: original.gatekeep, after: updated.gatekeep });
  }
  const custodyBefore = original.custodyTrustEntities.slice().sort().join(', ');
  const custodyAfter = updated.custodyTrustEntities.slice().sort().join(', ');
  if (custodyBefore !== custodyAfter) {
    items.push({
      field: 'Custody Trust Entity',
      before: original.custodyTrustEntities.length ? original.custodyTrustEntities.join(', ') : 'None',
      after: updated.custodyTrustEntities.length ? updated.custodyTrustEntities.join(', ') : 'None',
    });
  }
  const goBefore = original.goAccountTrustEntities.slice().sort().join(', ');
  const goAfter = updated.goAccountTrustEntities.slice().sort().join(', ');
  if (goBefore !== goAfter) {
    items.push({
      field: 'Go Account Trust Entity',
      before: original.goAccountTrustEntities.length ? original.goAccountTrustEntities.join(', ') : 'None',
      after: updated.goAccountTrustEntities.length ? updated.goAccountTrustEntities.join(', ') : 'None',
    });
  }
  return items;
}

function avatarColor(name: string) {
  const c = name.charAt(0);
  if (c === 'T') return 'bg-slate-500';
  if (c === 'G') return 'bg-violet-500';
  if (c === 'A') return 'bg-amber-500';
  if (c === 'U') return 'bg-blue-500';
  return 'bg-gray-400';
}

export default function AssetModal({ asset, onClose, onSave }: Props) {
  const [tab, setTab] = useState<Tab>('details');
  const [editing, setEditing] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [draft, setDraft] = useState<Asset>(asset);
  const [pendingChanges, setPendingChanges] = useState<ChangeItem[]>([]);

  useEffect(() => {
    setDraft(asset);
    setEditing(false);
    setConfirming(false);
    setTab('details');
  }, [asset]);

  const handleReviewChanges = () => {
    const changes = computeChanges(asset, draft);
    if (changes.length === 0) { setEditing(false); return; }
    setPendingChanges(changes);
    setConfirming(true);
  };

  const handleConfirm = () => {
    const now = new Date();
    const dateStr =
      now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' }) +
      ' @' + now.toTimeString().slice(0, 8);
    const updated: Asset = {
      ...draft,
      updatedBy: 'abisheksingh@bitgo.com',
      updatedAt: dateStr,
      auditLog: [
        ...asset.auditLog,
        {
          date: dateStr,
          user: 'abisheksingh@bitgo.com',
          action: 'Modified',
          changes: pendingChanges.map(c => `${c.field}: ${c.before} → ${c.after}`).join('; '),
        },
      ],
    };
    onSave(updated);
    setEditing(false);
    setConfirming(false);
  };

  const toggleJurisdiction = (field: 'custodyTrustEntities' | 'goAccountTrustEntities', j: string) => {
    const current = draft[field];
    setDraft(prev => ({
      ...prev,
      [field]: current.includes(j) ? current.filter(x => x !== j) : [...current, j],
    }));
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/20 z-40" onClick={confirming ? undefined : onClose} />

      {/* Panel */}
      <div className="fixed top-0 right-0 h-full w-[520px] bg-white shadow-2xl z-50 flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold ${avatarColor(asset.name)}`}>
              {asset.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-[15px] font-semibold text-[#0D1B2A]">{asset.name}</h2>
              <p className="text-xs text-gray-400 font-mono">{asset.bitgoSymbol}</p>
            </div>
          </div>
          {!confirming && (
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </button>
          )}
        </div>

        {/* Tabs — hidden during confirmation */}
        {!confirming && (
          <div className="flex border-b border-gray-200 px-6">
            {(['details', 'audit'] as Tab[]).map((id) => (
              <button
                key={id}
                onClick={() => { setTab(id); setEditing(false); }}
                className={`py-3 px-1 mr-6 text-sm font-medium border-b-2 transition-colors capitalize ${
                  tab === id ? 'border-[#2B3CE8] text-[#2B3CE8]' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {id === 'details' ? 'Asset Details' : (
                  <>Audit Log <span className="ml-1 text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full font-normal">{asset.auditLog.length}</span></>
                )}
              </button>
            ))}
          </div>
        )}

        {/* ── CONFIRMATION PREVIEW ─────────────────────────────── */}
        {confirming ? (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-5">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M7 2L12.5 11.5H1.5L7 2Z" stroke="#D97706" strokeWidth="1.4" strokeLinejoin="round"/>
                    <path d="M7 6v2.5M7 10v.5" stroke="#D97706" strokeWidth="1.3" strokeLinecap="round"/>
                  </svg>
                </div>
                <h3 className="text-[15px] font-semibold text-[#0D1B2A]">Review changes</h3>
              </div>
              <p className="text-xs text-gray-500 mb-5 ml-9">
                Please review the following changes before confirming. This action will be logged.
              </p>

              <div className="space-y-3">
                {pendingChanges.map((change, i) => (
                  <div key={i} className="rounded-xl border border-gray-200 overflow-hidden">
                    <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-200">
                      <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">{change.field}</span>
                    </div>
                    <div className="p-4 space-y-3">
                      {/* Before */}
                      <div>
                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Before</p>
                        <div className="bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                          <p className="text-sm text-red-700 leading-relaxed">{change.before}</p>
                        </div>
                      </div>
                      {/* Arrow */}
                      <div className="flex items-center justify-center">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M8 3v10M4 9l4 4 4-4" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      {/* After */}
                      <div>
                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">After</p>
                        <div className="bg-green-50 border border-green-100 rounded-lg px-3 py-2">
                          <p className="text-sm text-green-700 leading-relaxed">{change.after}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 flex items-start gap-2">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="mt-0.5 flex-shrink-0">
                  <circle cx="7" cy="7" r="5.5" stroke="#3B82F6" strokeWidth="1.2"/>
                  <path d="M7 6v3.5M7 4.5v.5" stroke="#3B82F6" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
                <p className="text-xs text-blue-700">
                  These changes will be recorded in the asset's audit log and attributed to <span className="font-medium">abisheksingh@bitgo.com</span>.
                </p>
              </div>
            </div>

            {/* Confirmation footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50/50">
              <button
                onClick={() => setConfirming(false)}
                className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 font-medium"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M9 11L5 7l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Back to editing
              </button>
              <button
                onClick={handleConfirm}
                className="flex items-center gap-2 px-5 py-2 bg-[#2B3CE8] text-white text-sm font-semibold rounded-lg hover:bg-[#2232CC] transition-colors shadow-sm"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7l3.5 3.5L12 3" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Confirm changes
              </button>
            </div>
          </>
        ) : (
          <>
            {/* ── DETAILS TAB ──────────────────────────────────── */}
            <div className="flex-1 overflow-y-auto">
              {tab === 'details' && (
                <div className="px-6 py-5 space-y-6">
                  <Section title="Token info">
                    <FieldRow label="Token name" value={asset.name} />
                    <div className="grid grid-cols-2 gap-4">
                      <FieldRow label="Environment" value={asset.environment} />
                      <FieldRow label="Token type" value={asset.tokenType} />
                    </div>
                    <FieldRow label="Contract address" value={asset.contract} mono />
                    <div className="grid grid-cols-2 gap-4">
                      <FieldRow label="BitGo symbol" value={asset.bitgoSymbol} mono />
                      <FieldRow label="Decimals" value={String(asset.decimals)} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Token status</p>
                        <span className="inline-flex px-2.5 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                          {asset.tokenStatus}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Gatekeep status</p>
                        {editing ? (
                          <div className="flex gap-2">
                            {(['Gated', 'Ungated'] as const).map(opt => (
                              <button
                                key={opt}
                                onClick={() => setDraft(p => ({ ...p, gatekeep: opt }))}
                                className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                                  draft.gatekeep === opt
                                    ? opt === 'Gated' ? 'bg-orange-100 text-orange-700 border-orange-300' : 'bg-gray-100 text-gray-600 border-gray-300'
                                    : 'border-gray-200 text-gray-400 hover:border-gray-300'
                                }`}
                              >{opt}</button>
                            ))}
                          </div>
                        ) : (
                          <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${
                            asset.gatekeep === 'Gated' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-500'
                          }`}>{asset.gatekeep}</span>
                        )}
                      </div>
                    </div>
                  </Section>

                  <div className="h-px bg-gray-100" />

                  <Section title="Custody Trust">
                    <div>
                      <p className="text-xs text-gray-400 mb-2">Custody Trust Entity</p>
                      {editing ? (
                        <JurisdictionPicker
                          selected={draft.custodyTrustEntities}
                          onToggle={j => toggleJurisdiction('custodyTrustEntities', j)}
                          onAll={() => setDraft(p => ({ ...p, custodyTrustEntities: [...JURISDICTIONS] }))}
                          onClear={() => setDraft(p => ({ ...p, custodyTrustEntities: [] }))}
                        />
                      ) : (
                        <JurisdictionTags values={asset.custodyTrustEntities} />
                      )}
                    </div>
                  </Section>

                  <div className="h-px bg-gray-100" />

                  <Section title="Go Account Trust">
                    <div>
                      <p className="text-xs text-gray-400 mb-2">Go Account Trust Entity</p>
                      {editing ? (
                        <JurisdictionPicker
                          selected={draft.goAccountTrustEntities}
                          onToggle={j => toggleJurisdiction('goAccountTrustEntities', j)}
                          onAll={() => setDraft(p => ({ ...p, goAccountTrustEntities: [...JURISDICTIONS] }))}
                          onClear={() => setDraft(p => ({ ...p, goAccountTrustEntities: [] }))}
                        />
                      ) : (
                        <JurisdictionTags values={asset.goAccountTrustEntities} />
                      )}
                    </div>
                  </Section>

                  <div className="h-px bg-gray-100" />

                  <Section title="Future scope">
                    <div className="rounded-lg border border-dashed border-gray-200 p-4 space-y-3 bg-gray-50/50">
                      <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-2">Coming soon — requires elevated permissions</p>
                      {['Token name', 'Pricing details', 'Decimals'].map(f => (
                        <div key={f} className="flex items-center justify-between">
                          <span className="text-sm text-gray-400">{f}</span>
                          <span className="text-xs bg-gray-100 text-gray-400 px-2 py-0.5 rounded flex items-center gap-1">
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                              <rect x="1.5" y="4.5" width="7" height="4.5" rx="0.8" stroke="#9CA3AF" strokeWidth="1"/>
                              <path d="M3 4.5V3a2 2 0 014 0v1.5" stroke="#9CA3AF" strokeWidth="1" strokeLinecap="round"/>
                            </svg>
                            Locked
                          </span>
                        </div>
                      ))}
                    </div>
                  </Section>
                </div>
              )}

              {/* ── AUDIT LOG TAB ─────────────────────────────── */}
              {tab === 'audit' && (
                <div className="px-6 py-5">
                  <p className="text-xs text-gray-400 mb-5">Complete history of changes since creation.</p>
                  <div className="relative">
                    <div className="absolute left-3.5 top-2 bottom-2 w-px bg-gray-200" />
                    <div className="space-y-0">
                      {[...asset.auditLog].reverse().map((log, i) => (
                        <div key={i} className="relative flex gap-4 pb-6 last:pb-0">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                            log.action === 'Created' ? 'bg-green-100' : 'bg-blue-100'
                          }`}>
                            {log.action === 'Created' ? (
                              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                <path d="M2 6l2.5 2.5L10 3" stroke="#16A34A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            ) : (
                              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                <path d="M1 6h10M8 3l3 3-3 3" stroke="#2B3CE8" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            )}
                          </div>
                          <div className="flex-1 pt-0.5">
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                              log.action === 'Created' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                            }`}>{log.action}</span>
                            <p className="text-sm text-[#0D1B2A] mt-1.5">{log.changes}</p>
                            <div className="flex items-center gap-2 mt-1.5">
                              <p className="text-xs text-gray-400">{log.user}</p>
                              <span className="text-gray-300">·</span>
                              <p className="text-xs text-gray-400">{log.date}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            {tab === 'details' && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50/50">
                <div className="text-xs text-gray-400">
                  Updated by <span className="text-gray-600 font-medium">{asset.updatedBy}</span>
                  <span className="mx-1">·</span>{asset.updatedAt}
                </div>
                <div className="flex gap-2">
                  {editing ? (
                    <>
                      <button
                        onClick={() => { setDraft(asset); setEditing(false); }}
                        className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleReviewChanges}
                        className="px-4 py-2 text-sm bg-[#2B3CE8] text-white rounded-lg hover:bg-[#2232CC] font-medium flex items-center gap-1.5"
                      >
                        Save changes
                        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                          <path d="M2 6.5h9M7 2.5l4 4-4 4" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setEditing(true)}
                      className="flex items-center gap-1.5 px-4 py-2 text-sm bg-[#2B3CE8] text-white rounded-lg hover:bg-[#2232CC] font-medium"
                    >
                      <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                        <path d="M9 2l2 2-7 7H2V9l7-7z" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Modify asset
                    </button>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">{title}</h4>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function FieldRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <p className="text-xs text-gray-400 mb-0.5">{label}</p>
      <p className={`text-sm text-[#0D1B2A] font-medium break-all ${mono ? 'font-mono text-xs' : ''}`}>{value || '—'}</p>
    </div>
  );
}

function JurisdictionTags({ values }: { values: string[] }) {
  if (values.length === 0) return <p className="text-sm text-gray-400">None selected</p>;
  return (
    <div className="flex flex-wrap gap-1.5">
      {values.map(v => (
        <span key={v} className="px-2.5 py-1 bg-[#EEF2FF] text-[#2B3CE8] text-xs font-medium rounded-full">{v}</span>
      ))}
    </div>
  );
}

function JurisdictionPicker({ selected, onToggle, onAll, onClear }: {
  selected: string[];
  onToggle: (j: string) => void;
  onAll: () => void;
  onClear: () => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-gray-400">{selected.length} of {JURISDICTIONS.length} selected</span>
        <div className="flex gap-2">
          <button onClick={onAll} className="text-xs text-[#2B3CE8] hover:underline">Select all</button>
          <span className="text-gray-300">|</span>
          <button onClick={onClear} className="text-xs text-gray-400 hover:underline">Clear</button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        {JURISDICTIONS.map(j => (
          <button
            key={j}
            onClick={() => onToggle(j)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs text-left transition-all ${
              selected.includes(j)
                ? 'border-[#2B3CE8] bg-[#EEF2FF] text-[#2B3CE8] font-medium'
                : 'border-gray-200 text-gray-600 hover:border-gray-300'
            }`}
          >
            <div className={`w-3.5 h-3.5 rounded flex items-center justify-center flex-shrink-0 border ${
              selected.includes(j) ? 'bg-[#2B3CE8] border-[#2B3CE8]' : 'border-gray-300'
            }`}>
              {selected.includes(j) && (
                <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                  <path d="M1 3l2 2 4-4" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
            {j}
          </button>
        ))}
      </div>
    </div>
  );
}
