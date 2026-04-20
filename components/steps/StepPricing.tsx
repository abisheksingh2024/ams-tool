'use client';

import React from 'react';
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
  const addVendor = () =>
    updateForm({ vendors: [...form.vendors, { vendor: 'Cryptocompare', vendorSymbol: '', pricingId: '' }] });

  const removeVendor = (i: number) =>
    updateForm({ vendors: form.vendors.filter((_, idx) => idx !== i) });

  const updateVendor = (i: number, field: string, value: string) => {
    const updated = form.vendors.map((v, idx) =>
      idx === i ? { ...v, [field]: value } : v
    );
    updateForm({ vendors: updated });
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
            <p className="text-xs text-gray-500">Configure price feed providers for this token</p>
          </div>
        </div>
      </div>

      <div className="px-8 py-6 space-y-5">
        {form.vendors.map((vendor, i) => (
          <div key={i} className="border border-gray-200 rounded-xl p-5 bg-gray-50/50 relative">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Vendor {i + 1}
              </span>
              {form.vendors.length > 1 && (
                <button
                  onClick={() => removeVendor(i)}
                  className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  Remove
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-5 mb-4">
              <FormField>
                <FormLabel>Vendor</FormLabel>
                <Select
                  value={vendor.vendor}
                  onChange={(v) => updateVendor(i, 'vendor', v)}
                  options={VENDORS}
                />
              </FormField>
              <FormField>
                <FormLabel>Vendor Symbol</FormLabel>
                <Input
                  value={vendor.vendorSymbol}
                  onChange={(v) => updateVendor(i, 'vendorSymbol', v)}
                  placeholder="e.g. POL001"
                />
              </FormField>
            </div>

            <FormField>
              <FormLabel required={vendor.vendor === 'Cryptocompare'}>
                Pricing ID
                {vendor.vendor === 'Cryptocompare' && (
                  <span className="ml-1.5 text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-medium">Required for CryptoCompare</span>
                )}
              </FormLabel>
              <Input
                value={vendor.pricingId}
                onChange={(v) => updateVendor(i, 'pricingId', v)}
                placeholder="e.g. 933526"
                className="w-48"
              />
              {vendor.vendor === 'Cryptocompare' && (
                <HelpText>Required for CryptoCompare pricing.</HelpText>
              )}
            </FormField>
          </div>
        ))}

        <button
          onClick={addVendor}
          className="flex items-center gap-2 text-sm text-[#2B3CE8] font-medium hover:text-[#1e2bc0] transition-colors"
        >
          <div className="w-5 h-5 rounded-full border-2 border-[#2B3CE8] flex items-center justify-center">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M5 2v6M2 5h6" stroke="#2B3CE8" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          Add more pricing vendor
        </button>
      </div>

      <StepFooter onNext={onNext} onBack={onBack} nextLabel="Continue to Distribution →" />
    </div>
  );
}
