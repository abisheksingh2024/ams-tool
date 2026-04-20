'use client';

import React, { useState } from 'react';
import { FormData, JURISDICTIONS } from '../OnboardTokenWizard';
import { StepFooter, FormLabel } from '../ui';

interface Props {
  form: FormData;
  updateForm: (p: Partial<FormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

function JurisdictionGrid({ selected, onToggle, onSelectAll, onClearAll, error }: {
  selected: string[]; onToggle: (j: string) => void;
  onSelectAll: () => void; onClearAll: () => void; error?: boolean;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className={`text-xs ${error ? 'text-red-500 font-medium' : 'text-gray-500'}`}>
          {selected.length === 0 && error ? 'At least 1 entity required' : `${selected.length} of ${JURISDICTIONS.length} selected`}
        </span>
        <div className="flex items-center gap-3">
          <button onClick={onSelectAll} className="text-xs text-[#2B3CE8] font-medium hover:underline">Select all</button>
          <span className="text-gray-300">|</span>
          <button onClick={onClearAll} className="text-xs text-gray-400 hover:text-gray-600 hover:underline">Clear all</button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {JURISDICTIONS.map(j => (
          <button key={j} onClick={() => onToggle(j)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg border text-sm text-left transition-all ${
              selected.includes(j)
                ? 'border-[#2B3CE8] bg-[#EEF2FF] text-[#2B3CE8] font-medium'
                : error && selected.length === 0
                ? 'border-red-200 text-gray-700 hover:border-red-300'
                : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
            }`}>
            <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border transition-all ${selected.includes(j) ? 'bg-[#2B3CE8] border-[#2B3CE8]' : 'border-gray-300'}`}>
              {selected.includes(j) && (
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              )}
            </div>
            {j}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function StepDistribution({ form, updateForm, onNext, onBack }: Props) {
  const [errors, setErrors] = useState<string[]>([]);

  const toggleCustody = (j: string) => {
    updateForm({ jurisdictions: form.jurisdictions.includes(j) ? form.jurisdictions.filter(x => x !== j) : [...form.jurisdictions, j] });
    setErrors([]);
  };
  const toggleGoAccount = (j: string) => {
    updateForm({ goAccountJurisdictions: form.goAccountJurisdictions.includes(j) ? form.goAccountJurisdictions.filter(x => x !== j) : [...form.goAccountJurisdictions, j] });
    setErrors([]);
  };

  const handleNext = () => {
    const errs: string[] = [];
    if (form.jurisdictions.length === 0) errs.push('At least one Custody Trust Entity is required.');
    if (form.goAccountsApplicable && form.goAccountJurisdictions.length === 0)
      errs.push('At least one Go Account Trust Entity is required when Go Accounts is applicable.');
    if (errs.length > 0) { setErrors(errs); return; }
    setErrors([]);
    onNext();
  };

  return (
    <div>
      <div className="px-8 py-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#FDF4FF] flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle cx="9" cy="9" r="6" stroke="#9333EA" strokeWidth="1.5"/>
              <path d="M9 3C6 6 6 12 9 15M9 3C12 6 12 12 9 15M3 9h12" stroke="#9333EA" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <h3 className="text-[15px] font-semibold text-[#0D1B2A]">Distribution & custody</h3>
            <p className="text-xs text-gray-500">Configure custody trust entities and Go Account availability</p>
          </div>
        </div>
      </div>

      <div className="px-8 py-6 space-y-8">
        {errors.length > 0 && (
          <div className="bg-red-50 border border-red-100 rounded-lg px-4 py-3 space-y-1">
            {errors.map((e, i) => (
              <p key={i} className="text-xs text-red-600 flex items-center gap-1.5">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="5" stroke="#EF4444" strokeWidth="1.2"/><path d="M6 4v2.5M6 8v.5" stroke="#EF4444" strokeWidth="1.2" strokeLinecap="round"/></svg>
                {e}
              </p>
            ))}
          </div>
        )}

        {/* 1. Custody Trust Entity */}
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <FormLabel required>Custody Trust Entity</FormLabel>
          </div>
          <p className="text-xs text-gray-500 mb-4">Select BitGo custody entities where this asset should appear.</p>
          <JurisdictionGrid
            selected={form.jurisdictions}
            onToggle={toggleCustody}
            onSelectAll={() => { updateForm({ jurisdictions: [...JURISDICTIONS] }); setErrors([]); }}
            onClearAll={() => updateForm({ jurisdictions: [] })}
            error={errors.some(e => e.includes('Custody'))}
          />
        </div>

        <div className="h-px bg-gray-100" />

        {/* 2. Go Accounts Applicable */}
        <div>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <FormLabel required>Go Accounts applicable</FormLabel>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">Is this asset available via Go Accounts?</p>
            </div>
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              {['Yes', 'No'].map(opt => (
                <button key={opt}
                  onClick={() => { updateForm({ goAccountsApplicable: opt === 'Yes', goAccountJurisdictions: opt === 'No' ? [] : form.goAccountJurisdictions }); setErrors([]); }}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${(opt === 'Yes') === form.goAccountsApplicable ? 'bg-white shadow-sm text-[#0D1B2A]' : 'text-gray-500'}`}>
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Go Account Trust Entity — only if applicable */}
        {form.goAccountsApplicable && (
          <>
            <div className="h-px bg-gray-100" />
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <FormLabel required>Go Account Trust Entity</FormLabel>
              </div>
              <p className="text-xs text-gray-500 mb-4">Select which entities this asset is available in for Go Account.</p>
              <JurisdictionGrid
                selected={form.goAccountJurisdictions}
                onToggle={toggleGoAccount}
                onSelectAll={() => { updateForm({ goAccountJurisdictions: [...JURISDICTIONS] }); setErrors([]); }}
                onClearAll={() => updateForm({ goAccountJurisdictions: [] })}
                error={errors.some(e => e.includes('Go Account Trust'))}
              />
            </div>
          </>
        )}
      </div>

      <StepFooter onNext={handleNext} onBack={onBack} nextLabel="Review onboarding →" />
    </div>
  );
}
