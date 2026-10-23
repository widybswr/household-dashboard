import React, { useState } from 'react';
import { useHousehold } from '../context/HouseholdContext';
import { 
  Building2, 
  Wifi, 
  Phone, 
  AlertOctagon, 
  Zap, 
  Trash, 
  Check, 
  Copy, 
  Edit3 
} from 'lucide-react';

export const ApartmentInfoView: React.FC = () => {
  const { aptInfo, updateAptInfo } = useHousehold();

  const [copiedWifi, setCopiedWifi] = useState(false);
  const [copiedDoor, setCopiedDoor] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(aptInfo);

  const copyToClipboard = (text: string, type: 'wifi' | 'door') => {
    navigator.clipboard.writeText(text);
    if (type === 'wifi') {
      setCopiedWifi(true);
      setTimeout(() => setCopiedWifi(false), 2000);
    } else {
      setCopiedDoor(true);
      setTimeout(() => setCopiedDoor(false), 2000);
    }
  };

  const handleSave = () => {
    updateAptInfo(formData);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-800 text-lg">Apartment Manual & Emergency Handbook</h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Essential unit details, utility access, Wi-Fi credentials, and building contacts.
          </p>
        </div>

        <button
          onClick={() => {
            if (isEditing) handleSave();
            else setIsEditing(true);
          }}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
            isEditing
              ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          {isEditing ? (
            <>
              <Check className="w-4 h-4" /> Save Changes
            </>
          ) : (
            <>
              <Edit3 className="w-4 h-4" /> Edit Info
            </>
          )}
        </button>
      </div>

      {/* Grid: Access & Credentials */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Wi-Fi & Unit Access */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
          <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2 pb-2 border-b border-slate-100">
            <Wifi className="w-4 h-4 text-emerald-600" /> Wi-Fi & Digital Access
          </h4>

          {isEditing ? (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Wi-Fi SSID</label>
                <input
                  type="text"
                  value={formData.wifiSSID}
                  onChange={(e) => setFormData({ ...formData, wifiSSID: e.target.value })}
                  className="w-full text-xs px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Wi-Fi Password</label>
                <input
                  type="text"
                  value={formData.wifiPassword}
                  onChange={(e) => setFormData({ ...formData, wifiPassword: e.target.value })}
                  className="w-full text-xs px-3 py-2 border rounded-lg font-mono"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Smart Door Lock Code</label>
                <input
                  type="text"
                  value={formData.accessCode}
                  onChange={(e) => setFormData({ ...formData, accessCode: e.target.value })}
                  className="w-full text-xs px-3 py-2 border rounded-lg font-mono"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="p-3.5 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-100">
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Network Name</span>
                  <span className="text-sm font-bold text-slate-800">{aptInfo.wifiSSID}</span>
                </div>
                <span className="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold">5 GHz / 2.4 GHz</span>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-100">
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Wi-Fi Password</span>
                  <span className="text-sm font-mono font-bold text-slate-800">{aptInfo.wifiPassword}</span>
                </div>
                <button
                  onClick={() => copyToClipboard(aptInfo.wifiPassword, 'wifi')}
                  className="px-2.5 py-1 text-xs bg-white border border-slate-200 text-slate-700 hover:text-emerald-700 rounded-lg flex items-center gap-1 font-medium transition"
                >
                  {copiedWifi ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedWifi ? 'Copied' : 'Copy'}
                </button>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-100">
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Main Door Access</span>
                  <span className="text-sm font-mono font-bold text-slate-800">{aptInfo.accessCode}</span>
                </div>
                <button
                  onClick={() => copyToClipboard(aptInfo.accessCode, 'door')}
                  className="px-2.5 py-1 text-xs bg-white border border-slate-200 text-slate-700 hover:text-emerald-700 rounded-lg flex items-center gap-1 font-medium transition"
                >
                  {copiedDoor ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedDoor ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Building & Emergency Contacts */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
          <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2 pb-2 border-b border-slate-100">
            <Phone className="w-4 h-4 text-blue-600" /> Important Building Contacts
          </h4>

          {isEditing ? (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Building Management Office</label>
                <input
                  type="text"
                  value={formData.managementPhone}
                  onChange={(e) => setFormData({ ...formData, managementPhone: e.target.value })}
                  className="w-full text-xs px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Lobby Security Command Center</label>
                <input
                  type="text"
                  value={formData.securityPhone}
                  onChange={(e) => setFormData({ ...formData, securityPhone: e.target.value })}
                  className="w-full text-xs px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Engineering / Maintenance Duty</label>
                <input
                  type="text"
                  value={formData.engineeringPhone}
                  onChange={(e) => setFormData({ ...formData, engineeringPhone: e.target.value })}
                  className="w-full text-xs px-3 py-2 border rounded-lg"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-100">
                <span className="text-xs font-medium text-slate-600">Building Management Office</span>
                <a href={`tel:${aptInfo.managementPhone}`} className="text-xs font-bold text-blue-600 hover:underline">
                  {aptInfo.managementPhone}
                </a>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-100">
                <span className="text-xs font-medium text-slate-600">Lobby Security (24/7)</span>
                <a href={`tel:${aptInfo.securityPhone}`} className="text-xs font-bold text-rose-600 hover:underline">
                  {aptInfo.securityPhone}
                </a>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-100">
                <span className="text-xs font-medium text-slate-600">Engineering Duty Handyman</span>
                <a href={`tel:${aptInfo.engineeringPhone}`} className="text-xs font-bold text-slate-800 hover:underline">
                  {aptInfo.engineeringPhone}
                </a>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-100">
                <span className="text-xs font-medium text-slate-600">Assigned Parking Lot</span>
                <span className="text-xs font-bold text-slate-800">{aptInfo.parkingSpot}</span>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Utilities & Emergency Guide */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Water & Breaker Box */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
          <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2 pb-2 border-b border-slate-100">
            <Zap className="w-4 h-4 text-amber-500" /> Utilities & Emergency Valves
          </h4>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/70">
              <p className="font-bold text-amber-900 flex items-center gap-1.5">
                <AlertOctagon className="w-4 h-4 text-amber-600 shrink-0" /> Water Main Shutoff Valve
              </p>
              <p className="text-amber-800 mt-1 leading-relaxed">
                {aptInfo.waterShutoffLocation}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <p className="font-bold text-slate-700">Circuit Breaker Guide</p>
              <p className="text-slate-600 mt-1 leading-relaxed">
                {aptInfo.breakerNotes}
              </p>
            </div>
          </div>
        </div>

        {/* Building Rules & Trash Guide */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
          <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2 pb-2 border-b border-slate-100">
            <Trash className="w-4 h-4 text-emerald-600" /> Trash & House Logistics
          </h4>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <p className="font-bold text-slate-700">Rubbish Chute Schedule</p>
              <p className="text-slate-600 mt-1 leading-relaxed">
                {aptInfo.trashSchedule}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <p className="font-bold text-slate-700">General House Notes</p>
              <ul className="list-disc list-inside mt-1.5 space-y-1 text-slate-600">
                {aptInfo.quickNotes.map((note, i) => (
                  <li key={i}>{note}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
