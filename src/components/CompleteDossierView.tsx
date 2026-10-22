import React, { useRef, useState } from 'react';
import {
  ComponentInstrument,
  CourseIdentity,
  EvaluationComponent,
} from '../types';
import {
  FileText,
  Printer,
  Download,
  Copy,
  Check,
  ArrowLeft,
  Award,
  Waves,
  ShieldCheck,
  Calendar,
  Percent,
  FileJson,
} from 'lucide-react';
import {
  isPascasarjanaLevel,
  SARJANA_GRADE_SCALES,
  PASCASARJANA_GRADE_SCALES,
  validateEvaluationComponents,
} from '../utils/regulatoryValidator';
import { UNPATTI_LOGO_URL } from '../utils/constants';
import { EvaluationCalendar, parseWeeks, SK_WEEKS_GASAL_2026_2027 } from './EvaluationCalendar';
import { SingleComponentPrintModal } from './SingleComponentPrintModal';
import { triggerPrintElement, downloadPrintableHtml } from '../utils/printHelper';

interface CompleteDossierViewProps {
  identity: CourseIdentity;
  components: EvaluationComponent[];
  instruments: Record<string, ComponentInstrument>;
  onBackToDrafting: () => void;
}

export const CompleteDossierView: React.FC<CompleteDossierViewProps> = ({
  identity,
  components,
  instruments,
  onBackToDrafting,
}) => {
  const [copied, setCopied] = useState(false);
  const [selectedComponentForPrint, setSelectedComponentForPrint] = useState<string | null>(null);
  const printAreaRef = useRef<HTMLDivElement>(null);

  const isPasca = isPascasarjanaLevel(identity.level);
  const activeGradeScales = isPasca ? PASCASARJANA_GRADE_SCALES : SARJANA_GRADE_SCALES;
  const validation = validateEvaluationComponents(components);

  // Print function with dedicated isolated iframe
  const handlePrint = () => {
    if (printAreaRef.current) {
      triggerPrintElement(
        printAreaRef.current,
        `Dossier Lengkap Evaluasi OBE ${identity.name} - Universitas Pattimura`
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
      `Dossier_Lengkap_Evaluasi_OBE_${(identity.code || 'MK').replace(/\s+/g, '_')}`,
      `Dossier Lengkap Instrumen & Rubrik OBE: ${identity.name} - Universitas Pattimura`
    );
  };

  // Export to Word compatible HTML with smooth, elegant styling
  const handleExportWord = () => {
    if (!printAreaRef.current) return;
    const clone = printAreaRef.current.cloneNode(true) as HTMLElement;
    const kop = clone.querySelector('.kop-surat');
    if (kop) {
      kop.innerHTML = `
        <table border="0" width="100%" style="border-collapse:collapse; border:none; border-bottom:2.5px solid #0f2d59; margin-bottom:20px; padding-bottom:12px;">
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

    const calTarget = clone.querySelector('#word-calendar-target');
    if (calTarget) {
      let tableHtml = `
        <table border="1" cellpadding="6" cellspacing="0" style="width:100%; border-collapse:collapse; border:1px solid #cbd5e1; font-size:9pt; margin-top:10px; margin-bottom:16px;">
          <tr style="background-color:#0f2d59; color:#ffffff; font-weight:bold; text-align:center;">
            <td colspan="4" style="padding:8px; font-size:10pt;">KALENDER SEBARAN EVALUASI &amp; BEBAN ASESMEN 16 MINGGU (SK REKTOR UNPATTI NO. 2152)</td>
          </tr>
      `;

      for (let r = 0; r < 4; r++) {
        tableHtml += '<tr>';
        for (let c = 0; c < 4; c++) {
          const wNum = r * 4 + c + 1;
          const dateMeta = SK_WEEKS_GASAL_2026_2027[wNum - 1] || { range: `Minggu ${wNum}`, note: '' };
          
          const activeComps: string[] = [];
          components.forEach((comp) => {
            const parsed = parseWeeks(comp.suggestedWeeks);
            if (parsed.includes(wNum)) {
              const isDue = parsed[parsed.length - 1] === wNum;
              activeComps.push((isDue ? '★ ' : '') + comp.name.split(':')[0] + ` (${comp.weight}%)`);
            }
          });

          const totalWeight = components.reduce((sum, comp) => {
            const parsed = parseWeeks(comp.suggestedWeeks);
            if (parsed.includes(wNum) && parsed[parsed.length - 1] === wNum) {
              return sum + comp.weight;
            }
            return sum;
          }, 0);

          let bg = '#ffffff';
          let borderCol = '#cbd5e1';
          if (wNum === 8 || wNum === 16) {
            bg = '#fff1f2';
            borderCol = '#f43f5e';
          } else if (activeComps.length > 0) {
            bg = '#ecfdf5';
            borderCol = '#10b981';
          }

          tableHtml += `
            <td width="25%" style="border:1px solid ${borderCol}; padding:8px; vertical-align:top; background-color:${bg};">
              <div style="font-weight:bold; color:${wNum === 8 || wNum === 16 ? '#be123c' : '#0f2d59'}; font-size:9.5pt; margin-bottom:1px;">
                Mg ${wNum} ${wNum === 8 ? '(UTS)' : wNum === 16 ? '(UAS)' : ''}
              </div>
              <div style="font-size:8pt; color:#64748b; font-family:monospace; margin-bottom:4px;">${dateMeta.range}</div>
              <div style="font-size:8.5pt; color:#1e293b; line-height:1.3;">
                ${activeComps.length === 0 ? '<span style="color:#94a3b8; font-style:italic;">Materi Pokok</span>' : activeComps.join('<br/>')}
              </div>
              ${totalWeight > 0 ? `<div style="margin-top:4px; padding-top:2px; border-top:1px dashed #cbd5e1; font-size:8pt; font-weight:bold; text-align:right; color:#0f2d59;">Σ ${totalWeight}%</div>` : ''}
            </td>
          `;
        }
        tableHtml += '</tr>';
      }
      tableHtml += '</table>';
      calTarget.innerHTML = tableHtml;
    }

    const header = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head><meta charset='utf-8'><title>${identity.name} - Instrumen &amp; Rubrik OBE Unpatti</title>
    <style>
      body { font-family: 'Calibri', 'Segoe UI', Arial, sans-serif; font-size: 11pt; line-height: 1.5; color: #0f172a; margin: 24px; }
      h1, h2, h3, h4 { color: #0f2d59; }
      table { border-collapse: collapse; width: 100%; margin-bottom: 16px; font-size: 10pt; }
      th, td { border: 1px solid #cbd5e1; padding: 7px 10px; text-align: left; vertical-align: top; }
      th { background-color: #f1f5f9; color: #0f2d59; font-weight: bold; }
      img { width: 2cm !important; height: 2cm !important; object-fit: contain; }
      .box-info { background-color: #f8fafc; border: 1px solid #cbd5e1; padding: 12px; border-radius: 6px; margin-bottom: 16px; }
      .box-case { background-color: #eff6ff; border-left: 4px solid #1d4ed8; padding: 12px 14px; border-radius: 4px; margin-bottom: 14px; }
      .box-formula { background-color: #faf5ff; border: 1px solid #e9d5ff; font-family: Consolas, monospace; padding: 8px 12px; border-radius: 4px; }
      .badge-pasal47 { background-color: #ecfdf5; color: #065f46; font-weight: bold; padding: 2px 6px; border-radius: 4px; }
    </style></head><body>`;
    const footer = '</body></html>';
    const sourceHTML = header + clone.innerHTML + footer;

    const blob = new Blob(['\ufeff', sourceHTML], {
      type: 'application/msword',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Dokumen_Lengkap_Evaluasi_OBE_${(identity.code || 'MK').replace(/\s+/g, '_')}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Copy Markdown
  const handleCopyMarkdown = () => {
    let md = `# DOKUMEN INSTRUMEN EVALUASI & RUBRIK PENILAIAN MATA KULIAH BERBASIS OBE
UNIVERSITAS PATTIMURA
Pola Ilmiah Pokok: Bina Mulia ke Lautan (Rekonstruksi 2025)
Standar: Peraturan Rektor No. 12 Tahun 2026 Pasal 47

## 1. IDENTITAS MATA KULIAH
- Nama Mata Kuliah: ${identity.name} (${identity.code})
- Bobot / Semester: ${identity.sks} SKS / Semester ${identity.semester}
- Jenjang & KKNI: ${identity.level}
- Fakultas / Prodi: ${identity.faculty} / ${identity.studyProgram}
- Dosen Pengampu: ${identity.lecturer}
- Fokus PIP: ${identity.pipFocus}
- SDGs: ${(identity.sdgsAlignment || []).join(', ')}

## 2. TABEL PEMETAAN KOMPONEN EVALUASI
| No | Jenis Komponen Evaluasi | Bobot (%) | Sub-CPMK Diukur | Saran Minggu Ke- |
|---|---|---|---|---|
`;

    components.forEach((c, idx) => {
      md += `| ${idx + 1} | ${c.name} | ${c.weight}% | ${(c.subCpmkList || []).join(', ')} | ${c.suggestedWeeks} |\n`;
    });

    md += `\nTotal Bobot: ${validation.totalWeight}% (Kasus & Proyek: ${validation.caseProjectWeight}% >= 50%)\n\n`;

    components.forEach((c, idx) => {
      const inst = instruments[c.id];
      if (!inst) return;
      md += `## KOMPONEN ${idx + 1}: ${c.name} (${c.weight}%)\n`;
      md += `### A. Rincian Tugas\n`;
      md += `- Nama Tugas: ${inst.taskDetails.name}\n`;
      md += `- Bentuk Evaluasi: ${inst.taskDetails.taskType}\n`;
      md += `- Sub-CPMK: ${inst.taskDetails.subCpmk}\n`;
      md += `- Batas Waktu: ${inst.taskDetails.deadline || c.suggestedWeeks}\n`;
      md += `- Petunjuk: ${inst.taskDetails.instructions}\n\n`;
      md += `### B. Soal / Naskah Kasus HOTS\n${inst.taskDetails.caseOrProblemText}\n\n`;
      md += `### C. Formula Perhitungan Skor Akhir\n${inst.calculationFormula}\n\n---\n\n`;
    });

    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Export Format Penilaian ke SIMPEL-CPL
  const handleExportSimpelCpl = () => {
    let csv = `ID_MAHASISWA,NAMA_MAHASISWA,NIM,PROGRAM_STUDI,KODE_MK,SEMESTER\n`;
    csv += `MHS001,Abdurrahman Pattimura,202401001,${identity.studyProgram},${identity.code},${identity.semester}\n`;
    csv += `MHS002,Maria Latuconsina,202401002,${identity.studyProgram},${identity.code},${identity.semester}\n`;
    csv += `MHS003,Yohanes Sahureka,202401003,${identity.studyProgram},${identity.code},${identity.semester}\n\n`;

    csv += `=== STRUKTUR MATRIKS PENILAIAN RUBRIK UNPATTI (INTEGRASI SIMPEL-CPL) ===\n`;
    csv += `KOMPONEN_ID,NAMA_KOMPONEN,BOBOT_MK,SUB_CPMK_DIUKUR,LEVEL_BLOOM,JADWAL_MINGGU,PASAL_47_STATUS\n`;
    components.forEach((c) => {
      csv += `"${c.id}","${c.name}",${c.weight}%,"${(c.subCpmkList || []).join('; ')}","${(c.bloomLevels || []).join('; ')}","${c.suggestedWeeks}","${c.category}"\n`;
    });

    csv += `\n=== FORMULA AKUMULASI NILAI AKHIR MATA KULIAH ===\n`;
    csv += `Skor_Akhir = ${components.map((c) => `(${c.name.split(':')[0]} * ${c.weight / 100})`).join(' + ')}\n`;

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Format_Penilaian_SIMPEL-CPL_${(identity.code || 'MK').replace(/\s+/g, '_')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Export JSON Bridge API Payload ke SIMPEL-CPL
  const handleExportJsonBridge = () => {
    const bridgePayload = {
      bridge_metadata: {
        application_source: 'SIRUBRIK_UNPATTI',
        target_system: 'SIMPEL_CPL',
        schema_version: '2.4-OBE',
        export_timestamp: new Date().toISOString(),
        sk_kalender_akademik_ref: 'SK Rektor Universitas Pattimura No. 2152/UN13/SK/2026',
        penjaminan_mutu: 'SPMI Lembaga Penjaminan Mutu & Pengembangan Pembelajaran Unpatti',
      },
      mata_kuliah: {
        kode_mk: identity.code,
        nama_mk: identity.name,
        sks: identity.sks,
        semester: identity.semester,
        tahun_akademik: '2026/2027',
        jenjang_kkni: identity.level,
        program_studi: identity.studyProgram,
        fakultas: identity.faculty,
        dosen_pengampu: identity.lecturer,
      },
      komponen_asesmen: components.map((c, idx) => {
        const inst = instruments[c.id];
        return {
          id: c.id,
          nomor_urut: idx + 1,
          nama_komponen: c.name,
          kategori: c.category,
          bobot_persen: c.weight,
          jadwal_minggu: c.suggestedWeeks,
          sub_cpmk: c.subCpmkList || [],
          level_bloom: c.bloomLevels || [],
          metode_asesmen: c.category,
          rubrik: inst?.rubric
            ? {
                tipe: inst.rubric.type,
                skala_maksimum: 100,
                skala_minimum_kelulusan: 75,
                kriteria: inst.rubric.criteria.map((cr) => ({
                  aspek: cr.aspect,
                  bobot_aspek: cr.weight,
                  deskriptor_level: cr.levels.map((lvl) => ({
                    predikat: lvl.grade,
                    rentang_skor: lvl.scoreRange,
                    deskriptor_kko: lvl.descriptor,
                  })),
                })),
              }
            : null,
          instruksi_tugas: inst?.taskDetails?.instructions || null,
          kasus_atau_soal: inst?.taskDetails?.caseOrProblemText || null,
        };
      }),
      standar_skala_nilai: isPascasarjanaLevel(identity.level)
        ? PASCASARJANA_GRADE_SCALES
        : SARJANA_GRADE_SCALES,
    };

    const jsonStr = JSON.stringify(bridgePayload, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SIRUBRIK_Bridge_SimpelCPL_${(identity.code || 'MK').replace(/\s+/g, '_')}_2026.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const activeModalComp = components.find((c) => c.id === selectedComponentForPrint);
  const activeModalInst = activeModalComp ? instruments[activeModalComp.id] : null;

  return (
    <div className="space-y-6">
      {/* Top Action Bar (Hidden during print) */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-3 print:hidden">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToDrafting}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
            title="Kembali ke Editor Komponen"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>Dossier Lengkap Instrumen &amp; Rubrik Evaluasi OBE</span>
            </h3>
            <p className="text-xs text-slate-500">
              Dokumen siap cetak atau ekspor resmi Universitas Pattimura berstandar SPMI &amp; Akreditasi Unggul.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Individual Component Print Selector */}
          <select
            value=""
            onChange={(e) => {
              if (e.target.value) {
                setSelectedComponentForPrint(e.target.value);
              }
            }}
            className="text-xs bg-slate-50 border border-slate-300 text-slate-800 rounded-xl px-3 py-2 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>
              🖨️ Cetak Per Komponen...
            </option>
            {components.map((c, i) => (
              <option key={c.id} value={c.id}>
                {i + 1}. {c.name.split(':')[0]} ({c.weight}%)
              </option>
            ))}
          </select>

          <button
            onClick={handleCopyMarkdown}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Tersalin!' : 'Salin Markdown'}</span>
          </button>

          <button
            onClick={handleExportSimpelCpl}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-300 transition"
            title="Ekspor format gradebook penilaian terstruktur untuk SIMPEL-CPL (.csv)"
          >
            <Download className="w-3.5 h-3.5 text-teal-600" />
            <span>Format CSV SIMPEL-CPL</span>
          </button>

          <button
            onClick={handleExportJsonBridge}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-300 transition"
            title="Ekspor API payload JSON Bridge kompatibel dengan SIMPEL-CPL untuk sinkronisasi otomatis nilai akhir"
          >
            <FileJson className="w-3.5 h-3.5 text-indigo-600" />
            <span>Export JSON Bridge</span>
          </button>

          <button
            onClick={handleExportWord}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition"
            title="Ekspor seluruh dossier ke format Microsoft Word berwarna dan rapi"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor Word (.doc)</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition"
            title="Unduh / Cetak Dokumen sebagai PDF"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Unduh PDF</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-sm transition"
            title="Cetak seluruh dokumen ke printer atau simpan sebagai PDF A4"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak / Simpan PDF</span>
          </button>
        </div>
      </div>

      {/* Official Printable Document Container */}
      <div
        ref={printAreaRef}
        className="printable-dossier bg-white rounded-2xl p-6 sm:p-10 border border-slate-200 shadow-md max-w-5xl mx-auto space-y-8 print:p-0 print:border-none print:shadow-none text-slate-900"
      >
        {/* Kop Surat Universitas Pattimura with Official Logo */}
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

        {/* Title */}
        <div className="text-center space-y-1">
          <h2 className="text-base sm:text-lg font-black uppercase text-slate-900 tracking-tight">
            DOKUMEN INSTRUMEN EVALUASI PEMBELAJARAN &amp; RUBRIK PENILAIAN
          </h2>
          <p className="text-xs font-bold text-blue-900 uppercase">
            BERBASIS OUTCOME-BASED EDUCATION (OBE) &amp; PERATURAN REKTOR NO. 12 TAHUN 2026
          </p>
        </div>

        {/* 1. Identitas Mata Kuliah */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 bg-slate-100 p-2 rounded">
            I. IDENTITAS MATA KULIAH &amp; CAPAIAN PEMBELAJARAN
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div>
              <span className="text-slate-500 block text-[10px]">Nama Mata Kuliah</span>
              <strong>{identity.name}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Kode MK &amp; Bobot</span>
              <strong>{identity.code} ({identity.sks} SKS)</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Semester / Jenjang</span>
              <strong>Semester {identity.semester} / {identity.level}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Dosen Pengampu</span>
              <strong>{identity.lecturer}</strong>
            </div>
          </div>

          <div className="text-xs space-y-1.5 pt-2">
            <div>
              <strong className="text-slate-800">Keterkaitan PIP "Bina Mulia ke Lautan" &amp; SDGs:</strong>
              <p className="text-slate-700 leading-relaxed text-[11px] mt-0.5">
                {identity.pipFocus} | SDGs: {(identity.sdgsAlignment || []).join(', ')}
              </p>
            </div>
            <div>
              <strong className="text-slate-800">Capaian Pembelajaran Mata Kuliah (CPMK):</strong>
              <ul className="text-[11px] text-slate-700 list-disc list-inside space-y-0.5 mt-0.5">
                {(identity.cpmkList || []).map((cpmk) => (
                  <li key={cpmk.id}>
                    <strong>{cpmk.code}:</strong> {cpmk.desc}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* 2. Matriks Pemetaan Komponen Evaluasi */}
        <div className="space-y-3">
          <div className="flex items-center justify-between bg-slate-100 p-2 rounded">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              II. MATRIKS PEMETAAN KOMPONEN EVALUASI &amp; JADWAL PERTEMUAN (PASAL 47)
            </h3>
            <span className="text-[10px] font-bold text-emerald-800">
              Kasus &amp; Proyek: {validation.caseProjectWeight}% (≥ 50%)
            </span>
          </div>

          <table className="w-full text-left text-xs border border-slate-300">
            <thead className="bg-slate-100 font-bold uppercase text-[10px] border-b border-slate-300">
              <tr>
                <th className="p-2 w-10 text-center border-r border-slate-300">No</th>
                <th className="p-2 border-r border-slate-300">Komponen Evaluasi</th>
                <th className="p-2 w-20 text-center border-r border-slate-300">Bobot (%)</th>
                <th className="p-2 border-r border-slate-300">Sub-CPMK &amp; Level Bloom</th>
                <th className="p-2 w-36 text-center">Saran Minggu Ke-</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {components.map((comp, idx) => (
                <tr key={comp.id}>
                  <td className="p-2 text-center font-bold text-slate-600 border-r border-slate-300">
                    {idx + 1}
                  </td>
                  <td className="p-2 font-semibold text-slate-900 border-r border-slate-300">
                    {comp.name}
                  </td>
                  <td className="p-2 text-center font-mono font-bold border-r border-slate-300">
                    {comp.weight}%
                  </td>
                  <td className="p-2 text-[11px] text-slate-700 border-r border-slate-300">
                    {(comp.subCpmkList || []).join(', ')}
                  </td>
                  <td className="p-2 text-center font-mono font-bold text-blue-900">
                    {comp.suggestedWeeks}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-50 font-bold border-t border-slate-300">
              <tr>
                <td colSpan={2} className="p-2 text-right border-r border-slate-300">
                  Total Bobot Penilaian Mata Kuliah:
                </td>
                <td className="p-2 text-center font-mono font-black text-blue-950 border-r border-slate-300">
                  {validation.totalWeight}%
                </td>
                <td colSpan={2} className="p-2 text-xs text-emerald-800">
                  ✓ Memenuhi Pasal 47 Peraturan Rektor No. 12 Tahun 2026
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* 2.B Kalender Sebaran Evaluasi 16 Minggu */}
        <div className="space-y-3 print:page-break-inside-avoid">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 bg-slate-100 p-2 rounded flex items-center justify-between">
            <span>II.B KALENDER SEBARAN EVALUASI &amp; BEBAN ASESMEN MAHASISWA</span>
            <span className="text-[10px] text-slate-500 lowercase font-normal">16 minggu perkuliahan</span>
          </h3>
          <div id="word-calendar-target">
            <EvaluationCalendar
              components={components}
              courseName={identity.name}
              onSelectComponent={(idx) => {
                const comp = components[idx];
                if (comp) setSelectedComponentForPrint(comp.id);
              }}
            />
          </div>
        </div>

        {/* 3. Lampiran Rincian Tugas & Matriks Rubrik */}
        <div className="space-y-6 pt-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 bg-slate-100 p-2 rounded">
            III. RINCIAN INSTRUMEN TUGAS, NASKAH KASUS HOTS, DAN MATRIKS RUBRIK ANALITIS
          </h3>

          {components.map((comp, idx) => {
            const inst = instruments[comp.id];
            if (!inst) return null;

            return (
              <div
                key={comp.id}
                className="space-y-4 p-5 border border-slate-300 rounded-xl bg-white page-break-inside-avoid shadow-2xs"
              >
                <div className="border-b border-slate-200 pb-2 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-blue-100 text-blue-900 mr-2">
                      LAMPIRAN {idx + 1}
                    </span>
                    <h4 className="inline font-extrabold text-sm text-slate-900">
                      {comp.name.toUpperCase()} (BOBOT: {comp.weight}%)
                    </h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-slate-600 font-semibold">
                      Pelaksanaan: {comp.suggestedWeeks}
                    </span>
                    <button
                      onClick={() => setSelectedComponentForPrint(comp.id)}
                      className="print:hidden text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded-lg transition inline-flex items-center gap-1"
                      title="Cetak komponen ini secara terpisah"
                    >
                      <Printer className="w-3 h-3 text-emerald-600" />
                      <span>Cetak Komponen Ini</span>
                    </button>
                  </div>
                </div>

                {/* Task Details */}
                <div className="space-y-2 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded border border-slate-200">
                    <div>
                      <strong className="text-slate-800">Judul Asesmen:</strong> {inst.taskDetails.name}
                    </div>
                    <div>
                      <strong className="text-slate-800">Bentuk Evaluasi:</strong> {inst.taskDetails.taskType}
                    </div>
                    <div className="sm:col-span-2">
                      <strong className="text-slate-800">Sub-CPMK:</strong> {inst.taskDetails.subCpmk}
                    </div>
                    <div className="sm:col-span-2">
                      <strong className="text-slate-800">Keterkaitan PIP &amp; SDGs:</strong> {inst.taskDetails.pipSdgsRelevance}
                    </div>
                  </div>

                  <div>
                    <strong className="text-slate-900">Petunjuk Pengerjaan &amp; Objek Garapan:</strong>
                    <p className="text-[11px] text-slate-700 leading-relaxed whitespace-pre-line mt-1 bg-slate-50 p-2.5 rounded border border-slate-200">
                      {inst.taskDetails.instructions}
                    </p>
                  </div>

                  <div>
                    <strong className="text-slate-900">Soal / Naskah Kasus Penyelidikan (HOTS):</strong>
                    <div className="text-[11px] text-slate-800 font-serif leading-relaxed whitespace-pre-line mt-1 p-3 bg-blue-50/40 rounded border border-blue-200">
                      {inst.taskDetails.caseOrProblemText}
                    </div>
                  </div>
                </div>

                {/* Rubric Matrix Table */}
                <div className="space-y-1.5 pt-2">
                  <div className="font-bold text-xs text-slate-900">
                    Matriks Rubrik Penilaian Analitis (Skala Resmi Unpatti):
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border border-slate-300">
                      <thead className="bg-slate-100 text-[10px] uppercase font-bold border-b border-slate-300">
                        <tr>
                          <th className="p-2 w-44 border-r border-slate-300">Aspek / Kriteria</th>
                          <th className="p-2 w-14 text-center border-r border-slate-300">Bobot</th>
                          {activeGradeScales.map((scale) => (
                            <th key={scale.grade} className="p-2 border-r border-slate-300 last:border-r-0 text-center">
                              {scale.grade}
                              <div className="font-normal text-[9px] text-slate-500 font-mono">
                                ({scale.predicate})
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {inst.rubric.criteria.map((crit) => (
                          <tr key={crit.id}>
                            <td className="p-2 font-semibold text-slate-900 border-r border-slate-300 align-top">
                              {crit.aspect}
                            </td>
                            <td className="p-2 text-center font-mono font-bold text-blue-900 border-r border-slate-300 align-top">
                              {crit.weight}%
                            </td>
                            {activeGradeScales.map((scale) => {
                              const level = crit.levels.find(
                                (l) => l.grade.trim() === scale.grade.trim()
                              );
                              return (
                                <td
                                  key={scale.grade}
                                  className="p-2 text-[10px] text-slate-700 leading-normal border-r border-slate-300 last:border-r-0 align-top"
                                >
                                  {level?.descriptor || '-'}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Calculation Formula */}
                <div className="text-xs bg-slate-50 p-2.5 rounded border border-slate-200">
                  <strong className="text-slate-900">Formula Perhitungan Skor Akhir:</strong>
                  <p className="text-[11px] font-mono text-slate-700 mt-0.5">
                    {inst.calculationFormula}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* 4. Lembar Pengesahan */}
        <div className="pt-6 border-t-2 border-slate-900 text-xs page-break-inside-avoid">
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

      {/* Single Component Print / Export Modal */}
      {activeModalComp && activeModalInst && (
        <SingleComponentPrintModal
          isOpen={!!selectedComponentForPrint}
          onClose={() => setSelectedComponentForPrint(null)}
          identity={identity}
          component={activeModalComp}
          instrument={activeModalInst}
        />
      )}
    </div>
  );
};
