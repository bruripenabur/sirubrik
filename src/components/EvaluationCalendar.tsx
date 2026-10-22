import React, { useState } from 'react';
import { EvaluationComponent } from '../types';
import {
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle2,
  Layers,
  ChevronRight,
  TrendingUp,
  Sparkles,
  FileText,
  BadgeCheck,
  Building,
} from 'lucide-react';
import { isCaseOrProjectCategory } from '../utils/regulatoryValidator';

interface EvaluationCalendarProps {
  components: EvaluationComponent[];
  courseName?: string;
  onSelectComponent?: (index: number) => void;
}

// Helper to parse weeks string like "Minggu ke-3 s.d. 7", "Minggu ke-8", "Minggu 10-15"
export function parseWeeks(weekStr: string): number[] {
  if (!weekStr) return [];
  const str = weekStr.toLowerCase();
  const weeks: number[] = [];

  // Match patterns like "3 s.d. 7" or "3-7" or "3 s/d 7"
  const rangeMatch = str.match(/(\d+)\s*(?:s\.?d\.?|-|s\/d|sampai)\s*(\d+)/i);
  if (rangeMatch) {
    const start = parseInt(rangeMatch[1], 10);
    const end = parseInt(rangeMatch[2], 10);
    if (!isNaN(start) && !isNaN(end) && start <= end) {
      for (let i = Math.max(1, start); i <= Math.min(16, end); i++) {
        weeks.push(i);
      }
      return weeks;
    }
  }

  // Match single numbers like "minggu ke-8" or "8"
  const singleMatches = str.match(/\b([1-9]|1[0-6])\b/g);
  if (singleMatches) {
    singleMatches.forEach((m) => {
      const num = parseInt(m, 10);
      if (!weeks.includes(num)) weeks.push(num);
    });
  }

  return weeks.sort((a, b) => a - b);
}

// Official Dates based on SK Rektor Universitas Pattimura No. 2152/UN13/SK/2026
export const SK_WEEKS_GASAL_2026_2027 = [
  { week: 1, range: '02 - 04 Sep 2026', note: 'Awal Kuliah (Kuliah Umum 1 Sep)' },
  { week: 2, range: '07 - 11 Sep 2026', note: 'Pendalaman Teori Awal' },
  { week: 3, range: '14 - 18 Sep 2026', note: 'Tugas Terstruktur 1' },
  { week: 4, range: '21 - 25 Sep 2026', note: 'Sinkronisasi PDDikti Ckpt 1' },
  { week: 5, range: '28 Sep - 02 Okt 2026', note: 'Pelaksanaan KKN Dimulai' },
  { week: 6, range: '05 - 09 Okt 2026', note: 'Studi Kasus / Analisis' },
  { week: 7, range: '12 - 16 Okt 2026', note: 'Review Pra-UTS' },
  { week: 8, range: '19 - 23 Okt 2026', note: '★ UTS Gasal Resmi (SK Rektor)' },
  { week: 9, range: '26 - 30 Okt 2026', note: 'Wisuda Periode Oktober (28 Okt)' },
  { week: 10, range: '02 - 06 Nov 2026', note: 'Kick-off Proyek PjBL' },
  { week: 11, range: '09 - 13 Nov 2026', note: 'Pendampingan Data Lapangan' },
  { week: 12, range: '16 - 20 Nov 2026', note: 'Penyusunan Laporan Kasus' },
  { week: 13, range: '23 - 27 Nov 2026', note: 'Presentasi Interim Proyek' },
  { week: 14, range: '30 Nov - 04 Des 2026', note: 'Finalisasi Proyek PjBL' },
  { week: 15, range: '07 - 11 Des 2026', note: 'Pengumpulan Portofolio Akhir' },
  { week: 16, range: '06 - 12 Jan 2027', note: '★ UAS Gasal Resmi (SK Rektor)' },
];

