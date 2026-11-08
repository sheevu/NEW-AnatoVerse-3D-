import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Search,
  Database,
  Filter,
  Layers,
  Activity,
  Heart,
  Eye,
  CheckCircle2,
  X,
  ExternalLink,
  ChevronRight,
  HardDrive,
} from 'lucide-react';
import bp3dCatalog from '../../data/bp3dCatalog.json';
import { OrganKey } from '../../types';

interface BP3DEntry {
  fileId: string;
  name: string;
  fmaId: string;
  representationId: string;
  volumeCm3: number;
  category: string;
}

interface DeepAnatomyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectOrgan?: (organKey: OrganKey) => void;
}

export function DeepAnatomyModal({
  isOpen,
  onClose,
  onSelectOrgan,
}: DeepAnatomyModalProps) {
  const { i18n } = useTranslation();
  const isHi = i18n.language === 'hi';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<BP3DEntry | null>(null);

  const categories = useMemo(() => {
    const set = new Set<string>();
    (bp3dCatalog as BP3DEntry[]).forEach((item) => set.add(item.category));
    return ['all', ...Array.from(set)];
  }, []);

  const filteredItems = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return (bp3dCatalog as BP3DEntry[]).filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(q) ||
        item.fmaId.toLowerCase().includes(q) ||
        item.fileId.toLowerCase().includes(q);
      const matchesCategory =
        selectedCategory === 'all' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  if (!isOpen) return null;

  // Correlate BP3D structure with major organ in 3D viewer
  const mapToOrganKey = (item: BP3DEntry): OrganKey | null => {
    const n = item.name.toLowerCase();
    if (n.includes('heart') || n.includes('coronary') || n.includes('aorta')) return 'heart';
    if (n.includes('brain') || n.includes('cerebr') || n.includes('cranial')) return 'brain';
    if (n.includes('lung') || n.includes('bronch') || n.includes('pulmon')) return 'lungs';
    if (n.includes('liver') || n.includes('hepat')) return 'liver';
    if (n.includes('stomach') || n.includes('gastr')) return 'stomach';
    if (n.includes('kidney') || n.includes('renal')) return 'kidneys';
    if (n.includes('pancrea')) return 'pancreas';
    if (n.includes('intestin') || n.includes('colon') || n.includes('bowel') || n.includes('mesenter')) return 'intestines';
    return null;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-5xl h-[85vh] bg-slate-900 border border-slate-800 rounded-3xl flex flex-col overflow-hidden shadow-2xl text-slate-100">
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-950 border border-emerald-700/60 text-emerald-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg text-white">
                  {isHi ? 'बॉडीपार्ट्स3D विस्तृत संरचना कैटलॉग' : 'BodyParts3D Deep Anatomy Catalog'}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-900/60 text-emerald-300 border border-emerald-700/40">
                  {bp3dCatalog.length} Meshes
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
                <HardDrive className="w-3.5 h-3.5 text-teal-400" />
                <span>Source: D:\CODEX2025-2026\RAHUL-SIR\Asstes\isa_BP3D_4.0_obj_99</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search and Category Filters */}
        <div className="p-4 border-b border-slate-800 bg-slate-900 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isHi ? 'संरचना खोजें (जैसे Aorta, Femur, Renal, Portal vein)...' : 'Search 2,234 structures by name, FMA, or file ID...'}
              className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 border-emerald-500 text-white shadow-sm'
                    : 'bg-slate-800/80 border-slate-700/60 text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                {cat === 'all' ? (isHi ? 'सभी श्रेणियां' : 'All Categories') : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Content Split: List & Inspection Drawer */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          {/* List Area */}
          <div className="md:col-span-7 overflow-y-auto divide-y divide-slate-800/60 p-2">
            {filteredItems.slice(0, 100).map((item) => {
              const isSelected = selectedItem?.fileId === item.fileId;
              const relatedOrgan = mapToOrganKey(item);

              return (
                <div
                  key={item.fileId}
                  onClick={() => setSelectedItem(item)}
                  className={`p-3 rounded-xl transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-emerald-950/60 border border-emerald-500/60 text-white'
                      : 'hover:bg-slate-800/60 text-slate-300'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs sm:text-sm text-slate-100">
                        {item.name}
                      </span>
                      {relatedOrgan && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">
                          {relatedOrgan.toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono">
                      <span>{item.fileId}.obj</span>
                      <span>•</span>
                      <span>{item.fmaId}</span>
                      <span>•</span>
                      <span className="text-teal-400 font-sans">{item.category}</span>
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-slate-500 flex-shrink-0" />
                </div>
              );
            })}

            {filteredItems.length === 0 && (
              <div className="p-12 text-center text-slate-500 text-xs">
                No matching anatomical structures found.
              </div>
            )}
          </div>

          {/* Right Detail Pane */}
          <div className="md:col-span-5 p-5 bg-slate-950/80 border-t md:border-t-0 md:border-l border-slate-800 overflow-y-auto flex flex-col justify-between">
            {selectedItem ? (
              <div className="space-y-4">
                <div className="border-b border-slate-800 pb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                    {selectedItem.category}
                  </span>
                  <h4 className="text-lg font-black text-white mt-1">
                    {selectedItem.name}
                  </h4>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    Concept ID: {selectedItem.fmaId}
                  </p>
                </div>

                {/* Technical Specifications */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-400">File Reference:</span>
                    <span className="font-mono text-emerald-300 font-semibold">{selectedItem.fileId}.obj</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-400">Representation ID:</span>
                    <span className="font-mono text-slate-200">{selectedItem.representationId || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-400">Volume:</span>
                    <span className="font-mono text-slate-200">{selectedItem.volumeCm3 ? `${selectedItem.volumeCm3} cm³` : 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-400">Location in Workspace:</span>
                    <span className="font-mono text-[10px] text-teal-400 truncate max-w-[200px]">
                      Asstes/isa_BP3D_4.0_obj_99
                    </span>
                  </div>
                </div>

                {/* 3D Action */}
                {mapToOrganKey(selectedItem) && (
                  <div className="pt-2">
                    <button
                      onClick={() => {
                        const org = mapToOrganKey(selectedItem);
                        if (org && onSelectOrgan) {
                          onSelectOrgan(org);
                          onClose();
                        }
                      }}
                      className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
                    >
                      <Eye className="w-4 h-4" />
                      <span>{isHi ? '3D मॉडल पर मुख्य अंग देखें' : `Focus ${mapToOrganKey(selectedItem)?.toUpperCase()} in 3D Body`}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500 space-y-3">
                <Layers className="w-8 h-8 text-slate-600" />
                <p className="text-xs">
                  {isHi ? 'संरचना विवरण देखने के लिए सूची से किसी अंग पर क्लिक करें' : 'Select any anatomical element from the list to view volume and 3D organ links.'}
                </p>
              </div>
            )}

            {/* License Note */}
            <div className="pt-4 border-t border-slate-800 text-[10px] text-slate-500">
              BodyParts3D © Database Center for Life Science (DBCLS), CC Attribution-Share Alike 2.1 Japan.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
