import React, { useState } from 'react';
import {
  X,
  Layers,
  ArrowRight,
  ArrowLeftRight,
  Database,
  CheckCircle,
  Sparkles,
  Download,
  Upload,
  RefreshCw,
  FileCheck,
  TrendingDown,
  Info,
  ShieldAlert,
  GraduationCap,
  BookOpen,
} from 'lucide-react';
import {
  CourseIdentity,
  EvaluationComponent,
  TrilogyBridgeData,
  CplItem,
  CPMKItem,
} from '../types';

interface TrilogyHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  identity: CourseIdentity;
  onUpdateIdentity: (identity: CourseIdentity) => void;
  components: EvaluationComponent[];
  onUpdateComponents: (components: EvaluationComponent[]) => void;
  onApplyHistoricalCqi?: (gapNotes: string) => void;
}

export const TrilogyHubModal: React.FC<TrilogyHubModalProps> = ({
  isOpen,
  onClose,
  identity,
  onUpdateIdentity,
  components,
  onUpdateComponents,
  onApplyHistoricalCqi,
}) => {
  const [activeTab, setActiveTab] = useState<'map' | 'simpel_cpl' | 'desain_rps' | 'export'>('map');
  const [rawTokenInput, setRawTokenInput] = useState('');
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  // Preset Data Bridge from Desain-RPSOBE
  const handleLoadDesainRpsPreset = () => {
    const syncedCpmks: CPMKItem[] = [
      {
        id: 'CPMK-1',
        code: 'CPMK 1',
        desc: 'Mampu menganalisis fenomena oseanografi fisik-kimia (SPL, klorofil, upwelling) perairan kepulauan Maluku berbasis data satelit.',
      },
      {
        id: 'CPMK-2',
        code: 'CPMK 2',
        desc: 'Mampu memformulasikan estimasi Zona Potensial Penangkapan Ikan (ZPPI) dan kalender melaut nelayan terintegrasi PIP Bina Mulia ke Lautan.',
      },
      {
        id: 'CPMK-3',
        code: 'CPMK 3',
        desc: 'Mampu merancang proyek mitigasi perubahan iklim dan tata kelola konservasi sumberdaya perikanan bahari berkelanjutan selaras SDG 14.',
      },
    ];

    onUpdateIdentity({
      ...identity,
      cpmkList: syncedCpmks,
      pipFocus: 'Pola Ilmiah Pokok Bina Mulia Kelautan: Fenomena oseanografis laut dalam Laut Banda, Sirkulasi Arlindo, dan ketahanan pangan nelayan kepulauan Maluku.',
      sdgsAlignment: ['SDG 14: Life Below Water', 'SDG 13: Climate Action', 'SDG 4: Quality Education'],
    });

    setSyncStatus('Berhasil menyinkronkan 3 CPMK, Profil Laut-Pulau, dan Acuan SDGs dari DESAIN-RPSOBE!');
  };

  // Preset Data Bridge from Simpel-CPL (with CPL Mapping & Historical CQI Gap)
  const handleLoadSimpelCplPreset = () => {
    const historicalGapNotes =
      'Hasil Audit SIMPEL-CPL Semester Ganjil 2025/2026: CPMK 2 memiliki ketercapaian 68.4% (< standar 75%). Delta gap 6.6% ditemukan pada indikator kalkulasi koordinat spasial ZPPI. Disarankan rubrik instrumen Case Method dan PjBL memberikan pembobotan dan scaffolding lebih terukur pada aspek analisis spasial.';

    onUpdateIdentity({
      ...identity,
      cqiNotes: historicalGapNotes,
    });

    onApplyHistoricalCqi?.(historicalGapNotes);
    setSyncStatus('Berhasil mengimpor Pemetaan CPL & Catatan Delta Gap CQI (< 75%) dari SIMPEL-CPL!');
  };

  // Export Format Penilaian ke SIMPEL-CPL
  const handleExportSimpelCplFormat = () => {
    let csv = `ID_MAHASISWA,NAMA_MAHASISWA,NIM,PROGRAM_STUDI,KODE_MK,SEMESTER\n`;
    csv += `MHS001,Abdurrahman Pattimura,202401001,${identity.studyProgram},${identity.code},${identity.semester}\n`;
    csv += `MHS002,Maria Latuconsina,202401002,${identity.studyProgram},${identity.code},${identity.semester}\n`;
    csv += `MHS003,Yohanes Sahureka,202401003,${identity.studyProgram},${identity.code},${identity.semester}\n\n`;

    csv += `=== STRUKTUR MATRIKS PENILAIAN RUBRIK UNPATTI (UNTUK SIMPEL-CPL) ===\n`;
    csv += `KOMPONEN_ID,NAMA_KOMPONEN,BOBOT_MK,SUB_CPMK,PASAL_47_STATUS\n`;
    components.forEach((c) => {
      csv += `"${c.id}","${c.name}",${c.weight}%,"${(c.subCpmkList || []).join('; ')}","${c.category}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Format_Input_Nilai_SIMPEL-CPL_${(identity.code || 'MK').replace(/\s+/g, '_')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-950 via-blue-950 to-indigo-950 text-white flex items-center justify-between border-b border-blue-900/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md">
              <ArrowLeftRight className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                  Enterprise Integration Suite
                </span>
                <span className="text-[10px] text-slate-300">
                  Data Bridge Interoperabilitas
                </span>
              </div>
              <h3 className="font-extrabold text-base sm:text-lg text-white">
                Hub Integrasi Trilogi OBE Universitas Pattimura
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 gap-2 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('map')}
            className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition ${
              activeTab === 'map'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Peta Arsitektur Trilogi OBE</span>
          </button>

          <button
            onClick={() => setActiveTab('simpel_cpl')}
            className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition ${
              activeTab === 'simpel_cpl'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Database className="w-4 h-4 text-emerald-600" />
            <span>Sinkronisasi Simpel-CPL (CPL &amp; CQI)</span>
          </button>

          <button
            onClick={() => setActiveTab('desain_rps')}
            className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition ${
              activeTab === 'desain_rps'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <span>Sinkronisasi Desain-RPSOBE</span>
          </button>

          <button
            onClick={() => setActiveTab('export')}
            className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition ${
              activeTab === 'export'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Download className="w-4 h-4 text-teal-600" />
            <span>Ekspor Format Nilai ke SIMPEL-CPL</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 bg-white text-xs">
          {syncStatus && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 font-semibold flex items-center gap-2 animate-in fade-in">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{syncStatus}</span>
            </div>
          )}

          {/* TAB 1: PETA ARSITEKTUR TRILOGI OBE */}
          {activeTab === 'map' && (
            <div className="space-y-6">
              <div className="text-center max-w-2xl mx-auto space-y-1">
                <h4 className="font-extrabold text-slate-900 text-base">
                  Arsitektur Aliran Data OBE Terpadu (Single Source of Truth)
                </h4>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Trilogi OBE Unpatti menghubungkan perancangan kurikulum di hulu, penyusunan instrumen evaluasi terstandar di tengah, dan pengukuran portofolio lulusan di hilir.
                </p>
              </div>

              {/* Visual 3-Pillar Architecture Diagram */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
                {/* Pillar 1: DESAIN-RPSOBE */}
                <div className="p-4 rounded-2xl bg-indigo-50/70 border-2 border-indigo-200 space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-200 text-indigo-900">
                      HULU KURIKULUM
                    </span>
                    <BookOpen className="w-4 h-4 text-indigo-600" />
                  </div>
                  <h5 className="font-extrabold text-indigo-950 text-sm">
                    1. DESAIN-RPSOBE
                  </h5>
                  <p className="text-[11px] text-indigo-900 leading-relaxed">
                    Merumuskan Profil Lulusan, pemetaan CPL, CPMK, Bahan Kajian, RPS 16 Minggu, serta pemilihan model pembelajaran (Case Method / PjBL).
                  </p>
                  <div className="pt-2 border-t border-indigo-200/60 text-[10px] text-indigo-800 space-y-1">
                    <div>✓ Standar SN-Dikti &amp; KKNI 6-9</div>
                    <div>✓ PIP Bina Mulia ke Lautan</div>
                  </div>
                </div>

                {/* Pillar 2: SIRUBRIK (ACTIVE) */}
                <div className="p-4 rounded-2xl bg-blue-50/90 border-2 border-blue-600 space-y-3 shadow-md ring-2 ring-blue-500/20">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-600 text-white">
                      JANTUNG ASESMEN (AKTIF)
                    </span>
                    <Sparkles className="w-4 h-4 text-blue-600" />
                  </div>
                  <h5 className="font-extrabold text-blue-950 text-sm">
                    2. SIRUBRIK UNPATTI
                  </h5>
                  <p className="text-[11px] text-blue-900 leading-relaxed">
                    Menyusun instrumen tugas autentik, naskah kasus HOTS, matriks rubrik analitis bergradasi resmi Pasal 47, dan kalender beban asesmen 16 minggu.
                  </p>
                  <div className="pt-2 border-t border-blue-200 text-[10px] text-blue-800 space-y-1">
                    <div>✓ Validasi Pasal 47 (≥50% Proyek/Kasus)</div>
                    <div>✓ Skala Mutu Resmi Unpatti S1 &amp; S2</div>
                  </div>
                </div>

                {/* Pillar 3: SIMPEL-CPL */}
                <div className="p-4 rounded-2xl bg-emerald-50/70 border-2 border-emerald-200 space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-200 text-emerald-900">
                      HILIR PENGUKURAN
                    </span>
                    <Database className="w-4 h-4 text-emerald-600" />
                  </div>
                  <h5 className="font-extrabold text-emerald-950 text-sm">
                    3. SIMPEL-CPL
                  </h5>
                  <p className="text-[11px] text-emerald-900 leading-relaxed">
                    Penginputan skor riil mahasiswa berbasis indikator rubrik, agregasi pencapaian CPL, visualisasi radar chart, serta analisis delta gap CQI akreditasi.
                  </p>
                  <div className="pt-2 border-t border-emerald-200/60 text-[10px] text-emerald-800 space-y-1">
                    <div>✓ Spider Chart Portofolio Mahasiswa</div>
                    <div>✓ Siklus Balikan PPEPP / CQI Audit Mutu</div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-800 text-xs block">
                    Uji Coba Sinkronisasi Cepat:
                  </span>
                  <p className="text-[11px] text-slate-500">
                    Muat data kurikulum atau data CQI audit untuk melihat aliran data antar aplikasi secara otomatis.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handleLoadDesainRpsPreset}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 transition"
                  >
                    Tarik dari Desain-RPSOBE
                  </button>
                  <button
                    onClick={handleLoadSimpelCplPreset}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition"
                  >
                    Tarik dari Simpel-CPL
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SINKRONISASI SIMPEL-CPL */}
          {activeTab === 'simpel_cpl' && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Database className="w-4 h-4 text-emerald-600" />
                  <span>Sinkronisasi Data Capaian Pembelajaran Lulusan (CPL) &amp; Umpan Balik CQI</span>
                </h4>
                <p className="text-slate-500 text-xs">
                  Mengimpor pemetaan CPL dan mendeteksi kesenjangan mutu (*delta gap ketercapaian &lt; 75%*) dari SIMPEL-CPL agar rubrik yang dirancang dapat memperbaiki kelemahan belajar mahasiswa.
                </p>
              </div>

              {identity.cqiNotes && (
                <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl space-y-1 text-xs text-amber-950">
                  <div className="font-bold flex items-center gap-1.5 text-amber-900">
                    <ShieldAlert className="w-4 h-4 text-amber-600" />
                    <span>Catatan Umpan Balik CQI Terdeteksi dari SIMPEL-CPL:</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-amber-900">
                    {identity.cqiNotes}
                  </p>
                </div>
              )}

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <label className="font-bold text-slate-800 block text-xs">
                  Tempel Token / JSON Interoperabilitas Simpel-CPL:
                </label>
                <textarea
                  rows={4}
                  value={rawTokenInput}
                  onChange={(e) => setRawTokenInput(e.target.value)}
                  placeholder="Tempel token JSON dari ekspor Simpel-CPL di sini (memuat CPL-1, CPL-2, benchmark ketercapaian, dan data riwayat nilai)..."
                  className="w-full bg-white border border-slate-300 rounded-xl p-2.5 font-mono text-[11px]"
                />
                <div className="flex justify-between items-center">
                  <button
                    onClick={handleLoadSimpelCplPreset}
                    className="text-[11px] text-blue-600 hover:underline font-semibold"
                  >
                    💡 Gunakan Contoh Data Simpel-CPL Unpatti
                  </button>
                  <button
                    onClick={handleLoadSimpelCplPreset}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs transition"
                  >
                    Proses &amp; Sinkronkan CPL
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SINKRONISASI DESAIN-RPSOBE */}
          {activeTab === 'desain_rps' && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-indigo-600" />
                  <span>Sinkronisasi Kurikulum Hulu dari DESAIN-RPSOBE</span>
                </h4>
                <p className="text-slate-500 text-xs">
                  Sinkronisasi profil mata kuliah, alokasi minggu pertemuan, dan bobot komponen penilaian agar selaras dengan RPS yang telah disahkan.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-400 block text-[10px]">Mata Kuliah Terkoneksi</span>
                  <strong className="text-slate-900 text-xs">{identity.name}</strong>
                  <span className="text-slate-500 block text-[10px] font-mono">{identity.code}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-400 block text-[10px]">Jumlah CPMK Terdaftar</span>
                  <strong className="text-indigo-900 text-xs">{(identity.cpmkList || []).length} CPMK Utama</strong>
                  <span className="text-emerald-700 block text-[10px] font-bold">✓ Selaras RPS</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-400 block text-[10px]">Validasi Pasal 47</span>
                  <strong className="text-emerald-800 text-xs">≥ 50% Kasus &amp; Proyek</strong>
                  <span className="text-slate-500 block text-[10px]">Perrek No. 12/2026</span>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleLoadDesainRpsPreset}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs transition flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Perbarui Sinkronisasi dari Desain-RPSOBE</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: EKSPOR FORMAT NILAI KE SIMPEL-CPL */}
          {activeTab === 'export' && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Download className="w-4 h-4 text-teal-600" />
                  <span>Ekspor Skema Penilaian Mahasiswa ke SIMPEL-CPL</span>
                </h4>
                <p className="text-slate-500 text-xs">
                  Unduh template lembar penilaian (*gradebook sheet*) yang memuat seluruh kolom Sub-CPMK, kriteria rubrik, bobot komponen, dan formula konversi nilai Unpatti untuk langsung diimpor ke SIMPEL-CPL.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="text-xs font-semibold text-slate-800">
                  Kolom Penilaian yang Dihasilkan Otomatis:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  {components.map((c, i) => (
                    <div key={c.id} className="p-2 bg-white rounded-lg border border-slate-200 flex justify-between items-center">
                      <span className="font-medium text-slate-800 truncate max-w-[220px]">
                        {i + 1}. {c.name.split(':')[0]}
                      </span>
                      <span className="font-mono font-bold text-blue-900 text-[10px]">
                        Bobot: {c.weight}%
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleExportSimpelCplFormat}
                    className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-bold text-xs transition flex items-center gap-2 shadow-sm"
                  >
                    <Download className="w-4 h-4" />
                    <span>Unduh Template Gradebook SIMPEL-CPL (.csv)</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs transition"
          >
            Tutup Hub Integrasi
          </button>
        </div>
      </div>
    </div>
  );
};
