
import React from 'react';

interface SelectorProps {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
}

export const Selector: React.FC<SelectorProps> = ({ label, options, value, onChange, disabled }) => (
  <div>
    <label htmlFor={label} className="block text-sm font-medium text-gray-300 mb-2">
      {label}
    </label>
    <select
      id={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="block w-full h-12 pl-3 pr-10 text-base text-gray-100 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);
