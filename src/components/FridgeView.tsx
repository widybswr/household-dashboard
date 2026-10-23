import React, { useState } from 'react';
import { useHousehold } from '../context/HouseholdContext';
import { FridgeItem, StockStatus } from '../types';
import { 
  Package, 
  Plus, 
  Trash2, 
  ShoppingCart, 
  Search, 
  CheckCircle2, 
  X,
  AlertCircle
} from 'lucide-react';

export const FridgeView: React.FC = () => {
  const { 
    fridgeItems, 
    addFridgeItem, 
    updateStockStatus, 
    deleteFridgeItem, 
    sendFridgeItemToShopping 
  } = useHousehold();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedZone, setSelectedZone] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [zone, setZone] = useState<FridgeItem['zone']>('Fridge');
  const [category, setCategory] = useState<FridgeItem['category']>('Produce & Veggies');
  const [quantity, setQuantity] = useState('1 pack');
  const [status, setStatus] = useState<StockStatus>('In Stock');
  const [notes, setNotes] = useState('');

  // Status counts
  const totalCount = fridgeItems.length;
  const inStockCount = fridgeItems.filter(f => f.status === 'In Stock').length;
  const lowStockCount = fridgeItems.filter(f => f.status === 'Low Stock').length;
  const outOfStockCount = fridgeItems.filter(f => f.status === '0 Stock').length;
  const dontBuyCount = fridgeItems.filter(f => f.status === "Don't Buy").length;

  // Filter items
  const filteredItems = fridgeItems.filter(item => {
    if (selectedZone !== 'All' && item.zone !== selectedZone) return false;
    if (selectedStatus !== 'All' && item.status !== selectedStatus) return false;
    if (searchQuery.trim() && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addFridgeItem({
      name: name.trim(),
      zone,
      category,
      quantity: quantity.trim() || '1 item',
      status,
      notes: notes.trim() || undefined
    });

    setName('');
    setNotes('');
    setShowAddModal(false);
  };

  const handleSendToShopping = (item: FridgeItem) => {
    sendFridgeItemToShopping(item);
    setFeedbackMsg(`Added "${item.name}" to your To-Buy list!`);
    setTimeout(() => setFeedbackMsg(null), 2500);
  };

  const getStatusBadgeStyle = (itemStatus: StockStatus) => {
    switch (itemStatus) {
      case 'In Stock':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Low Stock':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case '0 Stock':
        return 'bg-rose-50 text-rose-800 border-rose-200 font-bold';
      case "Don't Buy":
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner and Quick Add */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-800 text-lg">Fridge, Freezer & Pantry Stock</h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Simple inventory table to track what is in stock, running low, empty (0 Stock), or paused.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm self-start md:self-auto shrink-0 transition"
        >
          <Plus className="w-4 h-4" /> Add Item
        </button>
      </div>

      {/* Metric Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <button
          onClick={() => setSelectedStatus('All')}
          className={`p-3.5 rounded-xl border text-left transition ${
            selectedStatus === 'All' 
              ? 'bg-slate-900 text-white border-slate-900 shadow-sm' 
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <p className={`text-[10px] font-bold uppercase tracking-wider ${selectedStatus === 'All' ? 'text-slate-300' : 'text-slate-400'}`}>
            Total Items
          </p>
          <p className="text-2xl font-bold mt-1">{totalCount}</p>
        </button>

        <button
          onClick={() => setSelectedStatus('In Stock')}
          className={`p-3.5 rounded-xl border text-left transition ${
            selectedStatus === 'In Stock' 
              ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm' 
              : 'bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-50/50'
          }`}
        >
          <p className={`text-[10px] font-bold uppercase tracking-wider ${selectedStatus === 'In Stock' ? 'text-emerald-100' : 'text-emerald-600'}`}>
            In Stock
          </p>
          <p className="text-2xl font-bold mt-1">{inStockCount}</p>
        </button>

        <button
          onClick={() => setSelectedStatus('Low Stock')}
          className={`p-3.5 rounded-xl border text-left transition ${
            selectedStatus === 'Low Stock' 
              ? 'bg-amber-600 text-white border-amber-600 shadow-sm' 
              : 'bg-white text-amber-700 border-amber-200 hover:bg-amber-50/50'
          }`}
        >
          <p className={`text-[10px] font-bold uppercase tracking-wider ${selectedStatus === 'Low Stock' ? 'text-amber-100' : 'text-amber-600'}`}>
            Low Stock
          </p>
          <p className="text-2xl font-bold mt-1">{lowStockCount}</p>
        </button>

        <button
          onClick={() => setSelectedStatus('0 Stock')}
          className={`p-3.5 rounded-xl border text-left transition ${
            selectedStatus === '0 Stock' 
              ? 'bg-rose-700 text-white border-rose-700 shadow-sm' 
              : 'bg-white text-rose-700 border-rose-200 hover:bg-rose-50/50'
          }`}
        >
          <p className={`text-[10px] font-bold uppercase tracking-wider ${selectedStatus === '0 Stock' ? 'text-rose-100' : 'text-rose-600'}`}>
            0 Stock (Empty)
          </p>
          <p className="text-2xl font-bold mt-1">{outOfStockCount}</p>
        </button>

        <button
          onClick={() => setSelectedStatus("Don't Buy")}
          className={`p-3.5 rounded-xl border text-left transition col-span-2 sm:col-span-1 ${
            selectedStatus === "Don't Buy" 
              ? 'bg-slate-700 text-white border-slate-700 shadow-sm' 
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <p className={`text-[10px] font-bold uppercase tracking-wider ${selectedStatus === "Don't Buy" ? 'text-slate-300' : 'text-slate-400'}`}>
            Don't Buy For Now
          </p>
          <p className="text-2xl font-bold mt-1">{dontBuyCount}</p>
        </button>
      </div>

      {feedbackMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search items (e.g. Telur, Susu, Salmon)..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Zone Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {['All', 'Fridge', 'Freezer', 'Pantry'].map(zoneKey => (
            <button
              key={zoneKey}
              onClick={() => setSelectedZone(zoneKey)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition ${
                selectedZone === zoneKey
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {zoneKey === 'Fridge' ? '🧊 Fridge' : zoneKey === 'Freezer' ? '❄️ Freezer' : zoneKey === 'Pantry' ? '🥫 Pantry' : 'All Zones'}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN INVENTORY TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px] font-bold">
              <tr>
                <th className="py-3.5 px-4">Item Name</th>
                <th className="py-3.5 px-4">Storage Zone</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Qty / Note</th>
                <th className="py-3.5 px-4">Stock Status (Set Directly)</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.map(item => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition">
                  {/* Item Name */}
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    <div>
                      <span>{item.name}</span>
                      {item.notes && (
                        <p className="text-[11px] font-normal text-slate-400 mt-0.5">{item.notes}</p>
                      )}
                    </div>
                  </td>

                  {/* Zone */}
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                      {item.zone === 'Fridge' && '🧊'}
                      {item.zone === 'Freezer' && '❄️'}
                      {item.zone === 'Pantry' && '🥫'}
                      {item.zone}
                    </span>
                  </td>

                  {/* Category */}
                  <td className="py-3.5 px-4 text-slate-500">
                    {item.category}
                  </td>

                  {/* Quantity */}
                  <td className="py-3.5 px-4 text-slate-700 font-medium">
                    {item.quantity}
                  </td>

                  {/* Stock Status Selector */}
                  <td className="py-3.5 px-4">
                    <select
                      value={item.status}
                      onChange={(e) => updateStockStatus(item.id, e.target.value as StockStatus)}
                      className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border cursor-pointer focus:outline-none transition ${getStatusBadgeStyle(item.status)}`}
                    >
                      <option value="In Stock">🟢 In Stock</option>
                      <option value="Low Stock">🟡 Low Stock</option>
                      <option value="0 Stock">🔴 0 Stock (Empty)</option>
                      <option value="Don't Buy">⚪ Don't Buy For Now</option>
                    </select>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleSendToShopping(item)}
                        className="px-2.5 py-1 text-slate-700 hover:text-emerald-700 bg-slate-100 hover:bg-emerald-50 rounded-lg font-medium transition flex items-center gap-1"
                        title="Add this item to To-Buy list"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>To-Buy</span>
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
              ))}

              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <AlertCircle className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="text-sm">No items found matching the selected filter.</p>
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
                  placeholder="e.g. Telur Ayam, Susu UHT, Ayam Dada"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Storage Zone</label>
                  <select
                    value={zone}
                    onChange={(e) => setZone(e.target.value as any)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Fridge">🧊 Fridge / Chiller</option>
                    <option value="Freezer">❄️ Freezer</option>
                    <option value="Pantry">🥫 Pantry / Dry</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Initial Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as StockStatus)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500"
                  >
                    <option value="In Stock">🟢 In Stock</option>
                    <option value="Low Stock">🟡 Low Stock</option>
                    <option value="0 Stock">🔴 0 Stock (Empty)</option>
                    <option value="Don't Buy">⚪ Don't Buy For Now</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Dairy & Eggs">Dairy & Eggs</option>
                    <option value="Meat & Seafood">Meat & Seafood</option>
                    <option value="Produce & Veggies">Produce & Veggies</option>
                    <option value="Condiments & Sauces">Condiments & Sauces</option>
                    <option value="Pantry & Dry">Pantry & Dry</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Quantity / Package</label>
                  <input
                    type="text"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="e.g. 10 butir, 2 packs"
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Notes (Optional)</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Prefer brand X, or storage shelf location"
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
