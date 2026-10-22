import React, { useState } from 'react';
import { EvaluationComponent, EvaluationCategory } from '../types';
import {
  Edit3,
  Plus,
  Trash2,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  RotateCcw,
  Calendar,
  Percent,
  Layers,
} from 'lucide-react';
import {
  validateEvaluationComponents,
  isCaseOrProjectCategory,
} from '../utils/regulatoryValidator';

interface Stage2RevisionProps {
  components: EvaluationComponent[];
  onUpdateComponents: (components: EvaluationComponent[]) => void;
  onApproveAndProceedToDraft: () => void;
  onBackToStage1: () => void;
}

export const Stage2Revision: React.FC<Stage2RevisionProps> = ({
  components,
  onUpdateComponents,
  onApproveAndProceedToDraft,
  onBackToStage1,
}) => {
  const [localComponents, setLocalComponents] = useState<EvaluationComponent[]>(components);

  const validation = validateEvaluationComponents(localComponents);

  const handleWeightChange = (index: number, newWeight: number) => {
    const updated = [...localComponents];
    updated[index].weight = isNaN(newWeight) ? 0 : newWeight;
    setLocalComponents(updated);
    onUpdateComponents(updated);
  };

  const handleFieldChange = (
    index: number,
    field: keyof EvaluationComponent,
    value: any
  ) => {
    const updated = [...localComponents];
    updated[index] = { ...updated[index], [field]: value };
    setLocalComponents(updated);
    onUpdateComponents(updated);
  };

  const handleAddComponent = () => {
    const newComp: EvaluationComponent = {
      id: `comp-${Date.now()}`,
      name: 'Komponen Evaluasi Baru',
      category: 'structured_task',
      weight: 10,
      subCpmkList: ['Sub-CPMK Baru'],
      bloomLevels: ['C4 - Analisis'],
      suggestedWeeks: 'Minggu ke-9',
      status: 'pending',
    };
    const updated = [...localComponents, newComp];
    setLocalComponents(updated);
    onUpdateComponents(updated);
  };

  const handleDeleteComponent = (index: number) => {
    if (localComponents.length <= 1) return;
    const updated = localComponents.filter((_, i) => i !== index);
    setLocalComponents(updated);
    onUpdateComponents(updated);
  };

  // Auto-normalize to 100% and fulfill Pasal 47
  const handleAutoRebalance = () => {
    const updated = localComponents.map((c) => {
      if (c.category === 'case_method') return { ...c, weight: 30 };
      if (c.category === 'team_project') return { ...c, weight: 25 };
      if (c.category === 'structured_task') return { ...c, weight: 15 };
      if (c.category === 'quiz') return { ...c, weight: 5 };
      if (c.category === 'uts') return { ...c, weight: 10 };
      if (c.category === 'uas') return { ...c, weight: 15 };
      return c;
    });
    setLocalComponents(updated);
    onUpdateComponents(updated);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 mb-1">
              <Edit3 className="w-3.5 h-3.5" />
              <span>Tahap 2: Proses Revisi Pemetaan</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
              Penyesuaian Jadwal Pertemuan &amp; Pembobotan Komponen
            </h3>
            <p className="text-xs text-slate-500">
              Sesuaikan alokasi minggu pelaksanaan, Sub-CPMK, dan persentase bobot sesuai rancangan pembelajaran Anda.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={handleAutoRebalance}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Otomatis Selaraskan Pasal 47</span>
            </button>
            <button
              onClick={handleAddComponent}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-white hover:bg-slate-700 transition flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Komponen</span>
            </button>
          </div>
        </div>

        {/* Validation Status Indicator */}
        <div
          className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs ${
            validation.isPasal47Compliant && validation.isTotalValid
              ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
              : 'bg-amber-50/80 border-amber-200 text-amber-950'
          }`}
        >
          <div className="flex items-center gap-2">
            {validation.isPasal47Compliant && validation.isTotalValid ? (
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            )}
            <span className="font-semibold">{validation.message}</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span>
              Kasus &amp; Proyek: <strong>{validation.caseProjectWeight}%</strong> (Wajib ≥50%)
            </span>
            <span>
              Total: <strong>{validation.totalWeight}%</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Table Editor */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/90 text-slate-700 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-3 w-10 text-center">#</th>
                <th className="py-3 px-3 min-w-[240px]">Nama Komponen Evaluasi</th>
                <th className="py-3 px-3 w-40">Kategori Metode</th>
                <th className="py-3 px-3 w-24 text-center">Bobot (%)</th>
                <th className="py-3 px-3 min-w-[200px]">Sub-CPMK Diukur</th>
                <th className="py-3 px-3 w-44">Saran Minggu Ke-</th>
                <th className="py-3 px-3 w-12 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {localComponents.map((comp, idx) => {
                const isCaseProj = isCaseOrProjectCategory(comp.category);
                return (
                  <tr
                    key={comp.id}
                    className={`hover:bg-slate-50 transition-colors ${
                      isCaseProj ? 'bg-blue-50/20' : ''
                    }`}
                  >
                    <td className="py-3 px-3 text-center font-bold text-slate-400">
                      {idx + 1}
                    </td>
                    <td className="py-3 px-3">
                      <input
                        type="text"
                        value={comp.name}
                        onChange={(e) => handleFieldChange(idx, 'name', e.target.value)}
                        className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-blue-500 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-900 focus:outline-none"
                      />
                    </td>
                    <td className="py-3 px-3">
                      <select
                        value={comp.category}
                        onChange={(e) =>
                          handleFieldChange(
                            idx,
                            'category',
                            e.target.value as EvaluationCategory
                          )
                        }
                        className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-800 focus:outline-none font-medium"
                      >
                        <option value="case_method">Case Method (Pasal 47)</option>
                        <option value="team_project">Team-Based Project (Pasal 47)</option>
                        <option value="field_work">Praktik Lapangan (Pasal 47)</option>
                        <option value="participatory">Partisipatif &amp; Kasus</option>
                        <option value="structured_task">Tugas Terstruktur</option>
                        <option value="quiz">Kuis Terjadwal</option>
                        <option value="uts">Ujian Tengah Semester (UTS)</option>
                        <option value="uas">Ujian Akhir Semester (UAS)</option>
                      </select>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <div className="relative inline-block w-20">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={comp.weight}
                          onChange={(e) => handleWeightChange(idx, parseInt(e.target.value))}
                          className="w-full text-center font-mono font-bold bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-blue-500 rounded-lg py-1.5 px-2 text-xs text-blue-950 focus:outline-none"
                        />
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <input
                        type="text"
                        value={(comp.subCpmkList || []).join(', ')}
                        onChange={(e) =>
                          handleFieldChange(
                            idx,
                            'subCpmkList',
                            e.target.value.split(',').map((s) => s.trim())
                          )
                        }
                        placeholder="Sub-CPMK 1, Sub-CPMK 2"
                        className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-700 focus:outline-none"
                      />
                    </td>
                    <td className="py-3 px-3">
                      <input
                        type="text"
                        value={comp.suggestedWeeks}
                        onChange={(e) =>
                          handleFieldChange(idx, 'suggestedWeeks', e.target.value)
                        }
                        placeholder="Misal: Minggu ke-3 s.d. 7"
                        className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-blue-800 font-medium focus:outline-none"
                      />
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => handleDeleteComponent(idx)}
                        disabled={localComponents.length <= 1}
                        className="p-1 text-slate-400 hover:text-red-600 disabled:opacity-20 transition"
                        title="Hapus Komponen"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Approval and Confirmation Action */}
      <div className="bg-slate-900 rounded-2xl p-5 text-white flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-800 shadow-md">
        <div>
          <div className="text-xs text-cyan-300 font-bold uppercase tracking-wider">
            Konfirmasi Persetujuan Pemetaan (Tahap 2 Selesai)
          </div>
          <p className="text-xs text-slate-300 mt-0.5">
            Setelah Anda menyetujui pemetaan ini, sistem akan memulai <strong>Tahap 3</strong>: menyusun rincian instrumen &amp; rubrik secara bertahap satu per satu dimulai dari Komponen 1.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={onBackToStage1}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            Kembali ke Tahap 1
          </button>
          <button
            onClick={onApproveAndProceedToDraft}
            disabled={!validation.isTotalValid}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white shadow-lg shadow-emerald-500/20 disabled:opacity-50 transition flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Setuju, Lanjut ke Komponen 1</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
