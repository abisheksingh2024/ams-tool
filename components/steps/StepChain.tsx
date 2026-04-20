'use client';

import React, { useState } from 'react';
import { FormData } from '../OnboardTokenWizard';
import { StepFooter, FormField, FormLabel, HelpText, Select, Input, InfoBox } from '../ui';

interface Props {
  form: FormData;
  updateForm: (p: Partial<FormData>) => void;
  onNext: () => void;
}

const PROTOCOLS = ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'Base', 'BSC', 'Avalanche'];
const NETWORKS: Record<string, string[]> = {
  Ethereum: ['Ethereum — Ethereum', 'Ethereum — Goerli (testnet)', 'Ethereum — Sepolia (testnet)'],
  Polygon: ['Polygon — Mainnet', 'Polygon — Mumbai (testnet)'],
  Arbitrum: ['Arbitrum — One', 'Arbitrum — Goerli'],
  Optimism: ['Optimism — Mainnet', 'Optimism — Goerli'],
  Base: ['Base — Mainnet', 'Base — Goerli'],
  BSC: ['BSC — Mainnet', 'BSC — Testnet'],
  Avalanche: ['Avalanche — C-Chain', 'Avalanche — Fuji (testnet)'],
};

export default function StepChain({ form, updateForm, onNext }: Props) {
  const [error, setError] = useState('');

  const handleNext = () => {
    if (!form.contractAddress.trim()) {
      setError('Contract address is required.');
      return;
    }
    if (!/^0x[0-9a-f]{40}$/i.test(form.contractAddress.trim())) {
      setError('Must be a valid 42-character 0x address (lowercase hex).');
      return;
    }
    setError('');
    onNext();
  };

  return (
    <div>
      <div className="px-8 py-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#EEF2FF] flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 2L16 6V12L9 16L2 12V6L9 2Z" stroke="#2B3CE8" strokeWidth="1.5" strokeLinejoin="round"/>
              <circle cx="9" cy="9" r="2" fill="#2B3CE8"/>
            </svg>
          </div>
          <div>
            <h3 className="text-[15px] font-semibold text-[#0D1B2A]">Chain configuration</h3>
            <p className="text-xs text-gray-500">Select the protocol, network, and paste the contract address</p>
          </div>
        </div>
      </div>

      <div className="px-8 py-6 space-y-6">
        {/* Protocol + Network row */}
        <div className="grid grid-cols-2 gap-5">
          <FormField>
            <FormLabel required>Protocol</FormLabel>
            <Select
              value={form.protocol}
              onChange={(v) => {
                updateForm({ protocol: v, network: NETWORKS[v]?.[0] || '' });
              }}
              options={PROTOCOLS}
            />
          </FormField>

          <FormField>
            <FormLabel required>Network / environment <span className="text-gray-400 font-normal">(AMS tokenFamily)</span></FormLabel>
            <Select
              value={form.network}
              onChange={(v) => updateForm({ network: v })}
              options={NETWORKS[form.protocol] || []}
            />
          </FormField>
        </div>

        <InfoBox>
          ERC-20 and other fungible tokens on {form.protocol} mainnet or testnet
        </InfoBox>

        {/* Contract address */}
        <FormField>
          <FormLabel required>Contract address <span className="text-gray-400 font-normal">(full mint / contract)</span></FormLabel>
          <Input
            value={form.contractAddress}
            onChange={(v) => { updateForm({ contractAddress: v }); setError(''); }}
            placeholder="0x…"
            monospace
            error={!!error}
          />
          {error ? (
            <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <circle cx="6" cy="6" r="5" stroke="#EF4444" strokeWidth="1.2"/>
                <path d="M6 4v3M6 8.5v.5" stroke="#EF4444" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
              {error}
            </p>
          ) : (
            <HelpText>
              EVM chains require a 42-character 0x address using lowercase hex (a–f, 0–9) only. On blur, we check AMS for an existing asset with this contract on the selected network.
            </HelpText>
          )}
        </FormField>
      </div>

      <StepFooter
        onNext={handleNext}
        nextLabel="Continue to Asset →"
        showBack={false}
      />
    </div>
  );
}
