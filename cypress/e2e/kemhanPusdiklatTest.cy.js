import kemhanLoginPage from '../pages/kemhanLoginPage';
import kemhanPusdiklatPage from '../pages/kemhanPusdiklatPage';

describe('Skenario Navigasi Menu Aplikasi Pusdiklat', () => {
  beforeEach(() => {
    // Kita gunakan before() agar login cukup 1x untuk seluruh aplikasi (menghemat waktu)
    kemhanLoginPage.visit();
    const username = Cypress.env('KEMHAN_USERNAME');
    const password = Cypress.env('KEMHAN_PASSWORD');

    expect(username, 'KEMHAN_USERNAME').to.be.a('string').and.not.be.empty;
    expect(password, 'KEMHAN_PASSWORD').to.be.a('string').and.not.be.empty;

    kemhanLoginPage.login(username, password);
    kemhanPusdiklatPage.verifyOnDashboard();
  });

  const daftarAplikasi = [
    'Pengelolaan Siswa',
    'Pengelolaan Akademik',
    'Pengelolaan Alumni',
    'Pengelolaan Uji Komputer',
    'Manajemen Pengajaran',
    'Pengelolaan Aset Inventaris',
    'Pembelajaran Elektronik',
    'Dashboard Pimpinan',
    'Konferensi Kelas',
    'Pengelolaan Pemantauan'
  ];

// KUNCI PERBAIKAN: Seluruh looping dimasukkan ke dalam SATU test case ini
  it('Memastikan seluruh menu aplikasi memiliki tautan aktif yang valid secara bersamaan', () => {
    
    daftarAplikasi.forEach((aplikasi) => {
      // Cypress akan memeriksa 10 aplikasi sekaligus tanpa terputus penghapusan sesi
      kemhanPusdiklatPage.verifyTautanAplikasi(aplikasi);
    });
  });
});