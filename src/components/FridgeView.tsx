import React, { useState } from 'react';
import { useHousehold } from '../context/HouseholdContext';
import { FridgeItem, FoodCategory } from '../types';
import { 
  Plus, 
  Trash2, 
  ShoppingCart, 
  CheckCircle2, 
  XCircle, 
  X,
  Edit2
} from 'lucide-react';

export const FridgeView: React.FC = () => {
  const { 
    fridgeItems, 
    addFridgeItem, 
    toggleItemAvailability,
    updateItemNote,
    deleteFridgeItem, 
    sendFridgeItemToShopping 
  } = useHousehold();

  // Strictly category-based: No "All" tab. Defaults to Protein
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory>('Protein');
  const [showAddModal, setShowAddModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<FridgeItem | null>(null);
  const [floatingToast, setFloatingToast] = useState<string | null>(null);

  // Add Item Form state
  const [name, setName] = useState('');
  const [note, setNote] = useState('');

  const categories: FoodCategory[] = [
    'Protein',
    'Carbs',
    'Greens',
    'Dairy',
    'Condiments & Seasonings',
    'Fruits & Others'
  ];

  // Filter items strictly by selected category
  const filteredItems = fridgeItems.filter(item => item.category === selectedCategory);

  // Category counts
  const getCategoryCount = (cat: FoodCategory) => {
    const items = fridgeItems.filter(f => f.category === cat);
    const inStock = items.filter(f => f.isAvailable).length;
    return { total: items.length, inStock };
  };

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addFridgeItem({
      name: name.trim(),
      category: selectedCategory,
      isAvailable: true,
      note: note.trim() || undefined
    });

    setName('');
    setNote('');
    setShowAddModal(false);
  };

  const handleSendToShopping = (item: FridgeItem) => {
    sendFridgeItemToShopping(item);
    setFloatingToast(`Added "${item.name}${item.note ? ` (${item.note})` : ''}" to your To-Buy list!`);
    setTimeout(() => setFloatingToast(null), 3000);
  };

  const getCategoryLabel = (cat: FoodCategory) => {
    switch (cat) {
      case 'Protein': return '🥩 Protein';
      case 'Carbs': return '🍚 Carbs';
      case 'Greens': return '🥦 Greens';
      case 'Dairy': return '🥛 Dairy';
      case 'Condiments & Seasonings': return '🧂 Seasonings';
      case 'Fruits & Others': return '🍎 Fruits';
    }
  };

  return (
    <div className="space-y-5 relative">
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

      {/* Category Tabs (Add item button removed from here) */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {categories.map(cat => {
            const { inStock, total } = getCategoryCount(cat);
            const isSelected = selectedCategory === cat;

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-3.5 py-2 rounded-xl font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span>{getCategoryLabel(cat)}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isSelected ? 'bg-slate-700 text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  {inStock}/{total}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* VISUAL CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredItems.map(item => {
          return (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                item.isAvailable
                  ? 'bg-white border-emerald-200/90 shadow-sm ring-1 ring-emerald-100 hover:shadow-md'
                  : 'bg-slate-50/80 border-slate-200 border-dashed opacity-80 hover:opacity-100'
              }`}
            >
              <div>
                {/* Card Header: 1-Click Presence Status (Trash icon removed from header) */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <button
                    onClick={() => toggleItemAvailability(item.id)}
                    className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 transition shadow-2xs ${
                      item.isAvailable
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                        : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                    }`}
                    title="Click to toggle: Masih Ada ↔ Udah Abis"
                  >
                    {item.isAvailable ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Masih Ada</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span>Udah Abis</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Item Name */}
                <h4 
                  onClick={() => toggleItemAvailability(item.id)}
                  className={`font-bold text-base cursor-pointer select-none leading-snug transition ${
                    item.isAvailable 
                      ? 'text-slate-900' 
                      : 'text-slate-400 line-through'
                  }`}
                  title="Click to toggle status"
                >
                  {item.name}
                </h4>

                {/* Optional Sisa / Detail Note (Directly Editable) */}
                <div className="mt-2.5 flex items-center gap-1.5">
                  <Edit2 className="w-3 h-3 text-slate-300 shrink-0" />
                  <input
                    type="text"
                    value={item.note || ''}
                    onChange={(e) => updateItemNote(item.id, e.target.value)}
                    placeholder="Sisa / detail (opsional)..."
                    className="w-full text-xs text-slate-600 placeholder-slate-300 bg-transparent border-b border-transparent hover:border-slate-200 focus:border-emerald-500 focus:outline-none transition py-0.5"
                  />
                </div>
              </div>

              {/* Bottom Actions: Delete replaces "di kulkas / siap stok" */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                {!item.isAvailable ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setItemToDelete(item)}
                      className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition"
                      title="Hapus item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleSendToShopping(item)}
                      className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>+ Beli / To-Buy</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between text-xs">
                    <button
                      onClick={() => setItemToDelete(item)}
                      className="text-slate-400 hover:text-rose-600 transition flex items-center gap-1 font-medium"
                      title="Hapus item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Hapus</span>
                    </button>
                    <button
                      onClick={() => handleSendToShopping(item)}
                      className="text-slate-400 hover:text-emerald-700 font-medium flex items-center gap-1"
                      title="Add to shopping list anyway"
                    >
                      <ShoppingCart className="w-3 h-3" />
                      <span>+ To-Buy</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* MUTED GREEN ADD NEW ITEM CARD (At the bottom of the grid) */}
        <div
          onClick={() => setShowAddModal(true)}
          className="border-2 border-dashed border-emerald-300/80 bg-emerald-50/40 hover:bg-emerald-50 text-emerald-800 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[160px] cursor-pointer transition shadow-2xs hover:shadow-sm group text-center"
        >
          <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition mb-2 shadow-2xs">
            <Plus className="w-5 h-5" />
          </div>
          <p className="font-bold text-sm text-emerald-900">+ Tambah {selectedCategory}</p>
          <p className="text-[11px] text-emerald-600/90 mt-0.5">Klik untuk tambah stok baru</p>
        </div>
      </div>

      {/* CONFIRM DELETE MODAL */}
      {itemToDelete && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h4 className="font-bold text-slate-800 text-base">Hapus Item Stok</h4>
              <button onClick={() => setItemToDelete(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Apakah kamu yakin ingin menghapus <strong className="text-slate-900">{itemToDelete.name}</strong> dari daftar stok {itemToDelete.category}?
            </p>

            <div className="flex justify-end gap-2 pt-5">
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50 transition"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteFridgeItem(itemToDelete.id);
                  setFloatingToast(`Item "${itemToDelete.name}" telah dihapus.`);
                  setItemToDelete(null);
                  setTimeout(() => setFloatingToast(null), 3000);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-sm transition"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleCreateItem} className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h4 className="font-bold text-slate-800">Tambah {selectedCategory}</h4>
              <button type="button" onClick={() => setShowAddModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Nama Makanan / Bahan *</label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-500"
                  placeholder="e.g. Dori Fillet, Tempe, Keju"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Catatan Sisa / Detail (Opsional)</label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g. sisa 2 pcs, 1 pack di freezer"
                  className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-medium hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold"
                >
                  Simpan
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
