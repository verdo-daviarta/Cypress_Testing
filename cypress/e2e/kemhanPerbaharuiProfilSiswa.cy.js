import perbaharuiProfilPage from '../pages/kemhanBahasa-PerbaharuiProfilPage';

describe('Skenario Perbaharui Profil Siswa', { retries: 0 }, () => {
  it('Memperbaharui profil menggunakan akun hasil Generate Akun terbaru', () => {
    const idUnik = Date.now().toString();
    const email = `siswa.${idUnik}@example.com`;
    const kategori = 'TNI';
    const pangkat = 'Sersan Mayor (Serma)';
    const matra = 'AD';
    const nrp = idUnik;
    const posisi = 'Siswa';
    const unitKerja = `Unit QA ${idUnik.slice(-6)}`;
    const nomorTeleponKantor = `021${idUnik.slice(-8)}`;
    const nomorTeleponRumah = `022${idUnik.slice(-8)}`;
    // Kedua data ini harus sudah tersedia dan saling berhubungan.
    const bahasaPengajaran = 'Bahasa Uji';
    const minatKursus = 'Kursus Uji';
    const instansi = 'Instansi QA';
    const nomorTelepon = `08${idUnik.slice(-10)}`;

    expect(pangkat, 'Isi PROFIL_PANGKAT dengan opsi Pangkat kategori TNI')
      .to.be.a('string').and.not.be.empty;

    perbaharuiProfilPage.visit();
    perbaharuiProfilPage.login();
    cy.get('@generatedStudent', { log: false }).then((generatedStudent) => {
      const { namaSiswa } = generatedStudent;
      const dataProfil = {
        nama: namaSiswa, email, kategori, pangkat, matra, nrp, posisi, unitKerja,
        nomorTeleponKantor, nomorTeleponRumah, bahasaPengajaran,
        minatKursus, instansi, nomorTelepon,
      };

      perbaharuiProfilPage.aksesMenuProfil();
      perbaharuiProfilPage.EditProfil();
      // namaSiswa berasal dari kolom Nama pada Excel Generate Akun terbaru.
      perbaharuiProfilPage.isiProfil(dataProfil);
      perbaharuiProfilPage.simpan();
      perbaharuiProfilPage.verifikasiProfilTersimpan(dataProfil);
      cy.task('saveLatestUpdatedStudent', generatedStudent, { log: false });
    });
  });
});
