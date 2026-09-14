import perbaharuiProfilPage from '../pages/kemhanBahasa-PerbaharuiProfilPage';
import { namaSiswa } from '../fixtures/profilSiswa.json';

describe('Skenario Perbaharui Profil Siswa', { retries: 0 }, () => {
  it('Memperbaharui profil menggunakan akun hasil Generate Akun terbaru', () => {
    const email = `siswa.${Date.now()}@example.com`;
    const kategori = 'TNI';
    const pangkat = 'Sersan Mayor (Serma)';
    const matra = 'AD';
    const nrp = '990000001';
    const posisi = 'Siswa';
    const unitKerja = 'Unit QA';
    const nomorTeleponKantor = '0215550101';
    const nomorTeleponRumah = '0215550102';
    // Kedua data ini harus sudah tersedia dan saling berhubungan.
    const bahasaPengajaran = 'Bahasa Uji';
    const minatKursus = 'Kursus Uji';
    const instansi = 'Instansi QA';
    const nomorTelepon = '081200000001';

    expect(pangkat, 'Isi PROFIL_PANGKAT dengan opsi Pangkat kategori TNI')
      .to.be.a('string').and.not.be.empty;

    perbaharuiProfilPage.visit();
    perbaharuiProfilPage.login();
    perbaharuiProfilPage.aksesMenuProfil();
    perbaharuiProfilPage.EditProfil();

    // Username/password tidak diubah agar credential Excel tetap berlaku.
    perbaharuiProfilPage.isiProfil({
      nama: namaSiswa, email, kategori, pangkat, matra, nrp, posisi, unitKerja,
      nomorTeleponKantor, nomorTeleponRumah, bahasaPengajaran,
      minatKursus, instansi, nomorTelepon,
    });
    perbaharuiProfilPage.simpan();
    perbaharuiProfilPage.verifikasiProfilTersimpan(namaSiswa, email);
  });
});
