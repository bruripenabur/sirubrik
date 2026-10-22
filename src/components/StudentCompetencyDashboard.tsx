import React, { useState } from 'react';
import {
  CourseIdentity,
  EvaluationComponent,
  StudentCompetencyRecord,
} from '../types';
import {
  Award,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  User,
  Users,
  Sparkles,
  BarChart3,
  BookOpen,
  MessageSquare,
  FileCheck,
  ChevronRight,
  ShieldCheck,
  HelpCircle,
  ArrowRightLeft,
  Flame,
  Zap,
  Anchor,
} from 'lucide-react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ReferenceLine,
  Cell,
  ComposedChart,
  Line,
} from 'recharts';
import { convertScoreToGrade } from '../utils/regulatoryValidator';
import { TargetKpiMonitor } from './TargetKpiMonitor';
import { ComponentInstrument } from '../types';

interface StudentCompetencyDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  identity: CourseIdentity;
  components: EvaluationComponent[];
  instruments?: Record<string, ComponentInstrument>;
}

// Sample student records from Universitas Pattimura
const SAMPLE_STUDENTS: StudentCompetencyRecord[] = [
  {
    studentId: 'MHS001',
    studentName: 'Abdurrahman Pattimura (202401001)',
    subCpmkScores: [
      {
        subCpmkCode: 'Sub-CPMK 1',
        score: 88,
        target: 75,
        bloomLevel: 'C4 - Analisis',
        feedback: 'Penguasaan konsep dinamika SPL dan klorofil Laut Banda sangat baik dan berbasis rujukan ilmiah mutakhir.',
      },
      {
        subCpmkCode: 'Sub-CPMK 2',
        score: 82,
        target: 75,
        bloomLevel: 'C5 - Evaluasi',
        feedback: 'Formulasi koordinat ZPPI cukup akurat, tingkatkan integrasi dengan kalender angin musim barat/timur.',
      },
      {
        subCpmkCode: 'Sub-CPMK 3',
        score: 91,
        target: 75,
        bloomLevel: 'C6 - Kreasi',
        feedback: 'Prototipe atlas digital perikanan sangat inovatif dan aplikatif bagi nelayan kecil kepulauan Maluku.',
      },
    ],
    overallCpmkAchievement: [
      { cpmkCode: 'CPMK 1 (Oseanografi Fisik-Kimia)', actualScore: 88, targetScore: 75, isAchieved: true },
      { cpmkCode: 'CPMK 2 (Penentuan Fishing Ground)', actualScore: 82, targetScore: 75, isAchieved: true },
      { cpmkCode: 'CPMK 3 (Mitigasi Iklim & SDG 14)', actualScore: 91, targetScore: 75, isAchieved: true },
    ],
  },
  {
    studentId: 'MHS002',
    studentName: 'Maria Latuconsina (202401002)',
    subCpmkScores: [
      {
        subCpmkCode: 'Sub-CPMK 1',
        score: 72,
        target: 75,
        bloomLevel: 'C4 - Analisis',
        feedback: 'Perlu penguatan dalam membaca anomali termoklin Laut Seram. Ikuti sesi responsi tambahan.',
      },
      {
        subCpmkCode: 'Sub-CPMK 2',
        score: 85,
        target: 75,
        bloomLevel: 'C5 - Evaluasi',
        feedback: 'Analisis dampak ekonomi tangkapan cakalang sangat komprehensif dan realistis.',
      },
      {
        subCpmkCode: 'Sub-CPMK 3',
        score: 79,
        target: 75,
        bloomLevel: 'C6 - Kreasi',
        feedback: 'Ide pelibatan kearifan lokal sasi laut dalam konservasi tertulis dengan runtut.',
      },
    ],
    overallCpmkAchievement: [
      { cpmkCode: 'CPMK 1 (Oseanografi Fisik-Kimia)', actualScore: 72, targetScore: 75, isAchieved: false },
      { cpmkCode: 'CPMK 2 (Penentuan Fishing Ground)', actualScore: 85, targetScore: 75, isAchieved: true },
      { cpmkCode: 'CPMK 3 (Mitigasi Iklim & SDG 14)', actualScore: 79, targetScore: 75, isAchieved: true },
    ],
  },
  {
    studentId: 'MHS003',
    studentName: 'Yohanes Sahureka (202401003)',
    subCpmkScores: [
      {
        subCpmkCode: 'Sub-CPMK 1',
        score: 94,
        target: 75,
        bloomLevel: 'C4 - Analisis',
        feedback: 'Luar biasa dalam mengolah citra satelit Copernicus dan mengaitkan transpor massa air Arlindo.',
      },
      {
        subCpmkCode: 'Sub-CPMK 2',
        score: 89,
        target: 75,
        bloomLevel: 'C5 - Evaluasi',
        feedback: 'Argumentasi penentuan zona aman penangkapan sangat sistematis dan berbasis data empiris.',
      },
      {
        subCpmkCode: 'Sub-CPMK 3',
        score: 86,
        target: 75,
        bloomLevel: 'C6 - Kreasi',
        feedback: 'Rancangan rekomendasi kebijakan ramah lingkungan selaras penuh dengan PIP Bina Mulia ke Lautan.',
      },
    ],
    overallCpmkAchievement: [
      { cpmkCode: 'CPMK 1 (Oseanografi Fisik-Kimia)', actualScore: 94, targetScore: 75, isAchieved: true },
      { cpmkCode: 'CPMK 2 (Penentuan Fishing Ground)', actualScore: 89, targetScore: 75, isAchieved: true },
      { cpmkCode: 'CPMK 3 (Mitigasi Iklim & SDG 14)', actualScore: 86, targetScore: 75, isAchieved: true },
    ],
  },
];

