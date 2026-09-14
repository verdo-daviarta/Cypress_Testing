import verifikasiAkunPage from '../pages/kemhanBahasa-VerifikasiAkunPage';
import { namaSiswa } from '../fixtures/profilSiswa.json';

describe('Skenario Verifikasi Siswa oleh Admin', { retries: 0 }, () => {
  beforeEach(() => {
    verifikasiAkunPage.visit();
    // Credential admin dari KEMHAN_USERNAME dan KEMHAN_PASSWORD.
    verifikasiAkunPage.login();
  });

  it('Membuka detail siswa yang telah diperbaharui dan klik Verifikasi', () => {
    // Nama berasal dari data bersama dengan skenario Perbaharui Profil.
    // Prasyarat: profil sudah diajukan dan belum terverifikasi.

    verifikasiAkunPage.aksesMenuProfilCalonSiswa();
    verifikasiAkunPage.bukaDetailCalonSiswa(namaSiswa);
    verifikasiAkunPage.verifikasiAkun(namaSiswa);
  });
});
