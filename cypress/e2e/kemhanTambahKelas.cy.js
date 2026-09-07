import bahasaTambahKelasPage from '../pages/kemhanBahasa-TambahKelasPage';

describe('Skenario Tambah Kelas - Sistem Informasi Akademik', { retries: 0 }, () => {
  beforeEach(() => {
    bahasaTambahKelasPage.login();
  });

  it('Mengisi Informasi Kelas dan klik Simpan', () => {
    // Data Kursus, Angkatan, Class Master, dan Widyaiswara harus sudah tersedia.
    const namaKursus = 'Kursus Uji';
    const namaAngkatan = 'Angkatan Uji';
    const namaClassMaster = 'class master';
    const nilaiMinimal = 70;
    const kapasitasSiswa = 30;
    const namaKelas = 'Kelas Uji';
    const namaWidyaiswara = 'Amba WI';
    const namaSiswa = '';

    bahasaTambahKelasPage.aksesMenuKelas();
    bahasaTambahKelasPage.tambahKelas();
    bahasaTambahKelasPage.pilihKursusAngkatan(namaKursus, namaAngkatan);
    bahasaTambahKelasPage.pilihClassMaster(namaClassMaster);
    bahasaTambahKelasPage.inputNilaiMinimal(nilaiMinimal);
    bahasaTambahKelasPage.inputKapasitasSiswa(kapasitasSiswa);
    bahasaTambahKelasPage.inputNamaKelas(namaKelas);
    bahasaTambahKelasPage.tambahWidyaiswara();
    bahasaTambahKelasPage.pilihWidyaiswara(namaWidyaiswara);
    // Sesuai alur saat ini, hanya membuka baris Siswa tanpa memilih nama.
    bahasaTambahKelasPage.tambahSiswa();
    bahasaTambahKelasPage.simpanKelas();
  });
});
