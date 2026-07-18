'use client';

import { useState } from 'react';
import { LoginForm } from './LoginForm';
import { DeviceLoginComponent } from './DeviceLoginComponent';
import { KeyRound, Tv } from 'lucide-react';

export function LoginTabs() {
  const [activeTab, setActiveTab] = useState<'password' | 'device'>('password');

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Tabs */}
      <div className="flex p-1 space-x-1 bg-slate-900/50 backdrop-blur-md rounded-2xl border border-slate-700/50 shadow-2xl">
        <button
          onClick={() => setActiveTab('password')}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 text-sm font-medium rounded-xl transition-all ${
            activeTab === 'password'
              ? 'bg-slate-800 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <KeyRound className="w-4 h-4" />
          <span>По паролю</span>
        </button>
        <button
          onClick={() => setActiveTab('device')}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 text-sm font-medium rounded-xl transition-all ${
            activeTab === 'device'
              ? 'bg-slate-800 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Tv className="w-4 h-4" />
          <span>С телефона (для ТВ)</span>
        </button>
      </div>

      {/* Content */}
      <div className="transition-all duration-300 animate-in fade-in zoom-in">
        {activeTab === 'password' ? <LoginForm /> : <DeviceLoginComponent />}
      </div>
    </div>
  );
}
