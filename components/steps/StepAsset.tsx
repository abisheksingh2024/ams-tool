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

export default function StepAsset({ form, updateForm, onNext, onBack }: Props) {
  // prefix is like "eth:" — strip trailing colon for display, suffix is e.g. "usdc"
  // full symbol = "eth:usdc"
  const prefix = form.symbolPrefix.endsWith(':') ? form.symbolPrefix : `${form.symbolPrefix}:`;
  const suffix = form.symbolSuffix.toLowerCase().replace(/\s+/g, '');
  const fullSymbol = suffix ? `${prefix}${suffix}` : prefix.replace(/:$/, '') || 'token';

  return (
    <div>
      <div className="px-8 py-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#FFF7ED] flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle cx="9" cy="9" r="6" stroke="#FF6B00" strokeWidth="1.5"/>
              <path d="M6.5 11.5C7 12.5 11.5 12.5 11.5 9C11.5 7 10 6.5 9 6.5C8 6.5 6.5 7 6.5 9C6.5 10 7 10.5 9 11C11 11.5 11.5 12 11.5 13" stroke="#FF6B00" strokeWidth="1.2" strokeLinecap="round"/>
              <path d="M9 5V6M9 12.5V14" stroke="#FF6B00" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <h3 className="text-[15px] font-semibold text-[#0D1B2A]">Asset metadata</h3>
            <p className="text-xs text-gray-500">Define the token name, symbol, and decimal precision</p>
          </div>
        </div>
      </div>

      <div className="px-8 py-6 space-y-6">

        {/* Token name + Display name */}
        <div className="grid grid-cols-2 gap-5">
          <FormField>
            <FormLabel required>Token name</FormLabel>
            <Input
              value={form.tokenName}
              onChange={(v) => updateForm({ tokenName: v, displayName: v })}
              placeholder="e.g. USD Coin"
            />
          </FormField>
          <FormField>
            <FormLabel>Display name <span className="text-gray-400 font-normal">(same as token name)</span></FormLabel>
            <Input
              value={form.displayName}
              onChange={(v) => updateForm({ displayName: v })}
              placeholder="Auto-filled from token name"
            />
          </FormField>
        </div>

        {/* Symbol prefix (read-only) + suffix (editable) */}
        <div className="grid grid-cols-2 gap-5">
          <FormField>
            <FormLabel>BitGo symbol prefix</FormLabel>
            <div className="flex items-center px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg font-mono text-sm text-gray-500 gap-2">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="flex-shrink-0">
                <rect x="1" y="4" width="10" height="7" rx="1" stroke="#9CA3AF" strokeWidth="1.2"/>
                <path d="M4 4V3a2 2 0 014 0v1" stroke="#9CA3AF" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
              {form.symbolPrefix}
              <span className="ml-auto text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">auto</span>
            </div>
            <HelpText>Set automatically based on the selected protocol.</HelpText>
          </FormField>

          <FormField>
            <FormLabel required>BitGo symbol suffix</FormLabel>
            <Input
              value={form.symbolSuffix}
              onChange={(v) => updateForm({ symbolSuffix: v })}
              placeholder="e.g. usdc"
              monospace
            />
          </FormField>
        </div>

        {/* Full symbol preview */}
        <FormField>
          <FormLabel>Full BitGo symbol <span className="text-gray-400 font-normal">(prefix:suffix)</span></FormLabel>
          <div className="flex items-center gap-2">
            <div className="flex items-center flex-1 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg font-mono text-sm gap-0">
              <span className="text-gray-400">{prefix}</span>
              <span className="text-[#0D1B2A] font-semibold">{suffix || <span className="text-gray-300 font-normal">suffix</span>}</span>
            </div>
            <div className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">auto-generated</div>
          </div>
          <HelpText>Final AMS identifier — e.g. <span className="font-mono">eth:usdc</span></HelpText>
        </FormField>

        {/* Decimals */}
        <FormField>
          <FormLabel required>Decimals</FormLabel>
          <div className="flex items-center gap-3">
            <Input
              value={form.decimals}
              onChange={(v) => updateForm({ decimals: v })}
              placeholder="18"
              type="number"
              className="w-32"
            />
            <div className="flex gap-2">
              {['6', '8', '18'].map((d) => (
                <button
                  key={d}
                  onClick={() => updateForm({ decimals: d })}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                    form.decimals === d
                      ? 'bg-[#2B3CE8] text-white border-[#2B3CE8]'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
          <HelpText>Most ERC-20 tokens use 18. Stablecoins like USDC/USDT use 6.</HelpText>
        </FormField>

      </div>

      <StepFooter onNext={onNext} onBack={onBack} nextLabel="Continue to Pricing →" />
    </div>
  );
}
