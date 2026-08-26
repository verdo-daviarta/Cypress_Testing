import kemhanBahasaPengajaranPage from '../pages/kemhanBahasa-PengajaranPage';

Cypress.on('uncaught:exception', (error) => {
  if (
    error.message.includes('Livewire is not defined')
    || error.message.includes("Cannot read properties of undefined (reading 'top')")
  ) {
    return false;
  }
});

describe('Skenario Validasi Akses Menu - Sistem Informasi Pengajaran', { retries: 0 }, () => {
  before(() => {
    kemhanBahasaPengajaranPage.visit();

    kemhanBahasaPengajaranPage.openLogin();
    kemhanBahasaPengajaranPage.login();
    kemhanBahasaPengajaranPage.verifyOnDashboard();
  });

  it('Memastikan seluruh menu bar dapat diakses dalam satu sesi login', () => {
    const daftarMenu = [
      ['Kalender', '/calender', 'Kalender'],
      ['Manajemen Berkas', '/file-management', 'Manajemen Berkas'],
      ['Pengajaran', '/schedule', 'Pengajaran'],
      ['Kemajuan Studi', '/study-progress', 'Kemajuan Studi'],
      ['Manajemen Wewenang', '/role', 'Manajemen Wewenang'],
      ['Manajemen Akses', '/user', 'Manajemen Akses']
    ];

    daftarMenu.forEach(([namaMenu, expectedPath, expectedBreadcrumb, namaMenuParent]) => {
      kemhanBahasaPengajaranPage.validasiAksesMenu(
        namaMenu,
        expectedPath,
        expectedBreadcrumb,
        namaMenuParent
      );
    });
  });
});