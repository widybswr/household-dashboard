import React from 'react';
import { useHousehold } from '../context/HouseholdContext';
import { Calendar, HeartHandshake } from 'lucide-react';

export const Header: React.FC = () => {
  const { activeTab, helperMode, setHelperMode } = useHousehold();

  const getTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Household Hub';
      case 'meals': return 'Weekly Meal Planner & Recipes';
      case 'art': return 'ART Routine & Recurring Chores';
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
        <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-slate-500 bg-slate-100/80 px-3 py-1.5 rounded-lg">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>{todayStr}</span>
        </div>

        {/* Quick toggle for ART Helper View */}
        <button
          onClick={() => setHelperMode(!helperMode)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            helperMode 
              ? 'bg-amber-600 text-white shadow-sm shadow-amber-200' 
              : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
          }`}
          title="Toggle simplified view for ART / Domestic Helper"
        >
          <HeartHandshake className="w-4 h-4" />
          <span>{helperMode ? 'ART View: ACTIVE' : 'ART Helper Mode'}</span>
        </button>
      </div>
    </header>
  );
};
