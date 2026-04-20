'use client';

import React, { useMemo } from 'react';
import { FormData } from '../OnboardTokenWizard';

interface Props {
  form: FormData;
  onBack: () => void;
  onSubmit: () => void;
}

function ReviewSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <div className="px-5 py-3 bg-gray-50 border-b border-gray-200">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{title}</span>
      </div>
      <div className="px-5 py-4 space-y-3">{children}</div>
    </div>
  );
}

function ReviewRow({ label, value, mono, missing, optional }: {
  label: string; value: string; mono?: boolean; missing?: boolean; optional?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-sm text-gray-500 min-w-[220px] flex items-center gap-1.5 flex-shrink-0">
        {label}
        {missing && <span className="text-[10px] text-red-500 font-semibold bg-red-50 px-1.5 py-0.5 rounded">Required</span>}
        {optional && !missing && <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">optional</span>}
      </span>
      {missing
        ? <span className="text-sm text-red-400 italic">Not provided</span>
        : <span className={`text-sm text-[#0D1B2A] font-medium text-right ${mono ? 'font-mono text-xs' : ''}`}>{value || '—'}</span>
      }
    </div>
  );
}

function computeMissingFields(form: FormData): string[] {
  const missing: string[] = [];
  if (!form.protocol) missing.push('Protocol');
  if (!form.contractAddress) missing.push('Contract address');
  if (!form.tokenName) missing.push('Token name');
  if (!form.symbolSuffix) missing.push('Symbol suffix');
  if (!form.decimals) missing.push('Decimals');
  if (form.vendors.length === 0) missing.push('Pricing vendor (at least 1 required)');
  if (form.jurisdictions.length === 0) missing.push('Custody Trust Entity (at least 1 required)');
  if (form.goAccountsApplicable && form.goAccountJurisdictions.length === 0)
    missing.push('Go Account Trust Entity (required when Go Accounts is applicable)');
  return missing;
}

export default function StepReview({ form, onBack, onSubmit }: Props) {
  const fullSymbol = form.symbolSuffix ? `${form.symbolPrefix}${form.symbolSuffix}`.toLowerCase() : '';
  const missingFields = useMemo(() => computeMissingFields(form), [form]);
  const canSubmit = missingFields.length === 0;

  return (
    <div>
      <div className="px-8 py-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#F0FDF4] flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M4 9l3.5 3.5L14 6" stroke="#16A34A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="9" cy="9" r="7" stroke="#16A34A" strokeWidth="1.5"/>
            </svg>
          </div>
          <div>
            <h3 className="text-[15px] font-semibold text-[#0D1B2A]">Review onboarding</h3>
            <p className="text-xs text-gray-500">Confirm all details before submitting to AMS</p>
          </div>
        </div>
      </div>

      <div className="px-8 py-6 space-y-4">
        {/* Blocking error banner */}
        {!canSubmit && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-4">
            <div className="flex items-center gap-2 mb-2">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="#EF4444" strokeWidth="1.3"/><path d="M8 5v3.5M8 10.5v.5" stroke="#EF4444" strokeWidth="1.3" strokeLinecap="round"/></svg>
              <p className="text-sm font-semibold text-red-700">Cannot submit — {missingFields.length} required field{missingFields.length > 1 ? 's' : ''} missing</p>
            </div>
            <ul className="space-y-1 ml-6">
              {missingFields.map((f, i) => (
                <li key={i} className="text-xs text-red-600 flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-red-400 flex-shrink-0" />{f}
                </li>
              ))}
            </ul>
            <p className="text-xs text-red-500 mt-2">Use the Back button to complete missing fields.</p>
          </div>
        )}

        {/* Summary banner */}
        <div className={`border rounded-xl p-4 flex items-center gap-4 ${canSubmit ? 'bg-[#EEF2FF] border-[#C7D0FB]' : 'bg-gray-50 border-gray-200'}`}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${canSubmit ? 'bg-[#2B3CE8]' : 'bg-gray-300'}`}>
            {(form.symbolSuffix || form.tokenName || 'T').charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold text-[#0D1B2A]">{form.tokenName || <span className="text-gray-400 italic">No token name</span>}</p>
            <p className="text-xs text-gray-500 font-mono">{fullSymbol || '—'} · {form.protocol} · {form.tokenType} · {form.environment}</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-xs text-gray-400">Decimals</p>
            <p className="text-sm font-semibold text-[#0D1B2A]">{form.decimals || '—'}</p>
          </div>
        </div>

        <ReviewSection title="Chain">
          <ReviewRow label="Protocol" value={form.protocol} missing={!form.protocol} />
          <ReviewRow label="Token type" value={form.tokenType} />
          <ReviewRow label="Environment" value={form.environment} />
          <ReviewRow label="Contract address" value={form.contractAddress} mono missing={!form.contractAddress} />
        </ReviewSection>

        <ReviewSection title="Asset">
          <ReviewRow label="Token name" value={form.tokenName} missing={!form.tokenName} />
          <ReviewRow label="Display name" value={form.displayName || form.tokenName} />
          <ReviewRow label="BitGo symbol prefix" value={form.symbolPrefix} mono />
          <ReviewRow label="Symbol suffix" value={form.symbolSuffix} mono missing={!form.symbolSuffix} />
          <ReviewRow label="Full symbol (prefix + suffix)" value={fullSymbol} mono missing={!fullSymbol} />
          <ReviewRow label="Decimals" value={form.decimals} missing={!form.decimals} />
        </ReviewSection>

        <ReviewSection title="Pricing vendors">
          {form.vendors.length === 0 ? (
            <p className="text-sm text-red-400 italic flex items-center gap-1.5">
              <span className="text-[10px] text-red-500 font-semibold bg-red-50 px-1.5 py-0.5 rounded">Required</span>
              No pricing vendor configured
            </p>
          ) : (
            form.vendors.map((v, i) => (
              <div key={i} className={i > 0 ? 'pt-3 border-t border-gray-100' : ''}>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Vendor {i + 1}</p>
                <ReviewRow label="Pricing vendor" value={v.vendor} />
                <ReviewRow label="Pricing vendor asset ID" value={v.pricingId || '—'} optional={!v.pricingId} />
                <ReviewRow label="Pricing vendor asset symbol" value={v.vendorSymbol || '—'} optional={!v.vendorSymbol} />
              </div>
            ))
          )}
        </ReviewSection>

        <ReviewSection title="Distribution & Custody">
          <ReviewRow label="Custody Trust Entity" value={form.jurisdictions.join(', ')} missing={form.jurisdictions.length === 0} />
          <ReviewRow label="Go Accounts applicable" value={form.goAccountsApplicable ? 'Yes' : 'No'} />
          {form.goAccountsApplicable && (
            <ReviewRow label="Go Account Trust Entity" value={form.goAccountJurisdictions.join(', ')} missing={form.goAccountJurisdictions.length === 0} />
          )}
        </ReviewSection>
      </div>

      <div className="px-8 py-5 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 font-medium">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Back
        </button>
        <div className="flex items-center gap-3">
          {!canSubmit && <p className="text-xs text-red-500 font-medium">{missingFields.length} field{missingFields.length > 1 ? 's' : ''} missing</p>}
          <button onClick={onSubmit} disabled={!canSubmit}
            className="px-6 py-2 bg-[#2B3CE8] text-white text-sm font-semibold rounded-lg hover:bg-[#2232CC] transition-colors shadow-sm flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed">
            Submit to AMS
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M8 3l4 4-4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
