'use client';

import React from 'react';

// ─── Form Field wrapper ──────────────────────────────────────────────────────
export function FormField({ children }: { children: React.ReactNode }) {
  return <div className="space-y-1.5">{children}</div>;
}

// ─── Label ──────────────────────────────────────────────────────────────────
export function FormLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-[13px] font-medium text-gray-700">
      {children}
      {required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
  );
}

// ─── Help text ───────────────────────────────────────────────────────────────
export function HelpText({ children }: { children: React.ReactNode }) {
  return <p className="text-[11.5px] text-gray-400 leading-relaxed">{children}</p>;
}

// ─── Info box ────────────────────────────────────────────────────────────────
export function InfoBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2.5 bg-blue-50 border border-blue-100 rounded-lg px-4 py-3">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="mt-0.5 flex-shrink-0">
        <circle cx="7" cy="7" r="6" stroke="#3B82F6" strokeWidth="1.2"/>
        <path d="M7 6v4M7 4.5v.5" stroke="#3B82F6" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
      <p className="text-[12px] text-blue-700">{children}</p>
    </div>
  );
}

// ─── Input ───────────────────────────────────────────────────────────────────
interface InputProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  monospace?: boolean;
  error?: boolean;
  type?: string;
  className?: string;
}

export function Input({ value, onChange, placeholder, monospace, error, type = 'text', className = '' }: InputProps) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full px-3 py-2.5 text-sm border rounded-lg outline-none transition-all bg-white
        ${monospace ? 'font-mono' : ''}
        ${error
          ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100'
          : 'border-gray-200 focus:border-[#2B3CE8] focus:ring-2 focus:ring-[#2B3CE8]/10'
        }
        placeholder:text-gray-300
        ${className}
      `}
    />
  );
}

// ─── Select ──────────────────────────────────────────────────────────────────
interface SelectProps {
  value: string;
  onChange: (v: string) => void;
  options: string[];
}

export function Select({ value, onChange, options }: SelectProps) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none bg-white
          focus:border-[#2B3CE8] focus:ring-2 focus:ring-[#2B3CE8]/10 transition-all cursor-pointer pr-9"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M3 4.5L6 7.5L9 4.5" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  );
}

// ─── Step footer ─────────────────────────────────────────────────────────────
interface StepFooterProps {
  onNext: () => void;
  onBack?: () => void;
  nextLabel?: string;
  showBack?: boolean;
}

export function StepFooter({ onNext, onBack, nextLabel = 'Continue', showBack = true }: StepFooterProps) {
  return (
    <div className="px-8 py-5 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
      {showBack && onBack ? (
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back
        </button>
      ) : (
        <div />
      )}
      <button
        onClick={onNext}
        className="px-5 py-2 bg-[#2B3CE8] text-white text-sm font-semibold rounded-lg hover:bg-[#2232CC] transition-colors shadow-sm flex items-center gap-2"
      >
        {nextLabel}
      </button>
    </div>
  );
}
