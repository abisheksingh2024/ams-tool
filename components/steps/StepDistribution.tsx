'use client';

import React from 'react';
import { FormData } from '../OnboardTokenWizard';
import { StepFooter, FormField, FormLabel, HelpText, Input } from '../ui';

interface Props {
  form: FormData;
  updateForm: (p: Partial<FormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const JURISDICTIONS = [
  'BitGo Trust',
  'BitGo New York',
  'BitGo Germany',
  'Frankfurt DE Trust',
  'BitGo Singapore',
  'BitGo Korea',
  'BitGo Custody MENA FZE',
  'BitGo India',
];

export default function StepDistribution({ form, updateForm, onNext, onBack }: Props) {
  const toggleJurisdiction = (j: string) => {
    const current = form.jurisdictions;
    updateForm({
      jurisdictions: current.includes(j)
        ? current.filter((x) => x !== j)
        : [...current, j],
    });
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
            <p className="text-xs text-gray-500">Configure Go Account access, custody jurisdictions, and feature flags</p>
          </div>
        </div>
      </div>

      <div className="px-8 py-6 space-y-7">
        {/* OFC */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <FormLabel>Go Account — OFC enabled</FormLabel>
              <p className="text-xs text-gray-400 mt-0.5">Required for Go Account availability</p>
            </div>
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              {['Yes', 'No'].map((opt) => (
                <button
                  key={opt}
                  onClick={() => updateForm({ ofcEnabled: opt === 'Yes' })}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                    (opt === 'Yes') === form.ofcEnabled
                      ? 'bg-white shadow-sm text-[#0D1B2A]'
                      : 'text-gray-500'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="h-px bg-gray-100" />

        {/* Custody jurisdictions */}
        <div>
          <FormLabel>Custody jurisdictions</FormLabel>
          <p className="text-xs text-gray-500 mt-0.5 mb-3">
            Select BitGo custody entities where this asset should appear. Each option is a CoinFeature value stored in AMS.
          </p>
          <div className="grid grid-cols-2 gap-2">
            {JURISDICTIONS.map((j) => (
              <button
                key={j}
                onClick={() => toggleJurisdiction(j)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg border text-sm text-left transition-all ${
                  form.jurisdictions.includes(j)
                    ? 'border-[#2B3CE8] bg-[#EEF2FF] text-[#2B3CE8] font-medium'
                    : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border transition-all ${
                  form.jurisdictions.includes(j) ? 'bg-[#2B3CE8] border-[#2B3CE8]' : 'border-gray-300'
                }`}>
                  {form.jurisdictions.includes(j) && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                {j}
              </button>
            ))}
          </div>
          {form.jurisdictions.length > 0 && (
            <p className="text-xs text-[#2B3CE8] mt-2">
              {form.jurisdictions.length} jurisdiction{form.jurisdictions.length > 1 ? 's' : ''} selected
            </p>
          )}
        </div>

        <div className="h-px bg-gray-100" />

        {/* Additional / excluded features */}
        <div className="grid grid-cols-2 gap-5">
          <FormField>
            <FormLabel>Additional features <span className="text-gray-400 font-normal">(comma-separated)</span></FormLabel>
            <Input
              value={form.additionalFeatures}
              onChange={(v) => updateForm({ additionalFeatures: v })}
              placeholder="e.g. staking, p2sh"
            />
            <HelpText>Optional CoinFeature strings from BitGo statics. Invalid values are dropped server-side.</HelpText>
          </FormField>
          <FormField>
            <FormLabel>Excluded features <span className="text-gray-400 font-normal">(comma-separated)</span></FormLabel>
            <Input
              value={form.excludedFeatures}
              onChange={(v) => updateForm({ excludedFeatures: v })}
              placeholder="CoinFeature values to exclude"
            />
            <HelpText>CoinFeature values that should not apply to this asset, even if implied elsewhere.</HelpText>
          </FormField>
        </div>
      </div>

      <StepFooter onNext={onNext} onBack={onBack} nextLabel="Review onboarding →" />
    </div>
  );
}
