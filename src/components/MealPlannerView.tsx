import React, { useState } from 'react';
import { useHousehold } from '../context/HouseholdContext';
import { Recipe, CuisineType, FoodCategory } from '../types';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Clock, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  ShoppingCart, 
  Check 
} from 'lucide-react';

export const MealPlannerView: React.FC = () => {
  const { 
    recipes, 
    fridgeItems, 
    addRecipe, 
    updateRecipe, 
    deleteRecipe, 
    addFridgeItem, 
    addShoppingItem 
  } = useHousehold();

  // Active Cuisine state (Defaults to Indonesian)
  const [selectedCuisine, setSelectedCuisine] = useState<CuisineType>('Indonesian');

  // Modal states
  const [showMealModal, setShowMealModal] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [recipeToDelete, setRecipeToDelete] = useState<Recipe | null>(null);
  const [floatingToast, setFloatingToast] = useState<string | null>(null);

  // Form states for Add / Edit Meal
  const [formTitle, setFormTitle] = useState('');
  const [formCuisine, setFormCuisine] = useState<CuisineType>('Indonesian');
  const [formCookTime, setFormCookTime] = useState<number>(25);
  const [formIngredients, setFormIngredients] = useState<string[]>([]);
  const [formNotes, setFormNotes] = useState('');

  // Sub-form for adding brand new ingredient to fridge & recipe
  const [newIngredientName, setNewIngredientName] = useState('');
  const [newIngredientCategory, setNewIngredientCategory] = useState<FoodCategory>('Protein');

  const cuisines: { id: CuisineType; label: string; flag: string }[] = [
    { id: 'Indonesian', label: 'Indonesian', flag: '🇮🇩' },
    { id: 'Japanese', label: 'Japanese', flag: '🇯🇵' },
    { id: 'Italian', label: 'Italian', flag: '🇮🇹' },
    { id: 'Chinese', label: 'Chinese', flag: '🇨🇳' },
    { id: 'Mexican', label: 'Mexican', flag: '🇲🇽' },
    { id: 'Indian', label: 'Indian', flag: '🇮🇳' },
  ];

  const foodCategories: FoodCategory[] = [
    'Protein',
    'Carbs',
    'Greens',
    'Dairy',
    'Condiments & Seasonings',
    'Fruits & Others'
  ];

  // Check if an ingredient is currently available ("Masih Ada") in fridgeItems
  const checkIngredientInStock = (ingName: string) => {
    return fridgeItems.some(f => {
      if (!f.isAvailable) return false;
      const fName = f.name.toLowerCase();
      const target = ingName.toLowerCase();
      return fName.includes(target) || target.includes(fName) ||
        target.split(' ').some(w => w.length >= 4 && fName.includes(w)) ||
        fName.split(' ').some(w => w.length >= 4 && target.includes(w));
    });
  };

  // Filter recipes by selected cuisine
  const cuisineRecipes = recipes.filter(r => r.cuisine === selectedCuisine);

  // Calculate readiness count per cuisine
  const getCuisineStats = (cuisine: CuisineType) => {
    const list = recipes.filter(r => r.cuisine === cuisine);
    const ready = list.filter(r => r.ingredients.every(checkIngredientInStock)).length;
    return { total: list.length, ready };
  };

  const handleOpenAddModal = () => {
    setEditingRecipe(null);
    setFormTitle('');
    setFormCuisine(selectedCuisine);
    setFormCookTime(25);
    setFormIngredients([]);
    setFormNotes('');
    setNewIngredientName('');
    setShowMealModal(true);
  };

  const handleOpenEditModal = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    setFormTitle(recipe.title);
    setFormCuisine(recipe.cuisine);
    setFormCookTime(recipe.cookTimeMins || 25);
    setFormIngredients([...recipe.ingredients]);
    setFormNotes(recipe.notes || '');
    setNewIngredientName('');
    setShowMealModal(true);
  };

  const handleToggleIngredientSelection = (name: string) => {
    setFormIngredients(prev => 
      prev.includes(name) 
        ? prev.filter(i => i !== name) 
        : [...prev, name]
    );
  };

  const handleAddNewIngredientToFridge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIngredientName.trim()) return;

    const trimmed = newIngredientName.trim();
    // Add to fridge items
    addFridgeItem({
      name: trimmed,
      category: newIngredientCategory,
      isAvailable: true
    });

    // Auto-select in current recipe
    if (!formIngredients.includes(trimmed)) {
      setFormIngredients(prev => [...prev, trimmed]);
    }

    setNewIngredientName('');
    setFloatingToast(`"${trimmed}" otomatis ditambahkan ke stok kulkas & resep!`);
    setTimeout(() => setFloatingToast(null), 3000);
  };

  const handleSaveMeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    if (editingRecipe) {
      updateRecipe(editingRecipe.id, {
        title: formTitle.trim(),
        cuisine: formCuisine,
        cookTimeMins: Number(formCookTime) || 20,
        ingredients: formIngredients,
        notes: formNotes.trim() || undefined
      });
      setFloatingToast(`Menu "${formTitle}" berhasil diperbarui.`);
    } else {
      addRecipe({
        title: formTitle.trim(),
        cuisine: formCuisine,
        cookTimeMins: Number(formCookTime) || 20,
        ingredients: formIngredients,
        notes: formNotes.trim() || undefined
      });
      setFloatingToast(`Menu "${formTitle}" berhasil ditambahkan.`);
    }

    setShowMealModal(false);
    setTimeout(() => setFloatingToast(null), 3000);
  };

  const handleAddMissingToShopping = (ingredientName: string) => {
    addShoppingItem({
      title: ingredientName,
      category: 'Groceries',
      quantity: '1 pack',
      urgency: 'routine'
    });
    setFloatingToast(`Ditambahkan ke To-Buy list: ${ingredientName}`);
    setTimeout(() => setFloatingToast(null), 3000);
  };

  return (
    <div className="space-y-5 relative">
      {/* FLOATING SUCCESS TOAST */}
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

      {/* Cuisine Selector Tabs Header */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {cuisines.map(c => {
            const { ready, total } = getCuisineStats(c.id);
            const isSelected = selectedCuisine === c.id;

            return (
              <button
                key={c.id}
                onClick={() => setSelectedCuisine(c.id)}
                className={`text-xs px-4 py-2 rounded-xl font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span>{c.flag} {c.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isSelected ? 'bg-slate-700 text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  {ready}/{total} Siap
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recipe Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cuisineRecipes.map(recipe => {
          const missingIngredients = recipe.ingredients.filter(ing => !checkIngredientInStock(ing));
          const isAllAvailable = missingIngredients.length === 0;

          return (
            <div
              key={recipe.id}
              className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                isAllAvailable
                  ? 'bg-white border-emerald-300 ring-1 ring-emerald-100 shadow-sm hover:shadow-md'
                  : 'bg-slate-50/80 border-slate-200 border-dashed opacity-60'
              }`}
            >
              <div>
                {/* Status Indicator Pill */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  {isAllAvailable ? (
                    <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Bahan Siap di Kulkas</span>
                    </span>
                  ) : (
                    <span className="text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                      <span>Bahan Kurang ({missingIngredients.length})</span>
                    </span>
                  )}

                  {recipe.cookTimeMins && (
                    <span className="text-xs text-slate-400 flex items-center gap-1 shrink-0">
                      <Clock className="w-3 h-3" /> {recipe.cookTimeMins}m
                    </span>
                  )}
                </div>

                {/* Recipe Title */}
                <h5 className={`font-bold text-base leading-snug mt-1 ${isAllAvailable ? 'text-slate-900' : 'text-slate-500'}`}>
                  {recipe.title}
                </h5>

                {recipe.notes && (
                  <p className="text-xs text-slate-500 mt-1 italic">
                    💡 {recipe.notes}
                  </p>
                )}

                {/* Ingredients Check List */}
                <div className="mt-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Bahan-Bahan:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {recipe.ingredients.map(ing => {
                      const inStock = checkIngredientInStock(ing);
                      return (
                        <span
                          key={ing}
                          className={`text-[11px] px-2 py-0.5 rounded-md font-medium border flex items-center gap-1 ${
                            inStock
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border-rose-200'
                          }`}
                        >
                          <span>{inStock ? '✓' : '✗'}</span>
                          <span>{ing}</span>
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Missing Ingredient Helper (If Disabled) */}
                {!isAllAvailable && missingIngredients.length > 0 && (
                  <div className="mt-3 p-2 rounded-xl bg-white border border-slate-200 text-xs">
                    <p className="text-[10px] font-semibold text-slate-500 mb-1">Tambah bahan kurang ke To-Buy list:</p>
                    <div className="flex flex-wrap gap-1">
                      {missingIngredients.map(ing => (
                        <button
                          key={ing}
                          onClick={() => handleAddMissingToShopping(ing)}
                          className="text-[10px] font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1 transition"
                          title="Klik untuk tambah ke shopping list"
                        >
                          <ShoppingCart className="w-3 h-3" /> + Beli {ing}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* CARD ACTIONS: EDIT & DELETE ONLY */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  onClick={() => setRecipeToDelete(recipe)}
                  className="text-slate-400 hover:text-rose-600 transition flex items-center gap-1 font-medium px-1 py-0.5 rounded-lg"
                  title="Hapus resep ini"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus</span>
                </button>

                <button
                  onClick={() => handleOpenEditModal(recipe)}
                  className="text-slate-600 hover:text-emerald-700 transition flex items-center gap-1 font-semibold px-2 py-1 rounded-lg hover:bg-slate-100"
                  title="Edit resep ini"
                >
                  <Edit3 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Edit Menu</span>
                </button>
              </div>
            </div>
          );
        })}

        {/* MUTED ADD NEW MEAL CARD (At the bottom of the grid) */}
        <div
          onClick={handleOpenAddModal}
          className="border-2 border-dashed border-emerald-300/80 bg-emerald-50/40 hover:bg-emerald-50 text-emerald-800 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[170px] cursor-pointer transition shadow-2xs hover:shadow-sm group text-center"
        >
          <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition mb-2 shadow-2xs">
            <Plus className="w-5 h-5" />
          </div>
          <p className="font-bold text-sm text-emerald-900">+ Tambah Menu {selectedCuisine}</p>
          <p className="text-[11px] text-emerald-600/90 mt-0.5">Pilih bahan dari kulkas atau buat baru</p>
        </div>
      </div>

      {/* CONFIRM DELETE MODAL */}
      {recipeToDelete && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h4 className="font-bold text-slate-800 text-base">Hapus Ide Menu</h4>
              <button onClick={() => setRecipeToDelete(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Apakah kamu yakin ingin menghapus menu <strong className="text-slate-900">{recipeToDelete.title}</strong>?
            </p>

            <div className="flex justify-end gap-2 pt-5">
              <button
                type="button"
                onClick={() => setRecipeToDelete(null)}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50 transition"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteRecipe(recipeToDelete.id);
                  setFloatingToast(`Menu "${recipeToDelete.title}" telah dihapus.`);
                  setRecipeToDelete(null);
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

      {/* ADD / EDIT MEAL MODAL */}
      {showMealModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h4 className="font-bold text-slate-800 text-base">
                {editingRecipe ? 'Edit Menu Masakan' : `Tambah Menu ${formCuisine}`}
              </h4>
              <button onClick={() => setShowMealModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMeal} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Nama Menu Masakan *</label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full text-sm px-3.5 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-500"
                  placeholder="e.g. Ayam Woku Belanga, Teriyaki Salmon"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Cuisine / Asal Masakan</label>
                  <select
                    value={formCuisine}
                    onChange={(e) => setFormCuisine(e.target.value as CuisineType)}
                    className="w-full text-xs font-semibold px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-500 bg-white"
                  >
                    {cuisines.map(c => (
                      <option key={c.id} value={c.id}>{c.flag} {c.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Perkiraan Waktu Masak (Menit)</label>
                  <input
                    type="number"
                    min="5"
                    step="5"
                    value={formCookTime}
                    onChange={(e) => setFormCookTime(Number(e.target.value))}
                    className="w-full text-xs font-semibold px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* SELECT INGREDIENTS FROM FRIDGE DATA (Grouped by Category) */}
              <div className="pt-1">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-800">
                    Pilih Bahan (Dari Data Kulkas)
                  </label>
                  <span className="text-[11px] text-emerald-700 font-semibold">
                    {formIngredients.length} bahan dipilih
                  </span>
                </div>

                {/* Selected summary */}
                {formIngredients.length > 0 && (
                  <div className="p-2.5 bg-emerald-50/60 rounded-xl border border-emerald-200/70 mb-3 flex flex-wrap gap-1">
                    {formIngredients.map(ing => (
                      <button
                        type="button"
                        key={ing}
                        onClick={() => handleToggleIngredientSelection(ing)}
                        className="text-[11px] bg-white text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-lg flex items-center gap-1 hover:bg-rose-50 hover:border-rose-300 hover:text-rose-700 transition"
                        title="Klik untuk menghapus dari resep"
                      >
                        <span>✓ {ing}</span>
                        <X className="w-3 h-3 text-slate-400 hover:text-rose-600" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Ingredients Selector grouped by category */}
                <div className="max-h-48 overflow-y-auto space-y-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  {foodCategories.map(category => {
                    const categoryItems = fridgeItems.filter(f => f.category === category);
                    if (categoryItems.length === 0) return null;

                    return (
                      <div key={category} className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          {category}
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {categoryItems.map(item => {
                            const isSelected = formIngredients.includes(item.name);
                            return (
                              <button
                                type="button"
                                key={item.id}
                                onClick={() => handleToggleIngredientSelection(item.name)}
                                className={`text-[11px] px-2 py-1 rounded-lg font-medium border transition flex items-center gap-1 ${
                                  isSelected
                                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                                }`}
                              >
                                {isSelected ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3 text-slate-400" />}
                                <span>{item.name}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* OPTION TO ADD INGREDIENTS (Auto-adds to fridge too) */}
              <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/70">
                <label className="text-[11px] font-bold text-amber-900 block mb-1">
                  Bahan belum ada di kulkas? Tambah langsung:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newIngredientName}
                    onChange={(e) => setNewIngredientName(e.target.value)}
                    placeholder="Nama bahan baru (e.g. Daun Kemangi)..."
                    className="flex-1 text-xs px-2.5 py-1.5 border border-amber-200 rounded-lg focus:outline-none focus:border-amber-500 bg-white"
                  />
                  <select
                    value={newIngredientCategory}
                    onChange={(e) => setNewIngredientCategory(e.target.value as FoodCategory)}
                    className="text-xs px-2 py-1.5 border border-amber-200 rounded-lg focus:outline-none bg-white text-slate-700"
                  >
                    {foodCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={handleAddNewIngredientToFridge}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold shrink-0 transition"
                  >
                    + Tambah
                  </button>
                </div>
                <p className="text-[10px] text-amber-700 mt-1">
                  Otomatis menambahkan bahan ini ke data kulkas Anda sekaligus dipilih untuk resep ini.
                </p>
              </div>

              {/* Notes (Optional) */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Catatan / Tips Memasak (Opsional)</label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="e.g. Tambahkan perasan jeruk nipis di akhir, tumis dengan api kecil..."
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowMealModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-medium hover:bg-slate-50 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm transition"
                >
                  {editingRecipe ? 'Simpan Perubahan' : 'Tambah Menu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
