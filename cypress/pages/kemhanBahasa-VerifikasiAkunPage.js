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
    const menu = 'aside button[data-sidebar="menu-button"]';
    cy.contains(menu, /^Profil Calon Siswa$/, { timeout: 50000 })
      .should('be.visible');
    // Query ulang karena sidebar render ulang sesaat setelah login.
    cy.contains(menu, /^Profil Calon Siswa$/, { timeout: 50000 }).click();
    cy.location('pathname').should('eq', '/calon');
    cy.get('input[placeholder="Cari Nama"]', { timeout: 20000 }).should('be.visible');
  }

  cariNamaSiswa(namaSiswa) {
    expect(namaSiswa, 'nama siswa').to.be.a('string').and.not.be.empty;
    cy.get('input[placeholder="Cari Nama"]')
      .clear()
      .type(namaSiswa, { parseSpecialCharSequences: false })
      .should('have.value', namaSiswa);
  }

  pastikanNamaSiswaDitemukan(namaSiswa) {
    expect(namaSiswa, 'nama siswa').to.be.a('string').and.not.be.empty;
    return cy.get('main table tbody tr', { timeout: 20000 })
      .filter((_, row) => row.cells[1]?.textContent.trim() === namaSiswa)
      .should('have.length', 1)
      .as('barisSiswa');
  }

  bukaDetailSiswa() {
    cy.get('@barisSiswa')
      .find('td:last-child')
      .scrollIntoView()
      .should('be.visible');

    // Query ulang setelah horizontal scroll agar Cypress memakai posisi terbaru.
    return cy.get('@barisSiswa')
      .find('td:last-child a[href^="/calon/detil/"]')
      .should('have.length', 1)
      .scrollIntoView()
      .should('be.visible')
      .click()
      .then(() => {
        cy.location('pathname', { timeout: 20000 })
          .should('match', /^\/calon\/detil\/[^/]+\/?$/);
        // Aplikasi kadang hanya mengubah URL tanpa merender halaman Detail.
        // Reload URL hasil klik agar konten Detail benar-benar dimuat.
        cy.reload();
        cy.contains('main button', 'Verifikasi', { timeout: 20000 }).should('be.visible');
      });
  }

  verifikasiAkun() {
    cy.contains('main button', 'Verifikasi', { timeout: 20000 })
      .should('be.visible').and('not.be.disabled');
    return cy.contains('main button', 'Verifikasi', { timeout: 20000 }).click();
  }

  konfirmasiVerifikasiAkun() {
    cy.get('.flex-col-reverse > .bg-foreground', { timeout: 20000 })
      .should('be.visible').and('not.be.disabled').click();
  }
}

export default new KemhanBahasaVerifikasiAkunPage();