// CPL Master Benchmark from Simpel-CPL
const SIMPEL_CPL_MASTER = [
  {
    cplCode: 'CPL-01',
    cplName: 'Sikap & Etika Kemaritiman',
    targetScore: 80,
    domain: 'Afektif (A3)',
    description: 'Menjunjung tinggi etika konservasi laut dan kearifan sasi kepulauan Maluku.',
  },
  {
    cplCode: 'CPL-02',
    cplName: 'Penguasaan Teori Oseanografi',
    targetScore: 75,
    domain: 'Kognitif (C4)',
    description: 'Menguasai sains kelautan tropis, hidrodinamika selat, dan dinamika termoklin.',
  },
  {
    cplCode: 'CPL-03',
    cplName: 'Aplikasi Geospasial & ZPPI',
    targetScore: 75,
    domain: 'Keterampilan Khusus (P4)',
    description: 'Mampu memetakan zona potensial penangkapan ikan dengan citra satelit & SIG.',
  },
  {
    cplCode: 'CPL-04',
    cplName: 'Rancangan Kebijakan Berkelanjutan',
    targetScore: 78,
    domain: 'Kognitif Lanjut (C6)',
    description: 'Merumuskan solusi pengelolaan pesisir terpadu berbasis SDG 14 dan PIP Unpatti.',
  },
];

