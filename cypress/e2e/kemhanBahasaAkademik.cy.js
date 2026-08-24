import kemhanBahasaAkademikPage from '../pages/kemhanBahasa-AkademikPage';

describe('Skenario Validasi Akses Menu - Sistem Informasi Siswa', () => {
  before(() => {
    kemhanBahasaAkademikPage.visit();

    const username = Cypress.env('KEMHAN_USERNAME');
    const password = Cypress.env('KEMHAN_PASSWORD');

    expect(username, 'KEMHAN_USERNAME').to.be.a('string').and.not.be.empty;
    expect(password, 'KEMHAN_PASSWORD').to.be.a('string').and.not.be.empty;

    kemhanBahasaAkademikPage.login(username, password);
    kemhanBahasaAkademikPage.verifyOnDashboard();
  });

  it('Memastikan seluruh menu bar dapat diakses dalam satu sesi login', () => {
    const daftarMenu = [
      ['Kalender Akademik', '/kalender-akademik', 'kalender akademik'],
      ['Bahasa', '/bahasa', 'Bahasa'],
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

    daftarMenu.forEach(([namaMenu, expectedPath, expectedBreadcrumb, namaMenuParent]) => {
      kemhanBahasaAkademikPage.goToDashboard();
      kemhanBahasaAkademikPage.validasiAksesMenu(
        namaMenu,
        expectedPath,
        expectedBreadcrumb,
        namaMenuParent
      );
    });
  });
});