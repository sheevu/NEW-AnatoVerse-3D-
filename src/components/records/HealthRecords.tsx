import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FileText,
  Calendar,
  User,
  Trash2,
  Share2,
  Eye,
  Activity,
  Download,
  AlertCircle,
  CheckCircle,
  Search,
  Filter,
  ArrowRight,
} from 'lucide-react';
import { MedicalReport, FamilyProfile } from '../../types';
import { deleteReport } from '../../services/storage';

interface HealthRecordsProps {
  reports: MedicalReport[];
  profiles: FamilyProfile[];
  activeProfile: FamilyProfile | null;
  onSelectReport: (report: MedicalReport) => void;
  onNavigateToAnatomy: (report: MedicalReport) => void;
  onOpenWhatsAppShare: (report: MedicalReport) => void;
  onRefreshReports: () => void;
  onScanNewReport: () => void;
}

export function HealthRecords({
  reports,
  profiles,
  activeProfile,
  onSelectReport,
  onNavigateToAnatomy,
  onOpenWhatsAppShare,
  onRefreshReports,
  onScanNewReport,
}: HealthRecordsProps) {
  const { i18n } = useTranslation();
  const isHi = i18n.language === 'hi';

  const [searchFilter, setSearchFilter] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Filter reports
  const filteredReports = reports.filter((rep) => {
    const q = searchFilter.toLowerCase();
    const matchesSearch =
      rep.title.toLowerCase().includes(q) ||
      (rep.labName && rep.labName.toLowerCase().includes(q)) ||
      (rep.doctorNotes && rep.doctorNotes.toLowerCase().includes(q)) ||
      rep.rows.some((r) => r.name.toLowerCase().includes(q));

    const matchesType =
      selectedType === 'all' || rep.type.toLowerCase() === selectedType.toLowerCase();

    return matchesSearch && matchesType;
  });

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(isHi ? 'क्या आप इस रिपोर्ट को हटाना चाहते हैं?' : 'Are you sure you want to delete this report?')) {
      setDeletingId(id);
      await deleteReport(id);
      setDeletingId(null);
      onRefreshReports();
    }
  };

  const handleExportJSON = (report: MedicalReport, e: React.MouseEvent) => {
    e.stopPropagation();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${report.title.replace(/\s+/g, '_')}_${report.date}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <FileText className="w-6 h-6 text-emerald-600" />
            <span>{isHi ? 'स्वास्थ्य रिकॉर्ड व रिपोर्ट इतिहास' : 'Health Records & Report History'}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {activeProfile
              ? `${activeProfile.name} (${activeProfile.relationship}) · ${reports.length} ${
                  isHi ? 'रिपोर्ट सहेजी गईं' : 'reports archived'
                }`
              : isHi
              ? 'सभी सुरक्षित मेडिकल रिकॉर्ड'
              : 'Secure encrypted family medical records'}
          </p>
        </div>

        <button
          onClick={onScanNewReport}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all"
        >
          <Activity className="w-4 h-4" />
          <span>{isHi ? '+ नई रिपोर्ट स्कैन करें' : '+ Scan New Report'}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder={isHi ? 'शीर्षक, डॉक्टर या टेस्ट के नाम से खोजें...' : 'Search by report title, doctor or test...'}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
          />
        </div>

        <div>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full py-2.5 px-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm text-slate-700 dark:text-slate-200"
          >
            <option value="all">{isHi ? 'सभी रिपोर्ट प्रकार' : 'All Document Types'}</option>
            <option value="blood">{isHi ? 'रक्त परीक्षण (Blood Test)' : 'Blood Panel'}</option>
            <option value="pathology">{isHi ? 'पैथोलॉजी (Pathology)' : 'Pathology'}</option>
            <option value="prescription">{isHi ? 'प्रिस्क्रिप्शन (Prescription)' : 'Doctor Prescription'}</option>
            <option value="imaging">{isHi ? 'इमेजिंग (X-Ray / Scan)' : 'Imaging / Scan'}</option>
          </select>
        </div>
      </div>

      {/* Reports List */}
      {filteredReports.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredReports.map((report) => {
            const highCount = report.rows.filter((r) => r.status === 'high').length;
            const lowCount = report.rows.filter((r) => r.status === 'low').length;
            const normalCount = report.rows.filter((r) => r.status === 'within').length;

            return (
              <div
                key={report.id}
                onClick={() => onSelectReport(report)}
                className="group p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-600 rounded-2xl transition-all shadow-sm hover:shadow-md cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 transition-colors">
                        {report.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-500">
                        <span className="flex items-center gap-1 font-mono">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{report.date}</span>
                        </span>
                        <span>•</span>
                        <span className="capitalize px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[11px] font-medium">
                          {report.type}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        title={isHi ? 'JSON डाउनलोड' : 'Download JSON'}
                        onClick={(e) => handleExportJSON(report, e)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-200"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        title={isHi ? 'हटाएं' : 'Delete Report'}
                        onClick={(e) => handleDelete(report.id, e)}
                        disabled={deletingId === report.id}
                        className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-400 hover:text-rose-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Biomarker Pill Counts */}
                  <div className="flex items-center gap-2 pt-1 text-xs">
                    {highCount > 0 && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-semibold text-[11px]">
                        <AlertCircle className="w-3 h-3" />
                        <span>
                          {highCount} {isHi ? 'उच्च' : 'High'}
                        </span>
                      </span>
                    )}
                    {lowCount > 0 && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-semibold text-[11px]">
                        <AlertCircle className="w-3 h-3" />
                        <span>
                          {lowCount} {isHi ? 'निम्न' : 'Low'}
                        </span>
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold text-[11px]">
                      <CheckCircle className="w-3 h-3" />
                      <span>
                        {normalCount} {isHi ? 'सामान्य' : 'Normal'}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigateToAnatomy(report);
                      }}
                      className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                    >
                      <Activity className="w-3.5 h-3.5" />
                      <span>{isHi ? '3D शरीर पर देखें' : 'View in 3D'}</span>
                    </button>
                    <span className="text-slate-300">|</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenWhatsAppShare(report);
                      }}
                      className="inline-flex items-center gap-1 font-semibold text-teal-600 dark:text-teal-400 hover:underline"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </button>
                  </div>

                  <span className="text-slate-400 font-bold inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>{isHi ? 'विश्लेषण' : 'View Details'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 mx-auto flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-base text-slate-800 dark:text-slate-200">
              {isHi ? 'कोई रिपोर्ट नहीं मिली' : 'No medical reports found'}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {isHi
                ? 'इस प्रोफ़ाइल के लिए कोई रिपोर्ट मौजूद नहीं है। नई रिपोर्ट अपलोड या स्कैन करें।'
                : 'Upload or scan your pathology reports, blood panels, or prescriptions to begin tracking.'}
            </p>
          </div>
          <button
            onClick={onScanNewReport}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all"
          >
            {isHi ? 'अभी रिपोर्ट स्कैन करें' : 'Scan a Report Now'}
          </button>
        </div>
      )}
    </div>
  );
}
