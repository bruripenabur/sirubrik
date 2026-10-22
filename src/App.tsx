import React, { useState, useEffect } from 'react';
import {
  ComponentInstrument,
  CourseIdentity,
  EvaluationComponent,
  EvaluationModelType,
  WorkflowStage,
} from './types';
import { Header } from './components/Header';
import { StageProgress } from './components/StageProgress';
import { Stage1Mapping } from './components/Stage1Mapping';
import { Stage2Revision } from './components/Stage2Revision';
import { Stage3Drafting } from './components/Stage3Drafting';
import { CompleteDossierView } from './components/CompleteDossierView';
import { RegulationDrawer } from './components/RegulationDrawer';
import { ChatConsultantModal } from './components/ChatConsultantModal';
import { EvaluationCalendar } from './components/EvaluationCalendar';
import { TrilogyHubModal } from './components/TrilogyHubModal';
import { StudentCompetencyDashboard } from './components/StudentCompetencyDashboard';
import { EXEMPLAR_COURSES } from './data/exemplarCourses';
import {
  getDefaultRubricLevels,
  isPascasarjanaLevel,
} from './utils/regulatoryValidator';
import { Bot, Calendar, X } from 'lucide-react';
import {
  loadStoredData,
  saveStoredData,
  clearStoredData,
  SyncStatusInfo,
} from './utils/storage';

