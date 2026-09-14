class KemhanBahasaVerifikasiAkunPage {
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
  aksesMenuProfilCalonSiswa() {
    cy.contains('aside button', /^Profil Calon Siswa$/, { timeout: 50000 })
      .should('be.visible').click();
    cy.location('pathname').should('eq', '/calon');
    cy.get('main input[type="search"][placeholder="Cari Nama"]')
      .should('be.visible');
  }

  bukaDetailCalonSiswa(namaSiswa) {
    expect(namaSiswa, 'nama siswa setelah diperbaharui').to.be.a('string').and.not.be.empty;
    cy.get('main input[type="search"][placeholder="Cari Nama"]')
      .should('be.visible').clear()
      .type(namaSiswa, { parseSpecialCharSequences: false });

    // Tentukan kolom dari header Nama, bukan posisi baris atau kolom tetap.
    cy.get('main table', { timeout: 20000 }).should('have.length', 1)
      .should(($table) => {
        const headers = Array.from($table[0].querySelectorAll('thead th'));
        expect(headers.filter((header) => header.textContent.trim() === 'Nama'))
          .to.have.length(1);
      }).then(($table) => {
        const headers = Array.from($table[0].querySelectorAll('thead th'));
        const namaColumn = headers.findIndex((header) => header.textContent.trim() === 'Nama');
        cy.get('main table tbody tr', { timeout: 20000 })
          .filter((_, row) => row.cells[namaColumn]?.textContent.trim() === namaSiswa)
          // Berhenti jika nama duplikat agar tidak memverifikasi akun yang salah.
          .should('have.length', 1)
          .find('a[href^="/calon/detil/"]')
          .should('have.length', 1).should('be.visible').click();
      });

    cy.location('pathname', { timeout: 20000 })
      .should('match', /^\/calon\/detil\/[^/]+\/?$/);
    return this.pastikanNamaSiswa(namaSiswa);
  }

  pastikanNamaSiswa(namaSiswa) {
    expect(namaSiswa, 'nama siswa').to.be.a('string').and.not.be.empty;
    return cy.contains('main p', new RegExp(`^${Cypress._.escapeRegExp(namaSiswa)}$`), {
      timeout: 20000,
    }).should('be.visible');
  }

  verifikasiAkun(namaSiswa) {
    // Periksa identitas lagi sebelum mengubah status akun.
    this.pastikanNamaSiswa(namaSiswa);
    return cy.contains('main button', /^Verifikasi$/, { timeout: 20000 })
      .should('be.visible').and('not.be.disabled').click();
  }
}

export default new KemhanBahasaVerifikasiAkunPage();
