'use client';

import React, { useState, useEffect } from 'react';
import zxcvbn from 'zxcvbn';
import { Eye, EyeOff } from 'lucide-react';

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showStrength?: boolean;
}

export function PasswordInput({ value, onChange, showStrength = false, ...props }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState<number>(0);

  useEffect(() => {
    if (showStrength && value) {
      const evaluation = zxcvbn(value);
      setStrength(evaluation.score); // 0-4
    } else {
      setStrength(0);
    }
  }, [value, showStrength]);

  const toggleVisibility = () => setShowPassword(!showPassword);

  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-400', 'bg-green-500'];
  const strengthLabels = ['Очень слабый', 'Слабый', 'Средний', 'Надежный', 'Отличный'];

  return (
    <div className="w-full">
      <div className="relative">
        <input
          {...props}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          className={`w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all ${props.className || ''}`}
        />
        <button
          type="button"
          onClick={toggleVisibility}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      {showStrength && value.length > 0 && (
        <div className="mt-2">
          <div className="flex gap-1 h-1.5 mb-1">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className={`flex-1 rounded-full transition-colors duration-300 ${
                  i < (strength === 0 ? 1 : strength) ? strengthColors[strength] : 'bg-slate-700'
                }`}
              />
            ))}
          </div>
          <p className={`text-xs text-right ${strength > 2 ? 'text-green-400' : 'text-slate-400'}`}>
            {strengthLabels[strength]}
          </p>
        </div>
      )}
    </div>
  );
}
