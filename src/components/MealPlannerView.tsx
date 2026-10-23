import React, { useState } from 'react';
import { useHousehold } from '../context/HouseholdContext';
import { MealPlanItem, Recipe } from '../types';
import { Plus, BookOpen, Clock, Tag, X, Check, Edit2, Sparkles } from 'lucide-react';

export const MealPlannerView: React.FC = () => {
  const { mealPlan, recipes, fridgeItems, updateMeal, addRecipe, setActiveTab } = useHousehold();
  
  const [editingMeal, setEditingMeal] = useState<MealPlanItem | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editNotes, setEditNotes] = useState('');

  // New Recipe Modal State
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [recipeTitle, setRecipeTitle] = useState('');
  const [recipeCategory, setRecipeCategory] = useState<Recipe['category']>('Indonesian');
  const [recipeTime, setRecipeTime] = useState(30);
  const [recipeIngredients, setRecipeIngredients] = useState('');
  const [recipeTags, setRecipeTags] = useState('');

  const days: MealPlanItem['day'][] = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  ];

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
      category: recipeCategory,
      cookTimeMins: Number(recipeTime) || 30,
      ingredients: recipeIngredients.split(',').map(s => s.trim()).filter(Boolean),
      tags: recipeTags.split(',').map(s => s.trim()).filter(Boolean)
    });

    setRecipeTitle('');
    setRecipeIngredients('');
    setRecipeTags('');
    setShowRecipeModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top action row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200">
        <div>
          <h3 className="font-bold text-slate-800">Weekly Meal Calendar</h3>
          <p className="text-xs text-slate-500">Plan out meals to automate grocery shopping and eliminate daily cooking stress</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('fridge')}
            className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Smart Fridge Matcher
          </button>
          <button
            onClick={() => setShowRecipeModal(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm shrink-0"
          >
            <Plus className="w-4 h-4" /> Add Favorite Recipe
          </button>
        </div>
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

      {/* Recipe Box Section */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-800">Favorite Family Recipes & Staples</h3>
          </div>
          <span className="text-xs text-slate-400">{recipes.length} saved recipes</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recipes.map(recipe => (
            <div key={recipe.id} className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:shadow-sm transition">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                  {recipe.category}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {recipe.cookTimeMins} mins
                </span>
              </div>
              <h4 className="font-bold text-slate-800 mt-2 text-sm">{recipe.title}</h4>
              
              <div className="mt-3">
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Key Ingredients:</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {recipe.ingredients.slice(0, 4).map((ing, i) => (
                    <span key={i} className="text-[10px] bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-600">
                      {ing}
                    </span>
                  ))}
                  {recipe.ingredients.length > 4 && (
                    <span className="text-[10px] text-slate-400 px-1">+{recipe.ingredients.length - 4} more</span>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-1 mt-3 pt-2 border-t border-slate-100">
                <div className="flex flex-wrap gap-1">
                  {recipe.tags.map((tag, i) => (
                    <span key={i} className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                      <Tag className="w-2.5 h-2.5" /> {tag}
                    </span>
                  ))}
                </div>

                {(() => {
                  const inStock = recipe.ingredients.filter(ing =>
                    fridgeItems.some(f => f.name.toLowerCase().includes(ing.toLowerCase()) || ing.toLowerCase().includes(f.name.toLowerCase()))
                  ).length;
                  const isAll = inStock === recipe.ingredients.length;
                  return (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      isAll ? 'bg-emerald-100 text-emerald-800' : inStock > 0 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {isAll ? 'In Fridge ✅' : `${inStock}/${recipe.ingredients.length} Stocked`}
                    </span>
                  );
                })()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Meal Modal */}
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
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Category</label>
                  <select
                    value={recipeCategory}
                    onChange={(e) => setRecipeCategory(e.target.value as any)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Indonesian">Indonesian</option>
                    <option value="Western">Western</option>
                    <option value="Quick & Easy">Quick & Easy</option>
                    <option value="Healthy">Healthy</option>
                    <option value="Batch Cook">Batch Cook</option>
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
                <label className="text-xs font-semibold text-slate-700 block mb-1">Ingredients (comma separated)</label>
                <textarea
                  rows={2}
                  value={recipeIngredients}
                  onChange={(e) => setRecipeIngredients(e.target.value)}
                  placeholder="Ayam, Kecap manis, Bawang putih, Cabe rawit"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500"
                />
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
