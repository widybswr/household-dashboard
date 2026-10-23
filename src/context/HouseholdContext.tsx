import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  TabType, 
  MealPlanItem, 
  Recipe, 
  ArtTask, 
  BillItem, 
  ShoppingItem, 
  RenovationItem, 
  ApartmentInfo,
  FridgeItem
} from '../types';
import { 
  initialMealPlan, 
  initialRecipes, 
  initialFridgeItems,
  initialArtTasks, 
  initialBills, 
  initialShoppingItems, 
  initialRenovationItems, 
  initialApartmentInfo 
} from '../data/mockData';

interface HouseholdContextType {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  helperMode: boolean;
  setHelperMode: (mode: boolean) => void;
  
  // Meals
  mealPlan: MealPlanItem[];
  recipes: Recipe[];
  updateMeal: (id: string, title: string, notes?: string) => void;
  addRecipe: (recipe: Omit<Recipe, 'id'>) => void;
  updateRecipe: (id: string, updates: Partial<Recipe>) => void;
  deleteRecipe: (id: string) => void;
  assignRecipeToMeal: (recipeTitle: string, day: MealPlanItem['day'], mealType: MealPlanItem['mealType']) => void;

  // Fridge
  fridgeItems: FridgeItem[];
  addFridgeItem: (item: Omit<FridgeItem, 'id'>) => void;
  updateFridgeItem: (id: string, updates: Partial<FridgeItem>) => void;
  toggleItemAvailability: (id: string) => void;
  updateItemNote: (id: string, note: string) => void;
  deleteFridgeItem: (id: string) => void;
  sendFridgeItemToShopping: (item: FridgeItem) => void;

  // ART Tasks
  artTasks: ArtTask[];
  completeArtTask: (id: string) => void;
  addArtTask: (task: Omit<ArtTask, 'id' | 'lastDoneDate'>) => void;
  deleteArtTask: (id: string) => void;

  // Bills
  bills: BillItem[];
  toggleBillPaid: (id: string) => void;
  addBill: (bill: Omit<BillItem, 'id' | 'isPaid'>) => void;

  // Shopping
  shoppingItems: ShoppingItem[];
  toggleShoppingItem: (id: string) => void;
  addShoppingItem: (item: Omit<ShoppingItem, 'id' | 'isCompleted'>) => void;
  deleteShoppingItem: (id: string) => void;
  clearCompletedShopping: () => void;

  // Renovation
  renovations: RenovationItem[];
  updateRenoStatus: (id: string, status: RenovationItem['status']) => void;
  addRenoItem: (item: Omit<RenovationItem, 'id'>) => void;

  // Apartment Info
  aptInfo: ApartmentInfo;
  updateAptInfo: (info: ApartmentInfo) => void;
}

const HouseholdContext = createContext<HouseholdContextType | undefined>(undefined);

