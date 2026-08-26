import kemhanBahasaSiswaPage from '../pages/kemhanBahasa-SiswaPage';

describe('Skenario Validasi Akses Menu - Sistem Informasi Siswa', { retries: 0 }, () => {
  before(() => {
    kemhanBahasaSiswaPage.visit();

    kemhanBahasaSiswaPage.login();
    kemhanBahasaSiswaPage.verifyOnDashboard();
  });
      
  it('Memastikan seluruh menu bar dapat diakses dalam satu sesi login', () => {
    const daftarMenu = [
      ['Kalender Akademik', '/kalender-akademik', 'kalender akademik'],
      ['Generate Akun', '/generate', 'Generate Akun'],
      ['Profil Calon Siswa', '/calon', 'Profil Calon Siswa'],
      ['Profil Siswa', '/profil', 'Profil Siswa'],
      ['Ujian Masuk', '/pendaftaran/ujian-masuk', 'Ujian Masuk', 'Pendaftaran'],
      [
        'Ujian Seleksi Kelas',
        '/pendaftaran/ujian-seleksi-kelas',
        'Ujian Seleksi Kelas',
        'Pendaftaran'
      ],
      ['Peran & Izin', '/peran', 'Peran & Izin', 'Manajemen'],
      ['Akses', '/akses', 'Akses', 'Manajemen']
    ];

    daftarMenu.forEach(([, expectedPath, expectedBreadcrumb]) => {
      kemhanBahasaSiswaPage.validasiAksesMenuLangsung(
        expectedPath,
        expectedBreadcrumb
      );
    });
  });
});