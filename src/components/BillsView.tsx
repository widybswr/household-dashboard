import React, { useState } from 'react';
import { useHousehold } from '../context/HouseholdContext';
import { BillItem } from '../types';
import { CreditCard, Plus, CheckCircle2, X, HelpCircle } from 'lucide-react';

export const BillsView: React.FC = () => {
  const { bills, toggleBillPaid, addBill } = useHousehold();
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<BillItem['category']>('IPL / Maintenance');
  const [amount, setAmount] = useState(500000);
  const [dueDay, setDueDay] = useState(20);
  const [autoDebit, setAutoDebit] = useState(false);
  const [notes, setNotes] = useState('');

  // Calculations
  const totalMonthly = bills.reduce((acc, curr) => acc + curr.amount, 0);
  const totalPaid = bills.filter(b => b.isPaid).reduce((acc, curr) => acc + curr.amount, 0);
  const totalUnpaid = bills.filter(b => !b.isPaid).reduce((acc, curr) => acc + curr.amount, 0);

  const handleAddBill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addBill({
      title: title.trim(),
      category,
      amount: Number(amount) || 0,
      dueDayOfMonth: Number(dueDay) || 1,
      autoDebit,
      notes: notes.trim() || undefined
    });

    setTitle('');
    setNotes('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Monthly Commitments</p>
          <p className="text-2xl font-bold text-slate-900 mt-2">
            Rp {totalMonthly.toLocaleString('id-ID')}
          </p>
          <p className="text-xs text-slate-400 mt-1">{bills.length} active household bills</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Settled This Month</p>
          <p className="text-2xl font-bold text-emerald-600 mt-2">
            Rp {totalPaid.toLocaleString('id-ID')}
          </p>
          <p className="text-xs text-slate-400 mt-1">{bills.filter(b => b.isPaid).length} bills paid</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-rose-600 uppercase tracking-wider">Pending / Due This Month</p>
          <p className="text-2xl font-bold text-rose-600 mt-2">
            Rp {totalUnpaid.toLocaleString('id-ID')}
          </p>
          <p className="text-xs text-slate-400 mt-1">{bills.filter(b => !b.isPaid).length} bills awaiting payment</p>
        </div>
      </div>

      {/* Main Bills List */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-800">Recurring Household Bills</h3>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" /> Add Bill
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {bills.map(bill => (
            <div
              key={bill.id}
              className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition ${
                bill.isPaid ? 'bg-slate-50/40 opacity-80' : 'bg-white hover:bg-slate-50/70'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <button
                  onClick={() => toggleBillPaid(bill.id)}
                  className={`mt-0.5 w-6 h-6 rounded-lg border flex items-center justify-center transition shrink-0 ${
                    bill.isPaid
                      ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                      : 'border-slate-300 hover:border-emerald-500 text-transparent'
                  }`}
                  title="Toggle paid status"
                >
                  <CheckCircle2 className="w-4 h-4" />
                </button>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className={`font-bold text-sm ${bill.isPaid ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                      {bill.title}
                    </h4>
                    <span className="text-[11px] font-medium px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                      {bill.category}
                    </span>
                    {bill.autoDebit && (
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded border border-blue-200">
                        Autodebit
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                    <span>Due: <strong>Day {bill.dueDayOfMonth}</strong> each month</span>
                    {bill.notes && (
                      <span className="flex items-center gap-1 text-slate-400">
                        <HelpCircle className="w-3 h-3" /> {bill.notes}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pl-9 sm:pl-0">
                <span className="text-base font-bold text-slate-800">
                  Rp {bill.amount.toLocaleString('id-ID')}
                </span>

                <button
                  onClick={() => toggleBillPaid(bill.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                    bill.isPaid
                      ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                  }`}
                >
                  {bill.isPaid ? 'Paid' : 'Mark as Paid'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Bill Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleAddBill} className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h4 className="font-bold text-slate-800">Add Recurring Bill</h4>
              <button type="button" onClick={() => setShowAddModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Bill Name *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500"
                  placeholder="e.g. Indihome Wi-Fi 100Mbps"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500"
                  >
                    <option value="IPL / Maintenance">IPL / Maintenance</option>
                    <option value="Utilities (PLN / PAM)">Utilities (PLN / PAM)</option>
                    <option value="Internet">Internet</option>
                    <option value="Subscription">Subscription</option>
                    <option value="Rent / Mortgage">Rent / Mortgage</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Due Day of Month</label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={dueDay}
                    onChange={(e) => setDueDay(Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Monthly Amount (IDR)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500"
                  placeholder="500000"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="autodebit"
                  checked={autoDebit}
                  onChange={(e) => setAutoDebit(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded border-slate-300"
                />
                <label htmlFor="autodebit" className="text-xs font-medium text-slate-700">
                  Auto-debit from card or bank
                </label>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Payment Instructions / Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Pay via Virtual Account BCA in Building app"
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
                  Save Bill
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
