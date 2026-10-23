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
  Edit2,
  X,
  Search,
  Calendar,
  AlertTriangle,
  Layers,
  Wrench
} from 'lucide-react';

export const ArtTasksView: React.FC = () => {
  const { 
    artTasks, 
    completeArtTask, 
    addArtTask, 
    updateArtTask,
    deleteArtTask 
  } = useHousehold();

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<ArtTask | null>(null);

  // Delete confirmation state
  const [taskToDelete, setTaskToDelete] = useState<ArtTask | null>(null);

  // Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form state
  const [formTitle, setFormTitle] = useState('');
  const [formRoom, setFormRoom] = useState('General');
  const [formFreq, setFormFreq] = useState(14);
  const [formLastDone, setFormLastDone] = useState(new Date().toISOString().split('T')[0]);
  const [formNotes, setFormNotes] = useState('');

  const today = new Date();

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const openCreateModal = () => {
    setEditingTask(null);
    setFormTitle('');
    setFormRoom('General');
    setFormFreq(14);
    setFormLastDone(new Date().toISOString().split('T')[0]);
    setFormNotes('');
    setShowModal(true);
  };

  const openEditModal = (task: ArtTask) => {
    setEditingTask(task);
    setFormTitle(task.title);
    setFormRoom(task.room || 'General');
    setFormFreq(task.frequencyDays || 14);
    setFormLastDone(task.lastDoneDate || new Date().toISOString().split('T')[0]);
    setFormNotes(task.notes || '');
    setShowModal(true);
  };

  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    if (editingTask) {
      updateArtTask(editingTask.id, {
        title: formTitle.trim(),
        room: formRoom.trim() || 'General',
        frequencyDays: Number(formFreq) || 7,
        lastDoneDate: formLastDone,
        notes: formNotes.trim() || undefined
      });
      showToast(`Jadwal "${formTitle.trim()}" berhasil diperbarui.`);
    } else {
      addArtTask({
        title: formTitle.trim(),
        room: formRoom.trim() || 'General',
        frequencyDays: Number(formFreq) || 7,
        lastDoneDate: formLastDone,
        assignedTo: 'ART / Helper',
        notes: formNotes.trim() || undefined
      });
      showToast(`Jadwal "${formTitle.trim()}" berhasil ditambahkan.`);
    }

    setShowModal(false);
  };

  const handleConfirmDelete = () => {
    if (!taskToDelete) return;
    deleteArtTask(taskToDelete.id);
    showToast(`Jadwal "${taskToDelete.title}" telah dihapus.`);
    setTaskToDelete(null);
  };

  const handleMarkDone = (task: ArtTask) => {
    completeArtTask(task.id);
    showToast(`"${task.title}" ditandai selesai hari ini!`);
  };

  // Process tasks with calculations
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

  // Filter tasks by search query
  const filteredTasks = processedTasks.filter(t => {
    if (searchQuery.trim() === '') return true;
    const q = searchQuery.toLowerCase();
    return (
      t.title.toLowerCase().includes(q) ||
      (t.room && t.room.toLowerCase().includes(q)) ||
      (t.notes && t.notes.toLowerCase().includes(q))
    );
  });

  // Stats
  const totalCount = processedTasks.length;
  const overdueCount = processedTasks.filter(t => t.diffDays > t.frequencyDays).length;
  const dueTodayCount = processedTasks.filter(t => t.diffDays === t.frequencyDays).length;
  const upToDateCount = processedTasks.filter(t => t.diffDays < t.frequencyDays).length;

  const formatDateDisplay = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }).format(d);
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-sm px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-slate-700 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Metrics */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg leading-tight">Cleaning & Maintenance</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Jadwal perawatan berkala dan pembersihan rutin rumah/apartemen dengan pelacak siklus otomatis.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats Badges */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <div className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200/80 text-xs font-medium text-slate-700 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-slate-500" />
            <span>Total: <strong>{totalCount}</strong></span>
          </div>

          {overdueCount > 0 && (
            <div className="px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
              <span>Overdue: <strong>{overdueCount}</strong></span>
            </div>
          )}

          {dueTodayCount > 0 && (
            <div className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-xs font-semibold text-amber-700 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>Hari Ini: <strong>{dueTodayCount}</strong></span>
            </div>
          )}

          <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Aman: <strong>{upToDateCount}</strong></span>
          </div>
        </div>
      </div>

      {/* Main Table Section */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        {/* Table Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/50">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama jadwal atau area..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="text-xs text-slate-500 w-full sm:w-auto text-right">
            Menampilkan <strong>{filteredTasks.length}</strong> dari {artTasks.length} jadwal
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-100/70 text-slate-600 text-xs font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4">Nama Tugas & Area</th>
                <th className="py-3.5 px-4 w-36">Frekuensi</th>
                <th className="py-3.5 px-4 w-44">Terakhir Selesai</th>
                <th className="py-3.5 px-4 w-48">Status & Siklus</th>
                <th className="py-3.5 px-4 text-right w-40">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 text-sm">
                    {searchQuery ? 'Tidak ada jadwal yang cocok dengan pencarian.' : 'Belum ada jadwal pembersihan & perawatan.'}
                  </td>
                </tr>
              ) : (
                filteredTasks.map((task) => {
                  const isOverdue = task.diffDays > task.frequencyDays;
                  const isDueToday = task.diffDays === task.frequencyDays;

                  return (
                    <tr 
                      key={task.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isOverdue ? 'bg-rose-50/30' : isDueToday ? 'bg-amber-50/30' : ''
                      }`}
                    >
                      {/* Name & Area */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-start gap-2.5">
                          <div className={`p-1.5 rounded-lg mt-0.5 shrink-0 ${
                            isOverdue 
                              ? 'bg-rose-100 text-rose-700' 
                              : isDueToday 
                              ? 'bg-amber-100 text-amber-700' 
                              : 'bg-emerald-50 text-emerald-700'
                          }`}>
                            <Wrench className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <div className="font-semibold text-slate-800 leading-snug">
                              {task.title}
                            </div>
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                              {task.room && (
                                <span className="inline-block text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                                  {task.room}
                                </span>
                              )}
                              {task.notes && (
                                <span className="text-xs text-slate-500 italic">
                                  "{task.notes}"
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Frequency */}
                      <td className="py-3.5 px-4">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>Setiap {task.frequencyDays} hari</span>
                        </div>
                      </td>

                      {/* Last Executed */}
                      <td className="py-3.5 px-4">
                        <div className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{formatDateDisplay(task.lastDoneDate)}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {task.diffDays === 0 ? 'Hari ini' : `${task.diffDays} hari lalu`}
                        </div>
                      </td>

                      {/* Status & Cycle Bar */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1.5">
                          {isOverdue ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-100/90 px-2.5 py-0.5 rounded-full">
                              <AlertCircle className="w-3 h-3" />
                              Lewat {task.diffDays - task.frequencyDays} hari
                            </span>
                          ) : isDueToday ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                              <Clock className="w-3 h-3" />
                              Jatuh tempo hari ini
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              Sisa {task.daysLeft} hari
                            </span>
                          )}

                          {/* Interval progress meter */}
                          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-300 ${
                                isOverdue 
                                  ? 'bg-rose-500' 
                                  : isDueToday 
                                  ? 'bg-amber-500' 
                                  : 'bg-emerald-500'
                              }`}
                              style={{ width: `${task.progressPercent}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleMarkDone(task)}
                            title="Tandai selesai hari ini"
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-semibold flex items-center gap-1 transition-colors"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Selesai</span>
                          </button>

                          <button
                            onClick={() => openEditModal(task)}
                            title="Edit jadwal"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => setTaskToDelete(task)}
                            title="Hapus jadwal"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Task as a Card at the Bottom */}
      <button
        type="button"
        onClick={openCreateModal}
        className="w-full border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-emerald-50/40 hover:bg-emerald-50 transition-all rounded-2xl p-4 sm:p-5 flex items-center justify-center gap-3 text-emerald-800 font-semibold group cursor-pointer shadow-sm"
      >
        <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
          <Plus className="w-5 h-5" />
        </div>
        <div className="text-left">
          <div className="text-sm font-bold text-slate-800 group-hover:text-emerald-900">
            + Tambah Jadwal Pembersihan & Maintenance
          </div>
          <div className="text-xs text-slate-500 font-normal">
            Klik untuk menambahkan tugas pembersihan rutin atau perawatan berkala baru
          </div>
        </div>
      </button>

      {/* Add / Edit Task Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  {editingTask ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </div>
                <h4 className="font-bold text-slate-900 text-base">
                  {editingTask ? 'Edit Jadwal Maintenance' : 'Tambah Jadwal Maintenance'}
                </h4>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTask} className="mt-5 space-y-4">
              {/* Task Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Tugas / Jadwal <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Bersihkan filter AC kamar utama"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              {/* Area / Room */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Area / Bagian Rumah
                </label>
                <input
                  type="text"
                  placeholder="Misal: Kamar Mandi, AC & Elektronik, Balkon, General"
                  value={formRoom}
                  onChange={(e) => setFormRoom(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              {/* Frequency in Days */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Frekuensi Interval (Setiap Berapa Hari?)
                </label>
                {/* Preset frequency buttons */}
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {[
                    { label: '7 Hari', days: 7 },
                    { label: '14 Hari', days: 14 },
                    { label: '30 Hari', days: 30 },
                    { label: '60 Hari', days: 60 },
                  ].map((preset) => (
                    <button
                      key={preset.days}
                      type="button"
                      onClick={() => setFormFreq(preset.days)}
                      className={`py-1.5 text-xs font-semibold rounded-lg border transition ${
                        formFreq === preset.days
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Atau masukkan custom:</span>
                  <input
                    type="number"
                    min="1"
                    max="365"
                    value={formFreq}
                    onChange={(e) => setFormFreq(Number(e.target.value) || 1)}
                    className="w-24 px-3 py-1.5 text-sm bg-white border border-slate-300 rounded-lg text-center font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                  <span className="text-xs font-medium text-slate-600">hari sekali</span>
                </div>
              </div>

              {/* Last Done Date */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Terakhir Dikerjakan
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={formLastDone}
                    onChange={(e) => setFormLastDone(e.target.value)}
                    className="px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => setFormLastDone(new Date().toISOString().split('T')[0])}
                    className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
                  >
                    Hari Ini
                  </button>
                </div>
              </div>

              {/* Optional Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Catatan / Instruksi (Opsional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Misal: Gunakan sabun khusus marmer, jangan disikat kasar..."
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm transition"
                >
                  {editingTask ? 'Simpan Perubahan' : 'Tambah Jadwal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {taskToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900 text-center text-base">Hapus Jadwal?</h4>
            <p className="text-xs text-slate-500 text-center mt-2">
              Apakah Anda yakin ingin menghapus jadwal <strong>"{taskToDelete.title}"</strong>? Riwayat siklus akan terhapus.
            </p>

            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                type="button"
                onClick={() => setTaskToDelete(null)}
                className="flex-1 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-sm transition"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};