export const SK_WEEKS_GENAP_2026_2027 = [
  { week: 1, range: '15 - 19 Feb 2027', note: 'Awal Perkuliahan Semester Genap' },
  { week: 2, range: '22 - 26 Feb 2027', note: 'Pengenalan Topik & CPMK' },
  { week: 3, range: '01 - 05 Mar 2027', note: 'Pelaporan PDDikti Ckpt 1' },
  { week: 4, range: '08 - 12 Mar 2027', note: 'Tugas Terstruktur Mandiri' },
  { week: 5, range: '15 - 19 Mar 2027', note: 'Praktikum & Observasi' },
  { week: 6, range: '22 - 26 Mar 2027', note: 'Analisis Kasus Maritim' },
  { week: 7, range: '29 Mar - 02 Apr 2027', note: 'Persiapan Evaluasi UTS' },
  { week: 8, range: '12 - 16 Apr 2027', note: '★ UTS Genap Resmi (SK Rektor)' },
  { week: 9, range: '19 - 23 Apr 2027', note: 'Dies Natalis Unpatti ke-63 (23 Apr)' },
  { week: 10, range: '26 - 30 Apr 2027', note: 'Wisuda Periode April (22 Apr)' },
  { week: 11, range: '03 - 07 Mei 2027', note: 'Pelaksanaan Proyek Kelompok' },
  { week: 12, range: '10 - 14 Mei 2027', note: 'Eksperimen / Survei Lapangan' },
  { week: 13, range: '17 - 21 Mei 2027', note: 'Diseminasi Temuan' },
  { week: 14, range: '24 - 28 Mei 2027', note: 'Finalisasi Produk Luaran' },
  { week: 15, range: '31 Mei - 04 Jun 2027', note: 'Review Portofolio Asesmen' },
  { week: 16, range: '14 - 18 Jun 2027', note: '★ UAS Genap Resmi (SK Rektor)' },
];

