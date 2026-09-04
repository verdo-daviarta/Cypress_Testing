import bahasaTambahKursusPage from '../pages/kemhanBahasa-TambahKursusPage';

describe('Skenario Tambah Kursus - Sistem Informasi Akademik', { retries: 0 }, () => {
  before(() => {
    bahasaTambahKursusPage.login();
  });

  it('Membuat Kursus Baru', () => {
    const namaBahasa = 'Bahasa Uji';
    const namaKursus = 'Kursus Uji';
    const deskripsiKursus = 'Deskripsi Kursus Uji';

    bahasaTambahKursusPage.aksesMenuKursus();
    bahasaTambahKursusPage.tambahKursus();
    bahasaTambahKursusPage.inputNamaKursus(namaKursus);
    bahasaTambahKursusPage.inputNamaBahasa(namaBahasa);
    bahasaTambahKursusPage.pilihTingkat();
    bahasaTambahKursusPage.inputDeskripsiKursus(deskripsiKursus);
    bahasaTambahKursusPage.simpanKursus();
    bahasaTambahKursusPage.verifikasiKursusBerhasilDibuat(namaKursus, namaBahasa);
  });
});
