'use client';

import React, { useState, useRef } from 'react';
import { JURISDICTIONS, DEFAULT_CUSTODY } from './OnboardTokenWizard';

const DEFAULT_GO_ACCOUNT = [...JURISDICTIONS];
const PROTOCOLS = ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'Base', 'BSC', 'Avalanche', 'Solana'];
const VENDORS = ['Cryptocompare', 'CoinGecko', 'CoinMarketCap', 'Kaiko', 'Chainlink'];
const TOKEN_TYPES: Record<string, string[]> = {
  Ethereum: ['ERC-20', 'ERC-721', 'ERC-1155'], Polygon: ['ERC-20', 'ERC-721'],
  Arbitrum: ['ERC-20', 'ERC-721'], Optimism: ['ERC-20', 'ERC-721'],
  Base: ['ERC-20', 'ERC-721'], BSC: ['BEP-20', 'BEP-721'],
  Avalanche: ['ARC-20', 'ERC-20'], Solana: ['SPL'],
};
const PROTOCOL_PREFIX: Record<string, string> = {
  Ethereum: 'eth:', Polygon: 'polygon:', Arbitrum: 'arbeth:', Optimism: 'opeth:',
  Base: 'base:', BSC: 'bsc:', Avalanche: 'avaxc:', Solana: 'sol:',
};

type TokenRow = {
  id: string;
  protocol: string;
  contractAddress: string;
  tokenName: string;
  displayName: string;
  tokenType: string;
  decimals: string;
  symbolSuffix: string;
  pricingVendor: string;       // required
  pricingAssetId: string;      // optional
  pricingAssetSymbol: string;  // optional
  gatekeep: 'Gated' | 'Ungated';
  custodyEntities: string[];   // required — at least 1
  goAccountsApplicable: boolean;
  goAccountEntities: string[]; // required if goAccountsApplicable
  errors: string[];
  status?: 'success' | 'failed';
  failReason?: string;
};

function generateId() { return Math.random().toString(36).slice(2, 9); }

function validateRow(row: TokenRow): string[] {
  const errs: string[] = [];
  if (!row.protocol) errs.push('Protocol is required');
  if (!row.contractAddress.trim()) errs.push('Contract address is required');
  else if (row.protocol !== 'Solana' && !/^0x[0-9a-fA-F]{40}$/.test(row.contractAddress.trim()))
    errs.push('Invalid EVM address — must be 0x + 40 hex chars');
  if (!row.tokenName.trim()) errs.push('Token name is required');
  if (!row.symbolSuffix.trim()) errs.push('Symbol suffix is required');
  if (!row.decimals || isNaN(Number(row.decimals))) errs.push('Valid decimals required');
  if (!row.pricingVendor) errs.push('Pricing vendor is required');
  if (row.custodyEntities.length === 0) errs.push('At least 1 Custody Trust Entity required');
  if (row.goAccountsApplicable && row.goAccountEntities.length === 0)
    errs.push('Go Account Trust Entity required when Go Accounts is applicable');
  return errs;
}

function emptyRow(protocol = 'Ethereum'): TokenRow {
  return {
    id: generateId(), protocol, contractAddress: '', tokenName: '', displayName: '',
    tokenType: TOKEN_TYPES[protocol]?.[0] || 'ERC-20',
    decimals: '18', symbolSuffix: '',
    pricingVendor: 'Cryptocompare', pricingAssetId: '', pricingAssetSymbol: '',
    gatekeep: 'Ungated',
    custodyEntities: [...DEFAULT_CUSTODY],
    goAccountsApplicable: true,
    goAccountEntities: [...DEFAULT_GO_ACCOUNT],
    errors: [],
  };
}

