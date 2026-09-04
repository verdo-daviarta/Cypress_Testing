import bahasaTambahBahasaPage from '../pages/kemhanBahasa-TambahBahasaPage';

describe('Skenario Tambah Bahasa - Sistem Informasi Akademik', { retries: 0 }, () => {
  before(() => {
    bahasaTambahBahasaPage.login();
  });

  it('Mengisi nama dan memilih tipe Bahasa pada formulir Tambah Bahasa', () => {
    const namaBahasa = 'Bahasa Uji';

    bahasaTambahBahasaPage.aksesMenuBahasa();
    bahasaTambahBahasaPage.tambahBahasa();
    bahasaTambahBahasaPage.inputNamaBahasa(namaBahasa);
    bahasaTambahBahasaPage.pilihTipeBahasaKIBINA();
    bahasaTambahBahasaPage.simpanBahasa();
  });
});
