import kemhanBahasaAlumniPage from '../pages/kemhanBahasa-AlumniPage';

describe('Skenario Validasi Akses Menu - Sistem Informasi Alumni', { retries: 0 }, () => {
  before(() => {
    kemhanBahasaAlumniPage.visit();

    kemhanBahasaAlumniPage.login();
    kemhanBahasaAlumniPage.verifyOnDashboard();
  });

  it('Memastikan seluruh menu bar dapat diakses dalam satu sesi login', () => {
    const daftarMenu = [
      ['Kalender Akademik', '/kalender-akademik', 'Kalender Akademik'],
      ['Profil Alumni', '/profil-alumni', 'Profil Alumni'],
      ['Berita', '/berita', 'Berita'],  
      ['Peran & Izin', '/peran', 'Peran & Izin', 'Manajemen'],
      ['Akses', '/akses', 'Akses', 'Manajemen']
    ];

    daftarMenu.forEach(([namaMenu, expectedPath, expectedBreadcrumb, namaMenuParent]) => {
      kemhanBahasaAlumniPage.validasiAksesMenu(
        namaMenu,
        expectedPath,
        expectedBreadcrumb,
        namaMenuParent
      );
    });
  });
});