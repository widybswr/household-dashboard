import React, { useState } from 'react';
import { useHousehold } from '../context/HouseholdContext';
import { ArtTask } from '../types';
import { 
  Sparkles, 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Trash2, 
  HeartHandshake, 
  X,
  Filter
} from 'lucide-react';

export const ArtTasksView: React.FC = () => {
  const { 
    artTasks, 
    completeArtTask, 
    addArtTask, 
    deleteArtTask, 
    helperMode, 
    setHelperMode 
  } = useHousehold();

  const [selectedRoom, setSelectedRoom] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [taskTitle, setTaskTitle] = useState('');
  const [taskRoom, setTaskRoom] = useState('Master Bedroom');
  const [taskFreq, setTaskFreq] = useState(14);
  const [taskAssignee, setTaskAssignee] = useState<ArtTask['assignedTo']>('ART / Helper');
  const [taskNotes, setTaskNotes] = useState('');

  const today = new Date();

  // Rooms list for filter
  const rooms = ['All', ...Array.from(new Set(artTasks.map(t => t.room)))];

  const processedTasks = artTasks.map(task => {
    const lastDone = new Date(task.lastDoneDate);
    const diffDays = Math.floor((today.getTime() - lastDone.getTime()) / (1000 * 3600 * 24));
    const isDue = diffDays >= task.frequencyDays;
    const progressPercent = Math.min(100, Math.round((diffDays / task.frequencyDays) * 100));
    const daysLeft = task.frequencyDays - diffDays;

    return {
      ...task,
      diffDays,
      isDue,
      progressPercent,
      daysLeft
    };
  });

  const filteredTasks = processedTasks.filter(t => {
    if (selectedRoom !== 'All' && t.room !== selectedRoom) return false;
    if (helperMode && t.assignedTo !== 'ART / Helper') return false;
    return true;
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    addArtTask({
      title: taskTitle.trim(),
      room: taskRoom,
      frequencyDays: Number(taskFreq) || 7,
      assignedTo: taskAssignee,
      notes: taskNotes.trim() || undefined
    });

    setTaskTitle('');
    setTaskNotes('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-800 text-lg">ART & Household Maintenance Routines</h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Automates recurring chores (e.g. changing bedsheets every 14 days, AC filter every 60 days) with "days since last reset" tracking.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setHelperMode(!helperMode)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
              helperMode
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            <HeartHandshake className="w-4 h-4" />
            {helperMode ? 'Viewing ART Mode' : 'Switch to ART Mode'}
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add Routine
          </button>
        </div>
      </div>

      {/* Room Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 shrink-0">
          <Filter className="w-3 h-3" /> Filter:
        </span>
        {rooms.map(room => (
          <button
            key={room}
            onClick={() => setSelectedRoom(room)}
            className={`text-xs px-3 py-1.5 rounded-lg whitespace-nowrap transition font-medium ${
              selectedRoom === room
                ? 'bg-slate-800 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {room}
          </button>
        ))}
      </div>

      {/* Helper Mode Banner if Active */}
      {helperMode && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <HeartHandshake className="w-6 h-6 text-amber-600 shrink-0" />
            <div>
              <p className="text-sm font-bold">ART Helper Focus Mode Active</p>
              <p className="text-xs text-amber-700">Showing only domestic helper routines with high readability and 1-tap completion.</p>
            </div>
          </div>
          <button 
            onClick={() => window.print()} 
            className="text-xs bg-white text-amber-900 border border-amber-300 font-semibold px-3 py-1.5 rounded-lg hover:bg-amber-100"
          >
            Print Checklist 🖨️
          </button>
        </div>
      )}

      {/* Task Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTasks.map(task => {
          return (
            <div
              key={task.id}
              className={`p-5 rounded-2xl border transition flex flex-col justify-between ${
                task.isDue
                  ? 'bg-white border-amber-300 shadow-sm ring-1 ring-amber-300/50'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                {/* Header status */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700">
                    {task.room}
                  </span>

                  {task.isDue ? (
                    <span className="text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> Due Now ({task.diffDays}d ago)
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Due in {task.daysLeft} days
                    </span>
                  )}
                </div>

                {/* Title */}
                <h4 className="font-bold text-slate-900 text-base leading-snug">
                  {task.title}
                </h4>

                {task.notes && (
                  <p className="text-xs text-slate-500 mt-2 p-2 rounded-lg bg-slate-50 border border-slate-100 italic">
                    💡 {task.notes}
                  </p>
                )}

                {/* Interval details & Progress Bar */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                    <span>Routine: <strong>Every {task.frequencyDays} days</strong></span>
                    <span>Done {task.diffDays} days ago</span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        task.isDue 
                          ? 'bg-rose-500' 
                          : task.progressPercent > 70 
                          ? 'bg-amber-400' 
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${task.progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-medium">
                  Assigned: {task.assignedTo}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => deleteArtTask(task.id)}
                    className="p-1.5 text-slate-300 hover:text-rose-500 transition rounded-lg"
                    title="Delete task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => completeArtTask(task.id)}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Reset / Done
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleCreateTask} className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h4 className="font-bold text-slate-800">Add Recurring Chore</h4>
              <button type="button" onClick={() => setShowAddModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Task Name & Description *</label>
                <input
                  type="text"
                  required
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500"
                  placeholder="e.g. Change bedsheets & pillow covers"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Room / Area</label>
                  <select
                    value={taskRoom}
                    onChange={(e) => setTaskRoom(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Master Bedroom">Master Bedroom</option>
                    <option value="Guest Bedroom">Guest Bedroom</option>
                    <option value="Living Room">Living Room</option>
                    <option value="Kitchen">Kitchen</option>
                    <option value="Bathroom">Bathroom</option>
                    <option value="Balcony">Balcony</option>
                    <option value="Service Area">Service Area</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Repeat Every (Days)</label>
                  <input
                    type="number"
                    min="1"
                    max="365"
                    value={taskFreq}
                    onChange={(e) => setTaskFreq(Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500"
                    placeholder="14"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Assigned To</label>
                <select
                  value={taskAssignee}
                  onChange={(e) => setTaskAssignee(e.target.value as any)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500"
                >
                  <option value="ART / Helper">ART / Helper</option>
                  <option value="Self / Partner">Self / Partner</option>
                  <option value="Deep Clean">Deep Clean</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Instructions / Tips</label>
                <textarea
                  rows={2}
                  value={taskNotes}
                  onChange={(e) => setTaskNotes(e.target.value)}
                  placeholder="e.g. Use the linen disinfectant spray in laundry cabinet"
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
                  Save Task
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
