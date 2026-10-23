import React from 'react';
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  Package,
  Sparkles, 
  CreditCard, 
  ShoppingCart, 
  Building2, 
  Hammer
} from 'lucide-react';
import { useHousehold } from '../context/HouseholdContext';
import { TabType } from '../types';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, artTasks, bills, shoppingItems, fridgeItems } = useHousehold();

  // Calculate badges
  const pendingBills = bills.filter(b => !b.isPaid).length;
  const pendingGroceries = shoppingItems.filter(s => !s.isCompleted).length;
  
  // Fridge items that are empty (Udah Abis)
  const emptyStockCount = fridgeItems.filter(f => !f.isAvailable).length;
  
  // Overdue or due chores
  const today = new Date();
  const dueChores = artTasks.filter(task => {
    const last = new Date(task.lastDoneDate);
    const diffDays = Math.floor((today.getTime() - last.getTime()) / (1000 * 3600 * 24));
    return diffDays >= task.frequencyDays;
  }).length;

  const navItems: { id: TabType; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'dashboard', label: 'Overview', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'meals', label: 'Meal Ideas', icon: <UtensilsCrossed className="w-5 h-5" /> },
    { id: 'fridge', label: 'Food Stock', icon: <Package className="w-5 h-5" />, badge: emptyStockCount > 0 ? emptyStockCount : undefined },
    { id: 'art', label: 'Cleaning & Maintenance', icon: <Sparkles className="w-5 h-5" />, badge: dueChores },
    { id: 'bills', label: 'Bills & Payments', icon: <CreditCard className="w-5 h-5" />, badge: pendingBills },
    { id: 'shopping', label: 'To-Buy & Groceries', icon: <ShoppingCart className="w-5 h-5" />, badge: pendingGroceries },
    { id: 'apt', label: 'Apartment Manual', icon: <Building2 className="w-5 h-5" /> },
    { id: 'renovation', label: 'Reno & Projects', icon: <Hammer className="w-5 h-5" /> },
  ];

  return (
    <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex flex-col shrink-0">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xl shadow-sm shadow-emerald-200">
            H
          </div>
          <div>
            <h1 className="font-bold text-slate-900 text-lg leading-tight">HomeHub</h1>
            <p className="text-xs text-slate-500">Household & Meals</p>
          </div>
        </div>
      </div>

      <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-emerald-50 text-emerald-800 font-semibold'
                  : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={isActive ? 'text-emerald-600' : 'text-slate-400'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    item.id === 'bills' || item.id === 'fridge' 
                      ? 'bg-rose-100 text-rose-700' 
                      : item.id === 'art'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="text-xs text-slate-500 flex justify-between items-center">
          <span>Synced locally</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        </div>
      </div>
    </aside>
  );
};
