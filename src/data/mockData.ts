import { ArtTask, BillItem, MealPlanItem, Recipe, RenovationItem, ShoppingItem, ApartmentInfo, FridgeItem } from '../types';

export const initialMealPlan: MealPlanItem[] = [
  { id: 'm1', day: 'Monday', mealType: 'breakfast', title: 'Oatmeal & Fresh Berries', notes: 'Quick prep' },
  { id: 'm2', day: 'Monday', mealType: 'lunch', title: 'Ayam Goreng Lengkuas + Sayur Asem' },
  { id: 'm3', day: 'Monday', mealType: 'dinner', title: 'Tumis Buncis Tempe + Telur Dadar' },
  { id: 'm4', day: 'Tuesday', mealType: 'breakfast', title: 'Roti Bakar Kaya + Soft Boiled Eggs' },
  { id: 'm5', day: 'Tuesday', mealType: 'lunch', title: 'Salmon Teriyaki Bowl' },
  { id: 'm6', day: 'Tuesday', mealType: 'dinner', title: 'Sup Jamur Wortel + Tahu Crispy' },
  { id: 'm7', day: 'Wednesday', mealType: 'breakfast', title: 'Greek Yogurt + Chia Seeds + Madu' },
  { id: 'm8', day: 'Wednesday', mealType: 'lunch', title: 'Nasi Gila Homemade' },
  { id: 'm9', day: 'Wednesday', mealType: 'dinner', title: 'Capcay Kuah Bakso' },
  { id: 'm10', day: 'Thursday', mealType: 'breakfast', title: 'Smoothie Bowl (Banana & Spinach)' },
  { id: 'm11', day: 'Thursday', mealType: 'lunch', title: 'Soto Ayam Lamongan' },
  { id: 'm12', day: 'Thursday', mealType: 'dinner', title: 'Pasta Aglio Olio Smoked Beef' },
  { id: 'm13', day: 'Friday', mealType: 'breakfast', title: 'Pancakes with Maple Syrup' },
  { id: 'm14', day: 'Friday', mealType: 'lunch', title: 'Dori Sambal Matah + Nasi Merah' },
  { id: 'm15', day: 'Friday', mealType: 'dinner', title: 'Takeout / Date Night 🍕' },
  { id: 'm16', day: 'Saturday', mealType: 'breakfast', title: 'Bubur Ayam Kuning' },
  { id: 'm17', day: 'Saturday', mealType: 'lunch', title: 'Meal Prep Batch / Leftovers' },
  { id: 'm18', day: 'Saturday', mealType: 'dinner', title: 'Steak & Roasted Veggies' },
  { id: 'm19', day: 'Sunday', mealType: 'breakfast', title: 'French Toast + Coffee' },
  { id: 'm20', day: 'Sunday', mealType: 'lunch', title: 'Family Lunch' },
  { id: 'm21', day: 'Sunday', mealType: 'dinner', title: 'Light Salad with Grilled Chicken' },
];

export const initialRecipes: Recipe[] = [
  {
    id: 'r1',
    title: 'Ayam Goreng Lengkuas',
    category: 'Indonesian',
    cookTimeMins: 45,
    ingredients: ['Ayam', 'Lengkuas', 'Bawang merah', 'Bawang putih', 'Kunyit', 'Ketumbar', 'Daun salam'],
    tags: ['High Protein', 'Batch Cook', 'Family Favorite']
  },
  {
    id: 'r2',
    title: 'Salmon Teriyaki Bowl',
    category: 'Quick & Easy',
    cookTimeMins: 20,
    ingredients: ['Salmon', 'Saus Teriyaki', 'Brokoli', 'Beras', 'Wijen'],
    tags: ['Quick < 20 mins', 'Healthy', 'Omega-3']
  },
  {
    id: 'r3',
    title: 'Capcay Kuah Bakso',
    category: 'Healthy',
    cookTimeMins: 25,
    ingredients: ['Wortel', 'Kembang kol', 'Sawi putih', 'Bakso sapi', 'Bawang putih', 'Minyak wijen'],
    tags: ['Veggies', 'Comfort Food']
  }
];

