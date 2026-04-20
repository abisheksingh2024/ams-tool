'use client';

import React from 'react';
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

function ReviewRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-sm text-gray-500 min-w-[180px]">{label}</span>
      <span className={`text-sm text-[#0D1B2A] font-medium text-right ${mono ? 'font-mono' : ''}`}>
        {value || <span className="text-gray-300 font-normal">—</span>}
      </span>
    </div>
  );
}

export default function StepReview({ form, onBack, onSubmit }: Props) {
  const fullSymbol = `${form.symbolPrefix}${form.symbolSuffix}`.toLowerCase() || 'token';

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
        {/* Summary banner */}
        <div className="bg-[#EEF2FF] border border-[#C7D0FB] rounded-xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 bg-[#2B3CE8] rounded-full flex items-center justify-center text-white font-bold text-sm">
            {(form.symbolSuffix || form.tokenName || 'T').charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold text-[#0D1B2A]">{form.tokenName || 'Unnamed Token'}</p>
            <p className="text-xs text-gray-500 font-mono">{fullSymbol} · {form.protocol} · {form.network}</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-xs text-gray-400">Decimals</p>
            <p className="text-sm font-semibold text-[#0D1B2A]">{form.decimals}</p>
          </div>
        </div>

        <ReviewSection title="Chain">
          <ReviewRow label="Protocol" value={form.protocol} />
          <ReviewRow label="Network / tokenFamily" value={form.network} />
          <ReviewRow label="Contract address" value={form.contractAddress} mono />
        </ReviewSection>

        <ReviewSection title="Asset">
          <ReviewRow label="Token name" value={form.tokenName} />
          <ReviewRow label="Display name" value={form.displayName} />
          <ReviewRow label="BitGo symbol prefix" value={form.symbolPrefix} mono />
          <ReviewRow label="BitGo symbol suffix" value={form.symbolSuffix} mono />
          <ReviewRow label="Full symbol" value={fullSymbol} mono />
          <ReviewRow label="Decimals" value={form.decimals} />
        </ReviewSection>

        <ReviewSection title="Pricing vendors">
          {form.vendors.map((v, i) => (
            <div key={i} className={i > 0 ? 'pt-3 border-t border-gray-100' : ''}>
              <ReviewRow label={`Vendor ${i + 1}`} value={v.vendor} />
              {v.vendorSymbol && <ReviewRow label="Vendor symbol" value={v.vendorSymbol} />}
              {v.pricingId && <ReviewRow label="Pricing ID" value={v.pricingId} />}
            </div>
          ))}
        </ReviewSection>

        <ReviewSection title="Distribution & Custody">
          <ReviewRow label="OFC enabled (Go Account)" value={form.ofcEnabled ? 'Yes' : 'No'} />
          <ReviewRow label="Custody jurisdictions" value={form.jurisdictions.length > 0 ? form.jurisdictions.join(', ') : 'None selected'} />
          {form.additionalFeatures && <ReviewRow label="Additional features" value={form.additionalFeatures} />}
          {form.excludedFeatures && <ReviewRow label="Excluded features" value={form.excludedFeatures} />}
        </ReviewSection>
      </div>

      {/* Footer */}
      <div className="px-8 py-5 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Reset form
          </button>
          <button
            onClick={onSubmit}
            className="px-6 py-2 bg-[#2B3CE8] text-white text-sm font-semibold rounded-lg hover:bg-[#2232CC] transition-colors shadow-sm flex items-center gap-2"
          >
            Submit to AMS
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7h10M8 3l4 4-4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
