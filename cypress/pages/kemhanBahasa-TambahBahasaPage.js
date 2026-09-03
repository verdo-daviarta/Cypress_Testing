class BahasaTambahBahasaPage {
  login() {
    cy.visit('https://akademik-ba.kemhan.go.id/');

    const username = Cypress.env('KEMHAN_USERNAME');
    const password = Cypress.env('KEMHAN_PASSWORD');

    expect(username, 'KEMHAN_USERNAME').to.be.a('string').and.not.be.empty;
    expect(password, 'KEMHAN_PASSWORD').to.be.a('string').and.not.be.empty;

    cy.get('input[name="username"]', { timeout: 20000 })
      .should('be.visible')
      .clear()
      .type(username);

    cy.get('input[name="password"]', { timeout: 20000 })
      .should('be.visible')
      .clear()
      .type(password);

    cy.contains('button', /Login/, { timeout: 20000 })
      .should('be.visible')
      .click();

    this.verifyOnDashboard();
  }

  verifyOnDashboard() {
    cy.url({ timeout: 20000 }).should('include', '/dasbor');
    cy.get('h2.text-xl.font-bold', { timeout: 20000 })
      .should('be.visible')
      .and('contain.text', 'Selamat datang di Sistem Informasi Akademik');
  }

  aksesMenuBahasa() {
    cy.contains('a, [data-sidebar="menu-button"]', /^Bahasa$/, { timeout: 20000 })
      .should('be.visible')
      .click();
    cy.url({ timeout: 20000 }).should('include', '/bahasa');
  }

  tambahBahasa() {
    cy.contains('button', /Tambah/, { timeout: 20000 })
      .should('be.visible')
      .click();

    this.dialog().should('be.visible');
  }

  inputNamaBahasa(namaBahasa) {
    this.dialog().find('input[data-slot="input"]')
      .should('be.visible')
      .clear()
      .type(namaBahasa);
  }

  pilihTipeBahasaKIBINA() {
    this.tipeBahasaDropdown()
      .should('be.visible')
      .click();

    cy.get('[role="listbox"]', { timeout: 20000 })
      .should('be.visible')
      .contains('[role="option"]', 'KIBINA', { matchCase: false })
      .should('be.visible')
      .click();

    this.tipeBahasaDropdown().should('contain.text', 'KIBINA');
  }

  tipeBahasaDropdown() {
    return this.dialog().find('button[role="combobox"]');
  }

  simpanBahasa() {
    this.dialog().contains('button', /Simpan/)
      .should('be.visible')
      .click();

    cy.get('[role="dialog"]', { timeout: 20000 }).should('not.exist');
  }

  dialog() {
    return cy.get('[role="dialog"]', { timeout: 20000 });
  }
}

export default new BahasaTambahBahasaPage();
