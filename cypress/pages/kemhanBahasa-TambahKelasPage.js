class BahasaTambahKelasPage {
login() {
    cy.visit('https://akademik-ba.kemhan.go.id/');

    const username = Cypress.env('KEMHAN_USERNAME');
    const password = Cypress.env('KEMHAN_PASSWORD');

    expect(username, 'KEMHAN_USERNAME').to.be.a('string').and.not.be.empty;
    expect(password, 'KEMHAN_PASSWORD').to.be.a('string').and.not.be.empty;

    cy.get('input[name="username"]', { timeout: 20000 })
      .should('be.visible')
      .clear()
      .type(username, { log: false });

    cy.get('input[name="password"]', { timeout: 20000 })
      .should('be.visible')
      .clear()
      .type(password, { log: false });

    cy.on('uncaught:exception', (error) => {
      const exceptionLoginDariSso =
        error.name === 'ReferenceError' &&
        error.message.includes('login is not defined');

      if (exceptionLoginDariSso) {
        return false;
      }

      return undefined;
    });

    cy.contains('button', /Login/, { timeout: 20000 })
      .should('be.visible')
      .click();
  }

  aksesMenuKelas() {
    cy.contains(
      'aside button[data-sidebar="menu-button"]',
      /^Kelas$/,
      { timeout: 60000 }
    )
      .scrollIntoView()
      .should('be.visible')
      .click();

    cy.url({ timeout: 20000 }).should('include', '/kelas');
  } 

  tambahKelas() {
    cy.get('main a[href="/kelas/tambah"]', { timeout: 20000 })
      .should('be.visible')
      .and('contain.text', 'Tambah')
      .click();

    cy.url({ timeout: 20000 }).should('include', '/kelas/tambah');
    this.bagianKelas('Informasi Kelas').should('be.visible');
  }

  pilihKursusAngkatan(namaKursus, namaAngkatan) {
    this.pilihDropdown('batchId', `${namaKursus} - ${namaAngkatan}`);
  }

  pilihClassMaster(namaClassMaster = 'class master') {
    this.pilihDropdown('classMasterId', namaClassMaster);
  }

  inputNilaiMinimal(nilaiMinimal) {
    this.isiInput('minimalScore', nilaiMinimal);
  }

  inputKapasitasSiswa(kapasitasSiswa) {
    this.isiInput('maxStudent', kapasitasSiswa);
  }

  inputNamaKelas(namaKelas) {
    this.isiInput('name', namaKelas);
  }

  tambahWidyaiswara() {
    this.bagianKelas('Widyaiswara')
      .contains('button', /^\s*Add\s*$/)
      .should('be.visible').click();
    cy.get('button[id="teachers[0].teacherId"]').should('be.visible');
  }

  pilihWidyaiswara(namaWidyaiswara = 'WI') {
    this.pilihDropdown('teachers[0].teacherId', namaWidyaiswara);
  }

  tambahSiswa() {
    // Tombol Add tersedia setelah kapasitas siswa diisi lebih dari nol.
    this.bagianKelas('Siswa')
      .contains('button', /^\s*Add\s*$/)
      .should('be.visible').click();
    cy.get('button[id="students[0].studentId"]').should('be.visible');
  }

  bagianKelas(namaBagian) {
    return cy.contains('main fieldset legend', namaBagian, { timeout: 20000 })
      .closest('fieldset');
  }

  isiInput(name, nilai) {
    const selector = `main input[name="${name}"]`;
    cy.get(selector).should('be.visible').clear()
      .type(String(nilai), { parseSpecialCharSequences: false });
    cy.get(selector).should('have.value', String(nilai));
  }

  pilihDropdown(fieldId, teksPilihan) {
    expect(teksPilihan, 'teks opsi dropdown').to.be.a('string').and.not.be.empty;
    const trigger = `button[id="${fieldId}"]`;
    const cocok = new RegExp(Cypress._.escapeRegExp(teksPilihan), 'i');
    cy.get(trigger).should('be.visible').click();

    // Popover dirender di luar main. Batasi ke listbox yang sedang terbuka.
    cy.get('[role="listbox"]', { timeout: 20000 })
      .filter(':visible')
      .should('have.length', 1)
      .find('[role="option"]')
      .filter((_, option) => cocok.test(option.textContent))
      .should(($opsi) => {
        expect($opsi, `opsi unik mengandung "${teksPilihan}"; gunakan nama lebih lengkap jika ambigu`)
          .to.have.length(1);
      })
      .scrollIntoView()
      .click();

    cy.get(trigger).invoke('text').should('match', cocok);
  }

    simpanKelas() {
    cy.contains('main button', /^Simpan$/)
      .should('be.visible').and('not.be.disabled').click();
  }

}

export default new BahasaTambahKelasPage();
