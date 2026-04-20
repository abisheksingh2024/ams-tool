'use client';

import React, { useState } from 'react';
import { FormData } from '../OnboardTokenWizard';
import { StepFooter, FormField, FormLabel, HelpText, Input, Select } from '../ui';

interface Props {
  form: FormData;
  updateForm: (p: Partial<FormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const VENDORS = ['Cryptocompare', 'CoinGecko', 'CoinMarketCap', 'Kaiko', 'Chainlink'];

export default function StepPricing({ form, updateForm, onNext, onBack }: Props) {
  const [errors, setErrors] = useState<string[]>([]);

  const addVendor = () =>
    updateForm({ vendors: [...form.vendors, { vendor: 'Cryptocompare', pricingId: '', vendorSymbol: '' }] });

  const removeVendor = (i: number) =>
    updateForm({ vendors: form.vendors.filter((_, idx) => idx !== i) });

  const updateVendor = (i: number, field: string, value: string) =>
    updateForm({ vendors: form.vendors.map((v, idx) => idx === i ? { ...v, [field]: value } : v) });

  const handleNext = () => {
    const errs: string[] = [];
    if (form.vendors.length === 0) errs.push('At least one pricing vendor is required.');
    if (errs.length > 0) { setErrors(errs); return; }
    setErrors([]);
    onNext();
  };

  return (
    <div>
      <div className="px-8 py-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#F0FDF4] flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M3 14l4-4 3 3 5-7" stroke="#16A34A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="15" cy="4" r="2" fill="#16A34A"/>
            </svg>
          </div>
          <div>
            <h3 className="text-[15px] font-semibold text-[#0D1B2A]">Pricing vendors</h3>
            <p className="text-xs text-gray-500">At least one vendor required — asset ID and symbol are optional</p>
          </div>
        </div>
      </div>

      <div className="px-8 py-6 space-y-5">
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

        {form.vendors.map((vendor, i) => (
          <div key={i} className="border border-gray-200 rounded-xl p-5 bg-gray-50/50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Vendor {i + 1}</span>
              </div>
              {form.vendors.length > 1 && (
                <button onClick={() => removeVendor(i)} className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  Remove
                </button>
              )}
            </div>

            <FormField>
              <FormLabel required>Pricing vendor</FormLabel>
              <Select value={vendor.vendor} onChange={v => updateVendor(i, 'vendor', v)} options={VENDORS} />
            </FormField>

            <div className="grid grid-cols-2 gap-5 mt-4">
              <FormField>
                <FormLabel>
                  Pricing vendor asset ID
                  <span className="ml-1.5 text-[10px] text-gray-400 font-normal bg-gray-100 px-1.5 py-0.5 rounded">optional</span>
                </FormLabel>
                <Input
                  value={vendor.pricingId}
                  onChange={v => updateVendor(i, 'pricingId', v)}
                  placeholder="e.g. 933526"
                />
                <HelpText>Unique identifier for this asset in the vendor's system. Can be configured later.</HelpText>
              </FormField>
              <FormField>
                <FormLabel>
                  Pricing vendor asset symbol
                  <span className="ml-1.5 text-[10px] text-gray-400 font-normal bg-gray-100 px-1.5 py-0.5 rounded">optional</span>
                </FormLabel>
                <Input
                  value={vendor.vendorSymbol}
                  onChange={v => updateVendor(i, 'vendorSymbol', v)}
                  placeholder="e.g. USDC"
                />
                <HelpText>Symbol used by the vendor to identify this asset. Can be configured later.</HelpText>
              </FormField>
            </div>
          </div>
        ))}

        <button onClick={addVendor} className="flex items-center gap-2 text-sm text-[#2B3CE8] font-medium hover:text-[#1e2bc0] transition-colors">
          <div className="w-5 h-5 rounded-full border-2 border-[#2B3CE8] flex items-center justify-center">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M5 2v6M2 5h6" stroke="#2B3CE8" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </div>
          Add another pricing vendor
        </button>
      </div>

      <StepFooter onNext={handleNext} onBack={onBack} nextLabel="Continue to Distribution →" />
    </div>
  );
}