export const EvaluationCalendar: React.FC<EvaluationCalendarProps> = ({
  components,
  courseName,
  onSelectComponent,
}) => {
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const [semesterMode, setSemesterMode] = useState<'gasal' | 'genap'>('gasal');

  const skDates = semesterMode === 'gasal' ? SK_WEEKS_GASAL_2026_2027 : SK_WEEKS_GENAP_2026_2027;

  // Map each of the 16 weeks to its active components
  const weekData = Array.from({ length: 16 }, (_, i) => {
    const weekNum = i + 1;
    const activeComps: {
      comp: EvaluationComponent;
      index: number;
      isDueWeek: boolean;
      allWeeks: number[];
    }[] = [];

    components.forEach((c, idx) => {
      const parsed = parseWeeks(c.suggestedWeeks);
      if (parsed.includes(weekNum)) {
        const isDue = parsed[parsed.length - 1] === weekNum;
        activeComps.push({
          comp: c,
          index: idx,
          isDueWeek: isDue,
          allWeeks: parsed,
        });
      }
    });

    // Calculate assessment workload / intensity
    const totalWeightInWeek = activeComps.reduce(
      (sum, item) => (item.isDueWeek ? sum + item.comp.weight : sum),
      0
    );

    let intensity: 'ringan' | 'sedang' | 'tinggi' = 'ringan';
    if (weekNum === 8 || weekNum === 16 || totalWeightInWeek >= 25) {
      intensity = 'tinggi';
    } else if (totalWeightInWeek >= 10 || activeComps.length >= 2) {
      intensity = 'sedang';
    }

    const dateMeta = skDates[i] || { range: `Minggu ${weekNum}`, note: '' };

    return {
      weekNum,
      activeComps,
      totalWeightInWeek,
      intensity,
      dateRange: dateMeta.range,
      skNote: dateMeta.note,
    };
  });

  // Calculate workload balance observations
  const peakWeeks = weekData.filter((w) => w.intensity === 'tinggi');
  const heavyWeeks = weekData.filter((w) => w.totalWeightInWeek > 30);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-5 sm:p-6">
      {/* Official SK Kalender Rektor Unpatti Banner */}
      <div className="p-3.5 bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white rounded-xl border border-blue-900/50 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center font-black shadow-md shrink-0">
            <BadgeCheck className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                Kalender Akademik Resmi Terpadu
              </span>
              <span className="text-[11px] text-amber-300 font-mono font-semibold">
                TA 2026/2027
              </span>
            </div>
            <h4 className="font-extrabold text-sm sm:text-base text-white">
              SK Rektor Universitas Pattimura No. 2152/UN13/SK/2026
            </h4>
          </div>
        </div>

        {/* Semester Selector Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-xl border border-slate-700/80 self-start md:self-auto">
          <button
            onClick={() => setSemesterMode('gasal')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              semesterMode === 'gasal'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Semester Gasal (Sep '26 - Jan '27)
          </button>
          <button
            onClick={() => setSemesterMode('genap')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              semesterMode === 'genap'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Semester Genap (Feb '27 - Jul '27)
          </button>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Kalender Evaluasi &amp; Beban Asesmen Mahasiswa (16 Minggu)
              </h3>
              <p className="text-xs text-slate-500">
                Sinkronisasi batas waktu pengumpulan tugas dengan tanggal riil perkuliahan, UTS, UAS, dan batas SIAKAD Unpatti.
              </p>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px] text-slate-600 flex-wrap">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span>Formatif / Ringan</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500" />
            <span>Sedang (Tugas Terstruktur)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500" />
            <span>Tinggi (UTS / UAS / PjBL)</span>
          </span>
        </div>
      </div>

      {/* Workload AI Assessment Note */}
      <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-100 text-xs text-blue-900 flex items-start gap-2.5">
        <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div className="space-y-1 leading-relaxed">
          <div className="font-semibold text-blue-950">
            Analisis Distribusi Beban Pembelajaran &amp; Keselarasan SK Rektor:
          </div>
          <p className="text-[11px] text-blue-900">
            {semesterMode === 'gasal' ? (
              <span>
                <strong>Jadwal Kunci Gasal 2026/2027:</strong> Kuliah: 02 Sep '26 - 10 Jan '27 | UTS: 19 - 23 Okt '26 (Mg 8) | UAS: 06 - 12 Jan '27 (Mg 16) | Remedial: 13 - 15 Jan '27 | Batas Kunci SIAKAD: 23 Jan 2027.
              </span>
            ) : (
              <span>
                <strong>Jadwal Kunci Genap 2026/2027:</strong> Kuliah: 15 Feb '27 - 18 Jun '27 | UTS: 12 - 16 Apr '27 (Mg 8) | Dies Natalis ke-63: 23 Apr '27 | UAS: 14 - 18 Jun '27 (Mg 16) | Remedial: 21 - 23 Jun '27 | Batas Kunci SIAKAD: 02 Jul 2027.
              </span>
            )}
          </p>
        </div>
      </div>

      {/* 16-Week Interactive Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2.5">
        {weekData.map((item) => {
          const isSelected = selectedWeek === item.weekNum;
          const isUTS = item.weekNum === 8;
          const isUAS = item.weekNum === 16;

          let badgeColor = 'bg-slate-100 text-slate-600 border-slate-200';
          if (item.intensity === 'tinggi') {
            badgeColor = 'bg-rose-50 text-rose-700 border-rose-300 ring-1 ring-rose-200';
          } else if (item.intensity === 'sedang') {
            badgeColor = 'bg-amber-50 text-amber-800 border-amber-300';
          } else if (item.activeComps.length > 0) {
            badgeColor = 'bg-emerald-50 text-emerald-800 border-emerald-300';
          }

          return (
            <div
              key={item.weekNum}
              onClick={() => setSelectedWeek(isSelected ? null : item.weekNum)}
              className={`p-2.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between min-h-[110px] ${
                isSelected
                  ? 'border-blue-600 bg-blue-50/80 shadow-xs ring-2 ring-blue-500/20'
                  : `${badgeColor} hover:shadow-xs hover:border-blue-300`
              }`}
            >
              <div>
                <div className="flex items-center justify-between font-bold text-xs mb-0.5">
                  <span className={isUTS || isUAS ? 'text-rose-700 font-extrabold' : 'text-slate-800'}>
                    Mg {item.weekNum}
                  </span>
                  {isUTS && (
                    <span className="text-[8px] px-1.5 py-0.2 rounded font-black bg-rose-600 text-white">
                      UTS
                    </span>
                  )}
                  {isUAS && (
                    <span className="text-[8px] px-1.5 py-0.2 rounded font-black bg-purple-600 text-white">
                      UAS
                    </span>
                  )}
                </div>

                {/* SK Date Range */}
                <div className="text-[8px] font-mono font-medium text-slate-500 leading-tight mb-1 truncate" title={item.dateRange}>
                  {item.dateRange}
                </div>

                {/* Active Assessment Components */}
                <div className="text-[10px] space-y-1">
                  {item.activeComps.length === 0 ? (
                    <span className="text-slate-400 italic text-[9px] block">Materi Pokok</span>
                  ) : (
                    item.activeComps.map((ac, idx) => {
                      const isCaseProj = isCaseOrProjectCategory(ac.comp.category);
                      return (
                        <div
                          key={idx}
                          className={`truncate rounded px-1 py-0.5 text-[9px] font-medium ${
                            ac.isDueWeek
                              ? 'bg-blue-600 text-white font-bold'
                              : isCaseProj
                              ? 'bg-blue-100 text-blue-900'
                              : 'bg-slate-200/70 text-slate-800'
                          }`}
                          title={`${ac.comp.name} (${ac.comp.weight}%)`}
                        >
                          {ac.isDueWeek && '★ '}
                          {ac.comp.name.split(':')[0]}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {item.totalWeightInWeek > 0 && (
                <div className="mt-1 pt-1 border-t border-slate-200/60 text-[9px] text-right font-mono font-bold text-slate-700">
                  Σ {item.totalWeightInWeek}%
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Selected Week Deep-Dive Modal / Box */}
      {selectedWeek && (
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 animate-in fade-in duration-150">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <div>
                <h4 className="font-bold text-slate-900 text-xs">
                  Detail Aktivitas Evaluasi Minggu ke-{selectedWeek} ({weekData[selectedWeek - 1].dateRange})
                </h4>
                <p className="text-[10px] text-blue-700 font-medium">
                  {weekData[selectedWeek - 1].skNote}
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelectedWeek(null)}
              className="text-[11px] text-slate-500 hover:text-slate-800 font-medium px-2 py-1 rounded bg-white border border-slate-200"
            >
              Tutup
            </button>
          </div>

          {weekData[selectedWeek - 1].activeComps.length === 0 ? (
            <p className="text-xs text-slate-500 italic py-1">
              Tidak ada batas pengumpulan tugas atau ujian terjadwal pada minggu ini. Fokus pada pendalaman materi perkuliahan tatap muka / interaksi kelas.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {weekData[selectedWeek - 1].activeComps.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs truncate max-w-[200px]">
                      {item.comp.name}
                    </span>
                    <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-blue-100 text-blue-800">
                      {item.comp.weight}%
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600">
                    <strong>Jadwal Pelaksanaan:</strong> {item.comp.suggestedWeeks}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    <strong>Sub-CPMK:</strong> {(item.comp.subCpmkList || []).join(', ')}
                  </div>
                  {onSelectComponent && (
                    <button
                      onClick={() => onSelectComponent(item.index)}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-800 pt-1"
                    >
                      <span>Lihat Instrumen Komponen Ini</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
