import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FamilyProfile, Relationship } from '../../types';
import {
  Users,
  UserPlus,
  Heart,
  AlertTriangle,
  FileText,
  Calendar,
  Droplet,
  Trash2,
  Edit2,
  CheckCircle,
  X,
} from 'lucide-react';

interface FamilyManagerProps {
  profiles: FamilyProfile[];
  activeProfileId: string;
  onSelectProfile: (id: string) => void;
  onSaveProfile: (profile: FamilyProfile) => void;
  onDeleteProfile: (id: string) => void;
}

const RELATIONSHIPS: Relationship[] = [
  'Self',
  'Spouse',
  'Parent',
  'Child',
  'Grandparent',
  'Other',
];

const AVATAR_COLORS = [
  '#059669', // Emerald
  '#2563eb', // Blue
  '#d97706', // Amber
  '#7c3aed', // Purple
  '#e11d48', // Rose
  '#0891b2', // Cyan
];

export function FamilyManager({
  profiles,
  activeProfileId,
  onSelectProfile,
  onSaveProfile,
  onDeleteProfile,
}: FamilyManagerProps) {
  const { t } = useTranslation();

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState<Relationship>('Child');
  const [dob, setDob] = useState('');
  const [bloodGroup, setBloodGroup] = useState('B+');
  const [allergies, setAllergies] = useState('');
  const [chronicConditions, setChronicConditions] = useState('');
  const [notes, setNotes] = useState('');
  const [avatarColor, setAvatarColor] = useState('#059669');

  const handleOpenAdd = () => {
    setEditingId(null);
    setName('');
    setRelationship('Child');
    setDob('');
    setBloodGroup('O+');
    setAllergies('');
    setChronicConditions('');
    setNotes('');
    setAvatarColor(AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)]);
    setIsEditing(true);
  };

  const handleOpenEdit = (p: FamilyProfile) => {
    setEditingId(p.id);
    setName(p.name);
    setRelationship(p.relationship);
    setDob(p.dob);
    setBloodGroup(p.bloodGroup);
    setAllergies(p.allergies || '');
    setChronicConditions(p.chronicConditions || '');
    setNotes(p.notes || '');
    setAvatarColor(p.avatarColor || '#059669');
    setIsEditing(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newProfile: FamilyProfile = {
      id: editingId || `prof-${Date.now()}`,
      name: name.trim(),
      relationship,
      dob,
      bloodGroup,
      allergies,
      chronicConditions,
      notes,
      avatarColor,
      createdAt: new Date().toISOString(),
    };

    onSaveProfile(newProfile);
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Users className="w-4 h-4" />
            <span>{t('family.title')}</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            Family Care & Private Records
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {t('family.subtitle')}
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg shadow-emerald-600/25 transition-all"
        >
          <UserPlus className="w-4 h-4" />
          <span>{t('family.addMember')}</span>
        </button>
      </div>

      {/* Add / Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {editingId ? 'Edit Profile' : t('family.addMember')}
              </h3>
              <button
                onClick={() => setIsEditing(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t('family.name')} *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t('family.relationship')}
                  </label>
                  <select
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value as Relationship)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {RELATIONSHIPS.map((rel) => (
                      <option key={rel} value={rel}>
                        {t(`family.relationships.${rel}`)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t('family.bloodGroup')}
                  </label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                      <option key={bg} value={bg}>
                        {bg}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t('family.dob')}
                  </label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Color Tag
                  </label>
                  <div className="flex items-center gap-2 pt-1">
                    {AVATAR_COLORS.map((c) => (
                      <button
                        type="button"
                        key={c}
                        onClick={() => setAvatarColor(c)}
                        className={`w-6 h-6 rounded-full transition-transform ${
                          avatarColor === c ? 'scale-125 ring-2 ring-emerald-500' : ''
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t('family.allergies')}
                </label>
                <input
                  type="text"
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                  placeholder="e.g. Penicillin, Peanuts, Dust"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t('family.chronicConditions')}
                </label>
                <input
                  type="text"
                  value={chronicConditions}
                  onChange={(e) => setChronicConditions(e.target.value)}
                  placeholder="e.g. Hypertension, Diabetes, Thyroid"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t('family.notes')}
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Emergency contacts, doctor instructions, morning medicine..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold"
                >
                  {t('family.cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-600/20"
                >
                  {t('family.save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Profiles Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {profiles.map((p) => {
          const isActive = p.id === activeProfileId;
          return (
            <div
              key={p.id}
              className={`p-5 rounded-3xl border transition-all ${
                isActive
                  ? 'border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/20 ring-1 ring-emerald-500 shadow-md'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-sm"
                    style={{ backgroundColor: p.avatarColor || '#059669' }}
                  >
                    {p.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">
                      {p.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        {t(`family.relationships.${p.relationship}`)}
                      </span>
                      {p.bloodGroup && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 flex items-center gap-0.5">
                          <Droplet className="w-2.5 h-2.5" />
                          <span>{p.bloodGroup}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(p)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                    title="Edit"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  {profiles.length > 1 && (
                    <button
                      onClick={() => onDeleteProfile(p.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-950"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Profile details */}
              <div className="mt-4 space-y-2 text-xs">
                {p.allergies && (
                  <div className="flex items-start gap-1.5 text-amber-800 dark:text-amber-300">
                    <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                    <span>Allergies: {p.allergies}</span>
                  </div>
                )}
                {p.chronicConditions && (
                  <div className="flex items-start gap-1.5 text-slate-600 dark:text-slate-400">
                    <Heart className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-rose-500" />
                    <span>Conditions: {p.chronicConditions}</span>
                  </div>
                )}
                {p.notes && (
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-xl">
                    "{p.notes}"
                  </p>
                )}
              </div>

              {/* Select button */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  {p.dob ? `DOB: ${p.dob}` : 'Private profile'}
                </span>
                {isActive ? (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Active Member</span>
                  </span>
                ) : (
                  <button
                    onClick={() => onSelectProfile(p.id)}
                    className="text-xs font-bold px-3 py-1 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 transition-colors"
                  >
                    Select Profile
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
