
import React from 'react';
import { FilterState, InventoryRecord } from '../types';
import { Icons } from '../constants';

interface SidebarProps {
  data: InventoryRecord[];
  filters: FilterState;
  onFilterChange: (category: keyof FilterState, value: string) => void;
  onReset: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ data, filters, onFilterChange, onReset }) => {
  const getUnique = (key: keyof InventoryRecord) => {
    return Array.from(new Set(data.map(item => String(item[key])).filter(Boolean))).sort();
  };

  const categories: { label: string; key: keyof FilterState; dataKey: keyof InventoryRecord }[] = [
    { label: 'Month', key: 'month', dataKey: 'month' },
    { label: 'Year', key: 'year', dataKey: 'year' },
    { label: 'Item Group', key: 'itemGroup', dataKey: 'itemGroup' },
    { label: 'Item Type', key: 'itemType', dataKey: 'itemType' },
    { label: 'Item Parent', key: 'itemParent', dataKey: 'itemParent' },
  ];

  return (
    <aside className="w-full md:w-72 bg-white border-r border-slate-200 h-full p-6 flex flex-col gap-6 overflow-y-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-slate-800">
          <Icons.Filter className="w-5 h-5 text-blue-600" />
          <span>Filters</span>
        </div>
        <button 
          onClick={onReset}
          className="text-xs text-blue-600 hover:underline font-medium"
        >
          Reset All
        </button>
      </div>

      <div className="space-y-6">
        {categories.map((cat) => (
          <div key={cat.key} className="space-y-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {cat.label}
            </label>
            <div className="flex flex-wrap gap-2">
              {getUnique(cat.dataKey).map(option => {
                const isActive = filters[cat.key].includes(option);
                return (
                  <button
                    key={option}
                    onClick={() => onFilterChange(cat.key, option)}
                    className={`px-3 py-1.5 rounded-full text-xs transition-all border ${
                      isActive 
                        ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-200' 
                        : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300'
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
