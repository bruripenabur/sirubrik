import React, { useRef } from 'react';
import {
  ComponentInstrument,
  CourseIdentity,
  EvaluationComponent,
} from '../types';
import {
  X,
  Printer,
  Download,
  Award,
  CheckCircle,
  Calendar,
  Waves,
  FileText,
} from 'lucide-react';
import {
  isPascasarjanaLevel,
  SARJANA_GRADE_SCALES,
  PASCASARJANA_GRADE_SCALES,
} from '../utils/regulatoryValidator';
import { UNPATTI_LOGO_URL } from '../utils/constants';
import { triggerPrintElement, downloadPrintableHtml } from '../utils/printHelper';

interface SingleComponentPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  identity: CourseIdentity;
  component: EvaluationComponent;
  instrument: ComponentInstrument;
}

export const SingleComponentPrintModal: React.FC<SingleComponentPrintModalProps> = ({
  isOpen,
  onClose,
  identity,
  component,
  instrument,
}) => {
  const printAreaRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !instrument) return null;

  const isPasca = isPascasarjanaLevel(identity.level);
  const activeGradeScales = isPasca ? PASCASARJANA_GRADE_SCALES : SARJANA_GRADE_SCALES;

  // Print function with dedicated isolated iframe
  const handlePrint = () => {
    if (printAreaRef.current) {
      triggerPrintElement(
        printAreaRef.current,
        `Instrumen Evaluasi ${component.name} - ${identity.name} Unpatti`
      );
    } else {
      window.print();
    }
  };

  // Direct standalone HTML / PDF file download
  const handleDownloadPdfHtml = () => {
    if (!printAreaRef.current) return;
    downloadPrintableHtml(
      printAreaRef.current,
      `Instrumen_${component.name.replace(/[^a-zA-Z0-9]/g, '_')}_${(identity.code || 'MK').replace(/\s+/g, '_')}`,
      `Instrumen Evaluasi & Rubrik: ${component.name} - Universitas Pattimura`
    );
  };

  // Export single component to Microsoft Word compatible HTML with smooth pastel styling
  const handleExportWord = () => {
    if (!printAreaRef.current) return;
    const clone = printAreaRef.current.cloneNode(true) as HTMLElement;
    const kop = clone.querySelector('.kop-surat');
    if (kop) {
      kop.innerHTML = `
        <table border="0" width="100%" style="border-collapse:collapse; border:none; border-bottom:2.5px solid #0f2d59; margin-bottom:18px; padding-bottom:10px;">
          <tr>
            <td width="95" align="center" style="border:none; padding-right:15px; vertical-align:middle;">
              <img src="${UNPATTI_LOGO_URL}" width="75" height="75" style="width:2cm !important; height:2cm !important; max-width:2cm !important; max-height:2cm !important; object-fit:contain;" />
            </td>
            <td style="border:none; vertical-align:middle; text-align:left;">
              <div style="font-size:10pt; font-weight:bold; letter-spacing:1px; color:#334155; text-transform:uppercase;">KEMENTERIAN PENDIDIKAN TINGGI, SAINS, DAN TEKNOLOGI</div>
              <div style="font-size:14pt; font-weight:900; color:#0f2d59; text-transform:uppercase; margin-top:2px;">UNIVERSITAS PATTIMURA</div>
              <div style="font-size:10.5pt; font-weight:bold; color:#1e293b; text-transform:uppercase; margin-top:1px;">${identity.faculty || 'FAKULTAS TERKAIT'} — ${identity.studyProgram || 'PROGRAM STUDI'}</div>
              <div style="font-size:9pt; color:#64748b; font-style:italic; margin-top:2px;">Kampus Poka Jl. Ir. M. Putuhena, Ambon, Maluku 97233</div>
            </td>
          </tr>
        </table>
      `;
    }

    const header = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head><meta charset='utf-8'><title>${component.name} - ${identity.name} Unpatti</title>
    <style>
      body { font-family: 'Calibri', 'Segoe UI', Arial, sans-serif; font-size: 11pt; line-height: 1.5; color: #0f172a; margin: 24px; }
      h1, h2, h3, h4 { color: #0f2d59; }
      table { border-collapse: collapse; width: 100%; margin-bottom: 16px; font-size: 10pt; }
      th, td { border: 1px solid #cbd5e1; padding: 7px 10px; text-align: left; vertical-align: top; }
      th { background-color: #f1f5f9; color: #0f2d59; font-weight: bold; }
      img { width: 2cm !important; height: 2cm !important; object-fit: contain; }
      .box-info { background-color: #f8fafc; border: 1px solid #cbd5e1; padding: 12px; border-radius: 6px; margin-bottom: 14px; }
      .box-case { background-color: #eff6ff; border-left: 4px solid #1d4ed8; padding: 12px 14px; border-radius: 4px; margin-bottom: 14px; }
      .box-formula { background-color: #faf5ff; border: 1px solid #e9d5ff; font-family: Consolas, monospace; padding: 8px 12px; border-radius: 4px; }
      .badge-pasal47 { background-color: #ecfdf5; color: #065f46; font-weight: bold; padding: 2px 6px; border-radius: 4px; }
      .badge-pip { background-color: #e0f2fe; color: #0369a1; font-weight: bold; padding: 2px 6px; border-radius: 4px; }
    </style></head><body>`;
    const footer = '</body></html>';
    const sourceHTML = header + clone.innerHTML + footer;

    const blob = new Blob(['\ufeff', sourceHTML], {
      type: 'application/msword',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Instrumen_${component.name.replace(/[^a-zA-Z0-9]/g, '_')}_${(identity.code || 'MK').replace(/\s+/g, '_')}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        {/* Header Bar (Hidden during print) */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 print:hidden shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 rounded font-bold bg-blue-500/20 text-cyan-300 border border-blue-400/30">
                Dokumen Resmi RPS
              </span>
              <span className="text-xs text-slate-300">
                Bobot: {component.weight}% • {component.suggestedWeeks}
              </span>
            </div>
            <h3 className="font-bold text-sm sm:text-base text-white mt-0.5 truncate max-w-xl">
              Cetak / Ekspor Instrumen &amp; Rubrik: {component.name}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportWord}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition"
              title="Ekspor ke format Microsoft Word (.doc) berwarna smooth"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ekspor Word (.doc)</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition"
              title="Unduh / Cetak Dokumen sebagai PDF"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Unduh PDF</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white shadow-sm transition"
              title="Cetak langsung ke printer atau simpan sebagai PDF A4"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Area */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 bg-slate-50 print:bg-white print:p-0">
          <div
            ref={printAreaRef}
            className="printable-single-component bg-white p-6 sm:p-10 rounded-2xl shadow-sm border border-slate-200 print:border-none print:shadow-none print:p-0 max-w-3xl mx-auto space-y-6 text-slate-900"
          >
            {/* Kop Surat Universitas Pattimura with Logo */}
            <div className="kop-surat border-b-2 border-slate-900 pb-4 text-center">
              <div className="flex items-center justify-center gap-4 mb-1">
                <img
                  src={UNPATTI_LOGO_URL}
                  alt="Logo Universitas Pattimura"
                  className="w-[2cm] h-[2cm] object-contain shrink-0"
                  style={{ width: '2cm', height: '2cm' }}
                />
                <div className="text-left">
                  <div className="text-[11px] uppercase font-bold tracking-widest text-slate-700">
                    KEMENTERIAN PENDIDIKAN TINGGI, SAINS, DAN TEKNOLOGI
                  </div>
                  <div className="text-base sm:text-lg font-black tracking-wide text-blue-950 uppercase leading-tight">
                    UNIVERSITAS PATTIMURA
                  </div>
                  <div className="text-xs font-bold text-slate-800 uppercase">
                    {identity.faculty || 'FAKULTAS TERKAIT'} — {identity.studyProgram || 'PROGRAM STUDI'}
                  </div>
                  <div className="text-[10px] text-slate-500 italic">
                    Kampus Poka Jl. Ir. M. Putuhena, Ambon, Maluku 97233
                  </div>
                </div>
              </div>
            </div>

            {/* Document Header */}
            <div className="text-center space-y-1">
              <h2 className="text-sm sm:text-base font-black uppercase text-slate-900">
                INSTRUMEN EVALUASI PEMBELAJARAN &amp; RUBRIK PENILAIAN
              </h2>
              <p className="text-xs text-slate-600 font-medium">
                Lampiran Rencana Pembelajaran Semester (RPS) Berbasis Outcome-Based Education (OBE)
              </p>
              <div className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                Standar Peraturan Rektor No. 12 Tahun 2026 (Pasal 47)
              </div>
            </div>

            {/* Course & Component Information Table */}
            <div className="box-info bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-2">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div>
                  <span className="text-slate-500 block text-[10px]">Mata Kuliah</span>
                  <span className="font-bold text-slate-900">{identity.name}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Kode / Bobot</span>
                  <span className="font-bold text-slate-900">{identity.code || 'MK'} ({identity.sks} SKS)</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Semester / Jenjang</span>
                  <span className="font-bold text-slate-900">Smtr {identity.semester} • {identity.level}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Dosen Pengampu</span>
                  <span className="font-bold text-slate-900">{identity.lecturer}</span>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-2 grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <span className="text-slate-500 block text-[10px]">Komponen Evaluasi</span>
                  <span className="font-bold text-blue-900">{component.name}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Bobot Nilai Akhir</span>
                  <span className="font-bold text-emerald-800">{component.weight}% (dari 100%)</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Jadwal Pelaksanaan</span>
                  <span className="font-bold text-slate-800">{component.suggestedWeeks}</span>
                </div>
              </div>
            </div>

            {/* Part 1: Task Details */}
            <div className="space-y-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1 flex items-center justify-between">
                <span>1. Rincian &amp; Petunjuk Tugas Mahasiswa</span>
                <span className="text-[10px] text-blue-600 lowercase font-normal">
                  sub-cpmk: {instrument.taskDetails.subCpmk}
                </span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 block text-[10px]">Bentuk Asesmen / Metode:</span>
                  <span className="font-medium text-slate-800">{instrument.taskDetails.taskType}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Batas Waktu Pengumpulan:</span>
                  <span className="font-medium text-slate-800">{instrument.taskDetails.deadline || component.suggestedWeeks}</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-slate-500 block text-[10px]">Relevansi Pola Ilmiah Pokok (Bina Mulia ke Lautan) &amp; SDGs:</span>
                  <span className="font-medium text-cyan-900">{instrument.taskDetails.pipSdgsRelevance}</span>
                </div>
              </div>

              <div className="text-xs space-y-1">
                <span className="text-slate-500 block text-[10px]">Instruksi Pengerjaan:</span>
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-700 whitespace-pre-wrap leading-relaxed text-[11px]">
                  {instrument.taskDetails.instructions}
                </div>
              </div>
            </div>

            {/* Part 2: HOTS Problem or Case Text */}
            <div className="space-y-2">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1">
                2. Naskah Kasus Autentik / Soal Evaluasi HOTS
              </h3>
              <div className="box-case bg-blue-50/70 border-l-4 border-blue-600 p-4 rounded-r-lg text-xs leading-relaxed text-slate-800 whitespace-pre-wrap">
                {instrument.taskDetails.caseOrProblemText}
              </div>
            </div>

            {/* Part 3: Grading Rubric Matrix */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-1">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                  3. Matriks Rubrik Penilaian Analitis ({instrument.rubric.type.toUpperCase()})
                </h3>
                <span className="text-[10px] text-slate-500">
                  Skala Penilaian: {instrument.rubric.scaleType.toUpperCase()} (0 - 100)
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-slate-800 border border-slate-300">
                      <th className="p-2 border border-slate-300 w-32 font-bold">Kriteria Penilaian</th>
                      <th className="p-2 border border-slate-300 w-16 text-center font-bold">Bobot</th>
                      {activeGradeScales.map((s) => (
                        <th key={s.grade} className="p-2 border border-slate-300 text-center">
                          <div className="font-bold text-blue-900">{s.grade}</div>
                          <div className="text-[9px] text-slate-500">
                            {s.minScore}-{s.maxScore}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {instrument.rubric.criteria.map((crit, cIdx) => (
                      <tr key={crit.id || cIdx} className="border border-slate-300">
                        <td className="p-2 border border-slate-300 font-semibold align-top bg-slate-50 text-slate-900">
                          <div>{crit.aspect}</div>
                          {crit.cpmkMapping && (
                            <div className="text-[10px] text-blue-600 font-normal mt-0.5">
                              {crit.cpmkMapping}
                            </div>
                          )}
                        </td>
                        <td className="p-2 border border-slate-300 text-center font-bold font-mono align-top text-blue-900">
                          {crit.weight}%
                        </td>
                        {crit.levels.map((lvl, lIdx) => (
                          <td
                            key={lvl.grade || lIdx}
                            className="p-2 border border-slate-300 text-[10px] leading-relaxed align-top text-slate-700"
                          >
                            {lvl.descriptor}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Part 4: Scoring Formula */}
            <div className="space-y-1.5 pt-2 border-t border-slate-200">
              <h4 className="font-bold text-xs text-slate-800">
                4. Formula Akumulasi Skor Akhir Komponen
              </h4>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 font-mono text-[11px] text-blue-950">
                {instrument.calculationFormula}
              </div>
            </div>

            {/* Official Signatures Box */}
            <div className="pt-6 border-t-2 border-slate-900 text-xs">
              <div className="grid grid-cols-2 gap-8 text-center">
                <div>
                  <p className="text-slate-500">Mengetahui,</p>
                  <p className="font-bold text-slate-900 mt-0.5">Koordinator Program Studi</p>
                  <div className="h-16" />
                  <p className="font-bold text-slate-900 underline">( ..................................................... )</p>
                  <p className="text-[10px] text-slate-500">NIP. .....................................................</p>
                </div>
                <div>
                  <p className="text-slate-500">Ambon, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  <p className="font-bold text-slate-900 mt-0.5">Dosen Pengampu Mata Kuliah</p>
                  <div className="h-16" />
                  <p className="font-bold text-slate-900 underline">({identity.lecturer || 'Dosen Pengampu'})</p>
                  <p className="text-[10px] text-slate-500">NIP. .....................................................</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