export const initialFridgeItems: FridgeItem[] = [
  // Protein
  { id: 'f1', name: 'Telur Ayam Omega', category: 'Protein', quantity: 10, unit: 'pcs / butir', notes: 'Superindo pack' },
  { id: 'f2', name: 'Ayam Dada Fillet', category: 'Protein', quantity: 500, unit: 'gram', notes: 'Freezer pack' },
  { id: 'f3', name: 'Salmon Fillet Fresh', category: 'Protein', quantity: 300, unit: 'gram', notes: 'Wild caught' },
  { id: 'f4', name: 'Daging Sapi Giling', category: 'Protein', quantity: 0, unit: 'pack', notes: 'Finished / Need for pasta' },
  { id: 'f5', name: 'Tahu & Tempe Sutra', category: 'Protein', quantity: 2, unit: 'pack' },

  // Carbs
  { id: 'f6', name: 'Beras Pandan Wangi', category: 'Carbs', quantity: 5, unit: 'kg' },
  { id: 'f7', name: 'Roti Tawar Gandum', category: 'Carbs', quantity: 1, unit: 'pack' },
  { id: 'f8', name: 'Pasta Spaghetti Barilla', category: 'Carbs', quantity: 2, unit: 'box' },
  { id: 'f9', name: 'Rolled Oats Quaker', category: 'Carbs', quantity: 800, unit: 'gram' },

  // Greens
  { id: 'f10', name: 'Brokoli Hijau Segar', category: 'Greens', quantity: 1, unit: 'bonggol' },
  { id: 'f11', name: 'Wortel Brastagi', category: 'Greens', quantity: 3, unit: 'pcs / butir' },
  { id: 'f12', name: 'Bayam Jepang (Horenso)', category: 'Greens', quantity: 1, unit: 'ikat' },

  // Dairy
  { id: 'f13', name: 'Susu UHT Full Cream', category: 'Dairy', quantity: 1, unit: 'liter' },
  { id: 'f14', name: 'Keju Cheddar Kraft', category: 'Dairy', quantity: 0, unit: 'pack', notes: 'Need more for breakfast' },
  { id: 'f15', name: 'Greek Yogurt Plain', category: 'Dairy', quantity: 500, unit: 'gram' },

  // Condiments & Seasonings
  { id: 'f16', name: 'Bawang Merah & Putih', category: 'Condiments & Seasonings', quantity: 250, unit: 'gram' },
  { id: 'f17', name: 'Minyak Goreng 2L', category: 'Condiments & Seasonings', quantity: 2, unit: 'liter' },
  { id: 'f18', name: 'Saus Teriyaki Kikkoman', category: 'Condiments & Seasonings', quantity: 1, unit: 'bottle' },

  // Fruits & Others
  { id: 'f19', name: 'Pisang Cavendish', category: 'Fruits & Others', quantity: 1, unit: 'pack' },
  { id: 'f20', name: 'Apel Fuji', category: 'Fruits & Others', quantity: 4, unit: 'pcs / butir' }
];

export const initialArtTasks: ArtTask[] = [
  {
    id: 't1',
    title: 'Change bed sheets & pillow covers (Ganti Sprei & Sarung Bantal)',
    room: 'Master Bedroom',
    frequencyDays: 14,
    lastDoneDate: '2026-10-10',
    assignedTo: 'ART / Helper',
    notes: 'Use the linen spray in top cabinet'
  },
  {
    id: 't2',
    title: 'Wash & replace bath towels (Ganti Handuk Mandi)',
    room: 'Bathroom',
    frequencyDays: 5,
    lastDoneDate: '2026-10-19',
    assignedTo: 'ART / Helper',
    notes: 'Hot water cycle in washing machine'
  },
  {
    id: 't3',
    title: 'Deep clean refrigerator & discard expired items',
    room: 'Kitchen',
    frequencyDays: 30,
    lastDoneDate: '2026-09-25',
    assignedTo: 'Self / Partner',
    notes: 'Wipe all glass shelves with vinegar solution'
  },
  {
    id: 't4',
    title: 'Clean AC Filters (Cuci Filter AC)',
    room: 'Master Bedroom & Living Room',
    frequencyDays: 60,
    lastDoneDate: '2026-08-30',
    assignedTo: 'Deep Clean',
    notes: 'Rinse dust gently in bathroom, let dry fully before re-installing'
  },
  {
    id: 't5',
    title: 'Descale electric kettle & water dispenser nozzles',
    room: 'Kitchen',
    frequencyDays: 30,
    lastDoneDate: '2026-10-01',
    assignedTo: 'ART / Helper',
    notes: 'Boil with citric acid (asam sitrun)'
  },
  {
    id: 't6',
    title: 'Sweep and mop balcony tiles',
    room: 'Balcony',
    frequencyDays: 7,
    lastDoneDate: '2026-10-18',
    assignedTo: 'ART / Helper',
    notes: 'Check drain hole is free from plant leaves'
  },
  {
    id: 't7',
    title: 'Washing machine drum self-clean cycle',
    room: 'Service Area',
    frequencyDays: 30,
    lastDoneDate: '2026-09-20',
    assignedTo: 'Self / Partner',
    notes: 'Use Tub Clean mode + washing machine cleaning powder'
  }
];