export const StudentCompetencyDashboard: React.FC<StudentCompetencyDashboardProps> = ({
  isOpen,
  onClose,
  identity,
  components,
  instruments = {},
}) => {
  const [selectedStudentIndex, setSelectedStudentIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'distribution' | 'smartGap' | 'targetKpi'>('smartGap');
  const [viewMode, setViewMode] = useState<'individual' | 'class'>('individual');
  const [selectedHeatmapCell, setSelectedHeatmapCell] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentStudent = SAMPLE_STUDENTS[selectedStudentIndex];

  // Aggregate Data for Class Overview
  const classRadarData = [
    { subject: 'CPMK 1: Oseanografi Fisik', target: 75, rataRataKelas: 84.6, mahasiswaTerpilih: currentStudent.subCpmkScores[0]?.score || 85 },
    { subject: 'CPMK 2: Estimasi ZPPI', target: 75, rataRataKelas: 85.3, mahasiswaTerpilih: currentStudent.subCpmkScores[1]?.score || 82 },
    { subject: 'CPMK 3: Mitigasi & SDG 14', target: 75, rataRataKelas: 85.3, mahasiswaTerpilih: currentStudent.subCpmkScores[2]?.score || 91 },
    { subject: 'Sub-CPMK 1.1: Citra Satelit', target: 75, rataRataKelas: 88.0, mahasiswaTerpilih: 89 },
    { subject: 'Sub-CPMK 2.1: Pemodelan Spasial', target: 75, rataRataKelas: 81.5, mahasiswaTerpilih: 84 },
    { subject: 'Sub-CPMK 3.1: Tata Kelola Sasi', target: 75, rataRataKelas: 87.2, mahasiswaTerpilih: 90 },
  ];

  const classBarData = currentStudent.subCpmkScores.map((sc) => ({
    name: sc.subCpmkCode,
    capaian: sc.score,
    target: sc.target,
    bloom: sc.bloomLevel,
  }));

  const avgStudentScore =
    currentStudent.subCpmkScores.reduce((sum, s) => sum + s.score, 0) /
    (currentStudent.subCpmkScores.length || 1);

  const studentGrade = convertScoreToGrade(avgStudentScore, identity.level);

  // Smart-Gap Analysis Computation:
  // Maps Real-Time SIRUBRIK scores with Simpel-CPL benchmark targets
  const gapAnalysisData = SIMPEL_CPL_MASTER.map((cpl, idx) => {
    // Generate real-time score based on student performance
    let sirubrikScore = 80;
    if (idx === 0) sirubrikScore = Math.min(100, Math.round((currentStudent.subCpmkScores[0]?.score || 85) * 0.98));
    if (idx === 1) sirubrikScore = currentStudent.subCpmkScores[0]?.score || 80;
    if (idx === 2) sirubrikScore = currentStudent.subCpmkScores[1]?.score || 82;
    if (idx === 3) sirubrikScore = currentStudent.subCpmkScores[2]?.score || 88;

    const gap = sirubrikScore - cpl.targetScore;
    let status: 'surplus' | 'sesuai' | 'defisit' = 'sesuai';
    let statusLabel = 'Tercapai Sesuai Target';
    let color = '#2563eb'; // blue

    if (gap >= 5) {
      status = 'surplus';
      statusLabel = `Surplus (+${gap}%)`;
      color = '#10b981'; // emerald
    } else if (gap < 0) {
      status = 'defisit';
      statusLabel = `Defisit (${gap}%)`;
      color = '#ef4444'; // rose/red
    } else {
      statusLabel = `Ideal (+${gap}%)`;
      color = '#0284c7';
    }

    return {
      cplCode: cpl.cplCode,
      cplName: cpl.cplName,
      targetSimpelCPL: cpl.targetScore,
      realtimeSIRUBRIK: sirubrikScore,
      gap,
      status,
      statusLabel,
      color,
      domain: cpl.domain,
      description: cpl.description,
    };
  });

  // Calculate cohort heatmap data (Students x CPL matrix)
  const cohortHeatmapMatrix = SAMPLE_STUDENTS.map((st) => {
    return {
      studentName: st.studentName.split(' ')[0],
      cpl1Score: Math.round((st.subCpmkScores[0]?.score || 80) * 0.98),
      cpl2Score: st.subCpmkScores[0]?.score || 78,
      cpl3Score: st.subCpmkScores[1]?.score || 82,
      cpl4Score: st.subCpmkScores[2]?.score || 85,
    };
  });

  const getHeatmapColor = (score: number, target: number) => {
    const diff = score - target;
    if (diff >= 10) return 'bg-emerald-600 text-white';
    if (diff >= 4) return 'bg-emerald-500 text-white';
    if (diff >= 0) return 'bg-emerald-100 text-emerald-900 border border-emerald-300';
    if (diff >= -5) return 'bg-amber-100 text-amber-900 border border-amber-300';
    return 'bg-rose-500 text-white';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white flex items-center justify-between border-b border-blue-900/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  Student OBE Mastery Analytics
                </span>
                <span className="text-[10px] text-slate-300">
                  Integrasi SIMPEL-CPL ➔ SIRUBRIK
                </span>
              </div>
              <h3 className="font-extrabold text-base sm:text-lg text-white">
                Dashboard Progress Ketercapaian Kompetensi &amp; Smart-Gap Analysis
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-5 pt-3 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('smartGap')}
              className={`px-4 py-2 font-bold text-xs rounded-t-xl transition flex items-center gap-2 ${
                activeTab === 'smartGap'
                  ? 'bg-slate-50 text-slate-900 shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-rose-500" />
              <span>Smart-Gap Analysis (Heatmap &amp; Intervensi OBE)</span>
            </button>
            <button
              onClick={() => setActiveTab('targetKpi')}
              className={`px-4 py-2 font-bold text-xs rounded-t-xl transition flex items-center gap-2 ${
                activeTab === 'targetKpi'
                  ? 'bg-slate-50 text-slate-900 shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Anchor className="w-3.5 h-3.5 text-cyan-400" />
              <span>Target KPI Monitor (Bina Mulia ke Lautan)</span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            </button>
            <button
              onClick={() => setActiveTab('distribution')}
              className={`px-4 py-2 font-bold text-xs rounded-t-xl transition flex items-center gap-2 ${
                activeTab === 'distribution'
                  ? 'bg-slate-50 text-slate-900 shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-blue-500" />
              <span>Distribusi Sub-CPMK &amp; Spider Chart</span>
            </button>
          </div>

          {/* Student Selector */}
          <div className="flex items-center gap-2 pb-2">
            <User className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedStudentIndex}
              onChange={(e) => setSelectedStudentIndex(Number(e.target.value))}
              className="bg-slate-800 text-white text-xs rounded-lg px-2.5 py-1 border border-slate-700 font-semibold focus:outline-hidden"
            >
              {SAMPLE_STUDENTS.map((st, i) => (
                <option key={st.studentId} value={i}>
                  {st.studentName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 text-xs text-slate-800 bg-slate-50">
          {/* Quick Stats Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-slate-400 block text-[10px]">Rata-rata Real-Time SIRUBRIK</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-lg font-black font-mono text-blue-950">
                  {avgStudentScore.toFixed(1)}
                </span>
                <span className="text-xs text-slate-500">/ 100</span>
              </div>
              <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">
                Nilai Mutu: {studentGrade.grade} ({studentGrade.predicate})
              </span>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-slate-400 block text-[10px]">Target Capaian SIMPEL-CPL</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-lg font-black font-mono text-indigo-700">75.0% - 80.0%</span>
              </div>
              <span className="text-[10px] text-indigo-600 font-semibold block mt-0.5">
                Standar Kurikulum OBE
              </span>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-slate-400 block text-[10px]">Indeks Gap Rata-rata</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-lg font-black font-mono text-emerald-700">
                  +{((avgStudentScore - 77)).toFixed(1)}%
                </span>
                <span className="text-xs text-slate-500">Surplus</span>
              </div>
              <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">
                Status: Memenuhi Syarat Kelulusan CPL
              </span>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-slate-400 block text-[10px]">PIP Bina Mulia ke Lautan</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-sm font-extrabold text-cyan-800 truncate">
                  Aquatic-Terrestrial
                </span>
              </div>
              <span className="text-[10px] text-cyan-700 font-semibold block mt-0.5">
                SDG 14: Pola Kelautan Kepulauan
              </span>
            </div>
          </div>

          {/* TAB 1: SMART-GAP ANALYSIS WITH RECHARTS HEATMAP */}
          {activeTab === 'smartGap' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Gap Comparison Chart: ComposedChart (Target Line vs Real-time Bar) */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-100 gap-2">
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-500" />
                      <span>Smart-Gap Analysis: Target Simpel-CPL vs Nilai Real-Time SIRUBRIK</span>
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Evaluasi keselarasan kompetensi capaian mahasiswa berdasarkan rubrik asesmen autentik.
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] font-semibold">
                    <span className="flex items-center gap-1 text-slate-700">
                      <span className="w-3 h-3 rounded bg-blue-600 inline-block" />
                      <span>Real-Time SIRUBRIK</span>
                    </span>
                    <span className="flex items-center gap-1 text-slate-700">
                      <span className="w-3 h-0.5 bg-rose-500 inline-block" />
                      <span>Target Simpel-CPL</span>
                    </span>
                  </div>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={gapAnalysisData} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="cplCode" tick={{ fontSize: 11, fontWeight: 'bold' }} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                      <Tooltip
                        wrapperClassName="text-xs rounded-xl shadow-lg border border-slate-200"
                        formatter={(val: any) => [`${val}%`, '']}
                      />
                      <Bar dataKey="realtimeSIRUBRIK" name="Nilai Real-Time SIRUBRIK" radius={[6, 6, 0, 0]}>
                        {gapAnalysisData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.gap < 0 ? '#ef4444' : entry.gap >= 5 ? '#10b981' : '#2563eb'}
                          />
                        ))}
                      </Bar>
                      <Line
                        type="step"
                        dataKey="targetSimpelCPL"
                        name="Target Simpel-CPL"
                        stroke="#f43f5e"
                        strokeWidth={2.5}
                        dot={{ r: 4, fill: '#f43f5e' }}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Heatmap Matrix: Mahasiswa x CPL Capaian */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h4 className="font-bold text-slate-900 text-xs flex items-center gap-2">
                    <Flame className="w-4 h-4 text-rose-500" />
                    <span>Heatmap Interaktif Ketercapaian CPL Mahasiswa (Cohort Overview)</span>
                  </h4>
                  {/* Heatmap Legend */}
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded bg-emerald-600 inline-block" />
                      <span>Surplus Tinggi (&ge;85%)</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded bg-emerald-100 border border-emerald-300 inline-block" />
                      <span>Memenuhi (75-84%)</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded bg-amber-100 border border-amber-300 inline-block" />
                      <span>Borderline (70-74%)</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded bg-rose-500 inline-block" />
                      <span>Defisit (&lt;70%)</span>
                    </span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100/80 text-slate-700 font-bold border-b border-slate-200">
                        <th className="p-2.5">Nama Mahasiswa</th>
                        <th className="p-2.5 text-center">CPL-01 (Sikap)</th>
                        <th className="p-2.5 text-center">CPL-02 (Teori)</th>
                        <th className="p-2.5 text-center">CPL-03 (SIG)</th>
                        <th className="p-2.5 text-center">CPL-04 (Kebijakan)</th>
                        <th className="p-2.5 text-center">Rata-rata</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {cohortHeatmapMatrix.map((row, idx) => {
                        const rowAvg = (row.cpl1Score + row.cpl2Score + row.cpl3Score + row.cpl4Score) / 4;
                        const isCurrent = row.studentName === currentStudent.studentName.split(' ')[0];

                        return (
                          <tr
                            key={idx}
                            className={`transition cursor-pointer ${
                              isCurrent ? 'bg-blue-50/80 font-bold' : 'hover:bg-slate-50'
                            }`}
                            onClick={() => setSelectedStudentIndex(idx)}
                          >
                            <td className="p-2.5 font-medium text-slate-900 flex items-center gap-2">
                              {isCurrent && <span className="w-2 h-2 rounded-full bg-blue-600" />}
                              <span>{row.studentName}</span>
                            </td>
                            <td className="p-2.5 text-center">
                              <span
                                className={`px-2.5 py-1 rounded-md font-mono font-bold text-[11px] inline-block ${getHeatmapColor(
                                  row.cpl1Score,
                                  80
                                )}`}
                              >
                                {row.cpl1Score}%
                              </span>
                            </td>
                            <td className="p-2.5 text-center">
                              <span
                                className={`px-2.5 py-1 rounded-md font-mono font-bold text-[11px] inline-block ${getHeatmapColor(
                                  row.cpl2Score,
                                  75
                                )}`}
                              >
                                {row.cpl2Score}%
                              </span>
                            </td>
                            <td className="p-2.5 text-center">
                              <span
                                className={`px-2.5 py-1 rounded-md font-mono font-bold text-[11px] inline-block ${getHeatmapColor(
                                  row.cpl3Score,
                                  75
                                )}`}
                              >
                                {row.cpl3Score}%
                              </span>
                            </td>
                            <td className="p-2.5 text-center">
                              <span
                                className={`px-2.5 py-1 rounded-md font-mono font-bold text-[11px] inline-block ${getHeatmapColor(
                                  row.cpl4Score,
                                  78
                                )}`}
                              >
                                {row.cpl4Score}%
                              </span>
                            </td>
                            <td className="p-2.5 text-center font-mono font-black text-slate-800">
                              {rowAvg.toFixed(1)}%
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Diagnostic Card & Intelligent OBE Intervention */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h4 className="font-bold text-slate-900 text-xs flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <span>Rekomendasi Intervensi Pembelajaran &amp; Tindak Lanjut Asesmen</span>
                  </h4>
                  <span className="text-[10px] text-indigo-600 font-semibold">
                    Sistem Penjaminan Mutu Internal (SPMI)
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {gapAnalysisData.map((item) => (
                    <div
                      key={item.cplCode}
                      className={`p-3 rounded-xl border flex flex-col justify-between space-y-2 ${
                        item.gap < 0
                          ? 'bg-rose-50/60 border-rose-200'
                          : item.gap >= 5
                          ? 'bg-emerald-50/60 border-emerald-200'
                          : 'bg-blue-50/60 border-blue-200'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-slate-900 text-xs">
                            {item.cplCode} — {item.cplName}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              item.gap < 0
                                ? 'bg-rose-100 text-rose-800'
                                : item.gap >= 5
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            Gap: {item.gap > 0 ? `+${item.gap}` : item.gap}%
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-200/50 text-[11px] text-slate-800">
                        {item.gap < 0 ? (
                          <div className="flex items-start gap-1.5 text-rose-900">
                            <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-rose-600" />
                            <span>
                              <strong>Rekomendasi Remedial:</strong> Berikan penugasan berbasis studi kasus tambahan dan umpan balik formatif rubrik sebelum batas UAS.
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-start gap-1.5 text-emerald-900">
                            <CheckCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-emerald-600" />
                            <span>
                              <strong>Pengayaan Mandiri:</strong> Kompetensi melampaui target. Mahasiswa dapat dilibatkan dalam publikasi mini-riset maritim Maluku.
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TARGET KPI MONITOR (BINA MULIA KE LAUTAN) */}
          {activeTab === 'targetKpi' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <TargetKpiMonitor
                identity={identity}
                components={components}
                instruments={instruments}
              />
            </div>
          )}

          {/* TAB 3: DISTRIBUTION & SPIDER CHART */}
          {activeTab === 'distribution' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Charts Row: Radar Chart + Bar Chart */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* 1. Radar Chart: Profil Capaian Kompetensi */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <h4 className="font-bold text-slate-900 text-xs flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                      <span>Jaring Laba-Laba Ketercapaian CPL &amp; CPMK (Spider Chart)</span>
                    </h4>
                    <span className="text-[10px] text-slate-400">Target Min: 75%</span>
                  </div>

                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="75%" data={classRadarData}>
                        <PolarGrid stroke="#e2e8f0" />
                        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fill: '#334155' }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
                        <Radar
                          name="Standar SPMI (75%)"
                          dataKey="target"
                          stroke="#94a3b8"
                          fill="#94a3b8"
                          fillOpacity={0.15}
                          strokeDasharray="3 3"
                        />
                        <Radar
                          name="Rata-rata Kelas"
                          dataKey="rataRataKelas"
                          stroke="#0284c7"
                          fill="#0284c7"
                          fillOpacity={0.25}
                        />
                        <Radar
                          name={currentStudent.studentName.split(' ')[0]}
                          dataKey="mahasiswaTerpilih"
                          stroke="#10b981"
                          fill="#10b981"
                          fillOpacity={0.4}
                        />
                        <Tooltip wrapperClassName="text-xs" />
                        <Legend wrapperStyle={{ fontSize: 10, paddingTop: 10 }} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 2. Bar Chart: Skor per Sub-CPMK */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <h4 className="font-bold text-slate-900 text-xs flex items-center gap-2">
                      <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Performa Nilai per Sub-CPMK Mahasiswa Terpilih</span>
                    </h4>
                    <span className="text-[10px] font-mono font-bold text-emerald-700">Skala 0 - 100</span>
                  </div>

                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={classBarData} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                        <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                        <Tooltip wrapperClassName="text-xs" />
                        <ReferenceLine y={75} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'Ambang SPMI (75%)', fill: '#ef4444', fontSize: 9 }} />
                        <Bar dataKey="capaian" name="Skor Mahasiswa" fill="#2563eb" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Formative Feedback & Rubric Observations per Sub-CPMK */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h4 className="font-bold text-slate-900 text-xs flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-blue-600" />
                    <span>Rincian Umpan Balik Kualitatif Dosen per Sub-CPMK (Authentic Feedback)</span>
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    Mahasiswa: <strong>{currentStudent.studentName}</strong>
                  </span>
                </div>

                <div className="space-y-2.5">
                  {currentStudent.subCpmkScores.map((sc) => {
                    const isPassed = sc.score >= sc.target;
                    const scoreGrade = convertScoreToGrade(sc.score, identity.level);

                    return (
                      <div
                        key={sc.subCpmkCode}
                        className={`p-3.5 rounded-xl border transition ${
                          isPassed ? 'bg-slate-50/70 border-slate-200' : 'bg-rose-50/50 border-rose-200'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1.5 border-b border-slate-200/60">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-xs text-slate-900">
                              {sc.subCpmkCode}
                            </span>
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-100 text-blue-800">
                              {sc.bloomLevel}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-xs text-slate-800">
                              Skor: {sc.score} / 100
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                isPassed
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {scoreGrade.grade} • {isPassed ? 'Tercapai' : 'Perlu Penguatan'}
                            </span>
                          </div>
                        </div>

                        <div className="pt-2 text-xs text-slate-700 leading-relaxed flex items-start gap-2">
                          <span className="text-slate-400 shrink-0 font-semibold text-[11px]">Catatan Asesmen:</span>
                          <p className="text-[11px] text-slate-800 italic">{sc.feedback}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs transition"
          >
            Tutup Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
