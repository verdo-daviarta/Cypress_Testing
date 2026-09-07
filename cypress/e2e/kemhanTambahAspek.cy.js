import bahasaTambahAspekPage from '../pages/kemhanBahasa-TambahAspek';

describe('Skenario Tambah Aspek - Sistem Informasi Akademik', { retries: 0 }, () => {
  before(() => {
    bahasaTambahAspekPage.login();
  });

  it('Membuat Aspek Baru', () => {
    const namaBahasa = 'Bahasa Uji';
    const namaKursus = 'Kursus Uji';
    const namaAspek = 'Aspek Uji';
    const jumlahBobot = '100';
    const namaSubjek = 'Subjek Uji';
    const bobotSubjek = '100';
    const totalJP = '100';

    bahasaTambahAspekPage.aksesMenuKursus();
    bahasaTambahAspekPage.lihatAspek(namaKursus, namaBahasa);
    bahasaTambahAspekPage.tambahAspek();
    bahasaTambahAspekPage.inputNamaAspek(namaAspek);
    bahasaTambahAspekPage.inputJumlahBobot(jumlahBobot);
    bahasaTambahAspekPage.tambahBarisSubjek();
    bahasaTambahAspekPage.pilihSubjek(namaSubjek);
    bahasaTambahAspekPage.inputBobotSubjek(bobotSubjek);
    bahasaTambahAspekPage.inputTotalJP(totalJP);
    bahasaTambahAspekPage.simpanAspek();
  });
});
