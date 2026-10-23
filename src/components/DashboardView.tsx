import React, { useState } from 'react';
import { useHousehold } from '../context/HouseholdContext';
import { 
  Utensils, 
  Sparkles, 
  CreditCard, 
  ShoppingCart, 
  Wifi, 
  Phone, 
  CheckCircle2, 
  ArrowRight,
  Plus,
  AlertTriangle
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { 
    mealPlan, 
    artTasks, 
    bills, 
    shoppingItems, 
    aptInfo, 
    setActiveTab, 
    completeArtTask, 
    addShoppingItem,
    toggleShoppingItem
  } = useHousehold();

  const [quickItem, setQuickItem] = useState('');
  const [copiedWifi, setCopiedWifi] = useState(false);

  // Determine current day of week
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayDayName = days[new Date().getDay()];

  // Today's meals
  const todaysMeals = mealPlan.filter(m => m.day === todayDayName);

  // Chores status
  const today = new Date();
  const choreStatusList = artTasks.map(task => {
    const last = new Date(task.lastDoneDate);
    const diffDays = Math.floor((today.getTime() - last.getTime()) / (1000 * 3600 * 24));
    const isDue = diffDays >= task.frequencyDays;
    const daysLeft = task.frequencyDays - diffDays;
    return { ...task, diffDays, isDue, daysLeft };
  });

  const dueChores = choreStatusList.filter(c => c.isDue);
  const upcomingChores = choreStatusList.filter(c => !c.isDue).slice(0, 3);

  // Quick add shopping
  const handleAddShopping = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickItem.trim()) return;
    addShoppingItem({
      title: quickItem.trim(),
      category: 'Groceries',
      quantity: '1 item',
      urgency: 'routine'
    });
    setQuickItem('');
  };

  const copyWifi = () => {
    navigator.clipboard.writeText(aptInfo.wifiPassword);
    setCopiedWifi(true);
    setTimeout(() => setCopiedWifi(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-900 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-emerald-200 text-xs font-semibold tracking-wider uppercase bg-emerald-800/60 px-2.5 py-1 rounded-full">
              {aptInfo.tower} • {aptInfo.unitNumber}
            </span>
            <h2 className="text-2xl font-bold mt-2">Welcome Home!</h2>
            <p className="text-emerald-100 text-sm mt-1 max-w-xl">
              Here is your daily household snapshot. {dueChores.length > 0 ? `${dueChores.length} recurring chores are due for routine reset.` : 'All recurring chores are currently up to date!'}
            </p>
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setActiveTab('meals')}
              className="bg-white/10 hover:bg-white/20 backdrop-blur border border-white/20 text-white text-xs font-medium px-3.5 py-2 rounded-xl transition flex items-center gap-1.5"
            >
              <Utensils className="w-3.5 h-3.5" />
              Meal Planner
            </button>
            <button
              onClick={() => setActiveTab('art')}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 text-xs font-semibold px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 shadow"
            >
              <Sparkles className="w-3.5 h-3.5" />
              ART Routine
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Meals & Chores */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Card 1: Today's Meals */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
                <Utensils className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-slate-800">Today's Meals ({todayDayName})</h3>
            </div>
            <button 
              onClick={() => setActiveTab('meals')}
              className="text-xs text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-0.5"
            >
              Week <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3 flex-1">
            {['breakfast', 'lunch', 'dinner'].map((type) => {
              const item = todaysMeals.find(m => m.mealType === type);
              return (
                <div key={type} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                  <span className={`text-[11px] font-bold uppercase px-2 py-0.5 rounded-md shrink-0 ${
                    type === 'breakfast' ? 'bg-amber-100 text-amber-800' :
                    type === 'lunch' ? 'bg-emerald-100 text-emerald-800' : 'bg-indigo-100 text-indigo-800'
                  }`}>
                    {type}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-800 truncate">
                      {item?.title || 'Nothing planned yet'}
                    </p>
                    {item?.notes && (
                      <p className="text-xs text-slate-400 mt-0.5">{item.notes}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Card 2: Recurring ART Tasks Due */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-slate-800">Recurring Chores</h3>
            </div>
            <button 
              onClick={() => setActiveTab('art')}
              className="text-xs text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-0.5"
            >
              All Tasks <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2.5 flex-1">
            {dueChores.length > 0 ? (
              dueChores.map(task => (
                <div key={task.id} className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 bg-amber-200/80 text-amber-900 rounded">
                        Due now ({task.diffDays}d ago)
                      </span>
                      <span className="text-xs text-slate-500 font-medium truncate">{task.room}</span>
                    </div>
                    <p className="text-sm font-semibold text-slate-800 mt-1 line-clamp-1">{task.title}</p>
                  </div>
                  <button
                    onClick={() => completeArtTask(task.id)}
                    className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shrink-0 shadow-sm"
                    title="Mark completed today"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-slate-400">
                <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500/70 mb-2" />
                <p className="text-sm font-medium text-slate-600">No overdue tasks!</p>
                <p className="text-xs text-slate-400">Next chores coming up:</p>
              </div>
            )}

            {/* Upcoming preview if few are due */}
            {upcomingChores.slice(0, dueChores.length > 0 ? 1 : 3).map(task => (
              <div key={task.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-700 truncate">{task.title}</span>
                <span className="text-slate-400 font-medium shrink-0 ml-2">in {task.daysLeft}d</span>
              </div>
            ))}
          </div>
        </div>

        {/* Card 3: Quick Shopping / Needs */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                <ShoppingCart className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-slate-800">To-Buy / Needs</h3>
            </div>
            <button 
              onClick={() => setActiveTab('shopping')}
              className="text-xs text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-0.5"
            >
              View List <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Quick Add input */}
          <form onSubmit={handleAddShopping} className="flex gap-2 mb-3">
            <input
              type="text"
              value={quickItem}
              onChange={(e) => setQuickItem(e.target.value)}
              placeholder="e.g. Milk, Gas gallon, Trash bags..."
              className="flex-1 text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shrink-0"
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </form>

          {/* List items */}
          <div className="space-y-2 flex-1 overflow-y-auto max-h-[180px]">
            {shoppingItems.filter(s => !s.isCompleted).slice(0, 5).map(item => (
              <div 
                key={item.id}
                onClick={() => toggleShoppingItem(item.id)}
                className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition text-xs"
              >
                <div className="w-4 h-4 rounded border border-slate-300 flex items-center justify-center text-transparent hover:border-emerald-500">
                  ✓
                </div>
                <span className="flex-1 text-slate-700">{item.title}</span>
                {item.urgency === 'urgent' && (
                  <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">Urgent</span>
                )}
              </div>
            ))}
            {shoppingItems.filter(s => !s.isCompleted).length === 0 && (
              <p className="text-xs text-slate-400 text-center py-4">Shopping list is clear!</p>
            )}
          </div>
        </div>

      </div>

      {/* Second Row: Upcoming Bills & Quick Apartment Cheat Sheet */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Bills summary */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">Bills & Payment Dates</h3>
                <p className="text-xs text-slate-400">Monthly recurring household expenses</p>
              </div>
            </div>
            <button 
              onClick={() => setActiveTab('bills')}
              className="text-xs text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-0.5"
            >
              Manage Bills <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {bills.map(bill => (
              <div 
                key={bill.id} 
                className={`p-3.5 rounded-xl border flex items-center justify-between ${
                  bill.isPaid 
                    ? 'bg-slate-50/50 border-slate-200 text-slate-500' 
                    : 'bg-white border-amber-200/80 shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800">{bill.title}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                    <span>Due: <strong>{bill.dueDayOfMonth}th</strong> of month</span>
                    <span>Rp {bill.amount.toLocaleString('id-ID')}</span>
                  </div>
                </div>

                <span className={`text-[11px] font-bold px-2 py-1 rounded-md ${
                  bill.isPaid 
                    ? 'bg-emerald-100 text-emerald-700' 
                    : 'bg-rose-100 text-rose-700'
                }`}>
                  {bill.isPaid ? 'Paid' : 'Unpaid'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Apartment Info Widget */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-semibold text-slate-800">Quick House Info</h3>
              <button 
                onClick={() => setActiveTab('apt')}
                className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Full Manual →
              </button>
            </div>

            <div className="space-y-3">
              {/* Wi-Fi */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                    <Wifi className="w-4 h-4 text-emerald-600" />
                    <span>{aptInfo.wifiSSID}</span>
                  </div>
                  <button
                    onClick={copyWifi}
                    className="text-[11px] text-emerald-600 hover:text-emerald-700 font-semibold px-2 py-0.5 bg-white rounded border border-emerald-200"
                  >
                    {copiedWifi ? 'Copied!' : 'Copy Pass'}
                  </button>
                </div>
                <p className="text-xs font-mono text-slate-500 mt-1 pl-6">{aptInfo.wifiPassword}</p>
              </div>

              {/* Security & Access */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1.5">
                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Phone className="w-3.5 h-3.5 text-blue-500" /> Security Post:
                  </span>
                  <span className="font-semibold text-slate-800">{aptInfo.securityPhone}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Smart Lock Code:</span>
                  <span className="font-mono font-bold text-slate-800">{aptInfo.accessCode}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 p-2.5 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center gap-2 text-xs text-emerald-800">
            <AlertTriangle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Trash chute hours: {aptInfo.trashSchedule.split('(')[0]}</span>
          </div>
        </div>

      </div>
    </div>
  );
};
