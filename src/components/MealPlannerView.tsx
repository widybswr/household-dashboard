import React, { useState } from 'react';
import { useHousehold } from '../context/HouseholdContext';
import { MealPlanItem, Recipe, CuisineType } from '../types';
import { 
  Plus, 
  Clock, 
  Tag, 
  X, 
  Check, 
  Edit2, 
  Utensils, 
  CheckCircle2, 
  AlertCircle, 
  ShoppingCart, 
  Calendar 
} from 'lucide-react';

export const MealPlannerView: React.FC = () => {
  const { 
    mealPlan, 
    recipes, 
    fridgeItems, 
    updateMeal, 
    addRecipe, 
    assignRecipeToMeal, 
    addShoppingItem 
  } = useHousehold();
  
  const [editingMeal, setEditingMeal] = useState<MealPlanItem | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editNotes, setEditNotes] = useState('');

  // Cuisine Selector state (Defaults to Indonesian)
  const [selectedCuisine, setSelectedCuisine] = useState<CuisineType>('Indonesian');

  // Scheduling Modal State
  const [schedulingRecipe, setSchedulingRecipe] = useState<Recipe | null>(null);
  const [targetDay, setTargetDay] = useState<MealPlanItem['day']>(() => {
    const dayNames: MealPlanItem['day'][] = [
      'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
    ];
    return dayNames[new Date().getDay()];
  });
  const [targetMealType, setTargetMealType] = useState<MealPlanItem['mealType']>('dinner');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // New Recipe Modal State
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [recipeTitle, setRecipeTitle] = useState('');
  const [recipeCuisine, setRecipeCuisine] = useState<CuisineType>('Indonesian');
  const [recipeTime, setRecipeTime] = useState(25);
  const [recipeIngredients, setRecipeIngredients] = useState('');
  const [recipeTags, setRecipeTags] = useState('');

  const days: MealPlanItem['day'][] = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  ];

  const cuisines: { id: CuisineType; label: string; flag: string }[] = [
    { id: 'Indonesian', label: 'Indonesian', flag: '🇮🇩' },
    { id: 'Japanese', label: 'Japanese', flag: '🇯🇵' },
    { id: 'Italian', label: 'Italian', flag: '🇮🇹' },
    { id: 'Chinese', label: 'Chinese', flag: '🇨🇳' },
    { id: 'Mexican', label: 'Mexican', flag: '🇲🇽' },
    { id: 'Indian', label: 'Indian', flag: '🇮🇳' },
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

  const handleEditClick = (item: MealPlanItem) => {
    setEditingMeal(item);
    setEditTitle(item.title);
    setEditNotes(item.notes || '');
  };

  const handleSaveMeal = () => {
    if (editingMeal) {
      updateMeal(editingMeal.id, editTitle, editNotes);
      setEditingMeal(null);
    }
  };

  const handleCreateRecipe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipeTitle.trim()) return;

    addRecipe({
      title: recipeTitle.trim(),
      cuisine: recipeCuisine,
      cookTimeMins: Number(recipeTime) || 30,
      ingredients: recipeIngredients.split(',').map(s => s.trim()).filter(Boolean),
      tags: recipeTags.split(',').map(s => s.trim()).filter(Boolean)
    });

    setRecipeTitle('');
    setRecipeIngredients('');
    setRecipeTags('');
    setShowRecipeModal(false);
  };

  const handleConfirmSchedule = () => {
    if (schedulingRecipe) {
      assignRecipeToMeal(schedulingRecipe.title, targetDay, targetMealType);
      setSuccessToast(`Jadwal diperbarui: ${schedulingRecipe.title} untuk ${targetDay} (${targetMealType.toUpperCase()})`);
      setSchedulingRecipe(null);
      setTimeout(() => setSuccessToast(null), 3500);
    }
  };

  const handleAddMissingToShopping = (ingredientName: string) => {
    addShoppingItem({
      title: ingredientName,
      category: 'Groceries',
      quantity: '1 pack',
      urgency: 'routine'
    });
    setSuccessToast(`Ditambahkan ke To-Buy list: ${ingredientName}`);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  return (
    <div className="space-y-6 relative">
      {/* FLOATING SUCCESS TOAST */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce sm:animate-none transition-all">
          <div className="bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 backdrop-blur-md">
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <span className="max-w-xs">{successToast}</span>
            <button 
              onClick={() => setSuccessToast(null)}
              className="text-slate-400 hover:text-white ml-1 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h3 className="font-bold text-slate-800">Weekly Meal Calendar</h3>
          <p className="text-xs text-slate-500">Plan out breakfast, lunch, and dinner. Click any slot to edit or pick from menu ideas below.</p>
        </div>
        <button
          onClick={() => setShowRecipeModal(true)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm shrink-0 self-start sm:self-auto transition"
        >
          <Plus className="w-4 h-4" /> Add Recipe
        </button>
      </div>

      {/* 7-Day Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3">
        {days.map((day) => {
          const dayMeals = mealPlan.filter(m => m.day === day);
          return (
            <div key={day} className="bg-white rounded-xl border border-slate-200 p-3 flex flex-col shadow-sm">
              <div className="pb-2 mb-2 border-b border-slate-100 flex items-center justify-between">
                <span className="font-bold text-sm text-slate-800">{day}</span>
              </div>

              <div className="space-y-2 flex-1">
                {(['breakfast', 'lunch', 'dinner'] as const).map(type => {
                  const item = dayMeals.find(m => m.mealType === type);
                  return (
                    <div 
                      key={type}
                      onClick={() => item && handleEditClick(item)}
                      className="group p-2 rounded-lg bg-slate-50 hover:bg-emerald-50/70 border border-slate-100/80 hover:border-emerald-200 cursor-pointer transition flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                          type === 'breakfast' ? 'bg-amber-100 text-amber-800' :
                          type === 'lunch' ? 'bg-emerald-100 text-emerald-800' : 'bg-indigo-100 text-indigo-800'
                        }`}>
                          {type}
                        </span>
                        <Edit2 className="w-3 h-3 text-slate-300 group-hover:text-emerald-600 opacity-0 group-hover:opacity-100 transition" />
                      </div>
                      <p className="text-xs font-medium text-slate-800 mt-1 line-clamp-2">
                        {item?.title || 'Click to set'}
                      </p>
                      {item?.notes && (
                        <p className="text-[10px] text-slate-400 mt-0.5 truncate">{item.notes}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* CUISINE-BASED MENU IDEAS POWERED BY FRIDGE STOCK */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <Utensils className="w-5 h-5 text-emerald-600" />
              <h4 className="font-bold text-slate-900 text-base">Ide Menu Masakan Berdasarkan Stok Kulkas</h4>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Menu yang semua bahannya <span className="text-emerald-700 font-semibold">Masih Ada</span> bisa langsung dijadwalkan. Menu dengan bahan habis otomatis disabled.
            </p>
          </div>
        </div>

        {/* Cuisine Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
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

        {/* Recipe Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
          {cuisineRecipes.map(recipe => {
            const missingIngredients = recipe.ingredients.filter(ing => !checkIngredientInStock(ing));
            const isAllAvailable = missingIngredients.length === 0;

            return (
              <div
                key={recipe.id}
                className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                  isAllAvailable
                    ? 'bg-white border-emerald-300 ring-1 ring-emerald-100 shadow-sm hover:shadow-md'
                    : 'bg-slate-50/80 border-slate-200 border-dashed opacity-55'
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

                    <span className="text-xs text-slate-400 flex items-center gap-1 shrink-0">
                      <Clock className="w-3 h-3" /> {recipe.cookTimeMins}m
                    </span>
                  </div>

                  {/* Recipe Title */}
                  <h5 className={`font-bold text-base leading-snug mt-1 ${isAllAvailable ? 'text-slate-900' : 'text-slate-500'}`}>
                    {recipe.title}
                  </h5>

                  {/* Required Ingredients Check */}
                  <div className="mt-3">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Kebutuhan Bahan:
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

                  {/* Missing Ingredient Helper Action (If Disabled) */}
                  {!isAllAvailable && missingIngredients.length > 0 && (
                    <div className="mt-3 p-2 rounded-xl bg-white border border-slate-200 text-xs">
                      <p className="text-[10px] font-semibold text-slate-500 mb-1">Tambah bahan yang kurang ke To-Buy list:</p>
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

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mt-3">
                    {recipe.tags.map(tag => (
                      <span key={tag} className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                        <Tag className="w-2.5 h-2.5" /> {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Action Button */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  {isAllAvailable ? (
                    <button
                      onClick={() => setSchedulingRecipe(recipe)}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>+ Jadwalkan ke Meal Plan</span>
                    </button>
                  ) : (
                    <button
                      disabled
                      className="w-full py-2 bg-slate-200 text-slate-400 rounded-xl text-xs font-semibold cursor-not-allowed text-center"
                    >
                      Bahan Belum Lengkap (Disabled)
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {cuisineRecipes.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-400">
              <p className="text-sm font-semibold">Belum ada menu untuk {selectedCuisine}.</p>
            </div>
          )}
        </div>
      </div>

      {/* QUICK SCHEDULE MODAL */}
      {schedulingRecipe && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h4 className="font-bold text-slate-800">Jadwalkan Menu Masakan</h4>
              <button onClick={() => setSchedulingRecipe(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-900">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">Menu Terpilih</span>
                <p className="font-bold text-sm mt-0.5">{schedulingRecipe.title}</p>
                <p className="text-xs text-emerald-700 mt-0.5">{schedulingRecipe.cookTimeMins} menit • {schedulingRecipe.cuisine}</p>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Pilih Hari</label>
                <select
                  value={targetDay}
                  onChange={(e) => setTargetDay(e.target.value as any)}
                  className="w-full text-xs font-semibold px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-500 bg-white"
                >
                  {days.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Waktu Makan</label>
                <select
                  value={targetMealType}
                  onChange={(e) => setTargetMealType(e.target.value as any)}
                  className="w-full text-xs font-semibold px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-500 bg-white"
                >
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setSchedulingRecipe(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-medium hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleConfirmSchedule}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                >
                  <Check className="w-4 h-4" /> Masukkan ke Kalender
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Meal Slot Modal */}
      {editingMeal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h4 className="font-bold text-slate-800">
                Edit {editingMeal.day} {editingMeal.mealType.toUpperCase()}
              </h4>
              <button onClick={() => setEditingMeal(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Dish / Meal Name</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500"
                  placeholder="e.g. Soto Ayam Lamongan"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Notes / Batch Prep Details</label>
                <input
                  type="text"
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500"
                  placeholder="e.g. Defrost chicken night before, make extra for tomorrow lunch"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingMeal(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveMeal}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" /> Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Recipe Modal */}
      {showRecipeModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleCreateRecipe} className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h4 className="font-bold text-slate-800">Add New Recipe</h4>
              <button type="button" onClick={() => setShowRecipeModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Recipe Name *</label>
                <input
                  type="text"
                  required
                  value={recipeTitle}
                  onChange={(e) => setRecipeTitle(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500"
                  placeholder="e.g. Nasi Goreng Kampung"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Cuisine</label>
                  <select
                    value={recipeCuisine}
                    onChange={(e) => setRecipeCuisine(e.target.value as any)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500 bg-white"
                  >
                    {cuisines.map(c => (
                      <option key={c.id} value={c.id}>{c.flag} {c.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Cook Time (mins)</label>
                  <input
                    type="number"
                    value={recipeTime}
                    onChange={(e) => setRecipeTime(Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Ingredients (comma separated) *</label>
                <textarea
                  rows={2}
                  required
                  value={recipeIngredients}
                  onChange={(e) => setRecipeIngredients(e.target.value)}
                  placeholder="Ayam Dada Fillet, Bawang Merah & Putih, Minyak Goreng"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500"
                />
                <p className="text-[10px] text-slate-400 mt-1">💡 Gunakan nama bahan yang cocok dengan nama item di kulkas agar otomatis terdeteksi.</p>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  value={recipeTags}
                  onChange={(e) => setRecipeTags(e.target.value)}
                  placeholder="Quick, Comfort Food, Batch Cook"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowRecipeModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold"
                >
                  Save Recipe
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