export const HouseholdProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [helperMode, setHelperMode] = useState<boolean>(false);

  // Load from localStorage or mock
  const [mealPlan, setMealPlan] = useState<MealPlanItem[]>(() => {
    const saved = localStorage.getItem('home_mealPlan');
    return saved ? JSON.parse(saved) : initialMealPlan;
  });

  const [recipes, setRecipes] = useState<Recipe[]>(() => {
    const version = localStorage.getItem('home_recipes_v2');
    if (!version) {
      localStorage.setItem('home_recipes_v2', 'active');
      localStorage.setItem('home_recipes', JSON.stringify(initialRecipes));
      return initialRecipes;
    }
    const saved = localStorage.getItem('home_recipes');
    return saved ? JSON.parse(saved) : initialRecipes;
  });

  const [fridgeItems, setFridgeItems] = useState<FridgeItem[]>(() => {
    const version = localStorage.getItem('home_fridge_version_v4');
    if (!version) {
      localStorage.setItem('home_fridge_version_v4', 'active');
      localStorage.setItem('home_fridge', JSON.stringify(initialFridgeItems));
      return initialFridgeItems;
    }
    const saved = localStorage.getItem('home_fridge');
    return saved ? JSON.parse(saved) : initialFridgeItems;
  });

  const [artTasks, setArtTasks] = useState<ArtTask[]>(() => {
    const saved = localStorage.getItem('home_artTasks');
    return saved ? JSON.parse(saved) : initialArtTasks;
  });

  const [bills, setBills] = useState<BillItem[]>(() => {
    const saved = localStorage.getItem('home_bills');
    return saved ? JSON.parse(saved) : initialBills;
  });

  const [shoppingItems, setShoppingItems] = useState<ShoppingItem[]>(() => {
    const saved = localStorage.getItem('home_shopping');
    return saved ? JSON.parse(saved) : initialShoppingItems;
  });

  const [renovations, setRenovations] = useState<RenovationItem[]>(() => {
    const saved = localStorage.getItem('home_renovations');
    return saved ? JSON.parse(saved) : initialRenovationItems;
  });

  const [aptInfo, setAptInfo] = useState<ApartmentInfo>(() => {
    const saved = localStorage.getItem('home_aptInfo');
    return saved ? JSON.parse(saved) : initialApartmentInfo;
  });

  // Sync to local storage
  useEffect(() => { localStorage.setItem('home_mealPlan', JSON.stringify(mealPlan)); }, [mealPlan]);
  useEffect(() => { localStorage.setItem('home_recipes', JSON.stringify(recipes)); }, [recipes]);
  useEffect(() => { localStorage.setItem('home_fridge', JSON.stringify(fridgeItems)); }, [fridgeItems]);
  useEffect(() => { localStorage.setItem('home_artTasks', JSON.stringify(artTasks)); }, [artTasks]);
  useEffect(() => { localStorage.setItem('home_bills', JSON.stringify(bills)); }, [bills]);
  useEffect(() => { localStorage.setItem('home_shopping', JSON.stringify(shoppingItems)); }, [shoppingItems]);
  useEffect(() => { localStorage.setItem('home_renovations', JSON.stringify(renovations)); }, [renovations]);
  useEffect(() => { localStorage.setItem('home_aptInfo', JSON.stringify(aptInfo)); }, [aptInfo]);

  // Meals Actions
  const updateMeal = (id: string, title: string, notes?: string) => {
    setMealPlan(prev => prev.map(m => m.id === id ? { ...m, title, notes } : m));
  };

  const addRecipe = (recipe: Omit<Recipe, 'id'>) => {
    const newRecipe: Recipe = { ...recipe, id: 'r_' + Date.now() };
    setRecipes(prev => [newRecipe, ...prev]);
  };

  const updateRecipe = (id: string, updates: Partial<Recipe>) => {
    setRecipes(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  const deleteRecipe = (id: string) => {
    setRecipes(prev => prev.filter(r => r.id !== id));
  };

  const assignRecipeToMeal = (recipeTitle: string, day: MealPlanItem['day'], mealType: MealPlanItem['mealType']) => {
    setMealPlan(prev => prev.map(m => {
      if (m.day === day && m.mealType === mealType) {
        return { ...m, title: recipeTitle };
      }
      return m;
    }));
  };

  // Fridge Actions
  const addFridgeItem = (item: Omit<FridgeItem, 'id'>) => {
    const newItem: FridgeItem = {
      ...item,
      id: 'f_' + Date.now()
    };
    setFridgeItems(prev => [newItem, ...prev]);
  };

  const updateFridgeItem = (id: string, updates: Partial<FridgeItem>) => {
    setFridgeItems(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const toggleItemAvailability = (id: string) => {
    setFridgeItems(prev => prev.map(f => f.id === id ? { ...f, isAvailable: !f.isAvailable } : f));
  };

  const updateItemNote = (id: string, note: string) => {
    setFridgeItems(prev => prev.map(f => f.id === id ? { ...f, note } : f));
  };

  const deleteFridgeItem = (id: string) => {
    setFridgeItems(prev => prev.filter(f => f.id !== id));
  };

  const sendFridgeItemToShopping = (item: FridgeItem) => {
    const cat = item.category === 'Greens' || item.category === 'Protein' || item.category === 'Dairy' || item.category === 'Fruits & Others' 
      ? 'Groceries' 
      : 'Pantry Staples';
    
    addShoppingItem({
      title: item.name,
      category: cat,
      quantity: item.note || '1 pack',
      urgency: 'routine'
    });
  };

  // ART Tasks Actions
  const completeArtTask = (id: string) => {
    const today = new Date().toISOString().split('T')[0];
    setArtTasks(prev => prev.map(t => t.id === id ? { ...t, lastDoneDate: today } : t));
  };

  const addArtTask = (task: Omit<ArtTask, 'id' | 'lastDoneDate'>) => {
    const newTask: ArtTask = {
      ...task,
      id: 't_' + Date.now(),
      lastDoneDate: new Date().toISOString().split('T')[0]
    };
    setArtTasks(prev => [...prev, newTask]);
  };

  const deleteArtTask = (id: string) => {
    setArtTasks(prev => prev.filter(t => t.id !== id));
  };

  // Bills Actions
  const toggleBillPaid = (id: string) => {
    setBills(prev => prev.map(b => b.id === id ? { ...b, isPaid: !b.isPaid } : b));
  };

  const addBill = (bill: Omit<BillItem, 'id' | 'isPaid'>) => {
    const newBill: BillItem = {
      ...bill,
      id: 'b_' + Date.now(),
      isPaid: false
    };
    setBills(prev => [...prev, newBill]);
  };

  // Shopping Actions
  const toggleShoppingItem = (id: string) => {
    setShoppingItems(prev => prev.map(s => s.id === id ? { ...s, isCompleted: !s.isCompleted } : s));
  };

  const addShoppingItem = (item: Omit<ShoppingItem, 'id' | 'isCompleted'>) => {
    const newItem: ShoppingItem = {
      ...item,
      id: 's_' + Date.now(),
      isCompleted: false
    };
    setShoppingItems(prev => [newItem, ...prev]);
  };

  const deleteShoppingItem = (id: string) => {
    setShoppingItems(prev => prev.filter(s => s.id !== id));
  };

  const clearCompletedShopping = () => {
    setShoppingItems(prev => prev.filter(s => !s.isCompleted));
  };

  // Renovation Actions
  const updateRenoStatus = (id: string, status: RenovationItem['status']) => {
    setRenovations(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  const addRenoItem = (item: Omit<RenovationItem, 'id'>) => {
    const newItem: RenovationItem = {
      ...item,
      id: 'rn_' + Date.now()
    };
    setRenovations(prev => [...prev, newItem]);
  };

  // Apartment Info
  const updateAptInfo = (info: ApartmentInfo) => {
    setAptInfo(info);
  };

  return (
    <HouseholdContext.Provider
      value={{
        activeTab,
        setActiveTab,
        helperMode,
        setHelperMode,
        mealPlan,
        recipes,
        updateMeal,
        addRecipe,
        updateRecipe,
        deleteRecipe,
        assignRecipeToMeal,
        fridgeItems,
        addFridgeItem,
        updateFridgeItem,
        toggleItemAvailability,
        updateItemNote,
        deleteFridgeItem,
        sendFridgeItemToShopping,
        artTasks,
        completeArtTask,
        addArtTask,
        deleteArtTask,
        bills,
        toggleBillPaid,
        addBill,
        shoppingItems,
        toggleShoppingItem,
        addShoppingItem,
        deleteShoppingItem,
        clearCompletedShopping,
        renovations,
        updateRenoStatus,
        addRenoItem,
        aptInfo,
        updateAptInfo
      }}
    >
      {children}
    </HouseholdContext.Provider>
  );
};

export const useHousehold = () => {
  const context = useContext(HouseholdContext);
  if (!context) {
    throw new Error('useHousehold must be used within a HouseholdProvider');
  }
  return context;
};
