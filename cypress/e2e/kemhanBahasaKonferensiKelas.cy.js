import kemhanBahasaKonferensiKelasPage from '../pages/kemhanBahasa-KonferensiKelasPage';

describe('Skenario Validasi Akses Menu - Sistem Informasi Konferensi Kelas', { retries: 0 }, () => {
  before(() => {
    kemhanBahasaKonferensiKelasPage.visit();

    kemhanBahasaKonferensiKelasPage.login();
    kemhanBahasaKonferensiKelasPage.verifyOnDashboard();
  });

  it('Memastikan seluruh menu bar dapat diakses dalam satu sesi login', () => {
    const daftarMenu = [
      ['Ruangan', '/rooms', 'Ruangan'],
      ['Kelompok', '/groups', 'Kelompok'],
      ['Peserta', '/users', 'Peserta'],  
      ['Roles & Permissions', '/roles', 'Roles & Permissions'],
      ['Rekaman', '/recordings', 'Rekaman']
    ];

    daftarMenu.forEach(([namaMenu, expectedPath, expectedBreadcrumb, namaMenuParent]) => {
      kemhanBahasaKonferensiKelasPage.validasiAksesMenu(
        namaMenu,
        expectedPath,
        expectedBreadcrumb,
        namaMenuParent
      );
    });
  });
});