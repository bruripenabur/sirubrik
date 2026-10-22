import {
  EvaluationComponent,
  GradeScaleDefinition,
  KKNILevel,
  RubricCriterion,
} from '../types';

export const UNPATTI_REGULATION_INFO = {
  title: 'Peraturan Rektor Universitas Pattimura No. 12 Tahun 2026',
  pasal47Text: `Pasal 47:
(1) Komponen penilaian hasil belajar mahasiswa wajib menggunakan kombinasi metode evaluasi berbasis hasil proyek (Project-Based Learning) dan/atau metode pemecahan kasus (Case Method).
(2) Pembobotan evaluasi berbasis hasil proyek dan/atau metode pemecahan kasus secara kumulatif sekurang-kurangnya 50% (lima puluh persen).
(3) Tugas terstruktur mandiri, kuis, ujian tengah semester (UTS), dan ujian akhir semester (UAS) secara kumulatif paling banyak 50% (lima puluh persen).
(4) Skala Penilaian Program Sarjana (S1 / D4) dan Profesi:
    A  (Sangat Baik) : 85,00 – 100,00 (Bobot Mutu: 4,00)
    B  (Baik)        : 70,00 – 84,99  (Bobot Mutu: 3,00)
    C  (Cukup)       : 55,00 – 69,99  (Bobot Mutu: 2,00)
    D  (Kurang)      : 40,00 – 54,99  (Bobot Mutu: 1,00)
    E  (Gagal)       : < 40,00        (Bobot Mutu: 0,00)
(5) Skala Penilaian Program Pascasarjana (Magister/Spesialis & Doktor/Subspesialis):
    A  (Pujian)      : ≥ 90,00        (Bobot Mutu: 4,00)
    A- (Sangat Baik) : 85,00 – 89,99  (Bobot Mutu: 3,70)
    B+ (Amat Baik)   : 80,00 – 84,99  (Bobot Mutu: 3,30)
    B  (Baik)        : 70,00 – 79,99  (Bobot Mutu: 3,00)
    B- (Cukup Baik)  : 65,00 – 69,99  (Bobot Mutu: 2,70)
    C  (Cukup)       : 55,00 – 64,99  (Bobot Mutu: 2,00)
    E  (Gagal)       : < 55,00        (Bobot Mutu: 0,00)`,
  pipBmkText: `Pola Ilmiah Pokok (PIP) Unpatti "Bina Mulia ke Lautan" (Rekonstruksi 2025):
Kerangka acuan keilmuan yang menempatkan karakteristik kepulauan Maluku (laut-pulau, aquatic-terrestrial) sebagai keunggulan komparatif dan laboratorium alami untuk pembangunan berkelanjutan, ekonomi biru, konservasi biodiversitas laut, ketahanan pangan maritim, hukum adat sasi, serta keterhubungan 17 Tujuan Pembangunan Berkelanjutan (SDGs).`,
};

export const SARJANA_GRADE_SCALES: GradeScaleDefinition[] = [
  { grade: 'A', minScore: 85.0, maxScore: 100.0, gradePoint: 4.0, predicate: 'Sangat Baik', level: 'sarjana' },
  { grade: 'B', minScore: 70.0, maxScore: 84.99, gradePoint: 3.0, predicate: 'Baik', level: 'sarjana' },
  { grade: 'C', minScore: 55.0, maxScore: 69.99, gradePoint: 2.0, predicate: 'Cukup', level: 'sarjana' },
  { grade: 'D', minScore: 40.0, maxScore: 54.99, gradePoint: 1.0, predicate: 'Kurang', level: 'sarjana' },
  { grade: 'E', minScore: 0.0, maxScore: 39.99, gradePoint: 0.0, predicate: 'Gagal', level: 'sarjana' },
];

export const PASCASARJANA_GRADE_SCALES: GradeScaleDefinition[] = [
  { grade: 'A', minScore: 90.0, maxScore: 100.0, gradePoint: 4.0, predicate: 'Pujian / Sangat Baik', level: 'pascasarjana' },
  { grade: 'A-', minScore: 85.0, maxScore: 89.99, gradePoint: 3.7, predicate: 'Sangat Baik', level: 'pascasarjana' },
  { grade: 'B+', minScore: 80.0, maxScore: 84.99, gradePoint: 3.3, predicate: 'Amat Baik', level: 'pascasarjana' },
  { grade: 'B', minScore: 70.0, maxScore: 79.99, gradePoint: 3.0, predicate: 'Baik', level: 'pascasarjana' },
  { grade: 'B-', minScore: 65.0, maxScore: 69.99, gradePoint: 2.7, predicate: 'Cukup Baik', level: 'pascasarjana' },
  { grade: 'C', minScore: 55.0, maxScore: 64.99, gradePoint: 2.0, predicate: 'Cukup', level: 'pascasarjana' },
  { grade: 'E', minScore: 0.0, maxScore: 54.99, gradePoint: 0.0, predicate: 'Gagal', level: 'pascasarjana' },
];

export function isPascasarjanaLevel(level: KKNILevel | string): boolean {
  if (!level) return false;
  const l = level.toLowerCase();
  return l.includes('level 8') || l.includes('level 9') || l.includes('magister') || l.includes('doktor') || l.includes('spesialis');
}

export function isCaseOrProjectCategory(category: string): boolean {
  const cat = category.toLowerCase();
  return (
    cat === 'case_method' ||
    cat === 'team_project' ||
    cat === 'field_work' ||
    cat.includes('kasus') ||
    cat.includes('proyek') ||
    cat.includes('project') ||
    cat.includes('praktik')
  );
}

