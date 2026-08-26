class KemhanBahasaAkademikPage {
  visit() {
    cy.visit('https://akademik-ba.kemhan.go.id/');
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

    cy.get('form').invoke('removeAttr', 'onsubmit');
    cy.contains('button', 'Login', { timeout: 20000 })
      .should('be.visible')
      .invoke('click');
  }

  verifyOnDashboard() {
    cy.url({ timeout: 20000 }).should('include', '/dasbor');
    cy.get('h2.text-xl.font-bold', { timeout: 20000 })
      .should('be.visible')
      .and('contain.text', 'Selamat datang di Sistem Informasi Akademik');
  }

  goToDashboard() {
    this.sidebarMenu('Dashboard')
      .filter(':visible')
      .first()
      .should('be.visible')
      .click({ force: true });
    cy.url({ timeout: 20000 }).should('include', '/dasbor');
  }

  validasiAksesMenuLangsung(expectedPath, expectedBreadcrumb) {
    cy.visit(`https://akademik-ba.kemhan.go.id${expectedPath}`);
    cy.url({ timeout: 20000 }).should('include', expectedPath);
    cy.get('main', { timeout: 20000 })
      .should('be.visible')
      .should(($main) => {
        expect($main.text().toLowerCase()).to.include(expectedBreadcrumb.toLowerCase());
      });
  }

  validasiAksesMenu(namaMenu, expectedPath, expectedBreadcrumb, namaMenuParent = null) {
    if (namaMenuParent) {
      this.sidebarMenu(namaMenuParent)
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

    cy.get('body', { timeout: 20000 }).should('contain.text', namaMenu);
    this.sidebarMenu(namaMenu)
      .filter(':visible')
      .first()
      .should('be.visible')
      .click({ force: true });

    cy.url({ timeout: 20000 }).should('include', expectedPath);
    cy.get('main', { timeout: 20000 })
      .should('be.visible')
      .should(($main) => {
        expect($main.text().toLowerCase()).to.include(expectedBreadcrumb.toLowerCase());
      });
  }

  sidebarMenu(namaMenu) {
    return cy.get('a, [data-sidebar="menu-button"]', { timeout: 20000 })
      .should(($buttons) => {
        const menuExists = [...$buttons].some((button) =>
          button.innerText.trim().toLowerCase() === namaMenu.toLowerCase()
        );

        expect(menuExists, `menu sidebar '${namaMenu}'`).to.be.true;
      })
      .then(($buttons) => {
        const menuButton = [...$buttons].find((button) =>
          button.innerText.trim().toLowerCase() === namaMenu.toLowerCase()
        );

        return cy.wrap(menuButton).scrollIntoView().should('be.visible');
      });
  }
}

export default new KemhanBahasaAkademikPage();