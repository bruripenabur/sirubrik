import React, { useState } from 'react';
import {
  ComponentInstrument,
  CourseIdentity,
  EvaluationComponent,
  RubricCriterion,
} from '../types';
import {
  FileText,
  Sparkles,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Edit2,
  Save,
  RotateCcw,
  BookOpen,
  Calculator,
  Layers,
  Award,
  Globe2,
  Check,
  AlertCircle,
  HelpCircle,
  MessageSquare,
  ShieldCheck,
  Printer,
} from 'lucide-react';
import {
  isPascasarjanaLevel,
  SARJANA_GRADE_SCALES,
  PASCASARJANA_GRADE_SCALES,
  convertScoreToGrade,
} from '../utils/regulatoryValidator';
import { SingleComponentPrintModal } from './SingleComponentPrintModal';
import { AiSpmiAuditModal } from './AiSpmiAuditModal';

interface Stage3DraftingProps {
  identity: CourseIdentity;
  components: EvaluationComponent[];
  instruments: Record<string, ComponentInstrument>;
  activeComponentIndex: number;
  onSelectComponentIndex: (index: number) => void;
  onSaveInstrument: (componentId: string, instrument: ComponentInstrument) => void;
  onGenerateInstrument: (componentId: string, feedback?: string) => Promise<void>;
  isGenerating: boolean;
  onApproveAndNext: () => void;
  onCompleteAllToDossier: () => void;
}

