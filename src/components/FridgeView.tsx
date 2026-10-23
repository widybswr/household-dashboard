import React, { useState } from 'react';
import { useHousehold } from '../context/HouseholdContext';
import { FridgeItem, FoodCategory, FoodUnit } from '../types';
import { 
  Plus, 
  Minus, 
  Trash2, 
  ShoppingCart, 
  CheckCircle2, 
  X,
  AlertCircle
} from 'lucide-react';

export const FridgeView: React.FC = () => {
  const { 
    fridgeItems, 
    addFridgeItem, 
    updateFridgeQuantity, 
    updateFridgeUnit,
    deleteFridgeItem, 
    sendFridgeItemToShopping 
  } = useHousehold();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [floatingToast, setFloatingToast] = useState<string | null>(null);

  // Add Item Form state
  const [name, setName] = useState('');
  const [category, setCategory] = useState<FoodCategory>('Protein');
  const [amount, setAmount] = useState<number>(1);
  const [unit, setUnit] = useState<FoodUnit>('pcs / butir');
  const [notes, setNotes] = useState('');

  const categories: string[] = [
    'All',
    'Protein',
    'Carbs',
    'Greens',
    'Dairy',
    'Condiments & Seasonings',
    'Fruits & Others'
  ];

  const availableUnits: FoodUnit[] = [
    'pcs / butir',
    'kg',
    'gram',
    'liter',
    'ml',
    'pack',
    'bottle',
    'can',
    'bonggol',
    'ikat',
    'box'
  ];

  // Category counts
  const categoryCounts = categories.reduce((acc, cat) => {
    if (cat === 'All') {
      acc[cat] = fridgeItems.length;
    } else {
      acc[cat] = fridgeItems.filter(f => f.category === cat).length;
    }
    return acc;
  }, {} as Record<string, number>);

  // Filter items
  const filteredItems = fridgeItems.filter(item => {
    if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;
    return true;
  });

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addFridgeItem({
      name: name.trim(),
      category,
      quantity: Number(amount) || 0,
      unit,
      notes: notes.trim() || undefined
    });

    setName('');
    setAmount(1);
    setNotes('');
    setShowAddModal(false);
  };

  const handleSendToShopping = (item: FridgeItem) => {
    sendFridgeItemToShopping(item);
    setFloatingToast(`Added "${item.name} (${item.quantity > 0 ? item.quantity : 1} ${item.unit})" to your To-Buy list!`);
    setTimeout(() => setFloatingToast(null), 3000);
  };

  const getCategoryBadgeColor = (cat: FoodCategory) => {
    switch (cat) {
      case 'Protein': return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Carbs': return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Greens': return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Dairy': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Condiments & Seasonings': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Fruits & Others': return 'bg-orange-50 text-orange-700 border-orange-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-4 relative">
      {/* FLOATING TOAST NOTIFICATION */}
      {floatingToast && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce sm:animate-none transition-all">
          <div className="bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 backdrop-blur-md">
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <span className="max-w-xs">{floatingToast}</span>
            <button 
              onClick={() => setFloatingToast(null)}
              className="text-slate-400 hover:text-white ml-1 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Inline Category Filters & Add Item Button Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {categories.map(cat => {
            const count = categoryCounts[cat] || 0;
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-3.5 py-2 rounded-xl font-medium whitespace-nowrap transition flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span>{cat === 'Protein' ? '🥩 Protein' : cat === 'Carbs' ? '🍚 Carbs' : cat === 'Greens' ? '🥦 Greens' : cat === 'Dairy' ? '🥛 Dairy' : cat === 'Condiments & Seasonings' ? '🧂 Seasonings' : cat === 'Fruits & Others' ? '🍎 Fruits' : 'All Items'}</span>
                <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                  isSelected ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm self-start sm:self-auto shrink-0 transition"
        >
          <Plus className="w-4 h-4" /> Add Item
        </button>
      </div>

      {/* MAIN INVENTORY TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs table-fixed">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px] font-bold">
              <tr>
                <th className="py-3.5 px-5 w-[38%]">Item Name</th>
                <th className="py-3.5 px-4 w-[18%]">Category</th>
                <th className="py-3.5 px-4 w-[30%]">Quantity & Unit</th>
                <th className="py-3.5 px-5 w-[14%] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.map(item => {
                const isOutOfStock = item.quantity === 0;

                return (
                  <tr 
                    key={item.id} 
                    className={`transition group ${isOutOfStock ? 'bg-rose-50/30' : 'hover:bg-slate-50/70'}`}
                  >
                    {/* Item Name */}
                    <td className="py-3 px-5 font-semibold text-slate-900">
                      <div>
                        <span className={`text-sm ${isOutOfStock ? 'text-rose-900 font-bold' : 'text-slate-900'}`}>
                          {item.name}
                        </span>
                        {item.notes && (
                          <p className="text-[11px] font-normal text-slate-400 mt-0.5">{item.notes}</p>
                        )}
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold border ${getCategoryBadgeColor(item.category)}`}>
                        {item.category}
                      </span>
                    </td>

                    {/* Directly Editable Quantity & Unit */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {/* Stepper & Number Input */}
                        <div className="flex items-center rounded-lg border border-slate-200 bg-white overflow-hidden shadow-2xs">
                          <button
                            type="button"
                            onClick={() => updateFridgeQuantity(item.id, Math.max(0, item.quantity - 1))}
                            className="px-2 py-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
                            title="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>

                          <input
                            type="number"
                            min="0"
                            step="any"
                            value={item.quantity}
                            onChange={(e) => updateFridgeQuantity(item.id, Number(e.target.value) || 0)}
                            className={`w-14 text-center text-xs font-bold py-1 focus:outline-none ${
                              isOutOfStock ? 'text-rose-600 bg-rose-50/50' : 'text-slate-800'
                            }`}
                          />

                          <button
                            type="button"
                            onClick={() => updateFridgeQuantity(item.id, item.quantity + 1)}
                            className="px-2 py-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
                            title="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Unit Selection Dropdown (Fixed per item but editable) */}
                        <select
                          value={item.unit}
                          onChange={(e) => updateFridgeUnit(item.id, e.target.value as FoodUnit)}
                          className="text-xs font-semibold px-2 py-1.5 bg-slate-100/90 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-lg cursor-pointer focus:outline-none"
                        >
                          {availableUnits.map(u => (
                            <option key={u} value={u}>{u}</option>
                          ))}
                        </select>

                        {isOutOfStock && (
                          <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wide bg-rose-100 px-1.5 py-0.5 rounded">
                            Empty
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleSendToShopping(item)}
                          className="px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition flex items-center gap-1.5 shadow-2xs"
                          title="Add this item to To-Buy list"
                        >
                          <ShoppingCart className="w-3.5 h-3.5 text-emerald-600" />
                          <span>+ To-Buy</span>
                        </button>

                        <button
                          onClick={() => deleteFridgeItem(item.id)}
                          className="p-1.5 text-slate-300 hover:text-rose-600 rounded-lg transition"
                          title="Delete item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-slate-400">
                    <AlertCircle className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="text-sm">No items found matching "{selectedCategory}".</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleCreateItem} className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h4 className="font-bold text-slate-800">Add Stock Item</h4>
              <button type="button" onClick={() => setShowAddModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Item Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500"
                  placeholder="e.g. Telur Ayam, Daging Sapi, Beras"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as FoodCategory)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500"
                >
                  <option value="Protein">🥩 Protein</option>
                  <option value="Carbs">🍚 Carbs</option>
                  <option value="Greens">🥦 Greens</option>
                  <option value="Dairy">🥛 Dairy</option>
                  <option value="Condiments & Seasonings">🧂 Condiments & Seasonings</option>
                  <option value="Fruits & Others">🍎 Fruits & Others</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Quantity Amount</label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Unit of Measurement</label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value as FoodUnit)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500"
                  >
                    {availableUnits.map(u => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Notes (Optional)</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Preferred brand, storage tip"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold"
                >
                  Save Item
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
