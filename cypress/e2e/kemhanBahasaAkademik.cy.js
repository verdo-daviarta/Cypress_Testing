import kemhanBahasaAkademikPage from '../pages/kemhanBahasa-AkademikPage';

describe('Skenario Validasi Akses Menu - Sistem Informasi Akademik', { retries: 0 }, () => {
  before(() => {
    kemhanBahasaAkademikPage.visit();

    kemhanBahasaAkademikPage.login();
    kemhanBahasaAkademikPage.verifyOnDashboard();
  });

  it('Memastikan seluruh menu bar dapat diakses dalam satu sesi login', () => {
    const daftarMenu = [
      ['Kalender Akademik', '/kalendar-akademik', 'Kalender Akademik'],
      ['Bahasa', '/bahasa', 'Bahasa'],
      ['Subjek', '/subjek', 'Subjek'],
      ['Kursus', '/kursus', 'Kursus'],
      ['Kelas', '/kelas', 'Kelas'],
      ['Jadwal Ujian Masuk', '/jadwal-ujian-masuk', 'Jadwal Ujian Masuk'],
      ['Jadwal Mingguan', '/jadwal-mingguan', 'Jadwal Mingguan'],
      ['Penilaian Ujian Masuk', '/penilaian/ujian-masuk', 'Penilaian Ujian Masuk', 'Penilaian'],
      ['Penilaian Ujian Seleksi Kelas', '/penilaian/ujian-seleksi-kelas', 'Penilaian Ujian Seleksi Kelas', 'Penilaian'],
      ['Penilaian Akademik', '/penilaian/akademik', 'Penilaian Akademik', 'Penilaian'],
      ['Penilaian Nilai Akhir', '/nilai-akhir', 'Penilaian Nilai Akhir'],
      ['Sertifikat Kelulusan', '/sertifikat-kelulusan', 'Sertifikat Kelulusan'],
      ['Piagam Penghargaan', '/piagam-penghargaan', 'Piagam Penghargaan'],
      ['Form Evaluasi', '/form-evaluasi', 'Form Evaluasi'],
      ['Hasil Evaluasi', '/hasil-evaluasi', 'Hasil Evaluasi'],
      ['Peran & Izin', '/peran', 'Peran & Izin', 'Manajemen Akun'],
      ['Akses', '/akses', 'Akses', 'Manajemen Akun']
    ];

    daftarMenu.forEach(([, expectedPath, expectedBreadcrumb]) => {
      kemhanBahasaAkademikPage.validasiAksesMenuLangsung(
        expectedPath,
        expectedBreadcrumb
      );
    });
  });
});