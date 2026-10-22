import React, { useState } from 'react';
import {
  CourseIdentity,
  EvaluationComponent,
  EvaluationModelType,
  KKNILevel,
} from '../types';
import {
  FileText,
  Upload,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Edit2,
  BookMarked,
  Info,
  Layers,
  Award,
  Globe2,
  Calendar,
  Percent,
  Trash2,
  Paperclip,
  Check,
  File,
} from 'lucide-react';
import {
  validateEvaluationComponents,
  isCaseOrProjectCategory,
  isPascasarjanaLevel,
} from '../utils/regulatoryValidator';
import { EvaluationCalendar } from './EvaluationCalendar';
import * as XLSX from 'xlsx';

interface Stage1MappingProps {
  identity: CourseIdentity;
  onUpdateIdentity: (identity: CourseIdentity) => void;
  components: EvaluationComponent[];
  onUpdateComponents: (components: EvaluationComponent[]) => void;
  selectedModel: EvaluationModelType;
  onSelectModel: (model: EvaluationModelType) => void;
  rpsText: string;
  onUpdateRpsText: (text: string) => void;
  referenceText: string;
  onUpdateReferenceText: (text: string) => void;
  onAnalyzeWithAi: () => Promise<void>;
  isAnalyzing: boolean;
  onConfirmMappingProceedToDraft: () => void;
  onProceedToRevision: () => void;
  uploadedPdfFileName?: string;
  onUploadPdfBase64?: (base64: string, filename: string) => void;
  onClearUploadedPdf?: () => void;
}

