class KemhanBahasaTambahSiswaPage {
  visit() {
    cy.visit('https://siswa-ba.kemhan.go.id/');
  }

  login() {
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

    cy.get('input[type="submit"], button[type="submit"]', { timeout: 20000 })
      .should('be.visible')
      .click();
  }
  aksesMenuGenerateAkun() {
    cy.contains('aside button', /^Generate Akun$/, { timeout: 50000 })
      .should('be.visible').click();
    cy.location('pathname').should('eq', '/generate');
    cy.get('main input[name="name"]').should('be.visible');
  }

  inputNamaSiswa(namaSiswa) {
    expect(namaSiswa).to.be.a('string').and.not.be.empty;
    cy.get('main input[name="name"]').should('be.visible').clear()
      .type(namaSiswa, { parseSpecialCharSequences: false });
    cy.get('main input[name="name"]').should('have.value', namaSiswa);
  }

  inputJumlahSiswa(jumlahSiswa) {
    expect(Number.isInteger(jumlahSiswa) && jumlahSiswa > 0, 'jumlah siswa bilangan bulat positif').to.eq(true);
    cy.get('main input[name="numStudent"]').should('be.visible').clear()
      .type(String(jumlahSiswa));
    cy.get('main input[name="numStudent"]').should('have.value', String(jumlahSiswa));
  }

  pilihTipeSiswa(tipeSiswa) {
    expect(tipeSiswa).to.be.oneOf(['Internasional', 'Nasional', 'DIKLN']);
    cy.contains('main button[role="combobox"]', /Pilih Tipe Siswa|Internasional|Nasional|DIKLN/)
      .should('be.visible').click();
    cy.contains('[role="option"]', new RegExp(`^${tipeSiswa}$`))
      .should('be.visible').click();
    cy.get('main select[name="profileType"]').should('have.value', tipeSiswa);
  }

  generateAkun() {
    return cy.task('snapshotGenerateDownloads', null, { log: false }).then((sebelum) => {
      cy.contains('main button', /^Generate Akun$/)
        .should('be.visible').and('not.be.disabled').click();
      return cy.task('waitForGenerateDownload', sebelum, { timeout: 65000, log: false });
    }).then((filePath) => {
      // Isi dokumen akun tidak ditampilkan dalam Command Log.
      return cy.readFile(filePath, null, { log: false }).should((isi) => {
        expect(isi.length, 'dokumen hasil generate tidak kosong').to.be.greaterThan(0);
      }).then(() => filePath);
    });
  }
}

export default new KemhanBahasaTambahSiswaPage();
