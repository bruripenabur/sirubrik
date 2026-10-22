import React, { useState } from 'react';
import {
  GraduationCap,
  Waves,
  BookOpen,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  RotateCcw,
  Calendar,
  ArrowLeftRight,
  BarChart3,
} from 'lucide-react';
import { CourseIdentity, WorkflowStage } from '../types';
import { UNPATTI_LOGO_URL } from '../utils/constants';
import { SyncStatusInfo } from '../utils/storage';

interface HeaderProps {
  identity: CourseIdentity;
  currentStage: WorkflowStage;
  syncStatus?: SyncStatusInfo | null;
  onOpenRegulations: () => void;
  onOpenConsultantChat: () => void;
  onOpenCalendar: () => void;
  onOpenTrilogyHub: () => void;
  onOpenStudentDashboard: () => void;
  onReset: () => void;
  onSelectExemplar: (id: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  identity,
  currentStage,
  syncStatus,
  onOpenRegulations,
  onOpenConsultantChat,
  onOpenCalendar,
  onOpenTrilogyHub,
  onOpenStudentDashboard,
  onReset,
  onSelectExemplar,
}) => {
  const [logoError, setLogoError] = useState(false);

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo & Institution Branding */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-white/10 p-1 flex items-center justify-center shadow-lg shadow-blue-500/10 border border-white/20 shrink-0">
              {!logoError ? (
                <img
                  src={UNPATTI_LOGO_URL}
                  alt="Logo Universitas Pattimura"
                  onError={() => setLogoError(true)}
                  className="w-full h-full object-contain"
                />
              ) : (
                <Waves className="w-7 h-7 text-cyan-300" />
              )}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-blue-100 to-cyan-300 bg-clip-text text-transparent">
                  SIRUBRIK UNPATTI
                </span>
                <span className="hidden md:inline-flex text-[10px] px-2 py-0.5 rounded-full font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  Pertor No. 12 Tahun 2026
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium">
                Universitas Pattimura • Penjaminan Mutu &amp; Asesmen OBE
              </p>
            </div>
          </div>

          {/* Quick Info & Action Tools */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Quick Exemplar Selector */}
            <div className="hidden lg:flex items-center">
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    onSelectExemplar(e.target.value);
                    e.target.value = '';
                  }
                }}
                defaultValue=""
                className="text-xs bg-slate-800 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-medium"
              >
                <option value="" disabled>
                  💡 Muat Contoh RPS Unpatti...
                </option>
                <option value="oseanografi_fpik">Oseanografi FPIK (S1 - Model 1)</option>
                <option value="hukum_adat_fh">Hukum Adat Laut FH (S1 - Model 1)</option>
                <option value="biotek_pasca">Bioteknologi Bahari (S2 - Model 2)</option>
              </select>
            </div>

            {/* Hub Integrasi Trilogi OBE Unpatti Button */}
            <button
              onClick={onOpenTrilogyHub}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-gradient-to-r from-blue-700 via-indigo-600 to-cyan-600 hover:from-blue-600 hover:to-cyan-500 text-white shadow-sm transition border border-cyan-400/30"
              title="Hub Integrasi Trilogi OBE (Desain-RPSOBE ➔ SIRUBRIK ➔ SIMPEL-CPL)"
            >
              <ArrowLeftRight className="w-3.5 h-3.5 text-cyan-200" />
              <span className="hidden md:inline">Hub Integrasi Trilogi OBE</span>
              <span className="md:hidden">Trilogi OBE</span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-pulse" />
            </button>

            {/* Progress Mahasiswa Analytics Dashboard */}
            <button
              onClick={onOpenStudentDashboard}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-600/50 transition"
              title="Dashboard Progress Ketercapaian Kompetensi Mahasiswa (Recharts Spider & Bar)"
            >
              <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Progress Mahasiswa</span>
            </button>

            <button
              onClick={onOpenCalendar}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-800/60 transition"
              title="Lihat Kalender Sebaran Evaluasi 16 Minggu"
            >
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden xl:inline">Kalender Evaluasi</span>
            </button>

            <button
              onClick={onOpenRegulations}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 transition"
              title="Lihat Regulasi Pasal 47 & Pertor No. 12/2026"
            >
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden lg:inline">Pertor 12/2026</span>
            </button>

            <button
              onClick={onOpenConsultantChat}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition"
            >
              <MessageSquare className="w-3.5 h-3.5 text-cyan-300" />
              <span className="hidden sm:inline">Konsultan AI</span>
            </button>

            <button
              onClick={onReset}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
              title="Mulai Ulang / Reset Formulir"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Course Sub-bar */}
        {identity.name && (
          <div className="py-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-300 gap-2">
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="font-semibold text-white truncate max-w-md">
                {identity.name} ({identity.code || 'MK'})
              </span>
              <span className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono text-[11px]">
                {identity.sks} SKS • Smtr {identity.semester}
              </span>
              <span className="px-1.5 py-0.5 rounded bg-blue-900/50 text-blue-300 text-[11px] border border-blue-700/50">
                {identity.level}
              </span>
            </div>

            <div className="flex items-center gap-2.5 text-[11px] flex-wrap">
              {/* External App Sync Indicator */}
              <button
                type="button"
                onClick={onOpenTrilogyHub}
                className="group inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-800/90 hover:bg-slate-700 border border-slate-700 hover:border-cyan-500/50 text-slate-300 transition"
                title="Status sinkronisasi data bridge dengan SIMPEL-CPL & Desain-RPSOBE. Klik untuk buka Hub."
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-slate-400">Sinkron {syncStatus?.source?.replace(' (Cache)', '') || 'SIMPEL-CPL'}:</span>
                <span className="font-semibold text-cyan-300 font-mono">
                  {syncStatus?.timestamp || '18 Okt 2026, 06:15 WIT'}
                </span>
              </button>

              {/* LocalStorage Cache Indicator */}
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/50 text-[10px]">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>Cache Lokal Aktif</span>
              </span>

              <span className="text-slate-600 hidden md:inline">•</span>
              <span className="text-cyan-400 font-medium hidden md:inline">Bina Mulia ke Lautan</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
