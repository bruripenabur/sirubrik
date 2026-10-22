import { CourseIdentity, EvaluationComponent, ComponentInstrument } from '../types';

export interface ExemplarCourseData {
  id: string;
  label: string;
  description: string;
  identity: CourseIdentity;
  components: EvaluationComponent[];
  sampleInstruments: Record<string, ComponentInstrument>;
  rawRpsText: string;
}

export const EXEMPLAR_COURSES: ExemplarCourseData[] = [
  {
    id: 'oseanografi_fpik',
    label: 'Oseanografi Perikanan & Dinamika Laut-Pulau (S1 FPIK Unpatti)',
    description: 'Model 1 (55% Kasus & Proyek) - Fokus Upwelling Laut Banda, PIP-BMK, dan SDGs 14',
    identity: {
      name: 'Oseanografi Perikanan dan Dinamika Laut-Pulau Maluku',
      code: 'PIK-3204',
      sks: 3,
      semester: 4,
      level: 'Level 6 (Sarjana / D4)',
      faculty: 'Fakultas Perikanan dan Ilmu Kelautan (FPIK)',
      studyProgram: 'Pemanfaatan Sumberdaya Perikanan (PSP)',
      lecturer: 'Tim Dosen Oseanografi Tropis & Pengelolaan Sumberdaya Ikan',
      cpmkList: [
        {
          id: 'CPMK-1',
          code: 'CPMK 1',
          desc: 'Mampu menganalisis fenomena oseanografi fisik dan kimia (Suhu Permukaan Laut, Klorofil-a, Arlindo, Upwelling) perairan kepulauan Maluku.',
        },
        {
          id: 'CPMK-2',
          code: 'CPMK 2',
          desc: 'Mampu memformulasikan strategi penentuan daerah penangkapan ikan (Fishing Ground) potensial berbasis data oseanografi dan konservasi laut-pulau.',
        },
        {
          id: 'CPMK-3',
          code: 'CPMK 3',
          desc: 'Mampu merancang proyek mitigasi perubahan iklim dan tata kelola perikanan berkelanjutan selaras PIP Bina Mulia ke Lautan dan SDG 14.',
        },
      ],
      pipFocus: 'Pola Ilmiah Pokok Bina Mulia Kelautan: Fenomena oseanografis laut dalam Laut Banda, Sirkulasi Arus Lintas Indonesia (Arlindo), dan ketahanan perikanan nelayan kepulauan.',
      sdgsAlignment: ['SDG 14: Life Below Water', 'SDG 13: Climate Action', 'SDG 2: Zero Hunger & Food Security'],
      cqiNotes: 'Tindak lanjut CQI Semester Lalu: Penguatan kemampuan mahasiswa dalam membaca citra satelit Oseanografi (HOTS C4-C5) dan analisis data riil perairan Maluku.',
    },
    components: [
      {
        id: 'comp-1',
        name: 'Metode Pemecahan Kasus (Case Method): Analisis Anomali Upwelling & Fishing Ground Laut Banda',
        category: 'case_method',
        weight: 30,
        subCpmkList: ['Sub-CPMK 1: Analisis variabilitas SPL & Klorofil-a', 'Sub-CPMK 2: Korelasi Oseanografi dengan Sebaran Pelagis'],
        bloomLevels: ['C4 - Analisis', 'C5 - Evaluasi'],
        suggestedWeeks: 'Minggu ke-3 s.d. 7',
        description: 'Penyelidikan kasus anomali Indian Ocean Dipole (IOD) dan El Niño terhadap penurunan hasil tangkapan tuna nelayan di Laut Banda.',
        status: 'drafted',
      },
      {
        id: 'comp-2',
        name: 'Proyek Berbasis Tim (Team-Based Project): Pemetaan Zona Potensial Penangkapan Ikan (ZPPI) Pesisir Ambon-Seram',
        category: 'team_project',
        weight: 25,
        subCpmkList: ['Sub-CPMK 3: Perancangan Model ZPPI Berkelanjutan'],
        bloomLevels: ['C5 - Evaluasi', 'C6 - Kreasi'],
        suggestedWeeks: 'Minggu ke-10 s.d. 15',
        description: 'Proyek tim mahasiswa menyusun atlas digital ZPPI dan rekomendasi kalender musim tangkap berbasis kearifan lokal sasi dan data satelit.',
        status: 'pending',
      },
      {
        id: 'comp-3',
        name: 'Tugas Terstruktur Mandiri: Telaah Kritis Artikel Jurnal Dinamika Arlindo di Perairan Maluku',
        category: 'structured_task',
        weight: 15,
        subCpmkList: ['Sub-CPMK 1: Pemahaman Sirkulasi Massa Air Laut'],
        bloomLevels: ['C4 - Analisis'],
        suggestedWeeks: 'Minggu ke-2',
        description: 'Review artikel ilmiah Q1/Sinta 1 mengenai peran Selat Ombai dan Laut Banda dalam transpor massa air Pasifik ke Hindia.',
        status: 'pending',
      },
      {
        id: 'comp-4',
        name: 'Kuis & Aktivitas Partisipatif Terjadwal: Oseanografi Instrumen & Parameter Fisik-Kimia',
        category: 'quiz',
        weight: 5,
        subCpmkList: ['Sub-CPMK 1 & Sub-CPMK 2: Prinsip Kerja CTD & Satelit Oseanografi'],
        bloomLevels: ['C3 - Penerapan'],
        suggestedWeeks: 'Minggu ke-6',
        description: 'Kuis adaptif mengenai interpretasi profil batimetri, salinitas, dan suhu vertikal.',
        status: 'pending',
      },
      {
        id: 'comp-5',
        name: 'Ujian Tengah Semester (UTS): Ujian Berbasis Kasus Oseanografi Terapan',
        category: 'uts',
        weight: 10,
        subCpmkList: ['Sub-CPMK 1 & 2: Pengambilan Keputusan Parameter Kelautan'],
        bloomLevels: ['C4 - Analisis'],
        suggestedWeeks: 'Minggu ke-8',
        description: 'Evaluasi tertulis berbasis skenario riil pergerakan massa air laut dan dinamika termoklin perairan Maluku.',
        status: 'pending',
      },
      {
        id: 'comp-6',
        name: 'Ujian Akhir Semester (UAS): Presentasi & Sidang Panel Laporan Akhir Proyek',
        category: 'uas',
        weight: 15,
        subCpmkList: ['Sub-CPMK 2 & 3: Komprehensif Oseanografi Perikanan'],
        bloomLevels: ['C5 - Evaluasi', 'C6 - Kreasi'],
        suggestedWeeks: 'Minggu ke-16',
        description: 'Sidang uji kelayakan naskah kebijakan pengelolaan ZPPI di hadapan panel dosen pengampu.',
        status: 'pending',
      },
    ],
    sampleInstruments: {
      'comp-1': {
        componentId: 'comp-1',
        taskDetails: {
          name: 'Studi Kasus Analisis Anomali Termal dan Dinamika Upwelling Laut Banda Terhadap Produksi Perikanan Cakalang',
          taskType: 'Laporan Analisis Kasus Autentik (Case Method)',
          subCpmk: 'Sub-CPMK 1 & Sub-CPMK 2: Menganalisis parameter SPL, klorofil-a, dan pergeseran ZPPI saat fase El Niño/La Niña di Kepulauan Maluku.',
          indicators: [
            'Ketepatan ekstraksi dan visualisasi data SPL dan Klorofil-a dari citra satelit Modis/Copernicus',
            'Ketajaman analisis kausalitas antara fenomena upwelling Laut Banda dan hasil tangkapan nelayan lokal',
            'Kelayakan formulasi rekomendasi adaptasi melaut bagi kelompok nelayan berbasis PIP Bina Mulia ke Lautan',
          ],
          pipSdgsRelevance: 'Menautkan fenomena oseanografi khas laut dalam Maluku (Laut Banda) dengan penguatan ekonomi pesisir dan ketahanan pangan laut (SDG 14.2 & SDG 14.4).',
          instructions: '1. Mahasiswa mengunduh dataset anomali SPL dan konsentrasi Klorofil-a Laut Banda periode Juni-Agustus (Musim Timur).\n2. Lakukan overlay dengan data logbook hasil tangkap kapal purse seine/huhate di Pelabuhan Perikanan Nusantara Ambon.\n3. Susun naskah analisis kasus maksimal 10 halaman berstruktur: Ringkasan Eksekutif, Deskripsi Kasus Oseanografi, Analisis Dinamika Massa Air & Termoklin, Evaluasi Dampak Sosial-Ekonomi Perikanan, serta Rekomendasi Solusi Adaptif Nelayan.',
          deadline: 'Minggu ke-7 (Tepat sebelum pelaksanaan UTS)',
          targetObject: 'Dokumen Naskah Analisis Kasus Komprehensif (Format PDF) disertai Peta Kontur Dinamika Oseanografi Laut Banda.',
          caseOrProblemText: `SKENARIO KASUS AUTENTIK:
Pada periode Musim Timur tahun 2024, terjadi penguatan monsun tenggara yang memicu proses pengangkatan massa air dingin kaya nutrien (upwelling) di wilayah Laut Banda dan Laut Seram. Namun, data Dinas Kelautan dan Perikanan Maluku menunjukkan penurunan anjlok hasil tangkap armada nelayan kecil (<10 GT) di sekitar Teluk Ambon dan perairan Banda Neira sebesar 34%, sementara armada kapal besar mencatat pergeseran titik tangkap sejauh 45 mil laut ke arah tenggara.
Pertanyaan Penyelidikan Mahasiswa:
1. Analisis secara oseanografis mengapa fenomena upwelling yang lazimnya menyuburkan perairan justru menyebabkan nelayan tradisional mengalami kegagalan tangkap pada periode tersebut!
2. Dengan mengintegrasikan konsep lapisan termoklin dan toleransi fisiologis ikan pelagis (Katsuwonus pelamis), formulasikan kalkulasi zona kedalaman jelajah optimum kawanan ikan!
3. Susun strategi operasional pemanfaatan data oseanografi real-time yang dapat diakses oleh paguyuban nelayan lokal dengan tetap memperhatikan kearifan lokal Sasi Laut!`,
        },
        rubric: {
          type: 'analytic',
          scaleType: 'sarjana',
          criteria: [
            {
              id: 'crit-1',
              aspect: 'Ketajaman Analisis Oseanografis & Data Spasial',
              weight: 35,
              levels: [
                {
                  grade: 'A',
                  scoreRange: '85.00 – 100.00',
                  numericMin: 85,
                  numericMax: 100,
                  descriptor: 'Sangat Baik: Mampu menganalisis dinamika vertikal-horizontal SPL dan Klorofil-a secara terintegrasi dengan korelasi oseanografi fisik-biologi yang akurat dan berbasis rujukan ilmiah mutakhir.',
                },
                {
                  grade: 'B',
                  scoreRange: '70.00 – 84.99',
                  numericMin: 70,
                  numericMax: 84.99,
                  descriptor: 'Baik: Mampu menyajikan analisis hubungan parameter oseanografi secara tepat, interpretasi data satelit memadai, namun kaitan dengan lapisan termoklin belum didalami sepenuhnya.',
                },
                {
                  grade: 'C',
                  scoreRange: '55.00 – 69.99',
                  numericMin: 55,
                  numericMax: 69.99,
                  descriptor: 'Cukup: Menyajikan data oseanografi secara deskriptif tetapi belum mampu menjelaskan mekanisme kausalitas dinamika upwelling terhadap sebaran ikan.',
                },
                {
                  grade: 'D',
                  scoreRange: '40.00 – 54.99',
                  numericMin: 40,
                  numericMax: 54.99,
                  descriptor: 'Kurang: Analisis dangkal, terdapat kesalahan pemahaman konsep oseanografi dasar Laut Banda, data tidak relevan.',
                },
                {
                  grade: 'E',
                  scoreRange: '< 40.00',
                  numericMin: 0,
                  numericMax: 39.99,
                  descriptor: 'Gagal: Tidak menyajikan analisis oseanografi atau tidak mengumpulkan laporan kasus.',
                },
              ],
            },
            {
              id: 'crit-2',
              aspect: 'Pemecahan Masalah & Solusi Nelayan Laut-Pulau (PIP-BMK & SDG 14)',
              weight: 35,
              levels: [
                {
                  grade: 'A',
                  scoreRange: '85.00 – 100.00',
                  numericMin: 85,
                  numericMax: 100,
                  descriptor: 'Sangat Baik: Memformulasikan rekomendasi operasional yang sangat aplikatif, realistis untuk nelayan kepulauan Maluku, harmonis dengan tradisi sasi laut, dan menjunjung SDG 14.',
                },
                {
                  grade: 'B',
                  scoreRange: '70.00 – 84.99',
                  numericMin: 70,
                  numericMax: 84.99,
                  descriptor: 'Baik: Memberikan rekomendasi pemecahan masalah yang logis dan relevan dengan kondisi perikanan lokal, namun aspek implementasi teknologi masih agak umum.',
                },
                {
                  grade: 'C',
                  scoreRange: '55.00 – 69.99',
                  numericMin: 55,
                  numericMax: 69.99,
                  descriptor: 'Cukup: Solusi yang diajukan normatif, belum mempertimbangkan kendala keterbatasan daya jangkau armada nelayan tradisional kepulauan.',
                },
                {
                  grade: 'D',
                  scoreRange: '40.00 – 54.99',
                  numericMin: 40,
                  numericMax: 54.99,
                  descriptor: 'Kurang: Solusi tidak masuk akal, mengabaikan karakteristik geografis laut-pulau dan kapasitas nelayan.',
                },
                {
                  grade: 'E',
                  scoreRange: '< 40.00',
                  numericMin: 0,
                  numericMax: 39.99,
                  descriptor: 'Gagal: Tidak ada perumusan solusi atau tidak menyentuh akar permasalahan.',
                },
              ],
            },
            {
              id: 'crit-3',
              aspect: 'Sistematika, Validitas Bukti & Komunikasi Ilmiah',
              weight: 30,
              levels: [
                {
                  grade: 'A',
                  scoreRange: '85.00 – 100.00',
                  numericMin: 85,
                  numericMax: 100,
                  descriptor: 'Sangat Baik: Struktur laporan sangat rapi, peta dan grafik berstandar kartografis kelautan, sitasi data primer/sekunder kredibel, bebas plagiasi.',
                },
                {
                  grade: 'B',
                  scoreRange: '70.00 – 84.99',
                  numericMin: 70,
                  numericMax: 84.99,
                  descriptor: 'Baik: Sistematika penulisan runtut, visualisasi data jelas dan mudah dibaca, referensi ilmiah memadai.',
                },
                {
                  grade: 'C',
                  scoreRange: '55.00 – 69.99',
                  numericMin: 55,
                  numericMax: 69.99,
                  descriptor: 'Cukup: Format laporan cukup baik tetapi beberapa grafik atau peta kurang memiliki legenda koordinat yang presisi.',
                },
                {
                  grade: 'D',
                  scoreRange: '40.00 – 54.99',
                  numericMin: 40,
                  numericMax: 54.99,
                  descriptor: 'Kurang: Format penulisan berantakan, data grafis tidak jelas sumbernya, banyak salah ketik.',
                },
                {
                  grade: 'E',
                  scoreRange: '< 40.00',
                  numericMin: 0,
                  numericMax: 39.99,
                  descriptor: 'Gagal: Tidak memenuhi kaidah penulisan ilmiah atau terindikasi plagiarisme berat.',
                },
              ],
            },
          ],
        },
        calculationFormula: 'Skor Akhir Komponen 1 = (Skor Kriteria 1 × 0.35) + (Skor Kriteria 2 × 0.35) + (Skor Kriteria 3 × 0.30). Nilai akhir dikonversi ke skala 100 dan berbobot 30% dari total nilai mata kuliah sesuai Pasal 47 Peraturan Rektor Unpatti No. 12 Tahun 2026.',
        consultantRecommendation: 'Dosen disarankan memberikan data awal citra satelit pada Minggu ke-4 sebagai studi stimulus, kemudian memfasilitasi sesi konsultasi kelompok terpandu pada Minggu ke-5 sebelum pengumpulan naskah akhir pada Minggu ke-7.',
        isApproved: true,
      },
    },
    rawRpsText: `RENCANA PEMBELAJARAN SEMESTER (RPS) OBE
UNIVERSITAS PATTIMURA
FAKULTAS PERIKANAN DAN ILMU KELAUTAN
Mata Kuliah: Oseanografi Perikanan dan Dinamika Laut-Pulau Maluku (PIK-3204)
SKS: 3 (2 Teori, 1 Praktik Lapangan)
Semester: IV (Empat) - Program Sarjana (KKNI Level 6)
Pola Ilmiah Pokok: Bina Mulia ke Lautan (Rekonstruksi 2025)

CPMK 1: Mampu menganalisis fenomena oseanografi fisik dan kimia perairan kepulauan Maluku.
CPMK 2: Mampu memformulasikan strategi penentuan daerah penangkapan ikan (ZPPI) potensial.
CPMK 3: Mampu merancang proyek mitigasi perubahan iklim dan tata kelola perikanan berkelanjutan.

Rencana Komponen Evaluasi:
- Case Method (30%)
- Team-Based Project (25%)
- Tugas Terstruktur (15%)
- Kuis (5%)
- UTS (10%)
- UAS (15%)`,
  },
  {
    id: 'hukum_adat_fh',
    label: 'Hukum Adat Laut & Hak Ulayat Pesisir Kepulauan (S1 Fak. Hukum Unpatti)',
    description: 'Model 1 (55% Kasus & Proyek) - Fokus Pranata Sasi Laut Maluku & SDG 16',
    identity: {
      name: 'Hukum Adat Laut dan Pengelolaan Hak Ulayat Pesisir Kepulauan',
      code: 'HKM-2108',
      sks: 3,
      semester: 3,
      level: 'Level 6 (Sarjana / D4)',
      faculty: 'Fakultas Hukum',
      studyProgram: 'Ilmu Hukum',
      lecturer: 'Bagian Hukum Adat dan Hukum Lingkungan Maritim Unpatti',
      cpmkList: [
        {
          id: 'CPMK-1',
          code: 'CPMK 1',
          desc: 'Mampu menganalisis pluralisme hukum dalam tata kelola wilayah laut kepulauan dan eksistensi hak ulayat laut (petuanan laut) di Maluku.',
        },
        {
          id: 'CPMK-2',
          code: 'CPMK 2',
          desc: 'Mampu mengevaluasi sengketa batas petuanan laut dan penetapan peraturan negeri (Perneg) konservasi adat sasi laut berbasis perundang-undangan nasional.',
        },
      ],
      pipFocus: 'Pola Ilmiah Pokok Bina Mulia Kelautan: Harmonisasi hukum adat petuanan laut Maluku dengan Hukum Laut Nasional dan Konvensi UNCLOS 1982.',
      sdgsAlignment: ['SDG 16: Peace, Justice & Strong Institutions', 'SDG 14: Life Below Water'],
    },
    components: [
      {
        id: 'comp-1',
        name: 'Metode Pemecahan Kasus (Case Method): Resolusi Sengketa Batas Petuanan Laut Antar-Negeri Adat',
        category: 'case_method',
        weight: 30,
        subCpmkList: ['Sub-CPMK 1 & 2: Analisis Sengketa Wilayah Adat Pesisir'],
        bloomLevels: ['C4 - Analisis', 'C5 - Evaluasi'],
        suggestedWeeks: 'Minggu ke-3 s.d. 7',
        status: 'drafted',
      },
      {
        id: 'comp-2',
        name: 'Proyek Berbasis Tim (Team-Based Project): Perancangan Naskah Akademik & Draf Peraturan Negeri (Perneg) Sasi Laut Berkelanjutan',
        category: 'team_project',
        weight: 25,
        subCpmkList: ['Sub-CPMK 2: Harmonisasi Perneg dengan UU Pengelolaan Wilayah Pesisir'],
        bloomLevels: ['C5 - Evaluasi', 'C6 - Kreasi'],
        suggestedWeeks: 'Minggu ke-10 s.d. 15',
        status: 'pending',
      },
      {
        id: 'comp-3',
        name: 'Tugas Terstruktur Mandiri: Studi Komparasi Putusan Pengadilan Terkait Hak Ulayat Laut di Indonesia',
        category: 'structured_task',
        weight: 15,
        subCpmkList: ['Sub-CPMK 1: Yurisprudensi Hak Tradisional Masyarakat Adat'],
        bloomLevels: ['C4 - Analisis'],
        suggestedWeeks: 'Minggu ke-4',
        status: 'pending',
      },
      {
        id: 'comp-4',
        name: 'Kuis & Partisipasi Diskusi Mahkamah Peradilan Adat Semu',
        category: 'quiz',
        weight: 5,
        subCpmkList: ['Sub-CPMK 1: Asas-Asas Hukum Adat Laut'],
        bloomLevels: ['C3 - Penerapan'],
        suggestedWeeks: 'Minggu ke-6',
        status: 'pending',
      },
      {
        id: 'comp-5',
        name: 'Ujian Tengah Semester (UTS): Analisis Kasus Hukum Adat Maritim Tertulis',
        category: 'uts',
        weight: 10,
        subCpmkList: ['Sub-CPMK 1 & 2'],
        bloomLevels: ['C4 - Analisis'],
        suggestedWeeks: 'Minggu ke-8',
        status: 'pending',
      },
      {
        id: 'comp-6',
        name: 'Ujian Akhir Semester (UAS): Simulasi Uji Sahih Peraturan Negeri Konservasi Adat',
        category: 'uas',
        weight: 15,
        subCpmkList: ['Sub-CPMK 2: Advokasi & Pertanggungjawaban Produk Hukum'],
        bloomLevels: ['C5 - Evaluasi', 'C6 - Kreasi'],
        suggestedWeeks: 'Minggu ke-16',
        status: 'pending',
      },
    ],
    sampleInstruments: {},
    rawRpsText: `RPS HUKUM ADAT LAUT DAN HAK ULAYAT PESISIR KEPULAUAN (HKM-2108)
Fakultas Hukum Universitas Pattimura
Jenjang S1 (KKNI Level 6) - 3 SKS
Landasan: PIP Bina Mulia ke Lautan Unpatti`,
  },
  {
    id: 'biotek_pasca',
    label: 'Bioteknologi Bahari & Valorisasi Senyawa Aktif Organisme Laut (S2 Pascasarjana Unpatti)',
    description: 'Model 2 (55% Proyek & Praktik) - Pascasarjana KKNI Level 8, Skala A, A-, B+, B, B-, C, E',
    identity: {
      name: 'Bioteknologi Bahari dan Valorisasi Senyawa Aktif Organisme Laut Maluku',
      code: 'BIO-8102',
      sks: 3,
      semester: 1,
      level: 'Level 8 (Magister / Spesialis)',
      faculty: 'Sekolah Pascasarjana / Program Magister Biologi',
      studyProgram: 'Magister Ilmu Kelautan & Bioteknologi',
      lecturer: 'Prof. Tim Pengampu Bioteknologi Kelautan Pascasarjana Unpatti',
      cpmkList: [
        {
          id: 'CPMK-1',
          code: 'CPMK 1',
          desc: 'Mampu mengisolasi, mengkarakterisasi, dan memvalidasi senyawa metabolit sekunder bioaktif dari spons, teripang, dan makroalga perairan Maluku.',
        },
        {
          id: 'CPMK-2',
          code: 'CPMK 2',
          desc: 'Mampu merancang riset transdisipliner inovatif bioprospeksi bahari untuk aplikasi farmaseutika dan nutraceutical bernilai ekonomi tinggi.',
        },
      ],
      pipFocus: 'Pola Ilmiah Pokok Bina Mulia Kelautan: Eksplorasi keanekaragaman hayati laut Maluku untuk pengembangan industri biofarmaka maritim berkelanjutan.',
      sdgsAlignment: ['SDG 3: Good Health and Well-being', 'SDG 14: Life Below Water', 'SDG 9: Industry, Innovation and Infrastructure'],
    },
    components: [
      {
        id: 'comp-1',
        name: 'Hasil Proyek & Praktik Riset Laboratorium Terpadu: Karakterisasi Bioaktif Organisme Laut Maluku',
        category: 'field_work',
        weight: 35,
        subCpmkList: ['Sub-CPMK 1 & 2: Riset Ekstraksi dan Elusidasi Senyawa Aktif'],
        bloomLevels: ['C5 - Evaluasi', 'C6 - Kreasi'],
        suggestedWeeks: 'Minggu ke-8 s.d. 14',
        status: 'drafted',
      },
      {
        id: 'comp-2',
        name: 'Aktivitas Partisipatif & Diskusi Kasus Riset (Case Discussion): Analisis Paten & Hak Kekayaan Intelektual Bioprospeksi Laut',
        category: 'participatory',
        weight: 20,
        subCpmkList: ['Sub-CPMK 2: Etika Bioprospeksi & Pencegahan Biopiracy'],
        bloomLevels: ['C4 - Analisis', 'C5 - Evaluasi'],
        suggestedWeeks: 'Minggu ke-3 s.d. 6',
        status: 'pending',
      },
      {
        id: 'comp-3',
        name: 'Tugas Analisis Data Spektroskopi (NMR/LC-MS/MS) & Penulisan Draf Artikel Jurnal Bereputasi',
        category: 'structured_task',
        weight: 15,
        subCpmkList: ['Sub-CPMK 1: Interpretasi Profil Molekuler'],
        bloomLevels: ['C4 - Analisis', 'C5 - Evaluasi'],
        suggestedWeeks: 'Minggu ke-7',
        status: 'pending',
      },
      {
        id: 'comp-4',
        name: 'Ujian Tengah Semester (UTS): Ujian Komprehensif Desain Protokol Eksplorasi Molekuler Bahari',
        category: 'uts',
        weight: 15,
        subCpmkList: ['Sub-CPMK 1 & 2'],
        bloomLevels: ['C5 - Evaluasi'],
        suggestedWeeks: 'Minggu ke-8',
        status: 'pending',
      },
      {
        id: 'comp-5',
        name: 'Ujian Akhir Semester (UAS): Kolokium & Diseminasi Naskah Paten/Riset Inovasi Bahari',
        category: 'uas',
        weight: 15,
        subCpmkList: ['Sub-CPMK 2: Pertanggungjawaban Ilmiah Pascasarjana'],
        bloomLevels: ['C6 - Kreasi'],
        suggestedWeeks: 'Minggu ke-16',
        status: 'pending',
      },
    ],
    sampleInstruments: {},
    rawRpsText: `RPS BIOTEKNOLOGI BAHARI PASCA SARJANA (BIO-8102)
Sekolah Pascasarjana Universitas Pattimura
Jenjang S2 (KKNI Level 8) - Magister Ilmu Kelautan`,
  },
];
