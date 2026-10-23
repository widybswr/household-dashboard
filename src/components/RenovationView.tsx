import React, { useState } from 'react';
import { useHousehold } from '../context/HouseholdContext';
import { RenovationItem } from '../types';
import { Plus, Store, X } from 'lucide-react';

export const RenovationView: React.FC = () => {
  const { renovations, updateRenoStatus, addRenoItem } = useHousehold();
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterRoom, setFilterRoom] = useState<string>('All');

  // Form state
  const [title, setTitle] = useState('');
  const [room, setRoom] = useState<RenovationItem['room']>('Kitchen');
  const [budget, setBudget] = useState(1000000);
  const [actualCost, setActualCost] = useState(0);
  const [contractor, setContractor] = useState('');
  const [notes, setNotes] = useState('');

  const rooms = ['All', 'Kitchen', 'Living Room', 'Master Bedroom', 'Bathroom', 'Balcony'];

  const filteredItems = renovations.filter(item => {
    if (filterRoom !== 'All' && item.room !== filterRoom) return false;
    return true;
  });

  const totalBudget = renovations.reduce((acc, c) => acc + c.budget, 0);
  const totalActual = renovations.reduce((acc, c) => acc + c.actualCost, 0);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addRenoItem({
      title: title.trim(),
      room,
      status: 'Idea',
      budget: Number(budget) || 0,
      actualCost: Number(actualCost) || 0,
      contractorOrStore: contractor.trim() || undefined,
      notes: notes.trim() || undefined
    });

    setTitle('');
    setNotes('');
    setShowAddModal(false);
  };

  const getStatusColor = (status: RenovationItem['status']) => {
    switch (status) {
      case 'Idea': return 'bg-slate-100 text-slate-700';
      case 'Sourcing': return 'bg-blue-100 text-blue-800';
      case 'In Progress': return 'bg-amber-100 text-amber-800';
      case 'Completed': return 'bg-emerald-100 text-emerald-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Planned Budget</p>
          <p className="text-2xl font-bold text-slate-900 mt-2">
            Rp {totalBudget.toLocaleString('id-ID')}
          </p>
          <p className="text-xs text-slate-400 mt-1">{renovations.length} projects / improvements</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200">
          <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Actual Spent To-Date</p>
          <p className="text-2xl font-bold text-emerald-600 mt-2">
            Rp {totalActual.toLocaleString('id-ID')}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            {totalActual <= totalBudget ? 'Within planned budget' : 'Over budget'}
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col justify-between">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Project Progress</p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm font-bold text-slate-800">
              {renovations.filter(r => r.status === 'Completed').length} / {renovations.length} Completed
            </span>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" /> Add Project
            </button>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden mt-3">
            <div
              className="h-full bg-emerald-500 rounded-full"
              style={{
                width: `${(renovations.filter(r => r.status === 'Completed').length / (renovations.length || 1)) * 100}%`
              }}
            />
          </div>
        </div>
      </div>

      {/* Room Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {rooms.map(r => (
          <button
            key={r}
            onClick={() => setFilterRoom(r)}
            className={`text-xs px-3.5 py-1.5 rounded-xl font-medium transition whitespace-nowrap ${
              filterRoom === r
                ? 'bg-slate-800 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.map(item => (
          <div key={item.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700">
                  {item.room}
                </span>

                <select
                  value={item.status}
                  onChange={(e) => updateRenoStatus(item.id, e.target.value as any)}
                  className={`text-xs font-bold px-2.5 py-1 rounded-lg border-0 cursor-pointer ${getStatusColor(item.status)}`}
                >
                  <option value="Idea">Idea</option>
                  <option value="Sourcing">Sourcing</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <h4 className="font-bold text-slate-900 text-base">{item.title}</h4>

              {item.notes && (
                <p className="text-xs text-slate-500 mt-2 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  {item.notes}
                </p>
              )}

              {item.contractorOrStore && (
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-3">
                  <Store className="w-3.5 h-3.5 text-slate-400" />
                  <span>Vendor / Store: <strong>{item.contractorOrStore}</strong></span>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-400">Budget: </span>
                <span className="font-semibold text-slate-700">Rp {item.budget.toLocaleString('id-ID')}</span>
              </div>
              <div>
                <span className="text-slate-400">Actual: </span>
                <span className="font-bold text-slate-900">Rp {item.actualCost.toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleCreate} className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h4 className="font-bold text-slate-800">Add Renovation / Project</h4>
              <button type="button" onClick={() => setShowAddModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Project Name *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500"
                  placeholder="e.g. Install kitchen backsplash tiles"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Room</label>
                <select
                  value={room}
                  onChange={(e) => setRoom(e.target.value as any)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500"
                >
                  <option value="Kitchen">Kitchen</option>
                  <option value="Living Room">Living Room</option>
                  <option value="Master Bedroom">Master Bedroom</option>
                  <option value="Bathroom">Bathroom</option>
                  <option value="Balcony">Balcony</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Budget (IDR)</label>
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Actual Spend (IDR)</label>
                  <input
                    type="number"
                    value={actualCost}
                    onChange={(e) => setActualCost(Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Vendor / Contractor / Store</label>
                <input
                  type="text"
                  value={contractor}
                  onChange={(e) => setContractor(e.target.value)}
                  placeholder="e.g. Tokopedia, Mitra 10, Mandor Budi"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Notes & Dimensions</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Dimensions: 2.4m x 0.6m. Needs waterproof sealant"
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
                  Save Project
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
