import React from 'react';
import { X, BookOpen, Waves, Award, CheckCircle, Info } from 'lucide-react';
import { UNPATTI_REGULATION_INFO } from '../utils/regulatoryValidator';

interface RegulationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RegulationDrawer: React.FC<RegulationDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm">
                Landasan Regulasi Penilaian OBE Unpatti
              </h3>
              <p className="text-[11px] text-slate-300">
                Peraturan Rektor No. 12/2026 &amp; PIP "Bina Mulia ke Lautan"
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-xs text-slate-700 leading-relaxed">
          {/* Pasal 47 */}
          <div className="bg-blue-50/70 p-4 rounded-xl border border-blue-200 space-y-2">
            <h4 className="font-bold text-blue-950 text-sm flex items-center gap-2">
              <Award className="w-4 h-4 text-blue-600" />
              <span>Peraturan Rektor Unpatti No. 12 Tahun 2026: Pasal 47</span>
            </h4>
            <div className="whitespace-pre-line text-[11px] font-mono text-blue-900 bg-white/70 p-3 rounded-lg border border-blue-100">
              {UNPATTI_REGULATION_INFO.pasal47Text}
            </div>
          </div>

          {/* PIP Bina Mulia ke Lautan */}
          <div className="bg-cyan-50/70 p-4 rounded-xl border border-cyan-200 space-y-2">
            <h4 className="font-bold text-cyan-950 text-sm flex items-center gap-2">
              <Waves className="w-4 h-4 text-cyan-600" />
              <span>PIP Universitas Pattimura "Bina Mulia ke Lautan" (2025)</span>
            </h4>
            <p className="text-[11px] text-cyan-900 leading-relaxed">
              {UNPATTI_REGULATION_INFO.pipBmkText}
            </p>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <div className="p-2 bg-white/70 rounded border border-cyan-100 text-[11px]">
                <strong className="text-cyan-950 block">Aquatic-Terrestrial:</strong>
                Integrasi dinamika laut dalam, pulau-pulau kecil, dan pesisir.
              </div>
              <div className="p-2 bg-white/70 rounded border border-cyan-100 text-[11px]">
                <strong className="text-cyan-950 block">SDGs Alignment:</strong>
                SDG 14 (Life Below Water), SDG 4, SDG 2, SDG 8, SDG 13, SDG 16.
              </div>
            </div>
          </div>

          {/* KKNI Levels */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-sm">
              Pedoman Kedalaman KKNI (Perpres No. 8/2012)
            </h4>
            <div className="space-y-2">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block text-xs">
                  Level 6: Sarjana (S1) / Sarjana Terapan (D4)
                </span>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Mampu mengaplikasikan IPTEKS bidang keahliannya, memformulasikan penyelesaian masalah prosedural, mengambil keputusan berbasis data/informasi, dan bertanggung jawab atas hasil kerja mandiri/kelompok.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block text-xs">
                  Level 7: Pendidikan Profesi
                </span>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Mampu mengembangkan kinerja profesional, memecahkan masalah prosedural-praktis tingkat lanjut, serta mengelola sumber daya dan evaluasi komprehensif bidang profesi.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block text-xs">
                  Level 8: Magister (S2) / Spesialis
                </span>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Mampu mengembangkan IPTEKS melalui riset hingga menghasilkan karya inovatif/teruji; memecahkan masalah melalui pendekatan <em>inter/multidisipliner</em>. Skala Penilaian: A (≥90), A- (85-89.99), B+ (80-84.99), B (70-79.99), B- (65-69.99), C (55-64.99), E (&lt;55).
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block text-xs">
                  Level 9: Doktor (S3) / Subspesialis
                </span>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Mampu mengembangkan teori/pengetahuan baru atau praktik profesional melalui riset mandiri hingga menghasilkan karya kreatif, orisinal (<em>novelty</em>), dan teruji; pendekatan <em>transdisipliner</em>.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-center">
          <button
            onClick={onClose}
            className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs transition"
          >
            Tutup Panduan Regulasi
          </button>
        </div>
      </div>
    </div>
  );
};
