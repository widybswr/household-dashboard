import React from 'react';
import { useHousehold } from '../context/HouseholdContext';
import { Calendar } from 'lucide-react';

export const Header: React.FC = () => {
  const { activeTab } = useHousehold();

  const getTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Household Hub';
      case 'meals': return 'Meal Ideas & Recipes';
      case 'fridge': return 'Pantry & Food Stocks';
      case 'art': return 'Cleaning & Maintenance';
      case 'bills': return 'Monthly Bills & Payment Dates';
      case 'shopping': return 'Needs & Shopping List';
      case 'apt': return 'Apartment Manual & Contacts';
      case 'renovation': return 'Renovation & Home Projects';
      default: return 'HomeHub';
    }
  };

  const todayStr = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  }).format(new Date());

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
      <div>
        <h2 className="text-xl font-bold text-slate-800">{getTitle()}</h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 bg-slate-100/80 px-3 py-1.5 rounded-lg">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>{todayStr}</span>
        </div>
      </div>
    </header>
  );
};
