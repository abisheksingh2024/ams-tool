'use client';

import React, { useState } from 'react';
import StepChain from './steps/StepChain';
import StepAsset from './steps/StepAsset';
import StepPricing from './steps/StepPricing';
import StepDistribution from './steps/StepDistribution';
import StepReview from './steps/StepReview';
import BulkOnboard from './BulkOnboard';

export const JURISDICTIONS = [
  'BitGo Trust', 'BitGo New York', 'BitGo Germany', 'Frankfurt DE Trust',
  'BitGo Singapore', 'BitGo Korea', 'BitGo Custody MENA FZE', 'BitGo India',
];

export const DEFAULT_CUSTODY = ['BitGo Trust', 'Frankfurt DE Trust', 'BitGo India'];

export type VendorEntry = {
  vendor: string;
  pricingId: string;     // optional — can be empty/null
  vendorSymbol: string;  // optional — can be empty/null
};

export type FormData = {
  // Chain
  protocol: string;
  tokenType: string;
  environment: string;
  contractAddress: string;
  // Asset
  tokenName: string;
  displayName: string;
  symbolPrefix: string;
  symbolSuffix: string;
  decimals: string;
  // Pricing — at least 1 vendor required; pricingId + vendorSymbol are optional
  vendors: VendorEntry[];
  // Distribution
  jurisdictions: string[];           // Custody Trust Entity — at least 1 required
  goAccountsApplicable: boolean;     // explicit Yes/No toggle
  goAccountJurisdictions: string[];  // required if goAccountsApplicable = true
};

const STEPS = [
  { id: 1, label: 'Chain', description: 'Protocol & contract' },
  { id: 2, label: 'Asset', description: 'Token metadata' },
  { id: 3, label: 'Pricing', description: 'Vendor configuration' },
  { id: 4, label: 'Distribution', description: 'Custody & Go Account' },
  { id: 5, label: 'Review', description: 'Confirm & submit' },
];

const defaultForm: FormData = {
  protocol: 'Ethereum', tokenType: 'ERC-20', environment: 'Production / Mainnet',
  contractAddress: '', tokenName: '', displayName: '',
  symbolPrefix: 'eth:', symbolSuffix: '', decimals: '18',
  vendors: [{ vendor: 'Cryptocompare', pricingId: '', vendorSymbol: '' }],
  jurisdictions: [...DEFAULT_CUSTODY],
  goAccountsApplicable: false,
  goAccountJurisdictions: [],
};

type Mode = 'single' | 'bulk';

export default function OnboardTokenWizard() {
  const [mode, setMode] = useState<Mode>('single');
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(defaultForm);
  const [submitted, setSubmitted] = useState(false);

  const updateForm = (partial: Partial<FormData>) => setForm(prev => ({ ...prev, ...partial }));
  const goNext = () => setStep(s => Math.min(s + 1, 5));
  const goBack = () => setStep(s => Math.max(s - 1, 1));
  const handleModeSwitch = (m: Mode) => { setMode(m); setStep(1); setForm(defaultForm); setSubmitted(false); };

  const PageHeader = () => (
    <div className="bg-white border-b border-gray-200 px-8 py-5">
      <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
        <span>Admin Tools</span><span>/</span>
        <span className="text-gray-600">Asset Management</span>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-semibold text-[#0D1B2A] tracking-tight">Asset Management</h1>
          <p className="text-sm text-gray-500 mt-0.5">Onboard a new token into Asset Metadata Service</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <button onClick={() => handleModeSwitch('single')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${mode === 'single' ? 'bg-white shadow-sm text-[#0D1B2A]' : 'text-gray-500 hover:text-gray-700'}`}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.3"/><path d="M6 4v2.5L7.5 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
              Single token
            </button>
            <button onClick={() => handleModeSwitch('bulk')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${mode === 'bulk' ? 'bg-white shadow-sm text-[#0D1B2A]' : 'text-gray-500 hover:text-gray-700'}`}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 3h10M1 6h10M1 9h6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
              Bulk onboard
            </button>
          </div>
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-1.5 text-sm text-gray-600">
            <div className="w-2 h-2 rounded-full bg-[#FF6B00]" />BitGo Trust
          </div>
          <button className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1.5">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 2H3a1 1 0 00-1 1v10a1 1 0 001 1h10a1 1 0 001-1V9M14 2l-6 6M10 2h4v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Logout
          </button>
        </div>
      </div>
    </div>
  );

  if (mode === 'bulk') return <div className="min-h-full"><PageHeader /><BulkOnboard /></div>;

  if (submitted) {
    return (
      <div className="min-h-full">
        <PageHeader />
        <div className="flex flex-col items-center justify-center py-24 gap-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><path d="M6 16l7 7L26 9" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div className="text-center">
            <h2 className="text-xl font-semibold text-[#0D1B2A]">Token submitted successfully</h2>
            <p className="text-gray-500 mt-1 text-sm"><span className="font-medium text-gray-700">{form.tokenName || 'Token'}</span> has been queued for onboarding to AMS.</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => { setForm(defaultForm); setStep(1); setSubmitted(false); }}
              className="px-5 py-2 bg-[#2B3CE8] text-white rounded-lg text-sm font-medium hover:bg-[#2232CC] transition-colors">
              Onboard another token
            </button>
            <button onClick={() => handleModeSwitch('bulk')}
              className="px-5 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
              Switch to bulk onboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full">
      <PageHeader />
      <div className="px-8 py-6 max-w-[900px]">
        <div className="mb-6"><h2 className="text-lg font-semibold text-[#0D1B2A]">Onboard token</h2></div>
        <div className="flex items-start gap-0 mb-8">
          {STEPS.map((s, i) => (
            <React.Fragment key={s.id}>
              <button onClick={() => s.id < step && setStep(s.id)} className="flex flex-col items-center gap-1.5 min-w-[80px]">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${s.id < step ? 'bg-[#2B3CE8] text-white cursor-pointer' : s.id === step ? 'bg-[#2B3CE8] text-white ring-4 ring-[#2B3CE8]/20' : 'bg-gray-200 text-gray-400'}`}>
                  {s.id < step ? <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2.5 7l3 3 6-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg> : s.id}
                </div>
                <div className="text-center">
                  <div className={`text-xs font-medium ${s.id === step ? 'text-[#2B3CE8]' : s.id < step ? 'text-gray-700' : 'text-gray-400'}`}>{s.label}</div>
                  <div className="text-[10px] text-gray-400">{s.description}</div>
                </div>
              </button>
              {i < STEPS.length - 1 && <div className={`flex-1 h-[2px] mt-4 transition-all ${s.id < step ? 'bg-[#2B3CE8]' : 'bg-gray-200'}`} />}
            </React.Fragment>
          ))}
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {step === 1 && <StepChain form={form} updateForm={updateForm} onNext={goNext} />}
          {step === 2 && <StepAsset form={form} updateForm={updateForm} onNext={goNext} onBack={goBack} />}
          {step === 3 && <StepPricing form={form} updateForm={updateForm} onNext={goNext} onBack={goBack} />}
          {step === 4 && <StepDistribution form={form} updateForm={updateForm} onNext={goNext} onBack={goBack} />}
          {step === 5 && <StepReview form={form} onBack={goBack} onSubmit={() => setSubmitted(true)} />}
        </div>
      </div>
    </div>
  );
}
