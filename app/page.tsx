'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import OnboardTokenWizard from '@/components/OnboardTokenWizard';
import BitgoAssets from '@/components/BitgoAssets';

export default function Home() {
  const [activePage, setActivePage] = useState('onboard');

  return (
    <div className="flex h-screen bg-[#F7F8FA] font-sans">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <main className="flex-1 overflow-auto">
        {activePage === 'onboard' && <OnboardTokenWizard />}
        {activePage === 'assets' && <BitgoAssets />}
        {activePage === 'top1000' && (
          <div className="p-10 text-gray-500">Top 1000 by market cap — coming soon</div>
        )}
      </main>
    </div>
  );
}
