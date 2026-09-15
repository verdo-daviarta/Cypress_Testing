class KemhanBahasaJadwalUjianMasukPage {
  login() {
    cy.visit('https://akademik-ba.kemhan.go.id/');

    const username = Cypress.env('KEMHAN_USERNAME');
    const password = Cypress.env('KEMHAN_PASSWORD');

    expect(username, 'KEMHAN_USERNAME').to.be.a('string').and.not.be.empty;
    expect(password, 'KEMHAN_PASSWORD').to.be.a('string').and.not.be.empty;

    cy.get('input[name="username"]', { timeout: 20000 })
      .should('be.visible').clear()
      .type(username, { log: false, parseSpecialCharSequences: false });

    cy.get('input[name="password"]', { timeout: 20000 })
      .should('be.visible').clear()
      .type(password, { log: false, parseSpecialCharSequences: false });

    cy.on('uncaught:exception', (error) => {
      const exceptionLoginDariSso = error.name === 'ReferenceError'
        && error.message.includes('login is not defined');

      if (exceptionLoginDariSso) return false;
      return undefined;
    });

    cy.contains('button', /^Login$/, { timeout: 20000 })
      .should('be.visible')
      .click();
  }

  aksesMenuJadwalUjianMasuk() {
    cy.contains(
      'aside button[data-sidebar="menu-button"]',
      /^Jadwal Ujian Masuk$/,
      { timeout: 60000 }
    )
      .scrollIntoView()
      .should('be.visible')
      .click();

    cy.location('pathname', { timeout: 20000 })
      .should('eq', '/jadwal-ujian-masuk');
  }

  tambahJadwalUjianMasuk() {
    cy.contains('main button', /^Tambah$/, { timeout: 20000 })
      .should('have.length', 1)
      .and('be.visible')
      .click();

    cy.location('pathname', { timeout: 20000 })
      .should('eq', '/jadwal-ujian-masuk/tambah');
    cy.get('main button#batchId[role="combobox"]')
      .should('be.visible');
  }

  pilihKursusAngkatan(namaKursus, namaAngkatan) {
    expect(namaKursus, 'namaKursus').to.be.a('string').and.not.be.empty;
    expect(namaAngkatan, 'namaAngkatan').to.be.a('string').and.not.be.empty;
    return this.pilihDropdown(
      'main button#batchId[role="combobox"]',
      `${namaKursus} - ${namaAngkatan}`
    );
  }

  pastikanMingguTerisiOtomatis() {
    return cy.get('main input#week[name="week"]')
      .should('be.disabled')
      .invoke('val')
      .should('match', /^\d+$/);
  }

  inputTanggalUjian(tanggalUjian) {
    return this.pilihTanggal('date', tanggalUjian);
  }

  pilihTipeUjian(tipeUjian) {
    expect(tipeUjian, 'tipeUjian')
      .to.be.oneOf(['Ujian Masuk', 'Seleksi Kelas']);
    return this.pilihDropdown(
      'main button#category[role="combobox"]',
      tipeUjian
    );
  }

  inputDeskripsiJadwal(deskripsiJadwal) {
    return this.isiField('main textarea#description[name="description"]', deskripsiJadwal);
  }

  tambahSesi() {
    cy.contains('main button', /^Tambah$/, { timeout: 20000 })
      .should('have.length', 1)
      .and('be.visible')
      .click();

    return this.dialogSesi().should('be.visible');
  }

  pilihJamMulaiKelas(jamMulaiKelas) {
    return this.pilihDropdown(
      '[role="dialog"] button[id="session-numStartTime"][role="combobox"]',
      String(jamMulaiKelas)
    );
  }

  pilihJamBerakhirKelas(jamBerakhirKelas) {
    return this.pilihDropdown(
      '[role="dialog"] button[id="session-numEndTime"][role="combobox"]',
      String(jamBerakhirKelas)
    );
  }

  pastikanTotalWaktuKelasTerhitung() {
    return cy.get('[role="dialog"] input#session-totalNumTime[name="totalNumTime"]')
      .should('be.disabled')
      .and(($input) => {
        expect($input.val(), 'Total Waktu Kelas').not.to.equal('');
      });
  }

  inputWaktuMulai(waktuMulai) {
    this.validasiWaktu(waktuMulai, 'waktuMulai');
    return this.isiField(
      '[role="dialog"] input#session-startTime[name="startTime"]',
      waktuMulai
    );
  }

  inputWaktuAkhir(waktuAkhir) {
    this.validasiWaktu(waktuAkhir, 'waktuAkhir');
    return this.isiField(
      '[role="dialog"] input#session-endTime[name="endTime"]',
      waktuAkhir
    );
  }

  pastikanTotalWaktuSesiTerhitung() {
    return cy.get('[role="dialog"] input#session-totalTime[name="totalTime"]')
      .should('be.disabled')
      .and(($input) => {
        expect($input.val(), 'Total Waktu Sesi').not.to.equal('');
      });
  }

  pilihSubjek(namaSubjek) {
    return this.pilihDropdown(
      '[role="dialog"] button[id="session-subject.id"][role="combobox"]',
      namaSubjek
    );
  }

  pilihWidyaiswara(namaWidyaiswara) {
    return this.pilihDropdown(
      '[role="dialog"] button[id="session-teacher.id"][role="combobox"]',
      namaWidyaiswara,
      false
    );
  }

  inputRuangan(ruangan) {
    return this.isiField(
      '[role="dialog"] input#session-room[name="room"]',
      ruangan
    );
  }

  inputJumlahSiswa(jumlahSiswa) {
    expect(Number(jumlahSiswa), 'jumlahSiswa').to.be.greaterThan(0);
    return this.isiField(
      '[role="dialog"] input#session-totalStudent[name="totalStudent"]',
      jumlahSiswa
    );
  }

  inputDeskripsiSesi(deskripsiSesi) {
    return this.isiField(
      '[role="dialog"] textarea#session-description[name="description"]',
      deskripsiSesi
    );
  }

  isiInformasiJadwal(dataJadwal) {
    const {
      namaKursus,
      namaAngkatan,
      tanggalUjian,
      tipeUjian,
      deskripsiJadwal = '',
    } = dataJadwal;

    this.pilihKursusAngkatan(namaKursus, namaAngkatan);
    this.pastikanMingguTerisiOtomatis();
    this.inputTanggalUjian(tanggalUjian);
    this.pilihTipeUjian(tipeUjian);
    this.inputDeskripsiJadwal(deskripsiJadwal);
  }

  isiSesi(dataSesi) {
    const {
      jamMulaiKelas,
      jamBerakhirKelas,
      waktuMulai,
      waktuAkhir,
      namaSubjek,
      namaWidyaiswara,
      ruangan,
      jumlahSiswa,
      deskripsiSesi = '',
    } = dataSesi;

    this.pilihJamMulaiKelas(jamMulaiKelas);
    this.pilihJamBerakhirKelas(jamBerakhirKelas);
    this.pastikanTotalWaktuKelasTerhitung();
    this.inputWaktuMulai(waktuMulai);
    this.inputWaktuAkhir(waktuAkhir);
    this.pastikanTotalWaktuSesiTerhitung();
    this.pilihSubjek(namaSubjek);
    this.pilihWidyaiswara(namaWidyaiswara);
    this.inputRuangan(ruangan);
    this.inputJumlahSiswa(jumlahSiswa);
    this.inputDeskripsiSesi(deskripsiSesi);
  }

  simpanSesi() {
    return cy.contains('[role="dialog"] button[type="submit"]', /^Simpan$/)
      .should('have.length', 1)
      .and('be.visible')
      .and('not.be.disabled')
      .click();
  }

  simpanJadwalUjianMasuk() {
    return cy.contains('main button', /^Simpan$/)
      .should('have.length', 1)
      .and('be.visible')
      .and('not.be.disabled')
      .click();
  }

  batalJadwalUjianMasuk() {
    return cy.contains('main button', /^Batal$/)
      .should('have.length', 1)
      .and('be.visible')
      .click();
  }

  dialogSesi() {
    return cy.contains('[role="dialog"] h2', /^TAMBAH JADWAL UJIAN MASUK$/, {
      timeout: 20000,
    }).closest('[role="dialog"]');
  }

  isiField(selector, nilai) {
    expect(nilai, selector).not.to.be.null;
    expect(nilai, selector).not.to.be.undefined;
    const nilaiInput = String(nilai);

    cy.get(selector, { timeout: 20000 })
      .should('have.length', 1)
      .and('be.visible')
      .and('not.be.disabled')
      .clear()
      .then(($field) => {
        if (nilaiInput !== '') {
          cy.wrap($field).type(nilaiInput, { parseSpecialCharSequences: false });
        }
      });

    return cy.get(selector).should('have.value', nilaiInput);
  }

  pilihDropdown(selector, teksPilihan, harusSamaPersis = true) {
    expect(teksPilihan, 'teksPilihan').to.be.a('string').and.not.be.empty;
    const escaped = Cypress._.escapeRegExp(teksPilihan);
    const cocok = harusSamaPersis
      ? new RegExp(`^\\s*${escaped}\\s*$`, 'i')
      : new RegExp(escaped, 'i');

    cy.get(selector, { timeout: 20000 })
      .should('have.length', 1)
      .and('be.visible')
      .and('not.be.disabled')
      .click();

    cy.get('[role="listbox"]', { timeout: 20000 })
      .filter(':visible')
      .should('have.length', 1)
      .find('[role="option"]')
      .filter((_, option) => cocok.test(option.textContent.trim()))
      .should(($options) => {
        expect($options, `opsi unik "${teksPilihan}"`).to.have.length(1);
      })
      .scrollIntoView()
      .should('be.visible')
      .click();

    return cy.get(selector).invoke('text').should('match', cocok);
  }

  pilihTanggal(fieldId, tanggal) {
    expect(tanggal, 'tanggal format YYYY-MM-DD')
      .to.match(/^\d{4}-\d{2}-\d{2}$/);
    const [tahun, bulan, hari] = tanggal.split('-').map(Number);
    const date = new Date(tahun, bulan - 1, hari);
    expect(
      date.getFullYear() === tahun
        && date.getMonth() === bulan - 1
        && date.getDate() === hari,
      `tanggal valid: ${tanggal}`
    ).to.eq(true);

    const trigger = `main button#${fieldId}`;
    cy.get(trigger).should('be.visible').and('not.be.disabled').click();

    cy.get('select[aria-label="Choose the Year"]')
      .should('have.length', 1)
      .and('not.be.disabled')
      .select(String(tahun));
    cy.get('select[aria-label="Choose the Month"]')
      .should('have.length', 1)
      .and('not.be.disabled')
      .select(String(bulan - 1));

    cy.get(`[role="gridcell"][data-day="${tanggal}"]`)
      .should('have.length', 1)
      .and('not.have.attr', 'data-disabled', 'true')
      .find('button')
      .should('have.length', 1)
      .and('be.visible')
      .and('not.be.disabled')
      .click();

    const tanggalTampil = `${String(hari).padStart(2, '0')}/${String(bulan).padStart(2, '0')}/${tahun}`;
    return cy.get(trigger).should('contain.text', tanggalTampil);
  }

  validasiWaktu(waktu, namaVariabel) {
    expect(waktu, `${namaVariabel} format HH:mm`)
      .to.match(/^([01]\d|2[0-3]):[0-5]\d$/);
  }
}

export default new KemhanBahasaJadwalUjianMasukPage();
