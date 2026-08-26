class KemhanBahasaSiswaPage {
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
      .type(username);

    cy.get('input[name="password"]', { timeout: 20000 })
      .should('be.visible')
      .clear()
      .type(password);

    cy.get('input[type="submit"], button[type="submit"]', { timeout: 20000 })
      .should('be.visible')
      .click();
  }

  verifyOnDashboard() {
    cy.url({ timeout: 20000 }).should('include', '/dasbor');
    cy.get('h2.text-xl.font-bold', { timeout: 20000 })
      .should('be.visible')
      .and('contain.text', 'Selamat datang di Sistem Informasi Siswa');
  }

  goToDashboard() {
    cy.contains('aside a, aside button', 'Dashboard', { matchCase: false })
      .filter(':visible')
      .first()
      .should('be.visible')
      .click({ force: true });
    this.verifyOnDashboard();
  }

  validasiAksesMenuLangsung(expectedPath, expectedBreadcrumb) {
    cy.visit(`https://siswa-ba.kemhan.go.id${expectedPath}`);
    cy.url({ timeout: 20000 }).should('include', expectedPath);
    cy.get('main', { timeout: 20000 })
      .should('be.visible')
      .should(($main) => {
        expect($main.text().toLowerCase()).to.include(expectedBreadcrumb.toLowerCase());
      });
  }

  validasiAksesMenu(namaMenu, expectedPath, expectedBreadcrumb, namaMenuParent = null) {
    if (namaMenuParent) {
      cy.contains('aside button', namaMenuParent, { matchCase: false })
        .filter(':visible')
        .first()
        .should('be.visible')
        .then(($parent) => {
          const isOpen = $parent.attr('data-state') === 'open'
            || $parent.attr('aria-expanded') === 'true';

          if (!isOpen) {
            cy.wrap($parent).click({ force: true });
          }
        });
    }

    cy.contains('aside a, aside button', namaMenu, { matchCase: false })
      .filter(':visible')
      .first()
      .should('be.visible')
      .click({ force: true });

    cy.url({ timeout: 20000 }).should('include', expectedPath);
    cy.get('main', { timeout: 20000 })
      .should('be.visible')
      .and('contain.text', expectedBreadcrumb);
  }
}

export default new KemhanBahasaSiswaPage();