function parseCSV(text: string): TokenRow[] {
  const lines = text.trim().split('\n').filter(l => l.trim() && !l.toLowerCase().startsWith('protocol'));
  return lines.map(line => {
    const cols = line.split(',').map(s => s.trim().replace(/^"|"$/g, ''));
    const [
      protocol = 'Ethereum', contractAddress = '', tokenName = '',
      symbolSuffix = '', decimals = '18', tokenType = '',
      pricingVendor = 'Cryptocompare', pricingAssetId = '', pricingAssetSymbol = '',
      gatekeepRaw = 'Ungated', custodyRaw = '', goApplicableRaw = 'Yes', goAccountRaw = '',
    ] = cols;
    const gatekeep = gatekeepRaw === 'Gated' ? 'Gated' : 'Ungated';
    const custodyEntities = custodyRaw
      ? custodyRaw.split('|').map(s => s.trim()).filter(s => JURISDICTIONS.includes(s))
      : [...DEFAULT_CUSTODY];
    const goAccountsApplicable = goApplicableRaw.toLowerCase() !== 'no';
    const goAccountEntities = goAccountRaw
      ? goAccountRaw.split('|').map(s => s.trim()).filter(s => JURISDICTIONS.includes(s))
      : [...DEFAULT_GO_ACCOUNT];
    const row = emptyRow(PROTOCOLS.includes(protocol) ? protocol : 'Ethereum');
    return {
      ...row, contractAddress, tokenName, displayName: tokenName, symbolSuffix, decimals,
      tokenType: tokenType || row.tokenType,
      pricingVendor: VENDORS.includes(pricingVendor) ? pricingVendor : 'Cryptocompare',
      pricingAssetId, pricingAssetSymbol, gatekeep, custodyEntities, goAccountsApplicable, goAccountEntities,
    };
  });
}

// ── CSV template & format guide ───────────────────────────────────────────────
const CSV_TEMPLATE_CONTENT = [
  'protocol,contract_address,token_name,symbol_suffix,decimals,token_type,pricing_vendor,pricing_asset_id,pricing_asset_symbol,gatekeep,custody_trust_entities,go_accounts_applicable,go_account_trust_entities',
  'Ethereum,0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48,USD Coin,usdc,6,ERC-20,Cryptocompare,933526,USDC,Ungated,BitGo Trust|Frankfurt DE Trust|BitGo India,Yes,BitGo Trust|BitGo New York|BitGo Germany|Frankfurt DE Trust|BitGo Singapore|BitGo Korea|BitGo Custody MENA FZE|BitGo India',
  'Polygon,0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174,Wrapped Ether,weth,18,ERC-20,CoinGecko,,,Gated,BitGo Trust|BitGo New York,No,',
].join('\n');

const FORMAT_COLS = [
  { name: 'protocol', required: true, example: 'Ethereum' },
  { name: 'contract_address', required: true, example: '0xA0b8…eB48' },
  { name: 'token_name', required: true, example: 'USD Coin' },
  { name: 'symbol_suffix', required: true, example: 'usdc' },
  { name: 'decimals', required: true, example: '6' },
  { name: 'token_type', required: true, example: 'ERC-20' },
  { name: 'pricing_vendor', required: true, example: 'Cryptocompare' },
  { name: 'pricing_asset_id', required: false, example: '933526' },
  { name: 'pricing_asset_symbol', required: false, example: 'USDC' },
  { name: 'gatekeep', required: true, example: 'Ungated' },
  { name: 'custody_trust_entities', required: true, example: 'BitGo Trust|Frankfurt DE Trust' },
  { name: 'go_accounts_applicable', required: true, example: 'Yes' },
  { name: 'go_account_trust_entities', required: false, example: 'BitGo Trust|BitGo New York' },
];

type Step = 'upload' | 'review' | 'results';

