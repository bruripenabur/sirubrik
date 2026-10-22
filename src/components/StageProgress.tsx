import React from 'react';
import { WorkflowStage } from '../types';
import { CheckCircle2, Circle, Edit3, FileText, Layers, ShieldCheck } from 'lucide-react';

interface StageProgressProps {
  currentStage: WorkflowStage;
  activeComponentIndex: number;
  totalComponents: number;
  onSelectStage: (stage: WorkflowStage) => void;
  canNavigateToStage3: boolean;
  canNavigateToDossier: boolean;
}

export const StageProgress: React.FC<StageProgressProps> = ({
  currentStage,
  activeComponentIndex,
  totalComponents,
  onSelectStage,
  canNavigateToStage3,
  canNavigateToDossier,
}) => {
  const stages = [
    {
      id: 'stage_1_mapping' as WorkflowStage,
      number: '1',
      title: 'Tahap 1: Identitas & Pemetaan',
      subtitle: 'Ekstraksi RPS & Saran Minggu',
      icon: Layers,
      available: true,
    },
    {
      id: 'stage_2_revision' as WorkflowStage,
      number: '2',
      title: 'Tahap 2: Penyesuaian & Bobot',
      subtitle: 'Validasi Pasal 47 (≥50%)',
      icon: Edit3,
      available: true,
    },
    {
      id: 'stage_3_drafting' as WorkflowStage,
      number: '3',
      title: 'Tahap 3: Penyusunan Instrumen & Rubrik',
      subtitle: `Bertahap (${activeComponentIndex + 1}/${totalComponents || 1} Komponen)`,
      icon: FileText,
      available: canNavigateToStage3,
    },
    {
      id: 'dossier_complete' as WorkflowStage,
      number: '★',
      title: 'Dossier Lengkap',
      subtitle: 'Format Dokumen Resmi & Ekspor',
      icon: ShieldCheck,
      available: canNavigateToDossier,
    },
  ];

  return (
    <div className="bg-white border-b border-slate-200 shadow-xs py-3 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
          {stages.map((stage, idx) => {
            const isActive = currentStage === stage.id;
            const Icon = stage.icon;

            return (
              <button
                key={stage.id}
                disabled={!stage.available}
                onClick={() => stage.available && onSelectStage(stage.id)}
                className={`relative flex items-center p-2.5 sm:p-3 rounded-xl text-left transition-all ${
                  isActive
                    ? 'bg-blue-50/80 border-2 border-blue-600 text-blue-950 shadow-xs'
                    : stage.available
                    ? 'bg-slate-50 hover:bg-slate-100/80 border border-slate-200 text-slate-700 cursor-pointer'
                    : 'bg-slate-50/50 border border-slate-100 text-slate-400 opacity-60 cursor-not-allowed'
                }`}
              >
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shrink-0 mr-2.5 font-bold text-xs ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : stage.available
                      ? 'bg-slate-200 text-slate-700'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] sm:text-xs font-bold truncate">
                    {stage.title}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate">
                    {stage.subtitle}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
