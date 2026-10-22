import React, { useState } from 'react';
import {
  CourseIdentity,
  EvaluationComponent,
  ComponentInstrument,
} from '../types';
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Waves,
  ShieldCheck,
  Target,
  Sparkles,
  BookOpen,
  Anchor,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Zap,
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { validateEvaluationComponents } from '../utils/regulatoryValidator';

interface TargetKpiMonitorProps {
  identity: CourseIdentity;
  components: EvaluationComponent[];
  instruments?: Record<string, ComponentInstrument>;
}

export const TargetKpiMonitor: React.FC<TargetKpiMonitorProps> = ({
  identity,
  components,
  instruments = {},
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'bmk_compliant' | 'needs_improvement'>('all');

  const validation = validateEvaluationComponents(components);

  // Marine & coastal keywords for detecting "Bina Mulia ke Lautan" alignment
  const BMK_KEYWORDS = [
    'laut', 'pesisir', 'maritim', 'oseanografi', 'perikanan', 'pulau', 'kepulauan',
    'nelayan', 'sasi', 'mangrove', 'terumbu', 'karang', 'terestrial', 'akuatik',
    'maluku', 'banda', 'seram', 'ambon', 'pelayaran', 'biota', 'sdg 14', 'perkapalan',
    'bahari', 'zppi', 'klorofil', 'spl', 'arus', 'salinitas', 'pasang', 'surut'
  ];

  // Evaluate each component's rubrics against "Bina Mulia ke Lautan" criteria
  const evaluatedRubrics = components.map((comp) => {
    const inst = instruments[comp.id];
    const taskDetails = inst?.taskDetails;
    const allText = `${comp.name} ${comp.description || ''} ${taskDetails?.name || ''} ${taskDetails?.caseOrProblemText || ''} ${taskDetails?.pipSdgsRelevance || ''} ${taskDetails?.instructions || ''} ${(comp.subCpmkList || []).join(' ')}`.toLowerCase();

    // Check matched keywords
    const matchedKeywords = BMK_KEYWORDS.filter((kw) => allText.includes(kw));
    const isBmkCompliant = matchedKeywords.length >= 2 || (taskDetails?.pipSdgsRelevance && taskDetails.pipSdgsRelevance.length > 15);

    // Check HOTS (C4, C5, C6)
    const hasHots = (comp.bloomLevels || []).some(
      (b) => b.includes('C4') || b.includes('C5') || b.includes('C6')
    );

    // Rubric criterion count
    const criteriaCount = inst?.rubric?.criteria?.length || 0;
    const isComplete = !!inst && criteriaCount >= 2;

    return {
      component: comp,
      instrument: inst,
      matchedKeywords,
      isBmkCompliant,
      hasHots,
      isComplete,
      score: isBmkCompliant && hasHots && isComplete ? 100 : isBmkCompliant ? 80 : hasHots ? 65 : 45,
    };
  });

  const totalCompletedRubrics = evaluatedRubrics.filter((r) => r.isComplete).length;
  const completedBmkCompliant = evaluatedRubrics.filter((r) => r.isComplete && r.isBmkCompliant).length;

  // Percentage of completed rubrics meeting Bina Mulia ke Lautan
  const bmkPercentage = totalCompletedRubrics > 0
    ? Math.round((completedBmkCompliant / totalCompletedRubrics) * 100)
    : evaluatedRubrics.length > 0
    ? Math.round((evaluatedRubrics.filter((r) => r.isBmkCompliant).length / evaluatedRubrics.length) * 100)
    : 85; // baseline

  // Pasal 47 Case & Project Compliance
  const isPasal47Met = validation.caseProjectWeight >= 50;

  // HOTS Rubric Coverage
  const hotsCount = evaluatedRubrics.filter((r) => r.hasHots).length;
  const hotsPercentage = evaluatedRubrics.length > 0
    ? Math.round((hotsCount / evaluatedRubrics.length) * 100)
    : 80;

  // Overall Composite Adherence Index (Unpatti Academic Standards)
  const compositeIndex = Math.min(
    100,
    Math.round(
      bmkPercentage * 0.4 +
      (isPasal47Met ? 100 : (validation.caseProjectWeight / 50) * 100) * 0.35 +
      hotsPercentage * 0.25
    )
  );

  // Gauge Chart Data (Half-donut gauge: 0 to 100)
  // Recharts Pie with startAngle=180, endAngle=0
  const gaugeNeedleValue = Math.min(Math.max(bmkPercentage, 0), 100);
  const gaugeData = [
    { name: 'Kritis (<60%)', value: 60, color: '#f43f5e' }, // Rose/Red
    { name: 'Moderat (60-74%)', value: 15, color: '#f59e0b' }, // Amber
    { name: 'Sangat Baik (75-100%)', value: 25, color: '#10b981' }, // Emerald
  ];

  // Pillar Bar Data
  const pillarData = [
    { name: 'PIP Bina Mulia', capaian: bmkPercentage, target: 80, color: '#0284c7' },
    { name: 'Pasal 47 (>=50%)', capaian: validation.caseProjectWeight, target: 50, color: '#2563eb' },
    { name: 'HOTS KKNI (C4-C6)', capaian: hotsPercentage, target: 75, color: '#8b5cf6' },
    { name: 'Kelengkapan Rubrik', capaian: Math.round((totalCompletedRubrics / (components.length || 1)) * 100), target: 100, color: '#059669' },
  ];

  const filteredRubrics = evaluatedRubrics.filter((item) => {
    if (filterMode === 'bmk_compliant') return item.isBmkCompliant;
    if (filterMode === 'needs_improvement') return !item.isBmkCompliant || !item.hasHots;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Standard Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-5 sm:p-6 rounded-2xl border border-blue-900/40 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 flex items-center gap-1.5">
                <Anchor className="w-3 h-3" />
                <span>Target KPI Monitor • PIP Bina Mulia ke Lautan</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                Peraturan Rektor No. 12/2026
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-black tracking-tight text-white">
              Monitoring Kepatuhan Standar Akademik &amp; Kriteria Maritim Unpatti
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Visualisasi real-time kepatuhan seluruh instrumen evaluasi dan rubrik penilaian terhadap Pola Ilmiah Pokok (PIP) <em>"Bina Mulia ke Lautan"</em> serta standar akreditasi unggul SPMI Universitas Pattimura.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto shrink-0 bg-white/5 border border-white/10 p-3.5 rounded-xl backdrop-blur-xs">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">Indeks Kepatuhan Total</span>
              <span className="text-2xl font-black font-mono text-cyan-300">
                {compositeIndex}%
              </span>
            </div>
            <div className={`w-3.5 h-3.5 rounded-full ${compositeIndex >= 75 ? 'bg-emerald-400 shadow-md shadow-emerald-500/50' : 'bg-amber-400'} animate-pulse`} />
          </div>
        </div>
      </div>

      {/* Main Grid: Gauge Chart & Pillar Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Gauge Chart Column */}
        <div className="lg:col-span-5 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-100 text-cyan-700 flex items-center justify-center">
                  <Waves className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    Gauge Capaian 'Bina Mulia ke Lautan'
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Persentase rubrik terverifikasi kriteria maritim/kepulauan
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-800 border border-cyan-200 font-mono">
                Target: &ge; 80%
              </span>
            </div>

            {/* Half-Donut Gauge Graphic */}
            <div className="relative h-48 w-full flex items-center justify-center pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={gaugeData}
                    cx="50%"
                    cy="85%"
                    startAngle={180}
                    endAngle={0}
                    innerRadius={75}
                    outerRadius={105}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {gaugeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val: any, name: any) => [`${val}%`, String(name || '')]} />
                </PieChart>
              </ResponsiveContainer>

              {/* Gauge Center Readout */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-center pointer-events-none">
                <div className="text-3xl sm:text-4xl font-black font-mono text-slate-900 leading-none">
                  {bmkPercentage}%
                </div>
                <div className="text-[11px] font-bold text-slate-600 mt-1 flex items-center justify-center gap-1">
                  {bmkPercentage >= 80 ? (
                    <span className="text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Target Terpenuhi
                    </span>
                  ) : (
                    <span className="text-amber-700 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Perlu Pengayaan (+{80 - bmkPercentage}%)
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Gauge Zones Legend */}
            <div className="grid grid-cols-3 gap-2 text-center pt-3 border-t border-slate-100">
              <div className="p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-900 text-[10px]">
                <span className="font-bold block">&lt; 60%</span>
                <span className="text-[9px] text-rose-700">Substansi Kurang</span>
              </div>
              <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-[10px]">
                <span className="font-bold block">60% - 79%</span>
                <span className="text-[9px] text-amber-700">Cukup / Parsial</span>
              </div>
              <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-[10px]">
                <span className="font-bold block">&ge; 80%</span>
                <span className="text-[9px] text-emerald-700">Unggul BMK</span>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-blue-50/80 rounded-xl border border-blue-200 text-xs text-blue-900 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Kriteria PIP BMK:</strong> Rubrik wajib menguji kemampuan mahasiswa menganalisis tantangan perikanan tangkap, oseanografi, sasi lokal, atau tata kelola kepulauan Maluku.
            </p>
          </div>
        </div>

        {/* 4 Pillars Progress Bar Chart */}
        <div className="lg:col-span-7 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
            <div>
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-600" />
                <span>4 Pilar Standar Evaluasi Akademik Universitas Pattimura</span>
              </h4>
              <p className="text-[11px] text-slate-500">
                Pencapaian metrik terhadap standar SPMI dan SK Rektor 2026
              </p>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Jenjang: <strong>{identity.level}</strong>
            </span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pillarData} margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fontWeight: 'bold' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(val: any, name: any) => [
                    `${val}%`,
                    name === 'capaian' ? 'Realisasi Saat Ini' : 'Target Standar',
                  ]}
                />
                <Bar dataKey="capaian" name="Realisasi Saat Ini" fill="#2563eb" radius={[6, 6, 0, 0]} />
                <Bar dataKey="target" name="Target Standar" fill="#94a3b8" radius={[6, 6, 0, 0]} opacity={0.4} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Metrics Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 block">Kasus &amp; Proyek</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-base font-black font-mono text-blue-900">
                  {validation.caseProjectWeight}%
                </span>
                <span className="text-[10px] text-slate-400">/ &ge;50%</span>
              </div>
              <span className={`text-[10px] font-bold block ${validation.caseProjectWeight >= 50 ? 'text-emerald-700' : 'text-rose-600'}`}>
                {validation.caseProjectWeight >= 50 ? 'Lolos Pasal 47' : 'Belum Memenuhi'}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 block">KKO HOTS (C4-C6)</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-base font-black font-mono text-purple-900">
                  {hotsPercentage}%
                </span>
                <span className="text-[10px] text-slate-400">/ &ge;75%</span>
              </div>
              <span className="text-[10px] font-bold text-purple-700 block">
                {hotsCount} dari {evaluatedRubrics.length} Komponen
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 block">Rubrik Siap Pakai</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-base font-black font-mono text-emerald-900">
                  {totalCompletedRubrics}
                </span>
                <span className="text-[10px] text-slate-400">/ {components.length} MK</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 block">
                {Math.round((totalCompletedRubrics / (components.length || 1)) * 100)}% Lengkap
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 block">Bina Mulia Matched</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-base font-black font-mono text-cyan-900">
                  {completedBmkCompliant}
                </span>
                <span className="text-[10px] text-slate-400">Komponen</span>
              </div>
              <span className="text-[10px] font-bold text-cyan-700 block">
                Konteks Bahari Kuat
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Itemized Rubric Audit Table */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
          <div>
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Matriks Audit Kepatuhan Rubrik per Komponen Evaluasi</span>
            </h4>
            <p className="text-[11px] text-slate-500">
              Pemeriksaan rinci kata kunci kemaritiman, level Bloom, dan status rubrik analitis
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 self-start sm:self-auto">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                filterMode === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Semua ({evaluatedRubrics.length})
            </button>
            <button
              onClick={() => setFilterMode('bmk_compliant')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                filterMode === 'bmk_compliant'
                  ? 'bg-cyan-700 text-white'
                  : 'bg-cyan-50 text-cyan-800 hover:bg-cyan-100'
              }`}
            >
              <Waves className="w-3 h-3" />
              <span>BMK Memenuhi ({completedBmkCompliant})</span>
            </button>
            <button
              onClick={() => setFilterMode('needs_improvement')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                filterMode === 'needs_improvement'
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
              }`}
            >
              <AlertTriangle className="w-3 h-3" />
              <span>Perlu Pengayaan ({evaluatedRubrics.length - completedBmkCompliant})</span>
            </button>
          </div>
        </div>

        {/* Table List */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700">
                <th className="py-2.5 px-3 font-bold w-12 text-center">No</th>
                <th className="py-2.5 px-3 font-bold">Komponen Evaluasi &amp; Jenis</th>
                <th className="py-2.5 px-3 font-bold text-center">Bobot</th>
                <th className="py-2.5 px-3 font-bold">Level Bloom &amp; KKO</th>
                <th className="py-2.5 px-3 font-bold">Kepatuhan PIP Bina Mulia ke Lautan</th>
                <th className="py-2.5 px-3 font-bold text-center">Status SPMI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRubrics.map((item, idx) => {
                const comp = item.component;
                return (
                  <tr key={comp.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-3 text-center font-mono font-bold text-slate-500">
                      {idx + 1}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{comp.name}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <span className="capitalize">{comp.category.replace('_', ' ')}</span>
                        <span>•</span>
                        <span>{comp.suggestedWeeks}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-blue-900">
                      {comp.weight}%
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex flex-wrap gap-1">
                        {(comp.bloomLevels || []).map((b, bIdx) => {
                          const isHots = b.includes('C4') || b.includes('C5') || b.includes('C6');
                          return (
                            <span
                              key={bIdx}
                              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                isHots
                                  ? 'bg-purple-100 text-purple-800 border border-purple-200'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {b}
                            </span>
                          );
                        })}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      {item.isBmkCompliant ? (
                        <div className="space-y-1">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-cyan-100 text-cyan-900 border border-cyan-300">
                            <CheckCircle2 className="w-3 h-3 text-cyan-700" />
                            <span>Terintegrasi PIP BMK</span>
                          </span>
                          <div className="text-[10px] text-slate-600 flex flex-wrap gap-1">
                            {item.matchedKeywords.slice(0, 3).map((kw, kwIdx) => (
                              <span key={kwIdx} className="bg-slate-100 px-1 py-0.2 rounded text-slate-700 font-mono">
                                #{kw}
                              </span>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                            <AlertTriangle className="w-3 h-3 text-amber-700" />
                            <span>Perlu Pengayaan Maritim</span>
                          </span>
                          <p className="text-[10px] text-slate-500 italic">
                            Sisipkan data oseanografi/kasus pesisir Maluku
                          </p>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {item.isComplete ? (
                        <span className="px-2 py-1 rounded-lg text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          Rubrik Terverifikasi
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded-lg text-[10px] font-medium bg-slate-100 text-slate-600">
                          Draft Belum Lengkap
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