export const initialBills: BillItem[] = [
  {
    id: 'b1',
    title: 'Apartment IPL / Maintenance & Sinking Fund',
    category: 'IPL / Maintenance',
    amount: 1850000,
    dueDayOfMonth: 20,
    isPaid: true,
    autoDebit: false,
    notes: 'Pay via BCA Virtual Account in Building Tenant App'
  },
  {
    id: 'b2',
    title: 'PLN Electricity Token / Bill',
    category: 'Utilities (PLN / PAM)',
    amount: 1200000,
    dueDayOfMonth: 15,
    isPaid: true,
    autoDebit: false,
    notes: 'Check meter on 1st of month. Top up when < 100 kWh'
  },
  {
    id: 'b3',
    title: 'Indihome / First Media Internet (100 Mbps)',
    category: 'Internet',
    amount: 485000,
    dueDayOfMonth: 20,
    isPaid: false,
    autoDebit: true,
    notes: 'Autodebit via Credit Card'
  },
  {
    id: 'b4',
    title: 'PAM Water Utility Bill',
    category: 'Utilities (PLN / PAM)',
    amount: 180000,
    dueDayOfMonth: 25,
    isPaid: false,
    autoDebit: false,
    notes: 'Billed together with apartment maintenance'
  },
  {
    id: 'b5',
    title: 'Netflix & Spotify Family Bundle',
    category: 'Subscription',
    amount: 275000,
    dueDayOfMonth: 28,
    isPaid: false,
    autoDebit: true,
    notes: 'Shared with household members'
  }
];

export const initialShoppingItems: ShoppingItem[] = [
  { id: 's1', title: 'Telur Ayam Kampung 1 Pack', category: 'Groceries', quantity: '10 pcs', isCompleted: false, urgency: 'urgent', store: 'Supermarket' },
  { id: 's2', title: 'Susu UHT Full Cream', category: 'Groceries', quantity: '2 liters', isCompleted: false, urgency: 'routine', store: 'Indomaret' },
  { id: 's3', title: 'Detergent Cair + Pewangi Pakaian', category: 'Household', quantity: '1 refill pouch', isCompleted: false, urgency: 'urgent', store: 'Supermarket' },
  { id: 's4', title: 'Galon Air Aqua', category: 'Pantry Staples', quantity: '2 galon', isCompleted: false, urgency: 'urgent', store: 'Apt Depot' },
  { id: 's5', title: 'Trash Bags 45x50cm Hitam', category: 'Household', quantity: '1 roll (30 pcs)', isCompleted: true, urgency: 'routine', store: 'Tokopedia' },
  { id: 's6', title: 'Beras Pandan Wangi 5kg', category: 'Pantry Staples', quantity: '1 sack', isCompleted: true, urgency: 'routine', store: 'Supermarket' },
  { id: 's7', title: 'Curtain Rod Hooks & Brackets', category: 'Hardware / Reno', quantity: '4 sets', isCompleted: false, urgency: 'routine', store: 'Ace Hardware' },
];

export const initialRenovationItems: RenovationItem[] = [
  {
    id: 'rn1',
    room: 'Kitchen',
    title: 'Install Under-Cabinet Warm LED Strip Lighting',
    status: 'In Progress',
    budget: 650000,
    actualCost: 520000,
    contractorOrStore: 'Tokopedia & Self-Install',
    notes: 'Purchased 5m COB warm white strip + 12V adapter with sensor switch'
  },
  {
    id: 'rn2',
    room: 'Master Bedroom',
    title: 'Custom Built-in Wardrobe & Vanity Nook',
    status: 'Sourcing',
    budget: 14000000,
    actualCost: 0,
    contractorOrStore: 'Vendor Interior Kencana',
    notes: 'Awaiting 3D render revision and final finish sample (HPL Natural Teak)'
  },
  {
    id: 'rn3',
    room: 'Living Room',
    title: 'Acoustic Slat Wall Panelling behind TV console',
    status: 'Idea',
    budget: 3500000,
    actualCost: 0,
    contractorOrStore: 'TBD',
    notes: 'Measures: 2.8m width x 2.6m height'
  },
  {
    id: 'rn4',
    room: 'Balcony',
    title: 'Artificial Grass Turf & Teak Decking Tiles',
    status: 'Completed',
    budget: 1800000,
    actualCost: 1650000,
    contractorOrStore: 'IKEA Runnen + Tokopedia grass',
    notes: 'Finished. Easy to lift and hose down during rain'
  }
];

export const initialApartmentInfo: ApartmentInfo = {
  unitNumber: 'Tower 2 - Unit 18B',
  tower: 'Tower B (Emerald)',
  parkingSpot: 'Basement 2, Lot #142',
  wifiSSID: 'CozyHaven_5G',
  wifiPassword: 'RumahKeren2026!',
  accessCode: '*1942# (Main Door Smart Lock)',
  managementPhone: '+62 21 555-0199',
  securityPhone: '+62 21 555-0190 (Ext. 001)',
  engineeringPhone: '+62 21 555-0194 (Ext. 005)',
  trashSchedule: 'Daily 07:00 - 09:00 & 19:00 - 21:00 (Rubbish chute on Floor 18 near service lift)',
  waterShutoffLocation: 'Inside service cabinet beside the washing machine drain pipe. Turn lever 90 degrees clockwise.',
  breakerNotes: 'Breaker 1: AC Living Room | Breaker 2: AC Bedrooms | Breaker 3: Kitchen Stove & Oven | Breaker 4: General Outlets',
  quickNotes: [
    'Lobby package courier storage holds parcels up to 3 days.',
    'Gym & Pool open 06:00 - 21:00 on 5th floor podium.',
    'Quiet hours start at 22:00.'
  ]
};
