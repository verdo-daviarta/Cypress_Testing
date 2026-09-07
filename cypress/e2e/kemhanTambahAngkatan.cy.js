import bahasaTambahAngkatanPage from '../pages/kemhanBahasa-TambahAngkatan';

describe('Skenario Tambah Angkatan - Sistem Informasi Akademik', { retries: 0 }, () => {
  beforeEach(() => {
    bahasaTambahAngkatanPage.login();
  });

  it('Membuat Angkatan Baru', () => {
    // Kursus dan Bahasa ini harus sudah tersedia pada halaman Kursus.
    const namaBahasa = 'Bahasa Uji';
    const namaKursus = 'Kursus Uji';
    const namaAngkatan = 'Angkatan Uji';
    const formatTanggal = (date) => {
      const tahun = date.getFullYear();
      const bulan = String(date.getMonth() + 1).padStart(2, '0');
      const hari = String(date.getDate()).padStart(2, '0');
      return `${tahun}-${bulan}-${hari}`;
    };

    bahasaTambahAngkatanPage.aksesMenuKursus();
    bahasaTambahAngkatanPage.lihatAngkatan(namaKursus, namaBahasa);
    bahasaTambahAngkatanPage.tambahAngkatan();
    bahasaTambahAngkatanPage.inputNamaAngkatan(namaAngkatan);
    // Hitung saat form siap, menggunakan tanggal lokal browser pelaksana test.
    cy.then(() => {
      const hariIni = new Date();
      const hariTerakhir = new Date(hariIni);
      hariTerakhir.setDate(hariTerakhir.getDate() + 30);

      const tanggalMulai = formatTanggal(hariIni);
      const tanggalAkhir = formatTanggal(hariTerakhir);

      bahasaTambahAngkatanPage.inputTanggalMulai(tanggalMulai);
      bahasaTambahAngkatanPage.inputTanggalAkhir(tanggalAkhir);
    });
    bahasaTambahAngkatanPage.simpanAngkatan();
  });
});
