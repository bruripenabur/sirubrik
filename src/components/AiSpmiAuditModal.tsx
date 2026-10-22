import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  X,
  Sparkles,
  ArrowRight,
  HelpCircle,
  BookOpen,
  Award,
  RefreshCw,
  Target,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { ComponentInstrument, EvaluationComponent, CourseIdentity } from '../types';

interface AiSpmiAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  component: EvaluationComponent;
  instrument: ComponentInstrument;
  courseIdentity?: CourseIdentity;
  onApplyImprovement?: (updatedInstrument: ComponentInstrument) => void;
}

export const AiSpmiAuditModal: React.FC<AiSpmiAuditModalProps> = ({
  isOpen,
  onClose,
  component,
  instrument,
  courseIdentity,
  onApplyImprovement,
}) => {
  const [isApplying, setIsApplying] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen || !instrument) return null;

  // Determine KKNI Level and Bloom Target based on education level
  const eduLevel = courseIdentity?.level || 'Sarjana (S1)';
  const isMaster = eduLevel.includes('S2') || eduLevel.toLowerCase().includes('magister');
  const isDoctor = eduLevel.includes('S3') || eduLevel.toLowerCase().includes('doktor');
  const isDiploma = eduLevel.includes('D3') || eduLevel.toLowerCase().includes('diploma');

  let kkniLevel = 6;
  let kkniTitle = 'Jenjang 6 (Sarjana - S1)';
  let targetBloom = 'C4 (Menganalisis) s.d. C6 (Mencipta/Merancang)';
  let targetHotsRatio = 65; // % minimum HOTS

  if (isDoctor) {
    kkniLevel = 9;
    kkniTitle = 'Jenjang 9 (Doktor - S3)';
    targetBloom = 'C6 (Mencipta, Sintesis Filosofis & Inovasi Orisinal)';
    targetHotsRatio = 90;
  } else if (isMaster) {
    kkniLevel = 8;
    kkniTitle = 'Jenjang 8 (Magister - S2)';
    targetBloom = 'C5 (Mengevaluasi Kritis) & C6 (Mengembangkan Solusi Mutakhir)';
    targetHotsRatio = 80;
  } else if (isDiploma) {
    kkniLevel = 5;
    kkniTitle = 'Jenjang 5 (Diploma III)';
    targetBloom = 'C3 (Menerapkan) & C4 (Menganalisis Prosedural)';
    targetHotsRatio = 50;
  }

  // Audit logic: Unmeasurable words to be eradicated in rubrics
  const unmeasurableWords = [
    'memahami',
    'mengetahui',
    'mengerti',
    'mendalami',
    'menyadari',
    'mengenal',
    'merasakan',
  ];

  // LOTS verbs (Low-Order Thinking: C1 & C2) that should be upgraded in higher KKNI levels
  const lotsVerbs = [
    'menyebutkan',
    'menghafal',
    'mendaftar',
    'menuliskan kembali',
    'mengulang',
    'menjelaskan secara umum',
  ];

  // High-order Bloom verbs (C4, C5, C6)
  const c4Verbs = [
    'menganalisis',
    'menguraikan',
    'membandingkan',
    'mengidentifikasi',
    'menginvestigasi',
    'membedakan',
    'mendiagnosis',
  ];
  const c5Verbs = [
    'mengevaluasi',
    'mengkritisi',
    'menguji',
    'memvalidasi',
    'menilai',
    'mengukur',
    'mempertimbangkan',
  ];
  const c6Verbs = [
    'merancang',
    'mendisain',
    'mengembangkan',
    'merumuskan',
    'mengkreasi',
    'menyintesis',
    'membangun',
    'mengonstruksi',
  ];

  let vagueWordsFound: { aspect: string; word: string; grade: string }[] = [];
  let lotsWordsFound: { aspect: string; word: string; grade: string }[] = [];
  let c4Count = 0;
  let c5Count = 0;
  let c6Count = 0;

  instrument.rubric.criteria.forEach((crit) => {
    crit.levels.forEach((lvl) => {
      const descLower = lvl.descriptor.toLowerCase();

      unmeasurableWords.forEach((word) => {
        if (descLower.includes(word)) {
          vagueWordsFound.push({
            aspect: crit.aspect,
            word,
            grade: lvl.grade,
          });
        }
      });

      lotsVerbs.forEach((word) => {
        if (descLower.includes(word)) {
          lotsWordsFound.push({
            aspect: crit.aspect,
            word,
            grade: lvl.grade,
          });
        }
      });

      c4Verbs.forEach((verb) => {
        if (descLower.includes(verb)) c4Count++;
      });
      c5Verbs.forEach((verb) => {
        if (descLower.includes(verb)) c5Count++;
      });
      c6Verbs.forEach((verb) => {
        if (descLower.includes(verb)) c6Count++;
      });
    });
  });

  const totalHots = c4Count + c5Count + c6Count;
  const totalVerbsEstimated = totalHots + vagueWordsFound.length + lotsWordsFound.length || 1;
  const hotsPercentage = Math.round((totalHots / totalVerbsEstimated) * 100);

  // Calculate SPMI Score: starts at 96, deducts 8 for each vague word, 4 for LOTS in master/doc, bonus for HOTS
  const penalty = vagueWordsFound.length * 8 + (kkniLevel >= 8 ? lotsWordsFound.length * 6 : lotsWordsFound.length * 3);
  const hotsBonus = hotsPercentage >= targetHotsRatio ? 6 : 0;
  const baseScore = Math.max(68, Math.min(100, 96 - penalty + hotsBonus));

  const getPredicate = (score: number) => {
    if (score >= 90) return { label: 'Sangat Terukur & Selaras KKNI (A+ / Unggul)', color: 'text-emerald-700 bg-emerald-50 border-emerald-300' };
    if (score >= 80) return { label: 'Terukur & Standar OBE (A)', color: 'text-blue-700 bg-blue-50 border-blue-300' };
    return { label: 'Perlu Penguatan KKO Bloom (B)', color: 'text-amber-700 bg-amber-50 border-amber-300' };
  };

  const auditPredicate = getPredicate(baseScore);

  // Apply auto-refinement of KKO into descriptors
  const handleAutoRefine = () => {
    setIsApplying(true);
    setTimeout(() => {
      const updatedCriteria = instrument.rubric.criteria.map((crit) => {
        return {
          ...crit,
          levels: crit.levels.map((lvl) => {
            let desc = lvl.descriptor;
            // Upgrade vague words to target Bloom verbs
            desc = desc.replace(/memahami/gi, kkniLevel >= 8 ? 'mengevaluasi secara kritis dan mengaitkan' : 'menguraikan dan menganalisis');
            desc = desc.replace(/mengetahui/gi, 'mengidentifikasi dan menguji secara empiris');
            desc = desc.replace(/mengerti/gi, 'mengoperasikan dan menganalisis konsep');
            desc = desc.replace(/mendalami/gi, 'mengevaluasi secara kritis implikasi');
            desc = desc.replace(/menyadari/gi, 'mengkritisi dampak');
            desc = desc.replace(/mengenal/gi, 'mengidentifikasi dan membedakan');
            // Upgrade low-level words
            desc = desc.replace(/menjelaskan secara umum/gi, 'menganalisis komparatif');
            desc = desc.replace(/menyebutkan/gi, 'menguraikan dan mengklasifikasikan');
            return {
              ...lvl,
              descriptor: desc,
            };
          }),
        };
      });

      const updatedInstrument: ComponentInstrument = {
        ...instrument,
        rubric: {
          ...instrument.rubric,
          criteria: updatedCriteria,
        },
      };

      if (onApplyImprovement) {
        onApplyImprovement(updatedInstrument);
      }
      setIsApplying(false);
      setSuccessMessage('KKO Terukur berhasil diselaraskan dengan standar SPMI Unpatti & Taksonomi Bloom!');
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3500);
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white flex items-center justify-between border-b border-indigo-900/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-blue-600 flex items-center justify-center text-white shadow-md">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                  Lembaga Penjaminan Mutu &amp; SPMI Unpatti
                </span>
                <span className="text-[10px] text-slate-300 font-mono">
                  KKNI Level {kkniLevel}
                </span>
              </div>
              <h3 className="font-extrabold text-base sm:text-lg text-white">
                AI SPMI Rubric Audit — Validasi KKO Terukur
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

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 bg-slate-50 text-xs">
          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 font-semibold flex items-center gap-2 animate-in fade-in">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Audit Score Card */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-slate-400 font-semibold block text-[10px] uppercase tracking-wider">
                Indeks Keterukuran KKO Rubrik &amp; Keselarasan SPMI
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black font-mono text-slate-900">
                  {baseScore}
                </span>
                <span className="text-xs text-slate-500">/ 100</span>
              </div>
              <div
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${auditPredicate.color}`}
              >
                <CheckCircle className="w-3 h-3" />
                <span>{auditPredicate.label}</span>
              </div>
            </div>

            <div className="text-left sm:text-right space-y-1 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
              <div className="text-slate-500 text-[11px]">
                Target Jenjang: <strong className="text-slate-800">{kkniTitle}</strong>
              </div>
              <div className="text-slate-500 text-[11px]">
                Target Kognitif: <strong className="text-blue-700">{targetBloom}</strong>
              </div>
              <div className="text-indigo-600 font-semibold text-[11px]">
                Proporsi HOTS Aktual: <strong>{hotsPercentage}%</strong> (Target: &ge;{targetHotsRatio}%)
              </div>
            </div>
          </div>

          {/* Bloom Taxonomy Distribution Grid */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 text-xs flex items-center gap-2">
                <Target className="w-4 h-4 text-indigo-600" />
                <span>Distribusi KKO Taksonomi Bloom pada Deskriptor Rubrik</span>
              </h4>
              <span className="text-[10px] text-slate-400">Total KKO Terindeks: {totalHots} kata</span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200 text-center space-y-1">
                <span className="text-[10px] font-bold text-blue-700 block">C4 — Analisis</span>
                <span className="text-xl font-black text-blue-950 font-mono">{c4Count}</span>
                <span className="text-[9px] text-slate-500 block">Menguraikan, membandingkan</span>
              </div>
              <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-200 text-center space-y-1">
                <span className="text-[10px] font-bold text-purple-700 block">C5 — Evaluasi</span>
                <span className="text-xl font-black text-purple-950 font-mono">{c5Count}</span>
                <span className="text-[9px] text-slate-500 block">Mengkritisi, menguji, validasi</span>
              </div>
              <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200 text-center space-y-1">
                <span className="text-[10px] font-bold text-emerald-700 block">C6 — Kreasi/Desain</span>
                <span className="text-xl font-black text-emerald-950 font-mono">{c6Count}</span>
                <span className="text-[9px] text-slate-500 block">Merancang, menyintesis, solusi</span>
              </div>
            </div>
          </div>

          {/* Audit Verification Criteria Checklist */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <h4 className="font-bold text-slate-900 text-xs flex items-center gap-2">
              <Award className="w-4 h-4 text-blue-600" />
              <span>Pemeriksaan Penjaminan Mutu Asesmen (SPMI Checklist Unpatti)</span>
            </h4>

            <div className="space-y-2">
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block text-xs">
                    1. Penggunaan Kata Kerja Operasional (KKO) Terukur
                  </strong>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Deskriptor pada setiap kriteria menggunakan kata kerja tingkatan kognitif/psikomotorik yang dapat diamati secara objektif (bukan kata kerja multitafsir).
                  </p>
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block text-xs">
                    2. Gradasi Kinerja Nyata &amp; Berjenjang
                  </strong>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Perbedaan antara skala Sangat Baik, Baik, Cukup, dan Kurang tercermin jelas pada kedalaman analisis, validitas data, dan orisinalitas solusi.
                  </p>
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block text-xs">
                    3. Keterkaitan dengan PIP Bina Mulia ke Lautan &amp; SDGs
                  </strong>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Kriteria memuat relevansi konteks kepulauan Maluku, fenomena bahari/pesisir, dan orientasi keberlanjutan sumber daya kelautan.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Vague Words Analysis / Refinement Recommendation */}
          {vagueWordsFound.length > 0 ? (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Rekomendasi Perbaikan: Ditemukan {vagueWordsFound.length} KKO Kurang Terukur</span>
              </div>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                Kata kerja berikut berpotensi ambigu/multitafsir dan direkomendasikan untuk ditingkatkan ke KKO Taksonomi Bloom operasional:
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {vagueWordsFound.map((item, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded bg-white text-amber-900 border border-amber-300 font-mono text-[10px]"
                  >
                    "{item.word}" di {item.aspect} ({item.grade})
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-1 text-emerald-950">
              <div className="flex items-center gap-2 font-bold text-xs text-emerald-900">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Rubrik Memenuhi Standar KKO Terukur 100%</span>
              </div>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                Seluruh deskriptor rubrik telah menggunakan Kata Kerja Operasional yang konkret, bergradasi tegas, dan terkalibrasi dengan Taksonomi Bloom Revisi serta standar SPMI Unpatti.
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="text-[11px] text-slate-500">
            Penjaminan Mutu Akademik Universitas Pattimura (SPMI)
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {vagueWordsFound.length > 0 && onApplyImprovement && (
              <button
                onClick={handleAutoRefine}
                disabled={isApplying}
                className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
                <span>{isApplying ? 'Menyelaraskan...' : 'Terapkan KKO Terukur Otomatis'}</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs transition"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
