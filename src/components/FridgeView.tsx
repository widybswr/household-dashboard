import React, { useState } from 'react';
import { useHousehold } from '../context/HouseholdContext';
import { FridgeItem, MealPlanItem } from '../types';
import { 
  Sparkles, 
  Plus, 
  Trash2, 
  AlertTriangle, 
  CheckCircle2, 
  ShoppingCart, 
  Clock, 
  X, 
  Package, 
  ArrowRight 
} from 'lucide-react';

export const FridgeView: React.FC = () => {
  const { 
    fridgeItems, 
    recipes, 
    addFridgeItem, 
    deleteFridgeItem, 
    sendFridgeItemToShopping,
    assignRecipeToMeal,
    addShoppingItem,
    setActiveTab
  } = useHousehold();

  const [activeZone, setActiveZone] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [assignedSuccess, setAssignedSuccess] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [zone, setZone] = useState<FridgeItem['zone']>('Fridge');
  const [category, setCategory] = useState<FridgeItem['category']>('Produce & Veggies');
  const [quantity, setQuantity] = useState('1 pack');
  const [expiryDate, setExpiryDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 5);
    return d.toISOString().split('T')[0];
  });
  const [notes, setNotes] = useState('');

  const today = new Date();

  // Helper function to calculate expiry days
  const getExpiryInfo = (expiryStr: string) => {
    const exp = new Date(expiryStr);
    const diffDays = Math.ceil((exp.getTime() - today.getTime()) / (1000 * 3600 * 24));
    return {
      diffDays,
      isExpired: diffDays < 0,
      isExpiringSoon: diffDays >= 0 && diffDays <= 3,
      isFresh: diffDays > 3
    };
  };

  // Filter items by zone
  const filteredItems = fridgeItems.filter(item => {
    if (activeZone !== 'All' && item.zone !== activeZone) return false;
    return true;
  });

  const expiringSoonItems = fridgeItems.filter(item => {
    const { isExpired, isExpiringSoon } = getExpiryInfo(item.expiryDate);
    return isExpired || isExpiringSoon;
  });

  // SMART MEAL MATCHING ENGINE
  // Match recipe ingredients against fridgeItems
  const recipeMatches = recipes.map(recipe => {
    let matchedIngredients: string[] = [];
    let missingIngredients: string[] = [];
    let usesExpiringItem = false;

    recipe.ingredients.forEach(ingredient => {
      const ingLower = ingredient.toLowerCase();
      // Check if any fridge item name matches or contains the ingredient keyword
      const matchedItem = fridgeItems.find(f => {
        const fName = f.name.toLowerCase();
        return fName.includes(ingLower) || ingLower.includes(fName) ||
          fName.split(' ').some(w => w.length > 2 && ingLower.includes(w)) ||
          ingLower.split(' ').some(w => w.length > 2 && fName.includes(w));
      });

      if (matchedItem) {
        matchedIngredients.push(ingredient);
        const { isExpired, isExpiringSoon } = getExpiryInfo(matchedItem.expiryDate);
        if (isExpired || isExpiringSoon) {
          usesExpiringItem = true;
        }
      } else {
        missingIngredients.push(ingredient);
      }
    });

    const matchPercent = Math.round((matchedIngredients.length / (recipe.ingredients.length || 1)) * 100);

    return {
      recipe,
      matchedIngredients,
      missingIngredients,
      matchPercent,
      usesExpiringItem
    };
  }).sort((a, b) => {
    // Sort by: uses expiring items first, then by highest match percentage
    if (a.usesExpiringItem && !b.usesExpiringItem) return -1;
    if (!a.usesExpiringItem && b.usesExpiringItem) return 1;
    return b.matchPercent - a.matchPercent;
  });

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addFridgeItem({
      name: name.trim(),
      zone,
      category,
      quantity: quantity.trim() || '1 item',
      expiryDate,
      notes: notes.trim() || undefined
    });

    setName('');
    setNotes('');
    setShowAddModal(false);
  };

  const handleQuickPlan = (recipeTitle: string, mealType: MealPlanItem['mealType']) => {
    // Determine target day (Today's day of week)
    const days: MealPlanItem['day'][] = [
      'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
    ];
    const todayName = days[new Date().getDay()];

    assignRecipeToMeal(recipeTitle, todayName, mealType);
    setAssignedSuccess(`Scheduled "${recipeTitle}" for Today's ${mealType.toUpperCase()}!`);
    setTimeout(() => setAssignedSuccess(null), 3000);
  };

  const handleAddMissingToShopping = (ingredientName: string) => {
    addShoppingItem({
      title: ingredientName,
      category: 'Groceries',
      quantity: '1 pack',
      urgency: 'routine'
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Stats */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-slate-800 text-lg">Fridge, Freezer & Pantry Stock</h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Tracks ingredient shelf life and powers smart, zero-waste meal suggestions.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm self-start md:self-auto"
          >
            <Plus className="w-4 h-4" /> Add Food Item
          </button>
        </div>

        {/* Expiring Soon Alert Banner */}
        {expiringSoonItems.length > 0 && (
          <div className="mt-4 p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <span className="font-bold">{expiringSoonItems.length} items expiring soon:</span>{' '}
                <span className="text-amber-800 font-medium">
                  {expiringSoonItems.map(i => i.name).join(', ')}
                </span>
              </div>
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-200/60 px-2 py-0.5 rounded shrink-0">
              Check smart matches below
            </span>
          </div>
        )}

        {assignedSuccess && (
          <div className="mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{assignedSuccess}</span>
          </div>
        )}
      </div>

      {/* SMART MEAL PLANNING ENGINE SECTION */}
      <div className="bg-gradient-to-br from-emerald-50/60 via-teal-50/40 to-slate-50 p-6 rounded-2xl border border-emerald-200/80 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-emerald-200/60 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-base">Smart Meal Planner: What Can I Cook?</h4>
              <p className="text-xs text-slate-500">Auto-matched from your active fridge stocks and recipe box</p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('meals')}
            className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1"
          >
            View Weekly Planner <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recipeMatches.slice(0, 3).map(({ recipe, matchedIngredients, missingIngredients, matchPercent, usesExpiringItem }) => (
            <div 
              key={recipe.id}
              className={`p-4 rounded-xl border transition flex flex-col justify-between ${
                usesExpiringItem 
                  ? 'bg-white border-amber-300 shadow-sm ring-1 ring-amber-300/40' 
                  : 'bg-white border-slate-200 hover:shadow-sm'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    matchPercent === 100 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : matchPercent >= 60 
                      ? 'bg-amber-100 text-amber-800' 
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {matchPercent}% Ingredients Ready
                  </span>

                  {usesExpiringItem && (
                    <span className="text-[10px] font-bold bg-amber-500 text-white px-2 py-0.5 rounded-full flex items-center gap-0.5">
                      🔥 Use it up!
                    </span>
                  )}
                </div>

                <h5 className="font-bold text-slate-900 text-sm">{recipe.title}</h5>
                <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {recipe.cookTimeMins} mins • {recipe.category}
                </p>

                {/* Available in fridge */}
                <div className="mt-3">
                  <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">In Stock ({matchedIngredients.length}):</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {matchedIngredients.map((ing, i) => (
                      <span key={i} className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.5 rounded">
                        ✓ {ing}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Missing */}
                {missingIngredients.length > 0 && (
                  <div className="mt-2.5">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Missing ({missingIngredients.length}):</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {missingIngredients.map((ing, i) => (
                        <button
                          key={i}
                          onClick={() => handleAddMissingToShopping(ing)}
                          className="text-[10px] bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-700 border border-slate-200 hover:border-rose-200 px-1.5 py-0.5 rounded flex items-center gap-1 transition"
                          title="Click to add to shopping list"
                        >
                          + {ing}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action: Quick Schedule */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <span className="text-[11px] text-slate-400 font-medium">Quick Plan:</span>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => handleQuickPlan(recipe.title, 'lunch')}
                    className="px-2.5 py-1 text-[11px] font-semibold bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-800 rounded-lg transition"
                  >
                    Lunch
                  </button>
                  <button
                    onClick={() => handleQuickPlan(recipe.title, 'dinner')}
                    className="px-2.5 py-1 text-[11px] font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition shadow-sm"
                  >
                    Dinner
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* STORAGE INVENTORY LIST */}
      <div>
        {/* Zone Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {['All', 'Fridge', 'Freezer', 'Pantry'].map(zoneKey => {
            const count = zoneKey === 'All' 
              ? fridgeItems.length 
              : fridgeItems.filter(f => f.zone === zoneKey).length;

            return (
              <button
                key={zoneKey}
                onClick={() => setActiveZone(zoneKey)}
                className={`text-xs px-4 py-2 rounded-xl font-medium transition whitespace-nowrap flex items-center gap-1.5 ${
                  activeZone === zoneKey
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span>{zoneKey === 'Fridge' ? '🧊 Fridge' : zoneKey === 'Freezer' ? '❄️ Freezer' : zoneKey === 'Pantry' ? '🥫 Pantry' : '📦 All Stocks'}</span>
                <span className={`text-[11px] px-1.5 py-0.2 rounded-full ${
                  activeZone === zoneKey ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Stock Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
          {filteredItems.map(item => {
            const { diffDays, isExpired, isExpiringSoon } = getExpiryInfo(item.expiryDate);

            return (
              <div 
                key={item.id}
                className={`p-4 rounded-2xl border transition flex flex-col justify-between bg-white ${
                  isExpired 
                    ? 'border-rose-300 ring-1 ring-rose-200' 
                    : isExpiringSoon 
                    ? 'border-amber-300' 
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                      {item.zone} • {item.category}
                    </span>

                    {/* Expiry Pill */}
                    {isExpired ? (
                      <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
                        Expired ({Math.abs(diffDays)}d ago)
                      </span>
                    ) : isExpiringSoon ? (
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                        Expires in {diffDays === 0 ? 'Today!' : diffDays === 1 ? 'Tomorrow!' : `${diffDays} days`}
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        Fresh ({diffDays}d left)
                      </span>
                    )}
                  </div>

                  <h4 className="font-bold text-slate-900 text-base">{item.name}</h4>
                  <p className="text-xs font-semibold text-slate-600 mt-0.5">{item.quantity}</p>

                  {item.notes && (
                    <p className="text-xs text-slate-400 mt-2 italic">
                      💡 {item.notes}
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => sendFridgeItemToShopping(item)}
                    className="text-xs text-slate-600 hover:text-emerald-700 font-medium flex items-center gap-1.5 transition"
                    title="Send item to grocery shopping list"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Need More</span>
                  </button>

                  <button
                    onClick={() => deleteFridgeItem(item.id)}
                    className="p-1.5 text-slate-300 hover:text-rose-500 rounded-lg transition"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleCreateItem} className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h4 className="font-bold text-slate-800">Add Food Stock</h4>
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
                  placeholder="e.g. Salmon Fillet, Telur Ayam, Susu"
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
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Produce & Veggies">Produce & Veggies</option>
                    <option value="Meat & Seafood">Meat & Seafood</option>
                    <option value="Dairy & Eggs">Dairy & Eggs</option>
                    <option value="Condiments & Sauces">Condiments & Sauces</option>
                    <option value="Pantry & Dry">Pantry & Dry</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Quantity</label>
                  <input
                    type="text"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="e.g. 500g, 2 packs"
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Best Before / Expiry</label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
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
                  placeholder="e.g. Opened 2 days ago, needs to be consumed quickly"
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
