import bahasaTambahSubjekPage from '../pages/kemhanBahasa-TambahSubjekPage';

describe('Skenario Tambah Subjek - Sistem Informasi Akademik', { retries: 0 }, () => {
  before(() => {
    bahasaTambahSubjekPage.login();
  });

  it('Mengisi nama Subjek pada formulir Tambah Subjek', () => {
    const namaSubjek = 'Subjek Uji';

    bahasaTambahSubjekPage.aksesMenuSubjek();
    bahasaTambahSubjekPage.tambahSubjek();
    bahasaTambahSubjekPage.inputNamaSubjek(namaSubjek);
    bahasaTambahSubjekPage.simpanSubjek(namaSubjek);
  });
});