export const Stage1Mapping: React.FC<Stage1MappingProps> = ({
  identity,
  onUpdateIdentity,
  components,
  onUpdateComponents,
  selectedModel,
  onSelectModel,
  rpsText,
  onUpdateRpsText,
  referenceText,
  onUpdateReferenceText,
  onAnalyzeWithAi,
  isAnalyzing,
  onConfirmMappingProceedToDraft,
  onProceedToRevision,
  uploadedPdfFileName,
  onUploadPdfBase64,
  onClearUploadedPdf,
}) => {
  const [showIdentityEdit, setShowIdentityEdit] = useState(false);
  const [activeTab, setActiveTab] = useState<'upload' | 'mapping'>('upload');
  const [uploadedFileStatus, setUploadedFileStatus] = useState<string | null>(null);
  const [referenceFiles, setReferenceFiles] = useState<
    Array<{ id: string; name: string; size: number; type: string }>
  >([]);

  const validation = validateEvaluationComponents(components);
  const isPasca = isPascasarjanaLevel(identity.level);

  // Multi-file reference upload handler (.pdf, .doc, .docx, .txt, .md, .xlsx, .xls)
  const handleMultiFileReferenceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newDocs: Array<{ id: string; name: string; size: number; type: string }> = [];
    let appendedSummary = '';

    Array.from(files).forEach((file) => {
      const docId = `ref-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      newDocs.push({
        id: docId,
        name: file.name,
        size: file.size,
        type: file.name.split('.').pop() || 'file',
      });

      const lowerName = file.name.toLowerCase();
      if (lowerName.endsWith('.xlsx') || lowerName.endsWith('.xls')) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          try {
            const data = new Uint8Array(ev.target?.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: 'array' });
            let sheetText = `\n\n=== REFERENSI TABEL EXCEL: ${file.name} ===\n`;
            workbook.SheetNames.forEach((sheet) => {
              sheetText += `[Lembar Kerja: ${sheet}]\n` + XLSX.utils.sheet_to_txt(workbook.Sheets[sheet]) + '\n';
            });
            onUpdateReferenceText((referenceText ? referenceText + '\n' : '') + sheetText);
          } catch {
            onUpdateReferenceText((referenceText ? referenceText + '\n' : '') + `\n=== DOKUMEN RUJUKAN: ${file.name} ===\n`);
          }
        };
        reader.readAsArrayBuffer(file);
      } else if (lowerName.endsWith('.txt') || lowerName.endsWith('.md') || lowerName.endsWith('.json')) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          const text = ev.target?.result as string;
          onUpdateReferenceText((referenceText ? referenceText + '\n\n' : '') + `=== DOKUMEN RUJUKAN: ${file.name} ===\n${text}`);
        };
        reader.readAsText(file);
      } else {
        // PDF, DOC, DOCX
        appendedSummary += `\n=== DOKUMEN RUJUKAN TERUNGGAH: ${file.name} (${Math.round(file.size / 1024)} KB) ===\n[File rujukan akademik / artikel jurnal terintegrasi ke naskah soal]\n`;
      }
    });

    if (appendedSummary) {
      onUpdateReferenceText((referenceText ? referenceText + '\n' : '') + appendedSummary);
    }

    setReferenceFiles((prev) => [...prev, ...newDocs]);
    e.target.value = '';
  };

  const handleRemoveRefFile = (docId: string, docName: string) => {
    setReferenceFiles((prev) => prev.filter((d) => d.id !== docId));
  };

  const handleClearAllRefFiles = () => {
    setReferenceFiles([]);
    onUpdateReferenceText('');
  };

  // File upload handler supporting .pdf, .xlsx, .xls, .txt, .md, .doc, .docx
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const lowerName = file.name.toLowerCase();

    // 1. Handling Excel (.xlsx / .xls)
    if (lowerName.endsWith('.xlsx') || lowerName.endsWith('.xls')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = new Uint8Array(event.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          let combinedText = `=== DOKUMEN RPS EXCEL TERUNGGAH: ${file.name} ===\n\n`;

          workbook.SheetNames.forEach((sheetName) => {
            const worksheet = workbook.Sheets[sheetName];
            combinedText += `--- LEMBAR KERJA (SHEET): ${sheetName} ---\n`;
            combinedText += XLSX.utils.sheet_to_txt(worksheet) + '\n\n';
          });

          onUpdateRpsText(combinedText);
          onClearUploadedPdf?.();
          setUploadedFileStatus(`File Excel (.xlsx) "${file.name}" berhasil diekstrak (${workbook.SheetNames.length} sheet).`);
        } catch (err) {
          console.error('Error reading Excel file:', err);
          alert('Gagal membaca file Excel. Pastikan file berformat .xlsx yang valid.');
        }
      };
      reader.readAsArrayBuffer(file);
      return;
    }

    // 2. Handling PDF (.pdf)
    if (lowerName.endsWith('.pdf')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const resultStr = event.target?.result as string;
          const base64Data = resultStr.split(',')[1] || '';
          onUploadPdfBase64?.(base64Data, file.name);

          // Update text preview with friendly description
          onUpdateRpsText(
            `=== DOKUMEN RPS PDF TERUNGGAH ===\n` +
            `Nama File: ${file.name}\n` +
            `Ukuran File: ${(file.size / 1024).toFixed(1)} KB\n` +
            `Status: Siap Dianalisis AI (Gemini 3.8 Flash akan membaca seluruh teks, tabel CPMK, Sub-CPMK, dan jadwal pertemuan secara langsung dari berkas PDF).\n\n` +
            `Silakan klik tombol "Susun Pemetaan Pertemuan (Tahap 1)" di bawah untuk memproses berkas PDF ini.`
          );
          setUploadedFileStatus(`File PDF "${file.name}" (${(file.size / 1024).toFixed(1)} KB) siap dianalisis langsung oleh AI.`);
        } catch (err) {
          console.error('Error reading PDF file:', err);
          alert('Gagal membaca berkas PDF.');
        }
      };
      reader.readAsDataURL(file);
      return;
    }

    // 3. Handling Text (.txt, .md, .json, .csv)
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      onUpdateRpsText(content);
      onClearUploadedPdf?.();
      setUploadedFileStatus(`File teks "${file.name}" berhasil dimuat.`);
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Welcome & Persona Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-6 sm:p-7 shadow-lg border border-blue-700/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-semibold border border-cyan-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sistem Pakar Evaluasi & Kurikulum OBE Unpatti</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Selamat datang di SIRUBRIK
            </h2>
            <p className="text-slate-200 text-sm leading-relaxed">
              Selamat datang di <strong>SIRUBRIK : Desain Instrumen Evaluasi & Rubrik Penilaian Mata Kuliah Berbasis OBE</strong>. Silakan pastikan file RPS OBE (dan modul/buku rujukan jika ada) sudah terunggah, serta tuliskan rincian Komponen Evaluasi Penilaian Mata Kuliah Anda. Saya akan memulai dengan menyusun Identitas MK dan Pemetaan Jadwal Pertemuan Evaluasinya untuk Anda tinjau.
            </p>
          </div>
          <div className="flex flex-col gap-2 shrink-0">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/15 text-xs text-blue-100 space-y-1">
              <div className="font-semibold text-white flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-cyan-300" />
                <span>Standar Institusional:</span>
              </div>
              <div>• Pertor No. 12 Tahun 2026 (Pasal 47)</div>
              <div>• KKNI Level 6–9 &amp; Taksonomi Bloom</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-4">
        <button
          onClick={() => setActiveTab('upload')}
          className={`pb-3 font-semibold text-sm transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === 'upload'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Upload className="w-4 h-4" />
          <span>1. Unggah / Input RPS OBE & Model Penilaian</span>
        </button>
        <button
          onClick={() => setActiveTab('mapping')}
          className={`pb-3 font-semibold text-sm transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === 'mapping'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>2. Identitas MK & Matriks Pemetaan Pertemuan</span>
          {components.length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-blue-100 text-blue-700 font-bold">
              {components.length}
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: UPLOAD & INPUT */}
      {activeTab === 'upload' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            {/* Guidance Card */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl space-y-2 text-xs text-blue-950 shadow-xs">
              <div className="font-bold text-blue-900 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>Siapkan berkas utama mata kuliah Anda:</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-[11px] text-blue-900 font-medium">
                <li><strong>File RPS (PDF/DOCX):</strong> CPL, CPMK, &amp; Sub-CPMK.</li>
                <li><strong>File Rubrik Penilaian (PDF/DOCX):</strong> Jenis dan Bobot Asesmen.</li>
                <li><strong>File Nilai (Excel/CSV):</strong> Nilai mahasiswa per unit kelas.</li>
              </ul>
              <p className="pt-1 text-[11px] text-blue-900 italic leading-relaxed">
                Unggah RPS, Rubrik Penilaian dan Berkas Nilai Mahasiswa, lalu sistem otomatis mengekstrak CPL, CPMK, model penilaian Pasal 47, serta mengkalkulasi ketercapaian secara otomatis.
              </p>
            </div>

            {/* RPS Input Box */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span>File RPS OBE (Wajib)</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Unggah berkas RPS (<strong>.PDF</strong>, <strong>.XLSX</strong> Excel, <strong>.DOCX</strong>, atau <strong>.TXT</strong>) atau tempel teks silabus Anda.
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                      PDF Document
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      Excel (.xlsx)
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                      Word / Text
                    </span>
                  </div>
                </div>
                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-sm transition">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Pilih Berkas RPS</span>
                  <input
                    type="file"
                    accept=".pdf,.xlsx,.xls,.doc,.docx,.txt,.md,.json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {uploadedFileStatus && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-semibold">{uploadedFileStatus}</span>
                  </div>
                  <button
                    onClick={() => {
                      setUploadedFileStatus(null);
                      onClearUploadedPdf?.();
                    }}
                    className="text-[11px] text-emerald-700 hover:text-emerald-900 underline font-medium"
                  >
                    Ganti
                  </button>
                </div>
              )}

              <textarea
                value={rpsText}
                onChange={(e) => onUpdateRpsText(e.target.value)}
                rows={10}
                placeholder="Tempel teks RPS OBE Anda di sini... (memuat Nama Mata Kuliah, Kode, SKS, CPMK, Sub-CPMK, Materi Pokok, dan Indikator Penilaian)"
                className="w-full text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
              />

              {/* Optional Reference Box with Multi-File Upload */}
              <div className="border-t border-slate-100 pt-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <BookMarked className="w-3.5 h-3.5 text-teal-600" />
                      <span>Buku Rujukan / Modul Referensi / Artikel Jurnal (Opsional)</span>
                    </label>
                    <p className="text-[11px] text-slate-500">
                      Unggah banyak berkas referensi sekaligus (<strong>.PDF</strong>, <strong>.DOCX</strong>, <strong>.XLSX</strong>, <strong>.TXT</strong>) atau tuliskan rujukan manual.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-300 transition shadow-2xs">
                      <Upload className="w-3.5 h-3.5 text-teal-600" />
                      <span>Unggah Multi-File Referensi</span>
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.doc,.docx,.txt,.md,.xlsx,.xls,.json"
                        onChange={handleMultiFileReferenceUpload}
                        className="hidden"
                      />
                    </label>

                    {referenceFiles.length > 0 && (
                      <button
                        type="button"
                        onClick={handleClearAllRefFiles}
                        className="text-[11px] text-rose-600 hover:text-rose-800 font-semibold px-2 py-1 rounded hover:bg-rose-50 transition"
                        title="Hapus semua berkas rujukan"
                      >
                        Reset File
                      </button>
                    )}
                  </div>
                </div>

                {/* Uploaded Reference Files Chips */}
                {referenceFiles.length > 0 && (
                  <div className="flex flex-wrap gap-2 p-3 bg-teal-50/50 rounded-xl border border-teal-200/80">
                    {referenceFiles.map((rf) => (
                      <div
                        key={rf.id}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-teal-300 text-xs text-slate-800 shadow-2xs"
                      >
                        <Paperclip className="w-3 h-3 text-teal-600 shrink-0" />
                        <span className="font-semibold truncate max-w-[180px]">{rf.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          ({Math.round(rf.size / 1024)} KB)
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveRefFile(rf.id, rf.name)}
                          className="text-slate-400 hover:text-rose-600 p-0.5 rounded transition"
                          title="Hapus dokumen ini"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <textarea
                  value={referenceText}
                  onChange={(e) => onUpdateReferenceText(e.target.value)}
                  rows={3}
                  placeholder="Tuliskan daftar buku teks referensi, modul ajar Unpatti, artikel jurnal atau ringkasan materi untuk memperkaya substansi soal/kasus instrumen..."
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                />
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-blue-50/60 p-4 rounded-xl border border-blue-100">
              <div className="text-xs text-blue-900 flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-600 shrink-0" />
                <span>
                  Sistem AI Konsultan akan mengekstraksi CPMK, menyusun pembobotan sesuai Pasal 47, dan mengusulkan alokasi minggu pelaksanaan.
                </span>
              </div>
              <button
                onClick={async () => {
                  await onAnalyzeWithAi();
                  setActiveTab('mapping');
                }}
                disabled={isAnalyzing}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-blue-500/20 disabled:opacity-50 transition"
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Menganalisis RPS OBE...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Susun Pemetaan Pertemuan (Tahap 1)</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Sidebar: Model Selection & Unpatti Pasal 47 Guidance */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Percent className="w-4 h-4 text-blue-600" />
                <span>Model Komponen Penilaian (Pasal 47)</span>
              </h3>
              <p className="text-xs text-slate-500">
                Pilih model standar penilaian Peraturan Rektor No. 12 Tahun 2026:
              </p>

              <div className="space-y-2.5">
                {/* Model 1 */}
                <label
                  onClick={() => onSelectModel('model_1')}
                  className={`block p-3 rounded-xl border text-xs cursor-pointer transition ${
                    selectedModel === 'model_1'
                      ? 'border-blue-600 bg-blue-50/70 text-blue-950 font-medium ring-1 ring-blue-500'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold mb-1">
                    <span>Model 1: 55% Kasus & Proyek</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-200/70 text-blue-800">
                      Rekomendasi
                    </span>
                  </div>
                  <ul className="text-[11px] text-slate-600 space-y-0.5">
                    <li>• Case Method: <strong>30%</strong></li>
                    <li>• Team-Based Project: <strong>25%</strong></li>
                    <li>• Tugas Terstruktur: <strong>15%</strong></li>
                    <li>• Kuis & Partisipatif: <strong>5%</strong></li>
                    <li>• UTS: <strong>10%</strong> | UAS: <strong>15%</strong></li>
                  </ul>
                </label>

                {/* Model 2 */}
                <label
                  onClick={() => onSelectModel('model_2')}
                  className={`block p-3 rounded-xl border text-xs cursor-pointer transition ${
                    selectedModel === 'model_2'
                      ? 'border-blue-600 bg-blue-50/70 text-blue-950 font-medium ring-1 ring-blue-500'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold mb-1">
                    <span>Model 2: Praktik & Proyek Lapangan</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-200/70 text-emerald-800">
                      Lab / Lapangan
                    </span>
                  </div>
                  <ul className="text-[11px] text-slate-600 space-y-0.5">
                    <li>• Hasil Proyek & Praktik: <strong>35%</strong></li>
                    <li>• Partisipatif & Diskusi Kasus: <strong>20%</strong></li>
                    <li>• Tugas & Analisis Data: <strong>15%</strong></li>
                    <li>• UTS: <strong>15%</strong> | UAS: <strong>15%</strong></li>
                  </ul>
                </label>

                {/* Model 3 */}
                <label
                  onClick={() => onSelectModel('model_3')}
                  className={`block p-3 rounded-xl border text-xs cursor-pointer transition ${
                    selectedModel === 'model_3'
                      ? 'border-blue-600 bg-blue-50/70 text-blue-950 font-medium ring-1 ring-blue-500'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold mb-1">
                    <span>Model 3: Seimbang (50% Kasus/Proyek)</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-200/70 text-amber-800">
                      Batas Minimal
                    </span>
                  </div>
                  <ul className="text-[11px] text-slate-600 space-y-0.5">
                    <li>• Case Method: <strong>25%</strong></li>
                    <li>• Team-Based Project: <strong>25%</strong></li>
                    <li>• Tugas Terstruktur: <strong>10%</strong></li>
                    <li>• Kuis Berkala: <strong>10%</strong></li>
                    <li>• UTS: <strong>15%</strong> | UAS: <strong>15%</strong></li>
                  </ul>
                </label>
              </div>
            </div>

            {/* Quick Summary of Pasal 47 */}
            <div className="bg-amber-50/80 rounded-2xl p-4 border border-amber-200/80 text-xs text-amber-950 space-y-2">
              <div className="font-bold flex items-center gap-1.5 text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Aturan Wajib Pasal 47 (1-3):</span>
              </div>
              <p className="text-[11px] leading-relaxed text-amber-900">
                PjBL &amp; Case Method <strong>SEKURANG-KURANGNYA 50%</strong>. Ujian (UTS+UAS) &amp; Tugas Mandiri <strong>PALING BANYAK 50%</strong>.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: IDENTITAS & PEMETAAN PERTEMUAN */}
      {activeTab === 'mapping' && (
        <div className="space-y-6">
          {/* Identity Card */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-base">
                  Identitas Mata Kuliah &amp; Acuan Kurikulum
                </h3>
              </div>
              <button
                onClick={() => setShowIdentityEdit(!showIdentityEdit)}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 self-start sm:self-auto"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>{showIdentityEdit ? 'Tutup Pengeditan' : 'Edit Identitas'}</span>
              </button>
            </div>

            {showIdentityEdit ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nama Mata Kuliah</label>
                  <input
                    type="text"
                    value={identity.name}
                    onChange={(e) => onUpdateIdentity({ ...identity, name: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Kode MK &amp; SKS</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={identity.code}
                      onChange={(e) => onUpdateIdentity({ ...identity, code: e.target.value })}
                      className="w-2/3 bg-white border border-slate-300 rounded-lg p-2"
                      placeholder="Kode MK"
                    />
                    <input
                      type="number"
                      value={identity.sks}
                      onChange={(e) => onUpdateIdentity({ ...identity, sks: parseInt(e.target.value) || 1 })}
                      className="w-1/3 bg-white border border-slate-300 rounded-lg p-2"
                      placeholder="SKS"
                    />
                  </div>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Jenjang KKNI</label>
                  <select
                    value={identity.level}
                    onChange={(e) => onUpdateIdentity({ ...identity, level: e.target.value as KKNILevel })}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2"
                  >
                    <option value="Level 6 (Sarjana / D4)">Level 6 (Sarjana / D4)</option>
                    <option value="Level 7 (Profesi)">Level 7 (Profesi)</option>
                    <option value="Level 8 (Magister / Spesialis)">Level 8 (Magister / Spesialis)</option>
                    <option value="Level 9 (Doktor / Subspesialis)">Level 9 (Doktor / Subspesialis)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Fakultas</label>
                  <input
                    type="text"
                    value={identity.faculty}
                    onChange={(e) => onUpdateIdentity({ ...identity, faculty: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Program Studi</label>
                  <input
                    type="text"
                    value={identity.studyProgram}
                    onChange={(e) => onUpdateIdentity({ ...identity, studyProgram: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Dosen Pengampu</label>
                  <input
                    type="text"
                    value={identity.lecturer}
                    onChange={(e) => onUpdateIdentity({ ...identity, lecturer: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2"
                  />
                </div>
                <div className="sm:col-span-2 lg:col-span-3">
                  <label className="font-bold text-slate-700 block mb-1">Fokus Kontekstual &amp; Karakteristik Keilmuan</label>
                  <input
                    type="text"
                    value={identity.pipFocus}
                    onChange={(e) => onUpdateIdentity({ ...identity, pipFocus: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Mata Kuliah</span>
                  <span className="font-bold text-slate-900 text-sm">{identity.name || '-'}</span>
                  <span className="text-slate-500 font-mono text-[11px] block">{identity.code}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Beban Belajar &amp; Semester</span>
                  <span className="font-bold text-slate-800">{identity.sks} SKS • Semester {identity.semester}</span>
                  <span className="text-slate-500 block text-[11px]">T.A. 2026/2027</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Jenjang &amp; KKNI</span>
                  <span className="inline-flex px-2 py-0.5 rounded font-bold bg-blue-100 text-blue-800 text-[11px]">
                    {identity.level}
                  </span>
                  <span className="text-slate-500 block text-[11px] mt-0.5">
                    {isPasca ? 'Skala Pasca (A, A-, B+, B, B-, C, E)' : 'Skala S1 (A, B, C, D, E)'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Program Studi / Fakultas</span>
                  <span className="font-semibold text-slate-800">{identity.studyProgram || '-'}</span>
                  <span className="text-slate-500 block text-[11px]">{identity.faculty}</span>
                </div>
              </div>
            )}

            {/* PIP & SDGs & CPMK */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-slate-100 text-xs">
              <div className="p-3 bg-cyan-50/60 rounded-xl border border-cyan-100 space-y-1">
                <div className="font-bold text-cyan-950 flex items-center gap-1.5">
                  <Globe2 className="w-4 h-4 text-cyan-600" />
                  <span>Fokus Kontekstual &amp; SDGs:</span>
                </div>
                <p className="text-cyan-900 text-[11px] leading-relaxed">
                  {identity.pipFocus || 'Konteks laut-pulau perairan kepulauan Maluku'}
                </p>
                <div className="flex flex-wrap gap-1 pt-1">
                  {(identity.sdgsAlignment || []).map((sdg, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-cyan-200/60 text-cyan-900 text-[10px] font-semibold">
                      {sdg}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 space-y-1">
                <div className="font-bold text-indigo-950 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-indigo-600" />
                  <span>Capaian Pembelajaran Mata Kuliah (CPMK):</span>
                </div>
                <ul className="text-indigo-900 text-[11px] space-y-1 max-h-24 overflow-y-auto pr-1">
                  {(identity.cpmkList || []).map((cpmk) => (
                    <li key={cpmk.id} className="flex gap-1.5">
                      <strong className="shrink-0">{cpmk.code}:</strong>
                      <span>{cpmk.desc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Pasal 47 Compliance Meter */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Percent className="w-4 h-4 text-blue-600" />
                  <span>Status Kepatuhan Pasal 47 Peraturan Rektor No. 12 Tahun 2026</span>
                </h4>
                <p className="text-xs text-slate-500">
                  Total Komponen Berbasis Proyek (PjBL) &amp; Pemecahan Kasus (Case Method) wajib ≥ 50%.
                </p>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${
                    validation.isPasal47Compliant && validation.isTotalValid
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                      : 'bg-amber-50 text-amber-700 border-amber-300'
                  }`}
                >
                  {validation.isPasal47Compliant && validation.isTotalValid ? (
                    <>
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Lolos Verifikasi Pasal 47 (Sesuai SPMI)</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      <span>Perlu Penyesuaian Bobot</span>
                    </>
                  )}
                </span>
              </div>
            </div>

            {/* Visual Bar */}
            <div className="space-y-1.5">
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
                <div
                  style={{ width: `${Math.min(validation.caseProjectWeight, 100)}%` }}
                  className={`h-full transition-all ${
                    validation.caseProjectWeight >= 50
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-500'
                      : 'bg-gradient-to-r from-amber-500 to-orange-500'
                  }`}
                  title={`Kasus & Proyek: ${validation.caseProjectWeight}%`}
                />
                <div
                  style={{ width: `${Math.min(validation.traditionalWeight, 100)}%` }}
                  className="h-full bg-slate-300 transition-all"
                  title={`Tugas & Ujian: ${validation.traditionalWeight}%`}
                />
              </div>

              <div className="flex justify-between text-[11px] text-slate-600 font-medium">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-cyan-500" />
                  <span>
                    Kasus &amp; Proyek: <strong>{validation.caseProjectWeight}%</strong> (Syarat: ≥ 50%)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-slate-400" />
                  <span>
                    Tugas &amp; Ujian: <strong>{validation.traditionalWeight}%</strong> (Syarat: ≤ 50%)
                  </span>
                </div>
                <div>
                  Total: <strong className={validation.isTotalValid ? 'text-slate-900' : 'text-red-600'}>{validation.totalWeight}%</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Table of Evaluation Mapping */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 sm:p-5 bg-slate-50/80 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span>Tabel Pemetaan Komponen Evaluasi &amp; Saran Pelaksanaan Minggu Ke-</span>
                </h4>
                <p className="text-xs text-slate-500">
                  Daftar komponen penilaian, Sub-CPMK yang diukur, dan jadwal minggu pelaksanaan.
                </p>
              </div>
              <button
                onClick={onProceedToRevision}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-xs hover:border-blue-300 transition inline-flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Revisi / Sesuaikan Jadwal &amp; Bobot</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/80 text-slate-700 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4 w-12 text-center">No</th>
                    <th className="py-3 px-4">Jenis Komponen Evaluasi</th>
                    <th className="py-3 px-4 w-24 text-center">Bobot (%)</th>
                    <th className="py-3 px-4">Sub-CPMK &amp; Level Taksonomi Bloom</th>
                    <th className="py-3 px-4 w-40 text-center">Saran Minggu Ke-</th>
                    <th className="py-3 px-4 w-28 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {components.map((comp, idx) => {
                    const isCaseProj = isCaseOrProjectCategory(comp.category);
                    return (
                      <tr key={comp.id} className="hover:bg-blue-50/30 transition-colors">
                        <td className="py-3 px-4 text-center font-bold text-slate-500">
                          {idx + 1}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900 text-xs flex items-center gap-2">
                            <span>{comp.name}</span>
                            {isCaseProj && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-100 text-blue-800 font-semibold">
                                Pasal 47
                              </span>
                            )}
                          </div>
                          {comp.description && (
                            <div className="text-[11px] text-slate-500 mt-0.5">
                              {comp.description}
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center font-mono font-bold text-blue-950 text-xs">
                          {comp.weight}%
                        </td>
                        <td className="py-3 px-4">
                          <div className="space-y-1">
                            <div className="font-semibold text-slate-700">
                              {(comp.subCpmkList || []).join(', ') || 'Sub-CPMK Umum'}
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {(comp.bloomLevels || []).map((lvl, i) => (
                                <span
                                  key={i}
                                  className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200"
                                >
                                  {lvl}
                                </span>
                              ))}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center font-semibold text-slate-800 bg-slate-50/50">
                          <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-blue-700 shadow-2xs font-mono">
                            {comp.suggestedWeeks || '-'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          {comp.status === 'approved' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800">
                              <CheckCircle className="w-3 h-3" /> Selesai
                            </span>
                          ) : comp.status === 'drafted' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-800">
                              Ada Draf
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600">
                              Menunggu
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

          {/* Kalender Evaluasi 16 Minggu */}
          <EvaluationCalendar
            components={components}
            courseName={identity.name}
            onSelectComponent={() => {}}
          />

          {/* CRITICAL CONFIRMATION PROTOCOL BANNER (As Instructed) */}
          <div className="bg-gradient-to-r from-blue-900 to-indigo-950 rounded-2xl p-6 text-white border-2 border-cyan-400/40 shadow-xl space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/20 flex items-center justify-center shrink-0 border border-cyan-400/30 text-cyan-300">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="space-y-1 flex-1">
                <div className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                  Konfirmasi Alur Protokol Tahap 1 (Wajib)
                </div>
                <blockquote className="text-sm font-medium italic text-slate-100 leading-relaxed bg-black/20 p-3.5 rounded-xl border border-white/10">
                  "Berikut adalah pemetaan Identitas Mata Kuliah {identity.level ? `[${identity.level}]` : ''}, Komponen Evaluasi Berbasis OBE &amp; Peraturan Akademik Unpatti No. 12 Tahun 2026, beserta Saran Pelaksanaan Minggunya. Apakah Anda menyetujui pemetaan ini, atau ada penyesuaian/revisi jadwal dan bobot sebelum kita menyusun instrumen komponen pertama?"
                </blockquote>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
              <button
                onClick={onProceedToRevision}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-slate-100 border border-white/20 transition flex items-center justify-center gap-2"
              >
                <Edit2 className="w-4 h-4 text-amber-300" />
                <span>Ada Penyesuaian / Revisi Jadwal &amp; Bobot (Tahap 2)</span>
              </button>

              <button
                onClick={onConfirmMappingProceedToDraft}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white shadow-lg shadow-emerald-500/30 transition flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Setuju, Lanjut ke Komponen 1 (Tahap 3)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
