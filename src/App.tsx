import React from 'react';
import { HouseholdProvider, useHousehold } from './context/HouseholdContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { MealPlannerView } from './components/MealPlannerView';
import { FridgeView } from './components/FridgeView';
import { ArtTasksView } from './components/ArtTasksView';
import { BillsView } from './components/BillsView';
import { ShoppingView } from './components/ShoppingView';
import { ApartmentInfoView } from './components/ApartmentInfoView';
import { RenovationView } from './components/RenovationView';

const MainContent: React.FC = () => {
  const { activeTab } = useHousehold();

  return (
    <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
      {activeTab === 'dashboard' && <DashboardView />}
      {activeTab === 'meals' && <MealPlannerView />}
      {activeTab === 'fridge' && <FridgeView />}
      {activeTab === 'art' && <ArtTasksView />}
      {activeTab === 'bills' && <BillsView />}
      {activeTab === 'shopping' && <ShoppingView />}
      {activeTab === 'apt' && <ApartmentInfoView />}
      {activeTab === 'renovation' && <RenovationView />}
    </main>
  );
};

export function App() {
  return (
    <HouseholdProvider>
      <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 text-slate-800">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Header />
          <MainContent />
        </div>
      </div>
    </HouseholdProvider>
  );
}

export default App;
