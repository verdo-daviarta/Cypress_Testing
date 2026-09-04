class BahasaTambahKelasPage {
  aksesMenuKelas() {
    cy.contains(
      'aside button[data-sidebar="menu-button"]',
      /^Kelas$/,
      { timeout: 20000 }
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
  }
}

export default new BahasaTambahKelasPage();
