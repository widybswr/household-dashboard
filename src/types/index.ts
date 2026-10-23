export type TabType = 
  | 'dashboard' 
  | 'meals' 
  | 'art' 
  | 'bills' 
  | 'shopping' 
  | 'apt' 
  | 'renovation';

export interface MealPlanItem {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  mealType: 'breakfast' | 'lunch' | 'dinner';
  title: string;
  recipeId?: string;
  notes?: string;
}

export interface Recipe {
  id: string;
  title: string;
  category: 'Indonesian' | 'Western' | 'Quick & Easy' | 'Healthy' | 'Batch Cook';
  cookTimeMins: number;
  ingredients: string[];
  tags: string[];
}

export interface ArtTask {
  id: string;
  title: string;
  room: string;
  frequencyDays: number; // e.g. 7 = every week, 14 = every 2 weeks
  lastDoneDate: string; // ISO date string YYYY-MM-DD
  assignedTo: 'ART / Helper' | 'Self / Partner' | 'Deep Clean';
  notes?: string;
}

export interface BillItem {
  id: string;
  title: string;
  category: 'IPL / Maintenance' | 'Utilities (PLN / PAM)' | 'Internet' | 'Subscription' | 'Rent / Mortgage';
  amount: number;
  dueDayOfMonth: number;
  isPaid: boolean;
  autoDebit: boolean;
  notes?: string;
}

export interface ShoppingItem {
  id: string;
  title: string;
  category: 'Groceries' | 'Household' | 'Pantry Staples' | 'Hardware / Reno';
  store?: string;
  quantity: string;
  isCompleted: boolean;
  urgency: 'routine' | 'urgent';
}

export interface RenovationItem {
  id: string;
  room: 'Living Room' | 'Kitchen' | 'Master Bedroom' | 'Bathroom' | 'Balcony';
  title: string;
  status: 'Idea' | 'Sourcing' | 'In Progress' | 'Completed';
  budget: number;
  actualCost: number;
  contractorOrStore?: string;
  notes?: string;
}

export interface ApartmentInfo {
  unitNumber: string;
  tower: string;
  parkingSpot: string;
  wifiSSID: string;
  wifiPassword: string;
  accessCode: string;
  managementPhone: string;
  securityPhone: string;
  engineeringPhone: string;
  trashSchedule: string;
  waterShutoffLocation: string;
  breakerNotes: string;
  quickNotes: string[];
}
