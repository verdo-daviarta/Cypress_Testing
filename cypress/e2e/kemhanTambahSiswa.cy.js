import tambahSiswaPage from '../pages/kemhanBahasa-TambahSiswaPage';

describe('Skenario Tambah Siswa - Generate Akun', { retries: 0 }, () => {
  beforeEach(() => {
    tambahSiswaPage.visit();
    tambahSiswaPage.login();
  });

  it('Generate akun siswa dan menyimpan dokumen hasil download', () => {
    // Prefix 6 karakter + timestamp 13 karakter = 19 karakter.
    const namaSiswa = `Cy_${Date.now()}`;
    const jumlahAkun = 1;
    const tipeSiswa = 'Nasional'; // Internasional / Nasional / DIKLN

    tambahSiswaPage.aksesMenuGenerateAkun();
    tambahSiswaPage.inputNamaSiswa(namaSiswa);
    tambahSiswaPage.inputJumlahSiswa(jumlahAkun);
    tambahSiswaPage.pilihTipeSiswa(tipeSiswa);

    // Klik Generate Akun, tunggu file baru di downloadsFolder sesuai konfigurasi,
    // lalu verifikasi dokumen tersimpan dan tidak kosong.
    tambahSiswaPage.generateAkun();
  });
});
