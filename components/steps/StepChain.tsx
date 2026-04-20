'use client';

import React, { useState } from 'react';
import { FormData } from '../OnboardTokenWizard';
import { StepFooter, FormField, FormLabel, HelpText, Select, Input } from '../ui';

interface Props {
  form: FormData;
  updateForm: (p: Partial<FormData>) => void;
  onNext: () => void;
}

const PROTOCOLS = ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'Base', 'BSC', 'Avalanche'];

const TOKEN_TYPES: Record<string, string[]> = {
  Ethereum:  ['ERC-20', 'ERC-721', 'ERC-1155', 'ERC-777', 'ERC-4626'],
  Polygon:   ['ERC-20', 'ERC-721', 'ERC-1155'],
  Arbitrum:  ['ERC-20', 'ERC-721', 'ERC-1155'],
  Optimism:  ['ERC-20', 'ERC-721', 'ERC-1155'],
  Base:      ['ERC-20', 'ERC-721', 'ERC-1155'],
  BSC:       ['BEP-20', 'BEP-721', 'BEP-1155'],
  Avalanche: ['ARC-20', 'ERC-20', 'ERC-721'],
};

const ENVIRONMENTS = ['Production / Mainnet', 'Testnet'];

// Auto-derive symbol prefix from protocol
const PROTOCOL_PREFIX: Record<string, string> = {
  Ethereum:  'eth:',
  Polygon:   'polygon:',
  Arbitrum:  'arbeth:',
  Optimism:  'opeth:',
  Base:      'base:',
  BSC:       'bsc:',
  Avalanche: 'avaxc:',
};

export default function StepChain({ form, updateForm, onNext }: Props) {
  const [error, setError] = useState('');

  const handleProtocolChange = (protocol: string) => {
    updateForm({
      protocol,
      tokenType: TOKEN_TYPES[protocol]?.[0] || 'ERC-20',
      symbolPrefix: PROTOCOL_PREFIX[protocol] || 'eth:',
    });
  };

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
            <p className="text-xs text-gray-500">Select the protocol, token type, environment, and contract address</p>
          </div>
        </div>
      </div>

      <div className="px-8 py-6 space-y-6">

        {/* Row 1: Protocol + Token Type */}
        <div className="grid grid-cols-2 gap-5">
          <FormField>
            <FormLabel required>Protocol</FormLabel>
            <Select
              value={form.protocol}
              onChange={handleProtocolChange}
              options={PROTOCOLS}
            />
          </FormField>

          <FormField>
            <FormLabel required>Token type</FormLabel>
            <Select
              value={form.tokenType}
              onChange={(v) => updateForm({ tokenType: v })}
              options={TOKEN_TYPES[form.protocol] || ['ERC-20']}
            />
            <HelpText>Token standard for this contract on {form.protocol}.</HelpText>
          </FormField>
        </div>

        {/* Row 2: Environment */}
        <FormField>
          <FormLabel required>Environment</FormLabel>
          <div className="flex items-center gap-2">
            {ENVIRONMENTS.map((env) => (
              <button
                key={env}
                onClick={() => updateForm({ environment: env })}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                  form.environment === env
                    ? env === 'Production / Mainnet'
                      ? 'border-[#2B3CE8] bg-[#EEF2FF] text-[#2B3CE8]'
                      : 'border-amber-400 bg-amber-50 text-amber-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${
                  form.environment === env
                    ? env === 'Production / Mainnet' ? 'bg-[#2B3CE8]' : 'bg-amber-500'
                    : 'bg-gray-300'
                }`} />
                {env}
              </button>
            ))}
          </div>
          <HelpText>
            {form.environment === 'Production / Mainnet'
              ? 'Deploying to production mainnet. This token will be live for all users.'
              : 'Deploying to testnet. Use for staging and QA purposes only.'}
          </HelpText>
        </FormField>

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
              EVM chains require a 42-character 0x address using lowercase hex (a–f, 0–9) only.
            </HelpText>
          )}
        </FormField>

      </div>

      <StepFooter onNext={handleNext} nextLabel="Continue to Asset →" showBack={false} />
    </div>
  );
}
