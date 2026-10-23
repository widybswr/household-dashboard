import React, { useState } from 'react';
import { useHousehold } from '../context/HouseholdContext';
import { ShoppingItem } from '../types';
import { ShoppingBag, Plus, Trash2, CheckCircle2, Store } from 'lucide-react';

export const ShoppingView: React.FC = () => {
  const { 
    shoppingItems, 
    toggleShoppingItem, 
    addShoppingItem, 
    deleteShoppingItem, 
    clearCompletedShopping 
  } = useHousehold();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ShoppingItem['category']>('Groceries');
  const [quantity, setQuantity] = useState('1 pack');
  const [store, setStore] = useState('Supermarket');
  const [urgency, setUrgency] = useState<ShoppingItem['urgency']>('routine');
  const [selectedFilter, setSelectedFilter] = useState<string>('All');

  const categories = ['All', 'Groceries', 'Household', 'Pantry Staples', 'Hardware / Reno'];

  const filteredItems = shoppingItems.filter(item => {
    if (selectedFilter !== 'All' && item.category !== selectedFilter) return false;
    return true;
  });

  const pendingCount = shoppingItems.filter(i => !i.isCompleted).length;
  const completedCount = shoppingItems.filter(i => i.isCompleted).length;

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addShoppingItem({
      title: title.trim(),
      category,
      quantity: quantity.trim() || '1 item',
      store: store.trim() || undefined,
      urgency
    });

    setTitle('');
  };

  return (
    <div className="space-y-6">
      {/* Header and Quick Add */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-slate-800 text-lg">Needs & Grocery Shopping List</h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {pendingCount} items remaining • {completedCount} checked off
            </p>
          </div>

          {completedCount > 0 && (
            <button
              onClick={clearCompletedShopping}
              className="text-xs text-slate-500 hover:text-rose-600 font-semibold px-3 py-1.5 rounded-lg border border-slate-200 hover:border-rose-200 bg-slate-50 hover:bg-rose-50 transition self-start sm:self-auto"
            >
              Clear Completed ({completedCount})
            </button>
          )}
        </div>

        {/* Add item form */}
        <form onSubmit={handleAddItem} className="space-y-3 pt-2 border-t border-slate-100">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Add item (e.g. Minyak Goreng 2L, Sabun Cuci Piring)..."
              className="flex-1 text-sm px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-500"
            />
            <input
              type="text"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Qty (e.g. 2 pcs)"
              className="w-full sm:w-28 text-sm px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 shadow-sm shrink-0"
            >
              <Plus className="w-4 h-4" /> Add Item
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-medium">Category:</span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none"
              >
                <option value="Groceries">Groceries</option>
                <option value="Household">Household</option>
                <option value="Pantry Staples">Pantry Staples</option>
                <option value="Hardware / Reno">Hardware / Reno</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-medium">Store:</span>
              <input
                type="text"
                value={store}
                onChange={(e) => setStore(e.target.value)}
                placeholder="Supermarket"
                className="w-28 px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-medium">Urgency:</span>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as any)}
                className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none"
              >
                <option value="routine">Routine</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>
        </form>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedFilter(cat)}
            className={`text-xs px-3.5 py-1.5 rounded-xl font-medium transition whitespace-nowrap ${
              selectedFilter === cat
                ? 'bg-slate-800 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Items List */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm divide-y divide-slate-100">
        {filteredItems.map(item => (
          <div
            key={item.id}
            className={`p-4 flex items-center justify-between gap-4 transition ${
              item.isCompleted ? 'bg-slate-50/50 opacity-60' : 'hover:bg-slate-50/70'
            }`}
          >
            <div 
              onClick={() => toggleShoppingItem(item.id)}
              className="flex items-center gap-3.5 flex-1 cursor-pointer"
            >
              <div
                className={`w-5 h-5 rounded-md border flex items-center justify-center transition shrink-0 ${
                  item.isCompleted
                    ? 'bg-emerald-600 border-emerald-600 text-white'
                    : 'border-slate-300 hover:border-emerald-500 text-transparent'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>

              <div>
                <p className={`text-sm font-semibold ${item.isCompleted ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                  {item.title}
                </p>
                <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                  <span className="font-medium text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded">
                    {item.quantity}
                  </span>
                  <span>•</span>
                  <span>{item.category}</span>
                  {item.store && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-0.5 text-slate-500">
                        <Store className="w-3 h-3" /> {item.store}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {item.urgency === 'urgent' && !item.isCompleted && (
                <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
                  Urgent
                </span>
              )}
              <button
                onClick={() => deleteShoppingItem(item.id)}
                className="p-1.5 text-slate-300 hover:text-rose-500 transition rounded-lg"
                title="Remove item"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {filteredItems.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <ShoppingBag className="w-8 h-8 mx-auto text-slate-300 mb-2" />
            <p className="text-sm">No items in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};