export default function App() {
  // Load cached session data if available, fallback to Exemplar 1 (Oseanografi FPIK Unpatti)
  const defaultCourse = EXEMPLAR_COURSES[0];
  const cachedData = loadStoredData();

  const [identity, setIdentity] = useState<CourseIdentity>(
    cachedData.identity || defaultCourse.identity
  );
  const [components, setComponents] = useState<EvaluationComponent[]>(
    cachedData.components || defaultCourse.components
  );
  const [instruments, setInstruments] = useState<Record<string, ComponentInstrument>>(
    cachedData.instruments || defaultCourse.sampleInstruments
  );
  const [selectedModel, setSelectedModel] = useState<EvaluationModelType>(
    cachedData.selectedModel || 'model_1'
  );
  const [rpsText, setRpsText] = useState<string>(
    cachedData.rpsText || defaultCourse.rawRpsText
  );
  const [referenceText, setReferenceText] = useState<string>(
    cachedData.referenceText || ''
  );

  const [currentStage, setCurrentStage] = useState<WorkflowStage>(
    cachedData.stage || 'stage_1_mapping'
  );
  const [activeComponentIndex, setActiveComponentIndex] = useState<number>(0);

  // Sync status indicator tracking with external apps (SIMPEL-CPL / Desain-RPSOBE)
  const [syncStatus, setSyncStatus] = useState<SyncStatusInfo>(
    cachedData.lastSync || {
      timestamp: '18 Okt 2026, 06:15 WIT',
      source: 'SIMPEL-CPL',
      status: 'synced',
      recordCount: 4,
    }
  );

  // Auto-cache session data into localStorage on updates
  useEffect(() => {
    saveStoredData({
      identity,
      components,
      instruments,
      selectedModel,
      rpsText,
      referenceText,
      stage: currentStage,
      lastSync: syncStatus,
    });
  }, [
    identity,
    components,
    instruments,
    selectedModel,
    rpsText,
    referenceText,
    currentStage,
    syncStatus,
  ]);

  const [isRegulationsOpen, setIsRegulationsOpen] = useState(false);
  const [isConsultantChatOpen, setIsConsultantChatOpen] = useState(false);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [isTrilogyHubOpen, setIsTrilogyHubOpen] = useState(false);
  const [isStudentDashboardOpen, setIsStudentDashboardOpen] = useState(false);
  const [uploadedPdf, setUploadedPdf] = useState<{ base64: string; name: string } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Switch to an Exemplar Course
  const handleSelectExemplar = (id: string) => {
    const selected = EXEMPLAR_COURSES.find((c) => c.id === id);
    if (!selected) return;

    setIdentity(selected.identity);
    setComponents(selected.components);
    setInstruments(selected.sampleInstruments || {});
    setRpsText(selected.rawRpsText);
    setUploadedPdf(null);
    setActiveComponentIndex(0);
    setCurrentStage('stage_1_mapping');
  };

  // Change Model
  const handleSelectModel = (model: EvaluationModelType) => {
    setSelectedModel(model);
    if (model === 'model_1') {
      setComponents([
        {
          id: 'comp-1',
          name: 'Metode Pemecahan Kasus (Case Method)',
          category: 'case_method',
          weight: 30,
          subCpmkList: ['Sub-CPMK 1', 'Sub-CPMK 2'],
          bloomLevels: ['C4 - Analisis', 'C5 - Evaluasi'],
          suggestedWeeks: 'Minggu ke-3 s.d. 7',
          status: 'pending',
        },
        {
          id: 'comp-2',
          name: 'Proyek Berbasis Tim (Team-Based Project)',
          category: 'team_project',
          weight: 25,
          subCpmkList: ['Sub-CPMK 2', 'Sub-CPMK 3'],
          bloomLevels: ['C5 - Evaluasi', 'C6 - Kreasi'],
          suggestedWeeks: 'Minggu ke-10 s.d. 15',
          status: 'pending',
        },
        {
          id: 'comp-3',
          name: 'Tugas Terstruktur Mandiri',
          category: 'structured_task',
          weight: 15,
          subCpmkList: ['Sub-CPMK 1'],
          bloomLevels: ['C4 - Analisis'],
          suggestedWeeks: 'Minggu ke-2',
          status: 'pending',
        },
        {
          id: 'comp-4',
          name: 'Kuis & Aktivitas Partisipatif',
          category: 'quiz',
          weight: 5,
          subCpmkList: ['Sub-CPMK 1'],
          bloomLevels: ['C3 - Penerapan'],
          suggestedWeeks: 'Minggu ke-6',
          status: 'pending',
        },
        {
          id: 'comp-5',
          name: 'Ujian Tengah Semester (UTS)',
          category: 'uts',
          weight: 10,
          subCpmkList: ['Sub-CPMK 1 & 2'],
          bloomLevels: ['C4 - Analisis'],
          suggestedWeeks: 'Minggu ke-8',
          status: 'pending',
        },
        {
          id: 'comp-6',
          name: 'Ujian Akhir Semester (UAS)',
          category: 'uas',
          weight: 15,
          subCpmkList: ['Sub-CPMK 2 & 3'],
          bloomLevels: ['C5 - Evaluasi', 'C6 - Kreasi'],
          suggestedWeeks: 'Minggu ke-16',
          status: 'pending',
        },
      ]);
    } else if (model === 'model_2') {
      setComponents([
        {
          id: 'comp-1',
          name: 'Hasil Proyek & Praktik Lapangan',
          category: 'field_work',
          weight: 35,
          subCpmkList: ['Sub-CPMK 2 & 3: Praktik Lapangan Terpadu'],
          bloomLevels: ['C5 - Evaluasi', 'C6 - Kreasi'],
          suggestedWeeks: 'Minggu ke-9 s.d. 14',
          status: 'pending',
        },
        {
          id: 'comp-2',
          name: 'Aktivitas Partisipatif & Diskusi Kasus',
          category: 'participatory',
          weight: 20,
          subCpmkList: ['Sub-CPMK 1 & 2: Diskusi Kasus Autentik'],
          bloomLevels: ['C4 - Analisis', 'C5 - Evaluasi'],
          suggestedWeeks: 'Minggu ke-3 s.d. 6',
          status: 'pending',
        },
        {
          id: 'comp-3',
          name: 'Tugas & Analisis Data',
          category: 'structured_task',
          weight: 15,
          subCpmkList: ['Sub-CPMK 1: Pengolahan Data'],
          bloomLevels: ['C4 - Analisis'],
          suggestedWeeks: 'Minggu ke-7',
          status: 'pending',
        },
        {
          id: 'comp-4',
          name: 'Ujian Tengah Semester (UTS)',
          category: 'uts',
          weight: 15,
          subCpmkList: ['Sub-CPMK 1 & 2'],
          bloomLevels: ['C4 - Analisis'],
          suggestedWeeks: 'Minggu ke-8',
          status: 'pending',
        },
        {
          id: 'comp-5',
          name: 'Ujian Akhir Semester (UAS)',
          category: 'uas',
          weight: 15,
          subCpmkList: ['Sub-CPMK 2 & 3'],
          bloomLevels: ['C5 - Evaluasi', 'C6 - Kreasi'],
          suggestedWeeks: 'Minggu ke-16',
          status: 'pending',
        },
      ]);
    } else if (model === 'model_3') {
      setComponents([
        {
          id: 'comp-1',
          name: 'Metode Pemecahan Kasus (Case Method)',
          category: 'case_method',
          weight: 25,
          subCpmkList: ['Sub-CPMK 1: Analisis Kasus'],
          bloomLevels: ['C4 - Analisis', 'C5 - Evaluasi'],
          suggestedWeeks: 'Minggu ke-3 s.d. 6',
          status: 'pending',
        },
        {
          id: 'comp-2',
          name: 'Proyek Berbasis Tim (Team-Based Project)',
          category: 'team_project',
          weight: 25,
          subCpmkList: ['Sub-CPMK 2 & 3: Proyek Tim'],
          bloomLevels: ['C5 - Evaluasi', 'C6 - Kreasi'],
          suggestedWeeks: 'Minggu ke-10 s.d. 14',
          status: 'pending',
        },
        {
          id: 'comp-3',
          name: 'Tugas Terstruktur',
          category: 'structured_task',
          weight: 10,
          subCpmkList: ['Sub-CPMK 1'],
          bloomLevels: ['C4 - Analisis'],
          suggestedWeeks: 'Minggu ke-4',
          status: 'pending',
        },
        {
          id: 'comp-4',
          name: 'Kuis Berkala',
          category: 'quiz',
          weight: 10,
          subCpmkList: ['Sub-CPMK 1 & 2'],
          bloomLevels: ['C3 - Penerapan'],
          suggestedWeeks: 'Minggu ke-7',
          status: 'pending',
        },
        {
          id: 'comp-5',
          name: 'Ujian Tengah Semester (UTS)',
          category: 'uts',
          weight: 15,
          subCpmkList: ['Sub-CPMK 1 & 2'],
          bloomLevels: ['C4 - Analisis'],
          suggestedWeeks: 'Minggu ke-8',
          status: 'pending',
        },
        {
          id: 'comp-6',
          name: 'Ujian Akhir Semester (UAS)',
          category: 'uas',
          weight: 15,
          subCpmkList: ['Sub-CPMK 2 & 3'],
          bloomLevels: ['C5 - Evaluasi'],
          suggestedWeeks: 'Minggu ke-16',
          status: 'pending',
        },
      ]);
    }
  };

  // Analyze RPS with Server Gemini API
  const handleAnalyzeRps = async () => {
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/gemini/analyze-rps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rpsText,
          pdfBase64: uploadedPdf?.base64,
          modelChoice: selectedModel,
          courseHints: `Landasan: Pertor Unpatti 12/2026. Referensi: ${referenceText}`,
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        if (data.data.identity) {
          setIdentity((prev) => ({
            ...prev,
            ...data.data.identity,
            cpmkList: data.data.identity.cpmkList || prev.cpmkList,
          }));
        }
        if (data.data.components && data.data.components.length > 0) {
          setComponents(data.data.components);
        }
      } else {
        // Fallback: If AI is in offline mode or parsing, extract course name from text
        const lines = rpsText.split('\n');
        const courseNameLine = lines.find((l) =>
          l.toLowerCase().includes('mata kuliah') || l.toLowerCase().includes('mk:')
        );
        if (courseNameLine) {
          const extracted = courseNameLine.replace(/.*[:\-]\s*/, '').trim();
          if (extracted) {
            setIdentity((prev) => ({ ...prev, name: extracted }));
          }
        }
      }
    } catch (err) {
      console.warn('AI analysis fallback used:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Generate Instrument & Rubric for 1 specific component (Tahap 3 Step-by-Step)
  const handleGenerateInstrument = async (componentId: string, feedback?: string) => {
    setIsGenerating(true);
    const comp = components.find((c) => c.id === componentId) || components[activeComponentIndex];
    if (!comp) {
      setIsGenerating(false);
      return;
    }

    try {
      const res = await fetch('/api/gemini/generate-component', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identity,
          component: comp,
          componentIndex: activeComponentIndex,
          totalComponents: components.length,
          feedback,
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        const generated: ComponentInstrument = {
          componentId: comp.id,
          taskDetails: data.data.taskDetails,
          rubric: data.data.rubric,
          calculationFormula: data.data.calculationFormula,
          consultantRecommendation: data.data.consultantRecommendation,
          isApproved: false,
        };
        setInstruments((prev) => ({ ...prev, [comp.id]: generated }));
        // mark component status
        setComponents((prev) =>
          prev.map((c) => (c.id === comp.id ? { ...c, status: 'drafted' } : c))
        );
      } else {
        // Fallback intelligent instrument generator according to Unpatti & PIP BMK
        const isPasca = isPascasarjanaLevel(identity.level);
        const fallbackInstrument: ComponentInstrument = {
          componentId: comp.id,
          taskDetails: {
            name: `${comp.name} Terstruktur Mata Kuliah ${identity.name}`,
            taskType: comp.category === 'case_method' ? 'Studi Kasus Analitik' : 'Laporan Proyek Autentik',
            subCpmk: (comp.subCpmkList || []).join(', ') || 'Sub-CPMK Terkait',
            indicators: [
              'Ketajaman formulasi masalah dan sintesis teori kelautan/kepulauan',
              'Kesesuaian metode analisis data empiris dan penalaran HOTS',
              'Orisinalitas rekomendasi solusi berkelanjutan berbasis PIP Bina Mulia ke Lautan',
            ],
            pipSdgsRelevance: `${identity.pipFocus}. Menyelaraskan dengan ${(identity.sdgsAlignment || ['SDG 14: Life Below Water']).join(', ')}.`,
            instructions: `1. Pelajari secara saksama skenario penugasan yang diberikan.\n2. Lakukan pengumpulan dan analisis data pendukung berstandar ilmiah.\n3. Susun naskah laporan sesuai format panduan evaluasi Unpatti.\n4. Kumpulkan naskah sebelum batas waktu ${comp.suggestedWeeks}.`,
            deadline: comp.suggestedWeeks,
            targetObject: 'Naskah Laporan Komprehensif berstandar ilmiah (Format PDF).',
            caseOrProblemText: `SKENARIO PENUGASAN MATA KULIAH ${identity.name.toUpperCase()}:\nKarakteristik kepulauan Maluku mengharuskan pengelolaan sumber daya yang adaptif terhadap dinamika laut-pulau. Mahasiswa diminta menganalisis fenomena permasalahan nyata pada perairan/masyarakat pesisir Maluku, mengaitkan variabel kausalitas, dan merumuskan intervensi ilmiah yang berkelanjutan dan terukur.`,
          },
          rubric: {
            type: 'analytic',
            scaleType: isPasca ? 'pascasarjana' : 'sarjana',
            criteria: [
              {
                id: 'c1',
                aspect: 'Penguasaan Konsep & Ketajaman Analisis Kritis',
                weight: 40,
                levels: getDefaultRubricLevels(isPasca, 'Penguasaan Konsep & Analisis Kritis'),
              },
              {
                id: 'c2',
                aspect: 'Relevansi Solusi Kontekstual Laut-Pulau (PIP-BMK)',
                weight: 35,
                levels: getDefaultRubricLevels(isPasca, 'Relevansi Solusi Laut-Pulau'),
              },
              {
                id: 'c3',
                aspect: 'Sistematika, Validitas Bukti & Komunikasi Ilmiah',
                weight: 25,
                levels: getDefaultRubricLevels(isPasca, 'Sistematika & Komunikasi Ilmiah'),
              },
            ],
          },
          calculationFormula: `Skor Akhir = (Kriteria 1 × 0.40) + (Kriteria 2 × 0.35) + (Kriteria 3 × 0.25). Skor bernilai 0-100 dan berkontribusi ${comp.weight}% dari total nilai akhir mata kuliah sesuai Pasal 47 Peraturan Rektor Unpatti No. 12 Tahun 2026.`,
          consultantRecommendation: 'Pastikan rubrik ini disosialisasikan kepada mahasiswa pada awal pemberian tugas untuk menjamin transparansi kriteria penilaian OBE.',
          isApproved: false,
        };
        setInstruments((prev) => ({ ...prev, [comp.id]: fallbackInstrument }));
        setComponents((prev) =>
          prev.map((c) => (c.id === comp.id ? { ...c, status: 'drafted' } : c))
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Approve current component and advance to next
  const handleApproveAndNext = () => {
    const currentComp = components[activeComponentIndex];
    if (currentComp) {
      setInstruments((prev) => ({
        ...prev,
        [currentComp.id]: {
          ...prev[currentComp.id],
          isApproved: true,
        },
      }));
      setComponents((prev) =>
        prev.map((c) => (c.id === currentComp.id ? { ...c, status: 'approved' } : c))
      );
    }

    if (activeComponentIndex < components.length - 1) {
      const nextIdx = activeComponentIndex + 1;
      setActiveComponentIndex(nextIdx);
      // Auto-trigger draft for next component if not yet drafted
      const nextComp = components[nextIdx];
      if (nextComp && !instruments[nextComp.id]) {
        handleGenerateInstrument(nextComp.id);
      }
    } else {
      setCurrentStage('dossier_complete');
    }
  };

  // Reset to initial state and clear cached session
  const handleReset = () => {
    if (window.confirm('Mulai ulang aplikasi ke contoh RPS awal Oseanografi FPIK dan segarkan cache lokal?')) {
      clearStoredData();
      handleSelectExemplar('oseanografi_fpik');
      setSyncStatus({
        timestamp: '18 Okt 2026, 06:15 WIT',
        source: 'SIMPEL-CPL',
        status: 'synced',
        recordCount: 4,
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900 selection:bg-blue-200">
      {/* Universal Header with Real-Time External Sync & Cache Status */}
      <Header
        identity={identity}
        currentStage={currentStage}
        syncStatus={syncStatus}
        onOpenRegulations={() => setIsRegulationsOpen(true)}
        onOpenConsultantChat={() => setIsConsultantChatOpen(true)}
        onOpenCalendar={() => setIsCalendarModalOpen(true)}
        onOpenTrilogyHub={() => setIsTrilogyHubOpen(true)}
        onOpenStudentDashboard={() => setIsStudentDashboardOpen(true)}
        onReset={handleReset}
        onSelectExemplar={handleSelectExemplar}
      />

      {/* 3-Stage Workflow Stepper */}
      <StageProgress
        currentStage={currentStage}
        activeComponentIndex={activeComponentIndex}
        totalComponents={components.length}
        onSelectStage={(stage) => setCurrentStage(stage)}
        canNavigateToStage3={components.length > 0}
        canNavigateToDossier={Object.keys(instruments).length > 0}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {currentStage === 'stage_1_mapping' && (
          <Stage1Mapping
            identity={identity}
            onUpdateIdentity={setIdentity}
            components={components}
            onUpdateComponents={setComponents}
            selectedModel={selectedModel}
            onSelectModel={handleSelectModel}
            rpsText={rpsText}
            onUpdateRpsText={setRpsText}
            referenceText={referenceText}
            onUpdateReferenceText={setReferenceText}
            uploadedPdfFileName={uploadedPdf?.name}
            onUploadPdfBase64={(base64, filename) => setUploadedPdf({ base64, name: filename })}
            onClearUploadedPdf={() => setUploadedPdf(null)}
            onAnalyzeWithAi={handleAnalyzeRps}
            isAnalyzing={isAnalyzing}
            onConfirmMappingProceedToDraft={() => {
              setCurrentStage('stage_3_drafting');
              setActiveComponentIndex(0);
              // if first component has no draft, generate it
              if (components[0] && !instruments[components[0].id]) {
                handleGenerateInstrument(components[0].id);
              }
            }}
            onProceedToRevision={() => setCurrentStage('stage_2_revision')}
          />
        )}

        {currentStage === 'stage_2_revision' && (
          <Stage2Revision
            components={components}
            onUpdateComponents={setComponents}
            onApproveAndProceedToDraft={() => {
              setCurrentStage('stage_3_drafting');
              setActiveComponentIndex(0);
              if (components[0] && !instruments[components[0].id]) {
                handleGenerateInstrument(components[0].id);
              }
            }}
            onBackToStage1={() => setCurrentStage('stage_1_mapping')}
          />
        )}

        {currentStage === 'stage_3_drafting' && (
          <Stage3Drafting
            identity={identity}
            components={components}
            instruments={instruments}
            activeComponentIndex={activeComponentIndex}
            onSelectComponentIndex={(idx) => {
              setActiveComponentIndex(idx);
              const comp = components[idx];
              if (comp && !instruments[comp.id]) {
                handleGenerateInstrument(comp.id);
              }
            }}
            onSaveInstrument={(compId, inst) => {
              setInstruments((prev) => ({ ...prev, [compId]: inst }));
            }}
            onGenerateInstrument={handleGenerateInstrument}
            isGenerating={isGenerating}
            onApproveAndNext={handleApproveAndNext}
            onCompleteAllToDossier={() => setCurrentStage('dossier_complete')}
          />
        )}

        {currentStage === 'dossier_complete' && (
          <CompleteDossierView
            identity={identity}
            components={components}
            instruments={instruments}
            onBackToDrafting={() => setCurrentStage('stage_3_drafting')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-6 text-center text-xs border-t border-slate-800 print:hidden">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <p className="font-semibold text-slate-300">
            SIRUBRIK UNPATTI — Sistem Desain Instrumen Evaluasi &amp; Rubrik Penilaian Berbasis OBE
          </p>
          <p className="text-[11px] text-slate-500">
            Universitas Pattimura • Mengacu Pertor No. 12 Tahun 2026 (Pasal 47)
          </p>
        </div>
      </footer>

      {/* Regulation Slide-over */}
      <RegulationDrawer
        isOpen={isRegulationsOpen}
        onClose={() => setIsRegulationsOpen(false)}
      />

      {/* Chat Consultant Slide-over */}
      <ChatConsultantModal
        isOpen={isConsultantChatOpen}
        onClose={() => setIsConsultantChatOpen(false)}
        identity={identity}
        components={components}
      />

      {/* Evaluation Calendar Modal */}
      {isCalendarModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden border border-slate-200">
            <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                  <Calendar className="w-4 h-4 text-cyan-200" />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base">
                    Kalender Evaluasi &amp; Beban Asesmen Mahasiswa (16 Minggu)
                  </h3>
                  <p className="text-[11px] text-slate-300">
                    Pemetaan timeline pelaksanaan tugas, UTS, dan UAS sepanjang semester
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCalendarModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 sm:p-6 overflow-y-auto max-h-[82vh] bg-slate-50">
              <EvaluationCalendar
                components={components}
                courseName={identity.name}
                onSelectComponent={(idx) => {
                  setIsCalendarModalOpen(false);
                  setActiveComponentIndex(idx);
                  setCurrentStage('stage_3_drafting');
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Hub Integrasi Trilogi OBE Unpatti Modal */}
      <TrilogyHubModal
        isOpen={isTrilogyHubOpen}
        onClose={() => setIsTrilogyHubOpen(false)}
        identity={identity}
        onUpdateIdentity={(newIdent) => {
          setIdentity(newIdent);
          const nowStr =
            new Date().toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            }) +
            ', ' +
            new Date().toLocaleTimeString('id-ID', {
              hour: '2-digit',
              minute: '2-digit',
            }) +
            ' WIT';
          setSyncStatus({
            timestamp: nowStr,
            source: 'SIMPEL-CPL',
            status: 'synced',
            recordCount: newIdent.cpmkList?.length || 4,
          });
        }}
        components={components}
        onUpdateComponents={(newComps) => {
          setComponents(newComps);
          const nowStr =
            new Date().toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            }) +
            ', ' +
            new Date().toLocaleTimeString('id-ID', {
              hour: '2-digit',
              minute: '2-digit',
            }) +
            ' WIT';
          setSyncStatus({
            timestamp: nowStr,
            source: 'Desain-RPSOBE',
            status: 'synced',
            recordCount: newComps.length,
          });
        }}
        onApplyHistoricalCqi={(gapNotes) => {
          setIdentity((prev) => ({ ...prev, cqiNotes: gapNotes }));
        }}
      />

      {/* Progress Ketercapaian Kompetensi Mahasiswa & Target KPI Monitor Dashboard */}
      <StudentCompetencyDashboard
        isOpen={isStudentDashboardOpen}
        onClose={() => setIsStudentDashboardOpen(false)}
        identity={identity}
        components={components}
        instruments={instruments}
      />

      {/* Floating Action Button for AI Consultant */}
      <div className="fixed bottom-5 right-5 z-40 print:hidden">
        <button
          onClick={() => setIsConsultantChatOpen(true)}
          className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 text-white shadow-xl shadow-blue-600/30 hover:shadow-blue-600/50 hover:scale-105 active:scale-95 transition-all font-bold text-xs"
          title="Buka Konsultan Kurikulum & Evaluasi OBE Unpatti"
        >
          <Bot className="w-5 h-5 animate-pulse text-cyan-200" />
          <span className="hidden sm:inline">Konsultan OBE</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-xs" />
        </button>
      </div>
    </div>
  );
}