export default function BulkOnboard() {
  const [step, setStep] = useState<Step>('upload');
  const [rows, setRows] = useState<TokenRow[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [results, setResults] = useState<TokenRow[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const processCSV = (file: File) => {
    if (!file.name.endsWith('.csv')) { setUploadError('Please upload a .csv file.'); return; }
    const reader = new FileReader();
    reader.onload = e => {
      const parsed = parseCSV(e.target?.result as string);
      if (parsed.length === 0) { setUploadError('No valid rows found in CSV.'); return; }
      setRows(parsed.map(r => ({ ...r, errors: validateRow(r) })));
      setStep('review'); setUploadError('');
    };
    reader.readAsText(file);
  };

  const updateRow = (id: string, patch: Partial<TokenRow>) => {
    setRows(prev => prev.map(r => {
      if (r.id !== id) return r;
      const updated = { ...r, ...patch };
      if (patch.protocol) updated.tokenType = TOKEN_TYPES[patch.protocol]?.[0] || 'ERC-20';
      updated.errors = validateRow(updated);
      return updated;
    }));
  };

  const removeRow = (id: string) => setRows(prev => prev.filter(r => r.id !== id));
  const addRow = () => setRows(prev => [...prev, { ...emptyRow(), errors: validateRow(emptyRow()) }]);

  const handleSubmit = () => {
    const ready = rows.filter(r => r.errors.length === 0);
    setResults(ready.map(r => ({
      ...r,
      status: r.tokenName.toLowerCase().includes('duplicate') ? 'failed' : 'success',
      failReason: r.tokenName.toLowerCase().includes('duplicate') ? 'Duplicate contract address already exists in AMS' : undefined,
    } as TokenRow)));
    setStep('results');
  };

  const readyRows = rows.filter(r => r.errors.length === 0);
  const invalidRows = rows.filter(r => r.errors.length > 0);

  return (
    <div className="px-8 py-6 max-w-[1200px]">
      {/* Step indicator */}
      <div className="flex items-center gap-0 mb-8">
        {(['upload', 'review', 'results'] as Step[]).map((s, i) => {
          const labels = ['Upload CSV', 'Review & configure', 'Results'];
          const descs = ['Upload your CSV file', 'Validate per-token settings', 'Submission status'];
          const idx = ['upload', 'review', 'results'].indexOf(step);
          const done = i < idx; const active = i === idx;
          return (
            <React.Fragment key={s}>
              <div className="flex flex-col items-center gap-1.5 min-w-[100px]">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${done ? 'bg-[#2B3CE8] text-white' : active ? 'bg-[#2B3CE8] text-white ring-4 ring-[#2B3CE8]/20' : 'bg-gray-200 text-gray-400'}`}>
                  {done ? <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2.5 7l3 3 6-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg> : i + 1}
                </div>
                <div className="text-center">
                  <div className={`text-xs font-medium ${active ? 'text-[#2B3CE8]' : done ? 'text-gray-700' : 'text-gray-400'}`}>{labels[i]}</div>
                  <div className="text-[10px] text-gray-400">{descs[i]}</div>
                </div>
              </div>
              {i < 2 && <div className={`flex-1 h-[2px] mt-4 ${done ? 'bg-[#2B3CE8]' : 'bg-gray-200'}`} />}
            </React.Fragment>
          );
        })}
      </div>

      {/* ── STEP 1: UPLOAD ──────────────────────────────────────────────────── */}
      {step === 'upload' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#EEF2FF] flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M9 3v8M5 7l4-5 4 5" stroke="#2B3CE8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 13v2a1 1 0 001 1h12a1 1 0 001-1v-2" stroke="#2B3CE8" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <h3 className="text-[15px] font-semibold text-[#0D1B2A]">Upload CSV file</h3>
                <p className="text-xs text-gray-500">Each row represents one token — all distribution settings configurable per row</p>
              </div>
              <a href={`data:text/csv;charset=utf-8,${encodeURIComponent(CSV_TEMPLATE_CONTENT)}`}
                download="ams-bulk-template.csv"
                className="ml-auto flex items-center gap-1.5 text-xs text-[#2B3CE8] hover:underline font-medium">
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path d="M6.5 2v7M3.5 7l3 3 3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M1.5 11h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                </svg>
                Download CSV template
              </a>
            </div>
          </div>

          <div className="px-8 py-8">
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) processCSV(f); }}
              onClick={() => fileRef.current?.click()}
              className={`border-2 border-dashed rounded-xl py-12 text-center cursor-pointer transition-all max-w-lg mx-auto ${dragOver ? 'border-[#2B3CE8] bg-[#EEF2FF]' : 'border-gray-200 hover:border-[#2B3CE8]/40 hover:bg-gray-50/50'}`}>
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <path d="M11 4v10M7 8l4-5 4 5" stroke="#6B7280" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3 16v2a1 1 0 001 1h14a1 1 0 001-1v-2" stroke="#6B7280" strokeWidth="1.6" strokeLinecap="round"/>
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-700">Drop your CSV file here</p>
              <p className="text-xs text-gray-400 mt-1.5">or <span className="text-[#2B3CE8] underline">click to browse</span></p>
              <div className="mt-4 inline-flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-lg">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 1h6l3 3v7a1 1 0 01-1 1H2a1 1 0 01-1-1V2a1 1 0 011-1z" stroke="#9CA3AF" strokeWidth="1.1"/><path d="M8 1v3h3" stroke="#9CA3AF" strokeWidth="1.1"/></svg>
                <span className="text-[11px] text-gray-500 font-mono">.csv files only</span>
              </div>
            </div>
            <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) processCSV(f); }} />

            {uploadError && (
              <div className="mt-4 max-w-lg mx-auto px-4 py-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600 flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="#EF4444" strokeWidth="1.2"/><path d="M7 4.5v3M7 9v.5" stroke="#EF4444" strokeWidth="1.2" strokeLinecap="round"/></svg>
                {uploadError}
              </div>
            )}

            {/* CSV format guide */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Expected CSV columns</p>
                <div className="flex items-center gap-4 text-[11px]">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#2B3CE8]" />Required</span>
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-gray-300" />Optional</span>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-x-auto">
                <table className="text-xs min-w-max w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-100/80">
                      {FORMAT_COLS.map(c => (
                        <th key={c.name} className="px-3 py-2.5 text-left whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${c.required ? 'bg-[#2B3CE8]' : 'bg-gray-300'}`} />
                            <span className="font-mono font-semibold text-gray-700">{c.name}</span>
                            {!c.required && <span className="text-[10px] text-gray-400 font-sans font-normal italic">(optional)</span>}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      {FORMAT_COLS.map(c => (
                        <td key={c.name} className="px-3 py-2 font-mono text-gray-400 whitespace-nowrap">{c.example || <span className="text-gray-300">—</span>}</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                <p className="text-[11px] text-gray-400">Environment is fixed to <span className="font-medium text-gray-600">Mainnet</span> for all tokens.</p>
                <p className="text-[11px] text-gray-400">Separate multiple entities with <span className="font-mono font-semibold text-gray-600">|</span> e.g. <span className="font-mono text-gray-600">BitGo Trust|Frankfurt DE Trust</span></p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── STEP 2: REVIEW ──────────────────────────────────────────────────── */}
      {step === 'review' && (
        <div className="space-y-5">
          {invalidRows.length > 0 && (
            <div className="bg-white rounded-xl border border-red-200 shadow-sm overflow-hidden">
              <div className="px-6 py-3 border-b border-red-100 bg-red-50/50 flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M5 2.5v3M5 7v.5" stroke="#EF4444" strokeWidth="1.3" strokeLinecap="round"/></svg>
                </div>
                <span className="text-sm font-semibold text-red-700">Invalid tokens — {invalidRows.length}</span>
                <span className="text-xs text-red-400">Fix errors or remove rows before submitting</span>
              </div>
              <div className="divide-y divide-gray-50">
                {invalidRows.map(row => (
                  <TokenRowEditor key={row.id} row={row} expanded={expandedRow === row.id}
                    onToggle={() => setExpandedRow(expandedRow === row.id ? null : row.id)}
                    onChange={patch => updateRow(row.id, patch)} onRemove={() => removeRow(row.id)} isInvalid />
                ))}
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-3 border-b border-gray-100 bg-green-50/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l2.5 2.5L9 1" stroke="#16A34A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <span className="text-sm font-semibold text-green-700">Ready for onboarding — {readyRows.length}</span>
              </div>
              <button onClick={addRow} className="flex items-center gap-1.5 text-xs text-[#2B3CE8] font-medium hover:underline">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 2v8M2 6h8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
                Add token
              </button>
            </div>
            {readyRows.length === 0 ? (
              <div className="py-10 text-center text-gray-400 text-sm">No valid tokens yet — fix errors above.</div>
            ) : (
              <div className="divide-y divide-gray-50">
                {readyRows.map(row => (
                  <TokenRowEditor key={row.id} row={row} expanded={expandedRow === row.id}
                    onToggle={() => setExpandedRow(expandedRow === row.id ? null : row.id)}
                    onChange={patch => updateRow(row.id, patch)} onRemove={() => removeRow(row.id)} isInvalid={false} />
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <button onClick={() => { setStep('upload'); setRows([]); }}
              className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 font-medium">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 11L5 7l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Back to upload
            </button>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400">{readyRows.length} ready · {invalidRows.length} invalid</span>
              <button onClick={handleSubmit} disabled={readyRows.length === 0}
                className="px-6 py-2 bg-[#2B3CE8] text-white text-sm font-semibold rounded-lg hover:bg-[#2232CC] disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                Submit {readyRows.length} token{readyRows.length !== 1 ? 's' : ''} →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── STEP 3: RESULTS ─────────────────────────────────────────────────── */}
      {step === 'results' && (
        <div className="space-y-5">
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Total submitted', value: results.length, bg: 'bg-[#EEF2FF]', color: 'text-[#2B3CE8]' },
              { label: 'Successfully onboarded', value: results.filter(r => r.status === 'success').length, bg: 'bg-green-50', color: 'text-green-700' },
              { label: 'Failed', value: results.filter(r => r.status === 'failed').length, bg: 'bg-red-50', color: 'text-red-600' },
            ].map(s => (
              <div key={s.label} className={`${s.bg} rounded-xl border border-gray-200 px-5 py-4`}>
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-3 border-b border-gray-100 bg-gray-50/50">
              <span className="text-sm font-semibold text-[#0D1B2A]">Submission results</span>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  {['Token', 'Protocol', 'Contract', 'Gatekeep', 'Status', 'Details'].map(h => (
                    <th key={h} className="text-left px-5 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {results.map(r => (
                  <tr key={r.id}>
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-[#0D1B2A]">{r.tokenName}</p>
                      <p className="text-xs text-gray-400 font-mono">{(PROTOCOL_PREFIX[r.protocol] || 'eth:') + r.symbolSuffix}</p>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-600 font-mono">{r.protocol}</td>
                    <td className="px-5 py-3.5 text-xs text-gray-500 font-mono">
                      {r.contractAddress ? `${r.contractAddress.slice(0, 10)}...${r.contractAddress.slice(-4)}` : '—'}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${r.gatekeep === 'Gated' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-500'}`}>{r.gatekeep}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${r.status === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                        {r.status === 'success'
                          ? <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l2.5 2.5L9 1" stroke="#16A34A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          : <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M1 1l6 6M7 1L1 7" stroke="#DC2626" strokeWidth="1.4" strokeLinecap="round"/></svg>}
                        {r.status === 'success' ? 'Success' : 'Failed'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-gray-500">{r.status === 'success' ? 'Token onboarded to AMS' : r.failReason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between">
            <button onClick={() => { setStep('upload'); setRows([]); setResults([]); }}
              className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 font-medium">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 11L5 7l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Upload new batch
            </button>
            {results.filter(r => r.status === 'failed').length > 0 && (
              <button onClick={() => { setRows(results.filter(r => r.status === 'failed').map(r => ({ ...r, errors: validateRow(r), status: undefined, failReason: undefined }))); setStep('review'); }}
                className="px-5 py-2 text-sm font-medium border border-[#2B3CE8] text-[#2B3CE8] rounded-lg hover:bg-[#EEF2FF] transition-colors">
                Retry failed tokens
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Token Row Editor ─────────────────────────────────────────────────────────

function TokenRowEditor({ row, expanded, onToggle, onChange, onRemove, isInvalid }: {
  row: TokenRow; expanded: boolean; onToggle: () => void;
  onChange: (p: Partial<TokenRow>) => void; onRemove: () => void; isInvalid: boolean;
}) {
  const prefix = PROTOCOL_PREFIX[row.protocol] || 'eth:';
  const fullSymbol = row.symbolSuffix ? `${prefix}${row.symbolSuffix}` : `${prefix}…`;

  const toggleEntity = (field: 'custodyEntities' | 'goAccountEntities', j: string) => {
    const cur = row[field];
    onChange({ [field]: cur.includes(j) ? cur.filter(x => x !== j) : [...cur, j] });
  };

  return (
    <div className={isInvalid ? 'bg-red-50/20' : ''}>
      {/* Collapsed row */}
      <div className="flex items-center gap-3 px-5 py-3">
        <div className="flex-1 min-w-0 grid grid-cols-[1.5fr_1.5fr_1fr_1fr] gap-3">
          <input value={row.tokenName} onChange={e => onChange({ tokenName: e.target.value, displayName: e.target.value })}
            placeholder="Token name *" className={inputCls(isInvalid && !row.tokenName)} />
          <input value={row.contractAddress} onChange={e => onChange({ contractAddress: e.target.value })}
            placeholder="0x… *" className={`font-mono ${inputCls(isInvalid && !row.contractAddress)}`} />
          <select value={row.protocol} onChange={e => onChange({ protocol: e.target.value, tokenType: TOKEN_TYPES[e.target.value]?.[0] || 'ERC-20' })}
            className={inputCls(false)}>
            {PROTOCOLS.map(p => <option key={p}>{p}</option>)}
          </select>
          <select value={row.tokenType} onChange={e => onChange({ tokenType: e.target.value })} className={inputCls(false)}>
            {(TOKEN_TYPES[row.protocol] || ['ERC-20']).map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button onClick={onToggle} className="text-gray-400 hover:text-[#2B3CE8] p-1 rounded transition-colors" title="Expand all fields">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d={expanded ? 'M3 9l4-4 4 4' : 'M3 5l4 4 4-4'} stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button onClick={onRemove} className="text-gray-300 hover:text-red-500 p-1 rounded transition-colors">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
          </button>
        </div>
      </div>

      {/* Error badges */}
      {isInvalid && row.errors.length > 0 && (
        <div className="px-5 pb-2 flex flex-wrap gap-1.5">
          {row.errors.map((e, i) => (
            <span key={i} className="flex items-center gap-1 text-[11px] text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
              <svg width="9" height="9" viewBox="0 0 9 9" fill="none"><circle cx="4.5" cy="4.5" r="3.5" stroke="#DC2626" strokeWidth="1"/><path d="M4.5 3v2M4.5 6.2v.3" stroke="#DC2626" strokeWidth="1" strokeLinecap="round"/></svg>
              {e}
            </span>
          ))}
        </div>
      )}

      {/* Expanded detail fields */}
      {expanded && (
        <div className="mx-5 mb-4 mt-1 bg-gray-50/80 rounded-xl border border-gray-200 overflow-hidden">
          {/* Asset */}
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2.5">Asset</p>
            <div className="grid grid-cols-5 gap-3">
              <div>
                <p className="text-[11px] text-gray-500 mb-1">Symbol suffix <span className="text-red-400">*</span></p>
                <input value={row.symbolSuffix} onChange={e => onChange({ symbolSuffix: e.target.value })}
                  placeholder="e.g. usdc" className={`font-mono ${inputCls(isInvalid && !row.symbolSuffix)}`} />
              </div>
              <div>
                <p className="text-[11px] text-gray-500 mb-1">Symbol with prefix</p>
                <div className="px-2.5 py-1.5 text-xs font-mono bg-white border border-gray-200 rounded-lg text-gray-600">{fullSymbol}</div>
              </div>
              <div>
                <p className="text-[11px] text-gray-500 mb-1">Decimals <span className="text-red-400">*</span></p>
                <input value={row.decimals} onChange={e => onChange({ decimals: e.target.value })} type="number"
                  placeholder="18" className={inputCls(isInvalid && !row.decimals)} />
              </div>
              <div>
                <p className="text-[11px] text-gray-500 mb-1">Display name</p>
                <input value={row.displayName} onChange={e => onChange({ displayName: e.target.value })}
                  placeholder="Same as token name" className={inputCls(false)} />
              </div>
              <div>
                <p className="text-[11px] text-gray-500 mb-1">Environment</p>
                <div className="px-2.5 py-1.5 text-xs bg-white border border-gray-200 rounded-lg text-gray-500 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />Mainnet
                </div>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2.5">Pricing vendor</p>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <p className="text-[11px] text-gray-500 mb-1">Vendor <span className="text-red-400">*</span></p>
                <select value={row.pricingVendor} onChange={e => onChange({ pricingVendor: e.target.value })} className={inputCls(isInvalid && !row.pricingVendor)}>
                  {VENDORS.map(v => <option key={v}>{v}</option>)}
                </select>
              </div>
              <div>
                <p className="text-[11px] text-gray-500 mb-1 flex items-center gap-1">
                  Asset ID <span className="text-[10px] text-gray-400 bg-gray-200 px-1 rounded font-normal">optional</span>
                </p>
                <input value={row.pricingAssetId} onChange={e => onChange({ pricingAssetId: e.target.value })}
                  placeholder="e.g. 933526" className={inputCls(false)} />
              </div>
              <div>
                <p className="text-[11px] text-gray-500 mb-1 flex items-center gap-1">
                  Asset symbol <span className="text-[10px] text-gray-400 bg-gray-200 px-1 rounded font-normal">optional</span>
                </p>
                <input value={row.pricingAssetSymbol} onChange={e => onChange({ pricingAssetSymbol: e.target.value })}
                  placeholder="e.g. USDC" className={inputCls(false)} />
              </div>
            </div>
          </div>

          {/* Gatekeep */}
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Gatekeep <span className="text-red-400">*</span></p>
            <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-0.5 w-fit">
              {(['Ungated', 'Gated'] as const).map(opt => (
                <button key={opt} onClick={() => onChange({ gatekeep: opt })}
                  className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${row.gatekeep === opt
                    ? opt === 'Gated' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-700'
                    : 'text-gray-400 hover:text-gray-600'}`}>
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Custody Trust Entity */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                Custody Trust Entity <span className="text-red-400">*</span>
                <span className={`ml-2 font-normal normal-case ${row.custodyEntities.length === 0 ? 'text-red-500' : 'text-gray-400'}`}>
                  {row.custodyEntities.length === 0 ? '— at least 1 required' : `— ${row.custodyEntities.length} selected`}
                </span>
              </p>
              <div className="flex gap-2">
                <button onClick={() => onChange({ custodyEntities: [...JURISDICTIONS] })} className="text-[11px] text-[#2B3CE8] hover:underline">All</button>
                <span className="text-gray-300">|</span>
                <button onClick={() => onChange({ custodyEntities: [] })} className="text-[11px] text-gray-400 hover:underline">Clear</button>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {JURISDICTIONS.map(j => (
                <button key={j} onClick={() => toggleEntity('custodyEntities', j)}
                  className={`px-2.5 py-1 rounded-full text-[11px] border transition-all ${row.custodyEntities.includes(j) ? 'bg-[#EEF2FF] border-[#2B3CE8] text-[#2B3CE8] font-medium' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                  {j}
                </button>
              ))}
            </div>
          </div>

          {/* Go Accounts */}
          <div className="px-4 py-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Go Accounts applicable <span className="text-red-400">*</span></p>
              <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-0.5 w-fit">
                {(['Yes', 'No'] as const).map(opt => (
                  <button key={opt} onClick={() => onChange({ goAccountsApplicable: opt === 'Yes', goAccountEntities: opt === 'No' ? [] : row.goAccountEntities })}
                    className={`px-3 py-1 rounded-md text-[11px] font-medium transition-all ${(opt === 'Yes') === row.goAccountsApplicable ? 'bg-gray-100 text-gray-700' : 'text-gray-400'}`}>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
            {row.goAccountsApplicable && (
              <>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                    Go Account Trust Entity
                    <span className={`ml-2 font-normal normal-case ${row.goAccountsApplicable && row.goAccountEntities.length === 0 ? 'text-red-500' : 'text-gray-400'}`}>
                      {row.goAccountsApplicable && row.goAccountEntities.length === 0 ? '— at least 1 required' : `— ${row.goAccountEntities.length} selected`}
                    </span>
                  </p>
                  <div className="flex gap-2">
                    <button onClick={() => onChange({ goAccountEntities: [...JURISDICTIONS] })} className="text-[11px] text-[#2B3CE8] hover:underline">All</button>
                    <span className="text-gray-300">|</span>
                    <button onClick={() => onChange({ goAccountEntities: [] })} className="text-[11px] text-gray-400 hover:underline">Clear</button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {JURISDICTIONS.map(j => (
                    <button key={j} onClick={() => toggleEntity('goAccountEntities', j)}
                      className={`px-2.5 py-1 rounded-full text-[11px] border transition-all ${row.goAccountEntities.includes(j) ? 'bg-[#EEF2FF] border-[#2B3CE8] text-[#2B3CE8] font-medium' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                      {j}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function inputCls(error: boolean) {
  return `w-full px-2.5 py-1.5 text-xs border rounded-lg outline-none transition-all bg-white ${
    error ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-[#2B3CE8] focus:ring-1 focus:ring-[#2B3CE8]/10'
  }`;
}
