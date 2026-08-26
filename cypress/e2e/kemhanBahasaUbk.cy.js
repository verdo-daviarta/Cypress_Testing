import kemhanBahasaUbkpage from '../pages/kemhanBahasa-UbkPage';

describe('Skenario Validasi Akses Menu - Sistem Informasi UBK', { retries: 0 }, () => {
  before(() => {
    kemhanBahasaUbkpage.visit();

    kemhanBahasaUbkpage.login();
    kemhanBahasaUbkpage.verifyOnDashboard();
  });

  it('Memastikan seluruh menu bar dapat diakses dalam satu sesi login', () => {
    const daftarMenu = [
      ['Kalender Akademik', '/kalender-akademik', 'Kalender Akademik'],
      ['Jadwal Kuis', '/manajemen/kuis/jadwal', 'Jadwal Kuis', 'Manajemen Kuis'],
      ['Penilaian Kuis', '/manajemen/kuis/penilaian', 'Penilaian Kuis', 'Manajemen Kuis'],
      ['Hasil Kuis', '/manajemen/kuis/hasil', 'Hasil Kuis', 'Manajemen Kuis'],
      ['Jadwal Ujian', '/manajemen/ujian/jadwal', 'Jadwal Ujian', 'Manajemen Ujian'],
      ['Penilaian Ujian', '/manajemen/ujian/penilaian', 'Penilaian Ujian', 'Manajemen Ujian'],
      ['Hasil Ujian', '/manajemen/ujian/hasil', 'Hasil Ujian', 'Manajemen Ujian'],
      ['Bentuk Soal', '/bank-soal/bentuk-soal', 'Bentuk Soal', 'Bank Soal'],
      ['Soal Kuis', '/bank-soal/soal-kuis', 'Soal Kuis', 'Bank Soal'],
      ['Soal Ujian', '/bank-soal/soal-ujian', 'Soal Ujian', 'Bank Soal'],
      ['Peran & Izin', '/peran', 'Peran & Izin', 'Manajemen'],
      ['Akses', '/akses', 'Akses', 'Manajemen']
    ];

    daftarMenu.forEach(([namaMenu, expectedPath, expectedBreadcrumb, namaMenuParent]) => {
      kemhanBahasaUbkpage.validasiAksesMenu(
        namaMenu,
        expectedPath,
        expectedBreadcrumb,
        namaMenuParent
      );
    });
  });
});