export const Stage3Drafting: React.FC<Stage3DraftingProps> = ({
  identity,
  components,
  instruments,
  activeComponentIndex,
  onSelectComponentIndex,
  onSaveInstrument,
  onGenerateInstrument,
  isGenerating,
  onApproveAndNext,
  onCompleteAllToDossier,
}) => {
  const currentComp = components[activeComponentIndex] || components[0];
  const currentInstrument = instruments[currentComp?.id];
  const isPasca = isPascasarjanaLevel(identity.level);

  const [isEditing, setIsEditing] = useState(false);
  const [editedInstrument, setEditedInstrument] = useState<ComponentInstrument | null>(
    currentInstrument || null
  );
  const [feedbackPrompt, setFeedbackPrompt] = useState('');
  const [showScorerSimulator, setShowScorerSimulator] = useState(false);
  const [selectedScores, setSelectedScores] = useState<Record<string, number>>({});
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isSpmiAuditOpen, setIsSpmiAuditOpen] = useState(false);

  // When active component changes, sync local edited instrument
  React.useEffect(() => {
    setEditedInstrument(instruments[currentComp?.id] || null);
    setIsEditing(false);
    setFeedbackPrompt('');
    setSelectedScores({});
  }, [currentComp?.id, instruments]);

  const activeGradeScales = isPasca ? PASCASARJANA_GRADE_SCALES : SARJANA_GRADE_SCALES;

  // Handle inline edit save
  const handleSaveEdit = () => {
    if (editedInstrument && currentComp) {
      onSaveInstrument(currentComp.id, editedInstrument);
      setIsEditing(false);
    }
  };

  // Quick revision request
  const handleRequestRevision = async (text: string) => {
    if (!currentComp) return;
    await onGenerateInstrument(currentComp.id, text);
    setFeedbackPrompt('');
  };

  // Simulator calculation
  const calculateSimulatedScore = () => {
    if (!currentInstrument) return 0;
    let total = 0;
    let totalWeight = 0;
    for (const crit of currentInstrument.rubric.criteria) {
      const score = selectedScores[crit.id] ?? 85;
      total += score * (crit.weight / 100);
      totalWeight += crit.weight;
    }
    return totalWeight > 0 ? (total / totalWeight) * 100 : 0;
  };

  const simulatedScore = calculateSimulatedScore();
  const simulatedGrade = convertScoreToGrade(simulatedScore, identity.level);

  const isLastComponent = activeComponentIndex === components.length - 1;
  const nextComponentName = !isLastComponent
    ? components[activeComponentIndex + 1]?.name
    : null;

  return (
    <div className="space-y-6">
      {/* Step Stepper Header */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Tahap 3: Penulisan Instrumen &amp; Rubrik Bertahap</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
              Komponen {activeComponentIndex + 1} dari {components.length}: {currentComp?.name}
            </h3>
            <p className="text-xs text-slate-500">
              Penyusunan instrumen evaluasi terperinci, naskah kasus/soal HOTS, dan rubrik analitis bergradasi resmi Unpatti.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 font-mono">
              Bobot MK: {currentComp?.weight}%
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-mono">
              {currentComp?.suggestedWeeks}
            </span>
          </div>
        </div>

        {/* Component Switcher Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 border-t border-slate-100">
          {components.map((comp, idx) => {
            const hasInst = !!instruments[comp.id];
            const isApproved = instruments[comp.id]?.isApproved;
            const isCurrent = idx === activeComponentIndex;

            return (
              <button
                key={comp.id}
                onClick={() => onSelectComponentIndex(idx)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  isCurrent
                    ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-500/30'
                    : hasInst
                    ? 'bg-blue-50 text-blue-900 hover:bg-blue-100 border border-blue-200'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{idx + 1}.</span>
                <span className="truncate max-w-[120px]">{comp.name}</span>
                {isApproved ? (
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                ) : hasInst ? (
                  <Check className="w-3.5 h-3.5 text-blue-300" />
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Drafting Canvas or Empty State */}
      {!currentInstrument ? (
        <div className="bg-white rounded-2xl p-10 border-2 border-dashed border-slate-300 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-inner">
            <Sparkles className="w-7 h-7" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h4 className="font-bold text-slate-900 text-base">
              Instrumen untuk "{currentComp?.name}" Belum Dibuat
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Sistem Konsultan OBE Unpatti akan menyusun deskripsi tugas, keterkaitan PIP Bina Mulia ke Lautan, soal/naskah kasus HOTS, serta matriks rubrik analitis bergradasi sesuai {identity.level}.
            </p>
          </div>
          <button
            onClick={() => onGenerateInstrument(currentComp.id)}
            disabled={isGenerating}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-blue-500/20 disabled:opacity-50 transition"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Menyusun Instrumen &amp; Rubrik Lengkap...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Susun Instrumen &amp; Rubrik Komponen Ini</span>
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Section 1: Rincian Tugas / Instrumen Evaluasi */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <h4 className="font-bold text-slate-900 text-base">
                  1. Rincian Tugas &amp; Instrumen Evaluasi Pembelajaran
                </h4>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setIsPrintModalOpen(true)}
                  className="text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg shadow-2xs transition"
                  title="Cetak atau ekspor instrumen dan rubrik komponen ini ke format PDF/Word resmi"
                >
                  <Printer className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Cetak / Ekspor PDF Komponen Ini</span>
                </button>

                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-blue-300 transition"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>{isEditing ? 'Batal Edit' : 'Edit Teks Langsung'}</span>
                </button>
                {isEditing && (
                  <button
                    onClick={handleSaveEdit}
                    className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg shadow-xs transition"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Simpan Perubahan</span>
                  </button>
                )}
              </div>
            </div>

            {isEditing && editedInstrument ? (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Judul / Nama Tugas</label>
                  <input
                    type="text"
                    value={editedInstrument.taskDetails.name}
                    onChange={(e) =>
                      setEditedInstrument({
                        ...editedInstrument,
                        taskDetails: { ...editedInstrument.taskDetails, name: e.target.value },
                      })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-semibold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Bentuk Evaluasi</label>
                  <input
                    type="text"
                    value={editedInstrument.taskDetails.taskType}
                    onChange={(e) =>
                      setEditedInstrument({
                        ...editedInstrument,
                        taskDetails: { ...editedInstrument.taskDetails, taskType: e.target.value },
                      })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Sub-CPMK &amp; Indikator</label>
                  <input
                    type="text"
                    value={editedInstrument.taskDetails.subCpmk}
                    onChange={(e) =>
                      setEditedInstrument({
                        ...editedInstrument,
                        taskDetails: { ...editedInstrument.taskDetails, subCpmk: e.target.value },
                      })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 mb-2"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Petunjuk Pengerjaan &amp; Batas Waktu</label>
                  <textarea
                    rows={4}
                    value={editedInstrument.taskDetails.instructions}
                    onChange={(e) =>
                      setEditedInstrument({
                        ...editedInstrument,
                        taskDetails: { ...editedInstrument.taskDetails, instructions: e.target.value },
                      })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Soal / Naskah Kasus / Instruksi HOTS</label>
                  <textarea
                    rows={6}
                    value={editedInstrument.taskDetails.caseOrProblemText}
                    onChange={(e) =>
                      setEditedInstrument({
                        ...editedInstrument,
                        taskDetails: { ...editedInstrument.taskDetails, caseOrProblemText: e.target.value },
                      })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono text-xs"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                {/* Meta details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Nama Asesmen</span>
                    <strong className="text-slate-900 text-sm">
                      {currentInstrument.taskDetails.name}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Bentuk Tugas / Evaluasi</span>
                    <span className="font-semibold text-blue-700">
                      {currentInstrument.taskDetails.taskType}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Alokasi Waktu &amp; Batas Akhir</span>
                    <span className="font-semibold text-slate-800">
                      {currentInstrument.taskDetails.deadline || currentComp.suggestedWeeks}
                    </span>
                  </div>
                </div>

                {/* Sub-CPMK and PIP BMK */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3.5 bg-blue-50/70 rounded-xl border border-blue-100 space-y-1">
                    <span className="font-bold text-blue-900 block text-[11px]">
                      Sub-CPMK &amp; Indikator Penilaian:
                    </span>
                    <p className="text-blue-950 text-xs font-medium">
                      {currentInstrument.taskDetails.subCpmk}
                    </p>
                    {currentInstrument.taskDetails.indicators?.length > 0 && (
                      <ul className="text-slate-700 text-[11px] list-disc list-inside space-y-0.5 pt-1">
                        {currentInstrument.taskDetails.indicators.map((ind, i) => (
                          <li key={i}>{ind}</li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="p-3.5 bg-cyan-50/70 rounded-xl border border-cyan-100 space-y-1">
                    <span className="font-bold text-cyan-900 flex items-center gap-1.5 text-[11px]">
                      <Globe2 className="w-3.5 h-3.5 text-cyan-600" />
                      <span>Integrasi PIP Bina Mulia ke Lautan &amp; SDGs:</span>
                    </span>
                    <p className="text-cyan-950 text-xs">
                      {currentInstrument.taskDetails.pipSdgsRelevance || identity.pipFocus}
                    </p>
                  </div>
                </div>

                {/* Instructions & Object Garapan */}
                <div className="space-y-2">
                  <div className="font-bold text-slate-800 text-xs">
                    Petunjuk Pengerjaan &amp; Objek Garapan:
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 leading-relaxed whitespace-pre-line text-xs">
                    {currentInstrument.taskDetails.instructions}
                  </div>
                  {currentInstrument.taskDetails.targetObject && (
                    <div className="text-[11px] text-slate-600 italic">
                      <strong>Objek Garapan / Produk:</strong> {currentInstrument.taskDetails.targetObject}
                    </div>
                  )}
                </div>

                {/* Problem or Case text (HOTS) */}
                <div className="space-y-2 pt-2">
                  <div className="font-bold text-slate-900 text-xs flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-indigo-600" />
                    <span>Naskah Kasus / Soal Ujian / Panduan Proyek (HOTS):</span>
                  </div>
                  <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 text-indigo-950 font-serif text-xs leading-relaxed whitespace-pre-line shadow-inner">
                    {currentInstrument.taskDetails.caseOrProblemText}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Matriks Rubrik Penilaian */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
              <div>
                <h4 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <Award className="w-5 h-5 text-blue-600" />
                  <span>2. Matriks Rubrik Penilaian Analitis</span>
                </h4>
                <p className="text-xs text-slate-500">
                  Menggunakan skala gradasi resmi Universitas Pattimura Peraturan Rektor No. 12 Tahun 2026 Pasal 47 ({isPasca ? 'Pascasarjana' : 'Sarjana/Profesi'}).
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                <button
                  onClick={() => setIsSpmiAuditOpen(true)}
                  className="text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-3 py-1.5 rounded-lg transition inline-flex items-center gap-1.5 shadow-2xs"
                  title="Validasi Kata Kerja Operasional (KKO) Taksonomi Bloom secara instan"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                  <span>AI SPMI Rubric Audit</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
                </button>

                <button
                  onClick={() => setShowScorerSimulator(!showScorerSimulator)}
                  className="text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 px-3 py-1.5 rounded-lg transition inline-flex items-center gap-1.5"
                >
                  <Calculator className="w-3.5 h-3.5 text-teal-600" />
                  <span>{showScorerSimulator ? 'Tutup Simulator' : 'Simulator Nilai Mahasiswa'}</span>
                </button>
              </div>
            </div>

            {/* Rubric Matrix Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-100 text-slate-800 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-3 w-48 border-r border-slate-200">
                      Aspek / Kriteria Penilaian
                    </th>
                    <th className="py-3 px-2 w-16 text-center border-r border-slate-200">
                      Bobot
                    </th>
                    {activeGradeScales.map((scale) => (
                      <th
                        key={scale.grade}
                        className="py-3 px-3 min-w-[170px] border-r border-slate-200 last:border-r-0 text-center"
                      >
                        <div className="font-extrabold text-slate-900 text-xs">
                          {scale.grade} ({scale.predicate})
                        </div>
                        <div className="font-mono text-[10px] text-slate-500 font-normal">
                          {scale.minScore === 0
                            ? `< ${scale.maxScore + 0.01}`
                            : `${scale.minScore.toFixed(2)} - ${scale.maxScore.toFixed(2)}`}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {currentInstrument.rubric.criteria.map((crit) => (
                    <tr key={crit.id} className="hover:bg-slate-50/70">
                      <td className="py-3 px-3 font-bold text-slate-900 border-r border-slate-200 bg-slate-50/50 align-top">
                        <div>{crit.aspect}</div>
                        {crit.cpmkMapping && (
                          <div className="mt-1">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-900 border border-blue-200">
                              <span>🎯 {crit.cpmkMapping}</span>
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-2 text-center font-mono font-bold text-blue-900 border-r border-slate-200 bg-slate-50/50 align-top">
                        {crit.weight}%
                      </td>
                      {activeGradeScales.map((scale) => {
                        const levelData = crit.levels.find(
                          (l) => l.grade.trim() === scale.grade.trim()
                        );
                        return (
                          <td
                            key={scale.grade}
                            className="py-3 px-3 text-[11px] text-slate-700 leading-relaxed border-r border-slate-200 last:border-r-0 align-top"
                          >
                            {levelData?.descriptor ||
                              `Kinerja mahasiswa berada pada rentang nilai ${scale.grade}.`}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Live Scorer Simulator Drawer / Box */}
            {showScorerSimulator && (
              <div className="bg-teal-50/70 border border-teal-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-teal-950 text-xs flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-teal-600" />
                    <span>Uji Interaktif Simulator Penilaian Rubrik Mahasiswa</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-teal-800">
                      Skor Akhir: <strong className="font-mono text-sm">{simulatedScore.toFixed(1)}</strong>
                    </span>
                    <span className="px-2 py-0.5 rounded text-xs font-bold bg-teal-600 text-white">
                      Nilai Mutu: {simulatedGrade.grade} ({simulatedGrade.gradePoint.toFixed(2)})
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {currentInstrument.rubric.criteria.map((crit) => (
                    <div key={crit.id} className="bg-white p-2.5 rounded-lg border border-teal-200 text-xs">
                      <div className="font-semibold text-slate-800 truncate mb-1">
                        {crit.aspect} ({crit.weight}%)
                      </div>
                      <select
                        value={selectedScores[crit.id] ?? 85}
                        onChange={(e) =>
                          setSelectedScores({
                            ...selectedScores,
                            [crit.id]: parseFloat(e.target.value),
                          })
                        }
                        className="w-full bg-slate-50 border border-slate-200 rounded p-1 text-xs"
                      >
                        {activeGradeScales.map((scale) => (
                          <option key={scale.grade} value={(scale.minScore + scale.maxScore) / 2}>
                            {scale.grade} ({scale.predicate}) - Rata-rata: {((scale.minScore + scale.maxScore) / 2).toFixed(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Formula Perhitungan Skor Akhir */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Calculator className="w-4 h-4 text-blue-600" />
              <span>3. Formula / Cara Perhitungan Skor Akhir &amp; Konversi Skala 100</span>
            </h4>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs text-slate-800 leading-relaxed">
              {currentInstrument.calculationFormula}
            </div>
            {currentInstrument.consultantRecommendation && (
              <div className="text-[11px] text-slate-500 italic pt-1">
                💡 <strong>Catatan Konsultan Evaluasi:</strong> {currentInstrument.consultantRecommendation}
              </div>
            )}
          </div>

          {/* Interaction & Revision Request Box for Lecturer */}
          <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="font-bold text-slate-900 text-xs flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-blue-600" />
                <span>Permintaan Revisi / Penyesuaian ke Konsultan AI</span>
              </div>
              <span className="text-[11px] text-slate-400">
                Ketikkan catatan khusus atau klik saran cepat
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() =>
                  handleRequestRevision(
                    'Perdalam keterkaitan dengan keunggulan komparatif kepulauan Maluku dan PIP Bina Mulia ke Lautan.'
                  )
                }
                className="px-2.5 py-1 rounded-lg text-[11px] bg-white border border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-blue-50 transition"
              >
                + Perdalam PIP Laut-Pulau Maluku
              </button>
              <button
                type="button"
                onClick={() =>
                  handleRequestRevision(
                    'Tingkatkan tingkat kesulitan soal kasus ke level HOTS C5 (Evaluasi) dan C6 (Kreasi).'
                  )
                }
                className="px-2.5 py-1 rounded-lg text-[11px] bg-white border border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-blue-50 transition"
              >
                + Tingkatkan Level HOTS (C5-C6)
              </button>
              <button
                type="button"
                onClick={() =>
                  handleRequestRevision(
                    'Tambahkan kriteria penilaian kemampuan komunikasi presentasi dan kerja sama tim.'
                  )
                }
                className="px-2.5 py-1 rounded-lg text-[11px] bg-white border border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-blue-50 transition"
              >
                + Tambah Kriteria Komunikasi/Tim
              </button>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={feedbackPrompt}
                onChange={(e) => setFeedbackPrompt(e.target.value)}
                placeholder="Contoh: Tolong sesuaikan batas waktu menjadi 2 minggu dan pertegas objek garapan..."
                className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                disabled={!feedbackPrompt.trim() || isGenerating}
                onClick={() => handleRequestRevision(feedbackPrompt)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-40 transition shrink-0"
              >
                Revisi Komponen Ini
              </button>
            </div>
          </div>

          {/* CRITICAL CONFIRMATION PROTOCOL BANNER (As Instructed) */}
          <div className="bg-gradient-to-r from-slate-900 to-blue-950 rounded-2xl p-6 text-white border-2 border-emerald-400/40 shadow-xl space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0 border border-emerald-400/30 text-emerald-300">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div className="space-y-1 flex-1">
                <div className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                  Konfirmasi Alur Protokol Tahap 3
                </div>
                <blockquote className="text-sm font-medium italic text-slate-100 leading-relaxed bg-black/20 p-3.5 rounded-xl border border-white/10">
                  "Berikut adalah draft Evaluasi &amp; Rubrik Penilaian untuk{' '}
                  <strong className="text-cyan-300">{currentComp.name}</strong>. Apakah ada bagian yang ingin disesuaikan, atau bisa kita lanjutkan ke{' '}
                  <strong className="text-emerald-300">{nextComponentName || 'Penyelesaian Dokumen Lengkap (Dossier)'}</strong>?"
                </blockquote>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setIsPrintModalOpen(true)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-400/40 transition flex items-center justify-center gap-2"
                title="Cetak atau ekspor instrumen ini ke format PDF / Word resmi RPS"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak / Ekspor PDF Komponen Ini</span>
              </button>

              <button
                onClick={() => setIsEditing(true)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-slate-100 border border-white/20 transition flex items-center justify-center gap-2"
              >
                <Edit2 className="w-4 h-4 text-amber-300" />
                <span>Sesuaikan / Edit Draf Ini</span>
              </button>

              {isLastComponent ? (
                <button
                  onClick={onCompleteAllToDossier}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white shadow-lg shadow-emerald-500/30 transition flex items-center justify-center gap-2"
                >
                  <Award className="w-4 h-4" />
                  <span>Setujui Semua &amp; Buka Dossier Lengkap Evaluasi</span>
                </button>
              ) : (
                <button
                  onClick={onApproveAndNext}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-lg shadow-blue-500/30 transition flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Setuju, Lanjut ke Komponen Berikutnya</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Single Component Print & Export Modal */}
      {currentInstrument && (
        <SingleComponentPrintModal
          isOpen={isPrintModalOpen}
          onClose={() => setIsPrintModalOpen(false)}
          identity={identity}
          component={currentComp}
          instrument={currentInstrument}
        />
      )}

      {/* AI SPMI Rubric Audit Modal */}
      {currentInstrument && (
        <AiSpmiAuditModal
          isOpen={isSpmiAuditOpen}
          onClose={() => setIsSpmiAuditOpen(false)}
          instrument={currentInstrument}
          component={currentComp}
          courseIdentity={identity}
          onApplyImprovement={(updated) => onSaveInstrument(currentComp.id, updated)}
        />
      )}
    </div>
  );
};