export function validateEvaluationComponents(components: EvaluationComponent[]): {
  totalWeight: number;
  caseProjectWeight: number;
  traditionalWeight: number;
  isTotalValid: boolean;
  isPasal47Compliant: boolean;
  message: string;
} {
  let totalWeight = 0;
  let caseProjectWeight = 0;
  let traditionalWeight = 0;

  for (const c of components) {
    totalWeight += c.weight;
    if (isCaseOrProjectCategory(c.category) || isCaseOrProjectCategory(c.name)) {
      caseProjectWeight += c.weight;
    } else {
      traditionalWeight += c.weight;
    }
  }

  const isTotalValid = Math.abs(totalWeight - 100) < 0.1;
  const isPasal47Compliant = caseProjectWeight >= 50 && traditionalWeight <= 50;

  let message = '';
  if (!isTotalValid) {
    message = `Total bobot saat ini ${totalWeight}%. Harus tepat 100%.`;
  } else if (!isPasal47Compliant) {
    message = `Peringatan Pasal 47: Komponen Kasus & Proyek saat ini ${caseProjectWeight}%. Wajib sekurang-kurangnya 50%.`;
  } else {
    message = `Selaras penuh dengan Pasal 47 Peraturan Rektor No. 12 Tahun 2026 (Kasus & Proyek: ${caseProjectWeight}% ≥ 50%).`;
  }

  return {
    totalWeight,
    caseProjectWeight,
    traditionalWeight,
    isTotalValid,
    isPasal47Compliant,
    message,
  };
}

export function convertScoreToGrade(score: number, level: KKNILevel | string): GradeScaleDefinition {
  const isPasca = isPascasarjanaLevel(level);
  const scales = isPasca ? PASCASARJANA_GRADE_SCALES : SARJANA_GRADE_SCALES;

  for (const s of scales) {
    if (score >= s.minScore && score <= s.maxScore) {
      return s;
    }
  }
  return scales[scales.length - 1];
}

export function getDefaultRubricLevels(isPascasarjana: boolean, aspect: string): RubricCriterion['levels'] {
  if (isPascasarjana) {
    return [
      {
        grade: 'A',
        scoreRange: '≥ 90.00',
        numericMin: 90,
        numericMax: 100,
        descriptor: `Sangat mendalam, orisinal, mengintegrasikan riset multidisipliner dan keunggulan laut-pulau secara komprehensif pada aspek ${aspect}.`,
      },
      {
        grade: 'A-',
        scoreRange: '85.00 – 89.99',
        numericMin: 85,
        numericMax: 89.99,
        descriptor: `Komprehensif, analitis, menyajikan sintesis mutakhir serta argumentasi teoritis yang kokoh pada aspek ${aspect}.`,
      },
      {
        grade: 'B+',
        scoreRange: '80.00 – 84.99',
        numericMin: 80,
        numericMax: 84.99,
        descriptor: `Memadai, sistematis, menyajikan penalaran kritis yang baik dan relevan pada aspek ${aspect}.`,
      },
      {
        grade: 'B',
        scoreRange: '70.00 – 79.99',
        numericMin: 70,
        numericMax: 79.99,
        descriptor: `Cukup baik, memenuhi kaidah ilmiah dasar namun masih memerlukan kedalaman telaah literatur pada aspek ${aspect}.`,
      },
      {
        grade: 'B-',
        scoreRange: '65.00 – 69.99',
        numericMin: 65,
        numericMax: 69.99,
        descriptor: `Memenuhi sebagian kriteria, analisis deskriptif dan belum tajam mengaitkan konteks riset pada aspek ${aspect}.`,
      },
      {
        grade: 'C',
        scoreRange: '55.00 – 64.99',
        numericMin: 55,
        numericMax: 64.99,
        descriptor: `Kurang mendalam, terdapat kelemahan metodologis atau argumentasi konseptual pada aspek ${aspect}.`,
      },
      {
        grade: 'E',
        scoreRange: '< 55.00',
        numericMin: 0,
        numericMax: 54.99,
        descriptor: `Tidak memenuhi standar minimal penugasan pascasarjana atau tidak mengumpulkan pada aspek ${aspect}.`,
      },
    ];
  } else {
    return [
      {
        grade: 'A',
        scoreRange: '85.00 – 100.00',
        numericMin: 85,
        numericMax: 100,
        descriptor: `Sangat Baik: Menunjukkan penguasaan konsep yang utuh, analisis data berbasis bukti yang tajam, serta solusi inovatif kontekstual laut-pulau pada aspek ${aspect}.`,
      },
      {
        grade: 'B',
        scoreRange: '70.00 – 84.99',
        numericMin: 70,
        numericMax: 84.99,
        descriptor: `Baik: Mampu menerapkan prosedur penyelesaian masalah dengan benar, analisis sistematis, dan argumentasi relevan pada aspek ${aspect}.`,
      },
      {
        grade: 'C',
        scoreRange: '55.00 – 69.99',
        numericMin: 55,
        numericMax: 69.99,
        descriptor: `Cukup: Memahami konsep dasar namun belum konsisten dalam penerapan analitis atau ada bagian yang kurang lengkap pada aspek ${aspect}.`,
      },
      {
        grade: 'D',
        scoreRange: '40.00 – 54.99',
        numericMin: 40,
        numericMax: 54.99,
        descriptor: `Kurang: Penguasaan materi terbatas, analisis lemah, banyak kekeliruan prosedural pada aspek ${aspect}.`,
      },
      {
        grade: 'E',
        scoreRange: '< 40.00',
        numericMin: 0,
        numericMax: 39.99,
        descriptor: `Gagal: Tidak memenuhi kriteria minimal atau tidak menyelesaikan tugas pada aspek ${aspect}.`,
      },
    ];
  }
}
